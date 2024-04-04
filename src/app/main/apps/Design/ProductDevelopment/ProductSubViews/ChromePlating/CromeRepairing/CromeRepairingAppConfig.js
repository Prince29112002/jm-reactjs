import React from "react";

export const CromeRepairingAppconfig = {
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
      path: "/dashboard/design/chromerepairing",
      component: React.lazy(() => import("./CromeRepairing")),
    },
  ],
};
