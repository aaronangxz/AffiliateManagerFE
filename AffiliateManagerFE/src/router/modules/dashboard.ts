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
        path: 'stats',
        Component: lazy(() => import('pages/Dashboard/Base')),
        meta: {
          title: 'Affiliate Analytics',
        },
      },
      // {
      //   path: 'detail',
      //   Component: lazy(() => import('pages/Dashboard/Detail')),
      //   meta: {
      //     title: '统计报表',
      //   },
      // },
    ],
  },
];

export default dashboard;
