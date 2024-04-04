import React, { useState, useEffect } from "react";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import Grid from "@material-ui/core/Grid";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { TextField, Icon, IconButton } from "@material-ui/core";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},
  tabroot: {
    overflowX: "auto",
    overflowY: "auto",
    // height: "100%",
  },
  tableRowPad: {
    padding: 7,
  },
  textOverFlow: {
    display: "block",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));

const TypeOneComp = (props) => {
  const dispatch = useDispatch();

  // const theme = useTheme();

  const [isEdit, setIsEdit] = useState(false);

  const [isView, setIsView] = useState(false);

  const [orderData, setOrderData] = useState("");

  const [apiData, setApiData] = useState([]);

  const [updtRecord, setUpdtRecord] = useState({
    id: "",
    order_id: "",
    category: "",
    category_id: "",
    quantity: "",
    from_weight: "",
    to_weight: "",
    remark: "",
    errors: {
      category: null,
      quantity: null,
      from_weight: null,
      to_weight: null,
      remark: null,
    },
  });

  useEffect(() => {
    setIsView(props.isViewOnly);
    setIsEdit(props.isEdit);

    setOrderData(props.apiData);
    if (props.apiData?.id) {
      let tempListData = props.apiData.CategoryWeightRatioDetails.map(
        (item) => {
          return {
            ...item,
            isEdit: false,
          };
        }
      );
      setApiData(tempListData);
    }
  }, [props]);

  useEffect(() => {}, []);

  const classes = useStyles();

  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    let tempRecord = { ...updtRecord };
    tempRecord[name] = value;
    tempRecord.errors[name] = null;

    setUpdtRecord(tempRecord);
  };

  function cancelUpdtRecord(id) {
    let index = apiData.findIndex((item) => item.id === id);
    if (index > -1) {
      let tempApi = [...apiData];
      tempApi[index].isEdit = false;

      setApiData(tempApi);

      setUpdtRecord({
        id: "",
        order_id: "",
        category: "",
        category_id: "",
        quantity: "",
        from_weight: "",
        to_weight: "",
        remark: "",
        errors: {
          category: null,
          quantity: null,
          from_weight: null,
          to_weight: null,
          remark: null,
        },
      });
    }
  }

  function editHandler(id) {
    let index = apiData.findIndex((item) => item.id === id);
    if (index > -1) {
      setUpdtRecord({
        id: apiData[index].id,
        order_id: apiData[index].order_id,
        category: apiData[index].Order_Category_name.category_name,
        category_id: apiData[index].category_id,
        quantity: apiData[index].quantity,
        from_weight: apiData[index].from_weight,
        to_weight: apiData[index].to_weight,
        remark: apiData[index].remark,
        errors: {
          category: null,
          quantity: null,
          from_weight: null,
          to_weight: null,
          remark: null,
        },
      });

      let tempApi = [...apiData];
      tempApi[index].isEdit = true;

      setApiData(tempApi);
    }
  }

  function validateRecord() {
    let tempRecord = { ...updtRecord };
    let pass = true;

    let percentRegex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;

    if (
      tempRecord.quantity === "" ||
      percentRegex.test(tempRecord.quantity) === false
    ) {
      tempRecord.errors.quantity = "Please Enter Valid Pieces";
      pass = false;
    }

    if (
      tempRecord.from_weight === "" ||
      tempRecord.from_weight == 0 ||
      percentRegex.test(tempRecord.from_weight) === false
    ) {
      tempRecord.errors.from_weight = "Please Insert Proper From weight";
      pass = false;
    }

    if (
      tempRecord.to_weight === "" ||
      tempRecord.to_weight == 0 ||
      percentRegex.test(tempRecord.to_weight) === false
    ) {
      tempRecord.errors.to_weight = "Please Insert Proper From weight";
      pass = false;
    }

    if (tempRecord.remark === "") {
      tempRecord.errors.remark = "Please Enter Remarks";
    }

   

    setUpdtRecord(tempRecord);
    return pass;
  }

  function updateRecord(id) {
    if (validateRecord()) {
      updateOrderApi(id);
    }
  }

  function updateOrderApi(id) {
    let data = {
      id: updtRecord.id,
      order_id: updtRecord.order_id,
      order_type: 1,
      from_weight: updtRecord.from_weight,
      to_weight: updtRecord.to_weight,
      quantity: updtRecord.quantity,
      remark: updtRecord.remark,
      category_id: updtRecord.category_id,
    };
    axios
      .put(Config.getCommonUrl() + "api/order/change-order-design-info", data)
      .then(function (response) {

        if (response.data.success === true) {
          let index = apiData.findIndex((item) => item.id === id);

          if (index > -1) {
            let tempApi = [...apiData];
            tempApi[index].isEdit = false;

            setUpdtRecord({
              id: "",
              order_id: "",
              category: "",
              category_id: "",
              quantity: "",
              from_weight: "",
              to_weight: "",
              remark: "",
              errors: {
                category: null,
                quantity: null,
                from_weight: null,
                to_weight: null,
                remark: null,
              },
            });
          }

          props.callApi(orderData.id);
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success"}));
        } else {
          dispatch(Actions.showMessage({ message: response.data.message,variant:"error"}));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/order/change-order-design-info",
          body: data,
        });
      });
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={4} style={{ padding: 5 }}>
          <label
            className={clsx(
              classes.tableRowPad,
              "text-15",
              classes.textOverFlow
            )}
          >
            <span className="font-700"> Retailer : </span>{" "}
            {orderData && orderData.retailer?.company_name}
          </label>
        </Grid>

        <Grid item xs={4} style={{ padding: 5 }}>
          <label
            className={clsx(
              classes.tableRowPad,
              "text-15",
              classes.textOverFlow
            )}
          >
            <span className="font-700"> Distributor : </span>{" "}
            {orderData && orderData.distributor?.client?.name}
          </label>
        </Grid>

        <Grid item xs={4} style={{ padding: 5 }}>
          <label
            className={clsx(
              classes.tableRowPad,
              "text-15",
              classes.textOverFlow
            )}
          >
            <span className="font-700"> Rhodium on stone % : </span>{" "}
            {orderData && orderData.rhodium_on_stone_percentage}
          </label>
        </Grid>

        <Grid item xs={4} style={{ padding: 5 }}>
          <label
            className={clsx(
              classes.tableRowPad,
              "text-15",
              classes.textOverFlow
            )}
          >
            <span className="font-700"> Rhodium on Plain part % : </span>{" "}
            {orderData && orderData.rhodium_on_plain_part_percentage}
          </label>
        </Grid>

        <Grid item xs={4} style={{ padding: 5 }}>
          <label
            className={clsx(
              classes.tableRowPad,
              "text-15",
              classes.textOverFlow
            )}
          >
            <span className="font-700"> Rhodium Remarks : </span>{" "}
            {orderData && orderData.rhodium_remarks}
          </label>
        </Grid>

        <Grid item xs={4} style={{ padding: 5 }}>
          <label
            className={clsx(
              classes.tableRowPad,
              "text-15",
              classes.textOverFlow
            )}
          >
            <span className="font-700"> Sandblasting dull % : </span>{" "}
            {orderData && orderData.sandblasting_dull_percentage}
          </label>
        </Grid>

        <Grid item xs={4} style={{ padding: 5 }}>
          <label
            className={clsx(
              classes.tableRowPad,
              "text-15",
              classes.textOverFlow
            )}
          >
            <span className="font-700"> Satin dull % : </span>{" "}
            {orderData && orderData.satin_dull_percentage}
          </label>
        </Grid>

        <Grid item xs={4} style={{ padding: 5 }}>
          <label
            className={clsx(
              classes.tableRowPad,
              "text-15",
              classes.textOverFlow
            )}
          >
            <span className="font-700"> Dull Texture Remark : </span>{" "}
            {orderData && orderData.dull_texture_remark}
          </label>
        </Grid>

        <Grid item xs={4} style={{ padding: 5 }}>
          <label
            className={clsx(
              classes.tableRowPad,
              "text-15",
              classes.textOverFlow
            )}
          >
            <span className="font-700"> Enamel % : </span>{" "}
            {orderData && orderData.enamel_percentage}
          </label>
        </Grid>

        <Grid item xs={4} style={{ padding: 5 }}>
          <label
            className={clsx(
              classes.tableRowPad,
              "text-15",
              classes.textOverFlow
            )}
          >
            <span className="font-700"> Enamel Remark : </span>{" "}
            <span> {orderData && orderData.enamel_remark} </span>
          </label>
        </Grid>

        <Grid item xs={4} style={{ padding: 5 }}>
          <label
            className={clsx(
              classes.tableRowPad,
              "text-15",
              classes.textOverFlow
            )}
          >
            <span className="font-700"> Additional Color Stone % : </span>{" "}
            {orderData && orderData.additional_color_stone}
          </label>
        </Grid>

        <Grid item xs={4} style={{ padding: 5 }}>
          <label
            className={clsx(
              classes.tableRowPad,
              "text-15",
              classes.textOverFlow
            )}
          >
            <span className="font-700"> Additional Color Remark : </span>{" "}
            {orderData && orderData.additional_color_remark}
          </label>
        </Grid>

        <Grid item xs={4} style={{ padding: 5 }}>
          <label
            className={clsx(
              classes.tableRowPad,
              "text-15",
              classes.textOverFlow
            )}
          >
            <span className="font-700"> Final Order Remark : </span>{" "}
            {orderData && orderData.final_order_remark}
          </label>
        </Grid>

        <Grid item xs={4} style={{ padding: 5 }}>
          <label
            className={clsx(
              classes.tableRowPad,
              "text-15",
              classes.textOverFlow
            )}
          >
            <span className="font-700"> Screw Type : </span>{" "}
            {orderData && orderData.screw_type}
          </label>
        </Grid>
      </Grid>

      <Paper
        className={clsx(classes.tabroot, "table-responsive", "mt-16")}
        style={{ marginBottom: "10%" }}
      >
        <MaUTable className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableRowPad}>Category</TableCell>
              <TableCell className={classes.tableRowPad}>From Weight</TableCell>
              <TableCell className={classes.tableRowPad}>To Weight</TableCell>
              <TableCell className={classes.tableRowPad}>Quantity</TableCell>
              <TableCell className={classes.tableRowPad}>Remark</TableCell>
              {isEdit && (
                <TableCell className={classes.tableRowPad}>Actions</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* <div className="mt-32" style={{ display: 'flex', overflowX: 'auto', maxWidth: 1600 }}> */}
            {apiData.map((data, idx) => (
              <TableRow key={idx}>
                {data.isEdit ? (
                  <>
                    <TableCell
                      align="left"
                      className={clsx(
                        classes.tableRowPad,
                        "packing-slip-input"
                      )}
                      style={{ overflowWrap: "anywhere" }}
                    >
                      <TextField
                        className=""
                        name="category"
                        value={updtRecord.category}
                        error={
                          updtRecord.errors !== undefined
                            ? updtRecord.errors.category
                              ? true
                              : false
                            : false
                        }
                        helperText={
                          updtRecord.errors !== undefined
                            ? updtRecord.errors.category
                            : ""
                        }
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled
                      />
                    </TableCell>
                    <TableCell align="left" className={classes.tableRowPad}>
                      <TextField
                        className=""
                        name="from_weight"
                        value={updtRecord.from_weight || ""}
                        error={
                          updtRecord.errors !== undefined
                            ? updtRecord.errors.from_weight
                              ? true
                              : false
                            : false
                        }
                        helperText={
                          updtRecord.errors !== undefined
                            ? updtRecord.errors.from_weight
                            : ""
                        }
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={isView}
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      className={classes.tableRowPad}
                      style={{ overflowWrap: "anywhere" }}
                    >
                      <TextField
                        className=""
                        name="to_weight"
                        value={updtRecord.to_weight || ""}
                        error={
                          updtRecord.errors !== undefined
                            ? updtRecord.errors.to_weight
                              ? true
                              : false
                            : false
                        }
                        helperText={
                          updtRecord.errors !== undefined
                            ? updtRecord.errors.to_weight
                            : ""
                        }
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={isView}
                      />
                    </TableCell>
                    <TableCell align="left" className={classes.tableRowPad}>
                      <TextField
                        className=""
                        name="quantity"
                        value={updtRecord.quantity || ""}
                        error={
                          updtRecord.errors !== undefined
                            ? updtRecord.errors.quantity
                              ? true
                              : false
                            : false
                        }
                        helperText={
                          updtRecord.errors !== undefined
                            ? updtRecord.errors.quantity
                            : ""
                        }
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={isView}
                      />
                    </TableCell>
                    <TableCell align="left" className={classes.tableRowPad}>
                      <TextField
                        className=""
                        name="remark"
                        value={updtRecord.remark || ""}
                        error={
                          updtRecord.errors !== undefined
                            ? updtRecord.errors.remark
                              ? true
                              : false
                            : false
                        }
                        helperText={
                          updtRecord.errors !== undefined
                            ? updtRecord.errors.remark
                            : ""
                        }
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={isView}
                      />
                    </TableCell>

                    <TableCell className={classes.tableRowPad}>
                      <Button
                        variant="contained"
                        color="primary"
                        // className="w-224"
                        aria-label="Register"
                        //   disabled={!isFormValid()}
                        // type="submit"
                        onClick={(e) => cancelUpdtRecord(data.id)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        className="ml-2"
                        aria-label="Register"
                        //   disabled={!isFormValid()}
                        // type="submit"
                        onClick={(e) => updateRecord(data.id)}
                      >
                        Save
                      </Button>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell className={classes.tableRowPad}>
                      {data.Order_Category_name?.category_name}
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      {data.from_weight}
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      {data.to_weight}
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      {data.quantity}
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      {data.remark}
                    </TableCell>

                    {isEdit && (
                      <TableCell className={classes.tableRowPad}>
                        <>
                          <IconButton
                            style={{ padding: "0" }}
                            onClick={(ev) => {
                              ev.preventDefault();
                              ev.stopPropagation();
                              editHandler(data.id);
                            }}
                          >
                            <Icon className="mr-8 edit-icone">
                              <img src={Icones.edit} alt="" />
                            </Icon>
                          </IconButton>
                        </>
                      </TableCell>
                    )}
                  </>
                )}
                {/* <TableCell className={classes.tableRowPad}>
                                        {data.Order_Category_name?.category_name}

                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                        {data.from_weight}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                        {data.to_weight}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                        {data.quantity}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                        {data.remark}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>

                                    </TableCell> */}
              </TableRow>
            ))}
            {/* </div> */}
          </TableBody>
        </MaUTable>
      </Paper>
    </>
  );
};

export default TypeOneComp;
