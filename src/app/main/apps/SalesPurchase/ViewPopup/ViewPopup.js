import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import clsx from "clsx";
import { Icon, IconButton } from "@material-ui/core";
import AddMetalPurchase from '../MetalPurchase/AddMetalPurchase/AddMetalPurchase';
import AddJewellaryPurchase from '../JewelleryPurchase/AddJewellaryPurchase/AddJewellaryPurchase';
import AddRawMaterialPurchase from '../RawMaterialPurchase/AddRawMaterialPurchase/AddRawMaterialPurchase';
import AddExportMetalPurchase from "../ExportMetalPurchase/AddExportMetalPurchase/AddExportMetalPurchase";
import AddConsumablePurchase from "../ConsumablePurchase/AddConsumablePurchase/AddConsumablePurchase";
import AddMetalPurchaseReturn from "../MetalPurchaseReturn/AddMetalPurchaseReturn/AddMetalPurchaseReturn";
import AddRawMaterialPurchaseReturn from "../RawMaterialPurchaseReturn/AddRawMaterialPurchaseReturn/AddRawMaterialPurchaseReturn";
import AddConsumablePurcReturn from "../ConsumablePurchaseReturn/AddConsumablePurcReturn/AddConsumablePurcReturn";
import AddRepairingRecfromCust from "../RepairingRecfromCust/AddRepairingRecfromCust/AddRepairingRecfromCust";
import AddRepairedJewelReturnCust from "../RepairedJewelReturnCust/AddRepairedJewelReturnCust/AddRepairedJewelReturnCust";
import AddSalesReturnDomestic from "../SalesReturnDomestic/AddSalesReturnDomestic/AddSalesReturnDomestic";
import AddSalesReturnJobwork from "../SalesReturnJobwork/AddSalesReturnJobwork/AddSalesReturnJobwork";
import AddSalesJobwork from "../SalesJobwork/AddSalesJobwork/AddSalesJobwork";
import AddSalesDomestic from "../SalesDomestic/AddSalesDomestic/AddSalesDomestic";
import AddJewellaryPurchaseReturn from "../JewelleryPurchaseReturn/AddJewellaryPurchaseReturn/AddJewellaryPurchaseReturn";
import AddRepairedJewelReturnJobWorker from "../RepairedJewelReturnJobWorker/AddRepairedJewelReturnJobWorker/AddRepairedJewelReturnJobWorker";
import AddRepairedIssToJobWorker from "../RepairedIssToJobWorker/AddRepairedIssToJobWorker/AddRepairedIssToJobWorker";
import AddJobworkMetalReceiveIR from "../JobworkMetalReceiveIR/AddJobworkMetalReceiveIR/AddJobworkMetalReceiveIR";
import AddArticianReturnIR from "../ArticianReturnIR/AddArticianReturnIR/AddArticianReturnIR";
import AddJewelPurchaseArticianReturn from "../JewelPurchaseArticianReturn/AddJewelPurchaseArticianReturn/AddJewelPurchaseArticianReturn";
import AddJobworkMetalReturnIR from "../JobworkMetalReturnIR/AddJobworkMetalReturnIR/AddJobworkMetalReturnIR";
import AddArticianIssueIR from "../ArticianIssueIR/AddArticianIssueIR/AddArticianIssueIR";
import AddJewelPurchaseArtician from "../JewelPurchaseArtician/AddJewelPurchaseArtician/AddJewelPurchaseArtician";
import VoucherEditView from '../../Account/VoucherHistory/VoucherEditView/VoucherEditView';
import ViewClientVenRateFix from '../ViewClientVenRateFix/ViewClientVenRateFix';
import AddToolsConsumption from '../ToolsConsumption/AddToolsConsumption/AddToolsConsumption';
import AddSalesDomesticInfo from "../SalesDomesticInfo/AddSalesDomesticInfo/AddSalesDomesticInfo";
import AddSalesJobworkInfo from "../SalesJobworkInfo/AddSalesJobworkInfo/AddSalesJobworkInfo";
import AddSalesConsumable from "../SalesConsumable/AddSalesConsumable/AddSalesConsumable";
import AddSalesB2CInfo from "../SalesB2CInfo/AddSalesB2CInfo/AddSalesB2CInfo";
import AddSalesB2C from "../SalesB2C/AddSalesB2C/AddSalesB2C"
import AddStockArticianIssueMetal from "../StockArticianIssueMetal/AddStockArticianIssueMetal/AddStockArticianIssueMetal";
import AddStockArticianReturnMetal from "../StockArticianReturnMetal/AddStockArticianReturnMetal/AddStockArticianReturnMetal";
import AddStockJewelPurchaseArtician from "../StockJewelPurchaseArtician/AddStockJewelPurchaseArtician/AddStockJewelPurchaseArtician";

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



const ViewPopup = (props) => {
  const [open, setOpen] = React.useState(true);
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();
  // const theme = useTheme();

  const handleClose = () => {
    setOpen(false)
    props.modalColsed()
  }
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
        <div style={modalStyle} className={clsx(classes.paper,"rounded-8")} id="metal-modesize-dv">
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
            ><Icon style={{ color: "white" }}>
                close
              </Icon></IconButton>
          </h5>
          <div className="p-5 pl-16 pr-16 inner-metal-modesize-dv">

            {/* Purchase */}
            {props.rowData.flag === 1 ? props.rowData.view_flag == 1 ?
              <VoucherEditView id={props.rowData.voucher_setting_detail_id} viewPage={true} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> :
              <AddMetalPurchase voucherId={props.rowData.id} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> : ''}
            {props.rowData.flag === 2 ? props.rowData.view_flag == 1 ?
              <VoucherEditView id={props.rowData.voucher_setting_detail_id} viewPage={true} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> :
              <AddJewellaryPurchase voucherId={props.rowData.id} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> : ''}
            {props.rowData.flag === 3 ? props.rowData.view_flag == 1 ?
              <VoucherEditView id={props.rowData.voucher_setting_detail_id} viewPage={true} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> :
              <AddJewelPurchaseArtician voucherId={props.rowData.id} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> : ''}
            {props.rowData.flag === 4 ? props.rowData.view_flag == 1 ?
              <VoucherEditView id={props.rowData.voucher_setting_detail_id} viewPage={true} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> :
              <AddExportMetalPurchase voucherId={props.rowData.id} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> : ''}
            {props.rowData.flag === 5 ? props.rowData.view_flag == 1 ?
              <VoucherEditView id={props.rowData.voucher_setting_detail_id} viewPage={true} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> :
              <AddConsumablePurchase voucherId={props.rowData.id} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> : ''}
            {props.rowData.flag === 6 ? props.rowData.view_flag == 1 ?
              <VoucherEditView id={props.rowData.voucher_setting_detail_id} viewPage={true} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> :
              <AddRawMaterialPurchase voucherId={props.rowData.id} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> : ''}


            {/* Purchase Return */}
            {props.rowData.flag === 17 ? props.rowData.view_flag == 1 ?
              <VoucherEditView id={props.rowData.voucher_setting_detail_id} viewPage={true} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> :
              <AddMetalPurchaseReturn voucherId={props.rowData.id} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> : ''}
            {props.rowData.flag === 18 ? props.rowData.view_flag == 1 ?
              <VoucherEditView id={props.rowData.voucher_setting_detail_id} viewPage={true} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> :
              <AddJewellaryPurchaseReturn voucherId={props.rowData.id} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> : ''}
            {props.rowData.flag === 19 ? props.rowData.view_flag == 1 ?
              <VoucherEditView id={props.rowData.voucher_setting_detail_id} viewPage={true} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> :
              <AddJewelPurchaseArticianReturn voucherId={props.rowData.id} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> : ''}
            {props.rowData.flag === 20 ? props.rowData.view_flag == 1 ?
              <VoucherEditView id={props.rowData.voucher_setting_detail_id} viewPage={true} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> :
              <AddConsumablePurcReturn voucherId={props.rowData.id} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> : ''}
            {props.rowData.flag === 21 ? props.rowData.view_flag == 1 ?
              <VoucherEditView id={props.rowData.voucher_setting_detail_id} viewPage={true} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> :
              <AddRawMaterialPurchaseReturn voucherId={props.rowData.id} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> : ''}


            {/* Sales Info*/}
            {props.rowData.flag === 32 ? props.rowData.view_flag == 1 ?
              <VoucherEditView id={props.rowData.voucher_setting_detail_id} viewPage={true} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> :
              <AddSalesJobworkInfo voucherId={props.rowData.id} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> : ''}
            {props.rowData.flag === 31 ? props.rowData.view_flag == 1 ?
              <VoucherEditView id={props.rowData.voucher_setting_detail_id} viewPage={true} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> :
              <AddSalesDomesticInfo voucherId={props.rowData.id} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> : ''}
             {props.rowData.flag === 38 ? props.rowData.view_flag == 1 ?
              <VoucherEditView id={props.rowData.voucher_setting_detail_id} viewPage={true} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> :
              <AddSalesB2CInfo voucherId={props.rowData.id} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> : ''}


            {/* Sales */}
            {props.rowData.flag === 23 ? props.rowData.view_flag == 1 ?
              <VoucherEditView id={props.rowData.voucher_setting_detail_id} viewPage={true} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> :
              <AddSalesJobwork voucherId={props.rowData.id} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> : ''}
            {props.rowData.flag === 22 ? props.rowData.view_flag == 1 ?
              <VoucherEditView id={props.rowData.voucher_setting_detail_id} viewPage={true} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> :
              <AddSalesDomestic voucherId={props.rowData.id} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> : ''}
            {props.rowData.flag === 37 ? props.rowData.view_flag == 1 ?
              <VoucherEditView id={props.rowData.voucher_setting_detail_id} viewPage={true} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> :
              <AddSalesB2C voucherId={props.rowData.id} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> : ''}

            {/* Slaes Return */}
            {props.rowData.flag === 7 ? props.rowData.view_flag == 1 ?
              <VoucherEditView id={props.rowData.voucher_setting_detail_id} viewPage={true} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> :
              <AddSalesReturnDomestic voucherId={props.rowData.id} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> : ''}
            {props.rowData.flag === 8 ? props.rowData.view_flag == 1 ?
              <VoucherEditView id={props.rowData.voucher_setting_detail_id} viewPage={true} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> :
              <AddSalesReturnJobwork voucherId={props.rowData.id} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> : ''}

            {/* Stock JournalVoucher */}
            {props.rowData.flag === 39 ? props.rowData.view_flag == 1 ?
              <VoucherEditView id={props.rowData.voucher_setting_detail_id} viewPage={true} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> :
              <AddStockArticianIssueMetal voucherId={props.rowData.id} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> : ''}
            {props.rowData.flag === 40 ? props.rowData.view_flag == 1 ?
              <VoucherEditView id={props.rowData.voucher_setting_detail_id} viewPage={true} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> :
              <AddStockArticianReturnMetal voucherId={props.rowData.id} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> : ''}
            {props.rowData.flag === 41 ? props.rowData.view_flag == 1 ?
              <VoucherEditView id={props.rowData.voucher_setting_detail_id} viewPage={true} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> :
              <AddStockJewelPurchaseArtician voucherId={props.rowData.id} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> : ''}

            {/* Metal (I/R) */}
            {props.rowData.flag === 11 ? props.rowData.view_flag == 1 ?
              <VoucherEditView id={props.rowData.voucher_setting_detail_id} viewPage={true} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> :
              <AddJobworkMetalReceiveIR voucherId={props.rowData.id} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> : ''}
            {props.rowData.flag === 26 ? props.rowData.view_flag == 1 ?
              <VoucherEditView id={props.rowData.voucher_setting_detail_id} viewPage={true} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> :
              <AddJobworkMetalReturnIR voucherId={props.rowData.id} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> : ''}
            {props.rowData.flag === 27 ? props.rowData.view_flag == 1 ?
              <VoucherEditView id={props.rowData.voucher_setting_detail_id} viewPage={true} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> :
              <AddArticianIssueIR voucherId={props.rowData.id} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> : ''}
            {props.rowData.flag === 12 ? props.rowData.view_flag == 1 ?
              <VoucherEditView id={props.rowData.voucher_setting_detail_id} viewPage={true} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> :
              <AddArticianReturnIR voucherId={props.rowData.id} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> : ''}


            {/* Repairing */}
            {props.rowData.flag === 9 ? props.rowData.view_flag == 1 ?
              <VoucherEditView id={props.rowData.voucher_setting_detail_id} viewPage={true} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> :
              <AddRepairingRecfromCust voucherId={props.rowData.id} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> : ''}
            {props.rowData.flag === 24 ? props.rowData.view_flag == 1 ?
              <VoucherEditView id={props.rowData.voucher_setting_detail_id} viewPage={true} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> :
              <AddRepairedJewelReturnCust voucherId={props.rowData.id} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> : ''}
            {props.rowData.flag === 25 ? props.rowData.view_flag == 1 ?
              <VoucherEditView id={props.rowData.voucher_setting_detail_id} viewPage={true} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> :
              <AddRepairedIssToJobWorker voucherId={props.rowData.id} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> : ''}
            {props.rowData.flag === 10 ? props.rowData.view_flag == 1 ?
              <VoucherEditView id={props.rowData.voucher_setting_detail_id} viewPage={true} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> :
              <AddRepairedJewelReturnJobWorker voucherId={props.rowData.id} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> : ''}

               {/* Rate fix */}
            {props.rowData.voucher_type === "Rate Fix For Client" ?
              <ViewClientVenRateFix voucherId={props.rowData.id} /> : ''}
            {props.rowData.voucher_type === "Rate Fix For Vendor" ?
              <ViewClientVenRateFix voucherId={props.rowData.id} /> : ''}
            {props.rowData.voucher_type === "Rate Fix" ?
              <ViewClientVenRateFix voucherId={props.rowData.id} /> : ''}

           {/* other voucher */}
            {props.rowData.flag == 30 && props.rowData.view_flag == 1 ?
              <VoucherEditView id={props.rowData.id} viewPage={true} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} />
              : ''}

          {/* Tool counsuption */}
            {props.rowData.flag == 28 && props.rowData.view_flag == 1 ?
              <AddToolsConsumption voucherId={props.rowData.id} viewPage={true} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} />
              : ''}

            {/* debit note credit note */}
            {props.rowData.flag == "" && props.rowData.view_flag == 1 ?
              <VoucherEditView id={props.rowData.voucher_setting_detail_id} viewPage={true} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} />
              : ''}
              {props.rowData.flag == "" && props.rowData.view_flag != 1 ?
              <VoucherEditView id={props.rowData.voucher_setting_detail_id} viewPage={true} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} />
              : ''}

            {props.rowData.flag === 36 ? props.rowData.view_flag == 1 ?
              <VoucherEditView id={props.rowData.voucher_setting_detail_id} viewPage={true} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> :
              <AddSalesConsumable voucherId={props.rowData.id} viewPopup={true} reportView={props.fromReport} forDeletedVoucher={props.forDeletedVoucher} /> : ''}

          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ViewPopup