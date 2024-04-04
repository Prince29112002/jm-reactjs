import jwtService from "app/services/jwtService";
import navigationConfig from "app/fuse-configs/navigationConfig";
import salesPurchaseNavConfig from "app/fuse-configs/salesPurchaseNavConfig";
import taggingNavConfig from "app/fuse-configs/taggingNavConfig";
import hallmarkNavConfig from "app/fuse-configs/hallmarkNavConfig";
import desingNavConfig from "app/fuse-configs/designNavConfig";
import stockNavConfig from "app/fuse-configs/stockNavConfig";
import reportNavConfig from "app/fuse-configs/reportNavConfig";
import accountNavConfig from "app/fuse-configs/accountNavConfig";
import accountRetailerNavConfig from "app/fuse-configs/accountRetailerNavConfig";
import masterRetailerNavConfig from "app/fuse-configs/masterRetailerNavConfig";
import mobAppAdminAppConfig from "app/fuse-configs/mobAppAdminAppConfig";
import mobAppAdminRetailerAppConfig from "app/fuse-configs/mobAppAdminRetailerAppConfig";
import taggingRetailerNavConfig from "app/fuse-configs/taggingRetailerNavConfig";
import ReportsRetailerNavConfig from "app/fuse-configs/ReportsRetailerNavConfig";
import { setDefaultSettings } from "app/store/actions/fuse";
import * as Actions from "app/store/actions";
import salesPurchaseRetaiNerNavConfig from "app/fuse-configs/salesPurchaseRetaiNerNavConfig";
import DbjTaggingNavConfig from "app/fuse-configs/DbjTaggingNavConfig";

const horoZontalSettings = {
  layout: {
    style: "layout2",
    config: {
      scroll: "content",
      navbar: {
        display: false,
        // folded  : true, to always open false, default is false
        position: "left",
      },
      toolbar: {
        display: true,
        style: "fixed",
        position: "above",
      },
      footer: {
        display: false,
        style: "fixed",
        position: "below",
      },
      mode: "fullwidth",
    },
  },
  customScrollbars: false,
  theme: {
    main: "default",
    navbar: "default",
    toolbar: "default",
    footer: "default",
  },
};

const DashboardSettings = {
  layout: {
    style: "layout2",
    config: {
      scroll: "content",
      navbar: {
        display: false,
        // folded  : true, to always open false, default is false
        position: "right",
      },
      toolbar: {
        display: true,
        style: "fixed",
        position: "above",
      },
      footer: {
        display: false,
        style: "fixed",
        position: "below",
      },
      mode: "fullwidth",
    },
  },
  customScrollbars: false,
  theme: {
    main: "default",
    navbar: "default",
    toolbar: "default",
    footer: "default",
  },
};

const LoginSettings = {
  layout: {
    style: "layout1",
    config: {
      scroll: "content",
      navbar: {
        display: false,
        // folded  : true, to always open false, default is false
        position: "right",
      },
      toolbar: {
        display: false,
        style: "fixed",
        position: "above",
      },
      footer: {
        display: false,
        style: "fixed",
        position: "below",
      },
      mode: "fullwidth",
    },
  },
  customScrollbars: false,
  theme: {
    main: "default",
    navbar: "default",
    toolbar: "default",
    footer: "default",
  },
};

const NavbarSetting = (selected, dispatchMethod) => {
  console.log(selected, "whichmodule");
  switch (selected) {
    case "Master": {
      localStorage.setItem("headingName", "ALL MASTERS");
      dispatchMethod(setDefaultSettings(horoZontalSettings));
      // jwtService.setLayoutSettings(horoZontalSettings);
      dispatchMethod(
        Actions.setNavigation(navigationConfig.navigationConfigArr())
      );
      // jwtService.setNavigation(navigationConfig);
      break;
    }
    case "Reports-Retailer": {
      localStorage.setItem("headingName", "Reports Retailer");
      dispatchMethod(setDefaultSettings(horoZontalSettings));
      // jwtService.setLayoutSettings(horoZontalSettings);
      dispatchMethod(
        Actions.setNavigation(
          ReportsRetailerNavConfig.ReportsRetailerNavConfigArr()
        )
      );
      // jwtService.setNavigation(navigationConfig);
      break;
    }
    case "Master-Retailer": {
      localStorage.setItem("headingName", "ALL MASTERS Retailer");
      dispatchMethod(setDefaultSettings(horoZontalSettings));
      // jwtService.setLayoutSettings(horoZontalSettings);
      dispatchMethod(
        Actions.setNavigation(
          masterRetailerNavConfig.masterRetailerNavConfigArr()
        )
      );
      // jwtService.setNavigation(navigationConfig);
      break;
    }

    case "Sales": {
      localStorage.setItem("clientSelected", null);
      localStorage.setItem("firmSelected", null);
      localStorage.setItem("headingName", "SALES / PURCHASE ACTION");
      dispatchMethod(setDefaultSettings(horoZontalSettings));
      // jwtService.setLayoutSettings(horoZontalSettings);
      dispatchMethod(
        Actions.setNavigation(
          salesPurchaseNavConfig.salesPurchaseNavConfigArr()
        )
      );
      // jwtService.setNavigation(salesPurchaseNavConfig);
      break;
    }
    case "Sales-Retailer": {
      localStorage.setItem("clientSelected", null);
      localStorage.setItem("firmSelected", null);
      localStorage.setItem("headingName", "SALES / PURCHASE Retailer");
      dispatchMethod(setDefaultSettings(horoZontalSettings));
      // jwtService.setLayoutSettings(horoZontalSettings);
      dispatchMethod(
        Actions.setNavigation(
          salesPurchaseRetaiNerNavConfig.salesPurchaseNavRetailerConfigArr()
        )
      );
      // jwtService.setNavigation(navigationConfig);
      break;
    }
    case "Tagging": {
      localStorage.setItem("headingName", "TAGGING ACTION");
      dispatchMethod(setDefaultSettings(horoZontalSettings));
      // jwtService.setLayoutSettings(horoZontalSettings);
      dispatchMethod(
        Actions.setNavigation(taggingNavConfig.taggingNavConfigArr())
      );
      // jwtService.setNavigation(taggingNavConfig);
      break;
    }

    case "Tagging-Retailer": {
      localStorage.setItem("headingName", "TAGGING ACTION");
      dispatchMethod(setDefaultSettings(horoZontalSettings));
      // jwtService.setLayoutSettings(horoZontalSettings);
      dispatchMethod(
        Actions.setNavigation(
          taggingRetailerNavConfig.taggingRetailerNavConfigArr()
        )
      );
      // jwtService.setNavigation(taggingNavConfig);
      break;
    }

    case "Hallmark": {
      localStorage.setItem("headingName", "HALLMARK ACTION");
      dispatchMethod(setDefaultSettings(horoZontalSettings));
      // jwtService.setLayoutSettings(horoZontalSettings);
      dispatchMethod(
        Actions.setNavigation(hallmarkNavConfig.hallmarkNavConfigArr())
      );
      // jwtService.setNavigation(hallmarkNavConfig);
      break;
    }

    case "Stock": {
      localStorage.setItem("headingName", "STOCK ACTION");
      dispatchMethod(setDefaultSettings(horoZontalSettings));
      // jwtService.setLayoutSettings(horoZontalSettings);
      dispatchMethod(Actions.setNavigation(stockNavConfig.stockNavConfigArr()));
      // jwtService.setNavigation(stockNavConfig);
      break;
    }

    case "Stock-Retailer": {
      dispatchMethod(setDefaultSettings(DashboardSettings));
      break;
    }
    case "Orders-Retailer": {
      dispatchMethod(setDefaultSettings(DashboardSettings));
      break;
    }

    case "Accounts": {
      localStorage.setItem("headingName", "ACCOUNT ACTION");
      dispatchMethod(setDefaultSettings(horoZontalSettings));
      // jwtService.setLayoutSettings(horoZontalSettings);
      dispatchMethod(
        Actions.setNavigation(accountNavConfig.accountNavConfigArr())
      );
      // jwtService.setNavigation(accountNavConfig);
      break;
    }
    case "Accounts-Retailer": {
      localStorage.setItem("headingName", "ACCOUNT ACTION RETAILER");
      dispatchMethod(setDefaultSettings(horoZontalSettings));
      // jwtService.setLayoutSettings(horoZontalSettings);
      dispatchMethod(
        Actions.setNavigation(
          accountRetailerNavConfig.accountRetailerNavConfigArr()
        )
      );
      // jwtService.setNavigation(accountNavConfig);
      break;
    }

    case "Factory Report": {
      localStorage.setItem("headingName", "REPORTS ACTION");
      dispatchMethod(setDefaultSettings(horoZontalSettings));
      // jwtService.setLayoutSettings(horoZontalSettings);
      dispatchMethod(
        Actions.setNavigation(reportNavConfig.reportNavConfigArr())
      );
      // jwtService.setNavigation(reportNavConfig);
      break;
    }

    case "Mobile-app Admin": {
      localStorage.setItem("headingName", "MOBILE APP ADMIN");
      dispatchMethod(setDefaultSettings(horoZontalSettings));
      // jwtService.setLayoutSettings(horoZontalSettings);
      dispatchMethod(
        Actions.setNavigation(mobAppAdminAppConfig.mobAppAdminAppConfigArr())
      );
      // jwtService.setNavigation(mobAppAdminAppConfig);
      break;
    }
    case "Mobile-app-Retailer Admin": {
      localStorage.setItem("headingName", "MOBILE APP ADMIN RETAILER");
      dispatchMethod(setDefaultSettings(horoZontalSettings));
      // jwtService.setLayoutSettings(horoZontalSettings);
      dispatchMethod(
        Actions.setNavigation(
          mobAppAdminRetailerAppConfig.mobAppAdminRetailerAppConfig()
        )
      );
      // jwtService.setNavigation(mobAppAdminRetailerAppConfig);
      break;
    }

    case "Design": {
      localStorage.setItem("headingName", "DESIGN ACTION");
      dispatchMethod(setDefaultSettings(horoZontalSettings));
      // jwtService.setLayoutSettings(horoZontalSettings);
      dispatchMethod(
        Actions.setNavigation(desingNavConfig.desingNavConfigArr())
      );
      // jwtService.setNavigation(desingNavConfig);
      break;
    }

    case "Dashboard": {
      dispatchMethod(setDefaultSettings(DashboardSettings));
      // jwtService.setLayoutSettings(DashboardSettings);
      break;
    }

    case "Login": {
      dispatchMethod(setDefaultSettings(LoginSettings));
      // jwtService.setLayoutSettings(LoginSettings);
      break;
    }

    case "Mortage-Retailer": {
      dispatchMethod(setDefaultSettings(DashboardSettings));
      break;
    }
    case "Scheme-Retailer": {
      dispatchMethod(setDefaultSettings(DashboardSettings));
      break;
    }
    case "Resettoken": {
      dispatchMethod(setDefaultSettings(LoginSettings));
      break;
    }
    case "Orders": {
      dispatchMethod(setDefaultSettings(DashboardSettings));
      break;
    }

    case "DBJewellers-Retailer": {
      localStorage.setItem("headingName", "DBJewellers-Retailer");
      dispatchMethod(setDefaultSettings(horoZontalSettings));
      // jwtService.setLayoutSettings(horoZontalSettings);
      dispatchMethod(
        Actions.setNavigation(DbjTaggingNavConfig.DbjTaggingNavConfigArr())
      );

      // jwtService.setNavigation(navigationConfig);
      break;
      console.log();
    }
  }
};

export default NavbarSetting;
