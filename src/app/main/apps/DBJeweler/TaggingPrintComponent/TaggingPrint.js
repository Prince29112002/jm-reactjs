import * as React from "react";
import QRCode from "react-qr-code";

export class TaggingPrint extends React.PureComponent {
  componentDidMount() {}

  render() {
    const { printObj, flag, allData } = this.props;
    console.log(printObj, allData);
    const myprofileData = localStorage.getItem("myprofile")
      ? JSON.parse(localStorage.getItem("myprofile"))
      : [];
    // const generateQRCodeValue = (item) => {
    //   const fileredData =
    //     flag === 1
    //       ? allData.filter((data) => data.NAME === item)
    //       : allData.filter((data) => data.ITEM_NO === item);
    //   return Object.entries(fileredData[0])
    //     .map(([key, value]) => `${value}`)
    //     .join("\t");
    // };
    const generateQRCodeValue = (item) => {
      return Object.entries(item)
        .map(([key, value]) => `${value}`)
        .join("\t");
    };
    return (
      <>
        <div
          // className="increase-padding-dv jewellery_main_print-blg"
          style={{
            width: "306px",
            // minHeight: "722px",
            height: "45px",
            fontSize: "5px",
          }}
        >
          <style type="text/css" media="print">
            {
              "\
            @page { size: 81mm 12mm;}"
            }
          </style>
          <div
          // style={{ paddingBlock: 18, paddingInline: 14 }}
          >
            <ul className="">
              {printObj
                ? printObj.map((data, index) => {
                    return (
                      <li style={{ listStyleType: "none" }} key={index}>
                        <div
                          // className="barcodeitem"
                          style={{
                            width: 210,
                            height: 46,
                            border: "1px solid transparent",
                            borderRadius: 7,
                            fontSize: "7PX",
                            fontWeight: 700,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "stretch",
                            }}
                          >
                            <div
                              style={{
                                width: "25%",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <div
                                style={{
                                  // width: "50%",
                                  display: "flex",
                                  alignItems: "flex-end",
                                }}
                              >
                                <div style={{ width: 17 }}>
                                  <img
                                    src={myprofileData.logo}
                                    alt="QR"
                                    width="auto"
                                    // height="20px"
                                    style={{
                                      display: "block",
                                      margin: "0 auto",
                                      verticalAlign: "middle",
                                    }}
                                  />
                                </div>
                                <div style={{ width: 40 }}>
                                  <QRCode
                                    size={256}
                                    style={{
                                      height: "auto",
                                      // maxWidth: "calc(100% - 10px)",
                                      // width: "calc(100% - 10px)",
                                      width: 40,
                                      padding: 2,
                                      paddingTop: "4px",
                                      paddingBottom: 0,
                                    }}
                                    value={
                                      flag === 1
                                        ? data.NAME
                                        : flag === 2
                                        ? data.ITEM_NO
                                        : ""
                                    }
                                    // value={
                                    //   flag === 1
                                    //     ? generateQRCodeValue(data.NAME)
                                    //     : flag === 2
                                    //     ? generateQRCodeValue(data.ITEM_NO)
                                    //     : ""
                                    // }
                                    // value={generateQRCodeValue(data)}
                                    viewBox={`0 0 256 256`}
                                  />
                                </div>
                              </div>
                            </div>
                            <div
                              style={{
                                width: "75%",
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "flex-start",
                                justifyContent: "flex-start",
                                padding: 2,
                                paddingLeft: 2,
                                paddingTop: "5.5px",
                                paddingRight: 2,
                              }}
                            >
                              {Object.entries(data).map(
                                ([key, value], innerIndex) =>
                                  key !== "Qr" && (
                                    <div
                                      style={{ width: "33%" }}
                                      key={innerIndex}
                                    >
                                      <div
                                        key={innerIndex}
                                        style={{
                                          width: "100%",
                                          padding: 0,
                                          paddingInline: 1,
                                          paddingLeft: 5,
                                        }}
                                      >
                                        {key !== "NAME" &&
                                          key !== "ITEM_NO" && (
                                            <span style={{ width: "50%" }}>
                                              {key}:
                                            </span>
                                          )}
                                        <span style={{ padding: 0 }}>
                                          {value}
                                        </span>
                                      </div>
                                    </div>
                                  )
                              )}
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })
                : null}
            </ul>
          </div>
        </div>
      </>
    );
  }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
  return <TaggingPrint ref={ref} printObj={props.printObj} />;
});
