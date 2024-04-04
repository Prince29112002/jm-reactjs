import React from "react";
export const DailyProductionReportTwoAppConfig = {
  settings: {
    layout: {
      config: {
        navbar: {
            display: false
        },
        // toolbar: {
        //     display: true
        // },
        // footer: {
        //     display: false
        // },
        // leftSidePanel: {
        //     display: false
        // },
        // rightSidePanel: {
        //     display: false
        // }
      },
    },
  },
  routes: [
    {
      path: "/dashboard/reports/dailyproductionreportformatetwo",
      component: React.lazy(() => import("./DailyProductionReportTwo")),
    },
  ],
};
