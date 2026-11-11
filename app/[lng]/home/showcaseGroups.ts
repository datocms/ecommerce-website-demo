import { CollectionCardShowcaseFragment } from '@/components/Sections/CollectionCardShowcase/fragments';
import { type FragmentOf, readFragment } from '@/lib/datocms/graphql';
import { linkHref } from '@/lib/datocms/linkHref';
import type { Query } from './meta';

type Section = NonNullable<Query['home']>['sections'][number];
type CollectionCardShowcaseSection = Extract<
  Section,
  { __typename: 'CollectionCardShowcaseSectionRecord' }
>;
type Menu = NonNullable<Query['layout']>['menu'];

// Consecutive collection card showcases render as one group of showcase columns
export function groupCollectionCardShowcases(sections: Section[]) {
  const groups: (Section | CollectionCardShowcaseSection[])[] = [];
  for (const section of sections) {
    const last = groups[groups.length - 1];
    if (section.__typename !== 'CollectionCardShowcaseSectionRecord') {
      groups.push(section);
    } else if (Array.isArray(last)) {
      last.push(section);
    } else {
      groups.push([section]);
    }
  }
  return groups;
}

// The group's title: the header dropdown column ("Seasons") that lists most of its lead collections
export function showcaseGroupTitle(
  menu: Menu,
  showcases: FragmentOf<typeof CollectionCardShowcaseFragment>[],
) {
  const leads = showcases.flatMap((section) => {
    const lead = readFragment(CollectionCardShowcaseFragment, section)
      .collection[0];
    return lead ? [lead.id] : [];
  });
  let best: { label: string; matches: number } | undefined;
  for (const entry of menu) {
    if (entry.__typename !== 'DropdownMenuRecord') continue;
    for (const column of entry.column) {
      const ids = new Set(column.item.map((item) => item.id));
      const matches = leads.filter((lead) => ids.has(lead)).length;
      if (matches > (best?.matches ?? 0)) {
        best = { label: column.label, matches };
      }
    }
  }
  return best?.label;
}

// The group's link to the catalog, with the header's own label for it ("All products")
export function catalogLinkAction(menu: Menu, lng: string) {
  const href = `/${lng}/products`;
  const catalogLink = menu.find(
    (entry) =>
      entry.__typename === 'LinkItemRecord' && linkHref(lng, entry) === href,
  );
  return catalogLink?.__typename === 'LinkItemRecord'
    ? { label: catalogLink.label, href }
    : undefined;
}
