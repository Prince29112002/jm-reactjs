import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { Icon, IconButton } from "@material-ui/core";
import clsx from "clsx";
import { FuseAnimate } from "@fuse";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { TextField } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import Loader from "app/main/Loader/Loader";
import Select, { createFilter } from "react-select";
import Modal from "@material-ui/core/Modal";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import sampleFile from "app/main/SampleFiles/MyCatalogue/Catalogue_design.csv";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "#FFFFFF",
    borderRadius: 7,
    letterSpacing: "0.06px",
  },
  paper: {
    position: "absolute",
    // width: 400,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    outline: "none",
  },
  tabroot: {
    // width: "fit-content",
    // marginTop: theme.spacing(3),
    overflowX: "auto",
    overflowY: "auto",
    // height: "100%",
    height: "100%",
  },
  table: {
    minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
  },
  selectBox: {
    // marginTop: 8,
    // padding: 8,
    fontSize: "12pt",
    // borderColor: "darkgray",
    // borderWidth: 1,
    borderRadius: 5,
    width: "100%",
    // marginLeft: 15,
  },
  modalheight: {
    height: "500px",
  },
  tablecellwidth: {
    width: "60px",
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

const AddMycatalogDesingCom = (props) => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [modalStyle] = React.useState(getModalStyle);

  const [MasterChecked, setMasterChecked] = useState(false);

  const [productCategory, setProductCategory] = useState([]);
  const [selectedProdCat, setSelectedProdCat] = useState("");

  const [prodCatErr, setProdCatErr] = useState("");

  const [designData, setDesignData] = useState([]);

  const [searchData, setSearchData] = useState({
    category: "",
    desNo: "",
  });
  const theme = useTheme();

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };

  const hiddenFileInput = React.useRef(null);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handlefilechange = (event) => {
    handleFile(event);
  };

  function handleFile(e) {
    e.preventDefault();
    var files = e.target.files,
      f = files[0];
    uploadfileapicall(f); // data not set properly from api
  }

  function uploadfileapicall(f) {
    const formData = new FormData();
    formData.append("file", f);
    setLoading(true);
    axios
      .post(Config.getCommonUrl() + "api/catalogue/Upload", formData)
      .then(function (response) {
        console.log(response);
        setLoading(false);
        if (response.data.success === true) {
          console.log(response, "");
          let tempData = response.data.data;
          let tempApiData = tempData.map((x) => {
            return {
              ...x,
              cetegoryName: x.Category.billing_category_name,
              DesingNo: x.variant_number,
              selected: false,
            };
          });
          let arrdata = [...designData, ...tempApiData];
          setDesignData(arrdata);
        } else {
          if (response.data.hasOwnProperty("csverror")) {
            if (response.data.csverror === 1) {
              if (response.data.hasOwnProperty("url")) {
                let downloadUrl = response.data.url;
                window.open(downloadUrl);
              }
              document.getElementById("fileinput").value = "";
            }
          }
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
      })
      .catch((error) => {
        setLoading(false);
        document.getElementById("fileinput").value = "";
        handleError(error, dispatch, {
          api: "api/catalogue/Upload",
          body: JSON.stringify(formData),
        });
      });
  }

  useEffect(() => {
    NavbarSetting("Mobile-app Admin", dispatch);
    //eslint-disable-next-line
  }, []);

  const handleSearchData = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    // const searchItem = searchData;
    setSearchData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  let handleCategoryChange = (e) => {
    setSelectedProdCat({
      value: e.value,
      label: e.label,
    });
    setProdCatErr("");
    getDesignDataFromCategory(e.value);
  };

  function getDesignDataFromCategory(id) {
    axios
      .get(Config.getCommonUrl() + "api/design/searchbycategory/variant/" + id)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          let tempData = response.data.data;
          let tempApiData = tempData.map((x) => {
            return {
              ...x,
              cetegoryName: x.Category.category_name,
              DesingNo: x.variant_number,
              selected: false,
            };
          });
          const arrdata = [...designData, ...tempApiData];
          setDesignData(arrdata);
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {
          api: "api/design/searchbycategory/variant/" + id,
        });
      });
  }

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  useEffect(() => {
    getProductCategories();
    //eslint-disable-next-line
  }, [dispatch]);

  function getProductCategories() {
    axios
      .get(Config.getCommonUrl() + "api/productcategory/all/list")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setProductCategory(response.data.data);
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, { api: "api/productcategory/all/list" });
      });
  }

  function onMasterCheck(e) {
    let tempList = designData;
    // Check/ UnCheck All Items
    tempList.map((user) => (user.selected = e.target.checked));

    //Update State
    setMasterChecked(e.target.checked);
    setDesignData(tempList);
  }

  // Update List Item's state and Master Checkbox State
  function onItemCheck(e, item) {
    let tempList = designData; //this.state.List;
    let temp = tempList.map((row) => {
      if (row.id === item.id) {
        row.selected = e.target.checked;
      }
      return row;
    });

    const totalItems = designData.length;
    const totalCheckedItems = temp.filter((e) => e.selected).length;
    setDesignData(temp);
    setMasterChecked(totalItems === totalCheckedItems);
  }

  function handleFormSubmit(ev) {
    ev.preventDefault();

    if (
      designData.filter((item) => {
        return item.selected;
      }).length === 0
    ) {
      dispatch(
        Actions.showMessage({
          message: "Please Select Any Design",
          variant: "error",
        })
      );
    } else {
      props.handleSubmit(
        designData.filter((item) => {
          return item.selected;
        })
      );
    }
  }

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0">
            <Modal
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              open={true}
              onClose={(_, reason) => {
                if (reason !== "backdropClick") {
                  props.handleClose();
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
                {loading && <Loader />}

                <h5
                  className="popup-head"
                  style={{
                    padding: "14px",
                  }}
                >
                  Add Product
                  <IconButton
                    style={{ position: "absolute", top: "-2px", right: "8px" }}
                    onClick={props.handleClose}
                  >
                    <Icon>
                      <img src={Icones.cross} alt="" />
                    </Icon>
                  </IconButton>
                </h5>

                <Grid
                  className="department-main-dv"
                  container
                  spacing={4}
                  alignItems="stretch"
                  style={{ margin: 6 }}
                >
                  <Grid item xs={6} sm={6} md={6} style={{ padding: 5 }}>
                    <lebel className="pl-2">Category name</lebel>
                    <Select
                      className={clsx(
                        classes.selectBox,
                        "ml-2",
                        "purchase-select-dv selectsales-dv"
                      )}
                      filterOption={createFilter({
                        ignoreAccents: false,
                      })}
                      styles={selectStyles}
                      options={productCategory.map((suggestion) => ({
                        value: suggestion.id,
                        label: suggestion.category_name,
                      }))}
                      value={selectedProdCat}
                      onChange={(e) => {
                        handleCategoryChange(e);
                      }}
                      placeholder="Category name"
                      variant="standard"
                    />
                    <span style={{ color: "red" }}>
                      {prodCatErr.length > 0 ? prodCatErr : ""}
                    </span>
                  </Grid>

                  <Grid item xs={6} sm={6} md={6} style={{ padding: 5 }}>
                    {props.showFileUpload === true && (
                      <div style={{ paddingTop: "20px" }}>
                        <Button
                          id="btn-save"
                          variant="contained"
                          color="primary"
                          className="ml-16 mx-auto mr-16"
                          style={{
                            backgroundColor: "#4caf50",
                            border: "none",
                            color: "white",
                          }}
                          onClick={handleClick}
                        >
                          Upload File
                        </Button>

                        <a href={sampleFile} download="Catalogue_design.csv">
                          Download Sample
                        </a>
                      </div>
                    )}

                    <input
                      type="file"
                      id="fileinput"
                      // accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      accept=".csv"
                      ref={hiddenFileInput}
                      onChange={handlefilechange}
                      style={{ display: "none" }}
                    />
                  </Grid>
                </Grid>
                <div
                  className=" pl-16 pr-8 lotview-modelpopup-dv"
                  style={{ height: "275px", overflowY: "scroll" }}
                >
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          className={clsx(
                            classes.tableRowPad,
                            classes.tablecellwidth
                          )}
                        >
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={MasterChecked}
                            id="mastercheck"
                            onChange={(e) => onMasterCheck(e)}
                          />
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Categories
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Design No
                        </TableCell>

                        <TableCell className={classes.tableRowPad} align="left">
                          Image
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className={classes.tableRowPad}></TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {/* Categories */}
                          <TextField
                            name="category"
                            onChange={handleSearchData}
                            inputProps={{ className: "all-Search-box-data" }}
                          />
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          {/* Design No. */}
                          <TextField
                            name="desNo"
                            onChange={handleSearchData}
                            inputProps={{ className: "all-Search-box-data" }}
                          />
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="left"
                        ></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {designData
                        .filter((temp) => {
                          if (searchData.category) {
                            return temp.cetegoryName
                              .toLowerCase()
                              .includes(searchData.category.toLowerCase());
                          } else if (searchData.desNo) {
                            return temp.DesingNo.toString()
                              .toLowerCase()
                              .includes(
                                searchData.desNo.toString().toLowerCase()
                              );
                          } else {
                            return temp;
                          }
                        })
                        .map((row) => (
                          <TableRow key={"row" + row.cetegoryName + row.id}>
                            {/* component="th" scope="row" */}
                            <TableCell className={classes.tableRowPad}>
                              <input
                                type="checkbox"
                                checked={row.selected}
                                className="form-check-input"
                                id={"row" + row.id}
                                onChange={(e) => onItemCheck(e, row)}
                              />
                            </TableCell>
                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {row.Category.billing_category_name}
                            </TableCell>

                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {row.variant_number}
                            </TableCell>

                            <TableCell className={classes.tableRowPad}>
                              <img
                                src={row.image_files[0]?.image_file}
                                height={50}
                                width={50}
                                alt=""
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
                <div style={{ paddingBottom: "30px", textAlign: "center" }}>
                  <Button
                    variant="contained"
                    className="w-128 mx-auto mt-20 popup-cancel"
                    aria-label="Register"
                    //   disabled={!isFormValid()}
                    // type="submit"
                    onClick={() => {
                      // History.goBack()
                      props.handleClose();
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="contained"
                    className="w-128 mx-auto mt-20 popup-save"
                    style={{ marginLeft: "20px" }}
                    // className="mx-auto mr-16"
                    aria-label="Register"
                    // disabled={isView}
                    // type="submit"
                    onClick={(e) => {
                      handleFormSubmit(e);
                    }}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default AddMycatalogDesingCom;
