import React from "react";
export const CustomizeLossReportAppConfig = {
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
      path: "/dashboard/reports/customizelossreport",
      component: React.lazy(() => import("./CustomizeLossReport")),
    },
  ],
};
