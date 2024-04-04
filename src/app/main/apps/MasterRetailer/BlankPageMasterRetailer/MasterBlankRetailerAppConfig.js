import MasterBlankPageRetailer from "./MasterBlankPageRetailer";

export const MasterBlankRetailerAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/dashboard/masterretailer",
      component: MasterBlankPageRetailer,
    },
  ],
};
