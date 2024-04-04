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
    width:"2000px"
  },
  tableRowPad: {
    padding: 7,
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

 

  return (
    <Paper className={clsx(classes.tabroot, "m-16 table-responsive")}>
      <MaUTable className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableRowPad}>Category</TableCell>
            <TableCell className={classes.tableRowPad}>
              Billing Category
            </TableCell>
            <TableCell className={classes.tableRowPad}>Pieces</TableCell>
            <TableCell className={classes.tableRowPad}>Gross Weight</TableCell>
            <TableCell className={classes.tableRowPad}>Net Weight</TableCell>
            <TableCell className={classes.tableRowPad}>Purity</TableCell>
            <TableCell className={classes.tableRowPad}>Karat</TableCell>
            <TableCell className={classes.tableRowPad}>Wastage %</TableCell>
            <TableCell className={classes.tableRowPad}>
              Wastage (Fine)
            </TableCell>
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
                {/* {parseFloat(element.wastageFineAmount).toFixed(3)} */}
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
            </TableRow>
          ))}
          <TableRow style={{backgroundColor:"#D1D8F5"}} >
          {/* <TableRow style={{backgroundColor:"#D3D3D3"}} > */}
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Category */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Billing Category */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
            {HelperFunc.getTotalOfFieldNoDecimal(productData, "pcs")}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {HelperFunc.getTotalOfField(productData, "gross_wgt")}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
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
              {isView
                ? Config.numWithComma(
                    HelperFunc.getTotalOfField(productData, "wastageFineAmount")
                  )
                : HelperFunc.getTotalOfField(productData, "wastageFineAmount")}
              {/* {parseFloat(
                productData
                  .filter((item) => item.wastageFineAmount !== "")
                  .map((item) => parseFloat(item.wastageFineAmount))
                  .reduce(function (a, b) {
                    return parseFloat(a) + parseFloat(b);
                  }, 0)
              ).toFixed(3)} */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
            {HelperFunc.getTotalOfField(productData, "other_amt")}
              {/* Other Material Charges */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* labourRate */}
            </TableCell>

            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Total Amt */}
              {isView
                ? Config.numWithComma(
                    HelperFunc.getTotalOfField(productData, "totalAmount")
                  )
                : HelperFunc.getTotalOfField(productData, "totalAmount")}

              {/* {parseFloat(
                productData
                  .filter((item) => item.totalAmount !== "")
                  .map((item) => parseFloat(item.totalAmount))
                  .reduce(function (a, b) {
                    return parseFloat(a) + parseFloat(b);
                  }, 0)
              ).toFixed(3)} */}
            </TableCell>
          </TableRow>
        </TableBody>
      </MaUTable>
    </Paper>
  );
};

export default CategoryWiseList;
