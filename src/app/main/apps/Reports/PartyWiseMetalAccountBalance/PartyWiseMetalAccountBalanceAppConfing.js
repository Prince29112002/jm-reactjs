import React from "react";
export const PartyWiseMetalAccountBalanceAppConfing = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/dashboard/reports/partyWiseMetalAccountBalance",
      component: React.lazy(() => import("./PartyWiseMetalAccountBalance")),
    },
  ],
};
