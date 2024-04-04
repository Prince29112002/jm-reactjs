import React from "react";

export const ProductionOrderDetailsAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/dashboard/planningdashboard/planningorders/orderView",
      component: React.lazy(() => import("./ProductionOrderDetails")),
    },
  ],
};
