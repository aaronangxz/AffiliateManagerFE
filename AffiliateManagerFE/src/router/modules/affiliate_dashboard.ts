import { lazy } from 'react';
import { DashboardIcon } from 'tdesign-icons-react';
import { IRouter } from '../index';

const affiliateDashboard: IRouter[] = [
  {
    path: '/data',
    meta: {
      title: 'Data Compass',
      Icon: DashboardIcon,
    },
    children: [
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

export default affiliateDashboard;
