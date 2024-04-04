import React from "react";

export const AddReferenceNumberAppConfig = {
  settings: {
    layout: {
      config: {
        //     navbar: {
        //         display: false
        //     },
        //     toolbar: {
        //         display: true
        //     },
        //     footer: {
        //         display: false
        //     },
        //     leftSidePanel: {
        //         display: false
        //     },
        //     rightSidePanel: {
        //         display: false
        //     }
      },
    },
  },
  routes: [
    {
      path: "/dashboard/production/addreferencenumber",
      // component: MainDesignPage
      component: React.lazy(() => import("./AddReferenceNumber")),
    },
  ],
};
