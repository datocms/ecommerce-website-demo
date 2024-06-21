'use client';

import type {
  CookieNoticeRecord,
  LayoutModelNotificationField,
  LayoutQuery,
  PopupRecord,
} from '@/graphql/types/graphql';
import type { GlobalPageProps } from '@/utils/globalPageProps';
import { isEmptyDocument } from 'datocms-structured-text-utils';
import { Suspense, useState } from 'react';
import CategoryHeader from './CategoryHeader';
import CookiesNotice from './CookiesNotice';
import NotificationStrip from './NotificationStrip';
import PopUpBanner from './PopUpBanner';

type Props = {
  data: LayoutQuery;
  globalPageProps: GlobalPageProps;
};

const Header = ({ data, globalPageProps }: Props) => {
  // Navbar toggle
  const [notificationStrip, setNotificationStrip] = useState(
    !isEmptyDocument(data.layout?.notification),
  );

  const [popUp, setPopUp] = useState(!!data.layout?.popup);

  const [cookies, setCookies] = useState(!!data.layout?.cookieNotice);

  return (
    <>
      {popUp && (
        <PopUpBanner
          globalPageProps={globalPageProps}
          setPopUp={setPopUp}
          popup={data.layout?.popup as PopupRecord}
        />
      )}

      {cookies && (
        <CookiesNotice
          cookieNotice={data.layout?.cookieNotice as CookieNoticeRecord}
          setCookies={setCookies}
        />
      )}

      {notificationStrip && (
        <NotificationStrip
          notification={
            data.layout?.notification as LayoutModelNotificationField
          }
          globalPageProps={globalPageProps}
          setNotificationStrip={setNotificationStrip}
        />
      )}
      <Suspense>
        <CategoryHeader
          globalPageProps={globalPageProps}
          languages={data._site.locales}
          data={data}
        />
      </Suspense>
    </>
  );
};

export default Header;
