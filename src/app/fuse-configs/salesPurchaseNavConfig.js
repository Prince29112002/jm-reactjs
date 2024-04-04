class salesPurchaseNavConfig {

  static salesPurchaseNavConfigArr() {

    const dataArr = [
      {
        id: "salesinfo",
        title: "Sales Info",
        type: "collapse",
        isAccessible : true,
        children: [
          {
            id: "salesJobWorkinfo",
            title: "Sales Jobwork Info",
            type: "item",
            url: "/dashboard/sales/salejobworkinfo",
            isAccessible : true,
          },
          {
            id: "salesDomesticinfo",
            title: "Sales Domestic Info",
            type: "item",
            url: "/dashboard/sales/domesticsaleinfo",
            isAccessible : true,
          },
          {
            id: "salesb2cinfo",
            title: "Sales B2C Info",
            type: "item",
            url: "/dashboard/sales/b2csaleinfo",
            isAccessible : true,
          },
          // {
          //   id: "salesExport",
          //   title: "Sales Export",
          //   type: "item",
          //   url: "#",
          //   isAccessible : keys.includes('Issue to Hallmark'),
          // }
        ],
      },
      {
        id: "sales",
        title: "Sales",
        type: "collapse",
        isAccessible : true,
        children: [
          {
            id: "salesJobWork",
            title: "Sales Jobwork",
            type: "item",
            url: "/dashboard/sales/salejobwork",
            isAccessible : true,
          },
          {
            id: "salesDomestic",
            title: "Sales Domestic",
            type: "item",
            url: "/dashboard/sales/domesticsale",
            isAccessible : true,
          },
          {
            id: "slaesb2c",
            title: "Sales B2C",
            type: "item",
            url: "/dashboard/sales/salesb2c",
            // isAccessible : keys.includes('Sales B2C'),
            isAccessible : true,

          },
        ],
      },
      {
        type: "divider",
        id: "divider-1",
      },
      {
        id: "salesReturn",
        title: "Sales Return",
        type: "collapse",
        isAccessible : true,
        children: [
          {
            id: "salesreturnJobWork",
            title: "Sales Jobwork Return",
            type: "item",
            url: "/dashboard/sales/salesreturnjobwork",
            isAccessible : true,
          },
          {
            id: "salesreturnDomestic",
            title: "Sales Domestic Return",
            type: "item",
            url: "/dashboard/sales/salesreturndomestic",
            isAccessible : true,
          },
          // {
          //   id: "salesreturnExport",
          //   title: "Sales Export Return",
          //   type: "item",
          //   url: "#",
          //   isAccessible : true,
          // }
        ],
      },
      {
        type: "divider",
        id: "divider-2",
      },
      {
        id: "purchase",
        title: "Purchase",
        type: "collapse",
        isAccessible : true,
        children: [
          {
            id: "metal",
            title: "Metal Purchase",
            type: "item",
            url: "/dashboard/sales/metalpurchase",
            isAccessible : true,
          },
          {
            id: "jewellery",
            title: "Jewellery Purchase",
            type: "item",
            url: "/dashboard/sales/jewellerypurchase",
            isAccessible : true,
          },
          {
            id: "jewelleryArtician",
            title: "Jewellery (Artician Receive)",
            type: "item",
            url: "/dashboard/sales/articianjewellerypurchase",
            isAccessible : true,
          }, {
            id: "exportMetalPurchase",
            title: "Export Metal Purchase",
            type: "item",
            url: "/dashboard/sales/exportmetalpurchase",
            isAccessible : true,
          },
          {
            id: "consumablePurchase",
            title: "Consumable Purchase",
            type: "item",
            url: "/dashboard/sales/consumablepurchase",
            isAccessible : true,
          },
          {
            id: "rawMaterialPurchase",
            title: "Raw Material Purchase",
            type: "item",
            url: "/dashboard/sales/rawmaterialpurchase",
            isAccessible : true,
          },
        ],
      },
      {
        type: "divider",
        id: "divider-3",
      },
      {
        id: "purchaseReturn",
        title: "Purchase Return",
        type: "collapse",
        isAccessible : true,
        children: [
          {
            id: "metalPurchaseReturn",
            title: "Metal Purchase Return",
            type: "item",
            url: "/dashboard/sales/metalpurchasereturn",
            isAccessible : true,
          },
          {
            id: "jewelleryPurchaseReturn",
            title: "Jewellery Purchase Return",
            type: "item",
            url: "/dashboard/sales/jewellerypurchasereturn",
            isAccessible : true,
          },
          {
            id: "jewelleryArticianReturn",
            title: "Jewellery Purchase Return (Artician return)",
            type: "item",
            url: "/dashboard/sales/articianjewellerypurchasereturn",
            isAccessible : true,
          },
          {
            id: "consumablePurchaseReturn",
            title: "Consumable Purchase Return",
            type: "item",
            url: "/dashboard/sales/consumablepurchasereturn",
            isAccessible : true,
          },
          {
            id: "rawMaterialPurchaseReturn",
            title: "Raw Material Purchse Return",
            type: "item",
            url: "/dashboard/sales/rawmaterialpurchasereturn",
            isAccessible : true,
          }
        ],
      },
      {
        type: "divider",
        id: "divider-8",
      },
      // {
      //   id: "StockJournalVoucher",
      //   title: "Stock Journal Voucher",
      //   type: "collapse",
      //   isAccessible : true,
      //   children: [
      //     {
      //       id: "StockArticianIssueMetal",
      //       title: "Artician Issue Metal",
      //       type: "item",
      //       url: "/dashboard/sales/stockarticianissuemetal",
      //       isAccessible : true,
      //     },
      //     {
      //       id: "StockJewelleryArticianReceive",
      //       title: "Jewellery (Artician Receive)",
      //       type: "item",
      //       url: "/dashboard/sales/stockjewelpurchaseartician",
      //       isAccessible : true,
      //     },
      //     {
      //       id: "StockArticianReturnMetal",
      //       title: "Artician Return Metal",
      //       type: "item",
      //       url: "/dashboard/sales/stockarticianreturnmrtal",
      //       isAccessible : true,
      //     },  
      //   ],
      // },
      {
        type: "divider",
        id: "divider-4",
      },
      {
        id: "metal",
        title: "Metal (I/R)",
        type: "collapse",
        isAccessible : true,
        children: [
          {
            id: "JobworkMetalReceive",
            title: "Jobwork Metal Receive",
            type: "item",
            url: "/dashboard/sales/jobworkmetalreceive",
            isAccessible : true,
          },
          {
            id: "JobworkMetalReturn",
            title: "Jobwork Metal Return",
            type: "item",
            url: "/dashboard/sales/jobworkmetalreturn",
            isAccessible : true,
          },
          {
            id: "ArticianIssue",
            title: "Artician Issue Metal",
            type: "item",
            url: "/dashboard/sales/articianissue",
            isAccessible : true,
          },
          {
            id: "ArticianReturn",
            title: "Artician Return Metal",
            type: "item",
            url: "/dashboard/sales/articianreturn",
            isAccessible : true,
          }
        ],
      },
      {
        type: "divider",
        id: "divider-5",
      },
      {
        id: "rapairing",
        title: "Repairing",
        type: "collapse",
        isAccessible : true,
        children: [
          {
            id: "repairingrecfromcust",
            title: "Repairing Received from the customer",
            type: "item",
            url: "/dashboard/sales/repairingrecfromcust",
            isAccessible : true,
          },
          {
            id: "repairedreturntocust",
            title: "Repaired Jewellery return to the customer",
            type: "item",
            url: "/dashboard/sales/repairedjewelreturncust",
            isAccessible : true,
          },
          {
            id: "repairingissuetocust",
            title: "Repairing Issued to the Jobworker",
            type: "item",
            url: "/dashboard/sales/repairedisstojobwor",
            isAccessible : true,
          },
          {
            id: "repairedreturntocustoth",
            title: "Repaired Jewellery Return From the Job Worker",
            type: "item",
            url: "/dashboard/sales/repairedjewelreturnjobwork",
            isAccessible : true,
          }
        ],
      },
      {
        type: "divider",
        id: "divider-6",
      },
      {
        id: "rateFix",
        title: "Rate Fix",
        type: "collapse",
        isAccessible : true,
        children: [
          {
            id: "clientRateFix",
            title: "Client",
            type: "item",
            url: "/dashboard/sales/ratefixclient",
            isAccessible : true,
          },
          {
            id: "vendorRateFix",
            title: "Vendor",
            type: "item",
            url: "/dashboard/sales/ratefixvendor",
            isAccessible : true,
          },
          {
            id: "ratematch",
            title: "Rate Match",
            type: "item",
            url: "/dashboard/sales/ratematch",
            isAccessible : true,
          },
        ],
      },
      {
        type: "divider",
        id: "divider-7",
      },
      {
        id: "Melting",
        title: "Melting",
        type: "collapse",
        isAccessible : true ,
        children: [
          {
            id: "Melting-Issue",
            title: "Melting Issue",
            type: "item",
            url: "/dashboard/sales/meltingissue",
            isAccessible : true,
          },
          
          {
            id: "Melting-Receive",
            title: "Melting Receive",
            type: "item",
            url: "/dashboard/sales/meltingreceive",
            isAccessible : true,
          },
        ]
        
      },
      {
        type: "divider",
        id: "divider-7",
      },
      {
        id: "Other",
        title: "Other",
        type: "collapse",
        isAccessible : true,
        children: [
          {
            id: "createEstimate",
            title: "Create Estimate",
            type: "item",
            url: "/dashboard/sales/createestimate",
            isAccessible : true,
          },
          {
            id: "toolsConsumption",
            title: "Consumable Consumption",
            type: "item",
            url: "/dashboard/sales/toolsconsumption",
            isAccessible : true,
          },
          {
            id: "OpningTriBlan",
            title: "Opening Trial Balance",
            type: "item",
            url: "/dashboard/sales/OpningTriBlan",
            isAccessible : true,
          },
          {
            id: "Stone-Assortment",
            title: "Stone Assortment",
            type: "item",
            url: "/dashboard/sales/stoneassortment",
            // icon: "play_circle_outline",
            isAccessible : true,
          },
          {
            id: "Sales Consumable",
            title: "Sales Consumable",
            type: "item",
            url: "/dashboard/sales/salesconsumable",
            // icon: "play_circle_outline",
            isAccessible : true,
          },
          {
            id: "Send Of Reproduction",
            title: "Send Of Reproduction",
            type: "item",
            url: "/dashboard/sales/sendofreproduction",
            // icon: "play_circle_outline",
            isAccessible : true,
          },
         
        ],
      },
    ];
    return dataArr
  }
}

export default salesPurchaseNavConfig;
