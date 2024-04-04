import React from "react";

export const MoldRepairingAppConfig = {
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
      path: "/dashboard/design/moldrepairing",
      component: React.lazy(() => import("./MoldRepairing")),
    },
  ],
};
