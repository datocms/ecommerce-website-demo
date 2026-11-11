'use client';

import { isEmptyDocument } from 'datocms-structured-text-utils';
import { useEffect, useState } from 'react';
import type { Query as LayoutQuery } from '@/app/[lng]/meta';
import { useCookieNoticeDismissed } from '@/components/Layout/cookieNoticeStore';
import type { ResolvedGlobalPageProps } from '@/lib/globalPageProps';
import NavBar from './NavBar';
import NotificationStrip from './NotificationStrip';
import PopupDialog from './PopupDialog';

type Props = {
  data: LayoutQuery;
  globalPageProps: ResolvedGlobalPageProps;
};

const POPUP_DELAY_MS = 600;

// Outside React, so a dismissal survives the [lng] layout remounting on a locale switch
const dismissedThisSession = { strip: false, popup: false };

export default function Header({ data, globalPageProps }: Props) {
  const { lng } = globalPageProps.params;
  const notification = data.layout?.notification;
  const popup = data.layout?.popup;

  const [showStrip, setShowStrip] = useState(
    !dismissedThisSession.strip && !isEmptyDocument(notification),
  );

  // The cookie bar itself is rendered by the footer
  const cookieNoticeDismissed = useCookieNoticeDismissed();
  const cookieNoticeVisible =
    !!data.layout?.cookieNotice && !cookieNoticeDismissed;

  // The popup opens 600ms after the cookie notice is gone (or after load when there is none)
  const [popupState, setPopupState] = useState<'waiting' | 'open' | 'closed'>(
    dismissedThisSession.popup ? 'closed' : 'waiting',
  );
  const hasPopup = !!popup;

  useEffect(() => {
    if (!hasPopup || cookieNoticeVisible || popupState !== 'waiting') return;
    const timer = window.setTimeout(
      () => setPopupState('open'),
      POPUP_DELAY_MS,
    );
    return () => window.clearTimeout(timer);
  }, [hasPopup, cookieNoticeVisible, popupState]);

  return (
    <>
      {showStrip && notification && (
        <NotificationStrip
          notification={notification}
          lng={lng}
          onDismiss={() => {
            dismissedThisSession.strip = true;
            setShowStrip(false);
          }}
        />
      )}
      {/* No Suspense boundary, so the bar is in the server HTML; NavBar and LanguageSelector
          wrap their useSearchParams parts themselves */}
      <NavBar globalPageProps={globalPageProps} data={data} />

      {popup && (
        <PopupDialog
          lng={lng}
          open={popupState === 'open'}
          onClose={() => {
            dismissedThisSession.popup = true;
            setPopupState('closed');
          }}
          popup={popup}
        />
      )}
    </>
  );
}
