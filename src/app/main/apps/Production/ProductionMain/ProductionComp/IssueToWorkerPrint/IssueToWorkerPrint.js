import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { map } from "lodash";
import moment from "moment";
import * as React from "react";
import QRCode from "react-qr-code";

// pageBreakBefore:"always", pageBreakInside:"avoid", pageBreakAfter:"always"

export default class IssueToWorkerPrint extends React.PureComponent {
  componentDidMount() {}

  calculatewgtpcs = (isMetal, iswgtpcs, printObj) => {
    let res = 0;

    if (printObj && printObj?.PrintArray) {
      printObj.PrintArray.forEach((item) => {
        if (isMetal === item.is_stone_metal && iswgtpcs === "wgt") {
          res += parseFloat(item.added_weight) || 0; // Add 0 if added_weight is undefined or NaN
        } else if (isMetal === item.is_stone_metal && iswgtpcs === "pcs") {
          res += parseFloat(item.added_pcs) || 0; // Add 0 if added_pcs is undefined or NaN
        } else if (isMetal === item.is_stone_metal && iswgtpcs === "wgt") {
          res += parseFloat(item.added_weight) || 0; // Add 0 if added_weight is undefined or NaN
        } else if (isMetal === item.is_stone_metal && iswgtpcs === "pcs") {
          res += parseFloat(item.added_pcs) || 0; // Add 0 if added_pcs is undefined or NaN
        }
      });
    }

    return isNaN(res)
      ? 0
      : iswgtpcs === "wgt"
      ? parseFloat(res).toFixed(3)
      : res; // Return 0 if res is NaN, otherwise return res
  };

  render() {
    const { printObj, from, isAddToLotOrRemove } = this.props;
    // const from = "";
    // const printObj = [
    //   {
    //     lot_number: "ST242020068.6",
    //     date: "16-03-2024 06:10 AM",
    //     departmentName: "Production",
    //     categoryName: "FN Necklace Earrings",
    //     process: "Wax Setting",
    //     worker: "Sakil Polishar",
    //     purity: "75.1",
    //     totalWeight: "17.272",
    //     total_pcs: 4,
    //     remark: "",
    //     shipping_date: "2024-03-06",
    //     PrintArray: [
    //       {
    //         stone_name: "STYLE",
    //         added_pcs: 4,
    //         is_stone_metal: 1,
    //       },
    //     ],
    //     activityNumber: "ACT20240316114018",
    //   },
    // ];
    console.log(printObj);
    return (
      <div style={{ width: "384px" }}>
        <style type="text/css" media="print">
          {/* {
            "\
             @page { size: 384px 288px; !important;margin:10px 10px 10px 10px; }\
          "
          } */}
          {
            "\
             @page { size: A4 portrait !important;margin:15px 12px 15px 12px; }\
          "
          }
        </style>

        {/* <div style={{ height: "30px" }}></div> */}
        <div style={{ width: "384px", height: "288px" }}>
          {printObj.length !== 0 &&
            printObj.map((data, index) => {
              return (
                <div
                  style={{
                    fontSize: "11px",
                    pageBreakBefore:
                      index % 1 === 0 && index !== 0 ? "always" : "auto",
                  }}
                  key={index}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      columnGap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        alignItems: "center",
                        display: "flex",
                        justifyContent: "center",
                        flexBasis: "100%",
                      }}
                    >
                      Dep. :
                      <b style={{ marginLeft: 5 }}>{data?.departmentName}</b>
                    </div>
                    <div
                      style={{
                        alignItems: "center",
                        display: "flex",
                        justifyContent: "center",
                        flexBasis: "100%",
                      }}
                    >
                      Process :
                      <b style={{ marginLeft: 5 }}>
                        {from} {data?.process}
                      </b>
                    </div>
                  </div>
                  <Grid
                    container
                    spacing={1}
                    style={{ justifyContent: "space-between" }}
                  >
                    <Grid item xs={5}>
                      <div>
                        <b style={{ paddingRight: 4 }}>Date: </b>
                        {data?.date}
                      </div>
                      <div>
                        <b style={{ paddingRight: 4 }}>Lot No: </b>
                        {data?.lot_number}
                      </div>
                      {!isAddToLotOrRemove && (
                        <>
                          <div>
                            <b style={{ paddingRight: 4 }}>Item : </b>
                            {data?.categoryName}
                          </div>
                          <div>
                            <b style={{ paddingRight: 4 }}>TotalWt: </b>{" "}
                            {data?.totalWeight}
                          </div>
                          <div>
                            <b style={{ paddingRight: 4 }}>Shipment date: </b>
                            {data?.shipping_date &&
                              moment(data?.shipping_date).format("DD-MM-YYYY")}
                          </div>
                        </>
                      )}
                    </Grid>
                    <Grid item xs={7}>
                      <div>
                        <b style={{ paddingRight: 4 }}>W. Name </b>
                        {data?.worker}
                      </div>
                      <Grid container>
                        <Grid item xs={6}>
                          <div>
                            <b style={{ paddingRight: 4 }}>Purity : </b>
                            {data?.purity}
                          </div>
                          {!isAddToLotOrRemove && (
                            <>
                              <div>
                                <b style={{ paddingRight: 4 }}>Total Pcs : </b>
                                {data?.total_pcs}
                              </div>
                              {data.hasOwnProperty("loss") && (
                                <div>
                                  <b style={{ paddingRight: 4 }}>Loss : </b>
                                  {parseFloat(data?.loss).toFixed(3)}
                                </div>
                              )}
                              <div>
                                <b style={{ paddingRight: 4 }}>Bal Mtl : </b>
                              </div>
                            </>
                          )}
                        </Grid>
                        {!isAddToLotOrRemove && (
                          <Grid item xs={6} style={{ textAlign: "right" }}>
                            <QRCode
                              style={{
                                height: "65px",
                                width: "65px",
                                paddingInline: 10,
                              }}
                              value={data?.lot_number}
                              viewBox={`0 0 256 256`}
                            />
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                  {data?.PrintArray?.length > 0 && (
                    <Table
                      className="issue_print"
                      style={{
                        border: "1px solid black",
                        tableLayout: "auto",
                        marginTop: "2px",
                        // fontSize: "16px",
                      }}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell
                            // className="metal_purchase_bdr_dv"
                            style={{
                              padding: "2px",
                              textAlign: "center",
                            }}
                          >
                            Name of Stock
                          </TableCell>
                          <TableCell
                            // className="metal_purchase_bdr_dv"
                            style={{
                              padding: "2px",
                              textAlign: "center",
                            }}
                          >
                            WtGms
                          </TableCell>
                          <TableCell
                            // className="metal_purchase_bdr_dv"
                            style={{
                              padding: "2px",
                              textAlign: "center",
                            }}
                          >
                            Pcs
                          </TableCell>
                          <TableCell
                            // className="metal_purchase_bdr_dv"
                            style={{
                              padding: "2px",
                              textAlign: "center",
                            }}
                          >
                            Wtgms
                          </TableCell>
                          <TableCell
                            style={{
                              padding: "2px",
                              textAlign: "center",
                            }}
                          >
                            St. pcs
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data?.PrintArray?.length > 0 &&
                          data?.PrintArray.map((item, index) => {
                            return (
                              <TableRow key={index}>
                                <TableCell
                                  style={{
                                    padding: "2px",
                                    textAlign: "center",
                                  }}
                                  // className="metal_purchase_bdr_dv"
                                >
                                  {item?.stone_name}
                                </TableCell>
                                <TableCell
                                  style={{
                                    padding: "2px",
                                    textAlign: "center",
                                  }}
                                  // className="metal_purchase_bdr_dv"
                                >
                                  {item?.is_stone_metal === 1 &&
                                    item?.added_weight &&
                                    parseFloat(item?.added_weight).toFixed(3)}
                                </TableCell>
                                <TableCell
                                  style={{
                                    padding: "2px",
                                    textAlign: "center",
                                  }}
                                  // className="metal_purchase_bdr_dv"
                                >
                                  {item?.is_stone_metal === 1 &&
                                    item?.added_pcs}
                                </TableCell>
                                <TableCell
                                  style={{
                                    padding: "2px",
                                    textAlign: "center",
                                  }}
                                  // className="metal_purchase_bdr_dv"
                                >
                                  {item?.is_stone_metal !== 1 &&
                                    parseFloat(item?.added_weight).toFixed(3)}
                                </TableCell>
                                <TableCell
                                  style={{
                                    padding: "2px",
                                    textAlign: "center",
                                  }}
                                >
                                  {item?.is_stone_metal !== 1 &&
                                    item?.added_pcs}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell
                            style={{
                              padding: "2px",
                              textAlign: "center",
                            }}
                            // className="metal_purchase_bdr_dv"
                          >
                            <b>TOTAL</b>
                          </TableCell>
                          <TableCell
                            style={{
                              padding: "2px",
                              textAlign: "center",
                            }}
                            // className="metal_purchase_bdr_dv"
                          >
                            <b>
                              {parseFloat(
                                this.calculatewgtpcs(1, "wgt", data)
                              ).toFixed(3)}
                            </b>
                          </TableCell>
                          <TableCell
                            style={{
                              padding: "2px",
                              textAlign: "center",
                            }}
                            // className="metal_purchase_bdr_dv"
                          >
                            <b>
                              {parseFloat(
                                this.calculatewgtpcs(1, "pcs", data)
                              ).toFixed(0)}
                            </b>
                          </TableCell>
                          <TableCell
                            style={{
                              padding: "2px",
                              textAlign: "center",
                            }}
                            // className="metal_purchase_bdr_dv"
                          >
                            <b>
                              {parseFloat(
                                this.calculatewgtpcs(0, "wgt", data)
                              ).toFixed(3)}
                            </b>
                          </TableCell>
                          <TableCell
                            style={{
                              padding: "3px",
                              textAlign: "center",
                            }}
                          >
                            <b>
                              {parseFloat(
                                this.calculatewgtpcs(0, "pcs", data)
                              ).toFixed(0)}
                            </b>
                          </TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  )}
                  {!isAddToLotOrRemove && (
                    <div style={{ fontSize: 8 }}>Notes : {data.remark}</div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
  // eslint-disable-line max-len text={props.text}
  return <IssueToWorkerPrint ref={ref} printObj={props.printObj} />;
});
