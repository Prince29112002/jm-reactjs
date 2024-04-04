import React from "react";
export const ArticianReturnRetailerAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/dashboard/sales/articianreturnretailer",
      component: React.lazy(() => import("./ArticianReturnRetailer")),
    },
  ],
};
