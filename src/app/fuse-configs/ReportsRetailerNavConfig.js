class ReportsRetailerNavConfig {
  static ReportsRetailerNavConfigArr() {
    const roleOfUser = localStorage.getItem("permission")
      ? JSON.parse(localStorage.getItem("permission"))
      : null;
    const module = roleOfUser ? roleOfUser["Reports-Retailer"] : null;
    const keys = module ? Object.keys(module) : [];

    const dataArr = [
      {
        id: "SalesReports",
        title: "Sales Reports ",
        type: "item",
        url: "/dashboard/reportsretailer/salesreportsretailer",
        isAccessible: keys.includes("Sales Reports-Retailer"),
      },
      {
        id: "PurchaseReports",
        title: "Purchase Reports ",
        type: "item",
        url: "/dashboard/reportsretailer/purchaserepotsretailer",
        isAccessible: keys.includes("Purchase Reports-Retailer"),
      },
      {
        id: "JobWorkStockStatement",
        title: "Jobwork Stock Statement",
        type: "item",
        url: "/dashboard/reportsretailer/JobWorkstockstatementretailer",
        isAccessible: keys.includes("Job Work Stock Statement-Retailer"),
      },
      {
        id: "JobWorkChainStockStatement",
        title: "Jobwork Stock Statement",
        type: "item",
        url: "/dashboard/reportsretailer/JobWorkchainstockstatementretailer",
        isAccessible: keys.includes("Job Work Stock Statement-Chain-Retailer"),
      },
      {
        id: "Mortgage",
        title: "Mortgage Reports",
        type: "collapse",
        isAccessible:
          keys.includes("User Mortgage Report-Retailer") ||
          keys.includes("Paid Mortgage Loan-Retailer") ||
          keys.includes("Unpaid Loan-Retailer") ||
          keys.includes("Collection Reminder Report-Retailer"),
        children: [
          {
            id: "mortgageReport",
            title: "User Mortgage Report",
            type: "item",
            url: "/dashboard/reportsretailer/mortgagereport",
            isAccessible: keys.includes("User Mortgage Report-Retailer"),
          },
          {
            id: "paidMortgageLoan",
            title: "Paid Loan Report",
            type: "item",
            url: "/dashboard/reportsretailer/paidmortgageloan",
            isAccessible: keys.includes("Paid Mortgage Loan-Retailer"),
          },
          {
            id: "unpaidMortageReport",
            title: "Unpaid Loan Report",
            type: "item",
            url: "/dashboard/reportsretailer/unpaidmortagereport",
            isAccessible: keys.includes("Unpaid Loan-Retailer"),
          },
          {
            id: "weeklyReminderReport",
            title: "Collection Reminder Report",
            type: "item",
            url: "/dashboard/reportsretailer/weeklyreminderreport",
            isAccessible: keys.includes("Collection Reminder Report-Retailer"),
          },
        ],
      },
      {
        id: "Scheme",
        title: "Scheme Reports",
        type: "collapse",
        isAccessible:
          keys.includes("User Scheme Reports-Retailer") ||
          keys.includes("Paid Scheme Reports-Retailer") ||
          keys.includes("Unpaid Scheme Reports-Retailer"),
        children: [
          {
            id: "userSchemeReport",
            title: "User Scheme Report",
            type: "item",
            url: "/dashboard/reportsretailer/userschemereport",
            isAccessible: keys.includes("User Scheme Reports-Retailer"),
          },
          {
            id: "paidSchemeReport",
            title: "Paid Scheme Report",
            type: "item",
            url: "/dashboard/reportsretailer/paidschemereportsretailer",
            isAccessible: keys.includes("Paid Scheme Reports-Retailer"),
          },
          {
            id: "unpaidSchemeReports",
            title: "Unpaid Scheme Reports",
            type: "item",
            url: "/dashboard/reportsretailer/unpaidschemereports",
            isAccessible: keys.includes("Unpaid Scheme Reports-Retailer"),
          },
        ],
      },
      // {
      //   id: "OldJewelleryPurchaseReports",
      //   title: "Old Jewellery Purchase Reports",
      //   type: "item",
      //   url: "/dashboard/reportsretailer/oldjewellerypurchasereportsretailer",
      //   isAccessible: true,
      // },
      {
        id: "SalesPendingAmountReports",
        title: "Udhaar Amount Reports",
        type: "item",
        url: "/dashboard/reportsretailer/udhaaramountreports",
        isAccessible: keys.includes("Sales Pending Amount Reports-Retailer"),
      },
    ];
    return dataArr;
  }
}
export default ReportsRetailerNavConfig;
