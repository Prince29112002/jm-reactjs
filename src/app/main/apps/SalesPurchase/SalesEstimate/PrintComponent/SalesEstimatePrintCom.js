import * as React from "react";
import { ToWords } from 'to-words';
import Config from "app/fuse-configs/Config";



export class SalesEstimstePrintCom extends React.PureComponent {
    // constructor(props) {
    //     super(props);

    // }

    // canvasEl;

    componentDidMount() {
    }

    // setRef = (ref) => (this.canvasEl = ref);

    render() {
        // const { text } = this.props;
        const { printObj } = this.props;
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
        return (

            <div className="relativeCSS main_print_blg_dv">
                <div className="increase-padding-dv jewellery_main_print-blg">
                    {/* secand_jewellery_main_print */}
                    <style type="text/css" media="print">
                    {"\
                        @page { size: A5 landscape !important; margin:10px; }\
                    "}
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
                                    <h1>Sales Estimate</h1>
                                </li>
                            </ul>
                        </li>
                        <li className="d-block">
                            <ul className="jewellery_print_thard">
                                <li className="d-block">
                                    <span>
                                        <p>Supplier Party Details:</p>
                                        <p><b> {printObj.supplierName} </b></p>
                                        <p>{printObj.supAddress}</p>
                                        <p>GSTIN/UIN : <span>{printObj.supplierGstUinNum}    PAN No.{printObj.supPanNum}</span></p>
                                        <p>{printObj.supState}-{printObj.supCountry}</p>
                                        <p>State <span>:  {printObj.supState}, Code : {printObj.supStateCode}</span></p>
                                    </span>
                                </li>
                                <li className="d-block">
                                    <span>
                                        {/* <p>Voucher Num. : <span>{printObj.purcVoucherNum}</span> </p>
                                        <p>Party Inv. Num. : <span>{printObj.partyInvNum}</span></p> */}
                                        <p>Voucher Date :  <span>{printObj.voucherDate}</span></p>
                                        <p>Place of Supply :  <span>{printObj.supState}</span></p>
                                    </span>
                                </li>
                            </ul>
                        </li>
                        <li className="d-block">
                            <div className="tabel-deta-show" >
                                <div className="row">
                                    <div className="header-tabel-deta">
                                        <div>Category</div>
                                        <div>HSN/SAC</div>
                                        <div>Purity</div>
                                        <div>Pieces</div>
                                        <div>karat</div>
                                        <div>Gross Wt</div>
                                        <div>Net Wt</div>
                                        {/* <div>Total Amount</div> */}
                                    </div>
                                </div>
                                {printObj.orderDetails.filter((element) => element.stockCode !== "")
                                    .map((row, index) => (
                                        <div className="row" key={index}>
                                            <div className="body-tabel-deta">
                                                <div border="1">{row.billing_category_name}</div>
                                                <div border="1">{row.hsn_number}</div>
                                                <div border="1">{row.purity}</div>
                                                <div border="1">{row.pcs}</div>
                                                <div border="1">{row.karat}</div>
                                                <div border="1">{row.gross_wgt.toFixed(3)}</div>
                                                <div border="1">{row.net_wgt.toFixed(3)}</div>
                                                {/* <div border="1" className=" alignment-right-text">{Config.numWithComma(row.totalAmount)} </div> */}
                                            </div>
                                        </div>
                                    ))}
                                <div className="row">
                                    {/* <div className="body-tabel-deta">
                                        <div border="1">FN Earrings</div>
                                        <div border="1">711319</div>
                                        <div border="1">750 18K</div>
                                        <div border="1"> &nbsp;</div>
                                        <div border="1"> &nbsp;</div>
                                        <div border="1"> &nbsp;</div>
                                        <div border="1"> &nbsp;</div>
                                        <div border="1"> &nbsp;</div>
                                        <div border="1"> &nbsp; </div>
                                    </div>
                                    <div className="body-tabel-deta">
                                        <div border="1">FN Bali</div>
                                        <div border="1">&nbsp;</div>
                                        <div border="1">750 18K</div>
                                        <div border="1"> &nbsp;</div>
                                        <div border="1"> &nbsp;</div>
                                        <div border="1"> &nbsp;</div>
                                        <div border="1"> &nbsp;</div>
                                        <div border="1"> &nbsp;</div>
                                        <div border="1"> &nbsp; </div>
                                    </div>
                                    <div className="body-tabel-deta">
                                        <div border="1">Gold Jewellery (under 2 Grm)</div>
                                        <div border="1">711319</div>
                                        <div border="1">750 18K</div>
                                        <div border="1"> &nbsp;</div>
                                        <div border="1"> &nbsp;</div>
                                        <div border="1"> &nbsp;</div>
                                        <div border="1"> &nbsp;</div>
                                        <div border="1"> &nbsp;</div>
                                        <div border="1"> &nbsp; </div>
                                    </div> */}
                                    <div className="body-tabel-deta body-tabel-deta-bdr">
                                        <div border="1"> &nbsp;</div>
                                        <div border="1"> &nbsp;</div>
                                        <div border="1"> &nbsp;</div>
                                        {/* <div border="1"> &nbsp;</div> */}
                                        <div border="1"> &nbsp;</div>
                                        <div border="1"> &nbsp;</div>
                                        <div border="1"> &nbsp;</div>
                                        <div border="1"> &nbsp;</div>
                                        {/* <div border="1"> &nbsp;</div> */}
                                        {/* <div border="1" className="text-left-dv-blg">Taxable Amount	</div>
                                        <div border="1" className=" alignment-right-text">{Config.numWithComma(printObj.taxableAmount)}</div> */}
                                    </div>
                                    <div className="body-tabel-deta body-tabel-deta-bdr">
                                        <div border="1"> &nbsp;</div>
                                        <div border="1"> &nbsp;</div>
                                        <div border="1"> &nbsp;</div>
                                        {/* <div border="1"> &nbsp;</div> */}
                                        <div border="1"> &nbsp;</div>
                                        <div border="1"> &nbsp;</div>
                                        <div border="1"> &nbsp;</div>
                                        <div border="1"> &nbsp;</div>
                                        {/* <div border="1"> &nbsp;</div> */}
                                        {/* <div border="1" className="text-left-dv-blg">IGST</div>
                                        <div border="1" className=" alignment-right-text">5,598.81</div> */}
                                        {/* {printObj.stateId === 12 ?
                                            <div border="1" className="text-left-dv-blg">SGST</div>
                                            :
                                            <div border="1" className="text-left-dv-blg">IGST</div>
                                        } */}
                                        {/* <div border="1" className=" alignment-right-text"> {printObj.stateId === 12 ? Config.numWithComma(printObj.sGstTot) : Config.numWithComma(printObj.iGstTot)} </div> */}
                                    </div>
                                    {printObj.stateId === 12 &&
                                        <div className="body-tabel-deta body-tabel-deta-bdr">
                                            {/* <div border="1"> &nbsp;</div> */}
                                            <div border="1"> &nbsp;</div>
                                            <div border="1"> &nbsp;</div>
                                            <div border="1"> &nbsp;</div>
                                            <div border="1"> &nbsp;</div>
                                            <div border="1"> &nbsp;</div>
                                            <div border="1"> &nbsp;</div>
                                            <div border="1"> &nbsp;</div>
                                            {/* <div border="1"> &nbsp;</div> */}
                                            {/* <div className="text-left-dv-blg">CGST</div> */}
                                            {/* <div className=" alignment-right-text">  {Config.numWithComma(printObj.cgstVal)} </div> */}
                                        </div>
                                    }
                                    <div className="body-tabel-deta body-tabel-deta-bdr">
                                        <div border="1"> &nbsp;</div>
                                        {/* <div> &nbsp;</div> */}
                                        <div> &nbsp;</div>
                                        <div> &nbsp;</div>
                                        <div> &nbsp;</div>
                                        <div> &nbsp;</div>
                                        <div> &nbsp;</div>
                                        <div> &nbsp;</div>
                                        {/* <div> &nbsp;</div> */}
                                        {/* <div className="text-left-dv-blg">Round Off</div> */}
                                        {/* <div className=" alignment-right-text">{printObj.roundOff === "" ? 0 : printObj.roundOff}</div> */}
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li className="d-block">
                            <div className="tabel-deta-show tabel-deta-show_total totallast_col" >
                                <div className="row">
                                    <div className="body-tabel-deta">
                                        <div><b>Total</b></div>
                                        <div border="1"> &nbsp;</div>
                                        <div>&nbsp;</div>
                                        <div>&nbsp;</div>
                                        <div>&nbsp;</div>
                                        <div>{printObj.grossWtTOt}</div>
                                        <div>{printObj.netWtTOt}</div>
                                        {/* <div>&nbsp;</div> */}
                                        {/* <div className="text-left-dv-blg"><b>Total Invoice Amount</b><span></span></div> */}
                                        {/* <div className="bdr_remove_blg">&nbsp;</div> */}
                                        {/* <div className=" alignment-right-text">  {Config.numWithComma(printObj.totalInvoiceAmt)} </div> */}
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
                                                <div>TCS Voucher Num:  {printObj.TDSTCSVoucherNum}		<span></span></div>
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
                                                <div>TDSVoucher Num:  {printObj.TDSTCSVoucherNum}	<span></span></div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </>
                        } */}

                        {/* {(printObj.is_tds_tcs === "1" || printObj.is_tds_tcs === "2") &&
                            <li className="d-block">
                                <div className="tabel-deta-show tabel-deta-show_total" >
                                    <div className="row">
                                        <div className="body-tabel-deta">
                                            <div className="addvendor-row"><span>{printObj.legderName} </span><span>  {parseFloat(Math.round(printObj.taxAmount)).toFixed(2)} </span></div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        } */}

                        <li className="d-block">
                            <div className="tabel-deta-show tabel-deta-show_total" >
                                <div className="row">
                                    <div className="body-tabel-deta">
                                        <div>&nbsp;</div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        {/* <li className="d-block">
                            <div className="tabel-deta-show tabel-naration_total" >
                                <div className="row">
                                    <div className="body-tabel-deta">
                                        <div>Naration:
                                            <span>
                                                {printObj.accNarration}<br />
                                                {printObj.jewelNarration}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li className="d-block">
                            <div className="tabel-deta-show tabel-deta-show_total" >
                                <div className="row">
                                    <div className="body-tabel-deta">
                                        <div className="flex_balancep_payable">
                                            <span>Amount Chargeable (in words) :<br />
                                                <span>
                                                    {printObj.totalInvoiceAmt !== "" && toWords.convert(printObj.totalInvoiceAmt)}
                                                </span>
                                            </span>
                                            <span className="EOE_alignment"> E. & O.E</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        {(printObj.is_tds_tcs == "1" || printObj.is_tds_tcs == "2") &&
                            <li className="d-block">
                                <div className="tabel-deta-show tabel-deta-show_total" >
                                    <div className="row">
                                        <div className="body-tabel-deta">
                                            <div>Tax Amount (in words) :  <span> {printObj.taxableAmount !== "" && toWords.convert(Math.round(printObj.taxableAmount))}.</span></div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        } */}

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
                                        <div className="flex_balancep_payable"><span>Balance Payable Rs : </span> <span>  {printObj.balancePayable}</span></div>
                                    </div>
                                </div>
                            </div>
                        </li> */}
                        <li className="d-block">
                            <div className="tabel-deta-show multiple-tabel-blg" >
                                <div className="row">
                                    <div className="body-tabel-deta">
                                        <div className="flex_balancep_payable"><span>For VK {siteSetData.company_name}</span></div>
                                        <div className="flex_balancep_payable"><span>Receiver Signature : </span></div>
                                        <div className="flex_balancep_payable"><span>Authorised Signatory</span></div>
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
    return <SalesEstimstePrintCom ref={ref} printObj={props.printObj} />;
});
