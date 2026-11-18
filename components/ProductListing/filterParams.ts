// The catalog's filter params: one per group, its ids joined with '|' (`?brands=<id>|<id>`).

export type FilterKey = 'collections' | 'materials' | 'brands';

const SEPARATOR = '|';

export const splitIds = (param: string) =>
  param.split(SEPARATOR).filter(Boolean);

export const joinIds = (ids: string[]) => ids.join(SEPARATOR);

/** A group narrows the listing unless every option is on. */
export const isNarrowed = (selectedIds: string[], options: { id: string }[]) =>
  options.some((option) => !selectedIds.includes(option.id));
