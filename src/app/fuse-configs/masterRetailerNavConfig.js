class masterRetailerNavConfig {
  static masterRetailerNavConfigArr() {
    const roleOfUser = localStorage.getItem("permission")
      ? JSON.parse(localStorage.getItem("permission"))
      : null;
    const module = roleOfUser ? roleOfUser["Master-Retailer"] : null;
    const keys = module ? Object.keys(module) : [];

    const dataArr = [
      {
        id: "stockMaster",
        title: "Stock Master",
        type: "collapse",
        isAccessible:
          keys.includes("Main Item Type-Retailer") ||
          keys.includes("Stock Group-Retailer") ||
          keys.includes("Stock Name-Retailer"),
        children: [
          {
            id: "itemType",
            title: "Main Item Type",
            type: "item",
            url: "/dashboard/mastersretailer/itemtype",
            isAccessible: keys.includes("Main Item Type-Retailer"),
          },
          {
            id: "stockGroup",
            title: "Stock Group",
            type: "item",
            url: "/dashboard/mastersretailer/stockgroupretailer",
            isAccessible: keys.includes("Stock Group-Retailer"),
          },
          {
            id: "stkName",
            title: "Stock Name",
            type: "item",
            url: "/dashboard/mastersretailer/stocknameretailer",
            isAccessible: keys.includes("Stock Name-Retailer"),
          },
        ],
      },
      {
        id: "vendorsretailer",
        title: "Vendor",
        type: "item",
        url: "/dashboard/mastersretailer/vendorretailer",
        isAccessible: keys.includes("Vendors-Retailer"),
      },
      {
        type: "divider",
        id: "divider-1",
      },
      {
        id: "clientsretailer",
        title: "Client / Party",
        type: "item",
        url: "/dashboard/mastersretailer/clientsretailer",
        isAccessible: keys.includes("Client-Retailer"),
      },
      {
        id: "clientschainretailer",
        title: "Client / Party",
        type: "item",
        url: "/dashboard/mastersretailer/clientschainretailer",
        isAccessible: keys.includes("Client-Chain-Retailer"),
      },
      {
        type: "divider",
        id: "divider-2",
      },
      {
        id: "jobworkerretailer",
        title: "Job Worker",
        type: "item",
        url: "/dashboard/mastersretailer/jobworkerretailer",
        isAccessible: keys.includes("Job Workers-Retailer"),
      },
      {
        type: "divider",
        id: "divider-3",
      },
      {
        id: "salesmanretailer",
        title: "Salesman",
        type: "item",
        url: "/dashboard/mastersretailer/salesmanretailer",
        isAccessible: keys.includes("Sales Man-Retailer"),
      },
      {
        type: "divider",
        id: "divider-4",
      },
      {
        id: "Categoryretailer",
        title: "Category",
        type: "item",
        url: "/dashboard/mastersretailer/categoryretailer",
        isAccessible: keys.includes("Category-Retailer"),
      },
      {
        type: "divider",
        id: "divider-5",
      },
      {
        id: "Settingretailer",
        title: "Setting",
        type: "collapse",
        isAccessible:
          keys.includes("HSN Master-Retailer") ||
          keys.includes("My Profile-Retailer") ||
          keys.includes("Change Password-Retailer") ||
          keys.includes("Tag System-Retailer") ||
          keys.includes("Tag Printer-Retailer"),
        children: [
          {
            id: "HSNMastersretailer",
            title: "HSN Masters Retailer",
            type: "item",
            url: "/dashboard/mastersretailer/hsnmastersretailer",
            isAccessible: keys.includes("HSN Master-Retailer"),
          },
          {
            id: "Profile",
            title: "My Profile",
            type: "item",
            url: "/dashboard/mastersretailer/profileretailer",
            isAccessible: keys.includes("My Profile-Retailer"),
          },
          {
            id: "ChangePassword",
            title: "Change Password",
            type: "item",
            url: "/dashboard/mastersretailer/changepassword",
            isAccessible: keys.includes("Change Password-Retailer"),
          },
          {
            id: "TagSystemRetailer",
            title: "Tag System",
            type: "item",
            url: "/dashboard/mastersretailer/tagsystemretailer",
            isAccessible: keys.includes("Tag System-Retailer"),
          },
          {
            id: "TagPrinterRetailer",
            title: "Tag Printer",
            type: "item",
            url: "/dashboard/mastersretailer/tagprinterretailer",
            isAccessible: keys.includes("Tag Printer-Retailer"),
          },
        ],
      },
      {
        type: "divider",
        id: "divider-6",
      },
      {
        id: "Rates",
        title: "Rates",
        type: "collapse",
        isAccessible:
          keys.includes("Gold Rate Today-Retailer") ||
          keys.includes("Silver Rate Today-Retailer") ||
          keys.includes("Making Charges-Retailer") ||
          keys.includes("Hallmark Charges-Retailer"),
        children: [
          {
            id: "goldrateretailer",
            title: "Today's Gold / Silver Rate",
            type: "item",
            url: "/dashboard/mastersretailer/goldrateretailer",
            isAccessible: keys.includes("Gold Rate Today-Retailer"),
          },
          // {
          //   id: "silverrateretailer",
          //   title: "Today's Silver Rate",
          //   type: "item",
          //   url: "/dashboard/mastersretailer/silverrateretailer",
          //   isAccessible : keys.includes('Silver Rate Today-Retailer'),
          // },
          {
            id: "makingchargesretailer",
            title: " Making Charges",
            type: "item",
            url: "/dashboard/mastersretailer/makingchargesretailer",
            isAccessible: keys.includes("Making Charges-Retailer"),
          },
          {
            id: "HallmarkChargesRetailer",
            title: "Hallmark Charges Retailer",
            type: "item",
            url: "/dashboard/mastersretailer/hallmarkchargesretailer",
            isAccessible: keys.includes("Hallmark Charges-Retailer"),
          },
        ],
      },
      {
        type: "divider",
        id: "divider-7",
      },
      {
        id: "Settingchainretailer",
        title: "Setting",
        type: "collapse",
        isAccessible:
          keys.includes("Change Password-Chain-Retailer") ||
          keys.includes("My Profile-Chain-Retailer"),
        children: [
          {
            id: "Profile",
            title: "My Profile",
            type: "item",
            url: "/dashboard/mastersretailer/profilechainretailer",
            isAccessible: keys.includes("Change Password-Chain-Retailer"),
          },
          {
            id: "ChangePassword",
            title: "Change Password",
            type: "item",
            url: "/dashboard/mastersretailer/changepasswordchain",
            isAccessible: keys.includes("My Profile-Chain-Retailer"),
          },
        ],
      },
      {
        type: "divider",
        id: "divider-8",
      },
      {
        id: "MortgageInterestSetting",
        title: "Interest Setting",
        type: "item",
        url: "/dashboard/mastersretailer/mortgageinterestsetting",
        isAccessible: keys.includes("Intrest Setting-Retailer"),
      },
    ];
    return dataArr;
  }
}

export default masterRetailerNavConfig;
