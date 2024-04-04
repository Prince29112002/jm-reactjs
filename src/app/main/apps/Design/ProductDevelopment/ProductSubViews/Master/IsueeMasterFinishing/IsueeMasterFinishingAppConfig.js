import React from "react";

export const IsueeMasterFinishingAppConfig = {
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
      path: "/dashboard/design/issuemasterfinishing",
      component: React.lazy(() => import("./IsueeMasterFinishing")),
    },
  ],
};
