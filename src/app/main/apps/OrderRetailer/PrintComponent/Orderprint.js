import * as React from "react";
import { ToWords } from "to-words";

import Config from "app/fuse-configs/Config";

export class Orderprint extends React.PureComponent {
  // constructor(props) {
  //   super(props);

  // }

  // canvasEl;

  componentDidMount() {}

  render() {
    // const { text } = this.props;
    const { printObj } = this.props;
    const image = printObj.image;
    console.log(printObj, "printobj");
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
    console.log(myprofileData);
    return (
      <>
        <div
          className="increase-padding-dv jewellery_main_print-blg"
          style={{ width: "805px", height: "530px" }}
        >
          {/* Metal_purchase */}
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
              {/* <div style={{ width: "25%" }}></div>
              <div style={{ width: "25%", marginTop: "20px" }}>
                <h4>|| Shree Gajanan Namah ||</h4>
                <h1> {myprofileData.firm_name}</h1>
                <h4>{myprofileData.address}</h4>
              </div>
              <div style={{ width: "20%" }}></div>
              <div style={{ width: "30%",textAlign:"end"}}>
                <h4 style={{ borderBottom: "1px solid black" }}>Subject to {myprofileData.CityName?.name}  jurisdiction</h4>
                <h2><b>Order</b></h2>
                <h4><b>GST No.:</b> {myprofileData.gst_number}</h4>
                <h4><b>Mob.:</b> {myprofileData.mobile_no}</h4>
                <h4><b>Email:</b> {myprofileData.email}</h4>
              </div> */}
            </div>
            <div className="add-client-row"></div>
            <div style={{ margin: "5px", height: "290px" }}>
              <div style={{ width: "100%" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <h5>Order</h5>
                    <h5>To,</h5>
                    <h5>{printObj.customername}</h5>
                  </div>
                  <div>
                    <h6>TAX INVOICE</h6>
                  </div>
                  <div>
                    <h5>GSTIN : {printObj.GSTno}</h5>
                    <h5>Inv No.: {printObj.ordernumber}</h5>
                    <h5>Date: {printObj.createddate}</h5>
                  </div>
                </div>
              </div>
              <li className="d-block mb-10">
                <div className="tabel-deta-show">
                  <div className="row">
                    <div className="header-tabel-deta">
                      <div style={{ maxWidth: "50px" }}>
                        {" "}
                        <b> NO </b>
                      </div>
                      <div>
                        {" "}
                        <b> OrderNumber </b>
                      </div>
                      {/* <div>
                        {" "}
                        <b> Image </b>
                      </div> */}
                      {/* <div>
                        {" "}
                        <b> Reference Name </b>
                      </div> */}
                      <div>
                        {" "}
                        <b> Gold Type: </b>
                      </div>
                      <div className="retailer-print">
                        {" "}
                        <b> Only Gold Received</b>
                      </div>
                      <div>
                        {" "}
                        <b> Karat /Purity </b>
                      </div>
                      <div style={{ minWidth: "130px" }}>
                        {" "}
                        <b style={{ marginRight: "5px" }}> Amount Received </b>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="body-tabel-deta">
                      <div
                        border="1"
                        style={{ maxWidth: "50px", justifyContent: "center", fontWeight:"500"}}
                      >
                        1
                      </div>
                      <div border="1" style={{ justifyContent: "center", fontWeight:"500"}}>
                        {printObj.ordernumber}
                      </div>
                      {/* <div border="1"></div>
                      <div border="1"></div> */}
                      <div border="1" style={{fontWeight:"500"}}>{printObj.goldtype}</div>
                      <div border="1" style={{fontWeight:"500"}}>{printObj.finegold}</div>
                      <div border="1" style={{fontWeight:"500"}}>{printObj.purity}</div>
                      <div
                        border="1"
                        style={{ justifyContent: "end", minWidth: "130px", fontWeight:"500"}}
                      >
                        <span style={{ marginRight: "5px" }}>
                          {Config.numWithComma(printObj.amount)}
                        </span>
                      </div>
                    </div>
                  </div>
                  {console.log(printObj.image)}
                  <div style={{display:"flex", flexWrap:"wrap", gap: "1%"}}>
                  {image.map((row, index) => (
                    <div className="row" key={index} style={{flexBasis:"32.66%", justifyContent:"center", textAlign:"center",marginTop:"5px"}}>
                      <div className="body-tabel-deta" style={{flexDirection:"row",borderTop:"1px solid black"}}>
                      <div border="1" style={{flexBasis:"50%",justifyContent:"center"}}>Image</div>
                        <div border="1" style={{flexBasis:"50%"}}>Reference Name</div>
                      </div>
                      <div className="body-tabel-deta" style={{flexDirection:"row"}}>
                        {/* <div border="1" style={{ maxWidth: "50px" }}>
                          {" "}
                          &nbsp;
                        </div>
                        <div border="1"></div> */}
                        <div border="1" style={{flexBasis:"50%",display:"flex", justifyContent:"center"}}>
                          {" "}
                          <img
                            src={row.imageURL}
                            style={{ width: "60px", padding: "10px", height:"40px"}}
                            className=""
                            alt=""
                          />
                        </div>
                        <div style={{ alignItems: "center", fontWeight:"400",flexBasis:"50%"}}>
                          {row.reference_name}
                        </div>
                        {/* <div border="1"></div>
                        <div border="1"></div>
                        <div border="1"></div>
                        <div
                          border="1"
                          style={{ justifyContent: "end", minWidth: "130px" }}
                        ></div> */}
                      </div>
                    </div>
                  ))}
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
              > */}
                {/* <div
                  style={{
                    display: "flex",
                    width: "50%",
                    justifyContent: "space-around",
                  }}
                >
                  <div>
                    <h5 style={{ borderBottom: "1px solid black" }}>Advance Collection</h5>
                    <h5>Fine Gold Received in Gram:</h5>
                    <h5>Amount Received:</h5>
                  </div>
                  <div>
                    <h5>{printObj.finegold}</h5>
                    <h5>{Config.numWithComma(printObj.amount)}</h5>
                  </div>
                </div> */}
                {/* <div
                  style={{
                    display: "flex",
                    width: "50%",
                    justifyContent: "space-around",
                  }}
                >
                  <div>
                    <h5 style={{ borderBottom: "1px solid black" }}>
                    Advance Collection
                    </h5>
                    <h5>Fine Gold Received in Gram:</h5>
                    <h5>Amount Received:</h5>
                  </div>
                  <div>
                    <h5>&nbsp;</h5>
                    <h5>{printObj.finegold}</h5>
                    <h5>{Config.numWithComma(printObj.amount)}</h5>
                    <h5></h5>
                  </div>
                </div> */}

                {/* <div
                  style={{
                    display: "flex",
                    width: "50%",
                    justifyContent: "space-around",
                  }}
                >
                  <div>
                    <h5 style={{ borderBottom: "1px solid black" }}>
                      Total Received
                    </h5>
                    <h5>Cash:</h5>
                    <h5>Cheque/Bank:</h5>
                    <h5>Card Details:</h5>
                  </div>
                  <div>
                    <h5>&nbsp;</h5>
                    <h5>{Config.numWithComma(printObj.amount)}</h5>
                    <h5></h5>
                    <h5></h5>
                  </div>
                </div> */}
              {/* </div> */}

              <li className="d-block" style={{borderTop:"1px solid black"}}>
                <div className="tabel-deta-show tabel-deta-show_total">
                  <div className="row">
                    <div className="body-tabel-deta">
                      <div className="flex_balancep_payable">
                        <span className="print-div-left-increase">
                          Amount Chargeable (in words) :<br />
                          <span>
                            {printObj.amount !== "" &&
                              !isNaN(printObj.amount) &&
                              toWords.convert(Math.round(printObj.amount))}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </div>
            {/* 
              <li className="d-block mt-10">
                <div className="tabel-deta-show multiple-tabel-blg">
                  <div className="row">
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{borderTop:"1px solid black"}}>Customer Sign.</span>
                      <span style={{borderTop:"1px solid black",width:"130px",textAlign:"center"}}>For, {myprofileData.firm_name}</span>
                    </div>
                  </div>
                </div>
              </li> */}

            <div className="add-client-row"></div>
            <div
              style={{ width: "100%", padding: "10px", height: "75px" }}
            ></div>
          </ul>
        </div>
      </>
    );
  }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
  // eslint-disable-line max-len text={props.text}
  return <Orderprint ref={ref} printObj={props.printObj} />;
});
