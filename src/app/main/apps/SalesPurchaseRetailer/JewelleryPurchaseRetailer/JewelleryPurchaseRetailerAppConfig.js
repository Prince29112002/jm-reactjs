import React from "react";
export const JewelleryPurchaseRetailerAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/dashboard/sales/jewellerypurchaseretailer",
      component: React.lazy(() => import("./JewelleryPurchaseRetailer")),
    },
  ],
};
