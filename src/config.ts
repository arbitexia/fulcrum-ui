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
  AUTHENTICATION_SERVICE: process.env.SERVICE_NAME,
  URLS: {
    API: process.env.API_URL,
    SCORING: process.env.SCORING_URL,
    MODEL: process.env.MODEL_URL,
    STATS: process.env.STATS_URL,
    CONTROL: process.env.CONTROL_URL,
    ENTITY: process.env.ENTITY_URL,
    AUTHENTICATION: process.env.AUTHENTICATION_URL,
    CONFIG: process.env.CONFIG_URL,
    LISTS: process.env.LISTS_URL,
    RISK: process.env.RISK_URL,
    AUDIT: process.env.AUDIT_URL,
    GOVERNANCE: process.env.GOVERNANCE_URL,
    NOTIFICATIONS: process.env.NOTIFICATIONS_URL,
    REPORT_URL: process.env.REPORT_URL,
  },
  ACCESS_CONTROL_ALLOWED_METHODS: {
    API: ['GET', 'POST'],
    SCORING: ['GET', 'POST'],
    MODEL: ['GET', 'POST'],
    STATS: ['GET', 'POST'],
    CONTROL: ['GET', 'POST'],
    ENTITY: ['GET', 'POST'],
    CONFIG: ['GET', 'POST'],
    AUTHENTICATION: ['GET'],
    LISTS: ['GET', 'POST'],
    RISK: ['POST'],
    AUDIT: ['POST'],
    GOVERNANCE: ['POST'],
    NOTIFICATIONS: ['GET', 'POST'],
    REPORT: ['POST'],
  },
};
