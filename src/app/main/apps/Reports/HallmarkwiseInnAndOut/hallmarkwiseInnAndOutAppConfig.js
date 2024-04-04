import React from "react";
export const HallmarkwiseInnAndOutAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/dashboard/reports/HallmarkwiseInnAndOut",
      component: React.lazy(() => import("./hallmarkwiseInnAndOut")),
    },
  ],
};
