import React from "react";
export const StockTypeWiseDepartmentwiseStoRAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/dashboard/reports/StockTypeWiseDepartmentwiseStoR",
      component: React.lazy(() => import("./StockTypeWiseDepartmentwiseStoR")),
    },
  ],
};
