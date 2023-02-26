import { lazy } from 'react';
import { DashboardIcon } from 'tdesign-icons-react';
import { IRouter } from '../index';

const home: IRouter[] = [
  {
    path: '/',
    Component: lazy(() => import('pages/Result/Success')),
    meta: {
      title: 'Home',
      Icon: DashboardIcon,
    },
  },
];

export default home;
