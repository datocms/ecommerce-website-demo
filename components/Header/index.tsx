'use client';

/**
 * Top-of-page header composition. Wires notification strip,
 * popup banner, cookie notice, the main category header, and locale handling.
 */
import { isEmptyDocument } from 'datocms-structured-text-utils';
import { Suspense, useState } from 'react';
import type {
  CookieNoticeRecord,
  LayoutModelNotificationField,
  LayoutQuery,
  PopupRecord,
} from '@/graphql/types/graphql';
import type { GlobalPageProps } from '@/utils/globalPageProps';
import CategoryHeader from './CategoryHeader';
import CookiesNotice from './CookiesNotice';
import NotificationStrip from './NotificationStrip';
import PopUpBanner from './PopUpBanner';

export type Props = {
  /** Layout query containing menus, general interface and assets. */
  data: LayoutQuery;
  /** Locale-aware page props. */
  globalPageProps: GlobalPageProps;
};

/** Compose header UI blocks and conditionally render them from CMS data. */
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
          layoutEditingUrl={
            ((data.layout as { _editingUrl?: string | null } | null) ?? null)
              ?._editingUrl ?? null
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
