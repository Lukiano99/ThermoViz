// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: "/auth",
  OVERVIEW: "/overview",
  DATA_ANALYSIS: "/data-analysis",
  ENERGY_MANAGEMENT: "/energy-management",
  ADMINISTRATION: "/administration",
  SUPPORT: "/support",
};

// ----------------------------------------------------------------------

export const paths = {
  minimalUI: "https://mui.com/store/items/minimal-dashboard/",
  // AUTH
  auth: {
    login: `${ROOTS.AUTH}/login`,
    verify: `${ROOTS.AUTH}/verify`,
    register: `${ROOTS.AUTH}/register`,
    newPassword: `${ROOTS.AUTH}/new-password`,
    forgotPassword: `${ROOTS.AUTH}/forgot-password`,
  },
  // DASHBOARD
  overview: {
    root: ROOTS.OVERVIEW,
    one: `${ROOTS.OVERVIEW}/one`,
    two: `${ROOTS.OVERVIEW}/two`,
    three: `${ROOTS.OVERVIEW}/three`,
    group: {
      root: `${ROOTS.OVERVIEW}/group`,
      five: `${ROOTS.OVERVIEW}/group/five`,
      six: `${ROOTS.OVERVIEW}/group/six`,
    },
  },
  // DATA_ANALYSIS
  data_analysis: {
    root: ROOTS.DATA_ANALYSIS,
    analytics: `${ROOTS.DATA_ANALYSIS}/analytics`,
    graphs: `${ROOTS.DATA_ANALYSIS}/graphs`,
    temperature_trends: `${ROOTS.DATA_ANALYSIS}/temperature-trends`,
    energy_trends: `${ROOTS.DATA_ANALYSIS}/energy-trends`,
  },
  // ENERGY_MANAGEMENT
  energy_management: {
    root: ROOTS.ENERGY_MANAGEMENT,
    consumption: `${ROOTS.ENERGY_MANAGEMENT}/consumption`,
    locations: `${ROOTS.ENERGY_MANAGEMENT}/locations`,
  },
  // ADMINISTRATION
  administration: {
    root: ROOTS.ADMINISTRATION,
    settings: `${ROOTS.ADMINISTRATION}/settings`,
    reports: `${ROOTS.ADMINISTRATION}/reports`,
    notifications: `${ROOTS.ADMINISTRATION}/notifications`,
  },
  // SUPPORT
  support: {
    root: ROOTS.SUPPORT,
    help: `${ROOTS.SUPPORT}/help`,
  },
};
