import * as React from "react";



export class ComponentToPrint extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { checked: false };
  }

  canvasEl;

  componentDidMount() {
    // const ctx = this.canvasEl.getContext("2d");
    // if (ctx) {
    //   ctx.beginPath();
    //   ctx.arc(95, 50, 40, 0, 2 * Math.PI);
    //   ctx.stroke();
    //   ctx.fillStyle = "rgb(200, 0, 0)";
    //   ctx.fillRect(85, 40, 20, 20);
    //   ctx.save();
    // }
  }

  handleCheckboxOnChange = () =>
    this.setState({ checked: !this.state.checked });

  setRef = (ref) => (this.canvasEl = ref);

  render() {
    const { text } = this.props;

    const siteSetData = localStorage.getItem("siteSetting")
    ? JSON.parse(localStorage.getItem("siteSetting"))
    : [];
    return (
      <div className="relativeCSS main_print_blg_dv">
        <div className="increase-padding-dv  estimate_main_print-blg">
        
          {/* <ul className="jewellery_main_print_dv jewellery_purchase_articanreceive_blg ">
             
              <li className="d-block">
                <ul className="estimate-title-border-dv">
                  <li className="d-block">
                     <h4 className="text-center">ESTIMATE</h4> 
                  </li>
                </ul>
              </li>
              <li className="d-block">
                <ul className="jewellery_main_print-title">
                  <li className="d-block">
                    <h5>
                      Party : RV Jewellers Canada												
                    </h5>
                  </li>
                </ul>
              </li>
             
              <li className="d-block tabel_jewellery_purchase_articanreceive">
                <div className="tabel-deta-show" >
                  <div className="row">
                    <div className="header-tabel-deta">
                      <div>Purity</div>
                      <div>Item		</div>
                      <div>Pcs</div>
                      <div>Weight	</div>
                      <div>Net Wt	</div>
                      <div>Wst.</div>
                      <div>Fine</div>
                      <div>HM Chrg</div>
                      <div>Amount</div>
                    </div>
                  </div>
                   <div className="row">
                    <div className="body-tabel-deta">
                      <div border="1">75.10</div>
                      <div border="1">EL EARRINGS		</div>
                      <div border="1">90</div>
                      <div border="1">173.256	</div>
                      <div border="1">133.626	</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1">100.353</div>
                      <div border="1">0.00</div>
                      <div className="alignment-right-text"> 7,470.00</div>
                    </div>
                     <div className="body-tabel-deta">
                      <div border="1">75.10</div>
                      <div border="1">EL EARRINGS		</div>
                      <div border="1">90</div>
                      <div border="1">173.256	</div>
                      <div border="1">133.626	</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1">100.353</div>
                      <div border="1">0.00</div>
                      <div className="alignment-right-text"> 7,470.00</div>
                    </div>
                    <div className="body-tabel-deta">
                      <div border="1">75.10</div>
                      <div border="1">EL EARRINGS		</div>
                      <div border="1">90</div>
                      <div border="1">173.256	</div>
                      <div border="1">133.626	</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1">100.353</div>
                      <div border="1">0.00</div>
                      <div className="alignment-right-text"> 7,470.00</div>
                    </div>
                   <div className="body-tabel-deta">
                      <div border="1">75.10</div>
                      <div border="1">EL EARRINGS		</div>
                      <div border="1">90</div>
                      <div border="1">173.256	</div>
                      <div border="1">133.626	</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1">100.353</div>
                      <div border="1">0.00</div>
                      <div className="alignment-right-text"> 7,470.00</div>
                    </div>
                     <div className="body-tabel-deta">
                      <div border="1">75.10</div>
                      <div border="1">EL EARRINGS		</div>
                      <div border="1">90</div>
                      <div border="1">173.256	</div>
                      <div border="1">133.626	</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1">100.353</div>
                      <div border="1">0.00</div>
                      <div className="alignment-right-text"> 7,470.00</div>
                    </div>
                    <div className="body-tabel-deta">
                      <div border="1">75.10</div>
                      <div border="1">EL EARRINGS		</div>
                      <div border="1">90</div>
                      <div border="1">173.256	</div>
                      <div border="1">133.626	</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1">100.353</div>
                      <div border="1">0.00</div>
                      <div className="alignment-right-text"> 7,470.00</div>
                    </div>
                   <div className="body-tabel-deta">
                      <div border="1">75.10</div>
                      <div border="1">EL EARRINGS		</div>
                      <div border="1">90</div>
                      <div border="1">173.256	</div>
                      <div border="1">133.626	</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1">100.353</div>
                      <div border="1">0.00</div>
                      <div className="alignment-right-text"> 7,470.00</div>
                    </div>
                    <div className="body-tabel-deta">
                      <div border="1">75.10</div>
                      <div border="1">EL EARRINGS		</div>
                      <div border="1">90</div>
                      <div border="1">173.256	</div>
                      <div border="1">133.626	</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1">100.353</div>
                      <div border="1">0.00</div>
                      <div className="alignment-right-text"> 7,470.00</div>
                    </div>
                    <div className="body-tabel-deta">
                      <div border="1">75.10</div>
                      <div border="1">EL EARRINGS		</div>
                      <div border="1">90</div>
                      <div border="1">173.256	</div>
                      <div border="1">133.626	</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1">100.353</div>
                      <div border="1">0.00</div>
                      <div className="alignment-right-text"> 7,470.00</div>
                    </div>
                   <div className="body-tabel-deta">
                      <div border="1">75.10</div>
                      <div border="1">EL EARRINGS		</div>
                      <div border="1">90</div>
                      <div border="1">173.256	</div>
                      <div border="1">133.626	</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1">100.353</div>
                      <div border="1">0.00</div>
                      <div className="alignment-right-text"> 7,470.00</div>
                    </div>
                    <div className="body-tabel-deta">
                      <div border="1">75.10</div>
                      <div border="1">EL EARRINGS		</div>
                      <div border="1">90</div>
                      <div border="1">173.256	</div>
                      <div border="1">133.626	</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1">100.353</div>
                      <div border="1">0.00</div>
                      <div className="alignment-right-text"> 7,470.00</div>
                    </div>
                    <div className="body-tabel-deta">
                      <div border="1">75.10</div>
                      <div border="1">EL EARRINGS		</div>
                      <div border="1">90</div>
                      <div border="1">173.256	</div>
                      <div border="1">133.626	</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1">100.353</div>
                      <div border="1">0.00</div>
                      <div className="alignment-right-text"> 7,470.00</div>
                    </div>
                   <div className="body-tabel-deta">
                      <div border="1">75.10</div>
                      <div border="1">EL EARRINGS		</div>
                      <div border="1">90</div>
                      <div border="1">173.256	</div>
                      <div border="1">133.626	</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1">100.353</div>
                      <div border="1">0.00</div>
                      <div className="alignment-right-text"> 7,470.00</div>
                    </div>
                    <div className="body-tabel-deta">
                      <div border="1">75.10</div>
                      <div border="1">EL EARRINGS		</div>
                      <div border="1">90</div>
                      <div border="1">173.256	</div>
                      <div border="1">133.626	</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1">100.353</div>
                      <div border="1">0.00</div>
                      <div className="alignment-right-text"> 7,470.00</div>
                    </div>
                    <div className="body-tabel-deta">
                      <div><b>Total</b></div>
                      <div border="1"> &nbsp;</div>
                      <div>&nbsp;</div>
                      <div>66</div>
                      <div>48.792</div>
                      <div>48.792</div>
                      <div>43.890</div>
                      <div className="text-left-dv-blg"><span><b>Total Invoice Amount</b></span></div>
                      <div className=" alignment-right-text">2,693,946.22 </div>
                    </div>
                  </div>
                </div>
              </li>

              <li className="d-block tabel_jewellery_purchase_articanreceive secand_estimate-dv">
                <div className="tabel-deta-show" >
                  <div className="row">
                    <div className="header-tabel-deta">
                      <div>Purity</div>
                      <div>Gross Wt	</div>
                      <div>Stone Wt</div>
                      <div>Oth Silver  Wt	</div>
                      <div>Oth Rubber  Wt</div>
                      <div>Beads Wt</div>
                      <div>Oth Metal Wt</div>
                      <div>Net Wt</div>
                      <div>Fine With Wstg	</div>
                       <div>HM Chrg</div>
                      <div>Trans Amt</div>
                      <div>No. of Packet</div>
                    </div>
                  </div>
                   <div className="row">
                    <div className="body-tabel-deta">
                      <div border="1">75.10</div>
                      <div border="1">807.265</div>
                      <div border="1">125.331</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1">681.934</div>
                      <div border="1">512.132	</div>
                      <div border="1">0.00</div>
                      <div border="1">80,001.00</div>
                      <div className="alignment-right-text">18</div>
                    </div>
                     <div className="body-tabel-deta">
                      <div border="1">91.80</div>
                      <div border="1">2,362.304</div>
                      <div border="1">206.038</div>
                      <div border="1"> 3.360</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1">2,152.906</div>
                      <div border="1">1,976.368	</div>
                      <div border="1">0.00</div>
                      <div border="1">182,099.00</div>
                      <div className="alignment-right-text">63</div>
                    </div>
                    <div className="body-tabel-deta">
                      <div><b>Total</b></div>
                      <div border="1">3,169.569</div>
                      <div>331.369</div>
                      <div>3.360</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1"> &nbsp;</div>
                      <div>2,834.840</div>
                      <div>2,488.500	</div>
                      <div>0.00</div>
                     <div>262,100.00</div>
                      <div className=" alignment-right-text">81</div>
                    </div>
                  </div>
                </div>
              </li>

               <li className="d-block tabel_jewellery_purchase_articanreceive secand_estimate-dv">
                <div className="tabel-deta-show" >
                  <div className="row">
                    <div className="header-tabel-deta">
                      <div>Purity</div>
                      <div>Gross Wt	</div>
                      <div>Stone Wt</div>
                      <div>Oth Silver  Wt	</div>
                      <div>Oth Rubber  Wt</div>
                      <div>Beads Wt</div>
                      <div>Oth Metal Wt</div>
                      <div>Net Wt</div>
                      <div>Fine With Wstg	</div>
                       <div>HM Chrg</div>
                      <div>Trans Amt</div>
                      <div>No. of Packet</div>
                    </div>
                  </div>
                   <div className="row">
                    <div className="body-tabel-deta">
                      <div border="1">75.10</div>
                      <div border="1">807.265</div>
                      <div border="1">125.331</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1">681.934</div>
                      <div border="1">512.132	</div>
                      <div border="1">0.00</div>
                      <div border="1">80,001.00</div>
                      <div className="alignment-right-text">18</div>
                    </div>
                     <div className="body-tabel-deta">
                      <div border="1">91.80</div>
                      <div border="1">2,362.304</div>
                      <div border="1">206.038</div>
                      <div border="1"> 3.360</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1">2,152.906</div>
                      <div border="1">1,976.368	</div>
                      <div border="1">0.00</div>
                      <div border="1">182,099.00</div>
                      <div className="alignment-right-text">63</div>
                    </div>
                    <div className="body-tabel-deta">
                      <div><b>Total</b></div>
                      <div border="1">3,169.569</div>
                      <div>331.369</div>
                      <div>3.360</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1"> &nbsp;</div>
                      <div>2,834.840</div>
                      <div>2,488.500	</div>
                      <div>0.00</div>
                     <div>262,100.00</div>
                      <div className=" alignment-right-text">81</div>
                    </div>
                  </div>
                </div>
              </li>
          </ul> */}

          
           <ul className="jewellery_main_print_dv jewellery_purchase_articanreceive_blg ">
              <li className="d-block">
                <ul className="jewellery_main_print-title">
                <li className="d-block">
                  <h1>{siteSetData.company_name}</h1>
                  <p>{siteSetData.company_address},</p>
                  <p>{siteSetData.city},{siteSetData.state} - {siteSetData.pin}</p>
                  <p>{siteSetData.email} | {siteSetData.website}</p>
                  <p>
                    GST No:{siteSetData.gst_number} PAN:{siteSetData.pan_number} CIN:{siteSetData.cin_number}
                  </p>
                </li>
                </ul>
              </li>
              <li className="d-block">
                <ul className="jewellery_print_secand">
                  <li className="d-block">
                    <h1>Jewellery Purchase Artican Receive Voucher</h1>
                  </li>
                </ul>
              </li>
              <li className="d-block">
                <ul className="jewellery_print_thard">
                  <li className="d-block">
                   <span>
                      <p>Artican Party Details:</p>
                      <p><b>Kushal</b></p>
                      <p>30,DEVANDAN MALL,GROUND FLOOR,</p>
                      <p>OPP, SANYAS ASHRAM, NR,MJ LIBRARY ELLISBRIDE, AHMEDABAD</p>
                      <p>GSTIN/UIN        :  24AQCPS1398B1ZZ   PAN: AQCPS1398B</p>
                      <p>Gujarat-India <span></span></p>
                      <p>State <span>:  Gujarat, Code : 24</span></p>
                   </span>
                  </li>
                  <li className="d-block">
                    <span>
                      <p>Voucher Num :<span>JPA/04/22-23/00007</span> </p>
                      <p>Party Inv. Num : <span>GJ001</span></p>
                      <p>Voucher Date : <span>19-Apr-22</span></p>
                      <p>Place of Supply : <span>Gujarat</span></p>
                    </span>
                  </li>
                </ul>
              </li>
              <li className="d-block tabel_jewellery_purchase_articanreceive">
                <div className="tabel-deta-show" >
                  <div className="row">
                    <div className="header-tabel-deta">
                      <div>Description of Goods</div>
                      <div>HSN/SAC</div>
                      <div>Purity</div>
                      <div>Pcs</div>
                      <div>Gross Wt</div>
                      <div>Net Wt</div>
                      <div>Rate</div>
                      <div>Sub Total</div>
                    </div>
                  </div>
                   <div className="row">
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
                    
                     <div className="body-tabel-deta body-tabel-deta-bdr">
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1" className="rate_duble_blg">
                          <div className="inner_rate_duble_blg">Taxable Amount</div>
                          <div className="inner_rate_duble_blg">&nbsp;</div>
                         </div>
                        <div border="1" className=" alignment-right-text"> <p>  13,982,136.00</p> </div>
                    </div>
                    <div className="body-tabel-deta body-tabel-deta-bdr">
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                         <div border="1" className="rate_duble_blg">
                          <div className="inner_rate_duble_blg">SGST</div>
                          <div className="inner_rate_duble_blg">2.50%</div>
                         </div>
                        <div border="1" className="alignment-right-text"> <p> 209,732.04 </p></div>
                    </div>
                    <div className="body-tabel-deta body-tabel-deta-bdr">
                        <div> &nbsp;</div>
                        <div> &nbsp;</div>
                        <div> &nbsp;</div>
                        <div> &nbsp;</div>
                        <div> &nbsp;</div>
                        <div> &nbsp;</div>
                         <div border="1" className="rate_duble_blg">
                          <div className="inner_rate_duble_blg">CGST</div>
                          <div className="inner_rate_duble_blg">2.50%</div>
                         </div>
                        <div className=" alignment-right-text"><p>  209,732.04 </p></div>
                    </div>
                    <div className="body-tabel-deta body-tabel-deta-bdr">
                        <div> &nbsp;</div>
                        <div> &nbsp;</div>
                        <div> &nbsp;</div>
                        <div> &nbsp;</div>
                        <div> &nbsp;</div>
                        <div> &nbsp;</div>
                        <div border="1" className="rate_duble_blg">
                          <div className="inner_rate_duble_blg">Round Off</div>
                          <div className="inner_rate_duble_blg"> &nbsp;</div>
                        </div>
                        <div className="alignment-right-text"><p>-0.08</p></div>
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
                      <div>66</div>
                      <div>48.792</div>
                      <div>43.890</div>
                      <div className="text-left-dv-blg"><span><b>Total Invoice Amount</b></span></div>
                      <div className=" alignment-right-text">2,693,946.22 </div>
                    </div>
                  </div>
                </div>
              </li>
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
              </li>
              <li className="d-block">
                <div className="tabel-deta-show tabel-naration_total" >
                   <div className="row">
                    <div className="body-tabel-deta">
                      <div>Naration: <span></span></div>
                    </div>
                  </div>
                </div>
              </li>
               <li className="d-block">
                <div className="tabel-deta-show tabel-deta-show_total" >
                   <div className="row">
                    <div className="body-tabel-deta">
                      <div className="flex_balancep_payable flex_balancep_payable-dv">Amount Chargeable (in words) : <br/>
                      INR Twenty Seven Thousand Two Hundred Seven Only. <span> E. & O.E</span></div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="d-block">
                <div className="tabel-deta-show tabel-deta-show_total" >
                   <div className="row">
                    <div className="body-tabel-deta">
                      <div>Tax Amount (in words) :  <span> INR Four Lakh Nineteen Thousand Four Hundred Sixty Four and Eight paise Only.</span></div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="d-block">
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
              </li>
               <li className="d-block">
                <div className="tabel-deta-show multiple-tabel-blg" >
                   <div className="row">
                    <div className="body-tabel-deta">
                      <div className="flex_balancep_payable"><span>For {siteSetData.company_name}</span></div>
                        <div className="flex_balancep_payable"><span>Receiver Signature : </span></div>
                          <div className="flex_balancep_payable"><span>Authorised Signatory</span></div>
                    </div>
                  </div>
                </div>
              </li>
          </ul>
 {/*  Jewellery Purchase Artican Receive print Voucher  */}


   {/* Artisan Issue  */}
           {/* <ul className="jewellery_main_print_dv artisan_issue_printformate ">
              <li className="d-block">
                <ul className="jewellery_main_print-title">
                  <li className="d-block">
                    <h1>
                      VK Jewels Pvt. Ltd.
                    </h1>
                  <p>'Shri', Madhuvan Park Main Road, Opp. Blossom School,</p>
                  <p>Behind Kuvadva Road, Rajkot, Gujarat - 360003</p>
                  <p>connect@vkjewels.net | www.vkjewels.net</p>
                  <p>GST No: 24AAGCV5545E1ZD; PAN: AAGCV5545E; CIN: U27320GJ2018PTC103774</p>
                  </li>
                </ul>
              </li>
              <li className="d-block">
                <ul className="jewellery_print_secand">
                  <li className="d-block">
                    <h1>Artisan Issue Cum Delivery Challan</h1>
                  </li>
                </ul>
              </li>
              <li className="d-block">
                <ul className="jewellery_print_thard">
                  <li className="d-block">
                   <span>
                      <p>Artican Party Details:</p>
                      <p><b>AARAV BULLION</b></p>
                      <p>30,DEVANDAN MALL,GROUND FLOOR,</p>
                      <p>OPP, SANYAS ASHRAM, NR,MJ LIBRARY ELLISBRIDE, AHMEDABAD</p>
                      <p>GSTIN/UIN        :  24AQCPS1398B1ZZ   PAN: AQCPS1398B</p>
                      <p>Gujarat-India <span></span></p>
                      <p>State <span>:  Gujarat, Code : 24</span></p>
                   </span>
                  </li>
                  <li className="d-block">
                    <span>
                      <p>Voucher Num: <span>P/2223/0009</span> </p>
                      <p>Voucher Date : <span>14-Apr-22</span></p>
                      <p>Place of Supply: <span>Gujarat</span></p>
                    </span>
                  </li>
                </ul>
              </li>
              <li className="d-block">
                <div className="tabel-deta-show" >
                  <div className="row">
                    <div className="header-tabel-deta">
                      <div>Description of Goods</div>
                      <div>HSN/SAC</div>
                      <div>Gold Purity</div>
                      <div>Gross Wt</div>
                      <div>Net Wt</div>
                      <div>Fine Wt</div>
                      <div>Rate</div>
                      <div>Sub Total</div>
                      <div>SGST %</div>
                      <div>CGST %</div>
                      <div>SGST Amount</div>
                      <div>CGST Amount</div>
                      <div>Total Amount</div>
                    </div>
                  </div>
                   <div className="row">
                    <div className="body-tabel-deta">
                      <div border="1">Gold Bullion </div>
                      <div border="1">710813</div>
                      <div border="1">100</div>
                      <div border="1">500.000</div>
                      <div border="1">500.000</div>
                      <div border="1">500.000</div>
                      <div border="1">53,625.569</div>
                      <div>  2,681,278.45 </div>
                      <div>1.50%</div>
                      <div>1.50%</div>
                      <div className="alignment-right-text">40,219.177</div>
                      <div className="alignment-right-text">40,219.177</div>
                      <div className="alignment-right-text">2,761,716.80 </div>
                    </div>
                     <div className="body-tabel-deta">
                      <div border="1">Silver Alloy </div>
                      <div border="1">HSN</div>
                      <div border="1">-</div>
                      <div border="1">100</div>
                      <div border="1">100</div>
                      <div border="1">&nbsp;</div>
                      <div border="1">30.000</div>
                      <div>  3,000.00 </div>
                      <div>1.50%</div>
                      <div>1.50%</div>
                      <div className="alignment-right-text">45.000</div>
                      <div className="alignment-right-text">45.000</div>
                      <div className="alignment-right-text">3,090.000</div>
                    </div>
                    <div className="body-tabel-deta">
                       <div border="1">Bronze Alloy </div>
                      <div border="1">HSN</div>
                      <div border="1">-</div>
                      <div border="1">65.779</div>
                      <div border="1">65.779</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1">30.000</div>
                      <div>  1,973.37 </div>
                      <div>18.00%</div>
                      <div>18.00%</div>
                      <div className="alignment-right-text">355.207</div>
                      <div className="alignment-right-text">355.207</div>
                      <div className="alignment-right-text">2,683.783</div>
                    </div>
                    <div className="body-tabel-deta">
                     <div border="1">Cubic Zirconia</div>
                      <div border="1">HSN</div>
                      <div border="1">-</div>
                      <div border="1">25.648</div>
                      <div border="1">25.648	</div>
                      <div border="1"> &nbsp;</div>
                      <div border="1">300.000</div>
                      <div>  7,694.40 </div>
                      <div>0.25%</div>
                      <div>0.25%</div>
                      <div className="alignment-right-text">19.236</div>
                      <div className="alignment-right-text">19.236</div>
                      <div className="alignment-right-text">7,732.872</div>
                    </div>
                     <div className="body-tabel-deta">
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
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                    </div>
                    <div className="body-tabel-deta">
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
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                    </div>
                    <div className="body-tabel-deta">
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
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                    </div>
                    <div className="body-tabel-deta">
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
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                    </div>
                    <div className="body-tabel-deta">
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
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                    </div>
                    <div className="body-tabel-deta">
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
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="d-block">
                <div className="tabel-deta-show tabel-deta-show_total" >
                   <div className="row">
                    <div className="body-tabel-deta">
                      <div><b>Total</b></div>
                      <div border="1"> &nbsp;</div>
                      <div>&nbsp;</div>
                      <div>691.427</div>
                      <div>665.779</div>
                      <div>500.000</div>
                      <div>&nbsp;</div>
                      <div>2,693,946.22 </div>
                      <div>&nbsp;</div>
                      <div>&nbsp;</div>
                      <div className="alignment-right-text">40,638.62 </div>
                      <div className="alignment-right-text">40,638.62 </div>
                      <div className="alignment-right-text">2,775,223.46 </div>
                    </div>
                  </div>
                </div>
              </li>
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
                <div className="tabel-deta-show tabel-deta-show_total" >
                   <div className="row">
                    <div className="body-tabel-deta">
                      <div className="flex_balancep_payable">Notes:<br/>
                      1.Being Goods are send for the Purpose of Jobwork of Gold Jewellery and not for Sale.<br/>
                      2.No Eway bill is required to be Generated as the Goods covered under this Challan are 
                      Exemted as per Serial No. 4/5 to the Annexure to Rule 138(14) of the CGST Rules.</div>
                    
                    </div>
                  </div>
                </div>
              </li>
              <li className="d-block">
                <div className="tabel-deta-show tabel-naration_total" >
                   <div className="row">
                    <div className="body-tabel-deta">
                      <div>Naration: <span></span></div>
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
                        <span> INR One Crore Forty Four Lakh One Thousand Six Hundred Only.                          
                        </span>
                      </span>
                      <span className="EOE_alignment"> E. & O.E</span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="d-block">
                <div className="tabel-deta-show tabel-deta-show_total" >
                   <div className="row">
                    <div className="body-tabel-deta">
                      <div>Tax Amount (in words) :  <span>  INR Four Lakh Nineteen Thousand Four Hundred Sixty Four and Eight paise Only.</span></div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="d-block">
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
              </li>
               <li className="d-block">
                <div className="tabel-deta-show multiple-tabel-blg" >
                   <div className="row">
                    <div className="body-tabel-deta">
                      <div className="flex_balancep_payable"><span>For VK Jewels Pvt Ltd</span></div>
                        <div className="flex_balancep_payable"><span>Receiver Signature : </span></div>
                          <div className="flex_balancep_payable"><span>Authorised Signatory</span></div>
                    </div>
                  </div>
                </div>
              </li>
          </ul> */}
 {/* Artisan Issue  */}

          {/* Metal_purchase */}
           {/* <ul className="jewellery_main_print_dv">
              <li className="d-block">
                <ul className="jewellery_main_print-title">
                  <li className="d-block">
                    <h1>
                   VK Jewels Pvt. Ltd.
                  </h1>
                  <p>'Shri', Madhuvan Park Main Road, Opp. Blossom School,</p>
                  <p>Behind Kuvadva Road, Rajkot, Gujarat - 360003</p>
                  <p>connect@vkjewels.net | www.vkjewels.net</p>
                  <p>GST No: 24AAGCV5545E1ZD; PAN: AAGCV5545E; CIN: U27320GJ2018PTC103774</p>
                  </li>
                </ul>
              </li>
              <li className="d-block">
                <ul className="jewellery_print_secand">
                  <li className="d-block">
                    <h1>Metal Purchase Voucher</h1>
                  </li>
                </ul>
              </li>
              <li className="d-block">
                <ul className="jewellery_print_thard">
                  <li className="d-block">
                   <span>
                     <p>Supplier Party Details</p>
                      <p><b>AARAV BULLION</b></p>
                      <p>30,DEVANDAN MALL,GROUND FLOOR,</p>
                      <p>OPP, SANYAS ASHRAM, NR,MJ LIBRARY ELLISBRIDE, AHMEDABAD</p>
                      <p>GSTIN/UIN        :  <span>24AQCPS1398B1ZZ   PAN No.AQCPS1398B</span></p>
                      <p>Gujarat-India</p>
                      <p>State <span>:  Gujarat, Code : 24"</span></p>
                   </span>
                  </li>
                  <li className="d-block">
                    <span>
                      <p>"Voucher Num. : <span>P/2223/0008</span> </p>
                    <p>Party Inv. Num. : <span>GT/22-21/0001</span></p>
                    <p>Voucher Date :  <span>14-Apr-22</span></p>
                    <p>Place of Supply :  <span>Gujarat"</span></p>
                    </span>
                  </li>
                </ul>
              </li>
              <li className="d-block">
                <div className="tabel-deta-show" >
                  <div className="row">
                    <div className="header-tabel-deta">
                      <div>Description of Goods</div>
                      <div>HSN/SAC</div>
                      <div>Purity</div>
                      <div>Gross Wt</div>
                      <div>Net Wt</div>
                      <div>Fine Wt</div>
                      <div>Rate</div>
                      <div>Total Amount</div>
                    </div>
                  </div>
                   <div className="row">
                    <div className="body-tabel-deta">
                      <div border="1">Gold Bullion (F100Y)</div>
                      <div border="1">710813</div>
                      <div border="1">100</div>
                      <div border="1">2,800.000</div>
                      <div border="1">2,800.000</div>
                      <div border="1">2,800.000</div>
                      <div border="1">4,993.62	</div>
                      <div border="1" className=" alignment-right-text">13,982,136.00 </div>
                    </div>
                    <div className="body-tabel-deta body-tabel-deta-bdr">
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1" className="text-left-dv-blg">Taxable Amount	</div>
                        <div border="1"  className=" alignment-right-text">   13,982,136.00 </div>
                    </div>
                    <div className="body-tabel-deta body-tabel-deta-bdr">
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1" className="text-left-dv-blg">SGST</div>
                        <div border="1"  className=" alignment-right-text">  209,732.04 </div>
                    </div>
                    <div className="body-tabel-deta body-tabel-deta-bdr">
                        <div> &nbsp;</div>
                        <div> &nbsp;</div>
                        <div> &nbsp;</div>
                        <div> &nbsp;</div>
                        <div> &nbsp;</div>
                        <div> &nbsp;</div>
                        <div className="text-left-dv-blg">CGST</div>
                        <div className=" alignment-right-text">  209,732.04 </div>
                    </div>
                    <div className="body-tabel-deta body-tabel-deta-bdr">
                        <div> &nbsp;</div>
                        <div> &nbsp;</div>
                        <div> &nbsp;</div>
                        <div> &nbsp;</div>
                        <div> &nbsp;</div>
                        <div> &nbsp;</div>
                        <div className="text-left-dv-blg">Round Off</div>
                        <div className=" alignment-right-text">-0.08</div>
                    </div>
                    
                  </div>
                </div>
              </li>
              <li className="d-block">
                <div className="tabel-deta-show tabel-deta-show_total totallast_col" >
                   <div className="row">
                    <div className="body-tabel-deta">
                      <div><b>Total</b></div>
                      <div>&nbsp;</div>
                      <div>&nbsp;</div>
                      <div>2,800.000</div>
                      <div>2,800.000</div>
                      <div>2,800.000</div>
                      <div className="text-left-dv-blg"><b>Total Invoice Amount	</b></div>
                      <div className=" alignment-right-text">  14,401,600.00 </div>
                    </div>
                  </div>
                </div>
              </li>
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
                      <div>TDSVoucher Num: TDS/04/22-23/00006	<span></span></div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="d-block">
                <div className="tabel-deta-show tabel-deta-show_total" >
                   <div className="row">
                    <div className="body-tabel-deta">
                      <div className="addvendor-row"><span>TDS on Purchase 194 (Q)</span> <span>  13,982.00 </span></div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="d-block">
                <div className="tabel-deta-show tabel-deta-show_total" >
                   <div className="row">
                    <div className="body-tabel-deta">
                      <div>&nbsp;</div>
                      <div>&nbsp;</div>
                      <div>&nbsp;</div>
                      <div>&nbsp;</div>
                      <div>&nbsp;</div>
                      <div>&nbsp;</div>
                      <div>&nbsp;</div>
                      <div>&nbsp;</div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="d-block">
                <div className="tabel-deta-show tabel-naration_total" >
                   <div className="row">
                    <div className="body-tabel-deta">
                      <div>Naration: <span></span></div>
                    </div>
                  </div>
                </div>
              </li>
               <li className="d-block">
                <div className="tabel-deta-show tabel-deta-show_total" >
                   <div className="row">
                    <div className="body-tabel-deta">
                      <div>Amount Chargeable (in words) :-   <span> E. & O.E</span></div>
                      <div>INR One Crore Forty Four Lakh One Thousand Six Hundred Only.</div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="d-block">
                <div className="tabel-deta-show tabel-deta-show_total" >
                   <div className="row">
                    <div className="body-tabel-deta">
                      <div>Tax Amount (in words) :  <span> INR Four Lakh Nineteen Thousand Four Hundred Sixty Four and Eight paise Only.</span></div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="d-block">
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
                      <div className="flex_balancep_payable"><span>Balance Payable Rs : </span> <span>  14,387,618.00 	</span></div>
                    </div>
                  </div>
                </div>
              </li>
               <li className="d-block">
                <div className="tabel-deta-show multiple-tabel-blg" >
                   <div className="row">
                    <div className="body-tabel-deta">
                      <div className="flex_balancep_payable"><span>For VK Jewels Pvt Ltd</span></div>
                        <div className="flex_balancep_payable"><span>Receiver Signature : </span></div>
                          <div className="flex_balancep_payable"><span>Authorised Signatory</span></div>
                    </div>
                  </div>
                </div>
              </li>
          </ul> */}
        {/* Metal_purchase */}


        {/* jewellery_main_print */}
          {/* <ul className="jewellery_main_print_dv">
              <li className="d-block">
                <ul className="jewellery_main_print-title">
                  <li className="d-block">
                    <h1>
                    VK Jewels Pvt. Ltd.
                  </h1>
                  <p>Shri', Madhuvan Park Main Road, Opp. Blossom School,</p>
                  <p>Behind Kuvadva Road, Rajkot, Gujarat - 360003</p>
                  <p>connect@vkjewels.net | www.vkjewels.net</p>
                  <p>GST No: 24AAGCV5545E1ZD; PAN: AAGCV5545E; CIN: U27320GJ2018PTC103774</p>
                  </li>
                </ul>
              </li>
              <li className="d-block">
                <ul className="jewellery_print_secand">
                  <li className="d-block">
                    <h1>Jewellery Purchase Voucher</h1>
                  </li>
                </ul>
              </li>
              <li className="d-block">
                <ul className="jewellery_print_thard">
                  <li className="d-block">
                   <span>
                     <p>"Supplier Party Details:</p>
                      <p>AARAV BULLION</p>
                      <p>30,DEVANDAN MALL,GROUND FLOOR,</p>
                      <p>OPP, SANYAS ASHRAM, NR,MJ LIBRARY ELLISBRIDE, AHMEDABAD</p>
                      <p>GSTIN/UIN : <span>24AQCPS1398B1ZZ   PAN No.AQCPS1398B</span></p>
                      <p>Gujarat-India</p>
                      <p>State <span>:  Gujarat, Code : 24"</span></p>
                   </span>
                  </li>
                  <li className="d-block">
                    <span>
                      <p>"Voucher Num. : <span>P/2223/0009</span> </p>
                    <p>Party Inv. Num. : <span>GT/22-21/0002</span></p>
                    <p>Voucher Date :  <span>14-Apr-22</span></p>
                    <p>Place of Supply :  <span>Gujarat"</span></p>
                    </span>
                  </li>
                </ul>
              </li>
              <li className="d-block">
                <div className="tabel-deta-show" >
                  <div className="row">
                    <div className="header-tabel-deta">
                      <div>Description of Goods</div>
                      <div>HSN/SAC</div>
                      <div>Purity</div>
                      <div>Pcs</div>
                      <div>Gross Wt</div>
                      <div>Net Wt</div>
                      <div>Rate</div>
                      <div>Total Amount</div>
                    </div>
                  </div>
                   <div className="row">
                    <div className="body-tabel-deta">
                      <div border="1">Gold Findings (BL58.5Y)</div>
                      <div border="1">711319</div>
                      <div border="1">100</div>
                      <div border="1">500</div>
                      <div border="1">2,800.000</div>
                      <div border="1">2,800.000</div>
                      <div border="1">4,993.62	</div>
                      <div border="1" className=" alignment-right-text">13,982,136.00 </div>
                    </div>
                    <div className="body-tabel-deta body-tabel-deta-bdr">
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1" className="text-left-dv-blg">Taxable Amount	</div>
                        <div border="1" className=" alignment-right-text">   13,982,136.00 </div>
                    </div>
                    <div className="body-tabel-deta body-tabel-deta-bdr">
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1" className="text-left-dv-blg">SGST</div>
                        <div border="1" className=" alignment-right-text">  209,732.04 </div>
                    </div>
                    <div className="body-tabel-deta body-tabel-deta-bdr">
                        <div> &nbsp;</div>
                        <div> &nbsp;</div>
                        <div> &nbsp;</div>
                        <div> &nbsp;</div>
                        <div> &nbsp;</div>
                        <div> &nbsp;</div>
                        <div className="text-left-dv-blg">CGST</div>
                        <div className=" alignment-right-text">  209,732.04 </div>
                    </div>
                    <div className="body-tabel-deta body-tabel-deta-bdr">
                        <div> &nbsp;</div>
                        <div> &nbsp;</div>
                        <div> &nbsp;</div>
                        <div> &nbsp;</div>
                        <div> &nbsp;</div>
                        <div> &nbsp;</div>
                        <div className="text-left-dv-blg">Round Off</div>
                        <div className=" alignment-right-text">-0.08</div>
                    </div>
                    
                  </div>
                </div>
              </li>
              <li className="d-block">
                <div className="tabel-deta-show tabel-deta-show_total totallast_col" >
                   <div className="row">
                    <div className="body-tabel-deta">
                      <div><b>Total</b></div>
                      <div>&nbsp;</div>
                      <div>&nbsp;</div>
                      <div>&nbsp;</div>
                      <div>2,800.000</div>
                      <div>2,800.000</div>
                      <div className="text-left-dv-blg"><b>Total Invoice Amount	</b></div>
                      <div className=" alignment-right-text">  14,401,600.00 </div>
                    </div>
                  </div>
                </div>
              </li>
               <li className="d-block">
                <div className="tabel-deta-show tabel-deta-show_total" >
                   <div className="row">
                    <div className="body-tabel-deta">
                      <div>&nbsp;</div>
                      <div>&nbsp;</div>
                      <div>&nbsp;</div>
                      <div>&nbsp;</div>
                      <div>&nbsp;</div>
                      <div>&nbsp;</div>
                      <div>&nbsp;</div>
                      <div>&nbsp;</div>
                    </div>
                  </div>
                </div>
              </li>
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
                      <div>TDSVoucher Num: TDS/04/22-23/00006	<span></span></div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="d-block">
                <div className="tabel-deta-show tabel-deta-show_total" >
                   <div className="row">
                    <div className="body-tabel-deta">
                      <div className="addvendor-row"><span>TDS on Purchase 194 (Q) </span><span>  13,982.00 </span></div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="d-block">
                <div className="tabel-deta-show tabel-deta-show_total" >
                   <div className="row">
                    <div className="body-tabel-deta">
                      <div>&nbsp;</div>
                      <div>&nbsp;</div>
                      <div>&nbsp;</div>
                      <div>&nbsp;</div>
                      <div>&nbsp;</div>
                      <div>&nbsp;</div>
                      <div>&nbsp;</div>
                      <div>&nbsp;</div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="d-block">
                <div className="tabel-deta-show tabel-naration_total" >
                   <div className="row">
                    <div className="body-tabel-deta">
                      <div>Naration: <span></span></div>
                    </div>
                  </div>
                </div>
              </li>
               <li className="d-block">
                <div className="tabel-deta-show tabel-deta-show_total" >
                   <div className="row">
                    <div className="body-tabel-deta">
                      <div>Amount Chargeable (in words) :-   <span> E. & O.E</span></div>
                      <div>INR One Crore Forty Four Lakh One Thousand Six Hundred Only.</div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="d-block">
                <div className="tabel-deta-show tabel-deta-show_total" >
                   <div className="row">
                    <div className="body-tabel-deta">
                      <div>Tax Amount (in words) :  <span> INR Four Lakh Nineteen Thousand Four Hundred Sixty Four and Eight paise Only.</span></div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="d-block">
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
                      <div className="flex_balancep_payable"><span>Balance Payable Rs : </span> <span>  14,387,618.00 	</span></div>
                    </div>
                  </div>
                </div>
              </li>
               <li className="d-block">
                <div className="tabel-deta-show multiple-tabel-blg" >
                   <div className="row">
                    <div className="body-tabel-deta">
                      <div className="flex_balancep_payable"><span>For VK Jewels Pvt Ltd</span></div>
                        <div className="flex_balancep_payable"><span>Receiver Signature : </span></div>
                          <div className="flex_balancep_payable"><span>Authorised Signatory</span></div>
                    </div>
                  </div>
                </div>
              </li>
          </ul> */}

           {/* jewellery_main_print */}

           {/* secand_jewellery_main_print */}
           {/* <ul className="jewellery_main_print_dv">
              <li className="d-block">
                <ul className="jewellery_main_print-title">
                  <li className="d-block">
                    <h1>
                      VK Jewels Pvt. Ltd.
                    </h1>
                  <p>'Shri', Madhuvan Park Main Road, Opp. Blossom School,</p>
                  <p>Behind Kuvadva Road, Rajkot, Gujarat - 360003</p>
                  <p>connect@vkjewels.net | www.vkjewels.net</p>
                  <p>GST No: 24AAGCV5545E1ZD; PAN: AAGCV5545E; CIN: U27320GJ2018PTC103774</p>
                  </li>
                </ul>
              </li>
              <li className="d-block">
                <ul className="jewellery_print_secand">
                  <li className="d-block">
                    <h1>Jewellery Purchase Voucher</h1>
                  </li>
                </ul>
              </li>
              <li className="d-block">
                <ul className="jewellery_print_thard">
                  <li className="d-block">
                   <span>
                      <p>Supplier Party Details:</p>
                      <p><b>AARAV BULLION</b></p>
                      <p>30,DEVANDAN MALL,GROUND FLOOR,</p>
                      <p>OPP, SANYAS ASHRAM, NR,MJ LIBRARY ELLISBRIDE, AHMEDABAD</p>
                      <p>GSTIN/UIN        :  <span>24AQCPS1398B1ZZ   PAN No.AQCPS1398B</span></p>
                      <p>Gujarat-India</p>
                      <p>State <span>:  Gujarat, Code : 24"</span></p>
                   </span>
                  </li>
                  <li className="d-block">
                    <span>
                      <p>"Voucher Num. : <span>P/2223/0009</span> </p>
                    <p>Party Inv. Num. : <span>GT/22-21/0002</span></p>
                    <p>Voucher Date :  <span>14-Apr-22</span></p>
                    <p>Place of Supply :  <span>Gujarat"</span></p>
                    </span>
                  </li>
                </ul>
              </li>
              <li className="d-block">
                <div className="tabel-deta-show" >
                  <div className="row">
                    <div className="header-tabel-deta">
                      <div>Description of Goods</div>
                      <div>HSN/SAC</div>
                      <div>Purity</div>
                      <div>Pcs</div>
                      <div>Gross Wt</div>
                      <div>Net Wt</div>
                      <div>Rate</div>
                      <div>Hallmark Charges</div>
                      <div>Total Amount</div>
                    </div>
                  </div>
                   <div className="row">
                    <div className="body-tabel-deta">
                      <div border="1">FN Sui Dhaga </div>
                      <div border="1">711319</div>
                      <div border="1">750 18K</div>
                      <div border="1">66</div>
                      <div border="1">48.792</div>
                      <div border="1">43.890</div>
                      <div border="1">4116.815</div>
                      <div border="1">5,940.00</div>
                      <div border="1" className=" alignment-right-text">186,627.00 </div>
                    </div>
                     <div className="body-tabel-deta">
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
                    </div>
                    <div className="body-tabel-deta body-tabel-deta-bdr">
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1" className="text-left-dv-blg">Taxable Amount	</div>
                        <div border="1" className=" alignment-right-text">186,627.00</div>
                    </div>
                    <div className="body-tabel-deta body-tabel-deta-bdr">
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1"> &nbsp;</div>
                        <div border="1" className="text-left-dv-blg">IGST</div>
                        <div border="1" className=" alignment-right-text">5,598.81</div>
                    </div>
                    <div className="body-tabel-deta body-tabel-deta-bdr">
                        <div border="1"> &nbsp;</div>
                        <div> &nbsp;</div>
                        <div> &nbsp;</div>
                        <div> &nbsp;</div>
                        <div> &nbsp;</div>
                        <div> &nbsp;</div>
                        <div> &nbsp;</div>
                        <div className="text-left-dv-blg">Round Off</div>
                        <div className=" alignment-right-text">0.19</div>
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
                      <div>60</div>
                      <div>48.792</div>
                      <div>43.890		</div>
                      <div className="text-left-dv-blg"><b>Total Invoice Amount</b><span></span></div>
                      <div  className="bdr_remove_blg">&nbsp;</div>
                      <div className=" alignment-right-text">  192,226.00 </div>
                    </div>
                  </div>
                </div>
              </li>
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
                      <div>TDSVoucher Num: TDS/04/22-23/00006	<span></span></div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="d-block">
                <div className="tabel-deta-show tabel-deta-show_total" >
                   <div className="row">
                    <div className="body-tabel-deta">
                      <div className="addvendor-row"><span>TDS on Purchase 194 (Q) </span><span>  13,982.00 </span></div>
                    </div>
                  </div>
                </div>
              </li>
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
                      <div>Naration: <span></span></div>
                    </div>
                  </div>
                </div>
              </li>
               <li className="d-block">
                <div className="tabel-deta-show tabel-deta-show_total" >
                   <div className="row">
                    <div className="body-tabel-deta">
                      <div className="flex_balancep_payable">Amount Chargeable (in words) :-  <br/>
                      INR One Crore Forty Four Lakh One Thousand Six Hundred Only. <span> E. & O.E</span></div>
                    
                    </div>
                  </div>
                </div>
              </li>
              <li className="d-block">
                <div className="tabel-deta-show tabel-deta-show_total" >
                   <div className="row">
                    <div className="body-tabel-deta">
                      <div>Tax Amount (in words) :  <span> INR Four Lakh Nineteen Thousand Four Hundred Sixty Four and Eight paise Only.</span></div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="d-block">
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
                      <div className="flex_balancep_payable"><span>Balance Payable Rs : </span> <span>    192,039.00 		</span></div>
                    </div>
                  </div>
                </div>
              </li>
               <li className="d-block">
                <div className="tabel-deta-show multiple-tabel-blg" >
                   <div className="row">
                    <div className="body-tabel-deta">
                      <div className="flex_balancep_payable"><span>For VK Jewels Pvt Ltd</span></div>
                        <div className="flex_balancep_payable"><span>Receiver Signature : </span></div>
                          <div className="flex_balancep_payable"><span>Authorised Signatory</span></div>
                    </div>
                  </div>
                </div>
              </li>
          </ul> */}
            {/* secand_jewellery_main_print */}
        </div>
      </div>
    );
  }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
  // eslint-disable-line max-len
  return <ComponentToPrint ref={ref} text={props.text} />;
});
