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

            <TableCell className={classes.tableRowPad}>
              Job work Fine in Pure
            </TableCell>
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
                {element.jobWorkFineinPure
                  ? parseFloat(element.jobWorkFineinPure).toFixed(3)
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
          <TableRow style={{backgroundColor:"#D3D3D3"}}>
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
              {/* Pieces */}
              {HelperFunc.getTotalOfFieldNoDecimal(packingSlipData, "phy_pcs")}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Gross Weight */}
              {HelperFunc.getTotalOfField(packingSlipData, "gross_wgt")}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Net Weight */}
              {HelperFunc.getTotalOfField(packingSlipData, "net_wgt")}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Purity */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {HelperFunc.getTotalOfField(packingSlipData, "jobWorkFineinPure")}
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
            Are you sure you want to delete this record ?
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
