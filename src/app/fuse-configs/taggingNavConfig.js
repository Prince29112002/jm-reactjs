class taggingNavConfig {

  static taggingNavConfigArr () {

    const roleOfUser = localStorage.getItem('permission') ? JSON.parse(localStorage.getItem('permission')) : null;
    const module = roleOfUser ? roleOfUser['Tagging'] : null
    const keys = module ? Object.keys(module) : []

    const dataArr = [
      {
        id: "stockshome",
        title: "Stock",
        type: "collapse",
        isAccessible : true,
        children: [
          {
            id: "home",
            title: "Stock List",
            type: "item",
            url: "/dashboard/stock",
            isAccessible : keys.includes('Tagging List'),
          },
          {
            id: "transfer",
            title: "Transfer",
            type: "item",
            url: "/dashboard/stock?transferstock",
            isAccessible : keys.includes('Transfer'),
          },
          {
            id: "accepttransfer",
            title: "Accept Transfer",
            type: "item",
            url: "/dashboard/stock/accepttransferstock",
            isAccessible : keys.includes('Accept Transfer'),
          },
        ],
      },
      {
        type: "divider",
        id: "divider-1",
      },
    
      {
        id: "tagmaklot",
        title: "Tag Making (LOT)",
        type: "item",
        url: "/dashboard/stock?tagmakinglot",
        isAccessible : keys.includes('Tag Making (LOT)'),
      },
      {
        type: "divider",
        id: "divider-4",
      },
      {
        id: "regenbarcode",
        title: "Re-Generate Barcode",
        type: "item",
        url: "/dashboard/tagging/regenbarcode",
        isAccessible :  keys.includes('Re-Generate Barcode'),
      },
      {
        type: "divider",
        id: "divider-5",
      },
    
      {
        id: "createpacket",
        title: "Create Packet",
        type: "item",
        url: "/dashboard/tagging/createpacket",
        isAccessible : keys.includes('Create Packet'),
      },
      {
        type: "divider",
        id: "divider-7",
      },
      {
        id: "packingslip",
        title: "Packing Slip",
        type: "item",
        url: "/dashboard/tagging/packingslip",
        isAccessible : keys.includes('Packing Slip'),
      },
      {
        type: "divider",
        id: "divider-8",
      },
      {
        id: "unreserved",
        title: "Unreserved",
        type: "item",
        url: "/dashboard/tagging/unreserved",
        isAccessible : keys.includes('Unreserved'),
      },
      {
        type: "divider",
        id: "divider-9",
      },
    ];
    return dataArr
  }
}

export default taggingNavConfig;
