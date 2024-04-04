class accountNavConfig {

  static accountNavConfigArr(){

    const isSuperAdmin = localStorage.getItem('isSuperAdmin');

    const dataArr = [
      {
        id: "createaccount",
        title: "Accounts",
        type: "item",
        url: "/dashboard/accounts/createaccount",
        isAccessible : true,
      },
      {
        type: "divider",
        id: "divider-0",
      },
      {
        id: "vouchers",
        title: "Vouchers",
        type: "collapse",
        isAccessible : true,
        children: [
            {
              id: "vouchers",
              title: "Vouchers",
              type: "item",
              url: "/dashboard/accounts/voucherlist",
              isAccessible : true,
            },
            {
              id: "voucherentry",
              title: "Voucher Entry",
              type: "item",
              url: "/dashboard/accounts/voucherentry",
              isAccessible : true,
            },
            {
              id: "othervouchers",
              title: "Other Accounting Vouchers",
              type: "item",
              url: "/dashboard/accounts/othervoucherlist",
              isAccessible : true,
            },
            {
              id: "voucherhistory",
              title: "Voucher History",
              type: "item",
              url: "/dashboard/accounts/voucherhistory",
              isAccessible : true,
            },
          ],
        },
        {
          type: "divider",
          id: "divider-1",
        },
        {
          id: "ledgerReportGrp",
          title: "Ledger Report Group Wise",
          type: "item",
          url: "/dashboard/accounts/ledgerreportgroup",
          isAccessible : true,
        },
        {
          type: "divider",
          id: "divider-2",
        },
        {
          id: "ledgerReportAcc",
          title: "Ledger Report Ledger Wise",
          type: "item",
          url: "/dashboard/accounts/ledgerreportledger",
          isAccessible : true,
        },
        {
          type: "divider",
          id: "divider-3",
        },
        {
          id: "voucherdeletehistory",
          title: "Deleted Voucher",
          type: "item",
          url: "/dashboard/accounts/deletedvoucher",
          isAccessible : isSuperAdmin == 1 ? true : false,
        },
        {
          type: "divider",
          id: "divider-4",
        },
      ];
    return dataArr
    }
}

export default accountNavConfig;
