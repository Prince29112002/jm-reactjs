import * as React from "react";
import { ToWords } from "to-words";

import moment from "moment";
export class MortagePrint extends React.PureComponent {
  componentDidMount() {}
  render() {
    const { printObj } = this.props;
    console.log(printObj);
    return (
      <>
        <div
          className="increase-padding-dv jewellery_main_print-blg"
          style={{
            width: "805px",
            // minHeight: "530px"
          }}
        >
          <style type="text/css" media="print">
            {
              "\
            @page { size: A5 landscape !important; margin:10px 25px 10px 25px; }"
            }
          </style>
          <div>
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-around",
                padding: "10px",
                height: "106px",
              }}
            ></div>
            <div className="add-client-row"></div>
            <div style={{ margin: "5px" }}>
              <div style={{ width: "100%", marginBottom: "10px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ flexBasis: "33.33%" }}>
                    <h6>To,</h6>
                    <h6>{printObj?.name}</h6>
                    <h6>Address : {printObj?.address}</h6>
                    <h6>Mo.No : {printObj?.mobile_number}</h6>
                  </div>
                  <div style={{ flexBasis: "33.33%", textAlign: "center" }}>
                    <h4>Mortage</h4>
                  </div>
                  <div
                    style={{
                      flexBasis: "33.33%",
                      justifyContent: "flex-end",
                      textAlign: "right",
                    }}
                  >
                    <h6>Doc No.</h6>
                    <h6>{printObj?.doc_number}</h6>
                  </div>
                </div>
              </div>
              <div style={{ minHeight: 250 }}>
                {printObj?.partialAmount.length > 0 ? (
                  <div
                    className="tabel-deta-show"
                    style={{ height: "auto", marginBottom: 10 }}
                  >
                    <div className="row" style={{ textAlign: "center" }}>
                      <div className="header-tabel-deta">
                        <div style={{ maxWidth: "50px" }}>
                          <b style={{ alignSelf: "center" }}>No.</b>
                        </div>
                        <div>
                          <b style={{ alignSelf: "center" }}>Date</b>
                        </div>
                        <div style={{ paddingRight: 5 }}>
                          <b style={{ alignSelf: "center" }}>
                            Principal Amount
                          </b>
                        </div>
                        <div style={{ paddingRight: 5 }}>
                          <b style={{ alignSelf: "center" }}>
                            Refinance Amount
                          </b>
                        </div>
                        <div style={{ paddingRight: 5 }}>
                          <b style={{ alignSelf: "center" }}>Interest</b>
                        </div>
                        <div style={{ paddingRight: 5 }}>
                          <b style={{ alignSelf: "center" }}>Paid Amount</b>
                        </div>
                        <div style={{ paddingRight: 5 }}>
                          <b style={{ alignSelf: "center" }}>Balance</b>
                        </div>
                        <div>
                          <b style={{ alignSelf: "center" }}>Interest</b>
                        </div>
                      </div>
                    </div>
                    {printObj?.partialAmount.map((row, index) => {
                      console.log(row);
                      return (
                        <div className="row" key={index}>
                          <div className="body-tabel-deta">
                            <div
                              border="1"
                              style={{
                                maxWidth: "50px",
                                justifyContent: "center",
                                fontWeight: 500,
                              }}
                            >
                              {index + 1}
                            </div>
                            <div
                              border="1"
                              style={{
                                fontWeight: 500,
                              }}
                            >
                              {moment(row.payment_date).format("DD-MM-YYYY")}
                            </div>
                            <div
                              border="1"
                              style={{
                                fontWeight: 500,
                                display: "flex",
                                justifyContent: "flex-end",
                                paddingRight: 5,
                              }}
                            >
                              {row.principal_amount}
                            </div>
                            <div
                              border="1"
                              style={{
                                fontWeight: 500,
                                display: "flex",
                                justifyContent: "flex-end",
                                paddingRight: 5,
                              }}
                            >
                              {row.added_amount}
                            </div>
                            <div
                              border="1"
                              style={{
                                fontWeight: 500,
                                display: "flex",
                                justifyContent: "flex-end",
                                paddingRight: 5,
                              }}
                            >
                              {row.interest}
                            </div>
                            <div
                              border="1"
                              style={{
                                fontWeight: 500,
                                display: "flex",
                                justifyContent: "flex-end",
                                paddingRight: 5,
                              }}
                            >
                              {row.part_pay_amount}
                            </div>
                            <div
                              border="1"
                              style={{
                                fontWeight: 500,
                                display: "flex",
                                justifyContent: "flex-end",
                                paddingRight: 5,
                              }}
                            >
                              {row.remaining_balance}
                            </div>
                            <div border="1" style={{ fontWeight: 500 }}>
                              {row.is_added === 1 ? "Added" : "Paid"}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
                <div
                  className="tabel-deta-show"
                  style={{ height: "auto", marginBottom: 10 }}
                >
                  <h5>Product Details</h5>
                  <div className="row">
                    <div
                      className="header-tabel-deta"
                      style={{ textAlign: "center" }}
                    >
                      <div style={{ maxWidth: "40px" }}>
                        <b style={{ alignSelf: "center" }}>No.</b>
                      </div>
                      <div>
                        <b style={{ alignSelf: "center" }}>Issue Date</b>
                      </div>
                      <div style={{ maxWidth: 70 }}>
                        <b style={{ alignSelf: "center" }}>Metal Type</b>
                      </div>
                      <div>
                        <b style={{ alignSelf: "center" }}>Product Name</b>
                      </div>
                      <div>
                        <b style={{ alignSelf: "center" }}>Gross WT(Gram)</b>
                      </div>
                      <div>
                        <b style={{ alignSelf: "center" }}>Net WT(Gram)</b>
                      </div>
                      
                      {
                        printObj?.is_print === 0 &&  <> <div style={{ maxWidth: 60 }}>
                        <b style={{ alignSelf: "center" }}>Purity</b>
                      </div>
                      <div>
                        <b style={{ alignSelf: "center" }}>PCS</b>
                      </div>
                      <div style={{ maxWidth: 60 }}>
                        <b style={{ alignSelf: "center" }}>Fine</b>
                      </div>
                      <div>
                        <b style={{ alignSelf: "center" }}>Current Rate</b>
                      </div>
                      <div>
                        <b style={{ alignSelf: "center" }}>Amount</b>
                      </div>
                      <div style={{ maxWidth: 60 }}>
                        <b style={{ alignSelf: "center" }}>Close Date</b>
                      </div></>
                      }
                    </div>
                  </div>
                  {printObj?.productDetail.map((row, index) => {
                    console.log(row);
                    return (
                      <div className="row" key={index}>
                        <div className="body-tabel-deta">
                          <div
                            border="1"
                            style={{
                              maxWidth: "40px",
                              justifyContent: "center",
                              fontWeight: 500,
                            }}
                          >
                            {index + 1}
                          </div>
                          <div border="1" style={{ fontWeight: 500 }}>
                            {moment(row.issue_date).format("DD-MM-YYYY")}
                          </div>
                          <div
                            border="1"
                            style={{ fontWeight: 500, maxWidth: 70 }}
                          >
                            {row.is_gold_silver === 1 ? "Gold" : "Silver"}
                          </div>
                          <div border="1" style={{ fontWeight: 500 }}>
                            {row.product_name}
                          </div>
                          <div border="1" style={{ fontWeight: 500 }}>
                            {row.gross_weight}
                          </div>
                          <div border="1" style={{ fontWeight: 500 }}>
                            {row.weight}
                          </div>
                          {
                            printObj?.is_print === 0 && <>  <div
                            border="1"
                            style={{ fontWeight: 500, maxWidth: 60 }}
                          >
                            {row.purity !== "" ? row.purity : "-"}
                          </div>
                          <div border="1" style={{ fontWeight: 500 }}>
                            {row.pcs ? row.pcs : "-"}
                          </div>
                          <div
                            border="1"
                            style={{ fontWeight: 500, maxWidth: 60 }}
                          >
                            {row.fine ? row.fine : "-"}
                          </div>
                          <div border="1" style={{ fontWeight: 500 }}>
                            {row.current_rate ? row.current_rate : "-"}
                          </div>
                          <div border="1" style={{ fontWeight: 500 }}>
                            {row.product_amount ? row.product_amount : "-"}
                          </div>
                          <div
                            border="1"
                            style={{ fontWeight: 500, maxWidth: 60 }}
                          >
                            {row.close_date
                              ? moment(row.close_date).format("DD-MM-YYYY")
                              : "-"}
                          </div>
                            </>
                          }
                        
                        </div>
                      </div>
                    );
                  })}
                </div>
                {printObj?.addAmountDetail.length > 1 && (
                  <div
                    className="tabel-deta-show"
                    style={{ height: "auto", marginBottom: 10 }}
                  >
                    <h5>Add Amount Details</h5>
                    <div className="row">
                      <div className="header-tabel-deta">
                        <div>
                          <b style={{ alignSelf: "center" }}>Date</b>
                        </div>
                        <div>
                          <b style={{ alignSelf: "center" }}>Amount</b>
                        </div>
                      </div>
                    </div>
                    {printObj?.addAmountDetail
                      .filter((data) => data.is_added === 1)
                      .map((row, index) => (
                        <div className="row" key={index}>
                          <div className="body-tabel-deta">
                            <div
                              border="1"
                              style={{
                                fontWeight: 500,
                                justifyContent: "center",
                              }}
                            >
                              {moment(row.issue_date).format("DD-MM-YYYY")}
                            </div>
                            <div border="1" style={{ fontWeight: 500 }}>
                              {row.amount}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
            <div style={{ margin: "5px" }}>
              <div
                style={{
                  width: "100%",
                  border: "1px solid black",
                  display: "flex",
                  justifyContent: "space-between",
                  padding: 8,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    flexWrap: "wrap",
                  }}
                >
                  <h6 style={{ width: "40%" }}>
                    <span style={{ display: "inline-block", width: "120px" }}>
                      Issue Date :
                    </span>{" "}
                    {moment(printObj?.issueDate).format("DD-MM-YYYY")}
                  </h6>
                  <h6 style={{ width: "40%" }}>
                    <span style={{ display: "inline-block", width: "120px" }}>
                      Total Net WT(Gram) :
                    </span>{" "}
                    {printObj?.weight} gm
                  </h6>
                  <h6 style={{ width: "40%" }}>
                    <span style={{ display: "inline-block", width: "120px" }}>
                      Principle Amount :
                    </span>{" "}
                    {printObj?.issueAmount}
                  </h6>
                  { printObj?.is_print === 1 &&
                    <h6 style={{ width: "40%" }}>
                    <span >
                      Note :
                    </span>{" "}
                    {printObj?.note}
                  </h6>
                  }
                  {
                    printObj?.is_print === 0 ?  <h6 style={{ width: "40%" }}>
                    <span style={{ display: "inline-block", width: "120px" }}>
                      Percentage(%) :
                    </span>{" "}
                    {printObj?.percentage}%
            
                  </h6> : <h6 style={{ width: "40%" }}></h6>
                  }
                  {
                    printObj?.is_print === 1 && <>
                     <div style={{paddingTop: "10px"}}> <span style={{textAlign: "center"}}>पर्ची खो जाने पर सामान नहीं मिलेगा और दुकानदार की कोई ज़िम्मेदारी नहीं होगी। अवधी के अंदर ही सामान छुड़ाये।
                  </span></div>
                    </>
                  }
                </div>
              </div>
            </div>
            <div className="add-client-row"></div>
            <div
              style={{
                width: "805px",
                height: "75px",
              }}
            >
            </div>
          </div>
        </div>
      </>
    );
  }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
  // eslint-disable-line max-len text={props.text}
  return <MortagePrint ref={ref} printObj={props.printObj} />;
});
