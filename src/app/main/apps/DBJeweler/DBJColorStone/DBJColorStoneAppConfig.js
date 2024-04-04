import React from "react";

export const DBJColorStoneAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/dashboard/dbjcolorstone",
      component: React.lazy(() => import("./DBJColorStone")),
    },
  ],
};
