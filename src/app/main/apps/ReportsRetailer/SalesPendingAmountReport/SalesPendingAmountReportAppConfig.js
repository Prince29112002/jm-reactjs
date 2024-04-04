import React from "react";
export const SalesPendingAmountReportAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/dashboard/reportsretailer/udhaaramountreports",
      component: React.lazy(() => import("./SalesPendingAmountReport")),
    },
  ],
};
