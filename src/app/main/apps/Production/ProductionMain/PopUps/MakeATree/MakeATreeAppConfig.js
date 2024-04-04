import React from "react";
export const MakeATreeAppConfig = {
  settings: {
    layout: {
      config: {
        // navbar        : {
        //     display: false
        // },
        // toolbar       : {
        //     display: true
        // },
        // footer        : {
        //     display: false
        // },
        // leftSidePanel : {
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
      path: "/dashboard/production/makeatree",
      component: React.lazy(() => import("./MakeATree")),
    },
  ],
};
