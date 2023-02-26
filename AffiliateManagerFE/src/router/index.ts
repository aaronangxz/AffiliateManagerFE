import React, { lazy, useEffect, useState } from 'react';
import { BrowserRouterProps } from 'react-router-dom';
import dashboard from './modules/dashboard';
import list from './modules/list';
import detail from './modules/detail';
import user from './modules/user';
import login from './modules/login';
import affiliateDashboard from './modules/affiliate_dashboard';
import adminDashboard from './modules/admin_dashboard';
import affiliateLists from './modules/affiliate_list';
import adminLists from './modules/admin_list';
import otherRoutes from './modules/others';

export interface IRouter {
  path: string;
  redirect?: string;
  Component?: React.FC<BrowserRouterProps> | (() => any);
  /**
   * 当前路由是否全屏显示
   */
  isFullPage?: boolean;
  /**
   * meta未赋值 路由不显示到菜单中
   */
  meta?: {
    title?: string;
    Icon?: React.FC;
    /**
     * 侧边栏隐藏该路由
     */
    hidden?: boolean;
    /**
     * 单层路由
     */
    single?: boolean;
  };
  children?: IRouter[];
}

const sharedRoutes: IRouter[] = [
  {
    path: '/login/index',
    Component: lazy(() => import('pages/Login')),
    isFullPage: true,
    meta: {
      hidden: true,
    },
  },
];

const adminGeneralRoutes: IRouter[] = [
  {
    path: '/',
    redirect: '/user/profile',
  },
];

const affiliateGeneralRoutes: IRouter[] = [
  {
    path: '/',
    redirect: '/user/profile',
  },
];
export const allRoutes = [
  ...sharedRoutes,
  ...adminGeneralRoutes,
  ...dashboard,
  ...list,
  ...detail,
  ...user,
  ...login,
  ...otherRoutes,
];

export const affiliateRoutes = [
  ...sharedRoutes,
  ...affiliateGeneralRoutes,
  ...affiliateDashboard,
  ...affiliateLists,
  ...detail,
  ...user,
  ...login,
  ...otherRoutes,
];

export const adminRoutes = [
  ...sharedRoutes,
  ...adminGeneralRoutes,
  ...adminDashboard,
  ...adminLists,
  ...detail,
  ...user,
  ...login,
  ...otherRoutes,
];

export const getRoot = (userRole: any | null) => {
  switch (userRole) {
    case 0:
      return '/data/referral/stats';
    case 1:
      return '/data/affiliate/stats';
    default:
      return '/data/affiliate/stats';
  }
};
export const getRoutes = (userRole: any | null) => {
  const [role, setRole] = useState<any>(
    localStorage.getItem('auth') === null ? 2 : JSON.parse(localStorage.getItem('auth')).user_role,
  );
  switch (userRole === null ? role : userRole) {
    case 0:
      return affiliateRoutes;
    case 1:
      return adminRoutes;
    default:
      return allRoutes;
  }
};
export default getRoutes;
