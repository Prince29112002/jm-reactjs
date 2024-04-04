import * as React from "react";
import { ToWords } from 'to-words';
import Config from "app/fuse-configs/Config";




export class SalesEstimateSubPrint extends React.PureComponent {

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

        return (

            <div className="relativeCSS main_print_blg_dv">
                <div className="increase-padding-dv jewellery_main_print-blg">

                    <style type="text/css" media="print">
                        {"\
                        @page { size: A5 landscape !important; margin:10px; }\
                    "}
                    </style>
                    <ul className="jewellery_main_print_dv">

                    
                            <ul className="jewellery_print_secand" style={{borderLeft: "none", borderRight: "none", borderTop: "none", borderBottom: "none"}}>
                                    <h1> ESTIMATE</h1>
                            </ul>
            
                        
                            <ul className="jewellery_print_thard" style={{borderLeft: "none", borderRight: "none"}}>
                                    <span>
                                        <p> <b>Party</b>:{printObj.SelectedClient.label}</p>
                                        <div border="1"> &nbsp;</div>
                                        <div border="1"> &nbsp;</div>
                                        <div border="1"> &nbsp;</div>

                                    </span>
                            </ul>
                        
                        <li className="d-block">
                            <div className="tabel-deta-show" >
                                <div className="row">
                                    <div className="header-tabel-deta" style={{borderTop: "none", borderRight: "none", borderLeft: "none" }}>
                                        <div><b>Purity</b></div>
                                        <div><b>Item</b></div>
                                        <div><b>Pcs</b></div>
                                        <div><b>Gross Wt</b></div>
                                        <div><b>Net Wt</b></div>
                                        <div><b>Wst.</b></div>
                                        <div><b>Fine</b></div>
                                        <div><b>HM Chrg</b></div>
                                        <div><b>Amount</b></div>
                                    </div>
                                </div>

                                {printObj.orderDetails.filter((element) => element.stockCode !== "")
                                    .map((row, index) => (
                                        <div className="row" key={index}>
                                            <div className="body-tabel-deta" style={{borderRight: "none",borderLeft: "none"}}>
                                                <div border="1">{row.purity}</div>
                                                <div border="1">{row.billing_category_name}</div>
                                                <div border="1">{row.pcs}</div>
                                                <div border="1">{row.gross_wgt}</div>
                                                <div border="1">{row.net_wgt}</div>
                                                <div border="1">{row.wastageFine}</div>
                                                <div border="1">{row.totalFine}</div>
                                                <div border="1">{row.hallmark_charges}</div>
                                                <div border="1">{row.totalAmount}</div>
                                            </div>
                                        </div>
                                    ))}

                                <div className="row">
                                    <div className="header-tabel-deta" style={{borderTop: "none", borderRight: "none", borderLeft: "none" }}>
                                        <div></div>
                                        <div><b>TOTAL</b></div>
                                        <div>{printObj.pcsTot}</div>
                                        <div>{printObj.grossWtTOt}</div>
                                        <div>{printObj.netWtTOt}</div>
                                        <div>{printObj.totalwastageFine}</div>
                                        <div>{parseFloat(printObj.FineTot).toFixed(3)}</div>
                                        <div>{printObj.hmTotal}</div>
                                        <div>{parseFloat(printObj.amountTot).toFixed(3)}</div>
                                    </div>
                                </div>

                                <div className="second mt-10">
                                        <div className="tabel-deta-show" >
                                            <div className="row">
                                                <div className="header-tabel-deta" style={{borderLeft: "none", borderRight: "none" }} >
                                                    <div><b>Purity</b></div>
                                                    <div><b>Gross Wt</b></div>
                                                    <div><b>Stone Wt</b></div>
                                                    <div><b>Other Silver Wt</b></div>
                                                    <div><b>Other Rubber Wt</b></div>
                                                    <div><b>Beads Wt</b></div>
                                                    <div><b>Other Metal Wt</b></div>
                                                    <div><b>Net Wt</b></div>
                                                    <div><b>Fine With Wstg</b></div>
                                                    <div><b>Hm Chrg</b></div>
                                                    <div><b>Trans Amt</b></div>
                                                    <div><b>No.of Packet</b></div>
                                                </div>
                                            </div>
                                           
                                            {printObj.sumofpurity
                                                .map((row, i) => (
                                                    <div className="row" key={i}>
                                                        <div className="body-tabel-deta" style={{borderLeft: "none", borderRight: "none" }}>
                                                            <div border="1">{row.purity}</div>
                                                            <div border="1">{row.gross_wgt}</div>
                                                            <div border="1">{parseFloat(row.stone_wgt).toFixed(3)}</div>
                                                            <div border="1">{row.silver_wgt}</div>
                                                            <div border="1">{row.rubber_wgt}</div>
                                                            <div border="1">{row.beads_wgt}</div>
                                                            <div border="1">{row.other_metal_wgt}</div>
                                                            <div border="1">{row.net_wgt}</div>
                                                            <div border="1">{parseFloat(row.fine_with_wstg).toFixed(3)}</div>
                                                            <div border="1">{row.hallmarkChargesFrontEnd}</div>
                                                            <div border="1">{row.trans_amt}</div>
                                                            <div border="1">{row.no_of_packet}</div>
                                                        </div>
                                                    </div>
                                                ))}

                                            <div className="row" style={{ borderLeft: "none" }}>
                                                <div className="header-tabel-deta" style={{borderLeft: "none", borderRight: "none" }} >
                                                    <div><b>TOTAL</b></div>
                                                    <div>{printObj.grossWtTOt}</div>
                                                    <div>{parseFloat(printObj.sumstoneWgtTot).toFixed(3)}</div>
                                                    <div></div>
                                                    <div></div>
                                                    <div>{printObj.sumbeadsWgtTot}</div>
                                                    <div></div>
                                                    <div>{printObj.netWtTOt}</div>
                                                    <div>{parseFloat(printObj.FineTot).toFixed(3)}</div>
                                                    <div>{printObj.hmTotal}</div>
                                                    <div>{parseFloat(printObj.amountTot).toFixed(3)}</div>
                                                    <div>{printObj.sumnoOfPacketTot}</div>
                                                </div>
                                            </div>

                                        </div>
                                </div>

                                <div className="third mt-10">
                                        <div className="tabel-deta-show" >
                                            <div className="row">
                                                <div className="header-tabel-deta" style={{borderBottom: "none", borderLeft: "none",borderRight: "none" }} >
                                                    <div></div>
                                                    <div style={{ borderBottom: "1px solid Black" }}><b>Fine</b></div>
                                                    <div style={{ borderBottom: "1px solid Black" }}><b>Amount</b></div>

                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="header-tabel-deta" style={{ border: "none" }} >
                                                    <div>&nbsp;</div>
                                                    <div>&nbsp;</div>
                                                    <div>&nbsp;</div>

                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="header-tabel-deta" style={{border: "none" }}>
                                                    <div><b>Current</b></div>
                                                    <div border="1">{parseFloat(printObj.FineTot).toFixed(3)}</div>
                                                    <div border="1">{printObj.hmTotal+printObj.amountTot}</div>

                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="header-tabel-deta" style={{ border: "none" }} >
                                                    <div>&nbsp;</div>
                                                    <div>&nbsp;</div>
                                                    <div>&nbsp;</div>


                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="header-tabel-deta" style={{ border: "none" }} >
                                                    <div><b>Closing</b></div>
                                                    <div>{parseFloat(printObj.FineTot).toFixed(1)}</div>
                                                    <div>{printObj.amountTot}</div>

                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="header-tabel-deta" style={{ border: "none" }} >
                                                    <div>&nbsp;</div>
                                                    <div>&nbsp;</div>
                                                    <div>&nbsp;</div>

                                                </div>
                                            </div>

                                        </div>
                                </div>

                            </div>
                        </li>
                    </ul>
                </div>


            </div>
        );
    }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
    // eslint-disable-line max-len text={props.text}
    return <SalesEstimateSubPrint ref={ref} printObj={props.printObj} />;
});
