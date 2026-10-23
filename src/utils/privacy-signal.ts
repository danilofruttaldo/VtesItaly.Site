/** Browser privacy signals the stats honour, as the privacy page promises. */
type SignalNavigator = Navigator & { globalPrivacyControl?: boolean };

/** Global Privacy Control: the signal browsers send now that Firefox has
 *  dropped Do Not Track. Matomo reads only DNT, so matomo.ts checks this. */
export function sendsGpc(nav: SignalNavigator = navigator): boolean {
  return nav.globalPrivacyControl === true;
}

/** Do Not Track or GPC: the visitor is never counted. */
export function sendsPrivacySignal(nav: SignalNavigator = navigator): boolean {
  return nav.doNotTrack === '1' || sendsGpc(nav);
}
