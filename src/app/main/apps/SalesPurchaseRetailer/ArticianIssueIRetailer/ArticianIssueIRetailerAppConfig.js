import React from "react";
export const ArticianIssueIRetailerAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/dashboard/sales/articianissueiretailer",
      component: React.lazy(() => import("./ArticianIssueIRetailer")),
    },
  ],
};
