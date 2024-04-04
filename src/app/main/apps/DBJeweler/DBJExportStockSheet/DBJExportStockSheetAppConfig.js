import React from "react";

export const DBJExportStockSheetAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/dashboard/exportstocksheet",
      component: React.lazy(() => import("./DBJExportStockSheet")),
    },
  ],
};
