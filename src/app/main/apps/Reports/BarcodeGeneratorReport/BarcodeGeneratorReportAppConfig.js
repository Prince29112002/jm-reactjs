import React from "react";
export const BarcodeGeneratorReportAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/dashboard/reports/barcodeGeneratorReport",
      component: React.lazy(() => import("./BarcodeGeneratorReport")),
    },
  ],
};
