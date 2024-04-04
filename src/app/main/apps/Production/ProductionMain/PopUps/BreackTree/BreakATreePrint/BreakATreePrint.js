import * as React from "react";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@material-ui/core";
import QRCode from "react-qr-code";
import moment from "moment";

export class BreakATreePrint extends React.PureComponent {
  componentDidMount() {
    // console.log("componentDidMount", this.props)
  }

  render() {
    const { printObj, referenceNum, timeAndDate } = this.props;
    console.log(printObj, referenceNum, timeAndDate);

    return (
      <div>
        <style type="text/css" media="print">
          {
            "\
             @page { size: A4 portrait !important;margin:25px 10px 10px; }\
          "
          }
        </style>

        <div
          style={{
            width: "384px",
            height: "265px",
            display: "flex",
            flexWrap: "wrap",
            columnGap: 20,
          }}
          // style={{ display: "flex" }}
        >
          {/* <Paper style={{ display: "flex", gap: 20, flexWrap: "wrap" }}> */}
          {printObj.length === 0 ? (
            <div className="row">
              <div className="body-tabel-deta"></div>
            </div>
          ) : (
            printObj.treeOrderDetails.map((printObj, i) => {
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    pageBreakBefore: i % 2 === 0 && i !== 0 ? "always" : "auto",
                    columnGap: 10,
                  }}
                >
                  <Table
                    style={{
                      width: "170px",
                      maxHeight: "288px",
                      tableLayout: "auto",
                    }}
                  >
                    <TableBody>
                      <TableRow>
                        <TableCell
                          className="printVoucher_border"
                          colSpan={2}
                          style={{
                            padding: "5px",
                            height: "65px",
                          }}
                          align="center"
                        >
                          <QRCode
                            style={{
                              height: "60px",
                              width: "60px",
                            }}
                            value={
                              printObj.lotDetailsforTree.number
                                ? printObj.lotDetailsforTree.number
                                : "-"
                            }
                            // viewBox={`0 0 100 100`}
                          />
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell
                          className="printVoucher_border"
                          style={{
                            padding: "6px",
                            paddingBlock: "3px",
                            fontWeight: 700,
                            fontSize: 11,
                            lineHeight: 1,
                          }}
                          width={70}
                        >
                          DateTime
                        </TableCell>
                        <TableCell
                          className="printVoucher_border"
                          style={{
                            padding: "6px",
                            fontSize: 11,
                            paddingBlock: "3px",
                            lineHeight: 1,
                          }}
                        >
                          {timeAndDate ? timeAndDate : "-"}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell
                          className="printVoucher_border"
                          style={{
                            padding: "6px",
                            paddingBlock: "3px",
                            fontWeight: 700,
                            fontSize: 11,
                            lineHeight: 1,
                          }}
                          width={70}
                        >
                          Ref. No
                        </TableCell>
                        <TableCell
                          className="printVoucher_border"
                          style={{
                            padding: "6px",
                            fontSize: 11,
                            paddingBlock: "3px",
                            lineHeight: 1,
                          }}
                        >
                          {referenceNum !== null ? referenceNum : "-"}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell
                          className="printVoucher_border"
                          style={{
                            padding: "6px",
                            paddingBlock: "3px",
                            fontWeight: 700,
                            fontSize: 11,
                            lineHeight: 1,
                          }}
                          width={70}
                        >
                          Lot No
                        </TableCell>
                        <TableCell
                          className="printVoucher_border"
                          style={{
                            padding: "6px",
                            fontSize: 11,
                            paddingBlock: "3px",
                            lineHeight: 1,
                          }}
                        >
                          {printObj.lotDetailsforTree.number !== null
                            ? printObj.lotDetailsforTree.number
                            : "-"}{" "}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell
                          className="printVoucher_border"
                          style={{
                            padding: "6px",
                            paddingBlock: "3px",
                            fontWeight: 700,
                            fontSize: 11,
                            lineHeight: 1,
                          }}
                          width={70}
                        >
                          Cat. Code
                        </TableCell>
                        <TableCell
                          className="printVoucher_border"
                          style={{
                            padding: "6px",
                            fontSize: 11,
                            paddingBlock: "3px",
                            lineHeight: 1,
                          }}
                        >
                          {printObj.lotDetailsforTree.ProductCategory
                            .category_code !== null
                            ? printObj.lotDetailsforTree.ProductCategory
                                .category_code
                            : "-"}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell
                          className="printVoucher_border"
                          style={{
                            padding: "6px",
                            fontWeight: 700,
                            fontSize: 11,
                            paddingBlock: "3px",
                            lineHeight: 1,
                          }}
                          width={70}
                        >
                          Pcs.
                        </TableCell>
                        <TableCell
                          className="printVoucher_border"
                          style={{
                            padding: "6px",
                            fontSize: 11,
                            paddingBlock: "3px",
                            lineHeight: 1,
                          }}
                        >
                          {printObj.lotDetailsforTree.pcs !== null
                            ? printObj.lotDetailsforTree.pcs
                            : "-"}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell
                          className="printVoucher_border"
                          style={{
                            padding: "6px",
                            fontWeight: 700,
                            fontSize: 11,
                            paddingBlock: "3px",
                            lineHeight: 1,
                          }}
                          width={70}
                        >
                          Gr.Wgt.
                        </TableCell>
                        <TableCell
                          className="printVoucher_border"
                          style={{
                            padding: "6px",
                            fontSize: 11,
                            paddingBlock: "3px",
                            lineHeight: 1,
                          }}
                        >
                          {printObj.lotDetailsforTree.total_gross_wgt !== null
                            ? printObj.lotDetailsforTree.total_gross_wgt
                            : "-"}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell
                          className="printVoucher_border"
                          style={{
                            padding: "6px",
                            fontWeight: 700,
                            fontSize: 11,
                            paddingBlock: "3px",
                            lineHeight: 1,
                          }}
                          width={70}
                        >
                          Purity
                        </TableCell>
                        <TableCell
                          className="printVoucher_border"
                          style={{
                            padding: "6px",
                            fontSize: 11,
                            paddingBlock: "3px",
                            lineHeight: 1,
                          }}
                        >
                          {printObj.lotDetailsforTree.purity !== null
                            ? printObj.lotDetailsforTree.purity
                            : "-"}{" "}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              );
            })
          )}
          {/* </Paper> */}
        </div>
      </div>
    );
  }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
  // eslint-disable-line max-len text={props.text}
  return (
    <BreakATreePrint
      ref={ref}
      printObj={props.printObj}
      refrenceNum={props.refrenceNum}
      timeAndDate={props.timeAndDate}
    />
  );
});
