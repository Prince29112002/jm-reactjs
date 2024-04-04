import React, { useState, useEffect } from "react";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import Grid from "@material-ui/core/Grid";
import moment from "moment";
import { Table, TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Select, { createFilter } from "react-select";

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
  normalSelect: {
    // marginTop: 8,
    padding: 8,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 0,
    width: "100%",
    // marginLeft: 15,
  },
}));

const TypeZeroComp = (props) => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const [isEdit, setIsEdit] = useState(false);

  const [isView, setIsView] = useState(false);

  const [apiData, setApiData] = useState("");

  const [screwType, setScrewType] = useState("");
  const [screwTypeErr, setScrewTypeErr] = useState("");
  const screwTypeArr = [
    { id: 1, label: "Bombay Post with Screw" },
    { id: 2, label: "Bombay Post without Screw" },
    { id: 3, label: "South Screw" },
    { id: 4, label: "Push Butterfly Screw" },
  ];

  const [updtRecord, setUpdtRecord] = useState({
    karat: "",
    total_pieces: "",
    customer_remark: "",
    errors: {
      karat: null,
      total_pieces: null,
      customer_remark: null,
    },
  });

  useEffect(() => {
    setIsView(props.isView);
    setIsEdit(props.isEdit);
    let tempApi = {
      ...props.apiData,
      customer_designs: props.apiData?.customer_designs?.map((item) => {
        return {
          ...item,
          errors: {
            quantity: "",
            from_weight: "",
            to_weight: "",
          },
        };
      }),
    };
    setApiData(tempApi);

    if (props.apiData?.id) {
      setUpdtRecord({
        karat: props.apiData.karat,
        total_pieces: props.apiData.total_pieces,
        customer_remark: props.apiData.customer_remark,
        errors: {
          karat: null,
          total_pieces: null,
          customer_remark: null,
        },
      });
      screwTypeArr.map((item)=>{
        if(item.label === apiData.screw_type){
          setScrewType({
            value: item.id,
            label : item.label,
          })
        }
      })
    }

    //eslint-disable-next-line
  }, [props]);



  const classes = useStyles();

  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    let tempRecord = { ...updtRecord };
    tempRecord[name] = value;
    tempRecord.errors[name] = null;

    setUpdtRecord(tempRecord);
  };
  const handleChangeScrew = (value) => {
    setScrewType(value);
    setScrewTypeErr("");
  };

  const handleDesignsInputChange = (event, index) => {
    const name = event.target.name;
    const value = event.target.value;

    let tempRecord = [...apiData.customer_designs];

    tempRecord[index][name] = value;
    tempRecord[index].errors[name] = "";

    setApiData({
      ...apiData,
      customer_designs: tempRecord,
    });
  };
  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };

  function handleKaratChange(e) {
    let value = e.target.value;
    let tempRecord = { ...updtRecord };
    tempRecord.karat = value;
    tempRecord.errors.karat = null;

    setUpdtRecord(tempRecord);
  }


  function validateRecord() {
    let tempRecord = { ...updtRecord };
    // tempRecord[name] = value;
    // tempRecord.errors[name] = null;
    let pass = true;

    if (tempRecord.karat === "") {
      tempRecord.errors.karat = "Please Select karat";
      pass = false;
    }
    let percentRegex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;
   
    if (
      tempRecord.total_pieces === "" || 
      percentRegex.test(tempRecord.total_pieces) === false
    ) {
      tempRecord.errors.total_pieces = "Please Enter Valid Pieces";
      pass = false;
    }

  

    if (tempRecord.customer_remark === "") {
      tempRecord.errors.customer_remark = "Please Enter Remarks";
    }

    setUpdtRecord(tempRecord);

    let tempDesignRecords = apiData.customer_designs.map((item) => {
      if (
        item.from_weight === "" || item.from_weight == 0 ||
        percentRegex.test(item.from_weight) === false
      ) {
        item.errors.from_weight = "Please Insert Proper From weight";
        pass = false;
      }

      if (
        item.to_weight === "" ||  item.to_weight == 0 ||
        percentRegex.test(item.to_weight) === false
      ) {
        item.errors.to_weight = "Please Insert Proper From weight";
        pass = false;
      }

      let pcsRegex = /^[0-9]{1,6}$/;

      if (item.quantity === "" || pcsRegex.test(item.quantity) === false || item.quantity == 0) {
        item.errors.quantity = "Please Enter Valid quantity";
        pass = false;
      }

      return item;
    });


    setApiData({
      ...apiData,
      customer_designs: tempDesignRecords,
    });
    return pass;
  }

  function updateRecord() {
    if (validateRecord()) {
      updateOrderApi();
    }
  }

  function updateOrderApi() {
    let design_details = apiData.customer_designs.map((x) => {
      return {
        design_detail_id: x.id,
        quantity: x.quantity,
        from_weight: x.from_weight,
        to_weight: x.to_weight,
      };
    });

    axios
      .put(Config.getCommonUrl() + "api/order/change-order-design-info", {
        order_id: apiData.id,
        order_type: 0,
        karat: updtRecord.karat,
        customer_remark: updtRecord.customer_remark,
        design_details: design_details,

      })
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          setUpdtRecord({
            karat: "",
            total_pieces: "",
            customer_remark: "",
            errors: {
              karat: null,
              total_pieces: null,
              customer_remark: null,
            },
          });

          props.callApi(apiData.id);
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success"}));
        } else {
          dispatch(Actions.showMessage({ message: response.data.message,variant:"error"}));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/order/change-order-design-info",
          body: {
            order_id: apiData.id,
            order_type: 0,
            karat: updtRecord.karat,
            customer_remark: updtRecord.customer_remark,
            design_details: design_details,
          },
        });
      });
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={4} style={{ padding: 5 }}>
          <TextField
            className=""
            label="Retailer"
            name="retailer"
            value={apiData.retailer?.company_name || ""}
            // onChange={(e) => handleInputChange(e)}
            variant="outlined"
            required
            fullWidth
            disabled
          />
        </Grid>

        <Grid item xs={4} style={{ padding: 5 }}>
          <TextField
            className=""
            label="Distributor"
            name="distributor"
            value={apiData.distributor?.client?.name || ""}
            // onChange={(e) => handleInputChange(e)}
            variant="outlined"
            required
            fullWidth
            disabled
          />
        </Grid>

        <Grid item xs={4} style={{ padding: 5 }}>
          <TextField
            className=""
            label="Date"
            name="due_date"
            value={moment(apiData.due_date).format("DD-MM-YYYY") || ""}
            // onChange={(e) => handleInputChange(e)}
            variant="outlined"
            required
            fullWidth
            disabled
          />
        </Grid>
        <Grid item xs={6} style={{ padding: 5 }}>
          <label
            className={clsx(
              classes.tableRowPad,
              "text-15",
              classes.textOverFlow
            )}
          >
            <span className="font-700"> Screw Type : </span>{" "}
          </label>
          <Select
            styles={selectStyles}
            options={screwTypeArr.map((group) => ({
              value: group.id,
              label: group.label,
            }))}
            filterOption={createFilter({ ignoreAccents: false })}
            value={screwType}
            onChange={handleChangeScrew}
            isDisabled
          />
          <span style={{ color: "red" }}>
            {screwTypeErr.length > 0 ? screwTypeErr : ""}
          </span>
        </Grid>
        <Grid item xs={6} style={{ padding: 5 }}>
        <label
            className={clsx(
              classes.tableRowPad,
              "text-15",
              classes.textOverFlow
            )}
          >
            <span className="font-700">Subject</span>{" "}
          </label>
     
          <TextField
            className=""
            // label="subject"
            name="subject"
            value={apiData.subject}
            // onChange={(e) => handleInputChange(e)}
            variant="outlined"
            required
            fullWidth
            disabled
          />
        </Grid>
       
        <Grid item xs={4} style={{ padding: 5, display: "flex" }}>
          <label className={clsx(classes.tableRowPad, "text-15")}>
            <span className="font-700"> karat </span>
          </label>
          <select
            className={classes.normalSelect}
            required
            value={updtRecord.karat}
            onChange={(e) => handleKaratChange(e)}
            disabled={isView}
          >
            <option hidden value="">
              Select karat
            </option>
            <option value="14">14 </option>
            <option value="18">18 </option>
            <option value="20">20 </option>
            <option value="22">22 </option>
          </select>
          <span style={{ color: "red" }}>
            {updtRecord.errors !== undefined ? updtRecord.errors.karat : ""}
          </span>
        </Grid>

        <Grid item xs={4} style={{ padding: 5 }}>
          <TextField
            className=""
            label="Total Pieces"
            name="total_pieces"
            value={updtRecord.total_pieces || ""}
            error={
              updtRecord.errors !== undefined
                ? updtRecord.errors.total_pieces
                  ? true
                  : false
                : false
            }
            helperText={
              updtRecord.errors !== undefined
                ? updtRecord.errors.total_pieces
                : ""
            }
            // onChange={(e) => handleInputChange(e)}
            variant="outlined"
            required
            fullWidth
            disabled
          />
        </Grid>

        <Grid item xs={4} style={{ padding: 5 }}>
          <TextField
            className=""
            label="Customer Remarks"
            name="customer_remark"
            value={updtRecord.customer_remark || ""}
            error={
              updtRecord.errors !== undefined
                ? updtRecord.errors.customer_remark
                  ? true
                  : false
                : false
            }
            helperText={
              updtRecord.errors !== undefined
                ? updtRecord.errors.customer_remark
                : ""
            }
            onChange={(e) => handleInputChange(e)}
            variant="outlined"
            required
            fullWidth
            disabled={isView}
          />
        </Grid>
      </Grid>

      {apiData.customer_designs?.length > 0 && (
        <div
          className="mt-32 mb-32"
          // style={{ display: 'flex', overflowX: 'auto', maxWidth: 1600 }}
        >
          <Paper className={classes.tabroot} id="department-tbl-fix ">
            <div className="table-responsive new-add_stock_group_tbel">
              <Table className={classes.table}>
                <TableBody>
                  {apiData.customer_designs.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell className={classes.tableRowPad}>
                        <div
                          style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "row",
                          }}
                        >
                          {data.image1URL !== null && (
                            <img
                              className="vkj-navbar-logo ml-16"
                              style={{ height: "100px", width: "100px" }}
                              // style={{ alignSelf: "start", cursor: "pointer" }}
                              src={data.image1URL}
                              alt="logo"
                              //   onClick={handleLogoClick}
                            />
                          )}

                          {data.image2URL !== null && (
                            <img
                              className="vkj-navbar-logo ml-16"
                              style={{ height: "100px", width: "100px" }}
                              // style={{ alignSelf: "start", cursor: "pointer" }}
                              src={data.image2URL}
                              alt="logo"
                              //   onClick={handleLogoClick}
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        <TextField
                          className=""
                          label="From Weight"
                          name="from_weight"
                          value={data.from_weight || ""}
                          error={
                            data.errors !== undefined
                              ? data.errors.from_weight
                                ? true
                                : false
                              : false
                          }
                          helperText={
                            data.errors !== undefined
                              ? data.errors.from_weight
                              : ""
                          }
                          onChange={(e) => handleDesignsInputChange(e, index)}
                          variant="outlined"
                          required
                          fullWidth
                          disabled={isView}
                        />
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        <TextField
                          className=""
                          label="To Weight"
                          name="to_weight"
                          value={data.to_weight || ""}
                          error={
                            data.errors !== undefined
                              ? data.errors.to_weight
                                ? true
                                : false
                              : false
                          }
                          helperText={
                            data.errors !== undefined
                              ? data.errors.to_weight
                              : ""
                          }
                          onChange={(e) => handleDesignsInputChange(e, index)}
                          variant="outlined"
                          required
                          fullWidth
                          disabled={isView}
                        />
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        <TextField
                          className=""
                          label="Quantity"
                          name="quantity"
                          value={data.quantity || ""}
                          error={
                            data.errors !== undefined
                              ? data.errors.quantity
                                ? true
                                : false
                              : false
                          }
                          helperText={
                            data.errors !== undefined
                              ? data.errors.quantity
                              : ""
                          }
                          onChange={(e) => handleDesignsInputChange(e, index)}
                          variant="outlined"
                          required
                          fullWidth
                          disabled={isView}
                        />
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        <TextField
                          className=""
                          label="Reference No"
                          name="reference_no"
                          value={data.reference_no || ""}
                          // onChange={(e) => handleInputChange(e)}
                          variant="outlined"
                          required
                          fullWidth
                          disabled
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Paper>

          {/* <Paper className={clsx(classes.tabroot, "table-responsive")}>
                        <MaUTable className={classes.table}>

                            <TableBody>
                                {apiData.customer_designs.map((data, index) => (
                                    <TableRow key={index}>
                                        <TableCell className={classes.tableRowPad}>
                                            {data.image1URL !== null &&
                                                <img
                                                    className="vkj-navbar-logo ml-16"
                                                    style={{ height: '200px', width: '200px' }}
                                                    // style={{ alignSelf: "start", cursor: "pointer" }}
                                                    src={data.image1URL}
                                                    alt="logo"
                                                //   onClick={handleLogoClick}
                                                />
                                            }

                                            {data.image2URL !== null &&
                                                <img
                                                    className="vkj-navbar-logo ml-16"
                                                    style={{ height: '200px', width: '200px' }}
                                                    // style={{ alignSelf: "start", cursor: "pointer" }}
                                                    src={data.image2URL}
                                                    alt="logo"
                                                //   onClick={handleLogoClick}
                                                />
                                            }
                                        </TableCell>
                                        <TableCell className={classes.tableRowPad}>
                                            <TextField
                                                className=""
                                                label="From Weight"
                                                name="from_weight"
                                                value={data.from_weight || ""}
                                                error={
                                                    data.errors !== undefined
                                                        ? data.errors.from_weight
                                                            ? true
                                                            : false
                                                        : false
                                                }
                                                helperText={
                                                    data.errors !== undefined
                                                        ? data.errors.from_weight
                                                        : ""
                                                }
                                                onChange={(e) => handleDesignsInputChange(e, index)}
                                                variant="outlined"
                                                required
                                                fullWidth
                                                disabled={isView}
                                            />
                                        </TableCell>
                                        <TableCell className={classes.tableRowPad}>
                                            <TextField
                                                className=""
                                                label="To Weight"
                                                name="to_weight"
                                                value={data.to_weight || ""}
                                                error={
                                                    data.errors !== undefined
                                                        ? data.errors.to_weight
                                                            ? true
                                                            : false
                                                        : false
                                                }
                                                helperText={
                                                    data.errors !== undefined
                                                        ? data.errors.to_weight
                                                        : ""
                                                }
                                                onChange={(e) => handleDesignsInputChange(e, index)}
                                                variant="outlined"
                                                required
                                                fullWidth
                                                disabled={isView}

                                            />
                                        </TableCell>
                                        <TableCell className={classes.tableRowPad}>
                                            <TextField
                                                className=""
                                                label="Quantity"
                                                name="quantity"
                                                value={data.quantity || ""}
                                                error={
                                                    data.errors !== undefined
                                                        ? data.errors.quantity
                                                            ? true
                                                            : false
                                                        : false
                                                }
                                                helperText={
                                                    data.errors !== undefined
                                                        ? data.errors.quantity
                                                        : ""
                                                }
                                                onChange={(e) => handleDesignsInputChange(e, index)}
                                                variant="outlined"
                                                required
                                                fullWidth
                                                disabled={isView}

                                            />
                                        </TableCell>
                                        <TableCell className={classes.tableRowPad}>
                                            <TextField
                                                className=""
                                                label="Reference No"
                                                name="reference_no"
                                                value={data.reference_no || ""}
                                                // onChange={(e) => handleInputChange(e)}
                                                variant="outlined"
                                                required
                                                fullWidth
                                                disabled
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}

                            </TableBody>
                        </MaUTable>
                    </Paper> */}

          {/* {apiData.customer_designs.map((data, idx) => (
                        <Grid container spacing={3} key={idx}>

                            <Grid item xs={4} style={{ padding: 5 }}>

                                {data.image1URL !== null &&
                                    <img
                                        className="vkj-navbar-logo ml-16"
                                        style={{ height: '200px', width: '200px' }}
                                        // style={{ alignSelf: "start", cursor: "pointer" }}
                                        src={data.image1URL}
                                        alt="logo"
                                    //   onClick={handleLogoClick}
                                    />
                                }

                                {data.image2URL !== null &&
                                    <img
                                        className="vkj-navbar-logo ml-16"
                                        style={{ height: '200px', width: '200px' }}
                                        // style={{ alignSelf: "start", cursor: "pointer" }}
                                        src={data.image2URL}
                                        alt="logo"
                                    //   onClick={handleLogoClick}
                                    />
                                }

                            </Grid>

                            <Grid item xs={2} style={{ padding: 5 }}>
                                <TextField
                                    className=""
                                    label="From Weight"
                                    name="from_weight"
                                    value={data.from_weight || ""}
                                    error={
                                        data.errors !== undefined
                                            ? data.errors.from_weight
                                                ? true
                                                : false
                                            : false
                                    }
                                    helperText={
                                        data.errors !== undefined
                                            ? data.errors.from_weight
                                            : ""
                                    }
                                    onChange={(e) => handleDesignsInputChange(e, idx)}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    disabled={isView}
                                />
                            </Grid>

                            <Grid item xs={2} style={{ padding: 5 }}>

                                <TextField
                                    className=""
                                    label="To Weight"
                                    name="to_weight"
                                    value={data.to_weight || ""}
                                    error={
                                        data.errors !== undefined
                                            ? data.errors.to_weight
                                                ? true
                                                : false
                                            : false
                                    }
                                    helperText={
                                        data.errors !== undefined
                                            ? data.errors.to_weight
                                            : ""
                                    }
                                    onChange={(e) => handleDesignsInputChange(e, idx)}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    disabled={isView}

                                />
                            </Grid>

                            <Grid item xs={2} style={{ padding: 5 }}>

                                <TextField
                                    className=""
                                    label="Quantity"
                                    name="quantity"
                                    value={data.quantity || ""}
                                    error={
                                        data.errors !== undefined
                                            ? data.errors.quantity
                                                ? true
                                                : false
                                            : false
                                    }
                                    helperText={
                                        data.errors !== undefined
                                            ? data.errors.quantity
                                            : ""
                                    }
                                    onChange={(e) => handleDesignsInputChange(e, idx)}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    disabled={isView}

                                />
                            </Grid>

                            <Grid item xs={2} style={{ padding: 5 }}>

                                <TextField
                                    className=""
                                    label="Reference No"
                                    name="reference_no"
                                    value={data.reference_no || ""}
                                    // onChange={(e) => handleInputChange(e)}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    disabled
                                />
                            </Grid>
                        </Grid>

                    ))} */}
        </div>
      )}

      {!isView && isEdit && (
        <Grid
          item
          xs={12}
          style={{ padding: 5, textAlign: "right" }}
          className="mb-32"
        >
          <Button
                  className={"mt-5 float-right"}
                  id="btn-save"
            variant="contained"
            color="primary"
                  aria-placeholder="Register"
            //   disabled={!isFormValid()}
            // type="submit"
            onClick={(e) => updateRecord()}
          >
            Save
          </Button>
        </Grid>
      )}
    </>
  );
};

export default TypeZeroComp;
