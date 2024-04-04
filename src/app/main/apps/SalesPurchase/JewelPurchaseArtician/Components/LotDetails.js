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

const LotDetails = (props) => {
  const classes = useStyles();

  const [lotList, setLotList] = useState([]); //category wise Data
  const [stateId, setStateId] = useState("");
  // const [selectedLoad, setSelectedLoad] = useState("");
  const [isView, setIsView] = useState(false);

  useEffect(() => {
    setLotList(props.lotList);
    setStateId(props.stateId);
    setIsView(props.isView);
    // setSelectedLoad(props.selectedLoad);
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
            <TableCell className={classes.tableRowPad}>Lot No</TableCell>
            <TableCell className={classes.tableRowPad}>Pieces</TableCell>
            <TableCell className={classes.tableRowPad}>Gross Weight</TableCell>
            <TableCell className={classes.tableRowPad}>Net Weight</TableCell>
            <TableCell className={classes.tableRowPad}>Purity</TableCell>
            <TableCell className={classes.tableRowPad}>
              Jobwork Fine Utilize
            </TableCell>
            <TableCell className={classes.tableRowPad}>Wastage (%)</TableCell>
            <TableCell className={classes.tableRowPad}>
              Wastage (Fine)
            </TableCell>
            <TableCell className={classes.tableRowPad}>Gold loss (%)</TableCell>
            <TableCell className={classes.tableRowPad}>
              Gold Loss (Fine)
            </TableCell>
            <TableCell className={classes.tableRowPad}>Fine Rate</TableCell>
            <TableCell className={classes.tableRowPad}>
              Labour Fine Amount
            </TableCell>
            <TableCell className={classes.tableRowPad}>
              Category Rate per gram
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
          {console.log(lotList)}
          {lotList.map((element, index) => (
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
                {element.lotNumber}
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
                {isView
                  ? Config.numWithComma(element.fineRate)
                  : parseFloat(element.fineRate).toFixed(3)}
              </TableCell>

              <TableCell className={classes.tableRowPad}>
                {isView
                  ? Config.numWithComma(element.labourFineAmount)
                  : parseFloat(element.labourFineAmount).toFixed(3)}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {isView
                  ? Config.numWithComma(element.catRatePerGram)
                  : parseFloat(element.catRatePerGram).toFixed(3)}
              </TableCell>

              <TableCell className={classes.tableRowPad}>
                {isView
                  ? Config.numWithComma(element.totalAmount)
                  : parseFloat(element.totalAmount).toFixed(3)}
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
                    {isView
                      ? Config.numWithComma(element.cgstVal)
                      : parseFloat(element.cgstVal).toFixed(3)}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {isView
                      ? Config.numWithComma(element.sGstVal)
                      : parseFloat(element.sGstVal).toFixed(3)}
                  </TableCell>
                </>
              )}

              {stateId !== 12 && (
                <>
                  <TableCell className={classes.tableRowPad}>
                    {element.IGSTper}
                  </TableCell>

                  <TableCell className={classes.tableRowPad}>
                    {isView
                      ? Config.numWithComma(element.IGSTVal)
                      : parseFloat(element.IGSTVal).toFixed(3)}
                  </TableCell>
                </>
              )}
              <TableCell className={classes.tableRowPad}>
                {isView
                  ? Config.numWithComma(element.total)
                  : parseFloat(element.total).toFixed(3)}
              </TableCell>
            </TableRow>
          ))}
          <TableRow style={{backgroundColor:"#D3D3D3"}} >
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* {element.category} */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* {element.billingCategory} */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* {element.HSNNum} */}
            </TableCell>

            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* {element.lotNumber} */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* {element.pieces} */}
              {HelperFunc.getTotalOfFieldNoDecimal(lotList, "pieces")}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* {element.grossWeight} */}
              {HelperFunc.getTotalOfField(lotList, "grossWeight")}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* {element.netWeight} */}
              {HelperFunc.getTotalOfField(lotList, "netWeight")}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* {element.purity} */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* {element.jobworkFineUtilize} */}
              {HelperFunc.getTotalOfField(lotList, "jobworkFineUtilize")}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* {element.wastagePer} */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* {element.wastageFine} */}
              {HelperFunc.getTotalOfField(lotList, "wastageFine")}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* {element.goldlossPer} */}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* {element.goldlossFine} */}
              {HelperFunc.getTotalOfField(lotList, "goldlossFine")}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* {element.fineRate} */}
            </TableCell>

            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* {element.labourFineAmount} */}

              {isView
                ? Config.numWithComma(
                    HelperFunc.getTotalOfField(lotList, "labourFineAmount")
                  )
                : HelperFunc.getTotalOfField(lotList, "labourFineAmount")}
            </TableCell>
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* {element.catRatePerGram} */}
            </TableCell>

            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* {element.totalAmount} */}
              {isView
                ? Config.numWithComma(
                    HelperFunc.getTotalOfField(lotList, "totalAmount")
                  )
                : HelperFunc.getTotalOfField(lotList, "totalAmount")}
            </TableCell>

            {stateId === 12 && (
              <>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* {element.cgstPer} */}
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* {element.sGstPer} */}
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* {element.cgstVal} */}
                  {isView
                    ? Config.numWithComma(
                        HelperFunc.getTotalOfField(lotList, "cgstVal")
                      )
                    : HelperFunc.getTotalOfField(lotList, "cgstVal")}
                </TableCell>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* {element.sGstVal} */}
                  {isView
                    ? Config.numWithComma(
                        HelperFunc.getTotalOfField(lotList, "sGstVal")
                      )
                    : HelperFunc.getTotalOfField(lotList, "sGstVal")}
                </TableCell>
              </>
            )}

            {stateId !== 12 && (
              <>
                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* {element.IGSTper} */}
                </TableCell>

                <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                  {/* {element.IGSTVal} */}
                  {isView
                    ? Config.numWithComma(
                        HelperFunc.getTotalOfField(lotList, "IGSTVal")
                      )
                    : HelperFunc.getTotalOfField(lotList, "IGSTVal")}
                </TableCell>
              </>
            )}
            <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
              {/* {element.total} */}
              {isView
                ? Config.numWithComma(
                    HelperFunc.getTotalOfField(lotList, "total")
                  )
                : HelperFunc.getTotalOfField(lotList, "total")}
            </TableCell>
          </TableRow>
        </TableBody>
      </MaUTable>
    </Paper>
  );
};

export default LotDetails;
