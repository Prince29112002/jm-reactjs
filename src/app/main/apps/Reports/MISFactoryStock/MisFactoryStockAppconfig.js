import React from "react";
export const MisFactoryStockAppconfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/dashboard/reports/MisFactoryStock",
      component: React.lazy(() => import("./MisFactoryStock")),
    },
  ],
};
