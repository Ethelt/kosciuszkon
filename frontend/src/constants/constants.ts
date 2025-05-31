const BREAKPOINTS = {
  xxl: {
    cols: 6,
    width: 1536,
  },
  xl: {
    cols: 4,
    width: 1200,
  },
  lg: {
    cols: 3,
    width: 992,
  },
  md: {
    cols: 2,
    width: 768,
  },
  sm: {
    cols: 1,
    width: 600,
  },
} as const;
const DASHBOARD_CARD_ROW_HEIGHT = 75; // px

export { BREAKPOINTS, DASHBOARD_CARD_ROW_HEIGHT };
