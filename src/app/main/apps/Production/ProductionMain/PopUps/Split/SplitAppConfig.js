import React from "react";
export const SplitAppConfig = {
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
      path: "/dashboard/production/split",
      component: React.lazy(() => import("./Split")),
    },
  ],
};
