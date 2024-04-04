import * as React from "react";

export class CromeRejectionPrintCom extends React.PureComponent {
  componentDidMount() {}
  render() {
    const { printObj } = this.props;
    return (
      <div
        className="relativeCSS "
        style={{ maxWidth: "210px", maxHeight: "298px" }}
      >
        <div className="" style={{ margin: 10 }}>
          {/*  */}
          <style type="text/css" media="print">
            {
              "\
                        @page { size: A7 landscape !important; margin:10px; }\
                    "
            }
          </style>
          <ul className="  ">
            <li className="voucher_heading">
              {/* <ul className="voucher_heading"> */}
              {/* <li className="d-block"> */}
              <span> Chrome Rejection</span>
              {/* </li> */}
              {/* </ul> */}
            </li>
            <li className="d-block">
              <ul className="voucher_details">
                <li className="d-block">
                  <span>
                    {/* <p>Voucher No: <span>{printObj.voucherNo}</span></p> */}
                    <p>
                      CAD Job Num: <span>{printObj.cadjobNumber}</span>{" "}
                    </p>
                    <p>
                      Worker Name: <span>{printObj.workerName}</span>{" "}
                    </p>
                    {/* <p>End Date :  <span>{printObj.endDate}</span></p> */}
                    <p>
                      Next Process: <span>{printObj.processType}</span>{" "}
                    </p>
                    <p>
                      Remarks : <span>{printObj.remark}</span>
                    </p>
                  </span>
                </li>
              </ul>
            </li>
          </ul>
          {/*  */}
        </div>
      </div>
    );
  }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
  // eslint-disable-line max-len text={props.text}
  return <CromeRejectionPrintCom ref={ref} printObj={props.printObj} />;
});
