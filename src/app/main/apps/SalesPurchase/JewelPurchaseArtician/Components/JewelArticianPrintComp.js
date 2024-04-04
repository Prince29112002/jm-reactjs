import * as React from "react";
import { ToWords } from 'to-words';
// import image from "../../test_image.png";
import Config from "app/fuse-configs/Config";

export class JewelArticianPrintComp extends React.PureComponent {
    // constructor(props) {
    //     super(props);
    // }
    // canvasEl;
    componentDidMount() {
        // console.log("componentDidMount", this.props)
    }
    // setRef = (ref) => (this.canvasEl = ref);

    render() {
        // const { text } = this.props;
        const { printObj, isView, getDateAndTime} = this.props;
        console.log(printObj, isView)
        const toWords = new ToWords({
            localeCode: 'en-IN',
            converterOptions: {
                currency: true,
                ignoreDecimal: false,
                ignoreZeroCurrency: false,
                doNotAddOnly: false,
            }
        });
        const siteSetData = localStorage.getItem("siteSetting")
            ? JSON.parse(localStorage.getItem("siteSetting"))
            : [];
        const adminSignature = localStorage.getItem("adminSignature")
        console.log("adminSignature", adminSignature)
        return (

            <div className="relativeCSS main_print_blg_dv" style={{paddingTop: 35}}>
            <div style={{position:"absolute" , top:"13px", right:8}}>{getDateAndTime}</div>
                <div className="increase-padding-dv jewellery_main_print-blg">
                    {/* Jewellery Purchase Artican Receive print Voucher */}
                    <style type="text/css" media="print">
                        {"\
                    @page { size: A5 landscape !important; margin:10px 25px 10px 25px; }\                      "}
                    </style>
                    <ul className="jewellery_main_print_dv jewellery_purchase_articanreceive_blg ">
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
                                    <h1>Jewellery Purchase (Artician Receive) Voucher </h1>
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
                                        <p>GSTIN/UIN        : <span> {printObj.supplierGstUinNum}   PAN: {printObj.supPanNum} </span></p>
                                        <p>{printObj.supState}-{printObj.supCountry}</p>
                                        <p>State <span>:   {printObj.supState}, Code : {printObj.supStateCode}</span></p>
                                    </span>
                                </li>
                                <li className="d-block">
                                    <span>
                                        <p>Voucher Num. : <span>{printObj.purcVoucherNum}</span> </p>
                                        <p>Party Inv. Num. : <span>{printObj.partyInvNum}</span></p>
                                        <p>Voucher Date :  <span>{printObj.voucherDate}</span></p>
                                        <p>Place of Supply :  <span>{printObj.supState}</span></p>
                                    </span>
                                </li>
                            </ul>
                        </li>
                        <li className="d-block tabel_jewellery_purchase_articanreceive">
                            <div className="tabel-deta-show" >
                                <div className="row">
                                    <div className="header-tabel-deta">
                                        <div style={{ textAlign: "center" }}>Description of Goods</div>
                                        <div>HSN/SAC</div>
                                        <div>Purity</div>
                                        <div>Pcs</div>
                                        <div>Gross Wt</div>
                                        <div>Net Wt</div>
                                        <div>Rate</div>
                                        <div>Total Amount</div>
                                    </div>
                                </div>
                                {/* <div className="row">
                                    <div className="body-tabel-deta">
                                        <div border="1">Gold Bullion </div>
                                        <div border="1">710813</div>
                                        <div border="1">750 18K</div>
                                        <div border="1">66</div>
                                        <div border="1">48.792</div>
                                        <div border="1">43.890</div>
                                        <div border="1" className="rate_duble_blg">
                                            <div className="inner_rate_duble_blg">&nbsp;</div>
                                            <div className="inner_rate_duble_blg">&nbsp;</div>
                                        </div>
                                        <div className="alignment-right-text">&nbsp;</div>
                                    </div>
                                    <div className="body-tabel-deta">
                                        <div border="1">Silver Alloy </div>
                                        <div border="1">998892</div>
                                        <div border="1">&nbsp;</div>
                                        <div border="1">&nbsp;</div>
                                        <div border="0" className="border-bottom-dv">100</div>
                                        <div border="1">&nbsp;</div>
                                        <div border="1" className="rate_duble_blg">
                                            <div className="inner_rate_duble_blg">265.000</div>
                                            <div className="inner_rate_duble_blg">&nbsp;</div>
                                        </div>
                                        <div className="alignment-right-text"><b>  11,630.85 </b></div>
                                    </div>
                                </div> */}

                                {printObj.orderDetails.filter((element) => element.stockCode !== "")
                                    .map((row, index) => (
                                        <div className="row" key={index}>
                                            <div className="body-tabel-deta">
                                                <div border="1" style={{ textAlign: "center" }}>{row.stockName} ({row.billingCategory}) </div>
                                                <div border="1">{"-"}</div>
                                                <div border="1">{row.purity}</div>
                                                <div border="1">{row.pieces}</div>
                                                <div border="1">{parseFloat(row.grossWeight).toFixed(3)}</div>
                                                <div border="1">{parseFloat(row.netWeight).toFixed(3)}</div>
                                                <div border="1" className="rate_duble_blg">
                                                    <div className="inner_rate_duble_blg">&nbsp;</div>
                                                    {/* <div className="inner_rate_duble_blg">&nbsp;</div> */}
                                                </div>
                                                <div className="alignment-right-text">&nbsp;</div>
                                            </div>
                                            <div className="body-tabel-deta">
                                                <div border="1" style={{ textAlign: "center" }}>Labour Charges Exp. </div>
                                                <div border="1">{row.HSNNum}</div>
                                                <div border="1">&nbsp;</div>
                                                <div border="1">&nbsp;</div>
                                                <div border="0" className="border-bottom-dv">&nbsp;</div>
                                                <div border="1">&nbsp;</div>
                                                <div border="1" className="rate_duble_blg">
                                                    <div className="inner_rate_duble_blg">{Config.numWithComma(row.catRatePerGram)}</div>
                                                    {/* <div className="inner_rate_duble_blg">&nbsp;</div> */}
                                                </div>
                                                <div className="alignment-right-text"><b>  {Config.numWithComma(row.totalAmount)} </b></div>
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
                                        <div border="1" className="rate_duble_blg">
                                            <div className="inner_rate_duble_blg">&nbsp;</div>
                                            {/* <div className="inner_rate_duble_blg">&nbsp;</div> */}
                                        </div>
                                        <div border="1" className=" alignment-right-text"> <p>  &nbsp;</p> </div>
                                    </div>
                                    <div className="body-tabel-deta body-tabel-deta-bdr">
                                        <div border="1"> &nbsp;</div>
                                        <div border="1"> &nbsp;</div>
                                        <div border="1"> &nbsp;</div>
                                        <div border="1"> &nbsp;</div>
                                        <div border="1"> &nbsp;</div>
                                        <div border="1"> &nbsp;</div>
                                        <div border="1" className="rate_duble_blg">
                                            <div className="inner_rate_duble_blg">Taxable Amount</div>
                                            {/* <div className="inner_rate_duble_blg">&nbsp;</div> */}
                                        </div>
                                        <div border="1" className=" alignment-right-text"> <p>  {Config.numWithComma(printObj.taxableAmount)}</p> </div>
                                    </div>
                                    <div className="body-tabel-deta body-tabel-deta-bdr">
                                        <div border="1"> &nbsp;</div>
                                        <div border="1"> &nbsp;</div>
                                        <div border="1"> &nbsp;</div>
                                        <div border="1"> &nbsp;</div>
                                        <div border="1"> &nbsp;</div>
                                        <div border="1"> &nbsp;</div>
                                        {/* <div border="1" className="rate_duble_blg">
                                            <div className="inner_rate_duble_blg">SGST</div>
                                            <div className="inner_rate_duble_blg">2.50%</div>
                                        </div> */}
                                        {printObj.iGstTot === "" || printObj.iGstTot == 0 || isNaN(printObj.iGstTot) ?
                                            <div border="1" className="rate_duble_blg">
                                                {/* <div className="inner_rate_duble_blg">SGST</div> */}
                                                <div className="inner_rate_duble_blg">SGST({printObj.orderDetails.length > 0 && printObj.orderDetails[0].sGstPer}%)</div>
                                            </div>
                                            :
                                            <div border="1" className="rate_duble_blg">
                                                {/* <div className="inner_rate_duble_blg">IGST</div> */}
                                                <div className="inner_rate_duble_blg">IGST({printObj.orderDetails.length > 0 && printObj.orderDetails[0].IGSTper}%)</div>
                                            </div>
                                        }
                                        <div border="1" className=" alignment-right-text"> {Config.numWithComma(printObj.iGstTot === "" || printObj.iGstTot == 0 || isNaN(printObj.iGstTot) ? printObj.sGstTot : printObj.iGstTot)} </div>
                                        {/* <div border="1" className="alignment-right-text"> <p> 209,732.04 </p></div> */}
                                    </div>

                                    {printObj.iGstTot === "" || printObj.iGstTot == 0 || isNaN(printObj.iGstTot) ?
                                        <div className="body-tabel-deta body-tabel-deta-bdr">
                                            <div> &nbsp;</div>
                                            <div> &nbsp;</div>
                                            <div> &nbsp;</div>
                                            <div> &nbsp;</div>
                                            <div> &nbsp;</div>
                                            <div> &nbsp;</div>
                                            <div border="1" className="rate_duble_blg">
                                                {/* <div className="inner_rate_duble_blg">CGST</div> */}
                                                <div className="inner_rate_duble_blg">CGST({printObj.orderDetails.length > 0 && printObj.orderDetails[0].cgstPer}%)</div>
                                            </div>
                                            <div className=" alignment-right-text"><p>  {Config.numWithComma(printObj.cGstTot)} </p></div>
                                        </div> : ''
                                    }

                                    <div className="body-tabel-deta body-tabel-deta-bdr">
                                        <div> &nbsp;</div>
                                        <div> &nbsp;</div>
                                        <div> &nbsp;</div>
                                        <div> &nbsp;</div>
                                        <div> &nbsp;</div>
                                        <div> &nbsp;</div>
                                        <div border="1" className="rate_duble_blg">
                                            <div className="inner_rate_duble_blg">Round Off</div>
                                            {/* <div className="inner_rate_duble_blg"> &nbsp;</div> */}
                                        </div>
                                        <div className="alignment-right-text"><p>{printObj.roundOff === "" ? 0 : printObj.roundOff}</p></div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li className="d-block">
                            <div className="tabel-deta-show tabel-deta-show_total totallast_col" >
                                <div className="row">
                                    <div className="body-tabel-deta">
                                        <div><b className="print-div-left-increase">Total</b></div>
                                        <div border="1"> &nbsp;</div>
                                        <div>&nbsp;</div>
                                        <div>{printObj.pcsTot}</div>
                                        <div>{printObj.grossWtTOt}</div>
                                        <div>{printObj.netWtTOt}</div>
                                        <div className="text-left-dv-blg"><span><b>Total Invoice Amount</b></span></div>
                                        <div className=" alignment-right-text">{Config.numWithComma(printObj.totalInvoiceAmt)} </div>
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
                        </li>
                        <li className="d-block">
                            <div className="tabel-deta-show tabel-deta-show_total" >
                                <div className="row">
                                    <div className="body-tabel-deta">
                                        <div>TDS Deductable:<span></span></div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li className="d-block">
                            <div className="tabel-deta-show tabel-deta-show_total" >
                                <div className="row">
                                    <div className="body-tabel-deta">
                                        <div>TDSVoucher Num:<span> TDSJPL/04/22-23/0001</span></div>
                                    </div>
                                </div>
                            </div>
                        </li> 
                        <li className="d-block">
                            <div className="tabel-deta-show tabel-deta-show_total" >
                                <div className="row">
                                    <div className="body-tabel-deta">
                                        <div className="TDS-flex-dv"><span>TDS on Jobwork Purchase Labour Charges 94 (C)</span><span>259</span></div>
                                    </div>
                                </div>
                            </div>
                        </li>*/}
                        {(printObj.is_tds_tcs == "1" || printObj.is_tds_tcs == "2") &&
                            <li className="d-block">
                                <div className="tabel-deta-show tabel-deta-show_total" >
                                    <div className="row">
                                        <div className="body-tabel-deta">
                                            <div className="addvendor-row"><span className="print-div-left-increase"><b>{printObj.ledgerName}</b> </span><span className="mr-20">  {Config.numWithComma(printObj.taxAmount)} </span></div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        }

                        <li className="d-block">
                            <div className="tabel-deta-show tabel-deta-show_total" >
                                <div className="row">
                                    <div className="body-tabel-deta">
                                        <div>&nbsp;</div>
                                    </div>
                                </div>
                            </div>
                        </li>


                        <li className="d-block">
                            <div className="tabel-deta-show tabel-naration_total" >
                                <div className="row">
                                    <div className="body-tabel-deta">
                                        <div>Naration: <span>
                                            {" "}{printObj.accNarration}<br />
                                            {" "}{printObj.metNarration}
                                        </span></div>
                                    </div>
                                </div>
                            </div>
                        </li>

                        <li className="d-block">
                            <div className="tabel-deta-show tabel-deta-show_total" >
                                <div className="row">
                                    <div className="body-tabel-deta">
                                        <div className="flex_balancep_payable">
                                            <span className="print-div-left-increase">Amount Chargeable (in words) :<br />
                                                <span >{printObj.balancePayable !== "" && !isNaN(printObj.balancePayable) && toWords.convert(printObj.balancePayable)}
                                                </span>
                                            </span>
                                            <span className="EOE_alignment"> E. & O.E</span>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </li>
                        {(printObj.iGstTot !== "" || printObj.sGstTot !== "" || printObj.cGstTot !== "") && (
                            <li className="d-block">
                                <div className="tabel-deta-show tabel-deta-show_total" >
                                    <div className="row">
                                        <div className="body-tabel-deta">
                                            <div><span className="print-div-left-increase">Tax Amount (in words) :</span>
                                                <span>{" "} {printObj?.iGstTot === "" ||
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
                            </li>)}
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
                                        <div className="flex_balancep_payable"><span>Balance Payable Rs : </span> <span> 192,039.00 </span></div>
                                    </div>
                                </div>
                            </div>
                        </li> */}
                        <li className="d-block">
                            <div className="tabel-deta-show tabel-balancep-payable" >
                                <div className="row">
                                    <div className="body-tabel-deta">
                                        <div className="flex_balancep_payable"><span className="print-div-left-increase"><b>Balance Payable Rs :</b> </span> <span className="mr-20">  {Config.numWithComma(printObj.balancePayable)} 	</span></div>
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
                    {/*  Jewellery Purchase Artican Receive print Voucher  */}
                </div>
            </div >
        );
    }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
    // eslint-disable-line max-len text={props.text}
    return <JewelArticianPrintComp ref={ref} printObj={props.printObj} />;
});
