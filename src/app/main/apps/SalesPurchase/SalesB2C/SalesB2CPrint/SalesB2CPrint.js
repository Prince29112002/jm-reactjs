import * as React from "react";
import { ToWords } from "to-words";
import Config from "app/fuse-configs/Config";

export class SalesB2CPrint extends React.PureComponent {

  componentDidMount() {
    // console.log("componentDidMount", this.props)
  }

  // setRef = (ref) => (this.canvasEl = ref);

  render() {
    // const { text } = this.props;
    const { printObj, isView,getDateAndTime } = this.props;
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
      const adminSignature = localStorage.getItem("adminSignature")
      console.log(adminSignature);

    return (
      <div className="relativeCSS main_print_blg_dv" style={{paddingTop: 35}}>
      <div style={{position:"absolute" , top:"13px", right:8}}>{getDateAndTime}</div>
        <div className="increase-padding-dv jewellery_main_print-blg">
          {/* secand_jewellery_main_print */}
          <style type="text/css" media="print">
            {
              "\
                        @page { size: A5 landscape !important; margin:10px 25px 10px 25px;; }\
                    "
            }
          </style>
          <ul className="jewellery_main_print_dv">
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
                    GST No:{siteSetData.gst_number} PAN:{siteSetData.pan_number} CIN:{siteSetData.cin_number}
                  </p>
                </li>
              </ul>
            </li>
            <li className="d-block">
              <ul className="jewellery_print_secand">
                <li className="d-block">
                  <h1>Sales B2C Voucher</h1>
                </li>
              </ul>
            </li>
            <li className="d-block">
              <ul className="jewellery_print_thard">
                <li className="d-block">
                  <span className="print-div-left-increase">
                    <p>Supplier Party Details:</p>
                    <p>
                      <b> {printObj.supplierName} </b>
                    </p>
                    <p>{printObj.supAddress}</p>
                    <p>
                      Gov. Proof :{" "}
                      <span>
                        {printObj.supplierGstUinNum} Proof Id.{printObj.supPanNum}
                      </span>
                    </p>
                    <p>
                      {printObj.supState}-{printObj.supCountry}
                    </p>
                    <p>
                      State{" "}
                      <span>
                        : {printObj.supState}, Code : {printObj.supStateCode}
                      </span>
                    </p>
                  </span>
                </li>
                <li className="d-block">
                  <span>
                    <p>
                      Voucher Num. : <span>{printObj.purcVoucherNum}</span>{" "}
                    </p>
                    <p>
                      Party Inv. Num. : <span>{printObj.partyInvNum}</span>
                    </p>
                    <p>
                      Voucher Date : <span>{printObj.voucherDate}</span>
                    </p>
                    <p>
                      Place of Supply : <span>{printObj.supState}</span>
                    </p>
                  </span>
                </li>
              </ul>
            </li>
            <li className="d-block">
              <div className="tabel-deta-show">
                <div className="row">
                  <div className="header-tabel-deta">
                    <div style={{ textAlign: "center" }}>
                    BarCode
                    </div>
                    <div style={{ textAlign: "center" }}>
                    Billing Category
                    </div>
                    <div>HSN/SAC</div>
                    <div>HUID</div>
                    <div>Purity</div>
                    <div>Pieces</div>
                    <div>Gross Wt</div>
                    <div>Net Wt</div>
                    <div>Rate</div>
                    <div>Total Amount</div>
                  </div>
                </div>
  
                {printObj.orderDetails
                     .filter((element) => element.barcode !== "")
                    .map((row, index) => (
                      <div className="row" key={index}>
                        <div className="body-tabel-deta">
                          <div border="1" style={{ textAlign: "center" }}>
                            {row.barcode}
                          </div>
                          <div border="1" style={{ textAlign: "center" }}>
                            {row.billing_category_name}
                          </div>
                          <div border="1">{row.hsn}</div>
                          <div border="1">{row.huid}</div>
                          <div border="1">{row.purity}</div>
                          <div border="1">{row.pcs}</div>
                          <div border="1">
                            {parseFloat(row.gross_wgt).toFixed(3)}
                          </div>
                          <div border="1">
                            {parseFloat(row.net_wgt).toFixed(3)}
                          </div>
                          <div border="1">
                            {Config.numWithComma(row.rate)}
                          </div>
                          <div border="1" className=" alignment-right-text">
                            {Config.numWithComma(row.total_amount)}{" "}
                          </div>
                        </div>
                      </div>
                    ))}
                <div className="row">
                  <div className="body-tabel-deta body-tabel-deta-bdr">
                    <div border="1"> &nbsp;</div>
                    <div border="1"> &nbsp;</div>
                    <div border="1"> &nbsp;</div>
                    <div border="1"> &nbsp;</div>
                    <div border="1"> &nbsp;</div>
                    <div border="1"> &nbsp;</div>
                    <div border="1"> &nbsp;</div>
                    <div border="1"> &nbsp;</div>
                    <div border="1" className="text-left-dv-blg">
                      Taxable Amount{" "}
                    </div>
                    <div border="1" className=" alignment-right-text">
                      {Config.numWithComma(printObj.taxableAmount)}
                    </div>
                  </div>
                  <div className="body-tabel-deta body-tabel-deta-bdr">
                    <div border="1"> &nbsp;</div>
                    <div border="1"> &nbsp;</div>
                    <div border="1"> &nbsp;</div>
                    <div border="1"> &nbsp;</div>
                    <div border="1"> &nbsp;</div>
                    <div border="1"> &nbsp;</div>
                    <div border="1"> &nbsp;</div>
                    <div border="1"> &nbsp;</div>
                    {/* <div border="1" className="text-left-dv-blg">IGST</div>
                                        <div border="1" className=" alignment-right-text">5,598.81</div> */}
                    {printObj.stateId === 12 ? (
                      <div border="1" className="text-left-dv-blg">
                        SGST
                      </div>
                    ) : (
                      <div border="1" className="text-left-dv-blg">
                        IGST
                      </div>
                    )}
                    <div border="1" className=" alignment-right-text">
                      {" "}
                      {printObj.stateId === 12
                        ? Config.numWithComma(printObj.sGstTot)
                        : Config.numWithComma(printObj.iGstTot)}{" "}
                    </div>
                  </div>
                  {printObj.stateId === 12 && (
                    <div className="body-tabel-deta body-tabel-deta-bdr">
                      <div border="1"> &nbsp;</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1"> &nbsp;</div>
                      <div className="text-left-dv-blg">CGST</div>
                      <div className=" alignment-right-text">
                        {" "}
                        {Config.numWithComma(printObj.cGstTot)}{" "}
                      </div>
                    </div>
                  )}
                  <div className="body-tabel-deta body-tabel-deta-bdr">
                    <div border="1"> &nbsp;</div>
                    <div> &nbsp;</div>
                    <div> &nbsp;</div>
                    <div> &nbsp;</div>
                    <div> &nbsp;</div>
                    <div> &nbsp;</div>
                    <div> &nbsp;</div>
                    <div> &nbsp;</div>
                    <div className="text-left-dv-blg">Round Off</div>
                    <div className=" alignment-right-text">
                      {printObj.roundOff === "" ? 0 : printObj.roundOff}
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li className="d-block">
              <div className="tabel-deta-show tabel-deta-show_total totallast_col">
                <div className="row">
                  <div className="body-tabel-deta">
                    <div>
                      <b className="print-div-left-increase">Total</b>
                    </div>
                    <div border="1"> &nbsp;</div>
                    <div>&nbsp;</div>
                    <div>&nbsp;</div>
                    <div>&nbsp;</div>
                    <div>&nbsp;</div>
                    <div>{printObj.grossWtTOt}</div>
                    <div>{printObj.netWtTOt}</div>
                    <div className="text-left-dv-blg">
                      <b>Total Invoice Amount</b>
                      <span></span>
                    </div>
                    {/* <div className="bdr_remove_blg">&nbsp;</div> */}
                    <div className=" alignment-right-text">
                      {" "}
                      {Config.numWithComma(printObj.totalInvoiceAmt)}{" "}
                    </div>
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
                        {printObj.jewelNarration}
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
                          {printObj.balancePayable !== "" &&
                            !isNaN(printObj.balancePayable) &&
                            toWords.convert(printObj.balancePayable)}
                        </span>
                      </span>
                      <span className="EOE_alignment"> E. & O.E</span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            {(printObj.is_tds_tcs == "1" || printObj.is_tds_tcs == "2") && (
              <li className="d-block">
                <div className="tabel-deta-show tabel-deta-show_total">
                  <div className="row">
                    <div className="body-tabel-deta">
                      <div>
                        {" "}
                        <span className="print-div-left-increase">
                          {" "}
                          Tax Amount (in words) :{" "}
                        </span>{" "}
                        <span className="ml-2 ">
                          {printObj.taxAmount !== "" &&
                            !isNaN(printObj.taxAmount) &&
                            toWords.convert(Math.round(printObj.taxAmount))}
                          .
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            )}
            <li className="d-block">
              <div className="tabel-deta-show tabel-balancep-payable">
                <div className="row">
                  <div className="body-tabel-deta">
                    <div className="flex_balancep_payable">
                      <span className="print-div-left-increase">
                        <b>Balance Payable Rs :</b>{" "}
                      </span>
                      <span className="mr-20">
                        {" "}
                        {Config.numWithComma(printObj.balancePayable)}{" "}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
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
                      {console.log(siteSetData?.stamp)}
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
                </div>
              </div>
            </li>
          </ul>
          {/* secand_jewellery_main_print */}
        </div>
      </div>
    );
  }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
  // eslint-disable-line max-len text={props.text}
  return <SalesB2CPrint ref={ref} printObj={props.printObj} />;
});
