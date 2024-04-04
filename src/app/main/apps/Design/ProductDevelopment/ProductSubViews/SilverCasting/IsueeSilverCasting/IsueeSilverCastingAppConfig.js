import React from "react";

export const IsueeSilverCastingAppConfig = {
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
      path: "/dashboard/design/issuesilvercasting",
      component: React.lazy(() => import("./IsueeSilverCasting")),
    },
  ],
};
