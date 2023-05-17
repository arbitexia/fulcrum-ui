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
};

export const sidebarMenus: SideBarMenu[] = [
  { route: '/home', imgPath: 'images/icons/home.svg', title: 'Home' },
  { route: '/share', imgPath: 'images/icons/share.svg', title: 'Share' },
  { route: '/reports', imgPath: 'images/icons/chart.svg', title: 'Reports' },
  {
    route: '/configuration/model',
    imgPath: 'images/icons/network.svg',
    title: 'Configuration',
  },
  {
    route: '/analytics',
    imgPath: 'images/icons/graph.svg',
    title: 'Analytics',
  },
  {
    route: '/notifications',
    imgPath: 'images/icons/bell.svg',
    title: 'Notifications',
  },
  {
    route: '/settings',
    imgPath: 'images/icons/settings.svg',
    title: 'Settings',
  },
  { route: '/profile', imgPath: 'images/icons/profile.svg', title: 'Profile' },
  { route: '/logout', imgPath: 'images/icons/logout.svg', title: 'Logout' },
];
