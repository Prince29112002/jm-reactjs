import React from "react";

export const CAMReceiveFromWorkerAppConfig = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: false,
        },
        toolbar: {
          display: true,
        },
        footer: {
          display: false,
        },
        leftSidePanel: {
          display: false,
        },
        rightSidePanel: {
          display: false,
        },
      },
    },
  },
  routes: [
    {
      path: "/dashboard/design/camreceivefromworker",
      component: React.lazy(() => import("./CAMReceiveFromWorker")),
    },
  ],
};
