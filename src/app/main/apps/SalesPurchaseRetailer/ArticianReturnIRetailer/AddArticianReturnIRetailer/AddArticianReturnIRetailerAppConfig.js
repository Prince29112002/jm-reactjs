import React from "react";
export const AddArticianReturnIRetailerAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/dashboard/sales/articianreturnretailer/addarticianreturnretailer",
      component: React.lazy(() => import("./AddArticianReturnRetailer")),
    },
  ],
};
