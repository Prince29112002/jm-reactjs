import React from "react";
export const FineGoldReportAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/dashboard/reports/finegoldreport",
      component: React.lazy(() => import("./FineGoldReport")),
    },
  ],
};
