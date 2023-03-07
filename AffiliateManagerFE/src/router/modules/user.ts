import { lazy } from 'react';
import { UserCircleIcon } from 'tdesign-icons-react';
import { IRouter } from '../index';

const result: IRouter[] = [
  {
    path: '/user',
    meta: {
      title: 'User',
      Icon: UserCircleIcon,
      hidden: true,
    },
    children: [
      {
        path: 'profile',
        Component: lazy(() => import('pages/User')),
        meta: {
          title: 'Profile',
        },
      },
    ],
  },
];

export default result;
