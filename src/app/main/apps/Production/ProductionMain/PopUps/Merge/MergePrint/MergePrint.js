import * as React from "react";
import { ToWords } from "to-words";

export class MergePrint extends React.PureComponent {
  componentDidMount() {
    // console.log("componentDidMount", this.props)
  }

  // setRef = (ref) => (this.canvasEl = ref);

  render() {
    // const { text } = this.props;
    const { printObj, isView } = this.props;
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

        <ul className="jewellery_main_print_dv ">
          <li className="d-block">
            <ul className="jewellery_main_print-title">
              <li className="d-block">
                <h1>{siteSetData.company_name}</h1>
                <p>{siteSetData.company_address},</p>
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
                <h1>Merge Created Lot Data </h1>
              </li>
            </ul>
          </li>

          <li className="d-block">
            <div className="tabel-deta-show">
              <div className="row">
                <div
                  className="header-tabel-deta"
                  style={{ borderTop: "none", borderBottom: "none" }}
                >
                  <div style={{ padding: "3px", minWidth: "140px" }}>
                    Lot Number
                  </div>
                  <div style={{ padding: "3px", minWidth: "160px" }}>
                    Lot Category
                  </div>
                  <div style={{ padding: "3px", maxWidth: "65px" }}>Purity</div>
                  <div style={{ padding: "3px", maxWidth: "65px" }}>
                    Lot Pcs
                  </div>
                  <div style={{ padding: "3px", maxWidth: "65px" }}>
                    Stone Pcs
                  </div>
                  <div style={{ padding: "3px", maxWidth: "120px" }}>
                    Gross Weight
                  </div>
                  <div style={{ padding: "3px", maxWidth: "120px" }}>
                    Stone Weight
                  </div>
                  <div style={{ padding: "3px", maxWidth: "120px" }}>
                    Net Weight
                  </div>
                </div>

                {printObj.length === 0 ? (
                  <div className="row">
                    <div className="header-tabel-deta">
                      <div
                        style={{
                          padding: "3px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        No Data
                      </div>
                    </div>
                  </div>
                ) : (
                  printObj.map((printObj, i) => {
                    return (
                      <div className="header-tabel-deta" key={i}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "3px",
                            flexWrap: "wrap",
                            minWidth: "140px",
                          }}
                        >
                          {printObj.number}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "3px",
                            textAlign: "center",
                            minWidth: "160px",
                          }}
                        >
                          {printObj.LotProductCategory.category_name
                            ? printObj.LotProductCategory.category_name
                            : "-"}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "3px",
                            maxWidth: "65px",
                          }}
                        >
                          {printObj.purity ? printObj.purity : "-"}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "3px",
                            maxWidth: "65px",
                          }}
                        >
                          {printObj.pcs ? printObj.pcs : "-"}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "3px",
                            maxWidth: "65px",
                          }}
                        >
                          {printObj.stone_pcs ? printObj.stone_pcs : "-"}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "3px",
                            maxWidth: "120px",
                          }}
                        >
                          {printObj.total_gross_wgt
                            ? printObj.total_gross_wgt
                            : "-"}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "3px",
                            maxWidth: "120px",
                          }}
                        >
                          {printObj.total_stone_weight
                            ? printObj.total_stone_weight
                            : "-"}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "3px",
                            maxWidth: "120px",
                          }}
                        >
                          {printObj.total_net_wgt
                            ? printObj.total_net_wgt
                            : "-"}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
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
  return <MergePrint ref={ref} printObj={props.printObj} />;
});
