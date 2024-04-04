class mobAppAdminAppConfig {

  static mobAppAdminAppConfigArr(){
    const dataArr = [
      {
        id: "Orders",
        title: "Orders",
        type: "item",
        url: "/dashboard/mobappadmin/orders",
        isAccessible : true,
      },
      {
        type: "divider",
        id: "divider-1",
        isAccessible : true,
      },
      {
        id: "mobilMaster",
        title: " Master",
        type: "collapse",
        isAccessible : true,
        children: [
          {
            id: "retailerMaster",
            title: "Retailer Master",
            type: "item",
            url: "/dashboard/mobappadmin/retailermaster",
            isAccessible : true,
          },
          {
            id: "userMaster",
            title: "User Master",
            type: "item",
            url: "/dashboard/mobappadmin/usermaster",
            isAccessible : true,
          },
          {
            id: "distributorMaster",
            title: "Distributor Master",
            type: "item",
            url: "/dashboard/mobappadmin/distributormaster",
            isAccessible : true,
          },
          {
            id: "Salesman",
            title: "Salesman Master",
            type: "item",
            url: "/dashboard/mobappadmin/salesman",
            isAccessible : true,
          },
          {
            id: "otherlead",
            title: "Other Lead",
            type: "item",
            url: "/dashboard/mobappadmin/otherlead",
            isAccessible : true,
          },
          {
            id: "crm",
            title: "CRM",
            type: "item",
            url: "/dashboard/mobappadmin/crm",
            isAccessible : true,
          },
          {
            id: "exibitionMaster",
            title: "Exhibition Master",
            type: "item",
            url: "/dashboard/mobappadmin/exhibitionmaster",
            isAccessible : true,
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
        isAccessible : true,
        children: [
          {
            id: "categories",
            title: "Categories",
            type: "item",
            url: "/dashboard/mobappadmin/categories",
            isAccessible : true,
          },
          {
            id: "teaserDesign",
            title: "Teaser Design",
            type: "item",
            url: "/dashboard/mobappadmin/teaserdesign",
            isAccessible : true,
          },
          {
            id: "branding",
            title: "Branding",
            type: "item",
            url: "/dashboard/mobappadmin/branding",
            isAccessible : true,
          },
          {
            id: "myCatalouge",
            title: "My Catalouge",
            type: "item",
            url: "/dashboard/mobappadmin/mycatalogue",
            isAccessible : true,
          },
          {
            id: "distributerCatalogue",
            title: "Distributor Catalogue",
            type: "item",
            url: "/dashboard/mobappadmin/distributercatalogue",
            isAccessible : true,
          },
          {
            id: "cms",
            title: "CMS",
            type: "item",
            url: "/dashboard/mobappadmin/cms",
            isAccessible : true,
          },
        ],
      },
      {
        type: "divider",
        id: "divider-4",
      },
      {
        id: "mobileWssociation",
        title: " Association",
        type: "collapse",
        isAccessible : true,
        children: [
          {
            id: "salesmanAssociation",
            title: "Salesman Association",
            type: "item",
            url: "/dashboard/mobappadmin/salesmanassociation",
            isAccessible : true,
          },
          {
            id: "companyAssociation",
            title: "Company Association",
            type: "item",
            url: "/dashboard/mobappadmin/companyassociation",
            isAccessible : true,
          },
        ],
      },
      {
        type: "divider",
        id: "divider-5",
      },
      {
        id: "mobileWssociation",
        title: " Others",
        type: "collapse",
        isAccessible : true,
        children: [
          {
            id: "pushNotification",
            title: "Push Notification",
            type: "item",
            url: "/dashboard/mobappadmin/pushnotification",
            isAccessible : true,
          },
          {
            id: "news&Updates",
            title: "News & Updates",
            type: "item",
            url: "/dashboard/mobappadmin/newsupdate",
            isAccessible : true,
          },
    
          {
            id: "ProspectiveOrder",
            title: "Prospective Order",
            type: "item",
            url: "/dashboard/mobappadmin/prospectiveorders",
            isAccessible : true,
          },
          {
            id: "primaryAllocation",
            title: "Primary Allocation",
            type: "item",
            url: "/dashboard/mobappadmin/primaryallocation",
            isAccessible : true,
          },
          {
            id: "userComplain",
            title: "User Complain",
            type: "item",
            url: "/dashboard/mobappadmin/usercomplain",
            isAccessible : true,
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
        url: "/dashboard/mobappadmin/logindetails",
        isAccessible : true,
      },
    ];
    return dataArr
  }
}

export default mobAppAdminAppConfig;
