import { lazy } from 'react';
import { ViewModuleIcon } from 'tdesign-icons-react';
import { IRouter } from '../index';

const result: IRouter[] = [
  {
    path: '/list',
    meta: {
      title: 'List',
      Icon: ViewModuleIcon,
    },
    children: [
      // {
      //   path: 'base',
      //   Component: lazy(() => import('pages/List/Base')),
      //   meta: {
      //     title: '基础列表页',
      //   },
      // },
      // {
      //   path: 'card',
      //   Component: lazy(() => import('pages/List/Card')),
      //   meta: {
      //     title: '卡片列表页',
      //   },
      // },
      {
        path: 'affiliates',
        Component: lazy(() => import('pages/List/AffiliateList')),
        meta: { title: 'Affiliates' },
      },
      {
        path: 'referrals',
        Component: lazy(() => import('pages/List/ReferralList')),
        meta: { title: 'Referrals' },
      },
      {
        path: 'bookings',
        Component: lazy(() => import('pages/List/BookingList')),
        meta: { title: 'Bookings' },
      },
    ],
  },
];

export default result;
