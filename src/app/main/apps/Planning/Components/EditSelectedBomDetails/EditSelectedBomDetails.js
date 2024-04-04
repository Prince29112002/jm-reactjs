import { FuseAnimate } from "@fuse";
import History from "@history";
import {
  Box,
  Button,
  Grid,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import { Add, Delete, KeyboardBackspace, Search } from "@material-ui/icons";
import { makeStyles, useTheme } from "@material-ui/styles";
import Config from "app/fuse-configs/Config";
// import BreadcrumbsHelper from "app/main/BreadCrubms/BreadcrumbsHelper";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Select, { createFilter } from "react-select";
import * as Actions from "app/store/actions";
// import { useLocation } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {},
  tableRowPad: {
    padding: 7,
  },
  bredcrumbTitle: {
    fontWeight: "700",
    fontSize: "18px",
    marginBottom: 12,
    paddingLeft: 16,
  },
  modalContainer: {
    paddingBlock: "20px",
    background: "rgba(0,0,0,0)",
    justifyContent: "space-between",
  },
  textfieldBackground: {
    "& .MuiInputBase-input": {
      background: "#d3d3d3 !important",
    },
  },
}));

const EditSelectedBomDetails = (props) => {
  console.log(props.location?.state.id);
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();

  // const location = useLocation();
  // const receivedData = location.state;
  // console.log(receivedData);

  const [designData, setDesignData] = useState([]);

  const [stockList, setStockList] = useState([]);
  const [baggingList, setBaggingList] = useState([]);
  const [typeOfSettingList, setTypeOfSettingList] = useState([]);

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
    if (props.location?.state.id) {
      getEditBomDetails(
        props.location?.state.id,
        props.location?.state.designArray
      );
    }
  }, []);

  function getEditBomDetails(id, designArray) {
    const body = {
      order_id: id,
      design_Array: designArray,
    };
    Axios.post(
      Config.getCommonUrl() + `api/productionorder/design-wise/stone`,
      body
    )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          if (response.data.data.length > 0) {
            console.log(response.data.data);
            const updatedDesignData = response.data.data.map((item) => {
              console.log(item);
              return {
                ...item,
                exit_stock_name_id: item.stock_name_id,
                exit_type_of_setting_id: item.type_of_setting_id,
              };
            });
            console.log(updatedDesignData);
            setDesignData(updatedDesignData);
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
        } else {
          // setVoucherApiData([]);
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/productionorder/design-wise/stone`,
          body,
        });
      });
  }

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

  const designValidate = () => {
    const designDetail = designData;
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

  const handleUpdateDesign = () => {
    if (designValidate()) {
      updateDesignData();
    }
  };

  console.log(designData);
  function updateDesignData() {
    const updatedDesignData = designData.map((item) => {
      return {
        exit_stock_name_id: item.exit_stock_name_id,
        stock_name_id: item.stock_name_id,
        weight: item.weight,
        bagging_id: item.BaggingMasterOrders.id,
        exit_type_of_setting_id: item.exit_type_of_setting_id,
        type_of_setting_id: item.type_of_setting_id,
      };
    });
    const body = {
      order_id: props.location?.state.id,
      stone_design: updatedDesignData,
      design_Array: props.location?.state.designArray,
    };
    Axios.post(
      Config.getCommonUrl() + `api/productionorder/design/stone/edit`,
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
          getEditBomDetails(
            props.location?.state.id,
            props.location?.state.designArray
          );
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        console.log(error);
        handleError(error, dispatch, {
          api: `api/productionorder/design/stone/edit`,
          body,
        });
      });
  }

  const handleStockChange = (stock, index) => {
    const dataArr = [...designData];
    console.log(designData);
    console.log(stock);
    dataArr[index].weight = stock.weight;
    dataArr[index].Stock_name.stock_code = stock.label;
    dataArr[index].Stock_name.id = stock.value;
    dataArr[index].stock_name_id = stock.value;
    console.log(dataArr);
    setDesignData(dataArr);
  };
  
  const handleFirstSelect = (stock, index) => {
    console.log(stock, index);
    const dataArr = [...designData];
    dataArr[index].BaggingMasterOrders.bagging = stock.label;
    dataArr[index].BaggingMasterOrders.id = stock.value;
    dataArr[index].bagging_id = stock.value;
    setDesignData(dataArr);
  };

  const handleSecoundSelect = (stock, index) => {
    console.log(stock);
    const dataArr = [...designData];
    dataArr[index].TypeOfSettingMasterOrders.type = stock.label;
    dataArr[index].TypeOfSettingMasterOrders.id = stock.value;
    dataArr[index].type_of_setting_id = stock.value;
    console.log(dataArr);
    setDesignData(dataArr);
  };

  function totalWeight(weight, qty) {
    const stoneWeight = weight ? weight : 0;
    const stoneQty = qty ? qty : 0;
    let weightQty = parseFloat(stoneWeight) * parseFloat(stoneQty);
    weightQty = parseFloat(weightQty).toFixed(5);
    return weightQty;
  }

  return (
    <>
      <Box className={classes.model} style={{ height: "100%" }}>
        <Grid container className={classes.modalContainer}>
          <Grid item xs={12} sm={8} md={6} key="1">
            <FuseAnimate delay={300}>
              <Typography className={classes.bredcrumbTitle}>
                Edit Selected BOM Details
              </Typography>
            </FuseAnimate>
            {/* <BreadcrumbsHelper /> */}
          </Grid>
          <Grid
            item
            sm={4}
            md={6}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              paddingRight: 16,
              columnGap: 10,
            }}
          >
            <Button
              startIcon={<KeyboardBackspace style={{ color: "#6a6a6a" }} />}
              variant="contained"
              onClick={(event) => {
                History.goBack();
              }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              style={{
                background: "#415bd4",
                width: "150px",
                color: "#FFFFFF",
                fontWeight: "800",
              }}
              onClick={handleUpdateDesign}
            >
              Save
            </Button>
          </Grid>
        </Grid>
        <Box style={{ paddingInline: 16, paddingBottom: "6%" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableRowPad}>
                  Varient Name
                </TableCell>
                <TableCell className={classes.tableRowPad} width={200}>
                  Stone Weight
                </TableCell>
                <TableCell className={classes.tableRowPad} width={150}>
                  Qty
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  Weight
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  Stonestud Op
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  Setting Type
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {designData.map((row, index) => {
                console.log(row);
                console.log(stockList);

                const myList = designData.map((item1) => item1.stock_name_id);
                const FilterList = myList.filter(
                  (item) => item !== row.stock_name_id
                );
                console.log(myList, FilterList);

                return (
                  <TableRow key={index}>
                    <TableCell className={classes.tableRowPad}>
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
                          //     !FilterList.includes(item.stock_name_code.id)
                          // )
                          .map((suggestion) => ({
                            value: suggestion.stock_name_code.id,
                            label: suggestion.stock_name_code.stock_code,
                            weight: suggestion.stock_name_code.weight,
                          }))}
                        value={
                          row.Stock_name
                            ? {
                                value: row.Stock_name.id,
                                label: row.Stock_name.stock_code,
                              }
                            : ""
                        }
                        onChange={(e) => {
                          handleStockChange(e, index);
                        }}
                      />
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      <TextField
                        name="stoneWeight"
                        value={row?.weight}
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
                        name="qty"
                        value={row?.totalStonePcs}
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
                        name="weight"
                        value={totalWeight(row?.weight, row?.totalStonePcs)}
                        disabled
                        variant="outlined"
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                        className={classes.textfieldBackground}
                      />
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      <Select
                        filterOption={createFilter({
                          ignoreAccents: false,
                        })}
                        className={classes.selectBox}
                        classes={classes}
                        styles={selectStyles}
                        options={baggingList.map((suggestion) => ({
                          value: suggestion.id,
                          label: suggestion.bagging,
                        }))}
                        value={
                          row.BaggingMasterOrders
                            ? {
                                value: row.BaggingMasterOrders.id,
                                label: row.BaggingMasterOrders.bagging,
                              }
                            : ""
                        }
                        onChange={(e) => {
                          handleFirstSelect(e, index);
                        }}
                      />
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      <Select
                        filterOption={createFilter({
                          ignoreAccents: false,
                        })}
                        className={classes.selectBox}
                        classes={classes}
                        styles={selectStyles}
                        options={typeOfSettingList.map((suggestion) => ({
                          value: suggestion.id,
                          label: suggestion.type,
                        }))}
                        value={
                          row.TypeOfSettingMasterOrders
                            ? {
                                value: row.TypeOfSettingMasterOrders.id,
                                label: row.TypeOfSettingMasterOrders.type,
                              }
                            : ""
                        }
                        onChange={(e) => {
                          handleSecoundSelect(e, index);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </>
  );
};

export default EditSelectedBomDetails;
