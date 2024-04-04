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
import HelperFunc from "../../Helper/HelperFunc";

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
    tableLayout: "auto",
    minWidth: 1500,
  },
  tableRowPad: {
    padding: 7,
    wordWrap:"break-word",
  },
}));

const CategoryWiseList = (props) => {
  const classes = useStyles();

  const [productData, setProductData] = useState([]); //category wise Data
  const [isView, setIsView] = useState(false);

  useEffect(() => {
    setProductData(props.productData);
    setIsView(props.isView);
    //eslint-disable-next-line
  }, [props]);

  // const getTotalOfField = (arrayList, key) => {
  //   return parseFloat(
  //     arrayList
  //       .filter((item) => item[key] !== "")
  //       .map((item) => parseFloat(item[key]))
  //       .reduce(function (a, b) {
  //         return parseFloat(a) + parseFloat(b);
  //       }, 0)
  //   ).toFixed(3);
  // };

  return (
    <Paper className={clsx(classes.tabroot, "table-responsive")}>
      <MaUTable className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableRowPad}>Category</TableCell>
            <TableCell className={classes.tableRowPad}>
              Billing Category
            </TableCell>
            <TableCell className={classes.tableRowPad}>HSN</TableCell>
            <TableCell className={classes.tableRowPad}>Pieces</TableCell>
            <TableCell className={classes.tableRowPad}>Gross Weight</TableCell>
            <TableCell className={classes.tableRowPad}>Net Weight</TableCell>
            <TableCell className={classes.tableRowPad}>Purity</TableCell>
            <TableCell className={classes.tableRowPad}>Karat</TableCell>
            <TableCell className={classes.tableRowPad}>Wastage %</TableCell>
            <TableCell className={classes.tableRowPad}>Wastage (Fine)</TableCell>
            <TableCell className={classes.tableRowPad}>Other Material Charges</TableCell>
            <TableCell className={classes.tableRowPad}>Total Fine</TableCell>
            <TableCell className={classes.tableRowPad}>Fine Rate</TableCell>
            <TableCell className={classes.tableRowPad}>Cat Rate</TableCell>
            <TableCell className={classes.tableRowPad}>Amount</TableCell>
            <TableCell className={classes.tableRowPad}>
              Hallmark Charge
            </TableCell>
            <TableCell className={classes.tableRowPad}>Total Amt</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {productData.map((element, index) => (
            <TableRow key={index}>
              <TableCell className={classes.tableRowPad}>
                {element.category_name}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {element.billing_category_name}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {element.hsn_number}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {element.pcs}
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
                {element.karat}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {element.wastage}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {element.wastageFine}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {element.other_amt === null ? 0 : Config.numWithComma(element.other_amt)}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {element.totalFine}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                    {element.fineRate ? Config.numWithComma(element.fineRate) :  '-'}
                  </TableCell>
              <TableCell className={classes.tableRowPad}>
                {element.catRate ? Config.numWithComma(element.catRate) :  "-"}
              </TableCell>

              <TableCell className={classes.tableRowPad}>
                {element.amount ? Config.numWithComma(element.amount) :   '-'}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {element.hallmark_charges ? Config.numWithComma(element.hallmark_charges) :  '-'}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {element.totalAmount ?  Config.numWithComma(element.totalAmount) : '-'}
              </TableCell>
            </TableRow>
          ))}
          <TableRow style={{ backgroundColor:"#D1D8F5"}} >
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Category */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Billing Category */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* HSN */}
                </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
            {HelperFunc.getTotalOfFieldNoDecimal(productData, "pcs")}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
            {HelperFunc.getTotalOfField(productData, "gross_wgt")} 
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                {/* {element.net_wgt} */}
                {HelperFunc.getTotalOfField(productData, "net_wgt")}   
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Purity */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>{/* Karat */}</TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Wastage % */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
            {HelperFunc.getTotalOfField(productData, "wastageFine")}
              {/* Wastage (Fine) */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                {/* {element.totalFine} */}
                {HelperFunc.getTotalOfField(productData, "other_amt")} 
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
            {HelperFunc.getTotalOfField(productData, "totalFine")}               
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* Fine Rate */}
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* Cat Rate */}
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* Amount */}
                  {Config.numWithComma(HelperFunc.getTotalOfField(productData, "amount"))}
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* Hallmark Charge */}
                  {Config.numWithComma(HelperFunc.getTotalOfField(productData, "hallmark_charges"))}
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* Total Amt */}
                  {Config.numWithComma(HelperFunc.getTotalOfField(productData, "totalAmount"))}
                </TableCell>
          </TableRow>
        </TableBody>
      </MaUTable>
    </Paper>
  );
};

export default CategoryWiseList;
