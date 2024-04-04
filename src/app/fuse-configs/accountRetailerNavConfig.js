class accountRetailerNavConfig {

    static accountRetailerNavConfigArr(){
  
      const isSuperAdmin = localStorage.getItem('isSuperAdmin');
      const roleOfUser = localStorage.getItem('permission') ? JSON.parse(localStorage.getItem('permission')) : null;
      const module = roleOfUser ? roleOfUser['Accounts-Retailer'] : null
      const keys = module ? Object.keys(module) : []
  
      const dataArr = [
        {
          id: "createaccountretailer",
          title: "Accounts",
          type: "item",
          url: "/dashboard/accountretailer/createaccountretailer",
          isAccessible : keys.includes('Account-Retailer'),
        },
        {
          type: "divider",
          id: "divider-1",
        },
        {
          id: "vouchersretailer",
          title: "Vouchers",
          type: "collapse",
          isAccessible : keys.includes('Vouchers-Retailer') || keys.includes('Other Voucher-Retailer') 
                         || keys.includes('Vouchers Entry-Retailer')  || keys.includes('Vouchers History-Retailer'),
          children: [
              {
                id: "vouchersretailer",
                title: "Vouchers",
                type: "item",
                url: "/dashboard/accountretailer/voucherlistretailer",
                isAccessible : keys.includes('Vouchers-Retailer'),
              },
              {
                id: "othervouchersretailer",
                title: "Other Accounting Vouchers",
                type: "item",
                url: "/dashboard/accountretailer/otheraccvoucherretailer",
                isAccessible : keys.includes('Other Voucher-Retailer'),
              },
              {
                id: "voucherentryretailer",
                title: "Voucher Entry",
                type: "item",
                url: "/dashboard/accountretailer/voucherentryretailer",
                isAccessible : keys.includes('Vouchers Entry-Retailer'),
              },
              {
                id: "voucherhistoryretailer",
                title: "Voucher History",
                type: "item",
                url: "/dashboard/accountretailer/voucherhistoryretailer",
                isAccessible : keys.includes('Vouchers History-Retailer'),
              },
            ],
          },
          {
            type: "divider",
            id: "divider-2",
          },
          {
            id: "ledgerReportGrpRetailer",
            title: "Ledger Report Group Wise",
            type: "item",
            url: "/dashboard/accountretailer/ledgerreportretailer",
            isAccessible : keys.includes('Ledger Report Group Wise-Retailer'),
          },
          {
            type: "divider",
            id: "divider-3",
          },
          {
            id: "ledgerReportAccRetailer",
            title: "Ledger Report Ledger Wise",
            type: "item",
            url: "/dashboard/accountretailer/ledgerrepaccretailer",
            isAccessible : keys.includes('Ledger Report Ledger Wise-Retailer'),
          },
          {
            type: "divider",
            id: "divider-4",
          },
          {
            id: "voucherdeletehistoryRetailer",
            title: "Deleted Voucher",
            type: "item",
            url:"/dashboard/accountretailer/deletevoucherretailer",
            isAccessible : isSuperAdmin == 1 ? true : false,
          },
          {
            type: "divider",
            id: "divider-5",
          },
        ];
      return dataArr
      }
  }
  
  export default accountRetailerNavConfig;
  