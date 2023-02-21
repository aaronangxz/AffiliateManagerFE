import { lazy } from 'react';
import { UserCircleIcon } from 'tdesign-icons-react';
import { IRouter } from '../index';

const result: IRouter[] = [
  {
    path: '/user',
    meta: {
      title: 'hidden_user',
      Icon: UserCircleIcon,
    },
    children: [
      {
        path: 'index',
        Component: lazy(() => import('pages/User')),
        meta: {
          title: 'My Account',
        },
      },
    ],
  },
];

export default result;
