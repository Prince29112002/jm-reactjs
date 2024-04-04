class reportNavConfig {

  static reportNavConfigArr() {
    
    const dataArr = [
      {
        id: "reportmain",
        title: "Factory Stock",
        type: "item",
        url: "/dashboard/report",
        isAccessible : true,
      },
      {
        type: "divider",
        id: "divider-0",
      },
      {
        id: "ledgerStatement",
        title: "Ledger Statement",
        type: "collapse",
        isAccessible : true,
        children: [
          {
            id: "metalledger",
            title: "Metal Ledger",
            type: "item",
            url: "/dashboard/reports/metalledger",
            isAccessible : true,
          },
          {
            id: "accountledger",
            title: "Account Ledger",
            type: "item",
            url: "/dashboard/reports/accountledger",
            isAccessible : true,
          },
          {
            id: "jobworkstmt",
            title: "Job Work Stock statement",
            type: "item",
            url: "/dashboard/reports/jobworkstmt",
            isAccessible : true,
          },
        ],
      },
      {
        type: "divider",
        id: "divider-1",
      },
      {
        id: "metalEdger",
        title: "Metal Ledger Reports ",
        type: "collapse",
        isAccessible : true,
        children: [
          {
            id: "barcode",
            title: "Barcode Generation Report ",
            type: "item",
            url: "/dashboard/reports/barcodeGeneratorReport",
            isAccessible : true,
          },
          {
            id: "barcode",
            title: "Barcode Generation Acc and Loss ",
            type: "item",
            url: "/dashboard/reports/barCodeGenerationAccAndLoss",
            isAccessible : true,
          },
          {
            id: "packinglist",
            title: "Packing List Report ",
            type: "item",
            url: "/dashboard/reports/packingListReport",
            isAccessible : true,
          },
          {
            id: "packinglistHuid",
            title: "Packing List Wise HUID ",
            type: "item",
            url: "/dashboard/reports/packingListWithHUID",
            isAccessible : true,
          },
          // {
          //   id: "metalAccBalance",
          //   title: "Party Wise Metal Account Balance ",
          //   type: "item",
          //   url: "/dashboard/reports/partyWiseMetalAccountBalance",
          //   // isAccessible: true,
          // },
        ],
      },
      {
        type: "divider",
        id: "divider-2",
      },
      {
        id: "department",
        title: "Department Report",
        type: "collapse",
        isAccessible : true,
        children: [
          {
            id: "departmentTransfer",
            title: "Department Transfer Summary",
            type: "item",
            url: "/dashboard/reports/departmentTransferSummary",
            isAccessible : true,
          },
          // {
          //   id: "departmentWiseStockReport",
          //   title: "Department Wise Stock Report",
          //   type: "item",
          //   url: "",
          // },
          {
            id: "departmentStockReport",
            title: "Stock TypeWise Departmentwise Stock Report",
            type: "item",
            url: "/dashboard/reports/StockTypeWiseDepartmentwiseStoR",
            isAccessible: true,
          },
        ],
      },
      {
        type: "divider",
        id: "divider-3",
      },
      {
        id: "Balance",
        title: "Balance Report",
        type: "collapse",
        isAccessible : true,
        children: [
          {
            id: "metalAccBalance",
            title: "Party Wise Metal Account Balance ",
            type: "item",
            url: "/dashboard/reports/partyWiseMetalAccountBalance",
            isAccessible: true,
          },
          {
            id: "hallmarkwiseInnAndOut",
            title: "Hallmark wise In and Out and Loss",
            type: "item",
            url: "/dashboard/reports/HallmarkwiseInnAndOut",
            isAccessible: true,
          },
        ],
      },
      {
        type: "divider",
        id: "divider-4",
      },
      {
        id: "mis",
        title: "MIS Report",
        type: "collapse",
        isAccessible: true,
        children: [
          {
            id: "metalAccBalance",
            title: "Rate Fix and purchase Sales List ",
            type: "item",
            url: "/dashboard/reports/rateFixandPurcSlaesList",
            isAccessible: true,
          },
          {
            id: "departmentStockReport",
            title: "Stock Type Wise Department wise Stock Report",
            type: "item",
            url: "/dashboard/reports/StockTypeWiseDepartmentwiseStoR",
            isAccessible: true,
          },
          {
            id: "misFactory",
            title: "Mis Factory Stock Report",
            type: "item",
            url: "/dashboard/reports/MisFactoryStock",
            isAccessible: true,
          },
        ],
      },
      {
        type: "divider",
        id: "divider-5",
      },
      {
        id: "finegold",
        title: "Fine Gold Report",
        type: "item",
        url: "/dashboard/reports/finegoldreport",
        isAccessible: true,
      },
      {
        id: "productionreport",
        title: "Production Report",
        type: "collapse",
        // icon: "play_circle_outline",
        isAccessible: true,
        children: [
          {
            id: "customersummarisebalance",
            title: "Customer Summaries Balance",
            type: "item",
            url: "/dashboard/reports/customersummarisebalance",
            isAccessible: true,
          },
          {
            type: "divider",
            id: "divider-24",
          },
          {
            id: "customizelossreport",
            title: "Customize Loss Report",
            type: "item",
            url: "/dashboard/reports/customizelossreport",
            isAccessible: true,
          },
          {
            type: "divider",
            id: "divider-25",
          },
          {
            id: "issuetoworkerreport",
            title: "Issue To Worker Report",
            type: "item",
            url: "/dashboard/reports/issuetoworkerreport",
            isAccessible: true,
          },
          {
            type: "divider",
            id: "divider-26",
          },
          {
            id: "receivefromworkerreport",
            title: "Receive From Worker Report",
            type: "item",
            url: "/dashboard/reports/receivefromworkerreport",
            isAccessible: true,
          },
          {
            type: "divider",
            id: "divider-27",
          },
          {
            id: "dailyproductionreport",
            title: "Daily Production Report Format - 1",
            type: "item",
            url: "/dashboard/reports/dailyproductionreport",
            isAccessible: true,
          },
          {
            type: "divider",
            id: "divider-28",
          },
          {
            id: "dailyproductionreportformatetwo",
            title: "Daily Production Report Format - 2",
            type: "item",
            url: "/dashboard/reports/dailyproductionreportformatetwo",
            isAccessible: true,
          },
          {
            type: "divider",
            id: "divider-29",
          },
          {
            id: "filingwipreport",
            title: "Filing WIP Report",
            type: "item",
            url: "/dashboard/reports/filingwipreport",
            isAccessible: true,
          },
          {
            type: "divider",
            id: "divider-30",
          },
          {
            id: "rejectionreport",
            title: "Rejection Report",
            type: "item",
            url: "/dashboard/reports/rejectionreport",
            isAccessible: true,
          },
          {
            type: "divider",
            id: "divider-31",
          },
          {
            id: "orderlistreport",
            title: "Order List Report",
            type: "item",
            url: "/dashboard/reports/orderlistreport",
            isAccessible: true,
          },
          {
            type: "divider",
            id: "divider-32",
          },
          {
            id: "orderstatusreport",
            title: "Order Status Report",
            type: "item",
            url: "/dashboard/reports/orderstatusreport",
            isAccessible: true,
          },
          {
            type: "divider",
            id: "divider-33",
          },
          {
            id: "looseitemreport",
            title: "Loose Item Report",
            type: "item",
            url: "/dashboard/reports/looseitemreport",
            isAccessible: true,
          },
        ],
      },
      {
        type: "divider",
        id: "divider-6",
      },
    ];
    return dataArr;
  }
}

export default reportNavConfig;
