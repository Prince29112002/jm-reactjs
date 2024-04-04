import React from "react";

export const ViewWorkStationRateAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/dashboard/masters/workstationrateprof/viewworkstationrateprofile",
      component: React.lazy(() => import("./ViewWorkStationRateProfile")),
    },
  ],
};
