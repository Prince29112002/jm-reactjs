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

const CategoryWiseList = (props) => {
  const classes = useStyles();

  const [productData, setProductData] = useState([]); //category wise Data
  const [stateId, setStateId] = useState("");
  // const [selectedLoad, setSelectedLoad] = useState("");
  const [isView, setIsView] = useState(false);

  useEffect(() => {
    setProductData(props.productData);
    setStateId(props.stateId);
    setIsView(props.isView);
  }, [props]);

  return (
      <Paper className={clsx(classes.tabroot, "m-16 table-responsive")} >
         <MaUTable className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableRowPad}>Category</TableCell>
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
                <TableCell className={classes.tableRowPad}>
                  Jobwork Fine Utilize
                </TableCell>
                <TableCell className={classes.tableRowPad}>Wastage %</TableCell>
                <TableCell className={classes.tableRowPad}>Wastage</TableCell>
                <TableCell className={classes.tableRowPad}>Gold loss (%)</TableCell>
                <TableCell className={classes.tableRowPad}>
                  Gold Loss (Fine)
                </TableCell>
                <TableCell className={classes.tableRowPad}>Fine Rate</TableCell>
                <TableCell className={classes.tableRowPad}>
                  Labour Fine Amount
                </TableCell>

                <TableCell className={classes.tableRowPad}>
                  Tag Amount Before Discount
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  Tag Amount After Discount
                </TableCell>

                <TableCell className={classes.tableRowPad}>
                  Category Rate per gram
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  Total Amount
                </TableCell>

                {stateId === 12 && (
                  <>
                    <TableCell className={classes.tableRowPad}>
                      CGST (%)
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      SGST (%)
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>CGST</TableCell>
                    <TableCell className={classes.tableRowPad}>SGST</TableCell>
                  </>
                )}

                {stateId !== 12 && (
                  <>
                    <TableCell className={classes.tableRowPad}>
                      IGST (%)
                    </TableCell>

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
                    {element.category}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {element.billingCategory}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {element.HSNNum}
                  </TableCell>

                  <TableCell className={classes.tableRowPad}>
                    {element.pieces}
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
                    {element.jobworkFineUtilize}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {element.wastagePer}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {element.wastageFine}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {element.goldlossper}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {element.goldlossFine}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {isView ? Config.numWithComma(element.fineRate) : parseFloat(element.fineRate).toFixed(3)}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {isView ? Config.numWithComma(element.labourFineAmount) : parseFloat(element.labourFineAmount).toFixed(3)}
                  </TableCell>

                  <TableCell className={classes.tableRowPad}>
                    {/* Tag Amount Before Discount */}
                    {isView ? Config.numWithComma(element.tag_amount_before_discount) : parseFloat(element.tag_amount_before_discount).toFixed(3)}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {/* Tag Amount After Discount */}
                    {isView ? Config.numWithComma(element.tag_amount_after_discount) : parseFloat(element.tag_amount_after_discount).toFixed(3)}
                  </TableCell>

                  <TableCell className={classes.tableRowPad}>
                    {isView ? Config.numWithComma(element.catRatePerGram) : parseFloat(element.catRatePerGram).toFixed(3)}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {isView ? Config.numWithComma(element.totalAmount) : parseFloat(element.totalAmount).toFixed(3)}
                  </TableCell>

                  {stateId === 12 && (
                    <>
                      <TableCell className={classes.tableRowPad}>
                        {element.cgstPer}
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        {element.sGstPer}
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        {isView ? Config.numWithComma(element.cgstVal) : parseFloat(element.cgstVal).toFixed(3)}
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        {isView ? Config.numWithComma(element.sGstVal) : parseFloat(element.sGstVal).toFixed(3)}
                      </TableCell>
                    </>
                  )}

                  {stateId !== 12 && (
                    <>
                      <TableCell className={classes.tableRowPad}>
                        {element.IGSTper}
                      </TableCell>

                      <TableCell className={classes.tableRowPad}>
                        {isView ? Config.numWithComma(element.IGSTVal) : parseFloat(element.IGSTVal).toFixed(3)}
                      </TableCell>
                    </>
                  )}
                  <TableCell className={classes.tableRowPad}>
                    {isView ? Config.numWithComma(element.total) : parseFloat(element.total).toFixed(3)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow style={{backgroundColor:"#D3D3D3"}}>
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
                  {/* Pieces */}
                  {HelperFunc.getTotalOfFieldNoDecimal(productData, "pieces")}
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* Gross Weight */}
                  {/* {totalGrossWeight} */}
                  {HelperFunc.getTotalOfField(productData, "grossWeight")}
                 
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* Net Weight */}
                  {HelperFunc.getTotalOfField(productData, "netWeight")}
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* Purity */}
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* Jobwork Fine Utilize */}
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* Wastage % */}
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>         
                  {/* Wastage */}
                  {HelperFunc.getTotalOfField(productData, "wastageFine")}
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* {element.goldlossPer} */}
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* {element.goldlossFine} */}
                  {HelperFunc.getTotalOfField(productData, "goldlossFine")}
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* Fine Rate */}
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* Labour Fine Amount */}
                  {HelperFunc.getTotalOfField(productData, "labourFineAmount")}
                </TableCell>

                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* Tag Amount Before Discount */}
                  {HelperFunc.getTotalOfField(productData, "tag_amount_before_discount")}
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* Tag Amount After Discount */}
                  {HelperFunc.getTotalOfField(productData, "tag_amount_after_discount")}
                </TableCell>

                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* Category Rate per gram */}
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
                      {/* {sgstVal} */}
                      {/* SGST */}
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
                      {/* IGST */}
                      {/* {igstVal} */}
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
