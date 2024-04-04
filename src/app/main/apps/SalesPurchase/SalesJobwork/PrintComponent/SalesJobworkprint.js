import * as React from "react";
import { ToWords } from "to-words";
import Config from "app/fuse-configs/Config";

// import image from "../../test_image.png";
export class SalesJobworkprint extends React.PureComponent {
  // constructor(props) {
  //   super(props);
  // }
  // canvasEl;

  componentDidMount() {
    // console.log("componentDidMount", this.props)
  }

  // setRef = (ref) => (this.canvasEl = ref);

  render() {
    // const { text } = this.props;
    const { printObj, isView, getDateAndTime } = this.props;
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
          {/* Metal_purchase */}
          <style type="text/css" media="print">
            {
              "\
             @page { size: A5 landscape !important; margin:10px 25px 10px 25px; }\
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
                    GST No:{siteSetData.gst_number} PAN:{siteSetData.pan_number} CIN:{siteSetData.cin_number}
                  </p>
                </li>
              </ul>
            </li>
            <li className="d-block">
              <ul className="jewellery_print_secand">
                <li className="d-block">
                  <h1>Sales Jobwork Voucher</h1>
                </li>
              </ul>
            </li>
            <li className="d-block">
              <ul className="jewellery_print_thard">
                <li className="d-block">
                  <span className="print-div-left-increase">
                    <p>Supplier Party Details</p>
                    <p>
                      <b> {printObj.supplierName} </b>
                    </p>
                    <p>{printObj.supAddress}</p>
                    <p>
                      <span>
                        {printObj.supplierGstUinNum ? "GSTIN/UIN :" : ""}{" "}
                        {printObj.supplierGstUinNum} PAN No.{printObj.supPanNum}
                      </span>
                    </p>
                    <p>
                      {printObj.supState}-{printObj.supCountry}
                      &nbsp;&nbsp; State{" "}
                      <span>
                        : {printObj.supState},{" "}
                        {printObj.supplierGstUinNum ? "Code :" : ""}{" "}
                        {printObj.supStateCode}
                      </span>
                    </p>
                  </span>
                </li>
                <li className="d-block">
                  <span className="print-div-left-increase">
                    <p>
                      {" "}
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
                    <div>Desc. of Goods</div>
                    <div>HSN/SAC</div>
                    <div>Purity</div>
                    <div>Pcs</div>
                    <div>Gross Wt</div>
                    <div>Net Wt</div>
                    <div>Rate</div>
                    <div>Total Amount</div>
                  </div>
                </div>

                {(printObj.loadType === "1" ||
                  printObj.loadType === "2" ||
                  printObj.loadType === "3") &&
                  printObj.orderDetails
                    .filter((element) =>
                      printObj.loadType === "3"
                        ? element.lotno !== ""
                        : element.category !== ""
                    )
                    .map((row, index) => (
                      <div className="row" key={index}>
                        <div className="body-tabel-deta">
                          <div border="1" style={{ textAlign: "center" }}>
                            {printObj.loadType === "3"
                              ? row.billingCategory.label
                              : row.billingCategory}{" "}
                            {printObj.loadType !== "3" &&
                              "(" + row.category.label + ")"}
                          </div>
                          <div border="1">
                            {row.HSNNum ? row.HSNNum : row.hsn_number}
                          </div>
                          <div border="1">{row.purity}</div>
                          <div border="1">
                            {row.pieces ? row.pieces : row.pcs}
                          </div>
                          <div border="1">
                            {row.grossWeight ? row.grossWeight : row.gross_wgt}
                          </div>
                          <div border="1">
                            {row.netWeight ? row.netWeight : row.net_wgt}
                          </div>
                          <div border="1">
                            {row.billingLabourRateperGram
                              ? Config.numWithComma(
                                  row.billingLabourRateperGram
                                )
                              : Config.numWithComma(row.labourRate)}{" "}
                          </div>
                          <div border="1" className="alignment-right-text">
                            {row.amount
                              ? Config.numWithComma(row.amount)
                              : Config.numWithComma(row.totalAmount)}{" "}
                          </div>
                        </div>
                      </div>
                    ))}

                {printObj.loadType === "0" &&
                  printObj.orderDetails
                    .filter((element) => element.category !== "")
                    .map((row, index) => (
                      <div className="row" key={index}>
                        <div className="body-tabel-deta">
                          <div border="1">{row.billing_category_name}</div>
                          <div border="1">{row.hsn_number}</div>
                          <div border="1">{row.purity}</div>
                          <div border="1">{row.pcs}</div>
                          <div border="1">
                            {parseFloat(row.gross_wgt).toFixed(3)}
                          </div>
                          <div border="1">
                            {parseFloat(row.net_wgt).toFixed(3)}
                          </div>
                          <div border="1">
                            {Config.numWithComma(row.labourRate)}
                          </div>
                          <div border="1" className=" alignment-right-text">
                            {Config.numWithComma(row.totalAmount)}{" "}
                          </div>
                        </div>
                      </div>
                    ))}
                {/* <div className="row">
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
                </div> */}

                <div className="row">
                  <div className="body-tabel-deta body-tabel-deta-bdr">
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
                      {" "}
                      {Config.numWithComma(printObj.taxableAmount)}{" "}
                    </div>
                  </div>
                  <div className="body-tabel-deta body-tabel-deta-bdr">
                    <div border="1"> &nbsp;</div>
                    <div border="1"> &nbsp;</div>
                    <div border="1"> &nbsp;</div>
                    <div border="1"> &nbsp;</div>
                    <div border="1"> &nbsp;</div>
                    <div border="1"> &nbsp;</div>
                    {/* <div border="1" className="text-left-dv-blg">SGST</div>
                    <div border="1" className=" alignment-right-text">  209,732.04 </div> */}
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
                      <div> &nbsp;</div>
                      <div> &nbsp;</div>
                      <div> &nbsp;</div>
                      <div> &nbsp;</div>
                      <div> &nbsp;</div>
                      <div> &nbsp;</div>
                      {/* <div>CGST</div>
                      <div> {printObj.cGstTot} </div> */}
                      <div className="text-left-dv-blg">CGST</div>
                      <div className=" alignment-right-text">
                        {" "}
                        {Config.numWithComma(printObj.cGstTot)}{" "}
                      </div>
                    </div>
                  )}

                  <div className="body-tabel-deta body-tabel-deta-bdr">
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
                    <div>&nbsp;</div>
                    <div>&nbsp;</div>
                    <div>{printObj.pcsTot}</div>
                    <div>{printObj.grossWtTOt}</div>
                    <div>{printObj.netWtTOt}</div>
                    <div className="text-left-dv-blg">
                      <b>Total Inv. Amt. </b>
                    </div>
                    <div className=" alignment-right-text">
                      {" "}
                      {Config.numWithComma(printObj.totalInvoiceAmt)}{" "}
                    </div>
                  </div>
                </div>
              </div>
            </li>
            {/* <li className="d-block">
              <div className="tabel-deta-show tabel-deta-show_total" >
                <div className="row">
                  <div className="body-tabel-deta">
                    <div>&nbsp;</div>

                  </div>
                </div>
              </div>
            </li> */}
            {/* TCS */}
            {/* {printObj.is_tds_tcs === "1" &&
              <>
                <li className="d-block">
                  <div className="tabel-deta-show tabel-deta-show_total" >
                    <div className="row">
                      <div className="body-tabel-deta">
                        <div>TCS Credited: <span></span></div>
                      </div>
                    </div>
                  </div>
                </li>
                <li className="d-block">
                  <div className="tabel-deta-show tabel-deta-show_total" >
                    <div className="row">
                      <div className="body-tabel-deta">
                        <div>TCS Voucher Num: {printObj.TDSTCSVoucherNum}	<span></span></div>
                      </div>
                    </div>
                  </div>
                </li>
              </>
            } */}

            {/* TDS */}
            {/* {printObj.is_tds_tcs === "2" &&
              <>
                <li className="d-block">
                  <div className="tabel-deta-show tabel-deta-show_total" >
                    <div className="row">
                      <div className="body-tabel-deta">
                        <div>TDS Deductable: <span></span></div>
                      </div>
                    </div>
                  </div>
                </li>
                <li className="d-block">
                  <div className="tabel-deta-show tabel-deta-show_total" >
                    <div className="row">
                      <div className="body-tabel-deta">
                        <div>TDS Voucher Num: {printObj.TDSTCSVoucherNum}	<span></span></div>
                      </div>
                    </div>
                  </div>
                </li>
              </>
            } */}

            {(printObj.is_tds_tcs == "1" || printObj.is_tds_tcs == "2") && (
              <li className="d-block">
                <div className="tabel-deta-show tabel-deta-show_total">
                  <div className="row">
                    <div className="body-tabel-deta">
                      <div className="flex_balancep_payable">
                        <span className="print-div-left-increase">
                          <b>{printObj.ledgerName}</b>
                        </span>{" "}
                        <span style={{ marginRight: "30px" }}>
                          {" "}
                          {Config.numWithComma(printObj.taxAmount)}{" "}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            )}

            {/* <li className="d-block">
              <div className="tabel-deta-show tabel-deta-show_total" >
                <div className="row">
                  <div className="body-tabel-deta">
                    <div>&nbsp;</div>
                    // <div>&nbsp;</div>
                    // <div>&nbsp;</div>
                    // <div>&nbsp;</div>
                    // <div>&nbsp;</div>
                    // <div>&nbsp;</div>
                    // <div>&nbsp;</div>
                    // <div>&nbsp;</div>
                  </div>
                </div>
              </div>
            </li> */}
            <li className="d-block">
              <div className="tabel-deta-show tabel-naration_total">
                <div className="row">
                  <div className="body-tabel-deta">
                    <div>
                      {" "}
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

            {(printObj.iGstTot !=="" || printObj.sGstTot !== "" || printObj.cGstTot !== "") && (
              <li className="d-block">
                <div className="tabel-deta-show tabel-deta-show_total">
                  <div className="row">
                    <div className="body-tabel-deta">
                      <div>
                        <span className="print-div-left-increase">
                          Tax Amount (in words) :
                        </span>{" "}
                        <span>
                          {" "}
                          {printObj?.iGstTot === "" ||
                            // printObj?.iGstTot == 0 ||
                            isNaN(printObj?.iGstTot) ? (
                            toWords.convert((parseFloat(printObj?.sGstTot) + parseFloat(printObj?.cGstTot)))
                          ) : (
                            toWords.convert((parseFloat(printObj?.iGstTot)))
                            
                            
                          )}
                          {/* INR Four Lakh Nineteen Thousand Four Hundred Sixty Four and Eight paise Only. */}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            )}

            {/* <li className="d-block">
              <div className="tabel-deta-show tabel-deta-show_total" >
                <div className="row">
                  <div className="body-tabel-deta">
                    <div>Payment Details :  <span></span></div>
                  </div>
                </div>
              </div>
          </li>*/}
            <li className="d-block">
              <div className="tabel-deta-show tabel-balancep-payable">
                <div className="row">
                  <div className="body-tabel-deta">
                    <div className="flex_balancep_payable">
                      <span className="print-div-left-increase">
                        <b>Balance Payable Rs :</b>{" "}
                      </span>{" "}
                      <span style={{ marginRight: "30px" }}>
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
          {/* Metal_purchase */}
        </div>
      </div>
    );
  }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
  // eslint-disable-line max-len text={props.text}
  return <SalesJobworkprint ref={ref} printObj={props.printObj} />;
});