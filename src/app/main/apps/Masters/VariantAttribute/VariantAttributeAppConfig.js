import React from "react";

export const VariantAttributeAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/dashboard/masters/variantattribute",
      component: React.lazy(() => import("./VariantAttribute")),
    },
  ],
};
