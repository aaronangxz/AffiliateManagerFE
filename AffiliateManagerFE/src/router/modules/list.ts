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
        path: 'affiliate',
        Component: lazy(() => import('pages/List/Select')),
        meta: { title: 'Affiliate List' },
      },
      // {
      //   path: 'tree',
      //   Component: lazy(() => import('pages/List/Tree')),
      //   meta: { title: '树状筛选列表页' },
      // },
    ],
  },
];

export default result;
