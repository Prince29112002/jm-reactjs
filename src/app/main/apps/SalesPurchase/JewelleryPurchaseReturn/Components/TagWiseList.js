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

const TagWiseList = (props) => {
  const [tagWiseData, setTagWiseData] = useState([]); //tag wise Data
  const [stateId, setStateId] = useState("");
  const [isView, setIsView] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    setTagWiseData(props.tagWiseData);
    setStateId(props.stateId)
    setIsView(props.isView);

    //eslint-disable-next-line
  }, [props]);

  return (
      <Paper className={clsx(classes.tabroot, "m-16 table-responsive")} >
          <MaUTable className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableRowPad}>
                  Stock Code
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
                  Other tag Amount
                </TableCell>

                <TableCell className={classes.tableRowPad}>
                  Total Fine
                </TableCell>
                <TableCell className={classes.tableRowPad}>Fine Rate</TableCell>
                <TableCell className={classes.tableRowPad}>
                  Category Rate
                </TableCell>
                <TableCell className={classes.tableRowPad}>Amount</TableCell>

                <TableCell className={classes.tableRowPad}>
                  Hallmark Charges
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
                    {/* Billing Category */}
                    {element.billing_category_name}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {/* HSN */}
                    {element.hsn_number}
                  </TableCell>

                  <TableCell className={classes.tableRowPad}>
                    {/* Pcs */}
                    {element.pcs}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {/* Gross Weight */}
                    {parseFloat(element.gross_wgt).toFixed(3)}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {/* Net Weight */}
                    {parseFloat(element.net_wgt).toFixed(3)}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {/* Purity */}
                    {element.purity}
                  </TableCell>

                  <TableCell className={classes.tableRowPad}>
                    {/* Wastage % */}
                    {element.wastage}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {/* Wastage */}
                    {element.wastageFine}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {/* Other tag Amount */}
                    {element.other_amt === null ? 0 : isView ? Config.numWithComma(element.other_amt) :  parseFloat(element.other_amt).toFixed(3)}
                  </TableCell>

                  <TableCell className={classes.tableRowPad}>
                    {/* Total Fine */}
                    {element.totalFine}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {/* Fine Rate */}
                    {element.fineRate ?  isView ? Config.numWithComma(element.fineRate) :  parseFloat(element.fineRate).toFixed(3) : '-'}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {/* Category Rate */}
                    {element.catRate ? isView ? Config.numWithComma(element.catRate) : parseFloat(element.catRate).toFixed(3) : '-'}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {/* Amount */}
                    {element.amount ? isView ? Config.numWithComma(element.amount) : parseFloat(element.amount).toFixed(3) : '-'}
                  </TableCell>

                  <TableCell className={classes.tableRowPad}>
                    {/* Hallmark Charges */}
                    {element.hallmark_charges ? isView ? Config.numWithComma(element.hallmark_charges) :  parseFloat(element.hallmark_charges).toFixed(3) : '-'}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {/* Total Amount */}
                    {element.totalAmount ? isView ? Config.numWithComma(element.totalAmount) : parseFloat(element.totalAmount).toFixed(3) : '-'}
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
                        {element.cgstVal ?isView ? Config.numWithComma(element.cgstVal) :  parseFloat(element.cgstVal).toFixed(3) : '-'}
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        {/* SGST */}
                        {element.sGstVal ? isView ? Config.numWithComma(element.sGstVal) : parseFloat(element.sGstVal).toFixed(3) : '-'}
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
                        {element.IGSTVal ? isView ? Config.numWithComma(element.IGSTVal) :  parseFloat(element.IGSTVal).toFixed(3) : '-'}
                      </TableCell>
                    </>
                  )}
                  <TableCell className={classes.tableRowPad}>
                    {/* Total */}
                    {element.total ? isView ? Config.numWithComma(element.total) : parseFloat(element.total).toFixed(3) : '-'}
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
                  {/* HSN */}
                </TableCell>

                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {HelperFunc.getTotalOfFieldNoDecimal(tagWiseData, "pcs")}
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* Gross Weight */}
                  {/* {totalGrossWeight} */}
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
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* {OtherTagAmount} */}
                  {/* Other tag Amount */}
                  {isView
                ? Config.numWithComma(
                    HelperFunc.getTotalOfField(tagWiseData, "other_amt")
                  )
                : HelperFunc.getTotalOfField(tagWiseData, "other_amt")}
                  
                </TableCell>

                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* Total Fine */}
                  {/* {fineGoldTotal} */}
                  {HelperFunc.getTotalOfField(tagWiseData, "totalFine")}

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
                    HelperFunc.getTotalOfField(tagWiseData, "amount")
                  )
                : HelperFunc.getTotalOfField(tagWiseData, "amount")}
          
                </TableCell>

                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* Hallmark Charges */}
                  {/* {hallmark_charges} */}
                  {isView
                ? Config.numWithComma(
                    HelperFunc.getTotalOfField(tagWiseData, "hallmark_charges")
                  )
                : HelperFunc.getTotalOfField(tagWiseData, "hallmark_charges")}

                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* Total Amount */}
                  {/* {totalAmount} */}
                  {isView
                ? Config.numWithComma(
                    HelperFunc.getTotalOfField(tagWiseData, "totalAmount")
                  )
                : HelperFunc.getTotalOfField(tagWiseData, "totalAmount")}
                 
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
                      {/* {cgstVal} */}
                      {/* CGST */}
                      {isView
                ? Config.numWithComma(
                    HelperFunc.getTotalOfField(tagWiseData, "cgstVal")
                  )
                : HelperFunc.getTotalOfField(tagWiseData, "cgstVal")}
                     
                    </TableCell>
                    <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                      {/* SGST */}
                      {/* {sgstVal} */}
                      {isView
                ? Config.numWithComma(
                    HelperFunc.getTotalOfField(tagWiseData, "sGstVal")
                  )
                : HelperFunc.getTotalOfField(tagWiseData, "sGstVal")}
                     
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
                    HelperFunc.getTotalOfField(tagWiseData, "IGSTVal")
                  )
                : HelperFunc.getTotalOfField(tagWiseData, "IGSTVal")}

                    </TableCell>
                  </>
                )}
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* Total */}
                  {/* {total} */}
                  {isView
                ? Config.numWithComma(
                    HelperFunc.getTotalOfField(tagWiseData, "total")
                  )
                : HelperFunc.getTotalOfField(tagWiseData, "total")}
                 
                </TableCell>
              </TableRow>
            </TableBody>
          </MaUTable>
      </Paper>
  );
};

export default TagWiseList;
