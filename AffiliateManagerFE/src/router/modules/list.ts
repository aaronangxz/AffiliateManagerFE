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
        path: 'affiliates/referrals',
        Component: lazy(() => import('pages/List/AffiliateReferralList')),
        meta: { title: "Affiliate's Referrals" },
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
