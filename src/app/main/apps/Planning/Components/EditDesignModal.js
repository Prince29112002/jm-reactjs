import React, { useState, useEffect } from "react";
import {
  Grid,
  Icon,
  IconButton,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import { TextField } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import Select, { createFilter } from "react-select";
import LoaderPopup from "app/main/Loader/LoaderPopup";
import Axios from "axios";
import Config from "app/fuse-configs/Config";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import * as Actions from "app/store/actions";

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: {
    position: "absolute",
    overflow: "auto",
    width: "1300px",
    maxWidth: "calc(100vw - 30px)",
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
  tableRowPad: {
    padding: 7,
  },
  textfieldBackground: {
    "& .MuiInputBase-input": {
      background: "#d3d3d3 !important",
    },
  },
  errorMessage: {
    color: "#f44336",
    position: "absolute",
    bottom: "0px",
    fontSize: "9px",
    lineHeight: "8px",
    marginTop: 3,
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

const EditDesignModal = ({ openModal, closeModal, data }) => {
  console.log(data);
  const [open, setOpen] = React.useState(true);
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [designData, setDesignData] = useState([]);
  const [stoneData, setStoneData] = useState([]);
  const [pieces, setPieces] = useState("");

  const [stockList, setStockList] = useState([]);
  const [baggingList, setBaggingList] = useState([]);
  const [typeOfSettingList, setTypeOfSettingList] = useState([]);
  useEffect(() => {
    setDesignData(data);
    const updateData =
      data.ProductionOrderDesignStoneDetails &&
      data.ProductionOrderDesignStoneDetails.map((item) => {
        console.log(item);
        const stonePcs = item.stone_pcs || 0;
        const weightUpdate = item.weight || 0;
        const stonePieces = stonePcs * (data.pieces || 0);
        const weight = parseFloat(weightUpdate * stonePieces).toFixed(4);
        return {
          ...item,
          stone_pcs: stonePieces,
          weight: weight,
          stoneWeight: item.weight,
          exit_stock_name_id: item.stock_name_id,
          exit_type_of_setting_id: item.type_of_setting_id,
        };
      });
    setStoneData(updateData);
    setPieces(data.pieces);
  }, [data]);
  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };
  useEffect(() => {
    getStockCode();
    getDroupDown(2);
    getDroupDown(3);
  }, []);

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  function getStockCode() {
    Axios.get(Config.getCommonUrl() + "api/stockname/stone")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          const stockData = response.data.data;
          setStockList(stockData);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        console.log(error);
        handleError(error, dispatch, { api: "api/stockname/stone" });
      });
  }
  function getDroupDown(flag) {
    Axios.get(Config.getCommonUrl() + `api/designDropDown?flag=${flag}`)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          const arrData = response.data.data;
          //   if (flag === 1) {
          //       setSettingMehodList(arrData)
          //   } else
          if (flag === 2) {
            setBaggingList(arrData);
          } else if (flag === 3) {
            setTypeOfSettingList(arrData);
          }
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        console.log(error);
        handleError(error, dispatch, {
          api: `api/designDropDown?flag=${flag}`,
        });
      });
  }
  function validateStonePcs() {
    for (const order of stoneData) {
      const stonePcsNum = order.stone_pcs ? parseFloat(order.stone_pcs) : 0;
      const piecesNum = parseFloat(data.pieces);

      if (isNaN(stonePcsNum) || isNaN(piecesNum) || piecesNum === 0) {
        dispatch(
          Actions.showMessage({
            message: `Plz enter valid pcs`,
            variant: "error",
          })
        );
        return false;
      }
      const remainder = stonePcsNum % piecesNum;
      if (remainder !== 0) {
        dispatch(
          Actions.showMessage({
            message: `Plz enter valid pcs`,
            variant: "error",
          })
        );
        return false;
      }
    }
    return true;
  }
  function handleFormSubmit() {
    if (
      validateStonePcs() &&
      addStockValidate() &&
      mulPcsValidate() &&
      designValidate()
    ) {
      handleUpdateDesign();
    }
    // else {
    //   dispatch(
    //     Actions.showMessage({
    //       message: `Plz enter valid pcs`,
    //       variant: "error",
    //     })
    //   );
    // }
  }
  function deleteDesign(index, id) {
    Axios.delete(
      Config.getCommonUrl() + `api/productionorder/stone/remove/${id}`
    )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          deleteStoneData(index);
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
      })
      .catch((error) => {
        console.log(error);
        handleError(error, dispatch, {
          api: `api/productionorder/stone/remove/${id}`,
        });
      });
  }
  function handleUpdateDesign() {
    const updatedStoneData =
      stoneData &&
      stoneData.map((item) => {
        console.log(item);
        const { stoneWeight, errors, ...rest } = item;
        const stonePcs = parseFloat(item.stone_pcs) || 0;
        console.log(stonePcs);
        const weightUpdate = item.weight || 0;
        const stonePieces = parseFloat(stonePcs) / parseFloat(data.pieces || 0);
        console.log(stonePieces);
        const weight = parseFloat(
          parseFloat(weightUpdate) / parseFloat(stonePcs)
        ).toFixed(4);
        return {
          // ...rest,
          stone_pcs: stonePieces,
          weight: weight,
          exit_stock_name_id: item.exit_stock_name_id,
          stock_name_id: item.stock_name_id,
          design_mold_id: item.design_mold_id,
          type_of_setting_id: item.type_of_setting_id,
          bagging_id: item.bagging_id,
          exit_type_of_setting_id: item.exit_type_of_setting_id,
        };
      });
    console.log(updatedStoneData);
    const body = {
      stone_design: updatedStoneData,
      Lot_id: data?.Lot_id,
    };
    Axios.put(
      Config.getCommonUrl() + `api/productionorder/stone/edit/${designData.id}`,
      body
    )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          closeModal();
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        console.log(error);
        handleError(error, dispatch, {
          api: `api/productionorder/stone/edit/${designData.id}`,
          body,
        });
      });
  }

  console.log(stoneData);
  function handleUpdateDesign() {
    const updatedStoneData =
      stoneData &&
      stoneData.map((item) => {
        console.log(item);
        const { stoneWeight, errors, ...rest } = item;
        const stonePcs = parseFloat(item.stone_pcs) || 0;
        console.log(stonePcs);
        const weightUpdate = item.weight || 0;
        const stonePieces = parseFloat(stonePcs) / parseFloat(data.pieces || 0);
        console.log(stonePieces);
        const weight = parseFloat(
          parseFloat(weightUpdate) / parseFloat(stonePcs)
        ).toFixed(4);
        return {
          // ...rest,
          stone_pcs: stonePieces,
          weight: weight,
          exit_stock_name_id: item.exit_stock_name_id,
          stock_name_id: item.stock_name_id,
          design_mold_id: item.design_mold_id,
          type_of_setting_id: item.type_of_setting_id,
          bagging_id: item.bagging_id,
          exit_type_of_setting_id: item.exit_type_of_setting_id,
        };
      });
    console.log(updatedStoneData);
    const body = {
      stone_design: updatedStoneData,
      Lot_id: data?.Lot_id,
    };
    Axios.put(
      Config.getCommonUrl() + `api/productionorder/stone/edit/${designData.id}`,
      body
    )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          closeModal();
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        console.log(error);
        handleError(error, dispatch, {
          api: `api/productionorder/stone/edit/${designData.id}`,
          body,
        });
      });
  }

  const handleStockChange = (stock, index) => {
    console.log(stock);
    const dataArr = [...stoneData];
    console.log(stoneData);

    dataArr[index].weight = parseFloat(
      stock.weight * stoneData[index].stone_pcs
    ).toFixed(4);
    dataArr[index].Stock_name.stock_code = stock.label;
    dataArr[index].Stock_name.id = stock.value;
    dataArr[index].stock_name_id = stock.value;
    dataArr[index].stoneWeight = stock.weight;
    if (dataArr[index].errors?.stock_name_id) {
      dataArr[index].errors.stock_name_id = "";
    }
    console.log(dataArr);
    setStoneData(dataArr);
  };
  const handleFirstSelect = (stock, index) => {
    console.log(stock, index);
    const dataArr = [...stoneData];

    dataArr[index].BaggingMasterOrders.bagging = stock.label;
    dataArr[index].BaggingMasterOrders.id = stock.value;
    dataArr[index].bagging_id = stock.value;
    if (dataArr[index].errors?.bagging_id) {
      dataArr[index].errors.bagging_id = "";
    }
    setStoneData(dataArr);
  };
  const handleSecoundSelect = (stock, index) => {
    console.log(stock);
    const dataArr = [...stoneData];

    dataArr[index].TypeOfSettingMasterOrders.type = stock.label;
    dataArr[index].TypeOfSettingMasterOrders.id = stock.value;
    dataArr[index].type_of_setting_id = stock.value;
    if (dataArr[index].errors?.type_of_setting_id) {
      dataArr[index].errors.type_of_setting_id = "";
    }
    console.log(dataArr);
    setStoneData(dataArr);
  };
  const addStoneData = () => {
    const stonDataObj = {
      id: "",
      stock_name_id: "",
      design_mold_id: "",
      stone_pcs: "",
      weight: "",
      type_of_setting_id: "",
      bagging_id: "",
      Stock_name: { id: "", stock_code: "" },
      BaggingMasterOrders: { id: "", bagging: "" },
      TypeOfSettingMasterOrders: { id: "", type: "" },
      stoneWeight: "",
    };
    const updatedStoneData = [...stoneData, stonDataObj];
    setStoneData(updatedStoneData);
  };
  const deleteStoneData = (index) => {
    // if (stoneData.length === 1) {
    //   dispatch(
    //     Actions.showMessage({
    //       message: "You can not Delete all Stone",
    //       variant: "error",
    //     })
    //   );
    // } else {
    const updatedStoneData = [...stoneData];
    updatedStoneData.splice(index, 1);
    setStoneData(updatedStoneData);
    // }
  };
  const handleChange = (event, index) => {
    const { value, name } = event.target;
    console.log(value, name);
    if (name === "weight" && !/^\d*\.?\d*$/.test(value)) {
      return;
    }
    if (name === "stone_pcs" && !/^$|^\d+$/.test(value)) {
      return;
    }
    const dataArr = [...stoneData];
    dataArr[index][name] = value;
    dataArr[index].errors = {
      ...dataArr[index].errors,
      [name]: "",
    };

    if (name === "stone_pcs") {
      dataArr[index]["weight"] = parseFloat(
        value * dataArr[index]["stoneWeight"]
      ).toFixed(4);
      dataArr[index].errors = {
        ...dataArr[index].errors,
        ["weight"]: "",
      };
    }
    setStoneData(dataArr);
    console.log(dataArr);
  };
  const addStockValidate = () => {
    let hasErrors = false;

    const updatedAddStockData = stoneData.map((data) => {
      console.log(data);
      // if (data.stock_name_id) {
      console.log("dasfsadf asdf asdf asdf");
      if (data.stock_name_id === "") {
        data.errors = {
          ...data.errors,
          stock_name_id: "Plz Select Varient Name",
        };
        hasErrors = true;
      }
      if (data.stone_pcs === "") {
        data.errors = {
          ...data.errors,
          stone_pcs: "Plz Enter Qty",
        };
        hasErrors = true;
      }
      if (data.weight === "") {
        data.errors = {
          ...data.errors,
          weight: "Plz Enter Weight",
        };
        hasErrors = true;
      }
      if (data.bagging_id === "") {
        data.errors = {
          ...data.errors,
          bagging_id: "Plz Select Stonestud Op",
        };
        hasErrors = true;
      }
      if (data.type_of_setting_id === "") {
        data.errors = {
          ...data.errors,
          type_of_setting_id: "Plz Select Setting Type",
        };
        hasErrors = true;
      }
      if (!hasErrors) {
        data.errors = {
          stock_name_id: "",
          stone_pcs: "",
          weight: "",
          bagging_id: "",
          type_of_setting_id: "",
        };
      }
      // }
      return data;
    });

    if (!hasErrors) {
      return true;
    }
    setStoneData(updatedAddStockData);
  };

  console.log(stoneData);
  const mulPcsValidate = () => {
    const totalStonePieces = stoneData.reduce(
      (total, detail) => total + parseFloat(detail.stone_pcs),
      0
    );
    console.log(totalStonePieces);
    console.log(designData.total_stone_pcs_multiply);
    if (designData.total_stone_pcs_multiply !== totalStonePieces) {
      dispatch(
        Actions.showMessage({
          message: `You must enter Total ${designData.total_stone_pcs_multiply} Pcs`,
          variant: "error",
        })
      );
      return false;
    } else {
      return true;
    }
  };

  const designValidate = () => {
    const designDetail = stoneData;
    const seen = new Set();
    for (const detail of designDetail) {
      const key = `${detail.Stock_name.stock_code}_${detail.TypeOfSettingMasterOrders.type}`;
      if (seen.has(key)) {
        dispatch(
          Actions.showMessage({
            message: `You can't select same Varient Name and Setting Type`,
            variant: "error",
          })
        );
        return false;
      }
      seen.add(key);
    }
    return true;
  };



  return (
    <div className={clsx(classes.root, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0">
            {/* {open === true && ( */}
            <Modal open={openModal} onClose={closeModal}>
              <div style={modalStyle} className={classes.paper}>
                {loading && <LoaderPopup />}
                <h5
                  className="p-5"
                  style={{
                    textAlign: "center",
                    backgroundColor: "black",
                    color: "white",
                  }}
                >
                  {designData.lot_number && (
                    <>{designData.lot_number} &nbsp;&nbsp;||&nbsp;&nbsp; </>
                  )}
                  {designData.batch_number && (
                    <>{designData.batch_number} &nbsp;&nbsp;||&nbsp;&nbsp; </>
                  )}
                  {designData?.variant_no} &nbsp;&nbsp; * &nbsp;&nbsp; {pieces}
                  (Pcs)
                  <IconButton
                    style={{ position: "absolute", top: "0", right: "0" }}
                    onClick={closeModal}
                  >
                    <Icon style={{ color: "white" }}>close</Icon>
                  </IconButton>
                </h5>
                <div style={{ overflow: "auto" }}>
                  <div
                    style={{
                      padding: 20,
                      maxHeight: "calc(100vh - 200px)",
                      minHeight: 400,
                      width: 1300,
                      paddingBottom: 0,
                    }}
                  >
                    <Grid container alignItems="flex-start">
                      <Grid item xs={12} md={8}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell
                                className={classes.tableRowPad}
                                width={40}
                              ></TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                width={180}
                              >
                                Varient Name
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                width={130}
                              >
                                Stone Weight
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                width={90}
                              >
                                Qty
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                width={130}
                              >
                                Weight
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Stonestud Op
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Setting Type
                                <IconButton
                                  fontSize="medium"
                                  style={{
                                    color: "#ffffff",
                                    cursor: "pointer",
                                    padding: 5,
                                    marginBlock: 4,
                                    background: "#415bd4",
                                    marginLeft: "8px",
                                  }}
                                  variant="filled"
                                  onClick={() =>
                                    addStoneData(designData.length)
                                  }
                                >
                                  <Icon
                                    className="editAllAddIcon"
                                    style={{ color: "#ffffff !important" }}
                                  >
                                    add
                                  </Icon>
                                </IconButton>
                              </TableCell>
                              {/* <TableCell
                                className={classes.tableRowPad}
                                width={50}
                              ></TableCell> */}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {designData.length !== 0 &&
                              stoneData.map((row, index) => {
                                console.log(row);
                                console.log(stockList);

                                const myList = stoneData.map(
                                  (item1) => item1.stock_name_id
                                );
                                const FilterList = myList.filter(
                                  (item) => item !== row.stock_name_id
                                );
                                console.log(myList, FilterList);
                                return (
                                  <TableRow key={index}>
                                    <TableCell className={classes.tableRowPad}>
                                      {/* {row.is_editable !== 0 && ( */}
                                        <IconButton
                                          fontSize="medium"
                                          style={{
                                            color: "red",
                                            cursor: "pointer",
                                            padding: 5,
                                            marginBlock: 4,
                                          }}
                                          variant="filled"
                                          disabled={row.is_editable === 0}
                                          onClick={() => deleteStoneData(index)}
                                        >
                                          <Icon
                                            className=""
                                            style={{ color: "red" }}
                                          >
                                            delete
                                          </Icon>
                                        </IconButton>
                                      {/* )} */}

                                    </TableCell>
                                    {/* <TableCell
                                      className={classes.tableRowPad}
                                      align="center"
                                    >
                                      <b
                                        style={{
                                          fontWeight: 800,
                                          color: "#415bd4",
                                          width: "35px",
                                          height: "35px",
                                          display: "block",
                                          padding: "6px",
                                          background: "lightgrey",
                                          borderRadius: "50%",
                                          fontSize: "16px",
                                        }}
                                      >
                                        {row.status_flag}
                                      </b>
                                    </TableCell> */}

                                    <TableCell
                                      className={classes.tableRowPad}
                                      style={{ position: "relative" }}
                                    >
                                      <Select
                                        filterOption={createFilter({
                                          ignoreAccents: false,
                                        })}
                                        className={classes.selectBox}
                                        classes={classes}
                                        styles={selectStyles}
                                        options={stockList
                                          // .filter(
                                          //   (item) =>
                                          //     !FilterList.includes(
                                          //       item.stock_name_code.id
                                          //     )
                                          // )
                                          .map((suggestion) => ({
                                            value:
                                              suggestion.stock_name_code.id,
                                            label:
                                              suggestion.stock_name_code
                                                .stock_code,
                                            weight:
                                              suggestion.stock_name_code.weight,
                                          }))}
                                        value={
                                          row.Stock_name.id
                                            ? {
                                                value: row.Stock_name.id,
                                                label:
                                                  row.Stock_name.stock_code,
                                              }
                                            : ""
                                        }
                                        onChange={(e) => {
                                          handleStockChange(e, index);
                                        }}
                                        placeholder="Select..."
                                        // defaultValue={undefined}
                                        // isDisabled={row.is_editable === 0}
                                      />
                                      <span className={classes.errorMessage}>
                                        {row.errors?.stock_name_id
                                          ? row.errors?.stock_name_id
                                          : ""}
                                      </span>
                                      {/* <TextField
                                          // label="Order Date"
                                          name="varientname"
                                          value={row.Stock_name?.stock_code}
                                          onChange={handleDesignChange(row)}
                                          variant="outlined"
                                          fullWidth
                                          InputLabelProps={{
                                            shrink: true,
                                          }}
                                        /> */}
                                    </TableCell>

                                    <TableCell className={classes.tableRowPad}>
                                      <TextField
                                        // label="Order Date"
                                        name="stoneWeight"
                                        value={row?.stoneWeight}
                                        onChange={(e) => handleChange(e, index)}
                                        variant="outlined"
                                        fullWidth
                                        disabled
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
                                        className={classes.textfieldBackground}
                                      />
                                    </TableCell>

                                    <TableCell className={classes.tableRowPad}>
                                      <TextField
                                        // label="Order Date"
                                        name="stone_pcs"
                                        // value={row?.stone_pcs * data.pieces}
                                        value={row?.stone_pcs}
                                        onChange={(e) => handleChange(e, index)}
                                        variant="outlined"
                                        fullWidth
                                        // disabled
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
                                        error={
                                          row.errors !== undefined
                                            ? row.errors.stone_pcs
                                              ? true
                                              : false
                                            : false
                                        }
                                        helperText={
                                          row.errors !== undefined
                                            ? row.errors.stone_pcs
                                            : ""
                                        }
                                        // className={classes.textfieldBackground}
                                      />
                                    </TableCell>

                                    {console.log(row?.weight, row?.stone_pcs)}

                                    <TableCell className={classes.tableRowPad}>
                                      <TextField
                                        // label="Order Date"
                                        name="weight"
                                        // value={
                                        //   totalWeight(
                                        //     row?.weight,
                                        //     row?.stone_pcs * data.pieces
                                        //   )
                                        // }
                                        value={row?.weight}
                                        // disabled
                                        onChange={(e) => handleChange(e, index)}
                                        variant="outlined"
                                        fullWidth
                                        // isDisabled={row.is_editable === 0}
                                        InputLabelProps={{
                                          shrink: true,
                                        }}
                                        error={
                                          row.errors !== undefined
                                            ? row.errors.weight
                                              ? true
                                              : false
                                            : false
                                        }
                                        helperText={
                                          row.errors !== undefined
                                            ? row.errors.weight
                                            : ""
                                        }
                                        // className={classes.textfieldBackground}
                                      />
                                    </TableCell>

                                    <TableCell
                                      className={classes.tableRowPad}
                                      style={{ position: "relative" }}
                                    >
                                      <Select
                                        filterOption={createFilter({
                                          ignoreAccents: false,
                                        })}
                                        className={classes.selectBox}
                                        classes={classes}
                                        styles={selectStyles}
                                        isDisabled={row.is_editable === 0}
                                        options={baggingList.map(
                                          (suggestion) => ({
                                            value: suggestion.id,
                                            label: suggestion.bagging,
                                          })
                                        )}
                                        value={
                                          row.BaggingMasterOrders.id
                                            ? {
                                                value:
                                                  row.BaggingMasterOrders.id,
                                                label:
                                                  row.BaggingMasterOrders
                                                    .bagging,
                                              }
                                            : ""
                                        }
                                        onChange={(e) => {
                                          handleFirstSelect(e, index);
                                        }}
                                        placeholder="Select..."
                                      />
                                      <span className={classes.errorMessage}>
                                        {row.errors?.bagging_id
                                          ? row.errors?.bagging_id
                                          : ""}
                                      </span>
                                      {/* <TextField
                                          // label="Order Date"
                                          name="stonestudop"
                                          value={row.BaggingMasterOrders.bagging}
                                          // onChange={handleSearchChange}
                                          variant="outlined"
                                          fullWidth
                                          InputLabelProps={{
                                            shrink: true,
                                          }}
                                        /> */}
                                    </TableCell>

                                    <TableCell
                                      className={classes.tableRowPad}
                                      style={{ position: "relative" }}
                                    >
                                      <Select
                                        filterOption={createFilter({
                                          ignoreAccents: false,
                                        })}
                                        className={classes.selectBox}
                                        classes={classes}
                                        styles={selectStyles}
                                        options={typeOfSettingList.map(
                                          (suggestion) => ({
                                            value: suggestion.id,
                                            label: suggestion.type,
                                          })
                                        )}
                                        value={
                                          row.TypeOfSettingMasterOrders.id
                                            ? {
                                                value:
                                                  row.TypeOfSettingMasterOrders
                                                    .id,
                                                label:
                                                  row.TypeOfSettingMasterOrders
                                                    .type,
                                              }
                                            : ""
                                        }
                                        onChange={(e) => {
                                          handleSecoundSelect(e, index);
                                        }}
                                        placeholder="Select..."
                                        // isDisabled={row.is_editable === 0}
                                      />
                                      <span className={classes.errorMessage}>
                                        {row.errors?.type_of_setting_id
                                          ? row.errors?.type_of_setting_id
                                          : ""}
                                      </span>
                                      {/* <TextField
                                          // label="Order Date"
                                          name="settingtype"
                                          value={
                                            row.TypeOfSettingMasterOrders?.type
                                          }
                                          // onChange={handleSearchChange}
                                          variant="outlined"
                                          fullWidth
                                          InputLabelProps={{
                                            shrink: true,
                                          }}
                                        /> */}
                                    </TableCell>
                                    {/* <TableCell className={classes.tableRowPad}> */}
                                    {/* {stoneData.length - 1 === index && (
                                        <IconButton
                                          fontSize="medium"
                                          style={{
                                            color: "#ffffff",
                                            cursor: "pointer",
                                            padding: 5,
                                            marginBlock: 4,
                                            background: "#415bd4",
                                          }}
                                          variant="filled"
                                          onClick={() => addStoneData(index)}
                                        >
                                          <Icon
                                            className=""
                                            style={{ color: "#ffffff" }}
                                          >
                                            add
                                          </Icon>
                                        </IconButton>
                                      )} */}
                                    {/* </TableCell> */}
                                  </TableRow>
                                );
                              })}
                          </TableBody>
                        </Table>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={4}
                        style={{ position: "sticky", top: 0 }}
                      >
                        <img
                          src={
                            designData.length !== 0 &&
                            designData.Design.image_files[0]?.image_file
                          }
                          style={{ maxWidth: 400 }}
                          alt="design"
                        />
                      </Grid>
                    </Grid>
                  </div>
                </div>
                <Grid container alignItems="center">
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      className="w-full mx-auto"
                      style={{
                        // backgroundColor:
                        //   data.is_lot_created === 1 ? "#ccc" : "#4caf50",
                        backgroundColor: "#4caf50",
                        border: "none",
                        color: "white",
                        display: "block",
                        maxWidth: 200,
                        marginBlock: 15,
                        // cursor:
                        //   data.is_lot_created === 1 ? "none" : "pointer",
                      }}
                      onClick={(e) => {
                        handleFormSubmit(e);
                      }}
                      // disabled={data.is_lot_created === 1}
                    >
                      SAVE
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </Modal>
            {/* )} */}
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default EditDesignModal;
