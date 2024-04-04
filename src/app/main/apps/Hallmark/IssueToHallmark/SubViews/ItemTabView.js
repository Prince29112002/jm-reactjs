import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from "@material-ui/core/TableFooter";
import Paper from "@material-ui/core/Paper";

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

const ItemTabView = (props) => {
  const [productData, setProductData] = useState([])
  const classes = useStyles();

  const [totalPcs, setTotalPcs] = useState(0);
  const [totalGross, setTotalGross] = useState(0);
  const [totalNet, setTotalNet] = useState(0);
  const [totalOtherWgt, setTotalOtherWgt] = useState(0);
  const [totalFine, setTotalFine] = useState(0);

  useEffect(() => {
    if (props.data) {
      setProductData(props.data);
    }
  }, [props])

  useEffect(() => {
    callAddition()
  }, [productData])

  const callAddition = () => {
    if (productData.length > 0) {
      var pcsTotal = 0;
      var netWgt = 0;
      var grossWgt = 0;
      var otherWgt = 0;
      var tFine = 0;
      productData.map((item) => {
        pcsTotal += parseFloat(item.pcs)
        netWgt += parseFloat(item.net_wgt)
        grossWgt += parseFloat(item.gross_wgt)
        otherWgt += parseFloat(item.other_wgt)
        tFine += parseFloat(item.pFine)
      })
      setTotalPcs(pcsTotal);
      setTotalNet(netWgt);
      setTotalGross(grossWgt);
      setTotalOtherWgt(otherWgt);
      setTotalFine(tFine)
    } else {
      setTotalPcs(0);
      setTotalNet(0);
      setTotalGross(0);
      setTotalOtherWgt(0);
      setTotalFine(0);
    }
  }

  return (
    <div className="m-16">
      <Paper className={classes.tabroot}>
        <div className="table-responsive">
          <MaUTable className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableRowPad}>Stock Code</TableCell>
                <TableCell className={classes.tableRowPad}>Packing Slip No</TableCell>
                <TableCell className={classes.tableRowPad}>Pieces</TableCell>
                <TableCell className={classes.tableRowPad}>Purity</TableCell>
                <TableCell className={classes.tableRowPad}>Category</TableCell>
                <TableCell className={classes.tableRowPad}>Gross Weight</TableCell>
                <TableCell className={classes.tableRowPad}>Net Weight</TableCell>
                <TableCell className={classes.tableRowPad}>Fine</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                productData.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell className={classes.tableRowPad}>
                      {row.packet_no}
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      {row.packing_slip_no}
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      {row.pcs}
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      {row.purity}
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      {row.category_name}
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      {row.gross_wgt}
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      {row.net_wgt}
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      {row.pFine.toFixed(3)}
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell className={classes.tableFooter}></TableCell>
                <TableCell className={classes.tableFooter}></TableCell>
                <TableCell className={classes.tableFooter}><b>{totalPcs}</b></TableCell>
                <TableCell className={classes.tableFooter}></TableCell>
                <TableCell className={classes.tableFooter}></TableCell>
                <TableCell className={classes.tableFooter}><b>{totalGross.toFixed(3)}</b></TableCell>
                <TableCell className={classes.tableFooter}><b>{totalNet.toFixed(3)}</b></TableCell>
                <TableCell className={classes.tableFooter}><b>{totalFine.toFixed(3)}</b></TableCell>
              </TableRow>
            </TableFooter>
          </MaUTable>
        </div>
      </Paper>
    </div>
  );
}

export default ItemTabView;