'use client';

import { isEmptyDocument } from 'datocms-structured-text-utils';
import { Suspense, useEffect, useState } from 'react';
import type { Query as LayoutQuery } from '@/app/[lng]/meta';
import type { ResolvedGlobalPageProps } from '@/utils/globalPageProps';
import CategoryHeader from './CategoryHeader';
import { useCookieNoticeOpen } from './CookiesNotice';
import NotificationStrip, {
  type LayoutNotification,
} from './NotificationStrip';
import PopUpBanner, { type Popup } from './PopUpBanner';

type Props = {
  data: LayoutQuery;
  globalPageProps: ResolvedGlobalPageProps;
};

// The [lng] layout remounts on a locale switch: dismissals last for the page load
const dismissed = { strip: false, popUp: false };

const Header = ({ data, globalPageProps }: Props) => {
  const [notificationStrip, setNotificationStrip] = useState(
    !dismissed.strip && !isEmptyDocument(data.layout?.notification),
  );

  // The cookie bar itself is rendered by the footer, right after it
  const cookieNoticeOpen = useCookieNoticeOpen();
  const cookies = cookieNoticeOpen && !!data.layout?.cookieNotice;

  // The popup waits for the cookie notice: it opens 600ms after that is dismissed
  const [popUp, setPopUp] = useState<'waiting' | 'open' | 'closed'>(
    dismissed.popUp ? 'closed' : 'waiting',
  );
  const hasPopup = !!data.layout?.popup;

  useEffect(() => {
    if (!hasPopup || cookies || popUp !== 'waiting') return;
    const timer = window.setTimeout(() => setPopUp('open'), 600);
    return () => window.clearTimeout(timer);
  }, [hasPopup, cookies, popUp]);

  return (
    <>
      {notificationStrip && (
        <NotificationStrip
          notification={data.layout?.notification as LayoutNotification}
          globalPageProps={globalPageProps}
          onDismiss={() => {
            dismissed.strip = true;
            setNotificationStrip(false);
          }}
        />
      )}
      <Suspense>
        <CategoryHeader
          globalPageProps={globalPageProps}
          languages={data._site.locales}
          data={data}
        />
      </Suspense>

      {hasPopup && (
        <PopUpBanner
          globalPageProps={globalPageProps}
          open={popUp === 'open'}
          onClose={() => {
            dismissed.popUp = true;
            setPopUp('closed');
          }}
          popup={data.layout?.popup as Popup}
        />
      )}
    </>
  );
};

export default Header;
