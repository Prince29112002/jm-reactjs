import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import * as React from "react";
import QRCode from "react-qr-code";
import { ToWords } from "to-words";
import Config from "app/fuse-configs/Config";
import HelperFunc from "app/main/apps/SalesPurchase/Helper/HelperFunc";
import moment from "moment";

export class ReceiveBalanceStockPrint extends React.PureComponent {
  componentDidMount() {
    // console.log("componentDidMount", this.props)
  }

  // setRef = (ref) => (this.canvasEl = ref);

  render() {
    // const { text } = this.props;
    const { printObj, isView } = this.props;
    console.log(printObj, isView);
    const toWords = new ToWords({
      localeCode: "en-IN",
      converterOptions: {
        currency: true,
        ignoreDecimal: false,
        ignoreZeroCurrency: false,
        doNotAddOnly: false,
      },
    });

    const siteSetData = localStorage.getItem("siteSetting")
      ? JSON.parse(localStorage.getItem("siteSetting"))
      : [];
    const adminSignature = localStorage.getItem("adminSignature");
    console.log("adminSignature", adminSignature);

    return (
      <div>
        <style type="text/css" media="print">
          {/* {
            "\
             @page { size: 384px 288px; !important;margin:10px 15px 10px 15px; }\
          "
          } */}
          {
            "\
             @page { size: A4 portrait !important;margin:15px 12px 15px 12px; }\
          "
          }
        </style>

        <div style={{ width: "384px", height: "288px", fontSize: "10px" }}>
          <Grid
            container
            style={{
              justifyContent: "space-between",
              padding: "10px",
              border: "1px solid",
              borderBottom: "none",
              paddingBottom: "10px",
            }}
          >
            <Grid item xs={6}>
              <div>
                Date :
                <span style={{ paddingLeft: 5 }}>
                  {Object.keys(printObj).length !== 0 && printObj?.created_at}
                </span>
              </div>
              <div>
                Department :
                <span style={{ paddingLeft: 5 }}>
                  {Object.keys(printObj).length !== 0 &&
                    printObj?.departmentName}
                </span>
              </div>
              <div>
                Worker :
                <span style={{ paddingLeft: 5 }}>
                  {Object.keys(printObj).length !== 0 &&
                    printObj?.workStationName}
                </span>
              </div>
              <div>
                Remark :
                {/* {Object.keys(printObj).length !== 0 && printObj?.workStationName} */}
              </div>
            </Grid>
            <Grid item xs={6}>
              <div>
                Doc No :
                {/* {Object.keys(printObj).length !== 0 && printObj?.workStationName} */}
              </div>
              <div>
                Type :
                {/* {Object.keys(printObj).length !== 0 && printObj?.workStationName} */}
              </div>
            </Grid>
            {/* <Grid item>
              <QRCode
                style={{
                  height: "35px",
                  width: "35px",
                }}
                value="sdfg sdfg"
                viewBox={`0 0 256 256`}
              />
            </Grid> */}
          </Grid>
          {/* {data.stockCodeDesign.length > 0 && (
                    <> */}
          <Table
            style={{
              border: "1px solid black",
              tableLayout: "auto",
            }}
            className="receive_balance"
          >
            <TableHead>
              <TableRow>
                <TableCell
                  className="receive_balance_bdr_dv"
                  style={{
                    fontSize: "10px",
                    padding: "1px",
                    textAlign: "center",
                  }}
                >
                  Variant Name
                </TableCell>
                <TableCell
                  className="receive_balance_bdr_dv"
                  style={{
                    fontSize: "10px",
                    padding: "1px",
                    textAlign: "center",
                  }}
                >
                  Purity
                </TableCell>
                <TableCell
                  className="receive_balance_bdr_dv"
                  style={{
                    fontSize: "10px",
                    padding: "1px",
                    textAlign: "center",
                  }}
                >
                  Gross Wt
                </TableCell>
                <TableCell
                  className="receive_balance_bdr_dv"
                  style={{
                    fontSize: "10px",
                    padding: "1px",
                    textAlign: "center",
                  }}
                >
                  Fine Wt
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {designWiseData.length !== 0 &&
                        designWiseData?.map((data) => */}
              {Object.keys(printObj).length !== 0 ? (
                printObj?.stockData.map((design, i) => {
                  console.log(design);
                  return (
                    <TableRow key={i}>
                      <TableCell
                        style={{
                          fontSize: "10px",
                          padding: "1px",
                          textAlign: "center",
                        }}
                        className="receive_balance_bdr_dv"
                      >
                        {design?.stockCodeDetails.stock_code}
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "10px",
                          padding: "1px",
                          textAlign: "center",
                        }}
                        className="receive_balance_bdr_dv"
                      >
                        {design?.stockCodeDetails.purity}
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "10px",
                          padding: "1px",
                          textAlign: "center",
                        }}
                        className="receive_balance_bdr_dv"
                      >
                        {design?.gross_weight &&
                          parseFloat(design?.gross_weight).toFixed(3)}
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "10px",
                          padding: "1px",
                          textAlign: "center",
                        }}
                        className="receive_balance_bdr_dv"
                      >
                        {design?.fine_weight &&
                          parseFloat(design?.fine_weight).toFixed(3)}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    className="receive_balance_bdr_dv"
                    colSpan={4}
                    align="center"
                    style={{ padding: 7, fontSize: "10px" }}
                  >
                    No Data Available
                  </TableCell>
                </TableRow>
              )}

              <TableRow style={{ backgroundColor: "#d3d3d3" }}>
                <TableCell
                  style={{
                    fontSize: "10px",
                    padding: "1px",
                    lineHeight: "2.4rem",
                    paddingRight: 7,
                  }}
                  className="receive_balance_bdr_dv"
                  colSpan={2}
                  align="right"
                >
                  <b>TOTAL</b>
                </TableCell>
                <TableCell
                  style={{
                    fontSize: "10px",
                    padding: "1px",
                    textAlign: "center",
                    lineHeight: "2.4rem",
                  }}
                  className="receive_balance_bdr_dv"
                >
                  <b>
                    {Object.keys(printObj).length !== 0 &&
                      parseInt(
                        Config.numWithComma(
                          HelperFunc.getTotalOfFieldNoDecimal(
                            printObj?.stockData,
                            "gross_weight"
                          )
                        )
                      )}
                  </b>
                </TableCell>
                <TableCell
                  style={{
                    fontSize: "10px",
                    padding: "1px",
                    textAlign: "center",
                    lineHeight: "2.4rem",
                  }}
                  className="receive_balance_bdr_dv"
                >
                  <b>
                    {Object.keys(printObj).length !== 0 &&
                      Config.numWithComma(
                        HelperFunc.getTotalOfField(
                          printObj?.stockData,
                          "fine_weight"
                        )
                      )}
                  </b>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
  // eslint-disable-line max-len text={props.text}
  return <ReceiveBalanceStockPrint ref={ref} printObj={props.printObj} />;
});
