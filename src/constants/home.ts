/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
export type SideBarMenu = {
  name: string;
  route: string;
  imgPath: string;
  title: string;
  display?: boolean;
};

export const sidebarMenus: SideBarMenu[] = [
  {
    name: 'home',
    route: '/home',
    imgPath: 'images/icons/home.svg',
    title: 'Home',
  },
  {
    name: 'share',
    route: '/share',
    imgPath: 'images/icons/discovery.svg',
    title: 'Discovery',
    display: false,
  },
  {
    name: 'reports',
    route: '/reports/program',
    imgPath: 'images/icons/chart.svg',
    title: 'Reports',
  },
  {
    name: 'configuration',
    route: '/configuration/model',
    imgPath: 'images/icons/models-configuration.svg',
    title: 'Models',
  },
  {
    name: 'analytics',
    route: '/analytics',
    imgPath: 'images/icons/graph.svg',
    title: 'Status',
  },
  {
    name: 'notifications',
    route: '/notifications/view',
    imgPath: 'images/icons/bell.svg',
    title: 'Notifications',
  },
  {
    name: 'settings',
    route: '/settings',
    imgPath: 'images/icons/settings.svg',
    title: 'Admin',
    display: false,
  },
  {
    name: 'governance',
    route: '/governance/unmask',
    imgPath: 'images/icons/profile.svg',
    title: 'Governance',
  },
  {
    name: 'logout',
    route: '/logout',
    imgPath: 'images/icons/logout.svg',
    title: 'Logout',
  },
];
