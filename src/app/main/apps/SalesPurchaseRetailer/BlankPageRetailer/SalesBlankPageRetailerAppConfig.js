import SalesBlankPageRetailer from "./SalesBlankPageRetailer";

export const SalesBlankPageRetailerAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/dashboard/salesretailer",
      component: SalesBlankPageRetailer,
    },
  ],
};
