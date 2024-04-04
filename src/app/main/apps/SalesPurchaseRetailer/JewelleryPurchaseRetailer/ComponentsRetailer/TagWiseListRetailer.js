import React, { useEffect, useState,useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import clsx from "clsx";
import Config from "app/fuse-configs/Config";
import HelperFunc from "app/main/apps/SalesPurchase/Helper/HelperFunc"; 
import AppContext from "app/AppContext";

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
    width:"100%"
  },
  table: {
    // minWidth: 1000,
    width:"2000px"
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

const TagWiseListRetailer = (props) => {
  
  const appContext = useContext(AppContext);
  const { SateID } = appContext;
  const [tagWiseData, setTagWiseData] = useState([]); //tag wise Data
  const [stateId, setStateId] = useState("");

  const classes = useStyles();
  const [isView, setIsView] = useState(false);

  useEffect(() => {
    console.log(props);
    setTagWiseData(props.tagWiseData);
    setIsView(props.isView);
    if(props.isView){
      if(props.tagWiseData.length > 0 && props.tagWiseData[0].IGSTper === null){
        setStateId(SateID)
      }else{
        setStateId(0)
      }
    }else{
    setStateId(props.stateId);
  }

    //eslint-disable-next-line
  }, [props]);

  return (
    <Paper className={clsx(classes.tabroot, "m-16 table-responsive ")}>
      <MaUTable className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableRowPad}>Barcode</TableCell>
            <TableCell className={classes.tableRowPad}>Category</TableCell>
            <TableCell className={classes.tableRowPad}>HSN</TableCell>
            <TableCell className={classes.tableRowPad}>Pieces</TableCell>
            <TableCell className={classes.tableRowPad}>Gross Weight</TableCell>
            <TableCell className={classes.tableRowPad}>Net Weight</TableCell>
            <TableCell className={classes.tableRowPad}>Purity</TableCell>
            <TableCell className={classes.tableRowPad}>Fine</TableCell>
            <TableCell className={classes.tableRowPad}>Rate</TableCell>
            {/* <TableCell className={classes.tableRowPad}>Tag amt before discount</TableCell>
            <TableCell className={classes.tableRowPad}>Tag amt after discount</TableCell> */}
            <TableCell className={classes.tableRowPad}>Wastage %</TableCell>
            <TableCell className={classes.tableRowPad}>Wastage</TableCell>
            <TableCell className={classes.tableRowPad}>Labour</TableCell>
            <TableCell className={classes.tableRowPad}>Hallmark Charges</TableCell>
            <TableCell className={classes.tableRowPad}>Amount</TableCell>
            {stateId === SateID && (
              <>
                <TableCell className={classes.tableRowPad}>CGST (%)</TableCell>
                <TableCell className={classes.tableRowPad}>SGST (%)</TableCell>
                <TableCell className={classes.tableRowPad}>CGST</TableCell>
                <TableCell className={classes.tableRowPad}>SGST</TableCell>
              </>
            )}
            {stateId !== SateID && (
              <>
                <TableCell className={classes.tableRowPad}>IGST (%)</TableCell>
                <TableCell className={classes.tableRowPad}>IGST</TableCell>
              </>
            )}
            <TableCell className={classes.tableRowPad}>Total</TableCell>
            <TableCell className={classes.tableRowPad}>Sale price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tagWiseData.map((element, index) => (
            <TableRow key={index}>
              <TableCell className={classes.tableRowPad}>
                {element.Barcode}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {element.Category}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {element.HSNNum}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {element.Pieces}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {parseFloat(element.grossWeight).toFixed(3)}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {parseFloat(element.netWeight).toFixed(3)}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {element.purity}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {parseFloat(element.fine).toFixed(2)}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {parseFloat(element.rate).toFixed(2)}
              </TableCell>
              {/* <TableCell className={classes.tableRowPad}>
                {element.tag_amount_before_discount}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {element.tag_amount_after_discount}
              </TableCell> */}
              <TableCell className={classes.tableRowPad}>
                {parseFloat(element.wastagePer)}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {parseFloat(element.wastageFine).toFixed(2)}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {parseFloat(element.labour_amount).toFixed(2)}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {isView
                  ? Config.numWithComma(parseFloat(element.hallmarkCharges).toFixed(3))
                  : parseFloat(element.hallmarkCharges).toFixed(2)}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {isView
                  ? Config.numWithComma(parseFloat(element.totalAmount).toFixed(3))
                  : parseFloat(element.totalAmount).toFixed(2)}
              </TableCell>

              {stateId === SateID && (
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
                    {isView
                      ? Config.numWithComma(parseFloat(element.cgstVal).toFixed(3))
                      : parseFloat(element.cgstVal).toFixed(2)}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {/* SGST */}
                    {isView
                      ? Config.numWithComma(parseFloat(element.sGstVal).toFixed(3))
                      : parseFloat(element.sGstVal).toFixed(2)}
                  </TableCell>
                </>
              )}

              {stateId !== SateID && (
                <>
                  <TableCell className={classes.tableRowPad}>
                    {/* IGST (%) */}
                    {element.IGSTper}
                  </TableCell>

                  <TableCell className={classes.tableRowPad}>
                    {/* IGST */}
                    {isView
                      ? Config.numWithComma(parseFloat(element.IGSTVal).toFixed(3))
                      : parseFloat(element.IGSTVal).toFixed(2)}
                  </TableCell>
                </>
              )}
              <TableCell className={classes.tableRowPad}>
                {/* Total */}
                {isView ? Config.numWithComma(parseFloat(element.total).toFixed(2)) : parseFloat(element.total).toFixed(3)}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {/* Total */}
                {isView ? Config.numWithComma(parseFloat(element.sales_price).toFixed(2)) : parseFloat(element.sales_price).toFixed(3)}
              </TableCell>
            </TableRow>
          ))}
          <TableRow style={{ backgroundColor:"#D1D8F5"}}>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Stock Code */}
            </TableCell>
           
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Billing Category */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>{/* HSN */}</TableCell>

            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
            {HelperFunc.getTotalOfFieldNoDecimal(tagWiseData, "Pieces")}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Gross Weight */}
              {HelperFunc.getTotalOfField(tagWiseData, "grossWeight")}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Net Weight */}
              {HelperFunc.getTotalOfField(tagWiseData, "netWeight")}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Purity */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Fine */}
              {/* {fineTotal} */}
              {HelperFunc.getTotalOfFieldTwoDecimal(tagWiseData, "fine")}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Rate */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Wastage % */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Wastage */}

              {HelperFunc.getTotalOfFieldTwoDecimal(tagWiseData, "wastageFine")}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* labour */}

              {HelperFunc.getTotalOfFieldTwoDecimal(tagWiseData, "labour_amount")}
            </TableCell>

            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Hallmark Charges */}
              {isView
                ? Config.numWithComma(
                    HelperFunc.getTotalOfFieldTwoDecimal(tagWiseData, "hallmarkCharges")
                  )
                : isNaN(HelperFunc.getTotalOfFieldTwoDecimal(tagWiseData, "hallmarkCharges"))?"" : HelperFunc.getTotalOfFieldTwoDecimal(tagWiseData, "hallmarkCharges")}
            </TableCell>
           
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Total Amount */}
              {isView
                ? Config.numWithComma(
                    HelperFunc.getTotalOfFieldTwoDecimal(tagWiseData, "totalAmount")
                  )
                : HelperFunc.getTotalOfFieldTwoDecimal(tagWiseData, "totalAmount")}
            </TableCell>
            {stateId === SateID && (
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
                        HelperFunc.getTotalOfFieldTwoDecimal(tagWiseData, "cgstVal")
                      )
                    : HelperFunc.getTotalOfFieldTwoDecimal(tagWiseData, "cgstVal")}
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* SGST */}
                  {isView
                    ? Config.numWithComma(
                        HelperFunc.getTotalOfFieldTwoDecimal(tagWiseData, "sGstVal")
                      )
                    : HelperFunc.getTotalOfFieldTwoDecimal(tagWiseData, "sGstVal")}
                </TableCell>
              </>
            )}

            {stateId !== SateID && (
              <>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* IGST (%) */}
                </TableCell>

                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* IGST */}
                  {isView
                    ? Config.numWithComma(
                        HelperFunc.getTotalOfFieldTwoDecimal(tagWiseData, "IGSTVal")
                      )
                    : HelperFunc.getTotalOfFieldTwoDecimal(tagWiseData, "IGSTVal")}
                </TableCell>
              </>
            )}
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Total */}
              {isView
                ? Config.numWithComma(
                    HelperFunc.getTotalOfFieldTwoDecimal(tagWiseData, "total")
                  )
                : HelperFunc.getTotalOfFieldTwoDecimal(tagWiseData, "total")}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Total */}
             
            </TableCell>
          </TableRow>
        </TableBody>
      </MaUTable>
    </Paper>
  );
};

export default TagWiseListRetailer;
