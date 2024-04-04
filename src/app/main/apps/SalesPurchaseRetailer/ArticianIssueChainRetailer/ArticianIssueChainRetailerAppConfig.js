import React from "react";
export const ArticianIssueChainRetailerAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/dashboard/sales/articianissuechainretailer",
      component: React.lazy(() => import("./ArticianIssueChainRetailer")),
    },
  ],
};
