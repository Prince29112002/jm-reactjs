import React from "react";

export const EditBomDetailsAppConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "/dashboard/planningdashboard/planningorders/orderView/editbomdetails",
      component: React.lazy(() => import("./EditBomDetails")),
    },
  ],
};
