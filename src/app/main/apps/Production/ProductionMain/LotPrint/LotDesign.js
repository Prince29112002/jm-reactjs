import Config from "app/fuse-configs/Config";
import * as React from "react";
import QRCode from "react-qr-code";
import HelperFunc from "app/main/apps/SalesPurchase/Helper/HelperFunc";

// pageBreakBefore:"always", pageBreakInside:"avoid", pageBreakAfter:"always"

export default class LotDesign extends React.PureComponent {
  componentDidMount() {}

  render() {
    const { printObj } = this.props;
    console.log(printObj);
    return (
      <div>
        <style type="text/css" media="print">
          {
            "\
             @page { size: A4 portrait !important;margin:42px 25px 42px 25px; }\
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
          {printObj.length === 0 ? (
            <div>{/* No Data */}</div>
          ) : (
            printObj.map((printObj, i) => {
              return (
                <div
                  key={i}
                  style={{
                    pageBreakBefore:
                      i % 35 === 0 && i !== 0 ? "always" : "auto",
                  }}
                >
                  <ul
                    key={i}
                    style={{
                      border: "1px solid #000",
                      margin: "4px",
                      width: "135px",
                      paddingBlock: 4,
                    }}
                  >
                    <div style={{ marginLeft: "7px", fontSize: "10px" }}>
                      <div>
                        <span
                          style={{ width: "31px", display: "inline-block" }}
                        >
                          Lot#
                        </span>
                        : {printObj.Lot_number ? printObj.Lot_number : ""}
                      </div>
                      <div>
                        <span
                          style={{ width: "31px", display: "inline-block" }}
                        >
                          Item
                        </span>
                        : {printObj.categoryname ? printObj.categoryname : ""}
                      </div>
                      <div>
                        <span
                          style={{ width: "31px", display: "inline-block" }}
                        >
                          Dqn
                        </span>
                        : {printObj.design ? printObj.design : ""}
                      </div>
                      <div>
                        <span
                          style={{ width: "31px", display: "inline-block" }}
                        >
                          Purity
                        </span>
                        : {printObj.purity ? printObj.purity : ""}
                      </div>
                      <div>
                        <span
                          style={{ width: "31px", display: "inline-block" }}
                        >
                          Pcs
                        </span>
                        : {printObj.pcs ? printObj.pcs : ""}
                      </div>
                      <div>
                        <span
                          style={{ width: "31px", display: "inline-block" }}
                        >
                          Size
                        </span>
                        : {printObj.size ? printObj.size : ""}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        paddingTop: "2px",
                        height: 16,
                      }}
                    >
                      <div
                        style={{
                          border: "1px solid #000",
                          padding: "1px",
                          fontSize: "8px",
                          width: "140px",
                          marginLeft: "4px",
                          // maxHeight: "55px",
                          height: "13px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        {/* <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              columnGap: 5,
                              justifyContent: "space-between",
                            }}
                          >
                            {printObj.mold.map((item, i) => (
                              <div key={i} style={{ flexBasis: "45%" }}>
                                <span
                                  style={{
                                    width: "20px",
                                    display: "inline-block",
                                    wordBreak: "break-all",
                                  }}
                                >
                                  {" "}
                                  {item.mold_number ? item.mold_number : ""}{" "}
                                </span>{" "}
                                {item.mold_pcs ? item.mold_pcs : ""}{" "}
                              </div>
                            ))}
                          </div> */}
                        <div>
                          <b style={{ width: "50px", display: "inline-block" }}>
                            Total
                          </b>
                          <b>
                            {parseInt(
                              Config.numWithComma(
                                HelperFunc.getTotalOfField(
                                  printObj.mold,
                                  "mold_pcs"
                                )
                              )
                            )}
                          </b>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          marginLeft: "5px",
                          marginRight: "5px",
                          position: "relative",
                          top: "-22px",
                        }}
                      >
                        <QRCode
                          style={{ height: "35px", width: "35px" }}
                          value={printObj.batch_no ? printObj.batch_no : "-"}
                          viewBox={`0 0 256 256`}
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        marginLeft: "3px",
                        paddingInline: "1px",
                        fontSize: 8,
                        height: 24,
                      }}
                    >
                      <div>
                        <span>
                          Remark : {printObj.remark ? printObj.remark : "-"}
                        </span>
                      </div>
                    </div>
                  </ul>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
  // eslint-disable-line max-len text={props.text}
  return <LotDesign ref={ref} printObj={props.printObjMultiple} />;
});
