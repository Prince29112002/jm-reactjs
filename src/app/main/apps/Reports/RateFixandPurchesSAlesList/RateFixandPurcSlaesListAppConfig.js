import React from "react";
export const RateFixandPurcSlaesListAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/dashboard/reports/rateFixandPurcSlaesList",
      component: React.lazy(() => import("./RateFixandPurcSlaesList")),
    },
  ],
};

