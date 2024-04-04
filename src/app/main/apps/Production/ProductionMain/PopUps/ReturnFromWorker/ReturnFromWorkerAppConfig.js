import React from "react";

export const ReturnFromWorkerAppConfig = {
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
      path: "/dashboard/production/returnfromworker",
      component: React.lazy(() => import("./ReturnFromWorker")),
    },
  ],
};
