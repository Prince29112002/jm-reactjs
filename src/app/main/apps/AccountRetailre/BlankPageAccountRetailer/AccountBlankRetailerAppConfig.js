import AccountBlankPageRetailer from "./AccountBlankPageRetailer";

export const AccountBlankRetailerAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/dashboard/accountretailer",
      component: AccountBlankPageRetailer,
    },
  ],
};
