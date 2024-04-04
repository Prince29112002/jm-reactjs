import * as React from "react";
import { ToWords } from "to-words";
import HelperFunc from "app/main/apps/SalesPurchase/Helper/HelperFunc";
// import HelperFunc from "../../SalesPurchase/Helper/HelperFunc";
import Config from "app/fuse-configs/Config";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { reduce } from "lodash";
import QRCode from "react-qr-code";

export class MakeATreePrint extends React.PureComponent {
  componentDidMount() {
    // console.log("componentDidMount", this.props)
  }

  // setRef = (ref) => (this.canvasEl = ref);

  render() {
    // const { text } = this.props;
    const { printObj } = this.props;
    console.log(printObj);
    const totalpcs =
      Object.keys(printObj).length !== 0 &&
      printObj?.treeOrderDetails.reduce(
        (total, order) => total + order.lotDetailsforTree.pcs,
        0
      );
    const totalweight =
      Object.keys(printObj).length !== 0 &&
      printObj?.treeOrderDetails.reduce(
        (total, order) =>
          total + parseFloat(order.lotDetailsforTree.total_stone_weight),
        0
      );

    return (
      <div>
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

        {/* <li>Hello </li> */}

        <div style={{ width: "384px", height: "288px" }}>
          <Paper>
            <Table className="makeatree_table">
              <TableHead>
                <TableRow
                  style={{ fontStyle: "bold", backgroundColor: "transparent" }}
                >
                  <TableCell
                    className="printVoucher_border"
                    colSpan={2}
                    style={{ fontSize: 10 }}
                  >
                    Tree No.
                  </TableCell>
                  <TableCell
                    className="printVoucher_border"
                    colSpan={3}
                    style={{ fontSize: 10 }}
                  >
                    {printObj?.tree_number}
                  </TableCell>
                  <TableCell
                    className="printVoucher_border"
                    style={{ textAlign: "center" }}
                    colSpan={2}
                    rowSpan={3}
                    width={120}
                  >
                    <QRCode
                      style={{
                        height: "50px",
                        width: "50px",
                      }}
                      value={printObj.tree_number ? printObj.tree_number : "-"}
                      // viewBox={`0 0 256 256`}
                    />
                  </TableCell>
                </TableRow>

                <TableRow style={{ backgroundColor: "transparent" }}>
                  <TableCell
                    className="printVoucher_border"
                    colSpan={2}
                    style={{ fontSize: 11 }}
                  >
                    Tree Wgt.
                  </TableCell>
                  <TableCell
                    className="printVoucher_border"
                    colSpan={3}
                    style={{ fontSize: 11 }}
                  >
                    {printObj?.weight}
                  </TableCell>
                </TableRow>
                <TableRow style={{ backgroundColor: "transparent" }}>
                  <TableCell
                    className="printVoucher_border"
                    colSpan={2}
                    style={{ fontSize: 11 }}
                  >
                    Purity
                  </TableCell>
                  <TableCell
                    className="printVoucher_border"
                    colSpan={3}
                    style={{ fontSize: 11 }}
                  >
                    {Object.keys(printObj).length !== 0 &&
                    printObj?.treeOrderDetails[0]?.lotDetailsforTree?.purity
                      ? printObj?.treeOrderDetails[0]?.lotDetailsforTree?.purity
                      : ""}
                  </TableCell>
                </TableRow>

                <TableRow style={{ backgroundColor: "transparent" }}>
                  <TableCell
                    className="printVoucher_border colpad"
                    style={{ textAlign: "center" }}
                  >
                    Sr.
                  </TableCell>
                  <TableCell
                    className="printVoucher_border colpad"
                    style={{ textAlign: "center" }}
                    colSpan={3}
                  >
                    Lot No
                  </TableCell>
                  <TableCell
                    className="printVoucher_border colpad"
                    style={{ textAlign: "center" }}
                  >
                    Pcs
                  </TableCell>
                  <TableCell
                    className="printVoucher_border colpad"
                    style={{ textAlign: "center" }}
                  >
                    Cat. Code
                  </TableCell>
                  <TableCell
                    className="printVoucher_border colpad"
                    style={{ textAlign: "center" }}
                  >
                    Stone Wgt
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(printObj).length !== 0 &&
                  printObj?.treeOrderDetails.map((data, i) => {
                    console.log(data);
                    return (
                      <TableRow key={i}>
                        <TableCell
                          className="printVoucher_border"
                          style={{ textAlign: "center" }}
                        >
                          {i + 1}
                        </TableCell>
                        <TableCell
                          className="printVoucher_border"
                          style={{ textAlign: "center" }}
                          colSpan={3}
                        >
                          {data.lotDetailsforTree?.number}
                        </TableCell>
                        <TableCell
                          className="printVoucher_border"
                          style={{ textAlign: "center" }}
                        >
                          {data.lotDetailsforTree?.pcs}
                        </TableCell>
                        <TableCell
                          className="printVoucher_border"
                          style={{ textAlign: "center" }}
                        >
                          {
                            data.lotDetailsforTree.ProductCategory
                              ?.category_code
                          }
                        </TableCell>
                        <TableCell
                          className="printVoucher_border"
                          style={{ textAlign: "center" }}
                        >
                          {data.lotDetailsforTree?.total_stone_weight}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
              <TableFooter>
                <TableRow style={{ backgroundColor: "transparent" }}>
                  <TableCell
                    className="printVoucher_border colpad"
                    colSpan={4}
                    style={{ textAlign: "center" }}
                  >
                    <b>Total</b>
                  </TableCell>
                  <TableCell
                    className="printVoucher_border colpad"
                    style={{ textAlign: "center" }}
                  >
                    <b>
                      {/* {Object.keys(printObj).length !== 0 && printObj?.treeOrderDetails.map(item => item.lotDetailsforTree?.pcs).reduce((total, value) => total + value, 0)} */}
                      {/* {Object.keys(printObj).length !== 0 && printObj?.treeOrderDetails.reduce((total, order) => total + order.lotDetailsforTree.pcs, 0)} */}
                      {totalpcs}
                    </b>
                  </TableCell>
                  <TableCell className="printVoucher_border colpad"></TableCell>
                  <TableCell
                    className="printVoucher_border colpad"
                    style={{ textAlign: "center" }}
                  >
                    <b>
                      {totalweight ? parseFloat(totalweight).toFixed(3) : 0}
                    </b>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </Paper>
        </div>
      </div>
    );
  }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
  // eslint-disable-line max-len text={props.text}
  return <MakeATreePrint ref={ref} printObj={props.printObj} />;
});
