class salesPurchaseRetaiNerNavConfig {
  static salesPurchaseNavRetailerConfigArr() {

    const roleOfUser = localStorage.getItem('permission') ? JSON.parse(localStorage.getItem('permission')) : null;
    const module = roleOfUser ? roleOfUser['Sales-Retailer'] : null
    const keys = module ? Object.keys(module) : []

    const dataArr = [
      {
        id: "purchase",
        title: "Purchase",
        type: "collapse",
        isAccessible: keys.includes('Metal Purchase-Retailer') || keys.includes('Jewellery Purchase-Retailer'),
        children: [
          {
            id: "metalRetailer",
            title: "Metal Purchase",
            type: "item",
            url: "/dashboard/sales/metalpurchaseretailer",
            isAccessible: keys.includes('Metal Purchase-Retailer'),
          },
          {
            id: "jewelleryRetailer",
            title: "Jewellery Purchase",
            type: "item",
            url: "/dashboard/sales/jewellerypurchaseretailer",
            isAccessible: keys.includes('Jewellery Purchase-Retailer'),
          },
        ],
      },
      {
        type: "divider",
        id: "divider-1",
      },

      {
        id: "metal",
        title: "Metal (I/R)",
        type: "collapse",
        isAccessible: keys.includes('Artician Issue Metal-Retailer') || keys.includes('Artician Return Metal-Retailer'),
        children: [
          {
            id: "ArticianIssueReatiler",
            title: "Artician Issue Metal",
            type: "item",
            url: "/dashboard/sales/articianissueiretailer",
            isAccessible: keys.includes('Artician Issue Metal-Retailer'),
          },
          {
            id: "ArticianReturnReatiler",
            title: "Artician Return Metal ",
            type: "item",
            url: "/dashboard/sales/articianreturnretailer",
            isAccessible: keys.includes('Artician Return Metal-Retailer'),
          },
        ],
      },
      {
        type: "divider",
        id: "divider-3",
      },
      {
        id: "SalesRetalier",
        title: "Sales",
        type: "item",
        url: "/dashboard/sales/salesretalier",
        isAccessible: keys.includes('Sales Domestic-Retailer'),
      },
      {
        type: "divider",
        id: "divider-4",
      },
      {
        id: "ArticianIssueReatiler",
        title: parseFloat(window.localStorage.getItem("isChainZamZam")) === 1 ? "Fine Gold" : "Issue Metal",
        type: "item",
        url: "/dashboard/sales/articianissuechainretailer",
        isAccessible: keys.includes('Artician Issue Metal-Chain-Retailer'),
      },
      {
        type: "divider",
        id: "divider-5",
      },
      {
        id: "ArticianReturnReatiler",
        title: parseFloat(window.localStorage.getItem("isChainZamZam")) === 1 ? "Chains" : "Return Metal",
        type: "item",
        url: "/dashboard/sales/articianreturnchainretailer",
        isAccessible: keys.includes('Artician Return Metal-Chain-Retailer'),
      },
      // {
      //   id: "metalChain",
      //   title: "Metal (I/R)",
      //   type: "collapse",
      //   isAccessible: keys.includes('Artician Issue Metal-Chain-Retailer') || keys.includes('Artician Return Metal-Chain-Retailer'),
      //   children: [
      //     {
      //       id: "ArticianIssueReatiler",
      //       title: "Artician Issue Metal",
      //       type: "item",
      //       url: "/dashboard/sales/articianissuechainretailer",
      //       isAccessible: keys.includes('Artician Issue Metal-Chain-Retailer'),
      //     },
      //     {
      //       id: "ArticianReturnReatiler",
      //       title: "Artician Return Metal ",
      //       type: "item",
      //       url: "/dashboard/sales/articianreturnchainretailer",
      //       isAccessible: keys.includes('Artician Return Metal-Chain-Retailer'),
      //     },
      //   ],
      // },
      {
        type: "divider",
        id: "divider-6",
      },
    //   {
    //     id:"OldJewelleryPurchase",
    //     title: "Old jewellery purchase",
    //     type: "item",
    //     url: "/dashboard/sales/oldjewellerypurchase",
    //     isAccessible: true,
    // },

    ];
    return dataArr;
  }
}
export default salesPurchaseRetaiNerNavConfig;
