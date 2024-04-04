import React from "react";
export const DepartmentTransferSummaryAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/dashboard/reports/departmentTransferSummary",
      component: React.lazy(() => import("./DepartmentTransferSummary")),
    },
  ],
};
