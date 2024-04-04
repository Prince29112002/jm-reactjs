import React from "react";
export const ReceiveFromWorkerReportAppConfig = {
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
      path: "/dashboard/reports/receivefromworkerreport",
      component: React.lazy(() => import("./ReceiveFromWorkerReport")),
    },
  ],
};
