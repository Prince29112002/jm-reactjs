import React from "react";
export const BarCodeGenerationAccAndLossAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/dashboard/reports/barCodeGenerationAccAndLoss",
      component: React.lazy(() => import("./BarCodeGenerationAccAndLoss")),
    },
  ],
};
