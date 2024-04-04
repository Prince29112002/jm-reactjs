import React from "react";

export const ReceiveFromCromAppConfig = {
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
      path: "/dashboard/design/receivefromchrome",
      component: React.lazy(() => import("./ReceiveFromCrome")),
    },
  ],
};
