import ReportBlankPageRetailer from "./ReportBlankPageRetailer";

export const ReportBlankRetailerAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/dashboard/reportsretailer",
      component: ReportBlankPageRetailer,
    },
  ],
};
