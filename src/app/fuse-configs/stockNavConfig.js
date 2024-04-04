class stockNavConfig {

  static stockNavConfigArr () {
    const roleOfUser = localStorage.getItem('permission') ? JSON.parse(localStorage.getItem('permission')) : null;
    const module = roleOfUser ? roleOfUser['Stock'] : null
    const keys = module ? Object.keys(module) : []

    const dataArr = [
      {
        id: "transferstock",
        title: "Stock Transfer",
        type: "item",
        url: "/dashboard/stock/:stock?transferstocks",
        isAccessible : keys.includes('Stock Transfer'),
      },
      {
        type: "divider",
        id: "divider-1",
      },
      {
        id: "accepttransferstock",
        title: "Accept Stock Transfer",
        type: "item",
        url: "/dashboard/stock/accepttransferstock/:stock",
        isAccessible : keys.includes('Accept Stock Transfer'),
      },
      {
        type: "divider",
        id: "divider-2",
      },
    ];
    return dataArr
  }
}

export default stockNavConfig;
