'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

type Props = {
  code: string;
};

// An inline script that exists in the server HTML only, to run before the first paint. On the
// client React would create a <script> that never runs (and warns about it), so it renders nothing.
export default function ServerOnlyScript({ code }: Props) {
  const isServerHtml = useSyncExternalStore(
    subscribe,
    () => false,
    () => true,
  );

  return isServerHtml ? (
    <script dangerouslySetInnerHTML={{ __html: code }} />
  ) : null;
}
