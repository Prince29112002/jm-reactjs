import * as React from "react";
import moment from "moment";
import clsx from "clsx";

export default class LotSummary extends React.PureComponent {
  componentDidMount() {}

  render() {
    const { printObj, getDateAndTime } = this.props;
    console.log(printObj);

    return (
      <div>
        <style type="text/css" media="print">
          {
            "\
             @page { size: A4 portrait !important;margin:25px; }\
          "
          }
        </style>
        <ul className="jewellery_main_print_dv" margin="20px" padding="30px">
          <div style={{ paddingLeft: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div
                style={{
                  paddingBottom: "3px",
                  paddingTop: "3px",
                  fontSize: "15px",
                  display: "inline-block",
                }}
              >
                <b>Date : </b> {` ${getDateAndTime}`}
              </div>
              <div
                style={{
                  paddingBottom: "3px",
                  paddingTop: "3px",
                  fontSize: "15px",
                  marginRight: "8px",
                }}
              >
                <b>Shipment Date : </b>
                {printObj.shipping_date
                  ? moment(printObj.shipping_date, "YYYY-MM-DD").format(
                      "DD-MM-YYYY"
                    )
                  : "-"}
              </div>
            </div>

            <div style={{ fontWeight: 700, fontSize: "18px" }}>
              <div style={{ paddingBottom: "3px" }}>
                Lot No : {printObj.Lot_number ? printObj.Lot_number : "-"}{" "}
              </div>
              <div style={{ paddingBottom: "3px" }}>
                Touch : {printObj.purity ? printObj.purity : "-"}
              </div>
            </div>
          </div>

          <li className="d-block">
            <div className="tabel-deta-show">
              <div
                style={{
                  fontWeight: 800,
                  border: "1px solid black",
                  display: "flex",
                  fontSize: "16px",
                }}
              >
                <div
                  style={{ padding: "5px", paddingLeft: "8px", width: "300px" }}
                >
                  Item Name
                </div>
                <div style={{ padding: "5px", width: "275px" }}>Pcs</div>
                <div style={{ padding: "5px", width: "275px" }}>
                  No of Design
                </div>
                <div style={{ padding: "5px", paddingRight: "8px" }}>
                  Weight
                </div>
              </div>

              <div className="row">
                <div
                  style={{
                    border: "1px solid black",
                    display: "flex",
                    borderTop: "none",
                    fontSize: "16px",
                  }}
                >
                  <div
                    style={{
                      padding: "5px",
                      paddingLeft: "8px",
                      width: "300px",
                    }}
                  >
                    {printObj.categoryname ? printObj.categoryname : "-"}
                  </div>
                  <div style={{ padding: "5px", width: "275px" }}>
                    {printObj.deisgn_pcs ? printObj.deisgn_pcs : "-"}
                  </div>
                  <div style={{ padding: "5px", width: "275px" }}>
                    {printObj.noOfdesign ? printObj.noOfdesign : "-"}
                  </div>
                  <div style={{ padding: "5px", paddingRight: "8px" }}>
                    {printObj.totalNetweight
                      ? parseFloat(printObj.totalNetweight).toFixed(3)
                      : "-"}
                  </div>
                </div>
              </div>
            </div>
          </li>

          <div
            className="row"
            style={{ margin: "7px", borderTop: "1px solid black" }}
          >
            <div className="body-tabel-deta">
              <div
                style={{
                  textAlign: "center",
                  paddingTop: "7px",
                  fontSize: "17px",
                  display: "block",
                }}
              >
                <b>WAX Setting </b>
                <div style={{ padding: "7px" }}>
                  {printObj.waxstone !== null ? printObj.waxstone : "-"}
                </div>
              </div>
              <div
                style={{
                  textAlign: "center",
                  paddingTop: "7px",
                  fontSize: "17px",
                  display: "block",
                }}
              >
                <b>Hand Setting </b>
                <div style={{ padding: "7px" }}>
                  {printObj.handstone !== null ? printObj.handstone : "-"}
                </div>
              </div>
            </div>
          </div>

          <div className="row" style={{ margin: "7px", gap: 10 }}>
            <div
              style={{
                display: "flex",
                flex: 1,
                justifyContent: "space-around",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  paddingTop: "7px",
                  fontSize: "17px",
                  display: "block",
                }}
              >
                Total Stone Weight
                <div style={{ padding: "7px" }}>Total Stone Pcs</div>
              </div>
              <div
                style={{
                  textAlign: "center",
                  paddingTop: "7px",
                  fontSize: "17px",
                  fontWeight: 700,
                  display: "block",
                }}
              >
                {printObj.totalStoneWeight !== null
                  ? parseFloat(printObj.totalStoneWeight).toFixed(3)
                  : "-"}
                <div style={{ padding: "7px" }}>
                  {printObj.totalStonePcs ? printObj.totalStonePcs : "-"}
                </div>
              </div>
            </div>
          </div>

          <div style={{ margin: "5px" }}>
            <div
              className={clsx(
                "d-block",
                "tabel-deta-show",
                "row",
                "header-tabel-deta"
              )}
              style={{ borderBottom: "none" }}
            >
              <div style={{ padding: "3px", fontWeight: 700 }}>
                Rhodium on Stone %
              </div>
              <div style={{ padding: "3px" }}>
                {" "}
                {printObj.rhodium_on_stone ? printObj.rhodium_on_stone : "-"}
              </div>
              <div style={{ padding: "3px", fontWeight: 700 }}>Enamel %</div>
              <div style={{ padding: "3px" }}>
                {printObj.enamel_percentage ? printObj.enamel_percentage : "-"}
              </div>
            </div>

            <div
              className={clsx(
                "d-block",
                "tabel-deta-show",
                "row",
                "header-tabel-deta"
              )}
              style={{ borderBottom: "none" }}
            >
              <div style={{ padding: "3px", fontWeight: 700 }}>
                Rhodium on Plain part %{" "}
              </div>
              <div style={{ padding: "3px" }}>
                {" "}
                {printObj.rhodium_on_plain ? printObj.rhodium_on_plain : "-"}
              </div>
              <div style={{ padding: "3px", fontWeight: 700 }}>
                Enamel Remark
              </div>
              <div style={{ padding: "3px" }}>
                {printObj.enamel_remark ? printObj.enamel_remark : "-"}
              </div>
            </div>

            <div
              className={clsx(
                "d-block",
                "tabel-deta-show",
                "row",
                "header-tabel-deta"
              )}
              style={{ borderBottom: "none" }}
            >
              <div style={{ padding: "3px", fontWeight: 700 }}>
                Rhodium Remarks
              </div>
              <div style={{ padding: "3px" }}>
                {" "}
                {printObj.rhodium_remark ? printObj.rhodium_remark : "-"}{" "}
              </div>
              <div style={{ padding: "3px", fontWeight: 700 }}>
                Additional Color Stone %
              </div>
              <div style={{ padding: "3px" }}>
                {" "}
                {printObj.additional_color ? printObj.additional_color : "-"}
              </div>
            </div>

            <div
              className={clsx(
                "d-block",
                "tabel-deta-show",
                "row",
                "header-tabel-deta"
              )}
              style={{ borderBottom: "none" }}
            >
              <div style={{ padding: "3px", fontWeight: 700 }}>
                Sandblasting Dull %
              </div>
              <div style={{ padding: "3px" }}>
                {printObj.sandblasting_dull ? printObj.sandblasting_dull : "-"}{" "}
              </div>
              <div style={{ padding: "3px", fontWeight: 700 }}>
                Additional Color Remark
              </div>
              <div style={{ padding: "3px" }}>
                {printObj.additional_color_remark
                  ? printObj.additional_color_remark
                  : "-"}
              </div>
            </div>

            <div
              className={clsx(
                "d-block",
                "tabel-deta-show",
                "row",
                "header-tabel-deta"
              )}
              style={{ borderBottom: "none" }}
            >
              <div style={{ padding: "3px", fontWeight: 700 }}>
                Satin Dull %
              </div>
              <div style={{ padding: "3px" }}>
                {" "}
                {printObj.satin_dull ? printObj.satin_dull : "-"}{" "}
              </div>
              <div style={{ padding: "3px", fontWeight: 700 }}>Remark 1</div>
              <div style={{ padding: "3px" }}>
                {printObj.remark_1 !== null ? printObj.remark_1 : "-"}
              </div>
            </div>

            <div
              className={clsx(
                "d-block",
                "tabel-deta-show",
                "row",
                "header-tabel-deta"
              )}
              style={{ borderBottom: "none" }}
            >
              <div style={{ padding: "3px", fontWeight: 700 }}>
                Dull Texture Remark
              </div>
              <div style={{ padding: "3px" }}>
                {" "}
                {printObj.dull_texture_remark
                  ? printObj.dull_texture_remark
                  : "-"}
              </div>
              <div style={{ padding: "3px", fontWeight: 700 }}>Remark 2</div>
              <div style={{ padding: "3px" }}>
                {printObj.remark_2 !== null ? printObj.remark_2 : "-"}
              </div>
            </div>

            <div
              className={clsx(
                "d-block",
                "tabel-deta-show",
                "row",
                "header-tabel-deta"
              )}
            >
              <div style={{ padding: "3px", fontWeight: 700 }}>
                Final Order Remark
              </div>
              <div style={{ padding: "3px" }}>
                {printObj.remark ? printObj.remark : "-"}
              </div>
              <div style={{ padding: "3px", fontWeight: 700 }}>Remark 3</div>
              <div style={{ padding: "3px" }}>
                {printObj.remark_3 !== null ? printObj.remark_3 : "-"}
              </div>
            </div>
          </div>
        </ul>
      </div>
    );
  }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
  // eslint-disable-line max-len text={props.text}
  return <LotSummary ref={ref} printObj={props.printObj} />;
});
