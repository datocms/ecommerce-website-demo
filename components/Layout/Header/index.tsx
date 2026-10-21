'use client';

import { isEmptyDocument } from 'datocms-structured-text-utils';
import { Suspense, useEffect, useState } from 'react';
import type { Query as LayoutQuery } from '@/app/[lng]/meta';
import { useCookieNoticeOpen } from '@/components/Layout/CookieNotice';
import type { ResolvedGlobalPageProps } from '@/lib/globalPageProps';
import NavBar from './NavBar';
import NotificationStrip from './NotificationStrip';
import PopupDialog from './PopupDialog';

type Props = {
  data: LayoutQuery;
  globalPageProps: ResolvedGlobalPageProps;
};

// Kept outside React so a dismissal survives the [lng] layout remounting on a locale switch;
// a full reload shows it again
const dismissed = { strip: false, popup: false };

export default function Header({ data, globalPageProps }: Props) {
  const notification = data.layout?.notification;
  const popup = data.layout?.popup;

  const [showStrip, setShowStrip] = useState(
    !dismissed.strip && !isEmptyDocument(notification),
  );

  // The cookie bar itself is rendered by the footer, right after it
  const cookieNoticeOpen = useCookieNoticeOpen();
  const cookieNoticeVisible = cookieNoticeOpen && !!data.layout?.cookieNotice;

  // The popup opens 600ms after the cookie notice is gone (or after load when there is none)
  const [popupState, setPopupState] = useState<'waiting' | 'open' | 'closed'>(
    dismissed.popup ? 'closed' : 'waiting',
  );
  const hasPopup = !!popup;

  useEffect(() => {
    if (!hasPopup || cookieNoticeVisible || popupState !== 'waiting') return;
    const timer = window.setTimeout(() => setPopupState('open'), 600);
    return () => window.clearTimeout(timer);
  }, [hasPopup, cookieNoticeVisible, popupState]);

  return (
    <>
      {showStrip && notification && (
        <NotificationStrip
          notification={notification}
          globalPageProps={globalPageProps}
          onDismiss={() => {
            dismissed.strip = true;
            setShowStrip(false);
          }}
        />
      )}
      <Suspense>
        <NavBar globalPageProps={globalPageProps} data={data} />
      </Suspense>

      {popup && (
        <PopupDialog
          globalPageProps={globalPageProps}
          open={popupState === 'open'}
          onClose={() => {
            dismissed.popup = true;
            setPopupState('closed');
          }}
          popup={popup}
        />
      )}
    </>
  );
}
