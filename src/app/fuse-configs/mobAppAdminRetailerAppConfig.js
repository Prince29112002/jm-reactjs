class mobAppAdminRetailerAppConfig {
  static mobAppAdminRetailerAppConfig() {
    const dataArr = [
      {
        id: "Orders",
        title: "Orders",
        type: "item",
        url: "/dashboard/mobappadmin/OrdersRetailer",
        isAccessible: true,
      },
      {
        type: "divider",
        id: "divider-1",
        isAccessible: true,
      },
      {
        id: "mobilMaster",
        title: " Master",
        type: "collapse",
        isAccessible: true,
        children: [
          {
            id: "userMaster",
            title: "User Master",
            type: "item",
            url: "/dashboard/mobappadmin/UserMasterRetailer",
            isAccessible: true,
          },
        ],
      },
      {
        type: "divider",
        id: "divider-2",
      },
      {
        id: "mobilProducts",
        title: "Products",
        type: "collapse",
        isAccessible: true,
        children: [
          {
            id: "branding",
            title: "Branding",
            type: "item",
            url: "/dashboard/mobappadmin/brandingRetailer",
            isAccessible: true,
          },

          {
            id: "cms",
            title: "CMS",
            type: "item",
            url: "/dashboard/mobappadmin/cmsRetailer",
            isAccessible: true,
          },
        ],
      },
      {
        type: "divider",
        id: "divider-4",
      },

      {
        id: "mobileWssociation",
        title: " Others",
        type: "collapse",
        isAccessible: true,
        children: [
          {
            id: "ProspectiveOrder",
            title: "Prospective Order",
            type: "item",
            url: "/dashboard/mobappadmin/ProspectiveOrderRetailer",
            isAccessible: true,
          },
        ],
      },
      {
        type: "divider",
        id: "divider-6",
      },

      {
        id: "LoginDetails",
        title: "Login Details",
        type: "item",
        url: "/dashboard/mobappadmin/logindetailsRetailer",
        isAccessible: true,
      },
    ];
    return dataArr;
  }
}

export default mobAppAdminRetailerAppConfig;
