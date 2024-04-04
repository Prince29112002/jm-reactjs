import * as React from "react";
import { ToWords } from "to-words";
import HeaderPrint from "../../Helper/HeaderPrint";
import FooterPrint from "../../Helper/FooterPrint";
import Config from "app/fuse-configs/Config";
import { Grid } from "@material-ui/core";

export class SalesRetalierPrint extends React.PureComponent {
  componentDidMount() { }

  render() {
    // const { text } = this.props;
    const { printObj } = this.props;
    console.log(printObj, "print");
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
    const state = printObj.supplierName.sId;
    const SateID = myprofileData.state;

    return (
      <>
        <div
          className="increase-padding-dv jewellery_main_print-blg"
          style={{ width: "805px", height: "530px" }}
        >
          {/* Sales_Invoice */}
          <style type="text/css" media="print">
            {
              "\
            @page { size: A5 landscape !important; margin:10px 25px 10px 25px; }          "
            }
          </style>
          <ul>
            <HeaderPrint myprofileData={myprofileData} />
            <div className="add-client-row"></div>
            <div style={{ margin: "5px", height: "220px" }}>
              <div style={{ width: "100%" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    {/* <h6>Tax Invoice</h6> */}
                    {myprofileData?.is_mortgage_print === 0 && <h6>To,</h6> }
                    {myprofileData?.is_mortgage_print === 0 ? <h6>{printObj.supplierName.label}</h6> :
                    <h6 style={{ color:  myprofileData?.is_mortgage_print === 1 && 'red' }}>Name : {printObj.supplierName.label}</h6> }
                    <h6 style={{ color: myprofileData?.is_mortgage_print === 1 &&  'red' }}>Mo.No : {printObj?.supplierName?.data?.mobile_number}</h6>
                    <h6 style={{ color: myprofileData?.is_mortgage_print === 1 &&  'red' }}>Address : {printObj?.supplierName?.data?.address}</h6>
                  </div>
                  <div>
                    {
                      myprofileData?.is_mortgage_print === 0 &&   <h6>TAX INVOICE</h6> 
                    }
                    {
                      myprofileData?.is_mortgage_print === 1 &&   <h6 style={{ color: 'blue' }}>Rough Estimate</h6> 
                    }
                    
                  </div>
                  <div>
                    {myprofileData.gst_number_flag && (
                      <h6>
                        GSTIN :{" "}
                        {myprofileData.gst_number
                          ? myprofileData.gst_number
                          : "-"}
                      </h6>
                    )}
                    <h6>Invoice No.: {printObj.purcVoucherNum}</h6>
                    <h6 style={{ color: myprofileData?.is_mortgage_print === 1 &&  'red' }}>Date: {printObj.voucherDate}</h6>
                  </div>
                </div>
              </div>
              <li className="d-block">
                <div className="tabel-deta-show">
                  <div className="row">
                    <div className="header-tabel-deta">
                      <div style={{ minWidth: "90px" }}>
                        {" "}
                        <b> Barcode No </b>
                      </div>
                      {
                        myprofileData?.is_mortgage_print === 0 &&  <div style={{ minWidth: "100px" }}>
                        {" "}
                        <b> Billing Category </b>
                      </div> 
                      }
                      <div style={{ minWidth: "50px" }}>
                        {" "}
                        <b style={{ marginRight: "5px" }}> PCS </b>
                      </div>
                      {!printObj.fixed && (
                        <>
                          <div style={{ minWidth: "60px" }}>
                            {" "}
                            <b style={{ marginRight: "5px" }}> GWT </b>
                          </div>
                          <div style={{ minWidth: "60px" }}>
                            {" "}
                            <b style={{ marginRight: "5px" }}> NWT </b>
                          </div>
                        </>
                      )}
                      {
                        myprofileData?.is_mortgage_print === 0 && <div style={{ minWidth: "50px" }}>
                        {" "}
                        <b style={{ marginRight: "5px" }}> Purity </b>
                      </div>
                      }
                      {!printObj.fixed ? (
                        <>
                          <div style={{ minWidth: "80px" }}>
                            {" "}
                            <b style={{ marginRight: "5px" }}> Rate </b>
                          </div>
                          {
                            myprofileData?.is_mortgage_print === 0 && <>
                             <div style={{ minWidth: "70px" }}>
                            {" "}
                            <b style={{ marginRight: "5px" }}> wastage(%) </b>
                          </div>
                          <div style={{ minWidth: "50px" }}>
                            {" "}
                            <b style={{ marginRight: "5px" }}> Hallmark </b>
                          </div>
                            </>
                          }
                          <div style={{ minWidth: "50px" }}>
                            {" "}
                            <b style={{ marginRight: "5px" }}> Labour </b>
                          </div>
                        </>
                      ) : (
                        <div style={{ minWidth: "50px" }}>
                          {" "}
                          <b style={{ marginRight: "5px" }}> Amount </b>
                        </div>
                      )}
                      {
                        myprofileData?.is_mortgage_print === 0 && <div style={{ minWidth: "50px" }}>
                        {" "}
                        <b style={{ marginRight: "5px" }}> GST(%) </b>
                      </div>
                      }
                      
                      <div style={{ minWidth: "80px" }}>
                        {" "}
                        <b style={{ marginRight: "5px" }}>
                          {" "}
                          {!printObj.fixed ? "Amount" : "Total"}{" "}
                        </b>
                      </div>
                    </div>
                  </div>

                  {printObj.orderDetails.map((row, index) => (
                    <div className="row" key={index}>
                      <div className="body-tabel-deta">
                        <div
                          border="1"
                          style={{
                            minWidth: "90px",
                            justifyContent: "center",
                            fontWeight: "500",
                          }}
                        >
                          {row.barcode}
                        </div>
                        {
                          myprofileData?.is_mortgage_print === 0 &&   <div
                          border="1"
                          style={{ fontWeight: "500", minWidth: "100px" }}
                        >
                          {row.category.label}
                        </div>
                        }
                      
                        <div
                          border="1"
                          style={{
                            justifyContent: "end",
                            minWidth: "50px",
                            fontWeight: "500",
                          }}
                        >
                          <span style={{ marginRight: "5px" }}>
                            {row.phy_pcs}
                          </span>
                        </div>
                        {!printObj.fixed && (
                          <>
                            <div
                              border="1"
                              style={{
                                justifyContent: "end",
                                minWidth: "60px",
                                fontWeight: "500",
                              }}
                            >
                              <span style={{ marginRight: "5px" }}>
                                {row.gross_wgt}
                              </span>
                            </div>
                            <div
                              border="1"
                              style={{
                                justifyContent: "end",
                                minWidth: "60px",
                                fontWeight: "500",
                              }}
                            >
                              <span style={{ marginRight: "5px" }}>
                                {row.net_wgt}
                              </span>
                            </div>
                          </>
                        )}
                        {
                          myprofileData?.is_mortgage_print === 0 &&   <div
                          border="1"
                          style={{
                            justifyContent: "end",
                            fontWeight: "500",
                            minWidth: "50px",
                          }}
                        >
                          <span style={{ marginRight: "5px" }}>
                            {row.purity}
                          </span>
                        </div>
                        }
                      
                        {!printObj.fixed && (
                          <>
                            <div
                              border="1"
                              style={{
                                justifyContent: "end",
                                minWidth: "80px",
                                fontWeight: "500",
                              }}
                            >
                              <span style={{ marginRight: "5px" }}>
                                {row.rate}
                              </span>
                            </div>
                            {
                              myprofileData?.is_mortgage_print === 0 && <>
                               <div
                              border="1"
                              style={{
                                justifyContent: "end",
                                minWidth: "70px",
                                fontWeight: "500",
                              }}
                            >
                              <span style={{ marginRight: "5px" }}>
                                {row?.wastage_per}
                              </span>
                            </div>
                            <div
                              border="1"
                              style={{
                                justifyContent: "end",
                                minWidth: "50px",
                                fontWeight: "500",
                              }}
                            >
                              <span style={{ marginRight: "5px" }}>
                                {row.total_hallmark_charges}
                              </span>
                            </div>
                              </>
                            }
                           
                          </>
                        )}
                        <div
                          border="1"
                          style={{
                            justifyContent: "end",
                            minWidth: "50px",
                            fontWeight: "500",
                          }}
                        >
                          <span style={{ marginRight: "5px" }}>
                            {row.laberpergram}
                          </span>
                        </div>
                        {
                           myprofileData?.is_mortgage_print === 0 &&  <div
                           border="1"
                           style={{
                             justifyContent: "end",
                             minWidth: "50px",
                             fontWeight: "500",
                           }}
                         >
                           <span style={{ marginRight: "5px" }}>{row.gst}</span>
                         </div>
                        }
                        <div
                          border="1"
                          style={{ minWidth: "80px", fontWeight: "500" }}
                        >
                          <span style={{ marginRight: "5px" }}>
                            {Config.numWithComma(
                              parseFloat(
                                parseFloat(row.amount) - parseFloat(row.gstVal)
                              )
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="row">
                    <div className="body-tabel-deta body-tabel-deta-bdr">
                      <div border="1" style={{ minWidth: "90px" }}>
                        {" "}
                        &nbsp;
                      </div>
                      {
                       myprofileData?.is_mortgage_print === 0 &&  <div border="1" style={{ minWidth: "100px" }}>
                       {" "}
                       &nbsp;
                     </div>
                      }
                     
                      <div border="1" style={{ minWidth: "50px" }}>
                        {" "}
                        &nbsp;
                      </div>
                      {!printObj.fixed && (
                        <>
                          <div border="1" style={{ minWidth: "60px" }}>
                            {" "}
                            &nbsp;
                          </div>
                          <div border="1" style={{ minWidth: "60px" }}>
                            {" "}
                            &nbsp;
                          </div>
                        </>
                      )}
                      {
                         myprofileData?.is_mortgage_print === 0 &&  <div border="1" style={{ minWidth: "50px" }}>
                         {" "}
                         &nbsp;
                       </div>
                      }
                      {!printObj.fixed ? <>  <div border="1" style={{ minWidth: "80px" }}>
                        {" "}
                        &nbsp;
                      </div>
                      {
                        myprofileData?.is_mortgage_print === 0 && <>  
                        <div border="1" style={{ minWidth: "70px" }}>
                        {" "}
                        &nbsp;
                      </div>
                      <div border="1" style={{ minWidth: "50px" }}>
                        {" "}
                        &nbsp;
                      </div>
                        </>
                      }
                        <div border="1" style={{ minWidth: "50px" }}>
                          {" "}
                          &nbsp;
                        </div>
                      </> :
                        <div border="1" style={{ minWidth: "50px" }}>
                          {" "}
                          &nbsp;
                        </div>
                      }
                      {
                        myprofileData?.is_mortgage_print === 0 &&  <div border="1" style={{ minWidth: "50px" }}>
                        {" "}
                        &nbsp;
                      </div>
                      }
                      <div border="1" style={{ minWidth: "80px" }}>
                        {" "}
                        &nbsp;
                      </div>
                    </div>

                    {state == SateID && myprofileData?.is_mortgage_print === 0 ? (
                      <>
                        <div className="body-tabel-deta body-tabel-deta-bdr">
                          <div style={{ minWidth: "90px" }}> &nbsp;</div>
                          {
                            myprofileData?.is_mortgage_print === 0 &&  <div
                            style={{ minWidth: "100px" }}
                            className="retailer-print"
                          >
                            Add CGST
                          </div>
                          }
                          <div style={{ minWidth: "50px" }}> &nbsp;</div>
                          {!printObj.fixed && (
                            <>

                              <div border="1" style={{ minWidth: "60px" }}>
                                {" "}
                                &nbsp;
                              </div>
                              <div border="1" style={{ minWidth: "60px" }}>
                                {" "}
                                &nbsp;
                              </div>
                            </>
                          )}
                          {
                            myprofileData?.is_mortgage_print === 0 && <div style={{ minWidth: "50px" }}> &nbsp;</div>
                          }
                          {!printObj.fixed ?
                            <>
                              <div style={{ minWidth: "80px" }}> &nbsp;</div>
                              {
                                myprofileData?.is_mortgage_print === 0 && <>
                                 <div border="1" style={{ minWidth: "70px" }}>
                                {" "}
                                &nbsp;
                              </div>
                              <div style={{ minWidth: "50px" }}> &nbsp;</div>
                                </>
                              }
                              <div style={{ minWidth: "50px" }}> &nbsp;</div>
                            </> :

                            <div style={{ minWidth: "50px" }}> &nbsp;</div>
                          }
                          {
                             myprofileData?.is_mortgage_print === 0 && <div style={{ minWidth: "50px" }}> &nbsp;</div>
                          }
                          <div
                            style={{ minWidth: "80px", justifyContent: "end" }}
                          >
                            <span style={{ marginRight: "5px" }}>
                              {
                                myprofileData?.is_mortgage_print === 0 && Config.numWithComma(
                                  parseFloat(
                                    parseFloat(printObj.totalgst) / 2
                                  ).toFixed(3)
                                )
                              }
                            </span>
                          </div>
                        </div>
                        <div className="body-tabel-deta body-tabel-deta-bdr">
                          <div style={{ minWidth: "90px" }}> &nbsp;</div>
                          {
                             myprofileData?.is_mortgage_print === 0 &&  <div
                             style={{ minWidth: "100px" }}
                             className="retailer-print"
                           >
                             Add SGST
                           </div>
                          }
                          <div style={{ minWidth: "50px" }}> &nbsp;</div>
                          {!printObj.fixed && (
                            <>
                              <div border="1" style={{ minWidth: "60px" }}>
                                {" "}
                                &nbsp;
                              </div>
                              <div border="1" style={{ minWidth: "60px" }}>
                                {" "}
                                &nbsp;
                              </div>
                            </>
                          )}
                          {
                            myprofileData?.is_mortgage_print === 0 && <div style={{ minWidth: "50px" }}> &nbsp;</div>
                          }
                          {!printObj.fixed ? <>
                            <div style={{ minWidth: "80px" }}> &nbsp;</div>
                            {
                              myprofileData?.is_mortgage_print === 0 && <>
                               <div border="1" style={{ minWidth: "70px" }}>
                              {" "}
                              &nbsp;
                            </div>
                            <div style={{ minWidth: "50px" }}> &nbsp;</div>
                              </>
                            }
                            <div style={{ minWidth: "50px" }}> &nbsp;</div>
                          </> :
                            <div style={{ minWidth: "50px" }}> &nbsp;</div>
                          }
                          {
                             myprofileData?.is_mortgage_print === 0 && <div style={{ minWidth: "50px" }}> &nbsp;</div>
                          }
                          <div
                            style={{ minWidth: "80px", justifyContent: "end" }}
                          >
                            <span style={{ marginRight: "5px" }}>
                              {
                                myprofileData?.is_mortgage_print === 0 && Config.numWithComma(
                                  parseFloat(
                                    parseFloat(printObj.totalgst) / 2
                                  ).toFixed(3)
                                )
                              }
                            </span>
                          </div>
                        </div>
                      </>
                    ) :  (
                      <div className="body-tabel-deta body-tabel-deta-bdr">
                        <div style={{ minWidth: "90px" }}> &nbsp;</div>
                        {
                          myprofileData?.is_mortgage_print === 0 &&   <div
                          style={{ minWidth: "100px" }}
                          className="retailer-print"
                        >
                          {" "}
                          Add IGST
                        </div>
                        }
                        <div style={{ minWidth: "50px" }}>&nbsp;</div>
                        {!printObj.fixed && (
                          <>
                            <div border="1" style={{ minWidth: "60px" }}>
                              {" "}
                              &nbsp;
                            </div>
                            <div border="1" style={{ minWidth: "60px" }}>
                              {" "}
                              &nbsp;
                            </div>
                          </>
                        )}
                        {
                          myprofileData?.is_mortgage_print === 0 && <div style={{ minWidth: "50px" }}> &nbsp;</div>
                        }
                        {!printObj.fixed ?
                          <>
                            <div style={{ minWidth: "80px" }}> &nbsp;</div>
                            {
                              myprofileData?.is_mortgage_print === 0 && <>
                               <div border="1" style={{ minWidth: "70px" }}>
                              {" "}
                              &nbsp;
                            </div>
                            <div style={{ minWidth: "50px" }}> &nbsp;</div>
                              </>
                            }
                            <div style={{ minWidth: "50px" }}> &nbsp;</div>
                          </> :
                          <div style={{ minWidth: "50px" }}> &nbsp;</div>
                        }
                        {
                          myprofileData?.is_mortgage_print === 0 && <div style={{ minWidth: "50px" }}> &nbsp;</div>
                        }
                        <div
                          style={{ minWidth: "80px", justifyContent: "end" }}
                        >
                          <span style={{ marginRight: "5px" }}>
                            {
                              myprofileData?.is_mortgage_print === 0 && Config.numWithComma(parseFloat(printObj.totalgst))
                            }
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="body-tabel-deta body-tabel-deta-bdr">
                      <div style={{ minWidth: "90px" }}> &nbsp;</div>
                        {
                          myprofileData?.is_mortgage_print === 0 && <div
                          style={{ minWidth: "100px" }}
                          className="retailer-print"
                        >
                          Round Off
                        </div>
                        }
                     
                      <div
                        style={{ minWidth: "50px" }}
                        className="retailer-print"
                      >
                        {myprofileData?.is_mortgage_print === 1 && "Round Off" } 
                        
                      </div>
                      {!printObj.fixed && (
                        <>
                          <div border="1" style={{ minWidth: "60px" }}>
                            {" "}
                            &nbsp;
                          </div>
                          <div border="1" style={{ minWidth: "60px" }}>
                            {" "}
                            &nbsp;
                          </div>
                        </>
                      )}
                      {
                        myprofileData?.is_mortgage_print === 0 && <div style={{ minWidth: "50px" }}> &nbsp;</div>
                      }
                      {!printObj.fixed ? <>
                        <div style={{ minWidth: "80px" }}> &nbsp;</div>
                        {
                          myprofileData?.is_mortgage_print === 0 && <>
                           <div border="1" style={{ minWidth: "70px" }}>
                          {" "}
                          &nbsp;
                        </div>
                        <div style={{ minWidth: "50px" }}> &nbsp;</div>
                          </>
                        }
                        <div style={{ minWidth: "50px" }}> &nbsp;</div>
                      </> :
                        <div style={{ minWidth: "50px" }}> &nbsp;</div>
                      }
                      {
                        myprofileData?.is_mortgage_print === 0 &&  <div style={{ minWidth: "50px" }}> &nbsp;</div>
                      }
                      <div style={{ minWidth: "80px", justifyContent: "end" }}>
                        <span style={{ marginRight: "5px" }}>
                          {printObj.roundOff === "" ? 0 : printObj.roundOff}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="d-block">
                <div className="tabel-deta-show tabel-deta-show_total totallast_col mb-10">
                  <div className="row">
                    <div className="body-tabel-deta">
                      <div style={{ minWidth: "90px" }}></div>
                      {
                        myprofileData?.is_mortgage_print === 0 &&  <div
                        style={{ minWidth: "100px" }}
                        className="retailer-print"
                      >
                        Total
                      </div>
                      }
                      <div style={{ minWidth: "50px" }}>{myprofileData?.is_mortgage_print === 1 && "Total"}</div>

                      {!printObj.fixed && (
                        <>
                          <div
                            style={{ justifyContent: "end", minWidth: "60px" }}
                          >
                            <span style={{ marginRight: "5px" }}>
                              {printObj.grossWtTOt}
                            </span>
                          </div>
                          <div
                            style={{ justifyContent: "end", minWidth: "60px" }}
                          >
                            <span style={{ marginRight: "5px" }}>
                              {printObj.netWtTOt}
                            </span>
                          </div>
                        </>
                      )}
                      {
                        myprofileData?.is_mortgage_print === 0 && <div style={{ minWidth: "50px" }}></div>
                      }
                      {!printObj.fixed ? (
                        <>
                          <div style={{ minWidth: "80px" }}></div>
                          {
                            myprofileData?.is_mortgage_print === 0 && <> <div border="1" style={{ minWidth: "70px" }}>
                            {" "}
                            &nbsp;
                          </div>
                          <div style={{ minWidth: "50px" }}></div></>
                          }
                          <div style={{ minWidth: "50px" }}></div>
                        </>
                      ) :
                        <div style={{ minWidth: "50px" }}></div>
                      }
                      {
                        myprofileData?.is_mortgage_print === 0 && <div style={{ minWidth: "50px" }}></div>
                      }
                      <div style={{ minWidth: "80px", justifyContent: "end" }}>
                        <span style={{ marginRight: "5px" }}>
                          {Config.numWithComma(printObj.totalInvoiceAmt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </div>

            <div
              style={{
                marginLeft: "5px",
                marginRight: "5px",
                height: "110px",
                marginTop: "10px",
              }}
            >
              <div
                style={{
                  width: "100%",
                  border: "1px solid black",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    width: "50%",
                    justifyContent: "space-around",
                  }}
                >
                  <div>
                    <h6 style={{ borderBottom: "1px solid black" }}>Credits</h6>
                    <h6>Jewellery Return:</h6>
                    <h6>Advance Amount:</h6>
                    <h6>Udhar Amount:</h6>
                  </div>
                  <div>
                    <h6>&nbsp;</h6>
                    {
                      myprofileData?.is_mortgage_print === 1 ?   <h6>
                      Item Name : {printObj?.itemName}
                      </h6> : <h6>
                      Fine Gold : {printObj.Afinegold ? printObj.Afinegold : "0"}
                    </h6>
                    }
                    <h6>
                      {printObj.Aamount
                        ? Config.numWithComma(printObj.Aamount)
                        : "0"}
                    </h6>
                    <h6>
                      {printObj.udharAmount
                        ? Config.numWithComma(printObj.udharAmount)
                        : "0"}
                    </h6>
                  </div>
                  <div>
                    <h6>&nbsp;</h6>
                    <h6>
                      Amount:{" "}
                      {printObj.jamount
                        ? Config.numWithComma(printObj.jamount)
                        : "0"}
                    </h6>
                    <h6>&nbsp;</h6>
                    <h6>&nbsp;</h6>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    width: "50%",
                    justifyContent: "space-around",
                  }}
                >
                  <div>
                    <h6 style={{ borderBottom: "1px solid black" }}>
                      Total Received
                    </h6>
                    <h6>
                      Cash:&nbsp;&nbsp;&nbsp;{" "}
                      {Config.numWithComma(printObj.casamount)}
                    </h6>
                    <h6>
                      Online:&nbsp;{Config.numWithComma(printObj.onlineamount)}
                    </h6>
                    <h6>
                      Card:&nbsp;&nbsp;&nbsp;&nbsp;
                      {Config.numWithComma(printObj.cardamount)}
                    </h6>
                  </div>
                  <div>
                    <h6>&nbsp;</h6>
                    <h6>
                      Cheque:&nbsp;{Config.numWithComma(printObj.chequeamount)}
                    </h6>
                    <h6></h6>
                    <h6></h6>
                  </div>
                  <div>
                    <h6>&nbsp;</h6>
                    <h6>&nbsp;</h6>
                    <h6>&nbsp;</h6>
                    <h6>&nbsp;</h6>
                  </div>
                </div>
              </div>

              <li className="d-block">
                <div className="tabel-deta-show tabel-deta-show_total">
                  <div className="row">
                    <div className="body-tabel-deta">
                      <div className="flex_balancep_payable">
                        <span className="print-div-left-increase" style={{ color:  myprofileData?.is_mortgage_print === 1 && 'red' }}>
                          Final Chargeable Amount :<br />
                          <span style={{color: "initial"}}>
                            {printObj.taxableAmount !== "" &&
                              !isNaN(printObj.taxableAmount) &&
                              Config.numWithComma(printObj.taxableAmount)}
                          </span>
                        </span>
                        <span className="print-div-left-increase">
                          Amount Chargeable (in words) :<br />
                          <span className="mr-2">
                            {printObj.taxableAmount !== "" &&
                              !isNaN(printObj.taxableAmount) &&
                              toWords.convert(printObj.taxableAmount)}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </div>

            <div className="add-client-row"></div>
            {
              myprofileData?.is_mortgage_print === 1 ? <>
              <div>
              <div style={{display: 'flex',paddingBlock: '15px'}}>
                <div style={{  width : '25%'}}>
                  <div style={{border: '1px solid black' , margin : '5px',padding : '7px' , textAlign : 'center'}}>आधुनिक सोच</div>
                </div>
                <div style={{ width : '25%'}}>
                <div style={{border: '1px solid black' , margin : '5px',padding : '7px' , textAlign : 'center'}}>समय के साथ बदलाव</div>
                </div>
                <div style={{ width : '25%'}}>
                <div style={{border: '1px solid black' , margin : '5px',padding : '7px' , textAlign : 'center'}}> पारदर्शिता की परम्परा</div>
               
                </div>
                <div style={{ width : '25%'}}>
                <div style={{border: '1px solid black' , margin : '5px',padding : '7px' , textAlign : 'center'}}> संपूर्ण स्टॉक उचित रेट</div>
               
                </div>
              </div>
              </div>
              </>
              : <FooterPrint myprofileData={myprofileData} />
            }
          </ul>
        </div>
      </>
    );
  }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
  // eslint-disable-line max-len text={props.text}
  return <SalesRetalierPrint ref={ref} printObj={props.printObj} />;
});
