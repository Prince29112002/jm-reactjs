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
import moment from "moment";
import * as React from "react";
import QRCode from "react-qr-code";

// pageBreakBefore:"always", pageBreakInside:"avoid", pageBreakAfter:"always"

export default class IssueToWorkerTreePrint extends React.PureComponent {
  componentDidMount() {}
  calculatewgtpcs = (isMetal, iswgtpcs, printObj) => {
    console.log("innnn", isMetal, iswgtpcs, printObj);
    let res = 0;

    if (printObj && printObj?.printArray) {
      printObj.printArray.forEach((item) => {
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
    const { printObj } = this.props;
    console.log(printObj);
    // const printObj = [
    //   {
    //     tree_number: "F1603240017",
    //     weight: "10.000",
    //     reference_number: null,
    //     purity: "91.8",
    //     remark: "",
    //     created_at: "2024-03-16T05:32:16.000Z",
    //     workStationName: {
    //       id: 34,
    //       name: "Sakil Polishar",
    //     },
    //     treeDepartment: {
    //       name: "Production",
    //     },
    //     ProcessDetails: {
    //       process_name: "Wax Creation",
    //     },
    //     treeOrderDetails: [
    //       {
    //         tree_id: 17,
    //         lot_id: 1,
    //         pcs: 22,
    //         total_gross_wgt: "7.574",
    //         total_net_wgt: "0.690",
    //         total_stone_weight: "6.884",
    //         stone_pcs: 2411,
    //         product_category_id: 1,
    //         lotDetailsforTree: {
    //           number: "NT244020071.1",
    //           pcs: 22,
    //           total_net_wgt: "0.690",
    //           stock_name_code_id: 0,
    //           order_info: 0,
    //           LotDesigns: [
    //             {
    //               id: 1,
    //               lot_id: 1,
    //               design_id: 10652,
    //               is_make_bunch: 1,
    //               status_flag: "L",
    //               stock_code_id: 4702,
    //               pcs: 40,
    //               weight: 0.00256672,
    //               design_pcs: 1,
    //             },
    //             {
    //               id: 2,
    //               lot_id: 1,
    //               design_id: 10652,
    //               is_make_bunch: 1,
    //               status_flag: "L",
    //               stock_code_id: 4701,
    //               pcs: 132,
    //               weight: 0.003,
    //               design_pcs: 1,
    //             },
    //             {
    //               id: 3,
    //               lot_id: 1,
    //               design_id: 10653,
    //               is_make_bunch: 1,
    //               status_flag: "L",
    //               stock_code_id: 4701,
    //               pcs: 110,
    //               weight: 0.003,
    //               design_pcs: 1,
    //             },
    //             {
    //               id: 4,
    //               lot_id: 1,
    //               design_id: 10654,
    //               is_make_bunch: 1,
    //               status_flag: "L",
    //               stock_code_id: 4702,
    //               pcs: 27,
    //               weight: 0.00256658,
    //               design_pcs: 1,
    //             },
    //             {
    //               id: 5,
    //               lot_id: 1,
    //               design_id: 10654,
    //               is_make_bunch: 1,
    //               status_flag: "L",
    //               stock_code_id: 4701,
    //               pcs: 83,
    //               weight: 0.003,
    //               design_pcs: 1,
    //             },
    //             {
    //               id: 6,
    //               lot_id: 1,
    //               design_id: 10655,
    //               is_make_bunch: 1,
    //               status_flag: "L",
    //               stock_code_id: 4685,
    //               pcs: 28,
    //               weight: 0.002,
    //               design_pcs: 1,
    //             },
    //             {
    //               id: 7,
    //               lot_id: 1,
    //               design_id: 10655,
    //               is_make_bunch: 1,
    //               status_flag: "L",
    //               stock_code_id: 4702,
    //               pcs: 54,
    //               weight: 0.00256671,
    //               design_pcs: 1,
    //             },
    //             {
    //               id: 8,
    //               lot_id: 1,
    //               design_id: 10656,
    //               is_make_bunch: 1,
    //               status_flag: "L",
    //               stock_code_id: 4702,
    //               pcs: 46,
    //               weight: 0.00256653,
    //               design_pcs: 1,
    //             },
    //             {
    //               id: 9,
    //               lot_id: 1,
    //               design_id: 10656,
    //               is_make_bunch: 1,
    //               status_flag: "L",
    //               stock_code_id: 4701,
    //               pcs: 78,
    //               weight: 0.003,
    //               design_pcs: 1,
    //             },
    //             {
    //               id: 10,
    //               lot_id: 1,
    //               design_id: 10657,
    //               is_make_bunch: 1,
    //               status_flag: "L",
    //               stock_code_id: 4701,
    //               pcs: 102,
    //               weight: 0.003,
    //               design_pcs: 1,
    //             },
    //             {
    //               id: 11,
    //               lot_id: 1,
    //               design_id: 10657,
    //               is_make_bunch: 1,
    //               status_flag: "L",
    //               stock_code_id: 4702,
    //               pcs: 1,
    //               weight: 0.00256656,
    //               design_pcs: 1,
    //             },
    //             {
    //               id: 12,
    //               lot_id: 1,
    //               design_id: 10658,
    //               is_make_bunch: 1,
    //               status_flag: "L",
    //               stock_code_id: 4702,
    //               pcs: 40,
    //               weight: 0.00256636,
    //               design_pcs: 1,
    //             },
    //             {
    //               id: 13,
    //               lot_id: 1,
    //               design_id: 10658,
    //               is_make_bunch: 1,
    //               status_flag: "L",
    //               stock_code_id: 4701,
    //               pcs: 36,
    //               weight: 0.003,
    //               design_pcs: 1,
    //             },
    //             {
    //               id: 14,
    //               lot_id: 1,
    //               design_id: 10659,
    //               is_make_bunch: 1,
    //               status_flag: "L",
    //               stock_code_id: 4701,
    //               pcs: 61,
    //               weight: 0.003,
    //               design_pcs: 1,
    //             },
    //             {
    //               id: 15,
    //               lot_id: 1,
    //               design_id: 10659,
    //               is_make_bunch: 1,
    //               status_flag: "L",
    //               stock_code_id: 4702,
    //               pcs: 74,
    //               weight: 0.00256619,
    //               design_pcs: 1,
    //             },
    //             {
    //               id: 16,
    //               lot_id: 1,
    //               design_id: 10660,
    //               is_make_bunch: 1,
    //               status_flag: "L",
    //               stock_code_id: 4701,
    //               pcs: 83,
    //               weight: 0.003,
    //               design_pcs: 1,
    //             },
    //             {
    //               id: 17,
    //               lot_id: 1,
    //               design_id: 10660,
    //               is_make_bunch: 1,
    //               status_flag: "L",
    //               stock_code_id: 4702,
    //               pcs: 8,
    //               weight: 0.00256614,
    //               design_pcs: 1,
    //             },
    //             {
    //               id: 18,
    //               lot_id: 1,
    //               design_id: 10661,
    //               is_make_bunch: 1,
    //               status_flag: "L",
    //               stock_code_id: 4701,
    //               pcs: 103,
    //               weight: 0.003,
    //               design_pcs: 1,
    //             },
    //             {
    //               id: 19,
    //               lot_id: 1,
    //               design_id: 10661,
    //               is_make_bunch: 1,
    //               status_flag: "L",
    //               stock_code_id: 4702,
    //               pcs: 40,
    //               weight: 0.00256591,
    //               design_pcs: 1,
    //             },
    //             {
    //               id: 20,
    //               lot_id: 1,
    //               design_id: 10662,
    //               is_make_bunch: 1,
    //               status_flag: "L",
    //               stock_code_id: 4701,
    //               pcs: 96,
    //               weight: 0.003,
    //               design_pcs: 1,
    //             },
    //             {
    //               id: 21,
    //               lot_id: 1,
    //               design_id: 10663,
    //               is_make_bunch: 1,
    //               status_flag: "L",
    //               stock_code_id: 4702,
    //               pcs: 61,
    //               weight: 0.00256572,
    //               design_pcs: 1,
    //             },
    //             {
    //               id: 22,
    //               lot_id: 1,
    //               design_id: 10664,
    //               is_make_bunch: 1,
    //               status_flag: "L",
    //               stock_code_id: 4701,
    //               pcs: 25,
    //               weight: 0.003,
    //               design_pcs: 1,
    //             },
    //             {
    //               id: 23,
    //               lot_id: 1,
    //               design_id: 10664,
    //               is_make_bunch: 1,
    //               status_flag: "L",
    //               stock_code_id: 4702,
    //               pcs: 55,
    //               weight: 0.00256547,
    //               design_pcs: 1,
    //             },
    //             {
    //               id: 24,
    //               lot_id: 1,
    //               design_id: 10665,
    //               is_make_bunch: 1,
    //               status_flag: "L",
    //               stock_code_id: 4701,
    //               pcs: 106,
    //               weight: 0.003,
    //               design_pcs: 1,
    //             },
    //             {
    //               id: 25,
    //               lot_id: 1,
    //               design_id: 10666,
    //               is_make_bunch: 1,
    //               status_flag: "L",
    //               stock_code_id: 4701,
    //               pcs: 64,
    //               weight: 0.003,
    //               design_pcs: 1,
    //             },
    //             {
    //               id: 26,
    //               lot_id: 1,
    //               design_id: 10666,
    //               is_make_bunch: 1,
    //               status_flag: "L",
    //               stock_code_id: 4702,
    //               pcs: 43,
    //               weight: 0.00256552,
    //               design_pcs: 1,
    //             },
    //             {
    //               id: 27,
    //               lot_id: 1,
    //               design_id: 10667,
    //               is_make_bunch: 1,
    //               status_flag: "L",
    //               stock_code_id: 4701,
    //               pcs: 148,
    //               weight: 0.003,
    //               design_pcs: 1,
    //             },
    //             {
    //               id: 28,
    //               lot_id: 1,
    //               design_id: 10667,
    //               is_make_bunch: 1,
    //               status_flag: "L",
    //               stock_code_id: 4702,
    //               pcs: 70,
    //               weight: 0.0025657,
    //               design_pcs: 1,
    //             },
    //             {
    //               id: 29,
    //               lot_id: 1,
    //               design_id: 10668,
    //               is_make_bunch: 1,
    //               status_flag: "L",
    //               stock_code_id: 4702,
    //               pcs: 55,
    //               weight: 0.00256547,
    //               design_pcs: 1,
    //             },
    //             {
    //               id: 30,
    //               lot_id: 1,
    //               design_id: 10668,
    //               is_make_bunch: 1,
    //               status_flag: "L",
    //               stock_code_id: 4701,
    //               pcs: 34,
    //               weight: 0.003,
    //               design_pcs: 1,
    //             },
    //             {
    //               id: 31,
    //               lot_id: 1,
    //               design_id: 10669,
    //               is_make_bunch: 1,
    //               status_flag: "L",
    //               stock_code_id: 4701,
    //               pcs: 130,
    //               weight: 0.003,
    //               design_pcs: 1,
    //             },
    //             {
    //               id: 32,
    //               lot_id: 1,
    //               design_id: 10669,
    //               is_make_bunch: 1,
    //               status_flag: "L",
    //               stock_code_id: 4702,
    //               pcs: 38,
    //               weight: 0.00256553,
    //               design_pcs: 1,
    //             },
    //             {
    //               id: 33,
    //               lot_id: 1,
    //               design_id: 10670,
    //               is_make_bunch: 1,
    //               status_flag: "L",
    //               stock_code_id: 4701,
    //               pcs: 43,
    //               weight: 0.003,
    //               design_pcs: 1,
    //             },
    //             {
    //               id: 34,
    //               lot_id: 1,
    //               design_id: 10670,
    //               is_make_bunch: 1,
    //               status_flag: "L",
    //               stock_code_id: 4702,
    //               pcs: 49,
    //               weight: 0.00256582,
    //               design_pcs: 1,
    //             },
    //             {
    //               id: 35,
    //               lot_id: 1,
    //               design_id: 10671,
    //               is_make_bunch: 1,
    //               status_flag: "L",
    //               stock_code_id: 4701,
    //               pcs: 14,
    //               weight: 0.003,
    //               design_pcs: 1,
    //             },
    //             {
    //               id: 36,
    //               lot_id: 1,
    //               design_id: 10672,
    //               is_make_bunch: 1,
    //               status_flag: "L",
    //               stock_code_id: 4701,
    //               pcs: 118,
    //               weight: 0.003,
    //               design_pcs: 1,
    //             },
    //             {
    //               id: 37,
    //               lot_id: 1,
    //               design_id: 10672,
    //               is_make_bunch: 1,
    //               status_flag: "L",
    //               stock_code_id: 4702,
    //               pcs: 14,
    //               weight: 0.00256565,
    //               design_pcs: 1,
    //             },
    //             {
    //               id: 38,
    //               lot_id: 1,
    //               design_id: 10673,
    //               is_make_bunch: 1,
    //               status_flag: "L",
    //               stock_code_id: 4701,
    //               pcs: 78,
    //               weight: 0.003,
    //               design_pcs: 1,
    //             },
    //             {
    //               id: 39,
    //               lot_id: 1,
    //               design_id: 10673,
    //               is_make_bunch: 1,
    //               status_flag: "L",
    //               stock_code_id: 4702,
    //               pcs: 24,
    //               weight: 0.0025656,
    //               design_pcs: 1,
    //             },
    //           ],
    //         },
    //       },
    //     ],
    //     totalStoneWeightSum: 6.884,
    //     totalNetWeightSum: 0.69,
    //     totalGrossWeightSum: 7.574,
    //     totalPcs: 22,
    //     totalStonePcs: 2411,
    //     WaxWeight: 3.116,
    //     printArray: [
    //       {
    //         stone_name: "Cubic Zirconia",
    //         added_weight: "6.887",
    //         added_pcs: 2411,
    //         is_stone_metal: 0,
    //       },
    //       {
    //         stone_name: "STYLE",
    //         added_pcs: 22,
    //         is_stone_metal: 1,
    //       },
    //     ],
    //     activityNumber: "ACT20240316110311",
    //   },
    // ];
    return (
      <div>
        <style type="text/css" media="print">
          {/* {
            "\
             @page { size: 384px 288px; !important;margin:20px 10px 20px 10px; }\
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
                    // border: "1px solid",
                    padding: "9px",
                    marginBottom: "10px",
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
                    }}
                  >
                    <div
                      style={{
                        alignItems: "center",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      Dep. :
                      <b style={{ marginLeft: 5 }}>
                        {data?.treeDepartment?.name}
                      </b>
                    </div>
                    <div
                      style={{
                        alignItems: "center",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      Process :
                      <b style={{ marginLeft: 5 }}>
                        {data?.ProcessDetails?.process_name}
                      </b>
                    </div>
                  </div>

                  <Grid container style={{ justifyContent: "space-between" }}>
                    <Grid item md={5}>
                      <div>
                        <b style={{ paddingRight: 8 }}>Date: </b>
                        {data?.created_at}
                      </div>
                      <div>
                        <b style={{ paddingRight: 8 }}>Tree No: </b>
                        {data?.tree_number}
                      </div>
                      <div>
                        <b style={{ paddingRight: 8 }}>TotalWt: </b>{" "}
                        {data?.totalGrossWeightSum}
                      </div>
                      <div>
                        <b style={{ paddingRight: 8 }}>Reference No.: </b>{" "}
                        {data?.reference_number}
                      </div>
                      {/* <div>
                      <b style={{ paddingRight: 8 }}>Shipment date: </b>
                      {data?.shipping_date}
                    </div> */}
                    </Grid>
                    <Grid item md={5}>
                      <div>
                        <b style={{ paddingRight: 8 }}>W. Name </b>
                        {data?.workStationName.name}
                      </div>
                      <div>
                        <b style={{ paddingRight: 8 }}>Purity : </b>
                        {data?.purity}
                      </div>
                      <div>
                        <b style={{ paddingRight: 8 }}>Total Pcs : </b>
                        {data?.totalPcs}
                      </div>
                    </Grid>
                    <Grid item>
                      <QRCode
                        style={{
                          height: "50px",
                          width: "50px",
                        }}
                        value={data?.tree_number}
                        viewBox={`0 0 256 256`}
                      />
                    </Grid>
                  </Grid>
                  {data?.printArray?.length > 0 && (
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
                        {data?.printArray?.length > 0 &&
                          data?.printArray.map((item, index) => {
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
                                    item?.added_weight &&
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
                              padding: "2px",
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
                  {/* <div>
                    <b style={{ paddingRight: 8 }}>Remark : </b>
                    {data.remark}
                  </div> */}
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
  return <IssueToWorkerTreePrint ref={ref} printObj={props.printObjMultiple} />;
});
