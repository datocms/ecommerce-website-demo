'use client';

import { isEmptyDocument } from 'datocms-structured-text-utils';
import type { Query as LayoutQuery } from '@/app/[lng]/(site)/meta';
import type { ResolvedGlobalPageProps } from '@/lib/globalPageProps';
import {
  announcementId,
  dismissAnnouncement,
  useAnnouncementDismissed,
} from './announcement';
import NavBar from './NavBar';
import NotificationStrip from './NotificationStrip';

type Props = {
  data: LayoutQuery;
  globalPageProps: ResolvedGlobalPageProps;
};

export default function Header({ data, globalPageProps }: Props) {
  const { lng } = globalPageProps.params;
  const notification = data.layout?.notification;
  const notificationId = announcementId(data.layout?._allNotificationLocales);
  const dismissed = useAnnouncementDismissed(notificationId);

  return (
    <>
      {notification && !isEmptyDocument(notification) && !dismissed && (
        <NotificationStrip
          id={notificationId}
          notification={notification}
          lng={lng}
          dismissLabel={data.generalInterface?.dismissAnnouncement}
          onDismiss={() => dismissAnnouncement(notificationId)}
        />
      )}
      {/* No Suspense boundary, so the bar is in the server HTML; NavBar and LanguageSelector
          wrap their useSearchParams parts themselves */}
      <NavBar globalPageProps={globalPageProps} data={data} />
    </>
  );
}
