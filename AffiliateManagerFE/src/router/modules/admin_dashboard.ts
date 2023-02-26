import { lazy } from 'react';
import { DashboardIcon } from 'tdesign-icons-react';
import { IRouter } from '../index';

const adminDashboard: IRouter[] = [
  {
    path: '/data',
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
    ],
  },
];

export default adminDashboard;
