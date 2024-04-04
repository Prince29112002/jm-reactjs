class desingNavConfig {

  static desingNavConfigArr (){

    const dataArr = [
      {
        id: "productdevelopment",
        title: "ProductDevelopment",
        type: "item",
        url: "/dashboard/design/productdevelopment",
        isAccessible : true,
      },
      {
        type: "divider",
        id: "divider-1",
      },
      {
          id: "designlist",
          title: "Variant Master",
          type: "item",
          url: "/dashboard/design/designlist",
          isAccessible : true,
        },
      ];
    return dataArr;
  }
}
  
export default desingNavConfig;
  