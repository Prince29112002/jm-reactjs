import React from "react";
export const AddArticianReturnChainRetailerAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/dashboard/sales/articianreturnchainretailer/addarticianchainreturnretailer",
      component: React.lazy(() => import("./AddArticianChainReturnRetailer")),
    },
  ],
};
