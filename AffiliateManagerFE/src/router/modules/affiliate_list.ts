import { lazy } from 'react';
import { ViewModuleIcon } from 'tdesign-icons-react';
import { IRouter } from '../index';

const affiliateLists: IRouter[] = [
  {
    path: '/list',
    meta: {
      title: 'List',
      Icon: ViewModuleIcon,
    },
    children: [
      {
        path: 'affiliates/referrals',
        Component: lazy(() => import('pages/List/AffiliateReferralList')),
        meta: { title: "Affiliate's Referrals" },
      },
    ],
  },
];

export default affiliateLists;
