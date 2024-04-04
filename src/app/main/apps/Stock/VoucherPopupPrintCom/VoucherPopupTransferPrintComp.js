import * as React from "react";
import QRCode from "react-qr-code";
import clsx from "clsx";
import HelperFunc from "../../SalesPurchase/Helper/HelperFunc";
import Config from "app/fuse-configs/Config";
import moment from "moment";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
} from "@material-ui/core";

export class VoucherPopupTransferPrintCom extends React.PureComponent {
  componentDidMount() {}

  render() {
    const { printObj, StockType, printData } = this.props;
    console.log(printObj, StockType, printData);

    return (
      <div>
        <style type="text/css" media="print">
          {
            "\
             @page { size: A4 portrait !important; margin:10px 12px 10px 12px;}\
          "
          }
        </style>
        <div style={{ width: "384px", height: "288px" }}>
          <Grid container style={{ justifyContent: "center", fontSize: 11 }}>
            <Grid item xs={5}>
              <div>
                <span style={{ fontWeight: 700 }}> Date : </span>
                {printData.date_time ? printData.date_time : "-"}
              </div>
              <div>
                <span style={{ fontWeight: 700 }}> Source Dept : </span>{" "}
                {printData?.source_department}
              </div>
            </Grid>

            <Grid item xs={5}>
              <div>
                <span style={{ fontWeight: 700 }}> Doc No : </span>{" "}
                {printData.document_number}{" "}
              </div>
              <div>
                <span style={{ fontWeight: 700 }}> Dest Dept : </span>{" "}
                {printData?.destination_department}{" "}
              </div>
            </Grid>

            <Grid item xs={2} style={{ textAlign: "right" }}>
              <QRCode
                style={{ height: "55px", width: "55px" }}
                value={
                  printData.document_number ? printData.document_number : "-"
                }
              />
            </Grid>
          </Grid>

          {StockType === 1 && (
            <>
              {/* Metal  -> Variant Name, Purity, Gross Weight, Fine Weight */}
              <Table className="voucher_print_table">
                <TableHead>
                  <TableRow>
                    <TableCell>Variant Name</TableCell>
                    <TableCell>Purity</TableCell>
                    <TableCell>Gross Weight</TableCell>
                    <TableCell>Fine Weight</TableCell>
                    <TableCell>Pcs</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {printObj.length === 0 ? (
                    <TableRow>
                      <TableCell align="center" colSpan={5}>
                        No Data
                      </TableCell>
                    </TableRow>
                  ) : (
                    printObj.map((printObj, i) => {
                      return (
                        <TableRow key={i}>
                          <TableCell>
                            {printObj.stock_name ? printObj.stock_name : "-"}{" "}
                          </TableCell>
                          <TableCell>
                            {printObj.purity ? printObj.purity : "-"}{" "}
                          </TableCell>
                          <TableCell>
                            {printObj.gross_weight
                              ? printObj.gross_weight
                              : "-"}{" "}
                          </TableCell>
                          <TableCell>
                            {printObj.fine_weight ? printObj.fine_weight : "-"}{" "}
                          </TableCell>
                          <TableCell>
                            {printObj.pcs ? printObj.pcs : "-"}{" "}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell>
                      <b>Total</b>
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      <b>
                        {Config.numWithComma(
                          HelperFunc.getTotalOfField(printObj, "gross_weight")
                        )}
                      </b>
                    </TableCell>
                    <TableCell>
                      <b>
                        {Config.numWithComma(
                          HelperFunc.getTotalOfField(printObj, "fine_weight")
                        )}
                      </b>
                    </TableCell>
                    <TableCell>
                      <b>
                        {parseFloat(
                          Config.numWithComma(
                            HelperFunc.getTotalOfField(printObj, "pcs")
                          )
                        ).toFixed(0)}
                      </b>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </>
          )}

          {StockType === 2 && (
            <>
              {/* Stone -> Variant name , Purity , Pcs , Gross Weight , Fine Weight */}
              <Table className="voucher_print_table">
                <TableHead>
                  <TableRow>
                    <TableCell>Variant Name</TableCell>
                    <TableCell>Purity</TableCell>
                    <TableCell>Pcs</TableCell>
                    <TableCell>Gross Weight</TableCell>
                    <TableCell>Fine Weight</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {printObj.length === 0 ? (
                    <TableRow>
                      <TableCell align="center" colSpan={5}>
                        No Data
                      </TableCell>
                    </TableRow>
                  ) : (
                    printObj.map((printObj, i) => {
                      return (
                        <TableRow key={i}>
                          <TableCell>
                            {printObj.stock_name ? printObj.stock_name : "-"}
                          </TableCell>
                          <TableCell>
                            {printObj.purity ? printObj.purity : "-"}
                          </TableCell>
                          <TableCell>
                            {printObj.pcs ? printObj.pcs : "-"}
                          </TableCell>
                          <TableCell>
                            {printObj.gross_weight
                              ? printObj.gross_weight
                              : "-"}
                          </TableCell>
                          <TableCell>
                            {printObj.fine_weight ? printObj.fine_weight : "-"}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell>
                      <b>Total</b>
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      <b>
                        {parseFloat(
                          Config.numWithComma(
                            HelperFunc.getTotalOfField(printObj, "pcs")
                          )
                        ).toFixed(0)}
                      </b>
                    </TableCell>
                    <TableCell>
                      <b>
                        {Config.numWithComma(
                          HelperFunc.getTotalOfField(printObj, "gross_weight")
                        )}
                      </b>
                    </TableCell>
                    <TableCell>
                      <b>
                        {Config.numWithComma(
                          HelperFunc.getTotalOfField(printObj, "fine_weight")
                        )}
                      </b>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </>
          )}

          {StockType === 3 && (
            <>
              {/* Lot -> Variant name , Lot , Pcs ,  Weight , Purity */}
              <Table className="voucher_print_table">
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Lot</TableCell>
                    <TableCell>Pcs</TableCell>
                    <TableCell>Weight</TableCell>
                    <TableCell>Purity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {printObj.length === 0 ? (
                    <TableRow>
                      <TableCell align="center" colSpan={5}>
                        No Data
                      </TableCell>
                    </TableRow>
                  ) : (
                    printObj.map((printObj, i) => {
                      return (
                        <TableRow key={i}>
                          <TableCell>
                            {printObj.category_name
                              ? printObj.category_name
                              : "-"}
                          </TableCell>
                          <TableCell>
                            {printObj.lot_number ? printObj.lot_number : "-"}
                          </TableCell>
                          <TableCell>
                            {printObj.pcs ? printObj.pcs : "-"}
                          </TableCell>
                          <TableCell>
                            {printObj.weight ? printObj.weight : "-"}
                          </TableCell>
                          <TableCell>
                            {printObj.purity ? printObj.purity : "-"}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell>
                      <b>Total</b>
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      <b>
                        {parseFloat(
                          Config.numWithComma(
                            HelperFunc.getTotalOfField(printObj, "pcs")
                          )
                        ).toFixed(0)}
                      </b>
                    </TableCell>
                    <TableCell>
                      <b>
                        {Config.numWithComma(
                          HelperFunc.getTotalOfField(printObj, "weight")
                        )}
                      </b>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </>
          )}

          {(StockType === 4 || StockType === 5) && (
            <>
              {/* Barcode , Packet -> Variant Name , Barcode , Pcs , Weight , Purity */}
              <Table className="voucher_print_table">
                <TableHead>
                  <TableRow>
                    <TableCell>Variant Name</TableCell>
                    <TableCell>Barcode</TableCell>
                    <TableCell>Pcs</TableCell>
                    <TableCell>Weight</TableCell>
                    <TableCell>Purity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {printObj.length === 0 ? (
                    <TableRow>
                      <TableCell align="center" colSpan={5}>
                        No Data
                      </TableCell>
                    </TableRow>
                  ) : (
                    printObj.map((printObj, i) => {
                      return (
                        <TableRow key={i}>
                          <TableCell>
                            {printObj.category_name
                              ? printObj.category_name
                              : "-"}
                          </TableCell>
                          <TableCell>
                            {printObj.barcode ? printObj.barcode : "-"}
                          </TableCell>
                          <TableCell>
                            {printObj.pcs ? printObj.pcs : "-"}
                          </TableCell>
                          <TableCell>
                            {printObj.weight ? printObj.weight : "-"}
                          </TableCell>
                          <TableCell>
                            {printObj.purity ? printObj.purity : "-"}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell>
                      <b>Total</b>
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      <b>
                        {parseFloat(
                          Config.numWithComma(
                            HelperFunc.getTotalOfField(printObj, "pcs")
                          )
                        ).toFixed(0)}
                      </b>
                    </TableCell>
                    <TableCell>
                      <b>
                        {Config.numWithComma(
                          HelperFunc.getTotalOfField(printObj, "weight")
                        )}
                      </b>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </>
          )}

          {StockType === 6 && (
            <>
              {/* Packing Slip ->  Barcode , Pcs , Weight , Purity */}
              <Table className="voucher_print_table">
                <TableHead>
                  <TableRow>
                    <TableCell>Barcode</TableCell>
                    <TableCell>Pcs</TableCell>
                    <TableCell>Weight</TableCell>
                    <TableCell>Purity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {printObj.length === 0 ? (
                    <TableRow>
                      <TableCell align="center" colSpan={4}>
                        No Data
                      </TableCell>
                    </TableRow>
                  ) : (
                    printObj.map((printObj, i) => {
                      return (
                        <TableRow key={i}>
                          <TableCell>
                            {printObj.barcode ? printObj.barcode : "-"}
                          </TableCell>
                          <TableCell>
                            {printObj.pcs ? printObj.pcs : "-"}
                          </TableCell>
                          <TableCell>
                            {printObj.weight ? printObj.weight : "-"}
                          </TableCell>
                          <TableCell>
                            {printObj.purity ? printObj.purity : "-"}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell>
                      <b>Total</b>
                    </TableCell>
                    <TableCell>
                      <b>
                        {parseFloat(
                          Config.numWithComma(
                            HelperFunc.getTotalOfField(printObj, "pcs")
                          )
                        ).toFixed(0)}
                      </b>
                    </TableCell>
                    <TableCell>
                      <b>
                        {Config.numWithComma(
                          HelperFunc.getTotalOfField(printObj, "weight")
                        )}
                      </b>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </>
          )}

          {StockType === 7 && (
            <>
              {/* Tree -> Tree Name  , Pcs , Purity , Gross Weight , Net weight */}
              <h5>Tree</h5>
              <Table className="voucher_print_table">
                <TableHead>
                  <TableRow>
                    <TableCell>Tree Name</TableCell>
                    <TableCell>Pcs</TableCell>
                    <TableCell>Purity</TableCell>
                    <TableCell>Gross Weight</TableCell>
                    <TableCell>Net Weight</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {printObj.length === 0 ? (
                    <TableRow>
                      <TableCell align="center" colSpan={5}>
                        No Data
                      </TableCell>
                    </TableRow>
                  ) : (
                    printObj.map((printObj, i) => {
                      return (
                        <TableRow key={i}>
                          <TableCell>
                            {printObj.tree_name ? printObj.tree_name : "-"}
                          </TableCell>
                          <TableCell>
                            {printObj.pcs !== null ? printObj.pcs : "-"}
                          </TableCell>
                          <TableCell>
                            {printObj.purity ? printObj.purity : "-"}
                          </TableCell>
                          <TableCell>
                            {printObj.gwt ? printObj.gwt : "-"}
                          </TableCell>
                          <TableCell>
                            {printObj.nwt ? printObj.nwt : "-"}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell>
                      <b>Total</b>
                    </TableCell>
                    <TableCell>
                      <b>
                        {parseFloat(
                          Config.numWithComma(
                            HelperFunc.getTotalOfField(printObj, "pcs")
                          )
                        ).toFixed(0)}
                      </b>
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      <b>
                        {Config.numWithComma(
                          HelperFunc.getTotalOfField(printObj, "gwt")
                        )}
                      </b>
                    </TableCell>
                    <TableCell>
                      <b>
                        {Config.numWithComma(
                          HelperFunc.getTotalOfField(printObj, "nwt")
                        )}
                      </b>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </>
          )}

          <div style={{ fontSize: 9 }}>
            <span style={{ fontWeight: 700 }}> Remark : </span>
            {printData.remark ? printData.remark : "-"}
          </div>
        </div>
      </div>
    );
  }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
  // eslint-disable-line max-len text={props.text}
  return (
    <VoucherPopupTransferPrintCom
      ref={ref}
      printObj={props.printObj}
      StockType={props.stockType}
    />
  );
});
