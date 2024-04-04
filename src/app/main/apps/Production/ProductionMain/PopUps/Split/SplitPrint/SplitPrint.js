import { Table, TableCell, TableRow } from "@material-ui/core";
import * as React from "react";
import { ToWords } from "to-words";

export class SplitPrint extends React.PureComponent {
  componentDidMount() {}

  render() {
    const { printObj, isView , getDateAndTime} = this.props;
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
          {
            "\
             @page { size: A4 portrait !important;margin:10px 25px 10px 25px; }\
          "
          }
        </style>

      {/* <div style={{position:"absolute" , top:"13px", right:8}}>{getDateAndTime}</div> */}
        {/* <ul className="jewellery_main_print_dv" style={{paddingTop: 35}}> */}

        <ul className="jewellery_main_print_dv ">
          <li className="d-block">
            <ul className="jewellery_main_print-title">
              <li className="d-block">
                <h1>{siteSetData.company_name}</h1>
                <p>{siteSetData.company_address}</p>
                <p>
                  {siteSetData.city},{siteSetData.state} - {siteSetData.pin}
                </p>
                <p>
                  {siteSetData.email} | {siteSetData.website}
                </p>
                <p>
                  GST No:{siteSetData.gst_number} PAN:{siteSetData.pan_number}{" "}
                  CIN:{siteSetData.cin_number}
                </p>
              </li>
            </ul>
          </li>

          <li className="d-block">
            <ul className="jewellery_print_secand">
              <li className="d-block">
                <h1>Split Created Lot Data </h1>
              </li>
            </ul>
          </li>

          <li className="d-block">
            <div className="tabel-deta-show">
              <div className="row">
                <div
                  className="header-tabel-deta"
                  style={{ borderTop: "none"}}
                >
                  <div style={{ padding: "3px"  , minWidth:"140px"}}>Lot No</div>
                  <div style={{ padding: "3px"  , minWidth:"160px"}}>Lot Category</div>
                  <div style={{ padding: "3px" , maxWidth:"65px"}}>Purity</div>
                  <div style={{ padding: "3px" , maxWidth:"65px"}}>Lot Pcs</div>
                  <div style={{ padding: "3px" , maxWidth:"65px"}}>Stone Pcs</div>
                  <div style={{ padding: "3px", maxWidth:"120px" }}>Gross Weight</div>
                  <div style={{ padding: "3px" , maxWidth:"120px"}}>Stone Weight</div>
                  <div style={{ padding: "3px" , maxWidth:"120px"}}>Net Weight</div>
                </div>
              </div>
              {printObj.length === 0 ? (
                <div className="row">
                  <div className="body-tabel-deta">
                    <div
                      style={{
                        padding: "3px",
                        display: "flex",
                        justifyContent:"center"
                      }}
                    >
                      No Data
                    </div>
                  </div>
                </div>
              ) : (
                printObj.map((printObj, i) => {
                  return (
                    <div className="row" key={i}>
                      <div className="body-tabel-deta">
                        <div
                          border="1"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            flexWrap: "wrap",
                            padding: "3px",
                            textAlign:"center",
                            justifyContent:"center",
                            minWidth:"140px",
                          }}
                        >
                          {printObj.lot_number}
                        </div>
                        <div
                          border="1"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "3px",
                            textAlign: "center",
                            minWidth:"160px",
                          }}
                        >
                          {printObj.lot_category ? printObj.lot_category : "-"}
                        </div>
                        <div
                          border="1"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "3px",
                            maxWidth:"65px",
                          }}
                        >
                          {printObj.purity ? printObj.purity : "-"}
                        </div>
                        <div
                          border="1"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "3px",
                            maxWidth:"65px",
                          }}
                        >
                          {printObj.Lot_pcs ? printObj.Lot_pcs : "-"}
                        </div>
                        <div
                          border="1"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "3px",
                            maxWidth:"65px",
                          }}
                        >
                          {printObj.stone_pcs ? printObj.stone_pcs : "-"}
                        </div>
                        <div
                          border="1"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "3px",
                            maxWidth:"120px",
                          }}
                        >
                          {printObj.gross_weight ? printObj.gross_weight : "-"}
                        </div>
                        <div
                          border="1"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "3px",
                            maxWidth:"120px",
                          }}
                        >
                          {printObj.stone_weight ? printObj.stone_weight : "-"}
                        </div>
                        <div
                          border="1"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "3px",
                            maxWidth:"120px",
                          }}
                        >
                          {printObj.net_weight ? printObj.net_weight : "-"}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </li>

          <li className="d-block">
            <div className="tabel-deta-show multiple-tabel-blg">
              <div className="row" style={{ display: "flex", padding: 5 }}>
                <div style={{ flex: "1 1 0" }}>
                  <span className="print-div-left-increase">
                    Receiver Signature :
                  </span>
                </div>
                <div
                  style={{
                    // flex: "1 1 0",
                    flexDirection: "column ",
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <div>For {siteSetData.company_name}</div>
                  <div
                    style={{ height: "50px", display: "flex", columnGap: 10 }}
                  >
                    <div>
                      {siteSetData?.stamp && (
                        <img
                          src={siteSetData?.stamp}
                          alt="stamp"
                          style={{ height: 50, maxWidth: 80 }}
                        />
                      )}
                    </div>
                    <div>
                      {isView
                        ? printObj?.signature && (
                            <img
                              src={printObj?.signature}
                              alt="singnature"
                              style={{ maxHeight: 50 }}
                            />
                          )
                        : adminSignature && (
                            <img
                              src={adminSignature}
                              alt="singnature"
                              style={{ maxHeight: 50 }}
                            />
                          )}
                    </div>
                  </div>
                  <span>Authorised Signature</span>
                </div>
              </div>
            </div>
          </li>
        </ul>
        </div>
      
    );
  }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
  // eslint-disable-line max-len text={props.text}
  return <SplitPrint ref={ref} printObj={props.printObj} />;
});
