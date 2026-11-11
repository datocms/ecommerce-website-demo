import type { ResultOf } from '@/lib/datocms/graphql';
import type { CollectionCardShowcaseFragment } from './fragments';

export type Collection = ResultOf<
  typeof CollectionCardShowcaseFragment
>['collection'][number];
