class DbjTaggingNavConfig {
  static DbjTaggingNavConfigArr() {
    const roleOfUser = localStorage.getItem("permission")
      ? JSON.parse(localStorage.getItem("permission"))
      : null;
    const module = roleOfUser ? roleOfUser["DBJewellers-Retailer"] : null;
    const keys = module ? Object.keys(module) : [];

    const dataArr = [
      {
        id: "taggingsheet",
        title: "Taggin Sheet For Real Dimond",
        type: "item",
        url: "/dashboard/dbjeweler",
        isAccessible: keys.includes("DBJewellers list-Retailer"),
      },
      {
        type: "divider",
        id: "divider-1",
      },
      {
        id: "generatedtaglist",
        title: "Real Dimond Stock Sheet",
        type: "item",
        url: "/dashboard/dbjgeneratedtag",
        isAccessible: keys.includes("DBJewellers list-Retailer"),
      },
      {
        type: "divider",
        id: "divider-2",
      },
      {
        id: "taggingsheetforcolorstone",
        title: "Tagging Sheet For Color Stone",
        type: "item",
        url: "/dashboard/dbjcolorstone",
        isAccessible: keys.includes("DBJewellers list-Retailer"),
      },
      {
        type: "divider",
        id: "divider-3",
      },
      {
        id: "colorstonestocksheet",
        title: "Color Stone Stock Sheet",
        type: "item",
        url: "/dashboard/dbjcolorstonestocksheet",
        isAccessible: keys.includes("DBJewellers list-Retailer"),
      },
      {
        type: "divider",
        id: "divider-4",
      },
      {
        id: "exportstocksheet",
        title: "Export Stock Sheet",
        type: "item",
        url: "/dashboard/exportstocksheet",
        isAccessible: keys.includes("DBJewellers list-Retailer"),
      },
      {
        type: "divider",
        id: "divider-5",
      },
    ];
    return dataArr;
  }
}

export default DbjTaggingNavConfig;
