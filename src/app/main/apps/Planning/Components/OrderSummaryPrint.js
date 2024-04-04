import Config from "app/fuse-configs/Config";
import * as React from "react";
import QRCode from "react-qr-code";
import HelperFunc from "app/main/apps/SalesPurchase/Helper/HelperFunc";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
} from "@material-ui/core";
import moment from "moment";

// pageBreakBefore:"always", pageBreakInside:"avoid", pageBreakAfter:"always"

export default class OrderSummaryPrint extends React.PureComponent {
  componentDidMount() {}

  render() {
    const { printObj } = this.props;
    console.log(printObj);
    return (
      <div>
        <style type="text/css" media="print">
          {
            "\
             @page { size: A4 portrait !important;margin:45px 25px 45px 25px; }\
          "
          }
        </style>
        <div
          style={{
            display: "flex",
            gap: 5,
            flexWrap: "wrap",
          }}
        >
          <div className="planing_order" id="tbl_exporttable_to_pdf">
            <div className="add_reference_header">
              <div className="header-tabel-deta">
                <div
                  style={{
                    maxWidth: "150px",
                    fontSize: "12px",
                  }}
                  className="table_pad"
                >
                  <b>Order Date</b>
                </div>
                <div
                  style={{ maxWidth: "50px", fontSize: "12px" }}
                  className="table_pad"
                >
                  {" "}
                  :{" "}
                </div>
                <div style={{ fontSize: "12px" }} className="table_pad">
                  {Object.keys(printObj).length !== 0 &&
                    moment(printObj.created_at).format("DD-MM-YYYY")}
                </div>
                <div
                  style={{ maxWidth: "150px", fontSize: "12px" }}
                  className="table_pad"
                >
                  <b>Party Name</b>
                </div>
                <div
                  style={{ maxWidth: "50px", fontSize: "12px" }}
                  className="table_pad"
                >
                  {" "}
                  :{" "}
                </div>
                <div style={{ fontSize: "12px" }} className="table_pad">
                  {Object.keys(printObj).length !== 0 &&
                    printObj.distributor.client.name}
                </div>
              </div>
            </div>
            <div className="add_reference_header">
              <div
                className="header-tabel-deta"
                style={{ borderTop: "none", borderBottom: "none" }}
              >
                <div
                  style={{
                    maxWidth: "150px",
                    fontSize: "12px",
                  }}
                  className="table_pad"
                >
                  <b>Purity</b>
                </div>
                <div
                  style={{ maxWidth: "50px", fontSize: "12px" }}
                  className="table_pad"
                >
                  {" "}
                  :{" "}
                </div>
                <div style={{ fontSize: "12px" }} className="table_pad">
                  {Object.keys(printObj).length !== 0 && printObj.karat}
                </div>
                <div
                  style={{ maxWidth: "150px", fontSize: "12px" }}
                  className="table_pad"
                >
                  <b>Retailer Name</b>
                </div>
                <div
                  style={{ maxWidth: "50px", fontSize: "12px" }}
                  className="table_pad"
                >
                  {" "}
                  :{" "}
                </div>
                <div style={{ fontSize: "12px" }} className="table_pad">
                  {Object.keys(printObj).length !== 0 &&
                    printObj?.retailer?.company_name}
                </div>
              </div>
            </div>
            <div className="add_reference_header">
              <div className="header-tabel-deta">
                <div
                  style={{
                    maxWidth: "150px",
                    fontSize: "12px",
                  }}
                  className="table_pad"
                >
                  <b>Order No.</b>
                </div>
                <div
                  style={{ maxWidth: "50px", fontSize: "12px" }}
                  className="table_pad"
                >
                  {" "}
                  :{" "}
                </div>
                <div style={{ fontSize: "12px" }} className="table_pad">
                  {Object.keys(printObj).length !== 0 && printObj.order_number}
                </div>
                <div
                  style={{ maxWidth: "150px", fontSize: "12px" }}
                  className="table_pad"
                >
                  <b>Order Net Weight</b>
                </div>
                <div
                  style={{ maxWidth: "50px", fontSize: "12px" }}
                  className="table_pad"
                >
                  {" "}
                  :{" "}
                </div>
                <div
                  style={{ fontSize: "12px", display: "block" }}
                  className="table_pad"
                >
                  {Object.keys(printObj).length !== 0 &&
                    printObj.OrderNetWeight.map((data, index) => (
                      <span key={index}>
                        {index !== 0 && <b>{` | `}</b>}
                        {data.category_with_weight}
                      </span>
                    ))}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", marginBlock: 10 }}>
              <div
                style={{ flexBasis: "50%" }}
                className="add_reference_header"
              >
                <div style={{ display: "flex" }} className="header-tabel-deta">
                  <div
                    style={{
                      maxWidth: "150px",
                      fontSize: "12px",
                    }}
                    className="table_pad"
                  >
                    <b>Order Series</b>
                  </div>
                  <div
                    style={{ maxWidth: "50px", fontSize: "12px" }}
                    className="table_pad"
                  >
                    {" "}
                    :{" "}
                  </div>
                  <div style={{ fontSize: "12px" }} className="table_pad">
                    {Object.keys(printObj).length !== 0 &&
                      printObj.order_number}
                  </div>
                </div>
                <div
                  style={{ display: "flex", borderTop: "none" }}
                  className="header-tabel-deta"
                >
                  <div
                    style={{
                      maxWidth: "150px",
                      fontSize: "12px",
                    }}
                    className="table_pad"
                  >
                    <b>Order Confirm By</b>
                  </div>
                  <div
                    style={{ maxWidth: "50px", fontSize: "12px" }}
                    className="table_pad"
                  >
                    {" "}
                    :{" "}
                  </div>
                  <div style={{ fontSize: "12px" }} className="table_pad">
                    {Object.keys(printObj).length !== 0 &&
                      printObj.order_confirmed_admin}
                  </div>
                </div>
              </div>
              <div
                style={{ flexBasis: "50%" }}
                className="add_reference_header "
              >
                <div
                  style={{
                    display: "flex",
                    maxWidth: 250,
                    justifyContent: "center",
                    marginLeft: "auto",
                  }}
                  className="header-tabel-deta"
                >
                  <div
                    style={{
                      fontSize: "12px",
                      textAlign: "center",
                    }}
                    className="table_pad"
                  >
                    <b>Order Form Create Name</b>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    maxWidth: 250,
                    justifyContent: "center",
                    marginLeft: "auto",
                    borderTop: "none",
                  }}
                  className="header-tabel-deta"
                >
                  <div
                    style={{
                      fontSize: "12px",
                      textAlign: "center",
                      height: 25,
                    }}
                    className="table_pad"
                  >
                    {Object.keys(printObj).length !== 0 &&
                      printObj.lot_created_admin}
                  </div>
                </div>
              </div>
            </div>
            <Table className="add_refference_table">
              <TableHead>
                <TableRow>
                  <TableCell
                    className="table_pad"
                    width={80}
                    align="center"
                    rowSpan={2}
                  >
                    Sr. No.
                  </TableCell>
                  <TableCell className="table_pad" align="center" rowSpan={2}>
                    Item Name
                  </TableCell>
                  <TableCell
                    className="table_pad"
                    width={65}
                    align="center"
                    rowSpan={2}
                  >
                    Qty
                  </TableCell>
                  <TableCell
                    className="table_pad"
                    width={85}
                    align="center"
                    rowSpan={2}
                  >
                    Nwt Wgt
                  </TableCell>
                  <TableCell
                    className="table_pad"
                    width={150}
                    align="center"
                    colSpan={2}
                  >
                    Range
                  </TableCell>
                  <TableCell className="table_pad" rowSpan={2} align="center">
                    Item Remarks
                  </TableCell>
                  <TableCell className="table_pad" rowSpan={2} align="center">
                    Lot Number
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="table_pad" width={75} align="center">
                    Wgt
                  </TableCell>
                  <TableCell className="table_pad" width={75} align="center">
                    Wgt
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(printObj).length !== 0 &&
                  printObj.ProductionOrderDesigns.map((data, index) => {
                    console.log(data);
                    return (
                      <TableRow key={index}>
                        <TableCell className="table_pad" align="center">
                          {index + 1}
                        </TableCell>
                        <TableCell className="table_pad">
                          {data?.CategoryName?.category_name}
                        </TableCell>
                        <TableCell className="table_pad">
                          {data.total_pieces}
                        </TableCell>
                        <TableCell className="table_pad">
                          {data.net_weight}
                        </TableCell>
                        <TableCell className="table_pad">Wgt</TableCell>
                        <TableCell className="table_pad">Wgt</TableCell>
                        <TableCell className="table_pad">
                          {data.comment}
                        </TableCell>
                        <TableCell className="table_pad">
                          {data.lotData.number}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell className="table_pad" colSpan={2} align="center">
                    Total
                  </TableCell>
                  <TableCell className="table_pad" align="center">
                    <b>
                      {(Object.keys(printObj).length !== 0 &&
                        parseInt(
                          HelperFunc.getTotalOfField(
                            printObj.ProductionOrderDesigns,
                            "total_pieces"
                          )
                        )) ||
                        0}
                    </b>
                  </TableCell>
                  <TableCell className="table_pad" align="center">
                    <b>
                      {(Object.keys(printObj).length !== 0 &&
                        parseFloat(
                          HelperFunc.getTotalOfField(
                            printObj.ProductionOrderDesigns,
                            "net_weight"
                          )
                        ).toFixed(3)) ||
                        0}
                    </b>
                  </TableCell>
                  <TableCell
                    className="table_pad"
                    colSpan={3}
                    align="center"
                  ></TableCell>
                  <TableCell className="table_pad"></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
            <p style={{ textAlign: "center", marginBlock: 8, fontWeight: 700 }}>
              Order Attributes
            </p>
            <div className="add_reference_header">
              <div className="header-tabel-deta">
                <div
                  style={{
                    flexBasis: "250px",
                    fontSize: "12px",
                  }}
                  className="table_pad"
                >
                  <b>Screw Type</b>
                </div>
                <div
                  style={{ flexBasis: "50px", fontSize: "12px" }}
                  className="table_pad"
                >
                  {" "}
                  :{" "}
                </div>
                <div
                  style={{ flexBasis: "250px", fontSize: "12px" }}
                  className="table_pad"
                >
                  {Object.keys(printObj).length !== 0 && printObj.screw_type}
                </div>
                <div
                  style={{ flexBasis: "250px", fontSize: "12px" }}
                  className="table_pad"
                >
                  <b>Rhodium on stone %</b>
                </div>
                <div
                  style={{ flexBasis: "50px", fontSize: "12px" }}
                  className="table_pad"
                >
                  {" "}
                  :{" "}
                </div>
                <div
                  style={{ flexBasis: "250px", fontSize: "12px" }}
                  className="table_pad"
                >
                  {Object.keys(printObj).length !== 0 &&
                    printObj.rhodium_on_stone_percentage}
                </div>
              </div>
            </div>
            <div className="add_reference_header">
              <div className="header-tabel-deta" style={{ borderTop: "none" }}>
                <div
                  style={{
                    flexBasis: "250px",
                    fontSize: "12px",
                  }}
                  className="table_pad"
                >
                  <b>Rhodium on Plain part %</b>
                </div>
                <div
                  style={{ flexBasis: "50px", fontSize: "12px" }}
                  className="table_pad"
                >
                  {" "}
                  :{" "}
                </div>
                <div
                  style={{ flexBasis: "250px", fontSize: "12px" }}
                  className="table_pad"
                >
                  {Object.keys(printObj).length !== 0 &&
                    printObj.rhodium_on_plain_part_percentage}
                </div>
                <div
                  style={{ flexBasis: "250px", fontSize: "12px" }}
                  className="table_pad"
                >
                  <b>Rhodium Remarks</b>
                </div>
                <div
                  style={{ flexBasis: "50px", fontSize: "12px" }}
                  className="table_pad"
                >
                  {" "}
                  :{" "}
                </div>
                <div
                  style={{ flexBasis: "250px", fontSize: "12px" }}
                  className="table_pad"
                >
                  {Object.keys(printObj).length !== 0 &&
                    printObj.rhodium_remarks}
                </div>
              </div>
            </div>
            <div className="add_reference_header">
              <div className="header-tabel-deta" style={{ borderTop: "none" }}>
                <div
                  style={{
                    flexBasis: "250px",
                    fontSize: "12px",
                  }}
                  className="table_pad"
                >
                  <b>Sandblasting dull %</b>
                </div>
                <div
                  style={{ flexBasis: "50px", fontSize: "12px" }}
                  className="table_pad"
                >
                  {" "}
                  :{" "}
                </div>
                <div
                  style={{ flexBasis: "250px", fontSize: "12px" }}
                  className="table_pad"
                >
                  {Object.keys(printObj).length !== 0 &&
                    printObj.sandblasting_dull_percentage}
                </div>
                <div
                  style={{ flexBasis: "250px", fontSize: "12px" }}
                  className="table_pad"
                >
                  <b>Satin dull %</b>
                </div>
                <div
                  style={{ flexBasis: "50px", fontSize: "12px" }}
                  className="table_pad"
                >
                  {" "}
                  :{" "}
                </div>
                <div
                  style={{ flexBasis: "250px", fontSize: "12px" }}
                  className="table_pad"
                >
                  {Object.keys(printObj).length !== 0 &&
                    printObj.satin_dull_percentage}
                </div>
              </div>
            </div>
            <div className="add_reference_header">
              <div className="header-tabel-deta" style={{ borderTop: "none" }}>
                <div
                  style={{
                    flexBasis: "250px",
                    fontSize: "12px",
                  }}
                  className="table_pad"
                >
                  <b>Dull Texture Remark</b>
                </div>
                <div
                  style={{ flexBasis: "50px", fontSize: "12px" }}
                  className="table_pad"
                >
                  {" "}
                  :{" "}
                </div>
                <div
                  style={{ flexBasis: "250px", fontSize: "12px" }}
                  className="table_pad"
                >
                  {Object.keys(printObj).length !== 0 &&
                    printObj.dull_texture_remark}
                </div>
                <div
                  style={{ flexBasis: "250px", fontSize: "12px" }}
                  className="table_pad"
                >
                  <b>Enamel %</b>
                </div>
                <div
                  style={{ flexBasis: "50px", fontSize: "12px" }}
                  className="table_pad"
                >
                  {" "}
                  :{" "}
                </div>
                <div
                  style={{ flexBasis: "250px", fontSize: "12px" }}
                  className="table_pad"
                >
                  {Object.keys(printObj).length !== 0 &&
                    printObj.enamel_percentage}
                </div>
              </div>
            </div>
            <div className="add_reference_header">
              <div className="header-tabel-deta" style={{ borderTop: "none" }}>
                <div
                  style={{
                    flexBasis: "250px",
                    fontSize: "12px",
                  }}
                  className="table_pad"
                >
                  <b>Enamel Remark</b>
                </div>
                <div
                  style={{ flexBasis: "50px", fontSize: "12px" }}
                  className="table_pad"
                >
                  {" "}
                  :{" "}
                </div>
                <div
                  style={{ flexBasis: "250px", fontSize: "12px" }}
                  className="table_pad"
                >
                  {Object.keys(printObj).length !== 0 && printObj.enamel_remark}
                </div>
                <div
                  style={{ flexBasis: "250px", fontSize: "12px" }}
                  className="table_pad"
                >
                  <b>Additional Color Stone %</b>
                </div>
                <div
                  style={{ flexBasis: "50px", fontSize: "12px" }}
                  className="table_pad"
                >
                  {" "}
                  :{" "}
                </div>
                <div
                  style={{ flexBasis: "250px", fontSize: "12px" }}
                  className="table_pad"
                >
                  {Object.keys(printObj).length !== 0 &&
                    printObj.additional_color_stone}
                </div>
              </div>
            </div>
            <div className="add_reference_header">
              <div className="header-tabel-deta" style={{ borderTop: "none" }}>
                <div
                  style={{
                    flexBasis: "250px",
                    fontSize: "12px",
                  }}
                  className="table_pad"
                >
                  <b>Additional Color Remark</b>
                </div>
                <div
                  style={{ flexBasis: "50px", fontSize: "12px" }}
                  className="table_pad"
                >
                  {" "}
                  :{" "}
                </div>
                <div
                  style={{ flexBasis: "250px", fontSize: "12px" }}
                  className="table_pad"
                >
                  {Object.keys(printObj).length !== 0 &&
                    printObj.additional_color_remark}
                </div>
                <div
                  style={{ flexBasis: "573px", fontSize: "12px" }}
                  className="table_pad"
                ></div>
              </div>
            </div>
            <div className="add_reference_header">
              <div className="header-tabel-deta" style={{ borderTop: "none" }}>
                <div
                  style={{
                    flexBasis: "250px",
                    fontSize: "12px",
                  }}
                  className="table_pad"
                >
                  <b>Final Order Remark</b>
                </div>
                <div
                  style={{ flexBasis: "50px", fontSize: "12px" }}
                  className="table_pad"
                >
                  {" "}
                  :{" "}
                </div>
                <div
                  style={{
                    flexBasis: "833px",
                    fontSize: "12px",
                    justifyContent: "flex-start",
                  }}
                  className="table_pad"
                >
                  {Object.keys(printObj).length !== 0 &&
                    printObj.final_order_remark}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
  // eslint-disable-line max-len text={props.text}
  return <OrderSummaryPrint ref={ref} printObj={props.printObjMultiple} />;
});
