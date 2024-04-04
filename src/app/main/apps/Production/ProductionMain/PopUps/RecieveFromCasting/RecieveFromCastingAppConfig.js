import React from "react";
export const RecieveFromCastingAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/dashboard/production/receivetree",
      component: React.lazy(() => import("./RecieveFromCasting")),
    },
  ],
};
