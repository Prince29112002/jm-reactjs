import moment from "moment";
import React from "react";

class SalesPendingOldAmountPrintComp extends React.PureComponent {
  componentDidMount() {}
  render() {
    const { apiOldPaymentData, apiOldUdhaarReadOnlyData } = this.props;

    console.log(apiOldPaymentData);

    console.log(apiOldUdhaarReadOnlyData);

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
                  <div style={{ flexBasis: "40%" }}>
                    <h6>To,</h6>
                    <h6>{apiOldUdhaarReadOnlyData?.Client?.client_Name}</h6>
                    
                  </div>

                  <div style={{ flexBasis: "60%" }}>
                    <h4>Old Sales Pending Amount</h4>
                  </div>
                </div>
              </div>

              <div className="add-client-row"></div>

              <div
                style={{
                  fontSize: "11px",
                  paddingBottom: "10px",
                  paddingTop: "10px",
                }}
              >
                <div>
                  <span style={{ fontWeight: 700 }}>Voucher Number : </span>
                  {apiOldUdhaarReadOnlyData.transaction_number}
                </div>
                {/* <div><span style={{fontWeight:700}}>Party Name : </span>{apiOldUdhaarReadOnlyData?.Client?.client_Name}</div> */}
                <div>
                  <span style={{ fontWeight: 700 }}>
                    Udhar Amount :{" "}
                  </span>
                  {apiOldUdhaarReadOnlyData.udhaar_amount}
                </div>
              </div>

              <div style={{ paddingBottom: "10px" }}>
                <div
                  className="tabel-deta-show"
                  style={{ height: "auto", marginBottom: 10 }}
                >
                  <h5>Pending Amount Detail</h5>
                  <div className="row">
                    <div
                      className="header-tabel-deta"
                      style={{ height: "28px" }}
                    >
                      <div style={{ display: "flex", alignItems: "center" , maxWidth: "50px"}}>
                        <b>No.</b>
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <b>Date</b>
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <b>Amount</b>
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <b>Remaining Balance</b>
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <b>Note</b>
                      </div>
                      {/* <div>
                        Current Rate
                      </div> */}
                    </div>
                  </div>

                  {apiOldPaymentData.length === 0 ? (
                    <div>No Data</div>
                  ) : (
                    apiOldPaymentData.map((row, i) => {
                      console.log(apiOldPaymentData);
                      return (
                        <div className="row" key={i}>
                          <div className="body-tabel-deta">
                            <div
                              border="1"
                              style={{
                                maxWidth: "50px",
                                justifyContent: "center",
                                fontWeight: 500,
                              }}
                            >
                              {i + 1}
                            </div>
                            <div border="1" style={{ fontWeight: 500 }}>
                              {row.payment_date ? moment(row.payment_date, "YYYY-MM-DD").format("DD-MM-YYYY") : "-" }
                            </div>
                            <div border="1" style={{ fontWeight: 500 }}>
                              {parseFloat(row.part_pay_amount).toFixed(2)}
                            </div>
                            <div border="1" style={{ fontWeight: 500 }}>
                              {parseFloat(row.remaining_balance).toFixed(2)}
                            </div>
                            <div border="1" style={{ fontWeight: 500 }}>
                              {row.notes ? row.notes : "-"}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <div className="add-client-row"></div>
            <div
              style={{
                width: "100%",
                height: "106px",
              }}
            ></div>
          </div>
        </div>
      </>
    );
  }
}

export default SalesPendingOldAmountPrintComp;

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
  // eslint-disable-line max-len text={props.text}
  return <SalesPendingOldAmountPrintComp ref={ref} printObj={props.printObj} />;
});
