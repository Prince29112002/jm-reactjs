import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from "@material-ui/core/Paper";
import TableFooter from "@material-ui/core/TableFooter";
import { Icon, IconButton } from "@material-ui/core";
import Icones from "assets/fornt-icons/Mainicons";


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
  tableFooter: {
    padding: 7,
    backgroundColor: '#E3E3E3'
  },
}));

const PackingSlipTabView = (props) => {

  const [slipData, setSlipData] = useState([]);
  const classes = useStyles();

  const [totalPcs, setTotalPcs] = useState(0);
  const [totalGross, setTotalGross] = useState(0);
  const [totalNet, setTotalNet] = useState(0);
  const [totalFine, setTotalFine] = useState(0);

  useEffect(() => {
    if (props.data) {
      setSlipData(props.data);
    }
  }, [props])

  useEffect(() => {
    callAddition()
  }, [slipData])

  const callAddition = () => {
    if (slipData.length > 0) {
      var pcsTotal = 0;
      var netWgt = 0;
      var grossWgt = 0;
      var tFine = 0;
      slipData.map((item) => {
        pcsTotal += parseFloat(item.phy_pcs)
        netWgt += parseFloat(item.net_wgt)
        grossWgt += parseFloat(item.gross_wgt)
        let fine = (item.purity * item.net_wgt) / 100;
        tFine += parseFloat(fine);
      })
      setTotalPcs(isNaN(pcsTotal) ? 0 : pcsTotal);
      setTotalNet(netWgt);
      setTotalGross(grossWgt);
      setTotalFine(tFine)
      props.total(tFine)
    } else {
      setTotalPcs(0);
      setTotalNet(0);
      setTotalGross(0);
      setTotalFine(0);
    }
  }

  const deleteHandler = (slipNo) => {
    props.deleteEntry(slipNo)
  }

  return (
    <div className="m-16">
      <Paper className={classes.tabroot}>
        <div className="table-responsive">
          <MaUTable className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableRowPad}>Packing Slip No</TableCell>
                <TableCell className={classes.tableRowPad}>Pieces</TableCell>
                <TableCell className={classes.tableRowPad}>purity</TableCell>
                <TableCell className={classes.tableRowPad}>Gross Weight</TableCell>
                <TableCell className={classes.tableRowPad}>Net Weight</TableCell>
                <TableCell className={classes.tableRowPad}>Fine</TableCell>
                <TableCell className={classes.tableRowPad}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                slipData.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell className={classes.tableRowPad}>
                      {row.packing_slip_no}
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      {row.phy_pcs}
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      {row.purity}
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      {row.gross_wgt}
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      {row.net_wgt}
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      {((row.purity * row.net_wgt) / 100).toFixed(3)}
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      <IconButton
                        style={{ padding: "0" }}
                        onClick={(ev) => {
                          ev.preventDefault();
                          ev.stopPropagation();
                          deleteHandler(row);
                        }}
                      >
                      <Icon className="mr-8 delete-icone">
                                    <img src={Icones.delete_red} alt="" />
                                  </Icon>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell className={classes.tableFooter}></TableCell>
                <TableCell className={classes.tableFooter}><b>{totalPcs}</b></TableCell>
                <TableCell className={classes.tableFooter}></TableCell>
                <TableCell className={classes.tableFooter}><b>{totalGross.toFixed(3)}</b></TableCell>
                <TableCell className={classes.tableFooter}><b>{totalNet.toFixed(3)}</b></TableCell>
                <TableCell className={classes.tableFooter}><b>{totalFine.toFixed(3)}</b></TableCell>
                <TableCell className={classes.tableFooter}></TableCell>
              </TableRow>
            </TableFooter>
          </MaUTable>
        </div>
      </Paper>
    </div>
  );
}

export default PackingSlipTabView;