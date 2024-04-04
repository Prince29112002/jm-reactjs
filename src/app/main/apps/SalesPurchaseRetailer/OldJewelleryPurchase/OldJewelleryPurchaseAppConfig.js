import React from "react";
export const  OldJewelleryPurchaseAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/dashboard/sales/oldjewellerypurchase",
      component: React.lazy(() => import("./OldJewelleryPurchase")),
    },
  ],
};