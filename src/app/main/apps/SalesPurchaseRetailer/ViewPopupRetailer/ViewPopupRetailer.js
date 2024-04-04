import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import clsx from "clsx";
import { Icon, IconButton } from "@material-ui/core";
import AddArticianIssueIRetailer from "../ArticianIssueIRetailer/AddArticianIssueIRetailer/AddArticianIssueIRetailer";
import AddArticianReturnRetailer from "../ArticianReturnIRetailer/AddArticianReturnIRetailer/AddArticianReturnRetailer";
import AddJewellaryPurchaseRetailer from "../JewelleryPurchaseRetailer/AddJewellaryPurchaseRetailer/AddJewellaryPurchaseRetailer";
import AddMetalPurchaseRetailer from "../MetalPurchaseRetailer/AddMetalPurchaseRetailer/AddMetalPurchaseRetailer";
import AddSalesRetailer from "../SalesRetalier/AddSalesRetalier/AddSalesRetalier";
import VoucherEditViewRetailer from "../../AccountRetailre/VoucherHistoryRetailer/VoucherEditViewRetailer/VoucherEditViewRetailer";
import AddFixedSalesRetailer from "../SalesRetalier/AddFixedSalesRetailer/AddFixedSalesRetailer";

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: {
    position: "absolute",
    width: 400,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    // padding: theme.spacing(4),
    outline: "none",
  },
}));

function getModalStyle() {
  const top = 50; //+ rand();
  const left = 50; //+ rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const ViewPopupRetailer = (props) => {
  const [open, setOpen] = React.useState(true);
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();
  // const theme = useTheme();

  const handleClose = () => {
    setOpen(false);
    props.modalColsed();
  };
  console.log(props, "dataaaaaaaaaaaaa");

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            handleClose();
          }
        }}
      >
        <div
          style={modalStyle}
          className={clsx(classes.paper, "rounded-8")}
          id="metal-modesize-dv"
        >
          <h5
            // className="p-5"
            // style={{
            //   textAlign: "center",
            //   backgroundColor: "black",
            //   color: "white",
            //   paddingTop: "12px",
            //   paddingBottom: "12px"
            // }}
            className="popup-head p-5"
          >
            {props.rowData.voucher_no}
            <IconButton
              style={{ position: "absolute", top: "0", right: "0" }}
              onClick={handleClose}
            >
              <Icon style={{ color: "white" }}>close</Icon>
            </IconButton>
          </h5>
          <div className="inner-metal-modesize-dv" style={{paddingTop:"20px", background:"#f8f8fb"}}>
            <div>
              {props.rowData.flag === 1 ? (
                <AddMetalPurchaseRetailer
                  voucherId={props.rowData.id}
                  viewPopup={true}
                  reportView={props.fromReport}
                  forDeletedVoucher={props.forDeletedVoucher}
                />
              ) : (
                ""
              )}
              {props.rowData.flag === 2 ? (
                <AddJewellaryPurchaseRetailer
                  voucherId={props.rowData.id}
                  viewPopup={true}
                  reportView={props.fromReport}
                  forDeletedVoucher={props.forDeletedVoucher}
                />
              ) : (
                ""
              )}
              {props.rowData.view_flag === 1 ? (
                <VoucherEditViewRetailer
                  id={props.rowData.voucher_setting_detail_id}
                  viewPage={true}
                  viewPopup={true}
                  reportView={props.fromReport}
                  forDeletedVoucher={props.forDeletedVoucher}
                />
              ) : (
                ""
              )}
              {props.rowData.flag === 22 && props.rowData.is_gift_item_entry !== 1 ? (
                <AddSalesRetailer
                  voucherId={props.rowData.id}
                  viewPopup={true}
                  reportView={props.fromReport}
                  forDeletedVoucher={props.forDeletedVoucher}
                />
              ) : props.rowData.flag === 22 && props.rowData.is_gift_item_entry === 1 ? (
                <AddFixedSalesRetailer
                  voucherId={props.rowData.id}
                  viewPopup={true}
                  reportView={props.fromReport}
                  forDeletedVoucher={props.forDeletedVoucher}
                /> ): (
                ""
              )}
              {props.rowData.flag === 27 ? (
                <AddArticianIssueIRetailer
                  voucherId={props.rowData.id}
                  viewPopup={true}
                  reportView={props.fromReport}
                  forDeletedVoucher={props.forDeletedVoucher}
                />
              ) : (
                ""
              )}
              {props.rowData.flag === 12 ? (
                <AddArticianReturnRetailer
                  voucherId={props.rowData.id}
                  viewPopup={true}
                  reportView={props.fromReport}
                  forDeletedVoucher={props.forDeletedVoucher}
                />
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ViewPopupRetailer;
