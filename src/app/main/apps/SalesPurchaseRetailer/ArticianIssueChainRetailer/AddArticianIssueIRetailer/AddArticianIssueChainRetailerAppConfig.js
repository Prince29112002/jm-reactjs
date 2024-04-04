import React from "react";
export const AddArticianIssueChainRetailerAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/dashboard/sales/articianissuechainretailer/AddArticianIssueChainRetailer",
      component: React.lazy(() => import("./AddArticianIssueChainRetailer")),
    },
  ],
};
