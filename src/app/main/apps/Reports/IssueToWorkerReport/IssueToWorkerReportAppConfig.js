import React from "react";
export const IssueToWorkerReportAppConfig = {
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
      path: "/dashboard/reports/issuetoworkerreport",
      component: React.lazy(() => import("./IssueToWorkerReport")),
    },
  ],
};
