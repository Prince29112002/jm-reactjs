import React from "react";

export const WorkStationRateAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/dashboard/masters/workstationrateprof",
      component: React.lazy(() => import("./WorkStationRateProf")),
    },
  ],
};
