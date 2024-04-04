import React from "react";
export const ArticianReturnChainRetailerAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/dashboard/sales/articianreturnchainretailer",
      component: React.lazy(() => import("./ArticianReturnChainRetailer")),
    },
  ],
};
