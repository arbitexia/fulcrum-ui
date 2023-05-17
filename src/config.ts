/**
 * Copyright (c) 2022, Red Vector, Inc.
 * All rights reserved
 */

/**
 * Author: Diego Martinez
 */
export default {
  APP: {
    TITLE: 'Red Vector',
    DESCRIPTION: '',
    AUTHOR: '',
    HOSTING_URL: process.env.HOSTING_URL,
  },
  API_URL: process.env.API_URL,
  AUTHENTICATION_SERVICE: process.env.SERVICE_NAME,
  URLS: {
    SCORING: process.env.SCORING_URL,
    MODEL: process.env.MODEL_URL,
    STATS: process.env.STATS_URL,
    CONTROL: process.env.CONTROL_URL,
    ENTITY: process.env.ENTITY_URL,
    AUTHENTICATION: process.env.AUTHENTICATION_URL,
    CONFIG: process.env.CONFIG_URL,
    LISTS: process.env.LISTS_URL,
  },
  ACCESS_CONTROL_ALLOWED_METHODS: {
    SCORING: ['GET', 'POST'],
    MODEL: ['GET', 'POST'],
    STATS: ['GET', 'POST'],
    CONTROL: ['GET', 'POST'],
    ENTITY: ['GET', 'POST'],
    CONFIG: ['GET', 'POST'],
    AUTHENTICATION: ['GET'],
    LISTS: ['GET', 'POST'],
  },
};
