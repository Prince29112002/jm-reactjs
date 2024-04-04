import React from "react";
export const ReceiveBalanceStockAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/dashboard/production/receivebalancestock",
      component: React.lazy(() => import("./ReceiveBalanceStock")),
    },
  ],
};
