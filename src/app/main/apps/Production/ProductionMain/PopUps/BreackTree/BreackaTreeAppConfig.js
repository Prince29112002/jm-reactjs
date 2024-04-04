import React from "react";

export const BreackaTreeAppConfig = {
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
      path: "/dashboard/production/breackatree",
      // component: MainDesignPage
      component: React.lazy(() => import("./BreackaTree")),
    },
  ],
};
