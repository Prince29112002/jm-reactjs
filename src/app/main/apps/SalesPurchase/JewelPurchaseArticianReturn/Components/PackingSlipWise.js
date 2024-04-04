import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Icon, IconButton } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Button } from "@material-ui/core";
import clsx from "clsx";
import Config from "app/fuse-configs/Config";
import HelperFunc from "../../Helper/HelperFunc";

const useStyles = makeStyles((theme) => ({
  root: {},
  tabroot: {
    overflowX: "auto",
    overflowY: "auto",
    height: "100%",
  },
  table: {
    minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
  },
}));

const PackingSlipWiseList = (props) => {
  const classes = useStyles();
  const [packingSlipData, setPackingSlipData] = useState([]);
  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");
  const [stateId, setStateId] = useState("");
  const [isView, setIsView] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setPackingSlipData(props.packingSlipData);
    setIsView(props.isView);
    if(props.isView){
      if(props.isIgst){
        setStateId(0)
      }else{
        setStateId(12)
      }
    }else{
      setStateId(props.stateId);
    }
    //eslint-disable-next-line
  }, [props]);

  function deleteHandler(slipNo) {
    setSelectedIdForDelete(slipNo);
    setOpen(true);
    // props.deleteHandler(slipNo);
  }

  function confirmDelete() {
    props.deleteHandler(selectedIdForDelete);
    setOpen(false);
  }

  function handleClose() {
    setSelectedIdForDelete("");
    setOpen(false);
  }

  return (
    <Paper className={clsx(classes.tabroot, "m-16 table-responsive")}>
      <MaUTable className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableRowPad}>
              Packing Slip No
            </TableCell>
            <TableCell className={classes.tableRowPad}>No of Packet</TableCell>
            <TableCell className={classes.tableRowPad}>
              Billing Category
            </TableCell>
            {/* <TableCell className={classes.tableRowPad}>HSN</TableCell> */}

            <TableCell className={classes.tableRowPad}>Pieces</TableCell>
            <TableCell className={classes.tableRowPad}>Gross Weight</TableCell>
            <TableCell className={classes.tableRowPad}>Net Weight</TableCell>
            <TableCell className={classes.tableRowPad}>Purity</TableCell>
            <TableCell className={classes.tableRowPad}>
              Jobwork Fine Utilize
            </TableCell>

            <TableCell className={classes.tableRowPad}>Wastage %</TableCell>
            <TableCell className={classes.tableRowPad}>Wastage</TableCell>
            <TableCell className={classes.tableRowPad}>Fine Rate</TableCell>

            <TableCell className={classes.tableRowPad}>
              Labour Fine Amount
            </TableCell>
            <TableCell className={classes.tableRowPad}>
              Other tag Amount
            </TableCell>
            <TableCell className={classes.tableRowPad}>
              Category Rate per gram
            </TableCell>
            <TableCell className={classes.tableRowPad}>Total Amount</TableCell>

            {stateId === 12 && (
              <>
                <TableCell className={classes.tableRowPad}>CGST (%)</TableCell>
                <TableCell className={classes.tableRowPad}>SGST (%)</TableCell>
                <TableCell className={classes.tableRowPad}>CGST</TableCell>
                <TableCell className={classes.tableRowPad}>SGST</TableCell>
              </>
            )}

            {stateId !== 12 && (
              <>
                <TableCell className={classes.tableRowPad}>IGST (%)</TableCell>

                <TableCell className={classes.tableRowPad}>IGST</TableCell>
              </>
            )}
            <TableCell className={classes.tableRowPad}>Total</TableCell>
            {!isView && <TableCell className={classes.tableRowPad}></TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {packingSlipData.map((element, index) => (
            <TableRow key={index}>
              <TableCell className={classes.tableRowPad}>
                {element.packing_slip_no}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {element.NoOfPacket}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {element.billingCategory}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {element.phy_pcs}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {/* Gross Weight */}
                {parseFloat(element.gross_wgt).toFixed(3)}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {/* Net Weight */}
                {parseFloat(element.net_wgt).toFixed(3)}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {/* Purity */}
                {element.purity}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {/* Jobwork Fine Utilize */}
                {element.jobworkFineUtilize}
              </TableCell>

              <TableCell className={classes.tableRowPad}>
                {/* Wastage % */}
                {element.wastage}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {/* Wastage */}
                {element.wastageFine}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {/* Fine Rate */}
                {element.fineRate
                  ? isView
                    ? Config.numWithComma(element.fineRate)
                    : parseFloat(element.fineRate).toFixed(3)
                  : "-"}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {/* Labour Fine Amount */}
                {element.labourFineAmount
                  ? isView
                    ? Config.numWithComma(element.labourFineAmount)
                    : parseFloat(element.labourFineAmount).toFixed(3)
                  : "-"}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {/* Other tag Amount */}
                {element.other_amt
                  ? isView
                    ? Config.numWithComma(element.other_amt)
                    : parseFloat(element.other_amt).toFixed(3)
                  : "-"}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {/* Category Rate per gram */}
                {element.catRate
                  ? isView
                    ? Config.numWithComma(element.catRate)
                    : parseFloat(element.catRate).toFixed(3)
                  : "-"}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {/* Total Amount */}
                {element.totalAmount
                  ? isView
                    ? Config.numWithComma(element.totalAmount)
                    : parseFloat(element.totalAmount).toFixed(3)
                  : "-"}
              </TableCell>

              {stateId === 12 && (
                <>
                  <TableCell className={classes.tableRowPad}>
                    {/* CGST (%) */}
                    {element.cgstPer}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {/* SGST (%) */}
                    {element.sGstPer}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {/* CGST */}
                    {element.cgstVal
                      ? isView
                        ? Config.numWithComma(element.cgstVal)
                        : parseFloat(element.cgstVal).toFixed(3)
                      : "-"}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {/* SGST */}
                    {element.sGstVal
                      ? isView
                        ? Config.numWithComma(element.sGstVal)
                        : parseFloat(element.sGstVal).toFixed(3)
                      : "-"}
                  </TableCell>
                </>
              )}

              {stateId !== 12 && (
                <>
                  <TableCell className={classes.tableRowPad}>
                    {/* IGST (%) */}
                    {element.IGSTper}
                  </TableCell>

                  <TableCell className={classes.tableRowPad}>
                    {/* IGST */}
                    {element.IGSTVal
                      ? isView
                        ? Config.numWithComma(element.IGSTVal)
                        : parseFloat(element.IGSTVal).toFixed(3)
                      : "-"}
                  </TableCell>
                </>
              )}
              <TableCell className={classes.tableRowPad}>
                {/* Total */}
                {element.total
                  ? isView
                    ? Config.numWithComma(element.total)
                    : parseFloat(element.total).toFixed(3)
                  : "-"}
              </TableCell>
              {!isView && (
                <TableCell className={classes.tableRowPad}>
                  <IconButton
                    style={{ padding: "0" }}
                    onClick={(ev) => {
                      ev.preventDefault();
                      ev.stopPropagation();
                      deleteHandler(element.packing_slip_no);
                    }}
                  >
                    <Icon className="mr-8" style={{ color: "red" }}>
                      delete
                    </Icon>
                  </IconButton>
                </TableCell>
              )}
            </TableRow>
          ))}
          <TableRow style={{backgroundColor:"#D1D8F5"}} >
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Packing Slip No */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* No of Packet */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Billing Category */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
            {HelperFunc.getTotalOfFieldNoDecimal(packingSlipData, "phy_pcs")}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Gross Weight */}
              {HelperFunc.getTotalOfField(packingSlipData, "gross_wgt")}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
            {HelperFunc.getTotalOfField(packingSlipData, "net_wgt")}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Purity */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
            {HelperFunc.getTotalOfField(packingSlipData, "jobworkFineUtilize")}
            </TableCell>

            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Wastage % */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
            {HelperFunc.getTotalOfField(packingSlipData, "wastageFine")}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Fine Rate */}
            </TableCell>

            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
            {HelperFunc.getTotalOfField(packingSlipData, "labourFineAmount")}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
            {HelperFunc.getTotalOfField(packingSlipData, "other_amt")}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Category Rate per gram */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Total Amount */}
              {isView
                ? Config.numWithComma(
                    HelperFunc.getTotalOfField(packingSlipData, "totalAmount")
                  )
                : HelperFunc.getTotalOfField(packingSlipData, "totalAmount")}
            </TableCell>

            {stateId === 12 && (
              <>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* CGST (%) */}
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* SGST (%) */}
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* CGST */}
                  {isView
                    ? Config.numWithComma(
                        HelperFunc.getTotalOfField(packingSlipData, "cgstVal")
                      )
                    : HelperFunc.getTotalOfField(packingSlipData, "cgstVal")}
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* SGST */}
                  {isView
                    ? Config.numWithComma(
                        HelperFunc.getTotalOfField(packingSlipData, "sGstVal")
                      )
                    : HelperFunc.getTotalOfField(packingSlipData, "sGstVal")}
                </TableCell>
              </>
            )}

            {stateId !== 12 && (
              <>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* IGST (%) */}
                </TableCell>

                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* IGST */}
                  {isView
                    ? Config.numWithComma(
                        HelperFunc.getTotalOfField(packingSlipData, "IGSTVal")
                      )
                    : HelperFunc.getTotalOfField(packingSlipData, "IGSTVal")}
                </TableCell>
              </>
            )}
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Total */}
              {isView
                ? Config.numWithComma(
                    HelperFunc.getTotalOfField(packingSlipData, "total")
                  )
                : HelperFunc.getTotalOfField(packingSlipData, "total")}
            </TableCell>
            {!isView && <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}></TableCell>}
          </TableRow>
        </TableBody>
      </MaUTable>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Alert!!!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete this record?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default PackingSlipWiseList;
