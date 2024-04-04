import * as React from "react";
import { ToWords } from "to-words";
import Config from "app/fuse-configs/Config";

export class ReceiptPrint extends React.PureComponent {
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
          <style type="text/css" media="print">
            {
              "\
            @page { size: A5 landscape !important; margin:10px 25px 10px 25px; }          "
            }
          </style>
          <ul>
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-around",
                padding: "10px",
                height: "106px",
              }}
            >
              <div style={{ width: "25%" }}></div>
              <div style={{ width: "25%", marginTop: "20px" }}>
                {/* <h4>|| Shree Gajanan Namah ||</h4>
                <h1> {myprofileData.firm_name}</h1>
                <h4>{myprofileData.address}</h4> */}
              </div>
              <div style={{ width: "20%" }}></div>
              {/* <div style={{ width: "30%",textAlign:"end"}}>
                <h4 style={{ borderBottom: "1px solid black" }}>Subject to {myprofileData.CityName?.name} jurisdiction</h4>
                <h2><b>Jewellery Purchase</b></h2>
                <h4><b>GST No.:</b> {myprofileData.gst_number}</h4>
                <h4><b>Mob.:</b> {myprofileData.mobile_no}</h4>
                <h4><b>Email:</b> {myprofileData.email}</h4>
              </div> */}
            </div>
            <div className="add-client-row"></div>
            <div style={{ margin: "5px", height: "50px"}}>
              <div style={{ width: "100%" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <div>
                    <h6>Name : {printObj.payerName}</h6>
                    <h6>Mobile No : {printObj.phoneNumOne}</h6>
                    <h6>pincode : {printObj.pincode}</h6>
                  </div>
                  <div>
                    <h6>Payment Receipt</h6>                  </div>
                  <div>
                    <h6>{printObj.isGoldSilver} Scheme</h6>
                    <h6>Document No : {printObj.docNumber}</h6>
                    <h6>Issue Date : {printObj.date}</h6>
                  </div>
                </div>
              </div>
              </div>
              <li className="d-block" style={{margin: 5, height: 30}}>
              </li>
              <li className="d-block" style={{margin: 5}}>
                <div className="tabel-deta-show">
                  <div className="row">
                    <div className="header-tabel-deta">
                      <div >
                        {" "}
                        <b> Date </b>
                      </div>
                      <div >
                        {" "}
                        <b> Installment No</b>
                      </div>
                      <div >
                        {" "}
                        <b> Amount </b>
                      </div>
                    </div>
                  </div>

                <div className="row">
                    <div className="body-tabel-deta">
                    <div border="1" style={{fontWeight:"500"}}>{printObj.received_Date}</div>
                    <div border="1" style={{fontWeight:"500"}}>{printObj.installmentNo}</div>
                    <div
                        border="1"
                        style={{justifyContent: "end", fontWeight:"500"}}
                    >
                        <span style={{ marginRight: "5px"}}>
                        {Config.numWithComma(printObj.receivedAmt)}
                        </span>
                    </div>
                    </div>
                </div>
                </div>
              </li>
              <li className="d-block" style={{margin: 5, height: 90}}>
              </li>
              <div style={{ margin: "5px", height: "40px", marginBottom:40 }}>
              <li className="d-block" style={{borderTop:"1px solid black"}}>
                <div className="tabel-deta-show tabel-deta-show_total">
                  <div className="row">
                    <div className="body-tabel-deta">
                      <div className="flex_balancep_payable">
                        <span className="print-div-left-increase">
                          Total  :
                          <span style={{ float : "right" }}>
                            {Config.numWithComma(printObj.receivedAmt)}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="d-block" style={{borderTop:"1px solid black"}}>
                <div className="tabel-deta-show tabel-deta-show_total">
                  <div className="row">
                    <div className="body-tabel-deta">
                      <div className="flex_balancep_payable">
                        <span className="print-div-left-increase">
                          Total (in words) :
                          <span>
                            {printObj.receivedAmt !== "" &&
                              !isNaN(printObj.receivedAmt) &&
                              toWords.convert(printObj.receivedAmt)}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              </div>
            <div className="add-client-row"></div>
            <div
              style={{
                width: "805px",
                height: "75px",
              }}
            >
            </div>
          </ul>
        </div>
      </>
    );
  }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
  return <ReceiptPrint ref={ref} printObj={props.printObj} />;
});
