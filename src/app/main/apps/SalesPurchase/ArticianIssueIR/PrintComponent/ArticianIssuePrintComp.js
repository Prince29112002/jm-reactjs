import * as React from "react";
import { ToWords } from "to-words";
import Config from "app/fuse-configs/Config";

export class ArticianIssuePrintComp extends React.PureComponent {
  componentDidMount() {}


  render() {
    // const { text } = this.props;
    const { printObj, isView, getDateAndTime } = this.props;
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
      const adminSignature = localStorage.getItem("adminSignature")
      console.log("adminSignature", adminSignature)

    return (
      <div className="relativeCSS main_print_blg_dv">
       <div style={{position:"absolute" , top:"13px", right:8}}>{getDateAndTime}</div>
        <div className="increase-padding-dv jewellery_main_print-blg">
          {/* Artisan Issue  */}
          <style type="text/css" media="print">
            {
              "\
                        @page { size: A5 landscape !important; margin:10px 25px 10px 25px; }\
                    "
            }
          </style>
          <ul className="jewellery_main_print_dv artisan_issue_printformate ">
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
                  <h1> Artician Issue Cum Delivery Voucher</h1>
                </li>
              </ul>
            </li>
            <li className="d-block">
              <ul className="jewellery_print_thard">
              <li className="d-block">
                   <span className="print-div-left-increase">
                       <p>Artican Party Details:</p>
                       <p><b> {printObj.supplierName} </b></p>
                       <p>{printObj.supAddress}</p>
                       <p>GSTIN/UIN : <span>{printObj.supplierGstUinNum} PAN No.{printObj.supPanNum}</span></p>
                       <p>{printObj.supState}-{printObj.supCountry}</p>
                       <p>State <span>:  {printObj.supState}, Code : {printObj.supStateCode}</span></p>
                       </span>
                </li>
                <li className="d-block">
                  <span>
                    <p>Voucher Num: <span>{printObj.purcVoucherNum}</span></p>
                    <p>Voucher Date : <span>{printObj.voucherDate}</span></p>
                    <p>Place of Supply : <span>{printObj.supState}</span></p>
                  </span>
                </li>
              </ul>
            </li>
            <li className="d-block">
              <div className="tabel-deta-show">
                <div className="row">
                  <div className="header-tabel-deta">
                    <div style={{ textAlign: "center" }}>Desrc.of goods</div>
                    <div>HSN/SAC</div>
                    <div>Gold Purity</div>
                    <div>Gross Wt</div>
                    <div>Net Wt</div>
                    <div>Fine Wt</div>
                    <div>Rate</div>
                    <div>Total Amount</div>

                    {/* <div>Total Amount</div> */}
                  </div>
                </div>
                <div className="row">
                  {printObj.orderDetails
                    .filter((row) =>
                      printObj.loadType === "1"
                        ? row.lotno !== ""
                        : row.stockCode !== ""
                    )
                    .map((element, index) => (
                      <div className="body-tabel-deta" key={index}>
                        {printObj.loadType === "0" ? (
                          <div border="1" style={{ textAlign: "center" }}>
                            {element.categoryName} ({element.stockCode.label}){" "}
                          </div>
                        ) : (
                          <div border="1" style={{ textAlign: "center" }}>
                            {element.categoryName}{" "}
                          </div>
                        )}
                        <div border="1">{element.HSNnum}</div>
                        <div border="1">{element.purity}</div>
                        <div border="1">{element.grossWeight}</div>
                        <div border="1">{element.netWeight}</div>
                        <div border="1">{element.fineGold}</div>
                        <div border="1">
                          {Config.numWithComma(element.rate)}
                        </div>
                        <div> {Config.numWithComma(element.amount)} </div>

                        {/* <div className="alignment-right-text">{element.totalAmount} </div> */}
                      </div>
                    ))}

                  <div className="body-tabel-deta">
                    <div border="1"> &nbsp;</div>
                    <div border="1"> &nbsp;</div>
                    <div border="1"> &nbsp;</div>
                    <div border="1"> &nbsp;</div>
                    <div border="1"> &nbsp;</div>
                    <div border="1"> &nbsp;</div>
                    <div border="1"> &nbsp;</div>
                    <div border="1"> &nbsp;</div>
                  </div>
                </div>
              </div>
            </li>
            <li className="d-block">
              <div className="tabel-deta-show tabel-deta-show_total">
                <div className="row">
                  <div className="body-tabel-deta">
                    <div>
                      <b className="print-div-left-increase">Total</b>
                    </div>
                    <div border="1"> &nbsp;</div>
                    <div>&nbsp;</div>
                    <div>{printObj.grossWtTOt}</div>
                    <div>{printObj.netWtTOt}</div>
                    <div>{printObj.fineWtTot}</div>
                    <div>&nbsp;</div>
                    <div>{Config.numWithComma(printObj.amount)}</div>

                    {/* <div className="alignment-right-text">{printObj.totalAmount}</div> */}
                  </div>
                </div>
              </div>
            </li>
            <li className="d-block">
              <div className="tabel-deta-show tabel-deta-show_total">
                <div className="row">
                  <div className="body-tabel-deta">
                    <div>&nbsp;</div>
                  </div>
                </div>
              </div>
            </li>
            <li className="d-block">
              <div className="tabel-deta-show tabel-naration_total">
                <div className="row">
                  <div className="body-tabel-deta">
                    <div>
                      Naration:
                      <span>
                        {printObj.accNarration}
                        <br />
                        {printObj.metalNarration}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li className="d-block">
              <div className="tabel-deta-show tabel-deta-show_total">
                <div className="row">
                  <div className="body-tabel-deta">
                    <div className="flex_balancep_payable">
                      <span className="print-div-left-increase">
                        Amount Chargeable (in words) :<br />
                        <span>
                          {" "}
                          {printObj.amount !== "" &&
                            !isNaN(printObj.amount) &&
                            toWords.convert(printObj.amount)}
                          {/* INR One Crore Forty Four Lakh One Thousand Six Hundred Only. */}
                        </span>
                      </span>
                      <span className="EOE_alignment"> E. & O.E</span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            {/* <li className="d-block">
                            <div className="tabel-deta-show tabel-deta-show_total" >
                                <div className="row">
                                    <div className="body-tabel-deta">
                                        <div>Tax Amount (in words) :  <span>  INR Four Lakh Nineteen Thousand Four Hundred Sixty Four and Eight paise Only.</span></div>
                                    </div>
                                </div>
                            </div>
                        </li> */}
            {/* <li className="d-block">
                            <div className="tabel-deta-show tabel-deta-show_total" >
                                <div className="row">
                                    <div className="body-tabel-deta">
                                        <div>Payment Details :  <span></span></div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li className="d-block">
                            <div className="tabel-deta-show tabel-balancep-payable" >
                                <div className="row">
                                    <div className="body-tabel-deta">
                                        <div className="flex_balancep_payable"><span>Balance Payable Rs : </span> <span> {printObj.totalAmount} </span></div>
                                    </div>
                                </div>
                            </div>
                        </li> */}
             <li className="d-block">
              <div className="tabel-deta-show multiple-tabel-blg">
                <div className="row" style={{ display: "flex", padding: 5 }}>
                  <div style={{ flex: "1 1 0" }}>
                    <span className="print-div-left-increase">
                      Receiver Signature :{" "}
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
                        {
                          isView ? printObj?.signature && (
                            <img
                              src={printObj?.signature}
                              alt="singnature"
                              style={{ maxHeight: 50 }}
                            />
                          ) : adminSignature && (
                            <img
                              src={adminSignature}
                              alt="singnature"
                              style={{ maxHeight: 50 }}
                            />
                          )
                        }
                      </div>
                    </div>
                    <span>Authorised Signature</span>
                  </div>
                  {/* <div className="body-tabel-deta">
                    <div className="flex_balancep_payable">
                      <span>For {siteSetData.company_name}</span>
                    </div>{" "}
                    <div className="flex_balancep_payable">
                      <span className="print-div-left-increase">
                        Receiver Signature :{" "}
                      </span>
                    </div>
                    <div className="flex_balancep_payable">
                      {printObj?.signature && (
                        <div>
                          <img src={printObj?.signature} alt="singnature" />
                        </div>
                      )}
                      <span>Authorised Signatory</span>
                    </div>
                  </div> */}
                </div>
              </div>
              </li>

          </ul>
          {/* Artisan Issue  */}
        </div>
      </div>
    );
  }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
  // eslint-disable-line max-len text={props.text}
  return <ArticianIssuePrintComp ref={ref} printObj={props.printObj} />;
});
