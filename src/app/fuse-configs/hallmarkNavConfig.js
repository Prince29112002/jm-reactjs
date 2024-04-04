class hallmarkNavConfig{

  static hallmarkNavConfigArr(){

    const dataArr = [
      {
        id: "issueHallmark",
        title: "Issue to Hallmark",
        type: "item",
        url: "/dashboard/hallmark/issuetohallmark",
        isAccessible : true,
      },
      {
        type: "divider",
        id: "divider-1",
      },
      {
        id: "issueHallmarklist",
        title: "Hallmark Issued List",
        type: "item",
        url: "/dashboard/hallmark/issuetohallmarklist",
        isAccessible : true,
      },
      {
        type: "divider",
        id: "divider-2",
      },
      {
        id: "receiveHallmark",
        title: "Receive from Hallmark",
        type: "item",
        url: "/dashboard/hallmark/recfromhallmark",
        isAccessible : true,
      },
      {
        type: "divider",
        id: "divider-3",
      },
    ];
    return dataArr
  }
}

export default hallmarkNavConfig;
