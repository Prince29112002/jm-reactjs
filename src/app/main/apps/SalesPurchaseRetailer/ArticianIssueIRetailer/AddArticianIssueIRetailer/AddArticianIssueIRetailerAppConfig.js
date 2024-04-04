import React from "react";
export const AddArticianIssueIRetailerAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/dashboard/sales/articianissueiretailer/addarticianissueiretailer",
      component: React.lazy(() => import("./AddArticianIssueIRetailer")),
    },
  ],
};
