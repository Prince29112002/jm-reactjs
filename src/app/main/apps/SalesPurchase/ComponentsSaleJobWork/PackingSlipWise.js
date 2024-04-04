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
import HelperFunc from "../Helper/HelperFunc";

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: {
    position: "absolute",
    width: 400,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    outline: "none",
  },
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "cornflowerblue",
    color: "white",
  },
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
  const [isView, setIsView] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setPackingSlipData(props.packingSlipData);
    setIsView(props.isView);
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
            <TableCell className={classes.tableRowPad}>Pieces</TableCell>
            <TableCell className={classes.tableRowPad}>Gross Weight</TableCell>
            <TableCell className={classes.tableRowPad}>Net Weight</TableCell>
            <TableCell className={classes.tableRowPad}>Purity</TableCell>
            <TableCell className={classes.tableRowPad}>Wastage %</TableCell>
            <TableCell className={classes.tableRowPad}>Wastage</TableCell>
            <TableCell className={classes.tableRowPad}>
              Wastage Fine Amount
            </TableCell>
            <TableCell className={classes.tableRowPad}>
              Other Material Charges
            </TableCell>
            <TableCell className={classes.tableRowPad}>
              Billing Labour Rate per Gram{" "}
            </TableCell>
            <TableCell className={classes.tableRowPad}>Total Amt</TableCell>
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
                {parseFloat(element.gross_wgt).toFixed(3)}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {parseFloat(element.net_wgt).toFixed(3)}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {element.purity}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {element.wastage}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {element.wastageFine}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {isView
                  ? Config.numWithComma(element.wastageFineAmount)
                  : parseFloat(element.wastageFineAmount).toFixed(3)}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {element.other_amt === null
                  ? 0
                  : isView
                  ? Config.numWithComma(element.other_amt)
                  : parseFloat(element.other_amt).toFixed(3)}
              </TableCell>

              <TableCell className={classes.tableRowPad}>
                {isView
                  ? Config.numWithComma(element.labourRate)
                  : parseFloat(element.labourRate).toFixed(3)}
              </TableCell>

              <TableCell className={classes.tableRowPad}>
                {isView
                  ? Config.numWithComma(element.totalAmount)
                  : parseFloat(element.totalAmount).toFixed(3)}
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
          <TableRow style={{backgroundColor:"#D1D8F5"}}>
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
              {/* Pieces */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {HelperFunc.getTotalOfField(packingSlipData, "gross_wgt")}
              {/* Gross Weight */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {HelperFunc.getTotalOfField(packingSlipData, "net_wgt")}
              {/* Net Weight */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Purity */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Wastage % */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {HelperFunc.getTotalOfField(packingSlipData, "wastageFine")}
              {/* Wastage */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {isView
                ? Config.numWithComma(
                    HelperFunc.getTotalOfField(
                      packingSlipData,
                      "wastageFineAmount"
                    )
                  )
                : HelperFunc.getTotalOfField(
                    packingSlipData,
                    "wastageFineAmount"
                  )}
              {/* {parseFloat(
                packingSlipData
                  .filter((item) => item.wastageFineAmount !== "")
                  .map((item) => parseFloat(item.wastageFineAmount))
                  .reduce(function (a, b) {
                    return parseFloat(a) + parseFloat(b);
                  }, 0)
              ).toFixed(3)} */}
            </TableCell>
            <TableCell className={classes.tableRowPad}>
              {HelperFunc.getTotalOfField(packingSlipData, "other_amt")}
              {/* Other Material Charges */}
            </TableCell>

            <TableCell className={classes.tableRowPad}>
              {/* labourRate */}
            </TableCell>

            <TableCell className={classes.tableRowPad}>
              {/* Total Amt */}
              {isView
                ? Config.numWithComma(
                    HelperFunc.getTotalOfField(packingSlipData, "totalAmount")
                  )
                : HelperFunc.getTotalOfField(packingSlipData, "totalAmount")}
              {/* {parseFloat(
                packingSlipData
                  .filter((item) => item.totalAmount !== "")
                  .map((item) => parseFloat(item.totalAmount))
                  .reduce(function (a, b) {
                    return parseFloat(a) + parseFloat(b);
                  }, 0)
              ).toFixed(3)} */}
            </TableCell>
            {!isView && <TableCell className={classes.tableRowPad}></TableCell>}
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
