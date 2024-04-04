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

const CategoryWiseList = (props) => {
  const classes = useStyles();

  const [productData, setProductData] = useState([]); //category wise Data
  const [stateId, setStateId] = useState("");
  const [isView, setIsView] = useState(false);

  useEffect(() => {
    setProductData(props.productData);
    setStateId(props.stateId);
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
            <TableCell className={classes.tableRowPad}>HSN</TableCell>

            <TableCell className={classes.tableRowPad}>Pieces</TableCell>
            <TableCell className={classes.tableRowPad}>Gross Weight</TableCell>
            <TableCell className={classes.tableRowPad}>Net Weight</TableCell>
            <TableCell className={classes.tableRowPad}>Purity</TableCell>
            <TableCell className={classes.tableRowPad}>Fine</TableCell>
            <TableCell className={classes.tableRowPad}>Wastage %</TableCell>
            <TableCell className={classes.tableRowPad}>Wastage</TableCell>
            <TableCell className={classes.tableRowPad}>Total Fine</TableCell>
            <TableCell className={classes.tableRowPad}>
              Tag Amount Before Discount
            </TableCell>
            <TableCell className={classes.tableRowPad}>
              Tag Amount After Discount
            </TableCell>
            <TableCell className={classes.tableRowPad}>Fine Rate</TableCell>
            <TableCell className={classes.tableRowPad}>Category Rate</TableCell>
            <TableCell className={classes.tableRowPad}>Amount</TableCell>

            <TableCell className={classes.tableRowPad}>
              Hallmark Charges
            </TableCell>
            <TableCell className={classes.tableRowPad}>Total Amount</TableCell>

            {stateId === 12 && (
              <>
                <TableCell className={classes.tableRowPad}>CGST (%)</TableCell>
                <TableCell className={classes.tableRowPad}>SGST (%)</TableCell>
                <TableCell className={classes.tableRowPad}>CGST</TableCell>
                <TableCell className={classes.tableRowPad}>SGST</TableCell>
              </>
            )}

            {stateId !== 12 && (
              <>
                <TableCell className={classes.tableRowPad}>IGST (%)</TableCell>

                <TableCell className={classes.tableRowPad}>IGST</TableCell>
              </>
            )}
            <TableCell className={classes.tableRowPad}>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {productData.map((element, index) => (
            <TableRow key={index}>
              <TableCell className={classes.tableRowPad}>
                {element.Category}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {element.billingCategory}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {element.HSNNum}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {element.Pieces}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                  {element.grossWeight}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {element.netWeight}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {element.purity}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {element.fine}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {element.wastagePer}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {element.wastageFine}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {element.totalFine}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {isView
                  ? Config.numWithComma(element.tag_amount_before_discount)
                  : isNaN(element.tag_amount_before_discount)?"":element.tag_amount_before_discount}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {isView
                  ? Config.numWithComma(element.tag_amount_after_discount)
                  : isNaN(element.tag_amount_after_discount)?"":element.tag_amount_after_discount}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {isView
                  ? Config.numWithComma(element.fineRate)
                  : element.fineRate}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {isView
                  ? Config.numWithComma(element.categoryRate)
                  : element.categoryRate}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {isView ? Config.numWithComma(element.amount) : isNaN(element.amount)?"":element.amount}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {isView
                  ? Config.numWithComma(element.hallmarkCharges)
                  : isNaN(element.hallmarkCharges)?"":element.hallmarkCharges}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {isView
                  ? Config.numWithComma(element.totalAmount)
                  : element.totalAmount}
              </TableCell>

              {stateId === 12 && (
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
                      ? Config.numWithComma(element.cgstVal)
                      : element.cgstVal}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {/* SGST */}
                    {isView
                      ? Config.numWithComma(element.sGstVal)
                      : element.sGstVal}
                  </TableCell>
                </>
              )}

              {stateId !== 12 && (
                <>
                  <TableCell className={classes.tableRowPad}>
                    {/* IGST (%) */}
                    {element.IGSTper}
                  </TableCell>

                  <TableCell className={classes.tableRowPad}>
                    {/* IGST */}
                    {isView
                      ? Config.numWithComma(element.IGSTVal)
                      : element.IGSTVal}
                  </TableCell>
                </>
              )}
              <TableCell className={classes.tableRowPad}>
                {/* Total */}
                {isView ? Config.numWithComma(element.total) : element.total}
              </TableCell>
            </TableRow>
          ))}
          <TableRow style={{ backgroundColor:"#D1D8F5"}}>
            <TableCell className={classes.tableRowPad}>
              {/* Category */}
            </TableCell>
            <TableCell className={classes.tableRowPad}>
              {/* Billing Category */}
            </TableCell>
            <TableCell className={classes.tableRowPad}>{/* HSN */}</TableCell>

            <TableCell className={classes.tableRowPad}>
            {HelperFunc.getTotalOfFieldNoDecimal(productData, "Pieces")}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}} >
              {/* Gross Weight */}
              {HelperFunc.getTotalOfField(productData, "grossWeight")}
              {/* {parseFloat(
                    productData
                      .filter((item) => item.grossWeight !== "")
                      .map((item) => parseFloat(item.grossWeight))
                      .reduce(function (a, b) {
                        return parseFloat(a) + parseFloat(b);
                      }, 0)
                  ).toFixed(3)} */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Net Weight */}
              {HelperFunc.getTotalOfField(productData, "netWeight")}
            </TableCell>
            <TableCell className={classes.tableRowPad}>
              {/* Purity */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Fine */}
              {/* {fineTotal} */}
              {HelperFunc.getTotalOfField(productData, "fine")}
            </TableCell>
            <TableCell className={classes.tableRowPad}>
              {/* Wastage % */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Wastage */}
              {HelperFunc.getTotalOfField(productData, "wastageFine")}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Total Fine */}
              {HelperFunc.getTotalOfField(productData, "totalFine")}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Tag Amount Before Discount */}
              {/* {tagAmountBefTot} */}
              {isView
                ? Config.numWithComma(
                    HelperFunc.getTotalOfField(
                      productData,
                      "tag_amount_before_discount"
                    )
                  )
                : isNaN(HelperFunc.getTotalOfField(
                    productData,
                    "tag_amount_before_discount"
                  ))?"" : HelperFunc.getTotalOfField(
                    productData,
                    "tag_amount_before_discount"
                  )}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Tag Amount After Discount */}
              {/* {tagAmountAftTot} */}
              {isView
                ? Config.numWithComma(
                    HelperFunc.getTotalOfField(
                      productData,
                      "tag_amount_after_discount"
                    )
                  )
                : isNaN(HelperFunc.getTotalOfField(
                    productData,
                    "tag_amount_after_discount"
                  ))? "" : HelperFunc.getTotalOfField(
                    productData,
                    "tag_amount_after_discount"
                  )}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Fine Rate */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Category Rate */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Amount */}
              {/* {amount} */}
              {isView
                ? Config.numWithComma(
                    HelperFunc.getTotalOfField(productData, "amount")
                  )
                : isNaN(HelperFunc.getTotalOfField(productData, "amount"))?"":HelperFunc.getTotalOfField(productData, "amount")}
            </TableCell>

            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Hallmark Charges */}
              {/* {hallmarkCharges} */}
              {isView
                ? Config.numWithComma(
                    HelperFunc.getTotalOfField(productData, "hallmarkCharges")
                  )
                : isNaN(HelperFunc.getTotalOfField(productData, "hallmarkCharges"))? "": HelperFunc.getTotalOfField(productData, "hallmarkCharges")}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Total Amount */}
              {/* {totalAmount} */}
              {isView
                ? Config.numWithComma(
                    HelperFunc.getTotalOfField(productData, "totalAmount")
                  )
                : HelperFunc.getTotalOfField(productData, "totalAmount")}
            </TableCell>

            {stateId === 12 && (
              <>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* CGST (%) */}
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* SGST (%) */}
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* CGST */}
                  {/* {cgstVal} */}
                  {isView
                    ? Config.numWithComma(
                        HelperFunc.getTotalOfField(productData, "cgstVal")
                      )
                    : HelperFunc.getTotalOfField(productData, "cgstVal")}
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* SGST */}
                  {/* {sgstVal} */}
                  {isView
                    ? Config.numWithComma(
                        HelperFunc.getTotalOfField(productData, "sGstVal")
                      )
                    : HelperFunc.getTotalOfField(productData, "sGstVal")}
                </TableCell>
              </>
            )}

            {stateId !== 12 && (
              <>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* IGST (%) */}
                </TableCell>

                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* {igstVal} */}
                  {/* IGST */}
                  {isView
                    ? Config.numWithComma(
                        HelperFunc.getTotalOfField(productData, "IGSTVal")
                      )
                    : HelperFunc.getTotalOfField(productData, "IGSTVal")}
                </TableCell>
              </>
            )}
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* Total */}
              {/* {total} */}
              {isView
                ? Config.numWithComma(
                    HelperFunc.getTotalOfField(productData, "total")
                  )
                : HelperFunc.getTotalOfField(productData, "total")}
            </TableCell>
          </TableRow>
        </TableBody>
      </MaUTable>
    </Paper>
  );
};

export default CategoryWiseList;
