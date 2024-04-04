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
  searchBox: {
    padding: 6,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
  },
}));

const TagWiseList = (props) => {
  const [tagWiseData, setTagWiseData] = useState([]); //tag wise Data
  const [isView, setIsView] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    setTagWiseData(props.tagWiseData);
    setIsView(props.isView);
    //eslint-disable-next-line
  }, [props]);

  return (
    <Paper className={clsx(classes.tabroot, "m-16 table-responsive")}>
      <MaUTable className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableRowPad}>Stock Code</TableCell>
            <TableCell className={classes.tableRowPad}>Design Variant Number</TableCell>
            <TableCell className={classes.tableRowPad}>Packet No</TableCell>
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
          </TableRow>
        </TableHead>
        <TableBody>
          {tagWiseData.map((element, index) => (
            <TableRow key={index}>
              <TableCell className={classes.tableRowPad}>
                {element.barcode}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {element.variant_number}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {element.packet_no}
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
            </TableRow>
          ))}
          <TableRow style={{backgroundColor:"#D1D8F5"}} >
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Stock Code */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* variant number */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Packet No */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Billing Category */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
            {HelperFunc.getTotalOfFieldNoDecimal(tagWiseData, "pcs")}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
            {HelperFunc.getTotalOfField(tagWiseData, "gross_wgt")}
              {/* Gross Weight */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
            {HelperFunc.getTotalOfField(tagWiseData, "net_wgt")}
              {/* Net Weight */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Purity */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Wastage % */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
            {HelperFunc.getTotalOfField(tagWiseData, "wastageFine")}
              {/* Wastage */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {isView
                ? Config.numWithComma(
                    HelperFunc.getTotalOfField(tagWiseData, "wastageFineAmount")
                  )
                : HelperFunc.getTotalOfField(tagWiseData, "wastageFineAmount")}

              {/* {parseFloat(
                    tagWiseData
                      .filter((item) => item.wastageFineAmount !== "")
                      .map((item) => parseFloat(item.wastageFineAmount))
                      .reduce(function (a, b) {
                        return parseFloat(a) + parseFloat(b);
                      }, 0)
                  ).toFixed(3)} */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
            {HelperFunc.getTotalOfField(tagWiseData, "other_amt")}
              {/* Other Material Charges */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* labourRate */}
            </TableCell>

            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Total Amt */}
              {isView
                ? Config.numWithComma(
                    HelperFunc.getTotalOfField(tagWiseData, "totalAmount")
                  )
                : HelperFunc.getTotalOfField(tagWiseData, "totalAmount")}
              {/* {parseFloat(
                    tagWiseData
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

export default TagWiseList;
