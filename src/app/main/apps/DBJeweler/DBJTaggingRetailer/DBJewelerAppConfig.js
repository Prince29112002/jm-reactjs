import React from "react";

export const DBJewelerAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/dashboard/dbjeweler",
      component: React.lazy(() => import("./DBJeweler")),
    },
  ],
};
