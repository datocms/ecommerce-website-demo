// The announcement strip remembers its dismissal in localStorage, by a fingerprint of the message.
// On load, an inline script copies that fingerprint onto <html> before the first paint, and the
// strip hides itself by it, so a dismissed strip never flashes.

export const DISMISSED_ANNOUNCEMENT_KEY = 'dismissed-announcement';

/** Inline script for the root layout */
export const RESTORE_DISMISSED_ANNOUNCEMENT = `try{document.documentElement.dataset.dismissedAnnouncement=localStorage.getItem(${JSON.stringify(DISMISSED_ANNOUNCEMENT_KEY)})??''}catch{}`;

/** CSS that hides `selector` while the announcement with this id is the dismissed one */
export const hideWhenDismissed = (id: string, selector: string) =>
  `:root[data-dismissed-announcement=${JSON.stringify(id)}] ${selector}{display:none}`;
