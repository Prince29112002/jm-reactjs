class taggingRetailerNavConfig {

    static taggingRetailerNavConfigArr () {
  
      const roleOfUser = localStorage.getItem('permission') ? JSON.parse(localStorage.getItem('permission')) : null;
      const module = roleOfUser ? roleOfUser['Tagging-Retailer'] : null
      const keys = module ? Object.keys(module) : []
  
      const dataArr = [
        {
          id: "tagginglistretailer",
          title: "Tagging List",
          type: "item",
          url: "/dashboard/stocktaggingretailer",
          isAccessible : true,
        },
        {
          type: "divider",
          id: "divider-4",
        },
        {
          id: "generatebarcoderetailer",
          title: "Generate Barcode",
          type: "item",
          url: "/dashboard/taggingretailer/generatebarcoderetailer",
          isAccessible :  keys.includes('Generate Barcode-Retailer'),
        },
        {
          type: "divider",
          id: "divider-5",
        },
      
        {
          id: "regeneratebarcoderetailer",
          title: "Re-Generate Barcode",
          type: "item",
          url: "/dashboard/taggingretailer/regeneratebarcoderetailer",
          isAccessible : keys.includes('Re-Generate Barcode-Retailer'),
        },
        {
          type: "divider",
          id: "divider-7",
        },
      ];
      return dataArr
    }
  }
  
  export default taggingRetailerNavConfig;
  