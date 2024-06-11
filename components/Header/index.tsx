'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import LanguageSelector from './LanguageSelector';
import {
  CookieNoticeRecord,
  LayoutModelNotificationField,
  LayoutQuery,
  PopupRecord,
} from '@/graphql/types/graphql';
import NotificationStrip from './NotificationStrip';
import { isEmptyDocument } from 'datocms-structured-text-utils';
import CategoryHeader from './CategoryHeader';
import PopUpBanner from './PopUpBanner';
import CookiesNotice from './CookiesNotice';
import { GlobalPageProps } from '@/utils/globalPageProps';

type Props = {
  data: LayoutQuery;
  globalPageProps: GlobalPageProps;
};

const Header = ({ data, globalPageProps }: Props) => {
  // Navbar toggle
  const [notificationStrip, setNotificationStrip] = useState(
    !isEmptyDocument(data.layout?.notification)
  );

  const [popUp, setPopUp] = useState(!!data.layout?.popup);

  const [cookies, setCookies] = useState(!!data.layout?.cookieNotice);

  return (
    <>
      {popUp && (
        <PopUpBanner
          globalPageProps={globalPageProps}
          setPopUp={setPopUp}
          popup={data.layout!.popup as PopupRecord}
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
