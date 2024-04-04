import React from "react";

export const DBJColorStoneStockSheetAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/dashboard/dbjcolorstonestocksheet",
      component: React.lazy(() => import("./DBJColorStoneStockSheet")),
    },
  ],
};
