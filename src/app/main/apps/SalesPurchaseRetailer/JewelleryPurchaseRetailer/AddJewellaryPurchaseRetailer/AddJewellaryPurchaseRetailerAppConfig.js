import React from "react";
export const AddJewellaryPurchaseRetailerAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/dashboard/sales/jewellerypurchaseretailer/addjewellarypurchase",
      component: React.lazy(() => import("./AddJewellaryPurchaseRetailer")),
    },
  ],
};
