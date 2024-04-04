import React from "react";
export const PackingListReportAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/dashboard/reports/packingListReport",
      component: React.lazy(() => import("./PackingListReport")),
    },
  ],
};
