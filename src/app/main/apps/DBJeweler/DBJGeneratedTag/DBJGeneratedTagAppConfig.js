import React from "react";

export const DBJGeneratedTagAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/dashboard/dbjgeneratedtag",
      component: React.lazy(() => import("./DBJGeneratedTag")),
    },
  ],
};
