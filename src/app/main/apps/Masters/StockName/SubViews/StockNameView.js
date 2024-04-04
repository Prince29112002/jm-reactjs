import React, { useState, useEffect } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { Icon, IconButton, InputBase } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Loader from "../../../../Loader/Loader";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},
  tabroot: {
    // width: "fit-content",
    // marginTop: theme.spacing(3),
    overflowX: "auto",
    overflowY: "auto",
    height: "90%",
  },
  table: {
    tableLayout: "auto",
    minWidth: 1500,
  },
  tableRowPad: {
    padding: 7,
  },
  filterBtn: {
    margin: 5,
    textTransform: "none",
    // backgroundColor: "darkviolet",
    // color: "white"
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    width: "340px",
    height: "37px",
    color: "#242424",
    opacity: 1,
    letterSpacing: "0.06px",
    font: "normal normal normal 14px/17px Inter",
  },
  search: {
    display: "flex",
    width: 400,
    border: "1px solid #cccccc",
    height: "38px",
    borderRadius: "7px !important",
    background: "#FFFFFF 0% 0% no-repeat padding-box",
    opacity: 1,
    padding: "2px 4px",
    alignItems: "center",
    marginLeft: "auto",
    marginTop: "20px"
  },
  iconButton: {
    width: "19px",
    height: "19px",
    opacity: 1,
    color: "#CCCCCC",
  },
}));

const StockNameView = (props) => {
  // const [filterOption, setFilterOption] = useState("");
  const [searchData, setSearchData] = useState("");
  const dispatch = useDispatch();
  const [apiData, setApiData] = useState([]);
  const [apiSearchData, setApiSearchData] = useState([]);
  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const [alertOpen, setAlertOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // const filterBtnOption = [
  //   { id: "1", text: "Only Gold" },
  //   { id: "2", text: "Only Silver" },
  //   { id: "3", text: "Only Brass" },
  //   { id: "4", text: "Only Copper" },
  //   { id: "5", text: "Only Platinum" },
  //   { id: "6", text: "Stone" },
  // ];

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchData.length > 2) {
        getStockName(searchData);
      } else {
        setApiData([]);
        setApiSearchData([]);
      }
    }, 800);
    return () => {
      clearTimeout(timeout);
    };
    //eslint-disable-next-line
  }, [searchData]);

  useEffect(() => {
    if (props.search) {
      setSearchData(props.search);
    }
  }, []);

  function getStockName(text) {
    setLoading(true);
    const search = text ? text : searchData;
    axios
      .get(Config.getCommonUrl() + `api/stockname/search/${search}`)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setApiData(response.data.data);
          // setData(response.data);
          let tempData = response.data.data;
          if (tempData.length === 0) {
            dispatch(
              Actions.showMessage({
                message: "No data found",
                variant: "error",
              })
            );
          }
          let data = tempData.map((item) => {
            return {
              id: item.id,
              stock_group: item.stock_group.group_name,
              stock_name: item.stock_name,
              stock_name_code_id:
                item.stock_name_code !== null ? item.stock_name_code.id : null,
              stock_description:
                item.stock_name_code !== null
                  ? item.stock_name_code.stock_description.description
                  : "-",
              stock_code:
                item.stock_name_code !== null
                  ? item.stock_name_code.stock_code
                  : "-",
              purity:
                item.stock_name_code !== null
                  ? item.stock_name_code.purity !== null
                    ? item.stock_name_code.purity
                    : "-"
                  : "-",
              stone_shape:
                item.stock_name_code !== null
                  ? item.stock_name_code.stone_shape !== null
                    ? item.stock_name_code.stone_shape.name
                    : "-"
                  : "-",
              stone_size:
                item.stock_name_code !== null
                  ? item.stock_name_code.stone_size !== null
                    ? item.stock_name_code.stone_size.size
                    : "-"
                  : "-",
              unit:
                item.stock_name_code !== null
                  ? item.stock_name_code.unitName !== null
                    ? item.stock_name_code.unitName.unit_name
                    : "-"
                  : "-",
              weight:
                item.stock_name_code !== null
                  ? item.stock_name_code.weight !== null
                    ? parseFloat(item.stock_name_code.weight).toFixed(4)
                    : "-"
                  : "-",
              color:
                item.stock_type === 1
                  ? item.stock_name_code !== null
                    ? item.stock_name_code.gold_color !== null
                      ? item.stock_name_code.gold_color.name
                      : "-"
                    : "-"
                  : item.stock_name_code !== null
                  ? item.stock_name_code.stone_color !== null
                    ? item.stock_name_code.stone_color.name
                    : "-"
                  : "-",
            };
          });
          setApiSearchData(data);
          setLoading(false);
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, { api: `api/stockname/search/${search}` });
      });
  }

  function editHandler(index) {
    if (index > -1) {
      props.dataTobeEdited(apiData[index], searchData);
    }
  }

  function callDeleteStockNameApi() {
    axios
      .delete(Config.getCommonUrl() + "api/stockname/" + selectedIdForDelete)
      .then(function (response) {
        console.log(response);
        setOpen(false);
        if (response.data.success === true) {
          // selectedIdForDelete

          // const findIndex = apiData.findIndex(
          //   (a) => a.id === selectedIdForDelete
          // );

          // findIndex !== -1 && apiData.splice(findIndex, 1);
          getStockName();
          setSelectedIdForDelete("");
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
        handleError(error, dispatch, {
          api: "api/stockname/" + selectedIdForDelete,
        });
      });
  }

  function handleClose() {
    setSelectedIdForDelete("");
    setOpen(false);
  }

  function handleDialogClose() {
    setSelectedIdForDelete("");
    setAlertOpen(false);
  }

  return (
    <div className={clsx(classes.root, props.className)}>
      <div>
        <div className="pb-10">
          <div
            style={{ borderRadius: "7px !important" }}
            component="form"
            className={classes.search}
          >
            <InputBase
              className={classes.input}
              placeholder="Search"
              inputProps={{ "aria-label": "search" }}
              value={searchData}
              onChange={(event) => setSearchData(event.target.value)}
            />
            <IconButton
              type="submit"
              className={classes.iconButton}
              aria-label="search"
            >
              <Icon>
                <img src={Icones.search_light_grey} alt="" />
              </Icon>
            </IconButton>
          </div>
        </div>
        {loading && <Loader />}
        <Paper className={(classes.tabroot, "stockname-table-mt")}>
          <div className="table-responsive">
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableRowPad}>ID</TableCell>
                  <TableCell className={classes.tableRowPad} align="left">
                    Stock Group
                  </TableCell>
                  <TableCell className={classes.tableRowPad} align="left">
                    Stock Name
                  </TableCell>
                  <TableCell className={classes.tableRowPad} align="left">
                    Stock Name Description
                  </TableCell>
                  <TableCell className={classes.tableRowPad} align="left">
                    Stock Code
                  </TableCell>
                  <TableCell className={classes.tableRowPad} align="left">
                    Purity
                  </TableCell>
                  <TableCell className={classes.tableRowPad} align="left">
                    Color
                  </TableCell>
                  <TableCell className={classes.tableRowPad} align="left">
                    Shape
                  </TableCell>
                  <TableCell className={classes.tableRowPad} align="left">
                    Size(MM)
                  </TableCell>
                  <TableCell className={classes.tableRowPad} align="left">
                    Unit
                  </TableCell>
                  <TableCell className={classes.tableRowPad} align="left">
                    Weight
                  </TableCell>
                  <TableCell className={classes.tableRowPad} align="left">
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {apiSearchData.length > 0 ? (
                  apiSearchData.map((row, index) => (
                    <TableRow key={index}>
                      {/* component="th" scope="row" */}
                      <TableCell className={classes.tableRowPad}>
                        {index + 1}
                      </TableCell>
                      <TableCell align="left" className={classes.tableRowPad}>
                        {row.stock_group}
                      </TableCell>

                      <TableCell align="left" className={classes.tableRowPad}>
                        {row.stock_name}
                      </TableCell>
                      <TableCell align="left" className={classes.tableRowPad}>
                        {row.stock_description}
                      </TableCell>
                      <TableCell align="left" className={classes.tableRowPad}>
                        {row.stock_code}
                      </TableCell>
                      <TableCell align="left" className={classes.tableRowPad}>
                        {row.purity}
                      </TableCell>
                      <TableCell align="left" className={classes.tableRowPad}>
                        {row.color}

                        {/* {row.stock_type === 1
                        ? row.stock_name_code !== null
                          ? row.stock_name_code.gold_color !== null
                            ? row.stock_name_code.gold_color.name
                            : "-"
                          : "-"
                        : ""}

                      {row.stock_type === 2
                        ? row.stock_name_code !== null
                          ? row.stock_name_code.stone_color !== null
                            ? row.stock_name_code.stone_color.name
                            : "-"
                          : "-"
                        : ""} */}
                        {/*stock_type 1 means gold and 2 means metal */}
                      </TableCell>
                      <TableCell align="left" className={classes.tableRowPad}>
                        {row.stone_shape}
                      </TableCell>
                      <TableCell align="left" className={classes.tableRowPad}>
                        {row.stone_size}
                      </TableCell>
                      <TableCell align="left" className={classes.tableRowPad}>
                        {row.unit}
                      </TableCell>
                      <TableCell align="left" className={classes.tableRowPad}>
                        {row.weight}
                      </TableCell>

                      <TableCell className={classes.tableRowPad}>
                        <IconButton
                          style={{ padding: "0" }}
                          onClick={(ev) => {
                            ev.preventDefault();
                            ev.stopPropagation();
                            editHandler(index);
                          }}
                        >
                          <Icon className="mr-8 edit-icone">
                            <img src={Icones.edit} alt="" />
                          </Icon>
                        </IconButton>

                        <IconButton
                          style={{ padding: "0" }}
                          onClick={(ev) => {
                            ev.preventDefault();
                            ev.stopPropagation();
                            // if (row.stock_name_code !== null) {
                            // deleteHandler(row.id);
                            // } else {
                            // setAlertOpen(true);
                            // }
                            if (row.stock_name_code_id !== null) {
                            
                              setSelectedIdForDelete(row.stock_name_code_id);
                              setOpen(true);
                            } else {
                              setAlertOpen(true);
                            }
                          }}
                        >
                          <Icon className="mr-8 delete-icone">
                            <img src={Icones.delete_red} alt="" />
                          </Icon>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="12" style={{ textAlign: "center" }}>
                      <b>Please Search</b>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Paper>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className="popup-delete">
          {"Alert!!!"}
          <IconButton
            style={{ position: "absolute", marginTop: "-5px", right: "15px" }}
            onClick={handleClose}
          >
            <img
              src={Icones.cross}
              className="delete-dialog-box-image-size"
              alt=""
            />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this record?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            className="delete-dialog-box-cancle-button"
          >
            Cancel
          </Button>
          <Button
            onClick={callDeleteStockNameApi}
            className="delete-dialog-box-delete-button"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={alertOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Alert!!!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            First you Need to Add Stock Code Details!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Dismiss
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StockNameView;
