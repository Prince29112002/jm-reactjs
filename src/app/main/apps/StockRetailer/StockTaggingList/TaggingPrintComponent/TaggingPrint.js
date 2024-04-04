import * as React from "react";
import { ToWords } from "to-words";

import moment from "moment";
import brcodelogo from "../../../../../../assets/images/Login Vector/brcodelogo.png";
import QRCode from "react-qr-code";

export class TaggingPrint extends React.PureComponent {
  componentDidMount() {}

  render() {
    const { printObj } = this.props;

    const myprofileData = localStorage.getItem("myprofile")
      ? JSON.parse(localStorage.getItem("myprofile"))
      : [];
    console.log(myprofileData);
    return (
      <>
        <div
          className="increase-padding-dv jewellery_main_print-blg"
          style={{
            width: "510px",
            minHeight: "722px",
            height: "722px",
            fontSize: "5px",
          }}
        >
          <style type="text/css" media="print">
            {
              "\
            @page { size: A5 portrait !important; margin:auto 25px auto 25px; }"
            }
          </style>
          <div style={{ paddingBlock: 18, paddingInline: 14 }}>
            <ul className="barcode_print">
              {printObj
                ? printObj.map((data, index) => {
                    console.log(data);
                    return (
                      <li style={{ width: "50%" }} key={index}>
                        <div
                          className="barcodeitem"
                          style={{
                            width: 153,
                            height: 49,
                            padding: 3,
                            border: "1px solid transparent",
                            borderRadius: 7,
                          }}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <div style={{ flex: 1 }}>
                              <img
                                src={myprofileData.logo}
                                alt="QR"
                                width="auto"
                                height="40px"
                                style={{ display: "block", margin: "0 auto" }}
                              />
                            </div>
                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  alignItems: "center",
                                }}
                              >
                                <div style={{ width: "50%" }}>
                                  <QRCode
                                    size={256}
                                    style={{
                                      height: "auto",
                                      maxWidth: "calc(100% - 4px)",
                                      width: "calc(100% - 4px)",
                                      padding: 2,
                                    }}
                                    value={data.qr}
                                    viewBox={`0 0 256 256`}
                                  />
                                </div>
                                <div style={{ width: "50%" }}>
                                  {data.Gwt && (
                                    <div>
                                      <span style={{ width: "45%" }}>Gwt:</span>
                                      <span style={{ padding: 0 }}>
                                        {data.Gwt}
                                      </span>
                                    </div>
                                  )}
                                  {data.Less && (
                                    <div>
                                      <span style={{ width: "45%" }}>
                                        Less:
                                      </span>
                                      <span style={{ padding: 0 }}>
                                        {data.Less}
                                      </span>
                                    </div>
                                  )}
                                  {data.Nwt && (
                                    <div>
                                      <span style={{ width: "45%" }}>Nwt:</span>
                                      <span style={{ padding: 0 }}>
                                        {data.Nwt}
                                      </span>
                                    </div>
                                  )}
                                  {data.Rs && (
                                    <div>
                                      <span
                                        style={{
                                          width: "45%",
                                          fontSize: !(
                                            data.Gwt &&
                                            data.Less &&
                                            data.Nwt
                                          )
                                            ? "8px"
                                            : "inherit",
                                        }}
                                      >
                                        Rs:
                                      </span>
                                      <span
                                        style={{
                                          padding: 0,
                                          fontSize: !(
                                            data.Gwt &&
                                            data.Less &&
                                            data.Nwt
                                          )
                                            ? "8px"
                                            : "inherit",
                                        }}
                                      >
                                        {data.Rs}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div style={{ width: "100%" }}>
                                  <p
                                    style={{ fontSize: 6, textAlign: "center" }}
                                  >
                                    {data.barcode}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })
                : null}
            </ul>
          </div>
        </div>
      </>
    );
  }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
  // eslint-disable-line max-len text={props.text}
  return <TaggingPrint ref={ref} printObj={props.printObj} />;
});
