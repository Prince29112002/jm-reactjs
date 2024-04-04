import React from "react";
export const CustomerSummariseBalanceAppConfig = {
  settings: {
    layout: {
      config: {
        navbar: {
            display: false
        },
        // toolbar: {
        //     display: true
        // },
        // footer: {
        //     display: false
        // },
        // leftSidePanel: {
        //     display: false
        // },
        // rightSidePanel: {
        //     display: false
        // }
      },
    },
  },
  routes: [
    {
      path: "/dashboard/reports/customersummarisebalance",
      component: React.lazy(() => import("./CustomerSummariseBalance")),
    },
  ],
};
