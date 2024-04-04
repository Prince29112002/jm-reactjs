import * as React from "react";
import { ToWords } from "to-words";
import Config from "app/fuse-configs/Config";
import HeaderPrint from "../../Helper/HeaderPrint";
import FooterPrint from "../../Helper/FooterPrint";

export class ArticianReturnRetailerPrintComp extends React.PureComponent {
  componentDidMount() {}

  render() {
    const { printObj } = this.props;
    console.log(printObj, "printObj");
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
          <HeaderPrint myprofileData={myprofileData}/>
            <div className="add-client-row"></div>
            <div style={{ margin: "5px", height: "290px" }}>
              <div style={{ width: "100%" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <h6>Artician Return Metal</h6>
                    <h6>To,</h6>
                    <h6>{printObj.supplierName}</h6>
                  </div>
                  <div>
                    <h6>TAX INVOICE</h6>
                  </div>
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
                      <div style={{ minWidth: "110px" }}>
                        {" "}
                        <b> Category </b>
                      </div>
                      <div style={{ minWidth: "210px" }}>
                        {" "}
                        <b> Category Name </b>
                      </div>
                      <div>
                        {" "}
                        <b style={{ marginRight: "5px" }}> PCS </b>
                      </div>
                      <div>
                        {" "}
                        <b style={{ marginRight: "5px" }}> GWT </b>
                      </div>
                      <div>
                        {" "}
                        <b style={{ marginRight: "5px" }}> NWT  </b>
                      </div>
                      <div>
                        {" "}
                        <b style={{ marginRight: "5px" }}> Purity </b>
                      </div>
                      <div>
                        {" "}
                        <b style={{ marginRight: "5px" }}> Fine Gold </b>
                      </div>
                      <div style={{ minWidth: "130px" }}>
                        {" "}
                        <b style={{ marginRight: "5px" }}> Amount </b>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                   
   {printObj.orderDetailsjewelry.map((element, index) =>
                    element.stockCode ? (
                      <div className="body-tabel-deta">
                        <div
                          border="1"
                          style={{
                            maxWidth: "50px",
                            justifyContent: "center",
                            fontWeight: "500",
                          }}
                        >
                          {index + 1}
                        </div>
                        <div style={{ fontWeight: "500", minWidth: "110px" }}>
                          {element.stockCode.label}
                        </div>
                        <div style={{ fontWeight: "500",minWidth: "210px"}}>
                          {element.categoryName}
                        </div>
                        <div
                          style={{ justifyContent: "end", fontWeight: "500" }}
                        >
                          <span style={{ marginRight: "5px" }}>
                            {element.pcs}
                          </span>
                        </div>
                        <div
                          border="1"
                          style={{ justifyContent: "end", fontWeight: "500" }}
                        >
                          <span style={{ marginRight: "5px" }}>
                            {element.grossWeight}
                          </span>
                        </div>
                        <div
                          border="1"
                          style={{ justifyContent: "end", fontWeight: "500" }}
                        >
                          <span style={{ marginRight: "5px" }}>
                            {element.netWeight}
                          </span>
                        </div>
                        <div
                          border="1"
                          style={{ justifyContent: "end", fontWeight: "500" }}
                        >
                          <span style={{ marginRight: "5px" }}>
                            {element.purity}
                          </span>
                        </div>
                        <div
                          border="1"
                          style={{ justifyContent: "end", fontWeight: "500" }}
                        >
                          <span style={{ marginRight: "5px" }}>
                            {element.fineGold}
                          </span>
                        </div>
                        <div
                          border="1"
                          style={{
                            justifyContent: "end",
                            minWidth: "130px",
                            fontWeight: "500",
                          }}
                        >
                          {" "}
                          <span style={{ marginRight: "5px" }}>
                            {Config.numWithComma(element.amount)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      ""
                    )
                  )}
                    {/*                   
                    <div className="body-tabel-deta">
                      
                      <div className="retailer-print"><b>Total</b></div>
                      <div></div>
                      <div><b> {printObj.pcs}</b></div>
                      <div><b> {printObj.grossWtTOt}</b></div>
                      <div></div>
                      <div></div>
                      <div><b> {printObj.finegoldTot}</b></div>
                      <div><b> {Config.numWithComma(printObj.amount)}</b></div>
                    </div> */}
                  </div>
                  <div className="row">
                    <div className="body-tabel-deta">
                      <div border="1" style={{ maxWidth: "50px" }}>
                        {" "}
                        &nbsp;
                      </div>
                      <div border="1" style={{ minWidth: "110px" }}>&nbsp;</div>
                      <div border="1" style={{ minWidth: "210px" }}>&nbsp;</div>
                      <div border="1">&nbsp;</div>
                      <div border="1">&nbsp;</div>
                      <div border="1">&nbsp;</div>
                      <div border="1">&nbsp;</div>
                      <div border="1">&nbsp;</div>
                      <div border="1" style={{ minWidth: "130px" }}>
                        &nbsp;{" "}
                      </div>
                    </div>
                  </div>
                  {printObj.orderDetails.map((element, index) =>
                      element.stockCode ? (
                        <div className="body-tabel-deta">
                          <div
                            border="1"
                            style={{
                              maxWidth: "50px",
                              justifyContent: "center",
                              fontWeight: "500",
                            }}
                          >
                            {index + 1}
                          </div>
                          <div border="1" style={{ fontWeight: "500", minWidth: "110px" }}>
                            {element.stockCode.label}
                          </div>
                          <div border="1" style={{ fontWeight: "500",minWidth: "210px" }}>
                            {element.categoryName}
                          </div>
                          <div
                            border="1"
                            style={{ justifyContent: "end", fontWeight: "500" }}
                          >
                            <span style={{ marginRight: "5px" }}>
                              {element.pcs}
                            </span>
                          </div>
                          <div
                            border="1"
                            style={{ justifyContent: "end", fontWeight: "500" }}
                          >
                            <span style={{ marginRight: "5px" }}>
                              {element.grossWeight}
                            </span>
                          </div>
                          <div
                            border="1"
                            style={{ justifyContent: "end", fontWeight: "500" }}
                          >
                            <span style={{ marginRight: "5px" }}>
                              {element.netWeight}
                            </span>
                          </div>
                          <div
                            border="1"
                            style={{ justifyContent: "end", fontWeight: "500" }}
                          >
                            <span style={{ marginRight: "5px" }}>
                              {element.purity}
                            </span>
                          </div>
                          <div
                            border="1"
                            style={{ justifyContent: "end", fontWeight: "500" }}
                          >
                            <span style={{ marginRight: "5px" }}>
                              {element.fineGold}
                            </span>
                          </div>
                          <div
                            border="1"
                            style={{
                              justifyContent: "end",
                              minWidth: "130px",
                              fontWeight: "500",
                            }}
                          >
                            <span style={{ marginRight: "5px" }}>
                              {Config.numWithComma(element.amount)}
                            </span>
                          </div>
                        </div>
                      ) : (
                        ""
                      )
                    )}
                  <div className="row">
                    <div className="body-tabel-deta">
                      <div border="1" style={{ maxWidth: "50px" }}>
                        {" "}
                        &nbsp;
                      </div>
                      <div border="1" style={{ minWidth: "110px" }}></div>
                      <div border="1" style={{ minWidth: "210px" }}></div>
                      <div border="1"></div>
                      <div border="1"></div>
                      <div border="1"></div>
                      <div border="1"></div>
                      <div border="1"></div>
                      <div border="1" style={{ minWidth: "130px" }}>
                        {" "}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="body-tabel-deta">
                      <div border="1" style={{ maxWidth: "50px" }}>
                        {" "}
                        &nbsp;
                      </div>
                      <div style={{ justifyContent: "center", minWidth: "110px" }}>Total</div>
                      <div style={{ minWidth: "210px" }}></div>
                      <div style={{ justifyContent: "end" }}>
                        <b style={{ marginRight: "5px" }}>
                          {parseFloat(printObj.pcsTot) +
                            parseFloat(printObj.pcsTots)}
                        </b>
                      </div>
                      <div style={{ justifyContent: "end" }}>
                        <b style={{ marginRight: "5px" }}>
                          {(
                            parseFloat(printObj.grossWtTOt) +
                            parseFloat(printObj.grossWtTOts)
                          ).toFixed(3)}
                        </b>
                      </div>
                      <div style={{ justifyContent: "end" }}>
                        <b style={{ marginRight: "5px" }}>
                          {(
                            parseFloat(printObj.netWtTOt) +
                            parseFloat(printObj.netWtTOts)
                          ).toFixed(3)}
                        </b>
                      </div>
                      <div></div>
                      <div style={{ justifyContent: "end" }}>
                        <b style={{ marginRight: "5px" }}>
                          {(
                            parseFloat(printObj.finegoldTot) +
                            parseFloat(printObj.finegoldTots)
                          ).toFixed(3)}
                        </b>
                      </div>
                      <div style={{ justifyContent: "end", minWidth: "130px" }}>
                        <b style={{ marginRight: "5px" }}>
                          {Config.numWithComma(
                            (
                              parseFloat(printObj.amountTots) +
                              parseFloat(printObj.amountTot)
                            ).toFixed(3)
                          )}
                        </b>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              {/* <li className="d-block">
                <div className="tabel-deta-show tabel-deta-show_total totallast_col mb-5">
                  <div className="row">
                  <div className="body-tabel-deta">
                   
                    <div className="retailer-print"><b>Total</b></div>
                    <div></div>
                    <div>{printObj.pcs}</div>
                    <div>{printObj.grossWtTOt}</div>
                    <div></div>
                    <div></div>
                    <div>{printObj.finegoldTot}</div>
                    <div>{printObj.amount}</div>
                  </div>
                </div>
                </div>
              </li> */}
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
                    <h6></h6>
                    <h6></h6>
                    <h6></h6>
                  </div>
                  <div>
                    <h6></h6>
                    <h6></h6>
                  </div>
                </div> */}
                {/* <div
                  style={{
                    display: "flex",
                    width: "80%",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    // marginRight: "5px",
                    marginInline:"auto"
                  }}
                > */}
                  {/* <div> */}
                    {/* <div style={{ width: "100%" }}>
                      <h6 style={{ borderBottom: "1px solid black", display:"inline-block" }}>
                        Total Received
                      </h6>
                    </div>
                    <h6 style={{ width: "40%" }}>
                      <span style={{ display: "inline-block", width: "150px" }}>
                        Cash:
                      </span>{" "}
                      {Config.numWithComma(
                        (
                          parseFloat(printObj.amountTots) +
                          parseFloat(printObj.amountTot)
                        ).toFixed(3)
                      )}
                    </h6> */}
                    {/* <h6 style={{ width: "40%" }}>
                      <span style={{ display: "inline-block", width: "150px" }}>
                        Cheque/Bank:
                      </span>{" "} */}
                      {/* {Config.numWithComma(
                        (
                          parseFloat(printObj.amountTots) +
                          parseFloat(printObj.amountTot)
                        ).toFixed(3)
                      )} */}
                    {/* </h6>
                    <h6 style={{ width: "40%" }}>
                      <span style={{ display: "inline-block", width: "150px" }}>
                        Card Details:
                      </span>{" "} */}
                      {/* {Config.numWithComma(
                        (
                          parseFloat(printObj.amountTots) +
                          parseFloat(printObj.amountTot)
                        ).toFixed(3)
                      )} */}
                    {/* </h6> */}
                  {/* </div> */}
                  {/* <div>
                    <h6>&nbsp;</h6>
                    <h6>
                      {Config.numWithComma(
                        (
                          parseFloat(printObj.amountTots) +
                          parseFloat(printObj.amountTot)
                        ).toFixed(3)
                      )}
                    </h6>
                    <h6></h6>
                    <h6></h6>
                  </div> */}
                {/* </div>
              </div> */}
        
              <li className="d-block" style={{borderTop:"1px solid black"}}>
                <div className="tabel-deta-show tabel-deta-show_total">
                  <div className="row">
                    <div className="body-tabel-deta">
                      <div className="flex_balancep_payable">
                        <span className="print-div-left-increase">
                          Amount Chargeable (in words) :<br />
                          <span>
                            {parseFloat(printObj.amountTots) +
                              parseFloat(printObj.amountTot) !==
                              "" &&
                              !isNaN(
                                parseFloat(printObj.amountTots) +
                                  parseFloat(printObj.amountTot)
                              ) &&
                              toWords.convert(
                                parseFloat(printObj.amountTots) +
                                  parseFloat(printObj.amountTot)
                              )}
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
  return (
    <ArticianReturnRetailerPrintComp ref={ref} printObj={props.printObj} />
  );
});
