import { lazy } from 'react';
import { DashboardIcon } from 'tdesign-icons-react';
import { IRouter } from '../index';

const dashboard: IRouter[] = [
  {
    path: '/dashboard',
    meta: {
      title: 'Data Compass',
      Icon: DashboardIcon,
    },
    children: [
      {
        path: 'affiliate/stats',
        Component: lazy(() => import('pages/AffiliateAnalytics/Base')),
        meta: {
          title: 'Affiliate Analytics',
        },
      },
      {
        path: 'referral/stats',
        Component: lazy(() => import('pages/ReferralAnalytics/Base')),
        meta: {
          title: 'Referral Analytics',
        },
      },
    ],
  },
];

export default dashboard;
