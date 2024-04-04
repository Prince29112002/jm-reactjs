import React from "react";
export const IssueToWorkerAppConfig = {
  settings: {
    layout: {
      config: {
        // navbar        : {
        //     display: false
        // },
        // toolbar       : {
        //     display: true
        // },
        // footer        : {
        //     display: false
        // },
        // leftSidePanel : {
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
      path: "/dashboard/production/issuetoworker",
      component: React.lazy(() => import("./IssueToWorker")),
    },
  ],
};
