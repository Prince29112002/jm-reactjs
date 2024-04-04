import { Grid, Table, TableCell, TableHead } from "@material-ui/core";
import * as React from "react";
import { ToWords } from "to-words";

export class ProductionPrintComp extends React.PureComponent {
  componentDidMount() {}

  render() {
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
             @page { size: A4 landscape !important;margin:10px 25px 10px 25px; }\
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
                <h1>Production Lot Details</h1>
              </li>
            </ul>
          </li>

          <li className="d-block">
            <div className="tabel-deta-show">
              <div className="row">
                <div className="header-tabel-deta" style={{borderTop:"none", borderBottom:"none"}}>
                  <div style={{minWidth:"90px" ,display:"flex", padding:"3", alignItems:"center"}}>Stock Type</div>
                  <div style={{minWidth:"120px", display:"flex", padding:"3", alignItems:"center"}}> Stock Code</div>
                  <div style={{minWidth:"160px", display:"flex", padding:"3", alignItems:"center" }}> Category</div>
                  <div style={{display:"flex", padding:"3", alignItems:"center", textAlign:"center"}}> Purity</div>
                  <div style={{display:"flex", padding:"3", alignItems:"center", textAlign:"center"}}> QTY</div>
                  <div style={{minWidth:"90px", display:"flex", padding:"3", alignItems:"center", textAlign:"center"}}>Tree Weight</div>
                  <div style={{display:"flex", padding:"3", alignItems:"center", textAlign:"center"}}>Wax Weight</div>
                  <div style={{display:"flex", padding:"3", alignItems:"center", textAlign:"center"}}>Gross Weight</div>
                  <div style={{display:"flex", padding:"3", alignItems:"center", textAlign:"center"}}>Stone Weight</div>
                  <div style={{minWidth:"90px", display:"flex", padding:"3", alignItems:"center", textAlign:"center"}}>Net Weight</div>
                  <div style={{display:"flex", padding:"3", alignItems:"center", textAlign:"center"}}>Current Process</div>
                  <div style={{display:"flex", padding:"3", alignItems:"center", textAlign:"center"}}>Next Process</div>
                  <div style={{minWidth:"100px", display:"flex", padding:"3", alignItems:"center", textAlign:"center"}}>Worker Name</div>
                  {/* <div> Transit</div> */}
                </div>
              </div>
            </div>
          </li>

          <li className="d-block">
            <div className="tabel-deta-show">
              <div className="row">
                <div className="header-tabel-deta">

                  <div style={{minWidth:"90px", display:"flex", padding:"3", alignItems:"center"}}>
                    {printObj.stockType ? printObj.stockType : "-"}
                    </div>

                  <div style={{minWidth:"120px", display:"flex", padding:"3", alignItems:"center"}}>
                    {printObj.stock_name_code ? printObj.stock_name_code : "-"}
                  </div>

                  <div style={{minWidth:"160px", display:"flex", padding:"3", alignItems:"center", textAlign:"center"}}>
                    {printObj.category_name ? printObj.category_name : "-"}
                  </div>

                  <div style={{display:"flex", padding:"3", alignItems:"center", textAlign:"center"}}>
                     {printObj.purity ? printObj.purity : "-"} 
                     </div>

                  <div style={{display:"flex", padding:"3", alignItems:"center", textAlign:"center"}}>
                   {printObj.pcs !== "" ? printObj.pcs : "-"} 
                   </div>

                  <div style={{minWidth:"90px", display:"flex", padding:"3", alignItems:"center", textAlign:"center"}}>
                    {printObj.treeWeight !== null ? printObj.treeWeight : "-"}
                  </div>
                  {/* tree weight */}

                  <div style={{display:"flex", padding:"3", alignItems:"center", textAlign:"center"}}>
                    {printObj.waxWeight !== null ? printObj.waxWeight : "-"}
                  </div>
                  {/* wax weight  */}

                  <div style={{display:"flex", padding:"3", alignItems:"center"}}>
                    {printObj.gross_weight !== "" ? printObj.gross_weight : "-"}
                  </div>

                  <div style={{display:"flex", padding:"3", alignItems:"center"}}>
                    {printObj.other_weight !== "" ? printObj.other_weight : "-"}
                  </div>

                  <div style={{minWidth:"90px", display:"flex", padding:"3", alignItems:"center"}}> 
                    {printObj.net_weight !== "" ? printObj.net_weight : "-"}
                  </div>

                  <div style={{ display:"flex", padding:"3", alignItems:"center", textAlign:"center"}}>
                    {printObj.current_process ? printObj.current_process : "-"}
                  </div>

                  <div style={{ display:"flex", padding:"3", alignItems:"center", textAlign:"center"}}>
                    {printObj.next_process ? printObj.next_process : "-"}
                  </div>

                  <div style={{minWidth:"100px", display:"flex", padding:"3", alignItems:"center"}}>
                    {printObj.workerName ? printObj.workerName : "-"}</div>
                  {/* worker name */}

                  {/* <div>{printObj.transit ? printObj.transit : "-"}</div> */}
                </div>
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
  return <ProductionPrintComp ref={ref} printObj={props.printObj} />;
});
