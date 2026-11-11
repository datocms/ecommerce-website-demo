import { splitIds } from '@/components/ProductListing/filterParams';
import type { FilterRecord } from '@/components/ProductListing/fragments';

// A missing param means every option; an empty one means none
export const selectedIds = (
  param: string | undefined,
  options: { id: string }[],
) =>
  param === undefined ? options.map((option) => option.id) : splitIds(param);

// A lone selected material, collection or brand (checked in that order) gets a FilterDetail
// header, and names the page
export function pickHeaderFilter(
  selected: { materials: string[]; collections: string[]; brands: string[] },
  options: {
    allMaterials: FilterRecord[];
    allCollections: FilterRecord[];
    allBrands: FilterRecord[];
  },
) {
  if (selected.materials.length === 1) {
    return options.allMaterials.find(
      (material) => material.id === selected.materials[0],
    );
  }
  if (selected.collections.length === 1) {
    return options.allCollections.find(
      (collection) => collection.id === selected.collections[0],
    );
  }
  if (selected.brands.length === 1) {
    return options.allBrands.find((brand) => brand.id === selected.brands[0]);
  }
  return undefined;
}
