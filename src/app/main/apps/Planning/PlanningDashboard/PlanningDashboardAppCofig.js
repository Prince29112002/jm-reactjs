import React from "react";

export const PlanningDashboardAppCofig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/dashboard/planningdashboard",
      component: React.lazy(() => import("./PlanningDashboard")),
    },
  ],
};
