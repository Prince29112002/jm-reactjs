import React from "react";

export const MortgageInterestSettingAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/dashboard/mastersretailer/mortgageinterestsetting",
      component: React.lazy(() => import("./MortgageInterestSetting")),
    },
  ],
};
