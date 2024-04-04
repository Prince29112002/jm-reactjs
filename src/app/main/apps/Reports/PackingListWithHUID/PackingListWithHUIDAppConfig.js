import React from "react";
export const PackingListWithHUIDAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/dashboard/reports/packingListWithHUID",
      component: React.lazy(() => import("./PackingListWithHUID")),
    },
  ],
};
