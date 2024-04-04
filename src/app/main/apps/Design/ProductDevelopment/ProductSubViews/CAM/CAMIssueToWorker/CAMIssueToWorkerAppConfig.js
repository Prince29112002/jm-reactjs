import React from "react";

export const CAMIssueToWorkerAppConfig = {
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
      path: "/dashboard/design/camissuetoworker",
      component: React.lazy(() => import("./CAMIssueToWorker")),
    },
  ],
};
