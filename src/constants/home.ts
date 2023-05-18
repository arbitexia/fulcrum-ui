/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
type SideBarMenu = {
  route: string;
  imgPath: string;
  title: string;
  display?: boolean;
};

export const sidebarMenus: SideBarMenu[] = [
  { route: '/home', imgPath: 'images/icons/home.svg', title: 'Home' },
  {
    route: '/share',
    imgPath: 'images/icons/discovery.svg',
    title: 'Discovery',
    display: false,
  },
  { route: '/reports', imgPath: 'images/icons/chart.svg', title: 'Reports' },
  {
    route: '/configuration/model',
    imgPath: 'images/icons/models-configuration.svg',
    title: 'Models',
  },
  {
    route: '/analytics',
    imgPath: 'images/icons/graph.svg',
    title: 'Status',
  },
  {
    route: '/notifications/view',
    imgPath: 'images/icons/bell.svg',
    title: 'Notifications',
  },
  {
    route: '/settings',
    imgPath: 'images/icons/settings.svg',
    title: 'Admin',
    display: false,
  },
  {
    route: '/governance/unmask',
    imgPath: 'images/icons/profile.svg',
    title: 'Governance',
  },
  { route: '/logout', imgPath: 'images/icons/logout.svg', title: 'Logout' },
];
