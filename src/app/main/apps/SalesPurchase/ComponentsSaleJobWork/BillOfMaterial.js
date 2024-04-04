import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
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

const BillOfMaterial = (props) => {
  const [billMaterialData, setBillmaterialData] = useState([]); //bill of material Data
  const classes = useStyles();
  const [isView, setIsView] = useState(false);

  useEffect(() => {
    setBillmaterialData(props.billMaterialData);
    setIsView(props.isView);

    //eslint-disable-next-line
  }, [props]);

  return (
        <Paper className={clsx(classes.tabroot, "m-16 table-responsive")}>
          <MaUTable className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableRowPad}>Barcode</TableCell>
                <TableCell className={classes.tableRowPad}>Design Variant Number</TableCell>
                <TableCell className={classes.tableRowPad}>Pieces</TableCell>
                <TableCell className={classes.tableRowPad}>Purity</TableCell>
                <TableCell className={classes.tableRowPad}>Net Wgt</TableCell>
                <TableCell className={classes.tableRowPad}>
                  Wastage Fine
                </TableCell>
                {/* <TableCell className={classes.tableRowPad}>Metal Amt</TableCell> */}
                <TableCell className={classes.tableRowPad}>Stone Wgt</TableCell>
                <TableCell className={classes.tableRowPad}>Stone Amt</TableCell>
                <TableCell className={classes.tableRowPad}>Beads Wgt</TableCell>
                <TableCell className={classes.tableRowPad}>Beads Amt</TableCell>
                <TableCell className={classes.tableRowPad}>
                  Silver Wgt
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  Silver Amt
                </TableCell>
                <TableCell className={classes.tableRowPad}>Sol Wgt</TableCell>
                <TableCell className={classes.tableRowPad}>Sol Amt</TableCell>
                <TableCell className={classes.tableRowPad}>Other Wgt</TableCell>
                <TableCell className={classes.tableRowPad}>Other Amt</TableCell>
                {/* <TableCell className={classes.tableRowPad}>
                  Hallmark Charge
                </TableCell> */}
                <TableCell className={classes.tableRowPad}>Total Amt</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {billMaterialData.map((element, index) => (
                <TableRow key={index}>
                  <TableCell className={classes.tableRowPad}>
                    {element.barcode}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {element.variant_number}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {element.pcs}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {element.purity}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {parseFloat(element.net_wgt).toFixed(3)}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {element.wastageFine}
                  </TableCell>
                  {/* <TableCell className={classes.tableRowPad}>
                    {element.metal_amt}
                  </TableCell> */}
                  <TableCell className={classes.tableRowPad}>
                    {parseFloat(element.stone_wgt).toFixed(3)}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {isView ? Config.numWithComma(element.stone_amt) : parseFloat(element.stone_amt).toFixed(3)}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {parseFloat(element.beads_wgt).toFixed(3)}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {isView ? Config.numWithComma(element.beads_amt) : parseFloat(element.beads_amt).toFixed(3)}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {parseFloat(element.silver_wgt).toFixed(3)}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {isView ? Config.numWithComma(element.silver_amt) : parseFloat(element.silver_amt).toFixed(3)}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {parseFloat(element.sol_wgt).toFixed(3)}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {isView ? Config.numWithComma(element.sol_amt) : parseFloat(element.sol_amt).toFixed(3)}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {parseFloat(element.other_wgt).toFixed(3)}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {isView ? Config.numWithComma(element.other_amt) : parseFloat(element.other_amt).toFixed(3)}
                  </TableCell>
                  {/* <TableCell className={classes.tableRowPad}>
                    {element.hallmark_charges}
                  </TableCell> */}
                  <TableCell className={classes.tableRowPad}>
                    {isView ? Config.numWithComma(element.totalAmount) : parseFloat(element.totalAmount).toFixed(3)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow style={{backgroundColor:"#D1D8F5"}} >
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* Barcode */}
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* variant number */}
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {HelperFunc.getTotalOfFieldNoDecimal(billMaterialData, "pcs")}
                  {/* Pcs */}
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* Purity */}
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* Metal Wgt */}
                  {HelperFunc.getTotalOfField(billMaterialData, "net_wgt")}                 

                  {/* {parseFloat(
                    billMaterialData
                      .filter((item) => item.net_wgt !== "")
                      .map((item) => parseFloat(item.net_wgt))
                      .reduce(function (a, b) {
                        return parseFloat(a) + parseFloat(b);
                      }, 0)
                  ).toFixed(3)} */}
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {HelperFunc.getTotalOfField(billMaterialData, "wastageFine")}                 
                  {/* Wastage Fine */}
                </TableCell>
                {/* <TableCell className={classes.tableRowPad}>
                   Metal Amt 
                  {parseFloat(
                    billMaterialData
                      .filter((item) => item.metal_amt !== "")
                      .map((item) => parseFloat(item.metal_amt))
                      .reduce(function (a, b) {
                        return parseFloat(a) + parseFloat(b);
                      }, 0)
                  ).toFixed(3)}
                </TableCell> */}
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* Stone Wgt */}
                  {HelperFunc.getTotalOfField(billMaterialData, "stone_wgt")}                  

                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* {element.stone_amt} */}
                  {isView
                ? Config.numWithComma(
                    HelperFunc.getTotalOfField(billMaterialData, "stone_amt")
                  )
                : HelperFunc.getTotalOfField(billMaterialData, "stone_amt")}
                  
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* {element.beads_wgt} */}
                  {HelperFunc.getTotalOfField(billMaterialData, "beads_wgt")}                  

                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* {element.beads_amt} */}
                  {isView
                ? Config.numWithComma(
                    HelperFunc.getTotalOfField(billMaterialData, "beads_amt")
                  )
                : HelperFunc.getTotalOfField(billMaterialData, "beads_amt")}
                  
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* {element.silver_wgt} */}

                  {HelperFunc.getTotalOfField(billMaterialData, "silver_wgt")}                  

                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* {element.silver_amt} */}
                  {isView
                ? Config.numWithComma(
                    HelperFunc.getTotalOfField(billMaterialData, "silver_amt")
                  )
                : HelperFunc.getTotalOfField(billMaterialData, "silver_amt")}
                  
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* {element.sol_wgt} */}
                  {HelperFunc.getTotalOfField(billMaterialData, "sol_wgt")}                  

                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* {element.sol_amt} */}
                  {isView
                ? Config.numWithComma(
                    HelperFunc.getTotalOfField(billMaterialData, "sol_amt")
                  )
                : HelperFunc.getTotalOfField(billMaterialData, "sol_amt")}
                  
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* {element.other_wgt} */}
                  {HelperFunc.getTotalOfField(billMaterialData, "other_wgt")}                  

                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* {element.other_amt} */}
                  {isView
                ? Config.numWithComma(
                    HelperFunc.getTotalOfField(billMaterialData, "other_amt")
                  )
                : HelperFunc.getTotalOfField(billMaterialData, "other_amt")}
                  
                </TableCell>
                {/* <TableCell className={classes.tableRowPad}>
                  
                  {parseFloat(
                    billMaterialData
                      .filter((item) => item.hallmark_charges !== "")
                      .map((item) => parseFloat(item.hallmark_charges))
                      .reduce(function (a, b) {
                        return parseFloat(a) + parseFloat(b);
                      }, 0)
                  ).toFixed(3)}
                </TableCell> */}
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* {element.totalAmount} */}
                  {isView
                ? Config.numWithComma(
                    HelperFunc.getTotalOfField(billMaterialData, "totalAmount")
                  )
                : HelperFunc.getTotalOfField(billMaterialData, "totalAmount")}
                  
                </TableCell>
              </TableRow>
            </TableBody>
          </MaUTable>
      </Paper>
  );
};

export default BillOfMaterial;
