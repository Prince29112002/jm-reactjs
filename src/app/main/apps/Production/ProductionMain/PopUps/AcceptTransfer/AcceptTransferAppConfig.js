import React from "react";
export const AcceptTransferAppConfig = {
  settings: {
    layout: {
      config: {
        // navbar: {
        //   display: false,
        // },
        // toolbar: {
        //   display: true,
        // },
        // footer: {
        //   display: false,
        // },
        // leftSidePanel: {
        //   display: false,
        // },
        // rightSidePanel: {
        //   display: false,
        // },
      },
    },
  },
  routes: [
    {
      path: "/dashboard/production/accepttransfer",
      component: React.lazy(() => import("./AcceptTransfer")),
    },
  ],
};
