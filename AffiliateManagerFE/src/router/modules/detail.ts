import { lazy } from 'react';
import { LayersIcon } from 'tdesign-icons-react';
import { IRouter } from '../index';

const result: IRouter[] = [
  {
    path: '/detail',
    meta: {
      title: 'hidden_details',
      Icon: LayersIcon,
    },
    children: [
      {
        path: 'base',
        Component: lazy(() => import('pages/ReferralDetails')),
        meta: {
          title: 'Referral Details',
        },
      },
      {
        path: 'affiliate',
        Component: lazy(() => import('pages/AffiliateDetails')),
        meta: { title: 'Affiliate Details' },
      },
    ],
  },
];

export default result;
