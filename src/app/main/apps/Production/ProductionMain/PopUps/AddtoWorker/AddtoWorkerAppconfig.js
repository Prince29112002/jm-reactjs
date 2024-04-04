import React from "react";

export const AddtoWorkerAppconfig = {
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
      path: "/dashboard/production/addtoworker",
      component: React.lazy(() => import("./AddToWorker")),
    },
  ],
};
