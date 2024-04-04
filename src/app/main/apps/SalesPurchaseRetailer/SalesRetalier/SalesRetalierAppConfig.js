import React from "react";
export const SalesRetalierAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/dashboard/sales/salesretalier",
      component: React.lazy(() => import("./SalesRetalier")),
    },
  ],
};
