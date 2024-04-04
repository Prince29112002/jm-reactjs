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

const TagWiseList = (props) => {
  const [tagWiseData, setTagWiseData] = useState([]); //tag wise Data

  const classes = useStyles();

  useEffect(() => {
    setTagWiseData(props.tagWiseData);
    //eslint-disable-next-line
  }, [props]);

  return (
          <Paper className={clsx(classes.tabroot, "table-responsive")}>
          <MaUTable className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableRowPad}>
                  Barcode
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  Design Variant Number
                </TableCell>
                <TableCell className={classes.tableRowPad}>Packet No</TableCell>
                <TableCell className={classes.tableRowPad}>
                  Billing Category
                </TableCell>
                <TableCell className={classes.tableRowPad}>HSN</TableCell>
                <TableCell className={classes.tableRowPad}>Pieces</TableCell>
                <TableCell className={classes.tableRowPad}>
                  Gross Weight
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  Net Weight
                </TableCell>
                <TableCell className={classes.tableRowPad}>Purity</TableCell>
                <TableCell className={classes.tableRowPad}>Wastage %</TableCell>
                <TableCell className={classes.tableRowPad}>Wastage</TableCell>
                <TableCell className={classes.tableRowPad}>
                  Other Material Charges
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  Total Fine
                </TableCell>
                <TableCell className={classes.tableRowPad}>Fine Rate</TableCell>
                <TableCell className={classes.tableRowPad}>Amount</TableCell>
                <TableCell className={classes.tableRowPad}>
                  Hallmark Charge
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
                    {element.wastage}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {element.wastageFine}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {element.other_amt === null ? 0 : parseFloat(element.other_amt).toFixed(3)}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {element.totalFine}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {element.fineRate ? parseFloat(element.fineRate).toFixed(3) : '-'}
                  </TableCell>

                  <TableCell className={classes.tableRowPad}>
                    {element.amount ? parseFloat(element.amount).toFixed(3) : '-'}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {element.hallmarkChargesFrontEnd ? 
                    parseFloat(element.hallmarkChargesFrontEnd).toFixed(3) : '-'}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {element.totalAmount ? parseFloat(element.totalAmount).toFixed(3) : '-'}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow style={{backgroundColor:"#D1D8F5"}}>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* Stock Code */}
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/*design variant number */}
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* Packet No */}
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* Billing Category */}
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* HSN */}
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {HelperFunc.getTotalOfFieldNoDecimal(tagWiseData, "pcs")}
                  {/* Pcs */}
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* Gross Weight */}
                  {HelperFunc.getTotalOfField(tagWiseData, "gross_wgt")}
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* Net Weight */}
                  {HelperFunc.getTotalOfField(tagWiseData, "net_wgt")}
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
                  {HelperFunc.getTotalOfField(tagWiseData, "other_amt")}
                  {/* Other Material Charges */}
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* Total Fine */}
                  {HelperFunc.getTotalOfField(tagWiseData, "totalFine")}
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* Fine Rate */}
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* Amount */}
                  {Config.numWithComma(HelperFunc.getTotalOfField(tagWiseData, "amount"))}
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* Hallmark Charge */}
                  {Config.numWithComma(HelperFunc.getTotalOfField(tagWiseData, "hallmarkChargesFrontEnd"))}
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* Total Amt */}
                  {Config.numWithComma(HelperFunc.getTotalOfField(tagWiseData, "totalAmount"))}
                </TableCell>
              </TableRow>
            </TableBody>
          </MaUTable>
      </Paper>
  );
};

export default TagWiseList;
