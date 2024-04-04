import React from "react";
export const RejectionReportAppConfig = {
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
      path: "/dashboard/reports/rejectionreport",
      component: React.lazy(() => import("./RejectionReport")),
    },
  ],
};