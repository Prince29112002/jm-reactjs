import React from "react";

export const EditSelectedBomDetailsAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "/dashboard/planningdashboard/planningorders/orderView/editselectedbomdetails",
      component: React.lazy(() => import("./EditSelectedBomDetails")),
    },
  ],
};
