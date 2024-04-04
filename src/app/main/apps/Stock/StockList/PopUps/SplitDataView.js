import React, { useState, useEffect } from "react";
import { Icon, IconButton } from "@material-ui/core";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { Button, TextField } from "@material-ui/core";
import { useDispatch } from "react-redux";
import Modal from "@material-ui/core/Modal";
import History from "@history";
import * as Actions from "app/store/actions";
import LoaderPopup from "app/main/Loader/LoaderPopup";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: {
    position: "absolute",
    // width: 400,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    outline: "none",
  },
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "cornflowerblue",
    color: "white",
  },
  table: {
    // minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
  },
  modalheight: {
    width: "600px",
    height: "450px",
  },
}));

function getModalStyle() {
  const top = 50; //+ rand();
  const left = 50; //+ rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const SplitDataView = (props) => {
  const [open, setOpen] = React.useState(true);
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();
  // const theme = useTheme();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [splitData, setSplitData] = useState([]);

  useEffect(() => {
    // getDepartmentList();
    console.log(">>>>>>", props.data);
    if (props.data !== undefined) {
      setSplitData(props.data);
    }
    //eslint-disable-next-line
  }, [dispatch, props]);

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    console.log("splitData", splitData);

    let utiliseErr = splitData.filter((element) => element.utiliseErr !== "");
    let utiliseWeightErr = splitData.filter(
      (element) => element?.utiliseWeightErr !== ""
    );
    console.log(utiliseErr);
    console.log(utiliseWeightErr);

    let pcsErr = splitData.filter((element) => element.pcserr !== "");

    let zeroVal = splitData.filter(
      (item) => item.utilize == 0 || item.utilize === ""
    );

    if (
      utiliseErr.length > 0 ||
      pcsErr.length > 0 ||
      utiliseWeightErr?.length > 0
    ) {
      return;
    } else if (zeroVal.length > 0) {
      dispatch(
        Actions.showMessage({
          message:
            "Weight is not available to transfer, It is already transferred.",
        })
      );
      return;
    } else {
      setOpen(false);
      // showModle()
      props.afterEffect(splitData);
    }
    // if (validateDept()) {
    //   transferstockRequest()
    // }
    // return (<StockTransfer Ids={selectedId} />)
  };

  // const showModle = () => {
  //     return (<StockTransfer Ids={splitData} />)
  // }

  const handleClose = () => {
    setOpen(false);
    setSplitData([]);
    props.resetVar();
    // History.push("/dashboard/stock");
    History.goBack();
  };

  console.log(splitData);
  function haldleUtilizePcsChange(event, index) {
    let val = event.target.value;
    let tempArray = [...splitData];
    // tempArray[index].element.pcs = val;

    tempArray[index].utilizePcs = val;

    tempArray[index].pcserr = "";

    if (
      tempArray[index].element.item_id === 5 ||
      tempArray[index].element.item_id === 7
    ) {
      const stoneWgt = tempArray[index].element.stone_weight
        ? tempArray[index].element.stone_weight
        : 0;
      const pcs = val ? val : 0;
      tempArray[index].utilizeWeight = parseFloat(
        parseFloat(pcs) * parseFloat(stoneWgt)
      ).toFixed(6);
    }

    if (isNaN(val)) {
      tempArray[index].pcserr = "please Enter Valid Utilize Pieces";
      setSplitData(tempArray);
      return;
    }

    if (tempArray[index].element.hasOwnProperty("available_pcs")) {
      console.log("hasOwnProperty", tempArray[index].element.available_pcs);
      if (
        parseFloat(val) > parseFloat(tempArray[index].element.available_pcs)
      ) {
        tempArray[index].pcserr = "please Enter Valid Utilize Pieces";
        setSplitData(tempArray);
        return;
      }
    }

    // if (parseFloat(val) === parseFloat(tempArray[index].element.pcs)) {
    //     console.log("same")
    //     tempArray[index].isSame = true;

    //     // tempArray[index].stock_id = tempArray[index].ids;
    //     //copy id

    //     delete tempArray[index]['is_split']
    //     delete tempArray[index]['weight']
    //     delete tempArray[index]['pcs']
    //     delete tempArray[index]['stock_name_code_id']
    //     delete tempArray[index]['department_id']
    //     delete tempArray[index]['voucher_no']

    // } else {
    const stonWgt = tempArray[index].element.stone_weight
      ? parseFloat(tempArray[index].element.stone_weight)
      : 0;
    const updatedVal = val ? val : 0;
    console.log("diff");
    tempArray[index].isSame = false;

    tempArray[index].is_split = 1;
    // tempArray[index].weight = parseFloat(parseFloat(tempArray[index].element.stone_weight) * parseFloat(val)).toFixed(3);
    tempArray[index].utilize = parseFloat(
      parseFloat(stonWgt) * parseFloat(updatedVal)
    ).toFixed(3);
    // tempArray[index].pcs = val;
    tempArray[index].stock_name_code_id =
      tempArray[index].element.stock_name_code_id;
    tempArray[index].department_id = tempArray[index].element.department_id;
    tempArray[index].voucher_no = tempArray[index].element.voucher_no;
    // }
    console.log(tempArray);

    setSplitData(tempArray);
  }
  function haldleUtilizeWeightChange(event, index) {
    let val = event.target.value;
    let tempArray = [...splitData];

    tempArray[index].utilizeWeight = val;
    tempArray[index].utiliseWeightErr = "";
    if (isNaN(val) || val <= 0) {
      tempArray[index].utiliseWeightErr = "Plz Enter Weight";
      setSplitData(tempArray);
      return;
    }
    setSplitData(tempArray);
  }
  function haldleUtilizeChange(event, index) {
    let val = event.target.value;
    let tempArray = [...splitData];

    tempArray[index].utilize = val;

    tempArray[index].utiliseErr = "";

    if (isNaN(val) || val <= 0) {
      tempArray[index].utiliseErr = "please Enter Valid Utilize";
      setSplitData(tempArray);
      return;
    }

    if (parseFloat(val) > parseFloat(tempArray[index].element.gross_weight)) {
      // setUtiliseErr("Utilize cannot be Greater than Fine");
      tempArray[index].utiliseErr =
        "Utilize cannot be Greater than Available Weight";
      setSplitData(tempArray);
      return;
    }

    if (tempArray[index].element.hasOwnProperty("available_weight")) {
      console.log("hasOwnProperty", tempArray[index].element.available_weight);
      if (
        parseFloat(val) > parseFloat(tempArray[index].element.available_weight)
      ) {
        tempArray[index].utiliseErr =
          "Utilize cannot be Greater than Available Weight";
        setSplitData(tempArray);
        return;
      }
    }
    // console.log("elem",tempArray[index].element)

    if (parseFloat(val) === parseFloat(tempArray[index].element.gross_weight)) {
      console.log("same");
      tempArray[index].isSame = true;

      // tempArray[index].stock_id = tempArray[index].ids;
      //copy id

      delete tempArray[index]["is_split"];
      delete tempArray[index]["weight"];
      delete tempArray[index]["pcs"];
      delete tempArray[index]["stock_name_code_id"];
      delete tempArray[index]["department_id"];
      delete tempArray[index]["voucher_no"];
    } else {
      console.log("diff");
      tempArray[index].isSame = false;

      tempArray[index].is_split = 1;
      tempArray[index].weight = val;
      tempArray[index].pcs = tempArray[index].pcs;
      tempArray[index].stock_name_code_id =
        tempArray[index].element.stock_name_code_id;
      tempArray[index].department_id = tempArray[index].element.department_id;
      tempArray[index].voucher_no = tempArray[index].element.voucher_no;
    }
    console.log(tempArray);

    setSplitData(tempArray);
  }


  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0">
            {open === true && (
              <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={open}
                onClose={(_, reason) => {
                  if (reason !== "backdropClick") {
                    handleClose();
                  }
                }}
              >
                <div
                  style={modalStyle}
                  className={clsx(
                    classes.paper,
                    classes.modalheight,
                    "rounded-8"
                  )}
                >
                  {loading && <LoaderPopup />}
                  <h5
                    className="popup-head mb-10"
                    style={{
                      padding: "14px",
                    }}
                  >
                    Transfer
                    <IconButton
                      style={{ position: "absolute", top: "0", right: "0" }}
                      onClick={handleClose}
                    >
                      <Icon style={{ color: "white" }}>close</Icon>
                    </IconButton>
                  </h5>
                  <div className="pl-16 pr-16  overflow-y-scroll h-320">
                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            className={classes.tableRowPad}
                            align="center"
                          >
                            Stock Code
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="center"
                          >
                            Gross Weight
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="center"
                          >
                            Net Weight
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="center"
                          >
                            Pieces
                          </TableCell>

                          <TableCell
                            className={classes.tableRowPad}
                            align="center"
                          >
                            Utilize Weight
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {splitData.map((row, index) => (
                          <TableRow
                            key={index}
                            // className={classes.hoverClass}
                          >
                            <TableCell
                              align="center"
                              className={classes.tableRowPad}
                            >
                              {row.element.stock_name_code}
                            </TableCell>

                            <TableCell
                              align="center"
                              className={classes.tableRowPad}
                            >
                              {/* {row.element.gross_weight} */}
                              {parseFloat(row.element.gross_weight).toFixed(3)}
                            </TableCell>
                            <TableCell
                              align="center"
                              className={classes.tableRowPad}
                            >
                              {/* {row.element.net_weight} */}
                              {parseFloat(row.element.net_weight).toFixed(3)}
                            </TableCell>
                            <TableCell
                              align="center"
                              className={classes.tableRowPad}
                            >
                              {row.element.item_id === 5 ||
                                row.element.item_id === 7 ? (
                                <TextField
                                  label="Utilize Pieces"
                                  name="Utilizepcs"
                                  // className="mt-16"
                                  value={row.utilizePcs}
                                  error={row.pcserr.length > 0 ? true : false}
                                  helperText={row.pcserr}
                                  onChange={(e) =>
                                    haldleUtilizePcsChange(e, index)
                                  }
                                  variant="outlined"
                                  style={{ width: "100%" }}
                                  // disabled
                                />
                              ) : (
                                row.element.pcs
                              )}
                            </TableCell>
                            <TableCell
                              align="center"
                              className={classes.tableRowPad}
                            >
                              {row.element.item_id !== 5 ? (
                                <TextField
                                  placeholder="Utilize"
                                  name="Utilize"
                                  // className="mt-16"
                                  value={row.utilize}
                                  error={
                                    row.utiliseErr.length > 0 ? true : false
                                  }
                                  helperText={row.utiliseErr}
                                  onChange={(e) =>
                                    haldleUtilizeChange(e, index)
                                  }
                                  variant="outlined"
                                  style={{ width: "100%" }}
                                  // disabled
                                />
                              ) : (
                                <TextField
                                label="Utilize"
                                name="UtilizeWeight"
                                value={row.utilizeWeight}
                                error={
                                  row?.utiliseWeightErr?.length > 0
                                    ? true
                                    : false
                                }
                                helperText={row?.utiliseWeightErr}
                                onChange={(e) =>
                                  haldleUtilizeWeightChange(e, index)
                                }
                                variant="outlined"
                                style={{ width: "100%" }}
                                // disabled
                              />

                                // (row.element.stone_weight * row.element.pcs).toFixed(3)
                                // parseFloat(
                                //   parseFloat(row.element.stone_weight) *
                                //     parseFloat(row.utilizePcs)
                                // ).toFixed(3)
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                        }
                      </TableBody>
                    </Table>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <Button
                      variant="contained"
                      className="w-128 mx-auto popup-cancel"
                      aria-label="Register"
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>

                    <Button
                      variant="contained"
                      className="w-160 mx-auto popup-save"
                      style={{ marginLeft: "20px" }}
                      aria-label="Register"
                      onClick={(e) => handleFormSubmit(e)}
                    >
                      Transfer & Save
                    </Button>
                  </div>
                </div>
              </Modal>
            )}
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default SplitDataView;
