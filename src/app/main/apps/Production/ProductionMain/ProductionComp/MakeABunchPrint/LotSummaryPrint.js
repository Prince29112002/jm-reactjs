import * as React from "react";
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import QRCode from "react-qr-code";
import HelperFunc from "app/main/apps/SalesPurchase/Helper/HelperFunc";
import Config from "app/fuse-configs/Config";

export class LotSummaryPrint extends React.PureComponent {
  render() {
    const { summaryData } = this.props;
    console.log(summaryData);
    // const toWords = new ToWords({
    //   localeCode: "en-IN",
    //   converterOptions: {
    //     currency: true,
    //     ignoreDecimal: false,
    //     ignoreZeroCurrency: false,
    //     doNotAddOnly: false,
    //   },
    // });

    const updatedSummaryData = [];

    summaryData.forEach((item) => {
      const stockCodeDesignArray = item.LotDesigns;
      const iterations = Math.ceil(stockCodeDesignArray.length / 10);

      for (let j = 0; j < iterations; j++) {
        const slicedDesigns = stockCodeDesignArray.slice(j * 10, j * 10 + 10);
        const remainingEmptySlots = 10 - slicedDesigns.length;
        for (let k = 0; k < remainingEmptySlots; k++) {
          slicedDesigns.push({
            Total_stone: "",
            Total_stone_weight: "",
            totalDesignPcs: "",
            weight: "",
            stock_code_id: "",
            design_id: "",
            batch_no: "",
            DesignStockCodes: {
              stock_code: "",
              stock_description: { id: "", description: "" },
            },
            TypeOfSettingMasterOrders: { type: "" },
          });
        }
        const newItem = {
          id: item.id,
          number: item.number,
          purity: item.purity,
          pcs: item.pcs,
          stone_pcs: item.stone_pcs,
          LotDesigns: slicedDesigns,
          no_of_design: item.no_of_design,
          item: item.item,
        };
        updatedSummaryData.push(newItem);
      }
    });
    console.log(updatedSummaryData);
    console.log(summaryData);
    return (
      <div>
        <style type="text/css" media="print">
          {
            "\
             @page { size: A4 landscape !important;margin:30px 20px 30px 20px; }\
          "
          }
        </style>

        {/* <div style={{ height: "30px" }}></div> */}

        <div
          style={{
            display: "flex",
            gap: "15px",
            fontSize: "8px",
            flexWrap: "wrap",
          }}
        >
          {updatedSummaryData.map((data, index) => {
            console.log(data);
            return (
              <Box
                style={{
                  width: "23.9%",
                  pageBreakBefore:
                    index % 12 === 0 && index !== 0 ? "always" : "auto",
                }}
                key={index}
              >
                <Grid
                  container
                  style={{
                    justifyContent: "space-between",
                    padding: "5px",
                    border: "1px solid",
                    borderBottom: "none",
                    paddingBottom: "2px",
                  }}
                >
                  <Grid item xs={5}>
                    <div>L # : {data.number}</div>
                    <div>Item : {data.item}</div>
                  </Grid>
                  <Grid item xs={5}>
                    <div>No of Designs : {data.no_of_design}</div>
                    <div>Pcs : {data.pcs}</div>
                    <div>Purity : {data.purity}</div>
                  </Grid>
                  <Grid item>
                    <QRCode
                      style={{
                        height: "35px",
                        width: "35px",
                      }}
                      value={data.number ? data.number : "-"}
                      viewBox={`0 0 256 256`}
                    />
                  </Grid>
                </Grid>
                <Table
                  style={{
                    border: "1px solid black",
                    tableLayout: "auto",
                  }}
                >
                  <TableHead>
                    <TableRow style={{ height: 15 }}>
                      <TableCell
                        className="metal_purchase_bdr_dv"
                        style={{
                          fontSize: "8px",
                          padding: "1px",
                          textAlign: "center",
                          lineHeight: "initial",
                        }}
                      >
                        Group
                      </TableCell>
                      <TableCell
                        className="metal_purchase_bdr_dv"
                        style={{
                          fontSize: "8px",
                          padding: "1px",
                          textAlign: "center",
                          lineHeight: "initial",
                        }}
                      >
                        Variant
                      </TableCell>
                      <TableCell
                        className="metal_purchase_bdr_dv"
                        style={{
                          fontSize: "8px",
                          padding: "1px",
                          textAlign: "center",
                          lineHeight: "initial",
                        }}
                      >
                        Pcs
                      </TableCell>
                      <TableCell
                        className="metal_purchase_bdr_dv"
                        style={{
                          fontSize: "8px",
                          padding: "1px",
                          textAlign: "center",
                          lineHeight: "initial",
                        }}
                      >
                        Wt
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "8px",
                          padding: "1px",
                          textAlign: "center",
                          lineHeight: "initial",
                        }}
                      >
                        Set Type
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.LotDesigns.length !== 0 &&
                      data.LotDesigns.map((data, i) => {
                        console.log(data);
                        return (
                          <TableRow key={i} style={{ height: 15 }}>
                            <TableCell
                              style={{
                                fontSize: "8px",
                                padding: "1px",
                                textAlign: "center",
                                lineHeight: "initial",
                              }}
                              className="metal_purchase_bdr_dv"
                            >
                              {
                                data?.DesignStockCodes?.stock_description
                                  ?.description
                              }
                            </TableCell>
                            <TableCell
                              style={{
                                fontSize: "8px",
                                padding: "1px",
                                textAlign: "center",
                                lineHeight: "initial",
                              }}
                              className="metal_purchase_bdr_dv"
                            >
                              {data?.DesignStockCodes?.stock_code}
                            </TableCell>
                            <TableCell
                              style={{
                                fontSize: "8px",
                                padding: "1px",
                                textAlign: "center",
                                lineHeight: "initial",
                              }}
                              className="metal_purchase_bdr_dv"
                            >
                              {data?.Total_stone}
                            </TableCell>
                            <TableCell
                              style={{
                                fontSize: "8px",
                                padding: "1px",
                                textAlign: "center",
                                lineHeight: "initial",
                              }}
                              className="metal_purchase_bdr_dv"
                            >
                              {data?.Total_stone_weight}
                            </TableCell>
                            <TableCell
                              style={{
                                fontSize: "8px",
                                padding: "1px",
                                textAlign: "center",
                                lineHeight: "initial",
                              }}
                            >
                              {data?.TypeOfSettingMasterOrders?.type}
                            </TableCell>
                          </TableRow>
                        );
                      })}

                    <TableRow style={{ background: "#d3d3d3", height: 15 }}>
                      <TableCell
                        style={{
                          fontSize: "8px",
                          padding: "1px",
                          textAlign: "center",
                          lineHeight: "initial",
                        }}
                        className="metal_purchase_bdr_dv"
                      ></TableCell>
                      <TableCell
                        style={{
                          fontSize: "8px",
                          padding: "1px",
                          textAlign: "center",
                          lineHeight: "initial",
                        }}
                        className="metal_purchase_bdr_dv"
                      >
                        {updatedSummaryData.length - 1 === index && (
                          <b>TOTAL</b>
                        )}
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "8px",
                          padding: "1px",
                          textAlign: "center",
                          lineHeight: "initial",
                        }}
                        className="metal_purchase_bdr_dv"
                      >
                        {updatedSummaryData.length - 1 === index && (
                          <b>
                            {summaryData.length !== 0 &&
                              summaryData[0] &&
                              summaryData[0].LotDesigns &&
                              Config.numWithoutDecimal(
                                HelperFunc.getTotalOfField(
                                  summaryData[0]?.LotDesigns,
                                  "Total_stone"
                                )
                              )}
                          </b>
                        )}
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "8px",
                          padding: "1px",
                          textAlign: "center",
                          lineHeight: "initial",
                        }}
                        className="metal_purchase_bdr_dv"
                      >
                        {updatedSummaryData.length - 1 === index && (
                          <b>
                            {summaryData.length !== 0 &&
                              summaryData[0] &&
                              summaryData[0].LotDesigns &&
                              Config.numWithoutDecimal(
                                HelperFunc.getTotalOfField(
                                  summaryData[0]?.LotDesigns,
                                  "Total_stone_weight"
                                )
                              )}
                          </b>
                        )}
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "8px",
                          padding: "1px",
                          textAlign: "center",
                          lineHeight: "initial",
                        }}
                      ></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            );
          })}
        </div>
      </div>
    );
  }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
  // eslint-disable-line max-len text={props.text}
  return <LotSummaryPrint ref={ref} summaryData={props.summaryData} />;
});
