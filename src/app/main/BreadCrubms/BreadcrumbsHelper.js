import React from "react";
import { Typography } from "@material-ui/core";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import { Link as RouterLink } from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import PropTypes from "prop-types";
import { Route } from "react-router";
import { withStyles } from "@material-ui/core/styles";

const breadcrumbNameMap = {
  "/dashboard": "Dashboard",
  "/dashboard/masters": "Masters",
  "/dashboard/masters/itemtype": "Main Type",
  "/dashboard/masters/stockgroup": "Stock Group",
  "/dashboard/masters/stockname": "Stock Type",
  "/dashboard/masters/systemuser": "System Users",
  "/dashboard/masters/employee": "Employee",
  "/dashboard/masters/addemployee": "Add Employee",
  "/dashboard/masters/clients": "Clients",
  "/dashboard/masters/addclient": "Add New Client",
  "/dashboard/masters/productcategory": "Product Category",
  "/dashboard/masters/HSNMaster": "HSN Master",
  "/dashboard/masters/department": "Department",
  "/dashboard/masters/process": "Process",
  "/dashboard/masters/salesrateprofile": "Sales Rate Profile",
  "/dashboard/masters/taggingrateprofile": "Tagging Rate Profile",
  "/dashboard/masters/jobworkervendorrateprof":
    "job Worker & Vendor Rate Profile",
  "/dashboard/masters/vendors": "Vendors",
  "/dashboard/masters/addvendor": "Add New Vendor",
  "/dashboard/masters/editclient": "Edit Client",
  "/dashboard/masters/btocclient": "B2C Client",
  "/dashboard/masters/userrole": "User Role",
  "/dashboard/masters/editvendor": "Edit Vendor",
  "/dashboard/masters/jobworker": "Job Worker",
  "/dashboard/masters/addjobworker": "Add Job Worker",
  "/dashboard/masters/editjobworker": "Edit Job Worker",
  "/dashboard/masters/salesman": "Salesman",
  "/dashboard/masters/addsalesman": "Add Salesman",
  "/dashboard/masters/editsalesman": "Edit Salesman",
  "/dashboard/masters/workstation": "Work Station",
  "/dashboard/masters/hallmarkstation": "Hallmark Station",
  "/dashboard/masters/addworkstation": "Add Work Station",
  "/dashboard/masters/editworkstation": "Edit Work Station",
  "/dashboard/masters/weighttolerance": "Weight Tolerance",
  "/dashboard/masters/finishpurity": "Finish Purity Master",
  "/dashboard/masters/state": "State Master",
  "/dashboard/masters/settingmethod": "Setting Method",
  "/dashboard/masters/bagging": "Bagging",
  "/dashboard/masters/typeofsetting": "Type of Setting",
  "/dashboard/masters/ledgerrate": "TCS / TDS Ledger Rate",
  "/dashboard/sales": "Sales",
  "/dashboard/sales/ratefixclient": "Rate Fix Client",
  "/dashboard/sales/addrateClient": "Add Rate Fix Client",
  "/dashboard/sales/ratefixvendor": "Rate Fix Vendor",
  "/dashboard/sales/addratevendor": "Add Rate Fix Vendor",
  "/dashboard/sales/ratematch": "Rate Match",
  "/dashboard/accounts/createaccount": "Create Account",
  "/dashboard/accounts/voucherlist": "Vouchers",
  "/dashboard/accounts/editvoucher": "Edit Voucher",
  "/dashboard/accounts/voucherentry": "Voucher Entry",
  "/dashboard/accounts/voucherhistory": "Voucher History",
  "/dashboard/sales/metalpurchase": "Metal Purchase",
  "/dashboard/sales/addmetalpurchase": "Add Metal Purchase",
  "/dashboard/sales/jewellerypurchase": "Jewellery Purchase",
  "/dashboard/sales/addjewellerypurchase": "Add Jewellery Purchase",
  "/dashboard/sales/articianjewellerypurchase": "Jewellery Purchase (Artician)",
  "/dashboard/sales/addarticianjewellerypurchase":
    "Add Jewellery Purchase (Artician)",
  "/dashboard/sales/exportmetalpurchase": "Export Metal Purchase",
  "/dashboard/sales/addexportmetalpurchase": "Add Export Metal Purchase",
  "/dashboard/sales/consumablepurchase": "Consumable Purchase",
  "/dashboard/sales/addconsumablepurchase": "Add Consumable Purchase",
  "/dashboard/sales/rawmaterialpurchase": "Raw Material Purchase",
  "/dashboard/sales/addrawmaterialpurchase": "Add Raw Material Purchase",
  "/dashboard/sales/domesticsale": "Sales Invoice (Domestic)",
  "/dashboard/sales/salejobwork": "Sales Invoice (Jobwork)",
  "/dashboard/accounts": "Account",
  "/dashboard/tagging": "Tagging",
  "/dashboard/tagging/accepttransfer": "Accept Transfer",
  "/dashboard/tagging/regenbarcode": "Re-Generate Barcode",
  "/dashboard/tagging/tagmakingmix": "Tag Making Mix",
  "/dashboard/tagging/tagmakinglot": "Tag Macking Lot",
  "/dashboard/tagging/createpacket": "Create Packet",
  "/dashboard/tagging/editpacket": "Edit Packet",
  "/dashboard/tagging/packingslip": "Packing Slip",
  "/dashboard/tagging/editpackingslip": "Edit Packing Slip",
  "/dashboard/tagging/unreserved": "Unreserved BarCode",
  "/dashboard/sales/metalpurchasereturn": "Metal Purchase Return",
  "/dashboard/sales/consumablepurchasereturn": "Consumable Purchase Return",
  "/dashboard/sales/rawmaterialpurchasereturn": "Raw Material Purchase Return",
  "/dashboard/sales/jewellerypurchasereturn": "Jewellery Purchase Return",
  "/dashboard/sales/articianjewellerypurchasereturn":
    "Jewellery Purchase Return (Artician return)",
  "/dashboard/sales/jobworkmetalreceive": "Jobwork Metal Receive",
  "/dashboard/sales/jobworkmetalreturn": "Jobwork Metal Return",
  "/dashboard/sales/articianreturn": "Artician Return Metal",
  "/dashboard/sales/articianissue": "Artician Issue Metal",
  "/dashboard/reports": "Reports",
  "/dashboard/reports/metalledger": "Metal Ledger Statement",
  "/dashboard/reports/accountledger": "Account Ledger",
  "/dashboard/reports/jobworkstmt": "Job Work Stock statement",
  "/dashboard/design": "Design",
  "/dashboard/design/editdesign": "Edit design",
  "/dashboard/design/collectionvarinatwise": "Design Combination",
  "/dashboard/design/collectionsizewise": "Size Combination",
  "/dashboard/design/receivefworker": "CAM",
  "/dashboard/sales/repairingrecfromcust":
    "Repairing Received From the Customer",
  "/dashboard/sales/repairedjewelreturncust":
    "Repaired Jewellery Return to the Customer",
  "/dashboard/masters/goldrate": "Gold Rate",
  "/dashboard/sales/repairedisstojobwor": "Repairing Issued to the Jobworker",
  "/dashboard/sales/repairedjewelreturnjobwork":
    "Repaired Jewellery return from the job worker",
  "/dashboard/hallmark": "Hallmark",
  "/dashboard/sales/salesreturnjobwork": "Sales Return Voucher (Jobwork)",
  "/dashboard/sales/salesreturndomestic": "Sales Return Voucher (Domestic)",
  "/dashboard/sales/createestimate": "Create Estimate",
  "/dashboard/hallmark/accepthmtransfer": "Accept Transfer",
  "/dashboard/hallmark/issuetohallmark": "Issue to Hallmark",
  "/dashboard/hallmark/recfromhallmark": "Receive For Hallmarking",
  "/dashboard/sales/addmetalpurchasereturn": "Add Metal Purchase Return",
  "/dashboard/sales/addjewellerypurchasereturn":
    "Add Jewellery Purchase Return",
  "/dashboard/sales/addconsumablepurchasereturn":
    "Add Consumable Purchase Return",
  "/dashboard/sales/addrawmaterialpurchasereturn":
    "Add Raw Material Purchase Return",
  "/dashboard/sales/addjobworkmetalreceive": "Add Jobwork Metal Receive",
  "/dashboard/sales/addjobworkmetalreturn": "Add Jobwork Metal Return",
  "/dashboard/sales/addarticianissue": "Add Artician Issue Metal",
  "/dashboard/sales/addarticianreturn": "Add Artician Return Metal",
  "/dashboard/sales/addrepairingrecfromcust":
    "Add Repairing Received From the Customer",
  "/dashboard/sales/addrepairedjewelreturncust":
    "Add Repaired Jewellery return to the customer",
  "/dashboard/sales/addrepairedisstojobwor":
    "Add Repairing Issued to the Jobworker",
  "/dashboard/sales/addrepairedjewelreturnjobwork":
    "Add Repaired Jewellery Return From the Job Worker",
  "/dashboard/sales/addarticianjewellerypurchasereturn":
    "Add Jewellery Purchase Return (Artician Return)",
  "/dashboard/sales/adddomesticsale": "Add Sales Invoice (Domestic)",
  "/dashboard/sales/addsalejobwork": "Add Sales Invoice (Jobwork)",
  "/dashboard/sales/addsalesreturndomestic":
    "Add Sales Return Voucher (Domestic)",
  "/dashboard/sales/addsalesreturnjobwork":
    "Add Sales Return Voucher (Jobwork)",
  "/dashboard/accounts/ledgerreportgroup": "Ledger Report Group Wise",
  "/dashboard/accounts/ledgerreportledger": "Ledger Report Ledger Wise",
  "/dashboard/masters/hallmarkcharges": "Hallmark Charges",
  "/dashboard/stock": "List",
  "/dashboard/stock/accepttransferstock": "Accept Transfer",
  "/dashboard/report": "Report",
  "/dashboard/mobappadmin": "Mobile App Admin",
  "/dashboard/mobappadmin/orders": "Orders",
  "/dashboard/mobappadmin/retailermaster": "Retailer Master",
  "/dashboard/mobappadmin/usermaster": "User Master",
  "/dashboard/mobappadmin/salesman": "Salesman Master",
  "/dashboard/mobappadmin/deletedsalesman": "Deleted Salesman",
  "/dashboard/mobappadmin/birthdaylist": "Birthday List",
  "/dashboard/mobappadmin/deletedlist": "Deleted User List",
  "/dashboard/mobappadmin/distributormaster": "Distributor Master",
  "/dashboard/mobappadmin/teaserdesign": "Teaser Design",
  "/dashboard/mobappadmin/branding": "Branding",
  "/dashboard/mobappadmin/primaryallocation": "Primary Allocation",
  "/dashboard/mobappadmin/usercomplain": "User Complain",
  "/dashboard/mobappadmin/salesmanassociation": "Salesman Association",
  "/dashboard/mobappadmin/companyassociation": "Company Association",
  "/dashboard/mobappadmin/pushnotification": "Push Notification",
  "/dashboard/mobappadmin/mycatalogue": "My Catalogue",
  "/dashboard/mobappadmin/newsupdate": "News & Updates",
  "/dashboard/mobappadmin/exhibitionmaster": "Exhibition Master",
  "/dashboard/mobappadmin/prospectiveorders": "Prospective Orders",
  "/dashboard/mobappadmin/logindetails": "Login Details",
  "/dashboard/mobappadmin/prosorderdetail": "Prospective Order Detail",
  "/dashboard/mobappadmin/loginsubdetails": "Login sub Details",
  "/dashboard/mobappadmin/orders/orderView": "Orders View",
  "/dashboard/mobappadmin/orders/addorder": "Add Order",
  "/dashboard/mobappadmin/categories": "Categories",
  "/dashboard/mobappadmin/cms": "CMS",
  "/dashboard/accounts/othervoucherlist": "Other Accounting Voucher",
  "/dashboard/sales/vouchereditview": "Voucher Entry",
  "/dashboard/masters/designuser": "Design User",
  "/dashboard/masters/designerrole": "Designer Role",
  "/dashboard/masters/designerlocation": "Designer Location",
  "/dashboard/design/createcad": "Create New CAD",
  "/dashboard/design/cadrepairing": "Cad Repairing",
  "/dashboard/design/cadrejectionreceived": "CAD Rejection Receive",
  "/dashboard/design/camissuetoworker": "Issue to Worker",
  "/dashboard/design/camreceivefromworker": "Receive From Worker",
  "/dashboard/design/camrepairing": " CAM Repairing",
  "/dashboard/design/camrejectionreceived": "Rejection Received",
  "/dashboard/design/issuemasterfinishing": "Issue to Worker",
  "/dashboard/design/receivefromworkermaster": "Receive From Worker",
  "/dashboard/design/masterrepairing": "Repairing",
  "/dashboard/design/masterrejectionreceived": "Master Rejection",
  "/dashboard/design/issuesilvercasting": "Issue to Worker",
  "/dashboard/design/receivefromsilver": "Receive From Worker",
  "/dashboard/design/silverrepairing": "Repairing",
  "/dashboard/design/silverrejection": "Casting Rejection",
  "/dashboard/design/issuetochrome": "Issue to Worker",
  "/dashboard/design/receivefromchrome": "Receive From Worker",
  "/dashboard/design/chromerepairing": "Repairing",
  "/dashboard/design/chromerejection": "Chrome Plating Rejection",
  "dashboard/design/IsueeMasterFinishing": "Issue to Worker",
  "dashboard/design/chromerepairing": "Receive From Worker",
  "/dashboard/design/issuetomold": "Issue to Worker",
  "/dashboard/design/receivefrommold": "Receive From Worker",
  "/dashboard/design/moldrepairing": "Repairing",
  "/dashboard/design/moldrejection": "Mold Rejection",
  "/dashboard/hallmark/issuetohallmarklist": "Issued Hallmark List",
  "/dashboard/masters/SiteSettings": "Site Settings",
  "/dashboard/masters/TagSystem": "Tag System",
  "/dashboard/masters/TagPrinter": "Tag Printer",
  "/dashboard/masters/Country": "Country",
  "/dashboard/masters/City": "City",
  "/dashboard/sales/OpningTriBlan": "Opening Trial Balance",
  "/dashboard/sales/toolsconsumption": "Consumable Consumption",
  "/dashboard/sales/addtoolsconsumption": "Add Consumable Consumption",
  "/dashboard/masters/variantattribute": "Variant attribute",
  "/dashboard/mobappadmin/otherlead": "Other Lead",
  "/dashboard/mobappadmin/distributercatalogue": "Distributor Catalogue",
  "/dashboard/mobappadmin/addnewlead": "Other Lead",
  "/dashboard/mobappadmin/addDiscatalogue": "Distributor Catalogue",
  "/dashboard/accounts/deletedvoucher": "Deleted Voucher",
  "/dashboard/mobappadmin/orders/distributorview": "Distributor View",
  "/dashboard/mobappadmin/anniversarylist": "Anniversary List",
  "/dashboard/accounts/vouchereditview": "Voucher Entry",
};

function ListItemLink(props) {
  const { to, open, ...other } = props;
  const primary = breadcrumbNameMap[to];

  return (
    <li>
      <ListItem button component={RouterLink} to={to} {...other}>
        <ListItemText primary={primary} />
        {/* {open != null ? open ? <ExpandLess /> : <ExpandMore /> : null} */}
      </ListItem>
    </li>
  );
}

ListItemLink.propTypes = {
  to: PropTypes.string.isRequired,
};

const LinkRouter = (props) => <Link {...props} component={RouterLink} />;

const styles = (theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: 360,
  },
  lists: {
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing(1),
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
});

const BreadcrumbsHelper = (props) => {
  return (
    <div
      className="pl-16"
      style={{ width: "fit-content", display: "inline-block" }}
    >
      <Route>
        {({ location }) => {
          const pathnames = location.pathname.split("/").filter((x) => x);

          return (
            <Breadcrumbs aria-label="Breadcrumb" style={{ fontWeight: "500" }}>
              {pathnames.map((value, index) => {
                const last = index === pathnames.length - 1;
                const to = `/${pathnames.slice(0, index + 1).join("/")}`;

                return last ? (
                  <Typography
                    color="textPrimary"
                    key={to}
                    style={{ fontWeight: "700" }}
                  >
                    {breadcrumbNameMap[to]}
                  </Typography>
                ) : (
                  <LinkRouter style={{ color: "black" }} to={to} key={to}>
                    {breadcrumbNameMap[to]}
                  </LinkRouter>
                );
              })}
            </Breadcrumbs>
          );
        }}
      </Route>
    </div>
  );
};

BreadcrumbsHelper.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BreadcrumbsHelper);

// export default Breadcrumbs;
