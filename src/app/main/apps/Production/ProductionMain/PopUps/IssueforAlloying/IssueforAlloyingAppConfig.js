import React from "react";

export const IssueforAlloyingAppConfig = {
  settings: {
    layout: {
      config: {
        // navbar: {
        //     display: false
        // },
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
      path: "/dashboard/production/issueforalloying",
      // component: MainDesignPage
      component: React.lazy(() => import("./IssueforAlloying")),
    },
  ],
};
