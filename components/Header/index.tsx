'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import LanguageSelector from './LanguageSelector';
import {
  CookieNoticeRecord,
  LayoutModelNotificationField,
  MenuQuery,
  PopupRecord,
  SiteLocale,
} from '@/graphql/generated';
import NotificationStrip from './NotificationStrip';
import { Menu } from './HeaderRenderer';
import { isEmptyDocument } from 'datocms-structured-text-utils';
import CategoryHeader from './CategoryHeader';
import PopUpBanner from './PopUpBanner';
import CookiesNotice from './CookiesNotice';

type Props = {
  lng: SiteLocale;
  data: MenuQuery;
};

const Header = ({ lng, data }: Props) => {
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
          lng={lng}
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
          lng={lng}
          setNotificationStrip={setNotificationStrip}
        />
      )}

      <CategoryHeader lng={lng} languages={data._site.locales} data={data} />
    </>
  );
};

export default Header;
