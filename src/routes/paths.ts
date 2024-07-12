// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: "/auth",
  DASHBOARD: "/dashboard",
  DATA_ANALYSIS: "/data_analysis",
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
  dashboard: {
    root: ROOTS.DASHBOARD,
    one: `${ROOTS.DASHBOARD}/one`,
    two: `${ROOTS.DASHBOARD}/two`,
    three: `${ROOTS.DASHBOARD}/three`,
    group: {
      root: `${ROOTS.DASHBOARD}/group`,
      five: `${ROOTS.DASHBOARD}/group/five`,
      six: `${ROOTS.DASHBOARD}/group/six`,
    },
  },
  // DATA_ANALYSIS
  data_analysis: {
    root: ROOTS.DATA_ANALYSIS,
    analytics: `${ROOTS.DATA_ANALYSIS}/analytics`,
    graphs: `${ROOTS.DATA_ANALYSIS}/graphs`,
    temperature_trends: `${ROOTS.DATA_ANALYSIS}/temperatureTrends`,
    energy_trends: `${ROOTS.DATA_ANALYSIS}/energyTrends`,
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
