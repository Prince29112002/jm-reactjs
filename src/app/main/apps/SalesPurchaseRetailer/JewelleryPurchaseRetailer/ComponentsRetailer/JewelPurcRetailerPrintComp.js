import * as React from "react";
import { ToWords } from "to-words";
import Config from "app/fuse-configs/Config";
import HeaderPrint from "../../Helper/HeaderPrint";
import FooterPrint from "../../Helper/FooterPrint";
export class JewelPurcRetailerPrintComp extends React.PureComponent {
  componentDidMount() {}

  render() {
    const { printObj } = this.props;
    console.log(printObj);
    const toWords = new ToWords({
      localeCode: "en-IN",
      converterOptions: {
        currency: true,
        ignoreDecimal: false,
        ignoreZeroCurrency: false,
        doNotAddOnly: false,
      },
    });
    const myprofileData = localStorage.getItem("myprofile")
      ? JSON.parse(localStorage.getItem("myprofile"))
      : [];

    return (
      <>
        <div className="increase-padding-dv jewellery_main_print-blg" style={{ width: "805px", height: "530px" }}>
          {/* Metal_purchase */}
          <style type="text/css" media="print">
            {
              "\
            @page { size: A5 landscape !important; margin:10px 25px 10px 25px; }          "
            }
          </style>
          <ul>
          <HeaderPrint myprofileData={myprofileData}/>
            <div className="add-client-row"></div>
            <div style={{ margin: "5px", height: "290px"}}>
              <div style={{ width: "100%" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <h6>Jewellery Purchase</h6>
                    <h6>To,</h6>
                    <h6>{printObj.supplierName}</h6>
                  </div>
                  <div>
                    <h6>TAX INVOICE</h6>                  </div>
                  <div>
                  {
                      myprofileData.gst_number_flag && <h6>
                      GSTIN :{" "}
                      {myprofileData.gst_number ? myprofileData.gst_number : "-"}
                    </h6>
                    }
                    <h6>Voucher No.: {printObj.purcVoucherNum}</h6>
                    <h6>Date: {printObj.voucherDate}</h6>
                  </div>
                </div>
              </div>
              <li className="d-block">
                <div className="tabel-deta-show">
                  <div className="row">
                    <div className="header-tabel-deta">
                      <div style={{ maxWidth: "50px" }}>
                        {" "}
                        <b> NO </b>
                      </div>
                      {/* <div>
                        {" "}
                        <b> Barcode</b>
                      </div> */}
                      <div style={{ minWidth: "210px"}}>
                        {" "}
                        <b> Category</b>
                      </div>
                      <div style={{ maxWidth: "70px" }}>
                        {" "}
                        <b> HSN </b>
                      </div>
                      <div style={{ maxWidth: "50px", justifyContent: "end" }}>
                        {" "}
                        <b style={{ marginRight: "5px" }}> PCS </b>
                      </div>
                      <div>
                        {" "}
                        <b style={{ marginRight: "5px" }}> GWT </b>
                      </div>
                      <div>
                        {" "}
                        <b style={{ marginRight: "5px" }}> NWT </b>
                      </div>
                      <div style={{ maxWidth: "45px" }}>
                        {" "}
                        <b style={{ marginRight: "5px" }}> Purity </b>
                      </div>
                      <div>
                        {" "}
                        <b style={{ marginRight: "5px" }}> Fine </b>
                      </div>
                      <div style={{ minWidth: "120px" }}>
                        {" "}
                        <b style={{ marginRight: "5px" }}> Amount </b>
                      </div>
                    </div>
                  </div>

                  {printObj.orderDetails.filter((i)=> i.Barcode)
                  .map((row, index) => (
                    <div className="row" key={index}>
                      <div className="body-tabel-deta">
                        <div
                          border="1"
                          style={{ maxWidth: "50px", justifyContent: "center", fontWeight:"500"}}
                        >
                          {index + 1}
                        </div>
                        {/* <div border="1">{row.Barcode}</div> */}
                        <div border="1" style={{fontWeight:"500",minWidth: "210px"}}>{row.Category.label ? row.Category.label : row.Category}</div>
                        <div border="1" style={{fontWeight:"500",maxWidth: "70px"}}>{row.HSNNum}</div>
                        <div
                          border="1"
                          style={{ maxWidth: "50px", justifyContent: "end", fontWeight:"500"}}
                        >
                          <span style={{ marginRight: "5px" }}>
                            {row.Pieces}
                          </span>
                        </div>
                        <div border="1" style={{ justifyContent: "end", fontWeight:"500"}}>
                          <span style={{ marginRight: "5px"}}>
                            {parseFloat(row.grossWeight).toFixed(3)}
                          </span>
                        </div>
                        <div border="1" style={{ justifyContent: "end", fontWeight:"500"}}>
                          <span style={{ marginRight: "5px"}}>
                            {parseFloat(row.netWeight).toFixed(3)}
                          </span>
                        </div>
                        <div border="1" style={{ justifyContent: "end", fontWeight:"500",maxWidth: "45px"}}>
                          <span style={{ marginRight: "5px"}}>
                            {row.purity}
                          </span>
                        </div>
                        <div border="1" style={{ justifyContent: "end", fontWeight:"500"}}>
                          <span style={{ marginRight: "5px" }}>{parseFloat(row.fine).toFixed(2)}</span>
                        </div>
                        <div
                          border="1"
                          style={{ minWidth: "120px", justifyContent: "end", fontWeight:"500"}}
                        >
                          <span style={{ marginRight: "5px"}}>
                            {Config.numWithComma(row.totalAmount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="row">
                    {/* <div className="body-tabel-deta body-tabel-deta-bdr">
                      <div border="1"> &nbsp;</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1"> &nbsp;</div>
                    </div> */}
                    <div className="body-tabel-deta body-tabel-deta-bdr">
                      <div border="1" style={{ maxWidth: "50px" }}>
                        {" "}
                        &nbsp;
                      </div>
                      {/* <div border="1"> &nbsp;</div> */}
                      <div border="1" style={{ minWidth: "210px" }}> &nbsp;</div>
                      <div border="1" style={{ maxWidth: "70px" }}> &nbsp;</div>
                      <div border="1" style={{ maxWidth: "50px" }}>
                        {" "}
                        &nbsp;
                      </div>
                      <div border="1"> &nbsp;</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1" style={{ maxWidth: "45px" }}> &nbsp;</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1" style={{ minWidth: "120px" }}>
                        {" "}
                        &nbsp;
                      </div>
                    </div>

                    {/* {printObj.iGstTot === "" ||
                      printObj.iGstTot == 0 ||
                      isNaN(printObj.iGstTot) ? (
                      <div className="body-tabel-deta body-tabel-deta-bdr">
                        <div> &nbsp;</div>
                        <div> &nbsp;</div>
                        <div className="retailer-print"> <b>SubTotal</b></div>
                        <div> &nbsp;</div>
                        <div> &nbsp;</div>
                        <div> &nbsp;</div>
                        <div> &nbsp;</div>
                        <div> &nbsp;</div>
                        <div> &nbsp;</div>
                        <div> {printObj.iGstTot}</div>

                      </div>
                    ) : (
                      ""
                    )} */}
                    {printObj.iGstTot === "" ||
                    printObj.iGstTot == 0 ||
                    isNaN(printObj.iGstTot) ? (
                      <>
                        <div className="body-tabel-deta body-tabel-deta-bdr">
                          <div style={{ maxWidth: "50px" }}> &nbsp;</div>
                          {/* <div> &nbsp;</div> */}
                          <div className="retailer-print" style={{ minWidth: "210px" }}>Add CGST</div>
                          <div style={{ maxWidth: "70px" }}> &nbsp;</div>
                          <div style={{ maxWidth: "50px" }}> &nbsp;</div>
                          <div> &nbsp;</div>
                          <div> &nbsp;</div>
                          <div style={{ maxWidth: "45px" }}> &nbsp;</div>
                          <div> &nbsp;</div>
                          <div
                            style={{ minWidth: "120px", justifyContent: "end" }}
                          >
                            <span style={{ marginRight: "5px" }}>
                              {Config.numWithComma(printObj.cGstTot)}
                            </span>
                          </div>
                        </div>
                        <div className="body-tabel-deta body-tabel-deta-bdr">
                          <div style={{ maxWidth: "50px" }}> &nbsp;</div>
                          {/* <div> &nbsp;</div> */}
                          <div className="retailer-print" style={{ minWidth: "210px" }}>Add SGST</div>
                          <div style={{ maxWidth: "70px" }}> &nbsp;</div>
                          <div style={{ maxWidth: "50px" }}> &nbsp;</div>
                          <div> &nbsp;</div>
                          <div> &nbsp;</div>
                          <div style={{ maxWidth: "45px" }}> &nbsp;</div>
                          <div> &nbsp;</div>
                          <div
                            style={{ minWidth: "120px", justifyContent: "end" }}
                          >
                            <span style={{ marginRight: "5px" }}>
                              {Config.numWithComma(printObj.sGstTot)}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="body-tabel-deta body-tabel-deta-bdr">
                        <div style={{ maxWidth: "50px" }}> &nbsp;</div>
                        {/* <div> &nbsp;</div> */}
                        <div className="retailer-print" style={{ minWidth: "210px" }}>Add IGST</div>
                        <div style={{ maxWidth: "70px" }}> &nbsp;</div>
                        <div style={{ maxWidth: "50px" }}> &nbsp;</div>
                        <div> &nbsp;</div>
                        <div> &nbsp;</div>
                        <div style={{ maxWidth: "45px" }}> &nbsp;</div>
                        <div> &nbsp;</div>
                        <div
                          style={{ minWidth: "120px", justifyContent: "end" }}
                        >
                          <span style={{ marginRight: "5px" }}>
                            {Config.numWithComma(printObj.iGstTot)}
                          </span>
                        </div>
                      </div>
                    )}
                    {/* <div className="body-tabel-deta body-tabel-deta-bdr">
                      <div style={{maxWidth:"50px"}}> &nbsp;</div>
                      <div> &nbsp;</div>
                      <div> &nbsp;</div>
                      <div> &nbsp;</div>
                      <div> &nbsp;</div>
                      <div> &nbsp;</div>
                      <div> &nbsp;</div>
                      <div> &nbsp;</div>
                      <div> &nbsp;</div>
                      <div style={{minWidth:"130px"}}>&nbsp;</div>
                    </div> */}
                    <div className="body-tabel-deta body-tabel-deta-bdr">
                      <div style={{ maxWidth: "50px" }}> &nbsp;</div>
                      {/* <div> &nbsp;</div> */}
                      <div className="retailer-print" style={{ minWidth: "210px" }}>Round Off</div>
                      <div style={{ maxWidth: "70px" }}> &nbsp;</div>
                      <div style={{ maxWidth: "50px" }}> &nbsp;</div>
                      <div> &nbsp;</div>
                      <div> &nbsp;</div>
                      <div style={{ maxWidth: "45px" }}> &nbsp;</div>
                      <div> &nbsp;</div>
                      <div style={{ minWidth: "120px", justifyContent: "end" }}>
                        <span style={{ marginRight: "5px" }}>
                          {printObj.roundOff}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="d-block">
                <div className="tabel-deta-show tabel-deta-show_total totallast_col mb-3">
                  <div className="row">
                    <div className="body-tabel-deta">
                      <div style={{ maxWidth: "50px" }}></div>
                      {/* <div></div> */}
                      <div className="retailer-print" style={{ minWidth: "210px" }}>Total</div>
                      <div style={{ maxWidth: "70px" }}></div>
                      <div style={{ maxWidth: "50px", justifyContent: "end" }}>
                        <span style={{ marginRight: "5px" }}>
                          {printObj.pcsTotal}
                        </span>
                      </div>
                      <div style={{ justifyContent: "end" }}>
                        <span style={{ marginRight: "5px" }}>
                          {parseFloat(printObj.grossWtTOt).toFixed(3)}
                        </span>
                      </div>
                      <div style={{ justifyContent: "end" }}>
                        <span style={{ marginRight: "5px" }}>
                          {parseFloat(printObj.netWtTOt).toFixed(3)}
                        </span>
                      </div>
                      <div style={{ maxWidth: "45px" }}></div>
                      <div style={{ justifyContent: "end" }}>
                        <span style={{ marginRight: "5px" }}>
                          
                        </span>
                      </div>
                      <div style={{ minWidth: "120px", justifyContent: "end" }}>
                        <span style={{ marginRight: "5px" }}>
                          {Config.numWithComma(printObj.totalInvoiceAmt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              </div>
              <div style={{ margin: "5px", height: "40px" }}>
              {/* <div
                style={{
                  width: "100%",
                  border: "1px solid black",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
            
                <div
                  style={{
                    display: "flex",
                    width: "50%",
                    justifyContent: "space-around",
                  }}
                >
                  <div>
                    <h6></h6>
                    <h6></h6>
                    <h6></h6>
                  </div>
                  <div>
                    <h5></h5>
                    <h5></h5>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    width: "50%",
                    justifyContent: "space-between",
                    marginRight:"5px"
                  }}
                >
                  <div>
                    <h6 style={{ borderBottom: "1px solid black" }}>
                    Total Received
                    </h6>
                    <h6>Cash:</h6>
                    <h6>Cheque/Bank:</h6>
                    <h6>Card Details:</h6>
                  </div>
                  <div>
                    <h6>&nbsp;</h6>
                    <h6>{Config.numWithComma(printObj.totalInvoiceAmt)}</h6>
                    <h6></h6>
                    <h6></h6>
                  </div>
                </div>
              </div> */}
             
              <li className="d-block" style={{borderTop:"1px solid black"}}>
                <div className="tabel-deta-show tabel-deta-show_total">
                  <div className="row">
                    <div className="body-tabel-deta">
                      <div className="flex_balancep_payable">
                        <span className="print-div-left-increase">
                          Amount Chargeable (in words) :<br />
                          <span>
                            {printObj.totalInvoiceAmt !== "" &&
                              !isNaN(printObj.totalInvoiceAmt) &&
                              toWords.convert(printObj.totalInvoiceAmt)}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              </div>

              {/* <li className="d-block mt-10">
                <div className="tabel-deta-show multiple-tabel-blg">
                  <div className="row">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ borderTop: "1px solid black" }}>
                        Customer Sign.
                      </span>
                      <span
                        style={{
                          borderTop: "1px solid black",
                          width: "130px",
                          textAlign: "center",
                        }}
                      >
                        For, {myprofileData.firm_name}
                      </span>
                    </div>
                  </div>
                </div>
              </li> */}
            <div className="add-client-row"></div>
            <FooterPrint myprofileData={myprofileData}/>
          </ul>
        </div>
      </>
    );
  }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
  // eslint-disable-line max-len text={props.text}
  return <JewelPurcRetailerPrintComp ref={ref} printObj={props.printObj} />;
});
