'use client';

import 'leaflet/dist/leaflet.css';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';
import type { Map as LeafletMap, Marker } from 'leaflet';
import { type Ref, useEffect, useRef } from 'react';
import type { Query } from './meta';

type Props = {
  ref?: Ref<HTMLElement>;
  stores: Query['allStores'];
  /** Zero-based index of the store on show */
  current: number;
  onSelect: (index: number) => void;
  /** General interface "Stores" label, naming the map for screen readers */
  label: string | undefined;
  /** General interface "View on map" label, for the link to the store's address */
  findOnMaps: string | null | undefined;
  /** The store's address on an external map */
  mapsHref: string | null;
};

// OpenStreetMap's own tiles: no key, attribution required, meant for light traffic. For a busy
// site, point these two at a commercial tile provider. styles/map.css turns the tiles grey.
const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// The map opens on the current store's region and moves to city level once a store is picked
const REGION_ZOOM = 5;
const CITY_ZOOM = 12;
// Leaflet loads when the map is within this distance of the viewport
const LOAD_MARGIN = '100px';

export default function StoreMap({
  ref,
  stores,
  current,
  onSelect,
  label,
  findOnMaps,
  mapsHref,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<(Marker | null)[]>([]);
  // Read by the setup effect without making it run again
  const latest = useRef({ current, onSelect });
  latest.current = { current, onSelect };

  // biome-ignore lint/correctness/useExhaustiveDependencies: the map is built once; the next effect follows `current`
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let cancelled = false;

    const build = async () => {
      const { default: L } = await import('leaflet');
      if (cancelled) return;
      const location = stores[latest.current.current]?.storeLocation;
      const map = L.map(container, {
        center: location ? [location.latitude, location.longitude] : [48, 8],
        zoom: REGION_ZOOM,
        // The page scrolls past the map: zooming is left to the buttons and to pinching
        scrollWheelZoom: false,
        dragging: !L.Browser.mobile,
        attributionControl: false,
      });
      L.control.attribution({ prefix: false }).addTo(map);
      L.tileLayer(TILE_URL, {
        attribution: TILE_ATTRIBUTION,
        maxZoom: 19,
      }).addTo(map);

      markersRef.current = stores.map((store, index) => {
        if (!store.storeLocation) return null;
        const { latitude, longitude } = store.storeLocation;
        const marker = L.marker([latitude, longitude], {
          icon: L.divIcon({
            className: 'store-pin',
            html: '<span></span>',
            iconSize: [28, 28],
          }),
          title: store.storeName,
          alt: store.storeName,
        }).addTo(map);
        marker.on('click', () => latest.current.onSelect(index));
        marker
          .getElement()
          ?.toggleAttribute('data-current', index === latest.current.current);
        return marker;
      });
      mapRef.current = map;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        build();
      },
      { rootMargin: LOAD_MARGIN },
    );
    observer.observe(container);

    return () => {
      cancelled = true;
      observer.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Follows the store on show
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markersRef.current.forEach((marker, index) => {
      marker?.getElement()?.toggleAttribute('data-current', index === current);
      marker?.setZIndexOffset(index === current ? 1000 : 0);
    });
    const location = stores[current]?.storeLocation;
    if (!location) return;
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    map.flyTo([location.latitude, location.longitude], CITY_ZOOM, {
      animate: !reduceMotion,
      duration: 1.4,
    });
  }, [current, stores]);

  const store = stores[current];

  return (
    <section ref={ref} aria-label={label} className="shell pt-16 lg:pt-24">
      <div className="relative">
        <div
          ref={containerRef}
          className="store-map h-[26rem] bg-mist md:h-[32rem]"
        />
        {store && (
          <div
            aria-live="polite"
            className="absolute bottom-4 left-4 z-10 max-w-[calc(100%-2rem)] bg-white p-5 sm:min-w-64"
          >
            <p className="eyebrow">{store.country}</p>
            <p className="title-item mt-1">{store.storeName}</p>
            {mapsHref && (
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="tlink mt-3 text-sm"
              >
                {findOnMaps}
                <ArrowUpRightIcon aria-hidden="true" className="stroke-2" />
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
