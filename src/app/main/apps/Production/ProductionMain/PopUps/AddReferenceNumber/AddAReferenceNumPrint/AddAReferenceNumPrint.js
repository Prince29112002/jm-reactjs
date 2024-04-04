import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import * as React from "react";
import { ToWords } from "to-words";
import { withStyles } from "@material-ui/core/styles";
// import image from "../../test_image.png";
// import Config from "app/fuse-configs/Config";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
// } from "@material-ui/core";
export class AddAReferenceNumPrint extends React.PureComponent {
  componentDidMount() {
    // console.log("componentDidMount", this.props)
  }

  // setRef = (ref) => (this.canvasEl = ref);

  render() {
    // const { text } = this.props;
    const { printObj } = this.props;
    console.log(printObj);
    return (
      <div>
        <style type="text/css" media="print">
          {
            "\
             @page { size: A4 portrait !important;margin:25px 25px 25px 25px; }\
          "
          }
        </style>

        {/* <div style={{ height: "100px" }}></div> */}
        <ul>
          <li className="">
            <div className="">
              <div className="add_reference_header">
                <div className="header-tabel-deta">
                  <div
                    style={{
                      maxWidth: "120px",
                      fontSize: "12px",
                    }}
                    className="table_pad"
                  >
                    <b>Doc No.</b>
                  </div>
                  <div
                    style={{ maxWidth: "50px", fontSize: "12px" }}
                    className="table_pad"
                  >
                    {" "}
                    :{" "}
                  </div>
                  <div style={{ fontSize: "12px" }} className="table_pad">
                    {Object.keys(printObj).length !== 0 &&
                      printObj.commonData.document_number}
                  </div>
                  <div
                    style={{ maxWidth: "150px", fontSize: "12px" }}
                    className="table_pad"
                  >
                    <b>Date And Time</b>
                  </div>
                  <div
                    style={{ maxWidth: "50px", fontSize: "12px" }}
                    className="table_pad"
                  >
                    {" "}
                    :{" "}
                  </div>
                  <div style={{ fontSize: "12px" }} className="table_pad">
                    {Object.keys(printObj).length !== 0 &&
                      printObj.commonData.date}
                  </div>
                </div>
              </div>

              <div className="add_reference_header">
                <div
                  className="header-tabel-deta"
                  style={{ borderTop: "none", borderBottom: "none" }}
                >
                  <div
                    style={{
                      maxWidth: "120px",
                      fontSize: "12px",
                    }}
                    className="table_pad"
                  >
                    <b>Sor. Dep.</b>
                  </div>
                  <div
                    style={{ maxWidth: "50px", fontSize: "12px" }}
                    className="table_pad"
                  >
                    {" "}
                    :{" "}
                  </div>
                  <div style={{ fontSize: "12px" }} className="table_pad">
                    {Object.keys(printObj).length !== 0 &&
                      printObj.commonData.source_department}
                  </div>
                  <div
                    style={{ maxWidth: "150px", fontSize: "12px" }}
                    className="table_pad"
                  >
                    <b>Des. Dep.</b>
                  </div>
                  <div
                    style={{ maxWidth: "50px", fontSize: "12px" }}
                    className="table_pad"
                  >
                    {" "}
                    :{" "}
                  </div>
                  <div style={{ fontSize: "12px" }} className="table_pad">
                    {Object.keys(printObj).length !== 0 &&
                      printObj.commonData.destination_department}
                  </div>
                </div>
              </div>
              <Table className="add_refference_table">
                <TableHead>
                  <TableRow>
                    <TableCell className="table_pad" width={95}>
                      Refe. No.
                    </TableCell>
                    <TableCell className="table_pad" width={78}>
                      Wax Wt.
                    </TableCell>
                    <TableCell className="table_pad" width={125}>
                      Tree No
                    </TableCell>
                    <TableCell className="table_pad" width={135}>
                      Lot NO
                    </TableCell>
                    <TableCell className="table_pad" width={60}>
                      Purity
                    </TableCell>
                    <TableCell className="table_pad">CAT. Code</TableCell>
                    <TableCell className="table_pad" width={45}>
                      Pcs
                    </TableCell>
                    <TableCell className="table_pad" width={95}>
                      Stone Wgt
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(printObj).length !== 0 &&
                    printObj.treeData.map((data, index) => {
                      console.log(data);
                      return data.treeOrderDetails.map((item, i) => {
                        return (
                          <TableRow key={i}>
                            {i === 0 && (
                              // data.treeOrderDetails.length > 1 &&
                              <>
                                <TableCell
                                  className="table_pad"
                                  rowSpan={data.treeOrderDetails.length}
                                >
                                  {data.reference_number}
                                </TableCell>

                                <TableCell
                                  className="table_pad"
                                  rowSpan={data.treeOrderDetails.length}
                                >
                                  {data.weight}
                                </TableCell>

                                <TableCell
                                  className="table_pad"
                                  rowSpan={data.treeOrderDetails.length}
                                >
                                  {data.tree_number}
                                </TableCell>
                              </>
                            )}
                            <TableCell className="table_pad">
                              {item.lotDetailsforTree.number}
                            </TableCell>
                            <TableCell className="table_pad">
                              {item.lotDetailsforTree.purity}
                            </TableCell>
                            <TableCell className="table_pad">
                              {
                                item.lotDetailsforTree.ProductCategory
                                  .category_code
                              }
                            </TableCell>
                            <TableCell className="table_pad">
                              {item.lotDetailsforTree.pcs}
                            </TableCell>
                            <TableCell className="table_pad">
                              {item.lotDetailsforTree.total_stone_weight}
                            </TableCell>
                          </TableRow>
                        );
                      });
                    })}
                </TableBody>
              </Table>
            </div>
          </li>
        </ul>
      </div>
    );
  }
}
export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
  // eslint-disable-line max-len text={props.text}
  return <AddAReferenceNumPrint ref={ref} printObj={props.printObj} />;
});
