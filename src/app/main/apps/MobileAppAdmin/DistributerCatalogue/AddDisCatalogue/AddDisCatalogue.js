import React, { useState, useEffect } from "react";
import { TablePagination, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Button, TextField } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Icon, IconButton } from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import History from "@history";
import Loader from "app/main/Loader/Loader";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import moment from "moment";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Select, { createFilter } from "react-select";
import UploadCatalogue from "./UploadCatalogue";
import { Link } from "react-router-dom";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100px",
  },
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "#FFFFFF",
    borderRadius: 7,
    letterSpacing: "0.06px",
  },
  tabroot: {
    // width: "fit-content",
    // marginTop: theme.spacing(3),
    overflowX: "auto",
    overflowY: "auto",
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
    padding: 8,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
    width: "100%",
    // marginLeft: 15,
  },
}));

const AddDisCatalog = (props) => {
  const propsData = props.location.state;
  const theme = useTheme();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [catalogueName, setCatalogueName] = useState("");
  const [catNamErr, setCatNameErr] = useState("");

  const [expDate, setExpDate] = useState("");
  const [expDtErr, setExpDtErr] = useState("");

  const [distributerArr, setDistributerArr] = useState([]);
  const [distributer, setDistributer] = useState("");
  const [distributerErr, setDistributerErr] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [designData, setDesignData] = useState([]);
  const [variantNoArr, setVariantNoArr] = useState([]);

  const [isView, setIsView] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [catId, setCatId] = useState("");

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0)
  const [pages, setPages] = useState("");

  const [searchs, setsearchs] = useState("");
  const [apiDatas, setapiDatas] = useState("");
  const [counts, setcounts] = useState("");
  const [Froms, setFroms] = useState("");

  const [searchData, setSearchData] = useState({
    variant_number: "",
    packet_number: "",
    barcode: "",
    purity: "",
    gross_weight: "",
    net_weight: "",
    karat: "",
  });

  useEffect(() =>{
    if (isEdit || isView) {
     
      setDesignData([])
          setCount(0)
          setPage(0)
          setFilters();
       }
   },[searchData])

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
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  useEffect(() => {
    NavbarSetting("Mobile-app Admin", dispatch);
  }, []);

  useEffect(() => {
    getDistributerList();
  }, []);



  useEffect(() => {
    console.log("propsData", propsData);
    if (propsData !== undefined) {
      setIsView(propsData.isViewOnly);
      setIsEdit(propsData.isEdit);
      setsearchs(propsData.search)
      setPages(propsData.page)
      setapiDatas(propsData.apiData)
      setFroms(propsData.from)
      setcounts(propsData.count)
      if (propsData.row !== "") {
        setCatId(propsData.row);
        setFilters();
        console.log(propsData.row);
      }
    }
    //eslint-disable-next-line
  }, []);

  function getDistributerList() {
    axios
      .get(Config.getCommonUrl() + `api/client/all/client`)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          console.log(response.data.data);
          setDistributerArr(response.data.data);
        } else {
          setDistributerArr([]);
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/client/all/client`,
        });
      });
  }

  function GetOneCatalogue(url) {
    axios
      .get(Config.getCommonUrl() + url)
      .then(function (response) {
        console.log(response.data.data);
        if (response.data.success === true) {
          var data = response.data.data;
          setCatalogueName(data.name);
          setCount(Number(response.data.count))
          setExpDate(data.expiry_date);
          setDistributer({
            value: data.Distributor.client.client_id,
            label: data.Distributor.client.name,
          });
          let tempDesign = data.DistributorCatalogueDesigns;
          const barcodeDta = data.DistributorCatalogueDesigns.map(
            (item) => item.barcode
          );
          setDesignData(tempDesign);
          setVariantNoArr(barcodeDta);
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
          api: url
        });
      });
  }

  function setFilters(tempPageNo) {
    const id =propsData.row
    console.log(propsData.row);
            let url = `api/distributorCatalogue/${id}?`
          
            if (page !== "") {
                if (!tempPageNo) {
                    url = url + "page=" + 1
                } else {
                    url = url + "page=" + tempPageNo
                }
            } 
            if(searchData.variant_number !== "") {
                url = url + "&variant_number=" + searchData.variant_number
            }
            if(searchData.packet_number !== "") {
                url = url + "&packet_number=" + searchData.packet_number
            }
            if(searchData.barcode !== "") {
                url = url + "&barcode=" + searchData.barcode
            }
            if(searchData.purity !== "") {
                url = url + "&purity=" + searchData.purity
            }
            if(searchData.gross_weight !== "") {
              url = url + "&gross_weight=" + searchData.gross_weight
          }
          if(searchData.net_weight !== "") {
            url = url + "&net_weight=" + searchData.net_weight
        }
        if(searchData.karat !== "") {
          url = url + "&karat=" + searchData.karat
      }
          console.log(url,"---------",tempPageNo)
          
           if (!tempPageNo) {
             console.log("innnnnnnnnnnnnnn444444")
             GetOneCatalogue(url);
            } else {
                 if (count > designData.length) {
                   GetOneCatalogue(url);
                } 
            }
          }
    
         function handleChangePage(event, newPage) {
            // console.log(newPage , page)
            // console.log((newPage +1) * 10 > apiData.length)
            let tempPage = page;
            setPage(newPage);
            if (newPage > tempPage && (newPage +1) * 10 > designData.length) {
                setFilters(Number(newPage + 1))
                // getRetailerMasterData()
            }
            // console.log(apiData.length);
        }
    
      function handleInputChange(event) {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
    
        if (name === "catalogueName") {
          setCatalogueName(value);
          setCatNameErr("");
        } else if (name === "expDate") {
          setExpDate(value);
          setExpDtErr("");
        }
      }


  function nameValidation() {
    var Regex = /^[A-Za-z0-9 ]*[A-Za-z]+[A-Za-z0-9 ]*$/;
    if (!catalogueName || Regex.test(catalogueName) === false) {
      setCatNameErr("Enter Valid Name");
      return false;
    }
    return true;
  }

  function dateValidation() {
    if (expDate === "") {
      setExpDtErr("Enter Date");
      return false;
    }
    return true;
  }

  function distributerValidate() {
    if (distributer === "") {
      setDistributerErr("Select Distributer");
      return false;
    }
    return true;
  }

  function addedDesign() {
    if (designData.length === 0) {
      dispatch(
        Actions.showMessage({
          message: "Upload new products",
          variant: "error",
        })
      );
      return false;
    }
    return true;
  }

  const handleSearchData = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setSearchData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangeDistributer = (value) => {
    setDistributer(value);
    setDistributerErr("");
  };

  function validateDuplicate(data) {
    let result = true;
    data.map((item) => {
      if (variantNoArr.includes(item.barcode)) {
        result = false;
      }
    });
    return result;
  }

  const handleModalClose = (callApi, data) => {
    setOpenModal(false);
    if (callApi) {
      if (validateDuplicate(data)) {
        setDesignData([...designData, ...data]);
        const newData = data.map((item) => item.barcode);
        setVariantNoArr([...variantNoArr, ...newData]);
        dispatch(
          Actions.showMessage({
            message: "New Design uploded successfully",
            variant: "success",
          })
        );
      } else {
        dispatch(
          Actions.showMessage({
            message: "Some Designs are already exist",
            variant: "error",
          })
        );
      }
    }
  };

  function handleSubmit(ev) {
    ev.preventDefault();
    if (
      distributerValidate() &&
      nameValidation() &&
      dateValidation() &&
      addedDesign()
    ) {
      const body = {
        client_id: distributer.value,
        name: catalogueName,
        expiry_date: expDate,
        distributor_catalogue_designs: designData,
      };
      if (isEdit) {
        var api = `api/distributorCatalogue/${catId}`;
        callUpdateDisCatalogue(api, body);
      } else {
        var api = `api/distributorCatalogue`;
        callAddNewDisCatalogue(api, body);
      }
    }
  }

  function callAddNewDisCatalogue(api, body) {
    setLoading(true);
    axios
      .post(Config.getCommonUrl() + api, body)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          History.push(`/dashboard/mobappadmin/distributercatalogue`);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, { api: api, body: body });
      });
  }

  function callUpdateDisCatalogue(api, body) {
    setLoading(true);
    axios
      .put(Config.getCommonUrl() + api, body)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          History.push(`/dashboard/mobappadmin/distributercatalogue`);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, { api: api, body: body });
      });
  }

  function deleteHandler() {
    const arrData = [...designData];
    const idArrData = [...variantNoArr];

    const finalData = arrData.filter((item) => item.barcode != deleteId);
    const finalArr = idArrData.filter((item) => item != deleteId);

    setDesignData(finalData);
    setVariantNoArr(finalArr);
    setDeleteId("");
    setDeleteModal(false);
  }

  function handleOpenUrl() {
    window.open(Config.getCatalogUrl() + `distributor/${catId}`);
  }

  const handleOpenPdf = () => {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + "api/distributorcatalogue/get-pdf/" + catId)
      .then(function (response) {
        console.log(response.data);
        if (response.data.success === true) {
          let data = response.data.data;
          if (data.hasOwnProperty("pdf_url")) {
            let downloadUrl = data.pdf_url;
            // window.open(downloadUrl);
            const link = document.createElement("a");
            link.setAttribute("target", "_blank");
            link.href = downloadUrl;
            link.click();
          }
          setLoading(false);
        } else {
          setLoading(false);
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, {
          api: "api/distributorcatalogue/get-pdf/" + catId,
        });
      });
  };

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20">
          <div className="flex flex-1 flex-col min-w-0">
            <Grid
              className="department-main-dv"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={12} sm={6} md={6} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    {isEdit ? "Edit" : isView ? "View" : "Add"} Distributer
                    Catalogue
                  </Typography>
                </FuseAnimate>

                {/* <BreadcrumbsHelper /> */}
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                key="2"
                style={{ textAlign: "right" }}
              >
                {/* <Button
                  variant="contained"
                  className={classes.button}
                  size="small"
                  onClick={(event) => History.goBack()}
                >
                  Back
                </Button> */}
                <div className="btn-back">
                  {" "}
                  <img src={Icones.arrow_left_pagination} alt="" />
                  <Button
                    id="btn-back"
                    size="small"
                    // onClick={(event) => History.goBack()}
                    onClick={(event) => {(isView || isEdit) && !Froms?
                      History.push('/dashboard/mobappadmin/distributercatalogue', { page : pages , search : searchs , apiData : apiDatas, count : counts}): 
                      propsData?.from  ? History.push(propsData.from ,{mainTab : propsData?.mainTab , subTab : propsData?.subTab,page : propsData.page , search : propsData.search , apiData : propsData.apiData, count : propsData.count}) 
                      : History.push('/dashboard/mobappadmin/distributercatalogue')}}
                    >
                    Back
                  </Button>
                </div>
              </Grid>
            </Grid>
            {loading && <Loader />}
            {openModal && (
              <UploadCatalogue handleModalClose={handleModalClose} id={catId} />
            )}
            <div className="main-div-alll ">
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4} md={3} key="2">
                  <label>Select distributer</label>
                  <Select
                    className="mt-1"
                    styles={{ selectStyles }}
                    options={distributerArr.map((group) => ({
                      value: group.id,
                      label: group.name,
                    }))}
                    filterOption={createFilter({ ignoreAccents: false })}
                    value={distributer}
                    onChange={handleChangeDistributer}
                    isDisabled={isView}
                  />
                  <span style={{ color: "red" }}>
                    {distributerErr.length > 0 ? distributerErr : ""}
                  </span>
                </Grid>
                <Grid item xs={12} sm={4} md={3} key="2">
                  <label>Catalogue name</label>
                  <TextField
                    className="mt-1"
                    placeholder="Catalogue name"
                    name="catalogueName"
                    value={catalogueName}
                    error={catNamErr.length > 0 ? true : false}
                    helperText={catNamErr}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    required
                    fullWidth
                    disabled={isView}
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={3} key="2">
                  <label>Expiry date</label>
                  <TextField
                    placeholder="Expiry date"
                    name="expDate"
                    disabled={isView}
                    value={expDate}
                    type="date"
                    variant="outlined"
                    fullWidth
                    onKeyDown={(e) => e.preventDefault()}
                    error={expDtErr.length > 0 ? true : false}
                    helperText={expDtErr}
                    onChange={(e) => handleInputChange(e)}
                    format="yyyy/MM/dd"
                    inputProps={{
                      min: moment().format("YYYY-MM-DD"),
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                {isEdit || isView ? (
                  <>
                    <Grid
                      item
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      style={{ padding: 6 }}
                    >
                      <div>
                        <span>Download PDF:</span>
                        <Link
                          onClick={handleOpenPdf}
                          style={{ fontSize: 15 }}
                        >
                          {" "}
                          PDF Download{" "}
                        </Link>
                      </div>
                      <div>
                        <span> Catalouge URL:</span>
                        <Link
                          onClick={handleOpenUrl}
                          style={{ fontSize: 15 }}
                        >
                          {" "}
                          {Config.getCatalogUrl() + `distributor/${catId}`}
                        </Link>
                      </div>
                    </Grid>
                  </>
                ) : (
                  ""
                )}
              </Grid>

              <Grid container spacing={3}>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  key="1"
                  style={{ padding: 0 }}
                >
                  <Typography className="p-16 pb-8 text-18 font-700">
                    Add Design
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  key="2"
                  style={{ textAlign: "right" }}
                >
                  {!isView && (
                    <Button
                      variant="contained"
                      className={classes.button}
                      size="small"
                      onClick={(e) => {
                        setOpenModal(true);
                      }}
                    >
                      Add Products
                    </Button>
                  )}
                </Grid>
              </Grid>

              <div className="mt-16 department-tbl-mt-dv">
                <Paper className={classes.tabroot} id="department-tbl-fix ">
                  <div className="table-responsive new-add_stock_group_tbel">
                  <TablePagination
                         // rowsPerPageOptions={[5, 10, 25]}
                         labelRowsPerPage=''
                         component="div"
                         // count={apiData.length}
                         count={count}
                         rowsPerPage={10}
                         page={page}
                         backIconButtonProps={{
                         'aria-label': 'Previous Page',
                        }}
                         nextIconButtonProps={{
                         'aria-label': 'Next Page',
                         }}
                         onPageChange={handleChangePage}
                         // onChangeRowsPerPage={handleChangeRowsPerPage}
                   />

                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell className={classes.tableRowPad}>
                            Variant Number
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Packet No
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Barcode
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Purity
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Karat
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Gross weight
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Net weight
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Image
                          </TableCell>
                          {!isView && (
                            <TableCell
                              className={classes.tableRowPad}
                              align="left"
                            >
                              Actions
                            </TableCell>
                          )}
                        </TableRow>
                        <TableRow>
                          <TableCell className={classes.tableRowPad}>
                            <TextField
                              name="variant_number"
                              onChange={handleSearchData}
                              inputProps={{ className: "all-Search-box-data" }}
                            />
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            <TextField
                              name="packet_number"
                              onChange={handleSearchData}
                              inputProps={{ className: "all-Search-box-data" }}
                            />
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            <TextField
                              name="barcode"
                              onChange={handleSearchData}
                              inputProps={{ className: "all-Search-box-data" }}
                            />
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            <TextField
                              name="purity"
                              onChange={handleSearchData}
                              value={searchData.purity}
                              inputProps={{ className: "all-Search-box-data" }}
                            />
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            <TextField
                              name="karat"
                              onChange={handleSearchData}
                              inputProps={{ className: "all-Search-box-data" }}
                            />
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            <TextField
                              name="gross_weight"
                              onChange={handleSearchData}
                              inputProps={{ className: "all-Search-box-data" }}
                            />
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            <TextField
                              name="net_weight"
                              onChange={handleSearchData}
                              inputProps={{ className: "all-Search-box-data" }}
                            />
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                          ></TableCell>
                          {!isView && (
                            <TableCell
                              className={classes.tableRowPad}
                            ></TableCell>
                          )}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {console.log(designData)}
                        {designData
                          .filter((temp) => {
                            if (searchData.variant_number) {
                              return temp.variant_number
                                .toLowerCase()
                                .includes(
                                  searchData.variant_number.toLowerCase()
                                );
                            } else if (searchData.packet_number) {
                              return temp.packet_number
                                .toLowerCase()
                                .includes(
                                  searchData.packet_number.toLowerCase()
                                );
                            } else if (searchData.barcode) {
                              return temp.barcode
                                .toLowerCase()
                                .includes(searchData.barcode.toLowerCase());
                            } else if (searchData.purity) {
                              return temp.purity
                                .toString()
                                .toLowerCase()
                                .includes(searchData.purity.toLowerCase());
                            } else if (searchData.gross_weight) {
                              return temp.gross_weight
                                .toLowerCase()
                                .includes(
                                  searchData.gross_weight.toLowerCase()
                                );
                            } else if (searchData.net_weight) {
                              return temp.net_weight
                                .toLowerCase()
                                .includes(
                                  searchData.net_weight.toLowerCase()
                                );
                            } else if (searchData.karat) {
                              return temp.karat
                                .toString()
                                .toLowerCase()
                                .includes(searchData.karat.toLowerCase());
                            } else {
                              return temp;
                            }
                          })
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row, index) => (
                            <TableRow key={index}>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.variant_number}
                              </TableCell>

                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.packet_number}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.barcode}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.purity}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.karat}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.gross_weight}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.net_weight}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                <img 
                                // ImageURL
                                  src={
                                    row.designs
                                      ? row.designs?.image_files[0]?.image_flag === 1
                                        ? row.designs.image_files[0]?.ImageURL
                                        : Config.getjvmLogo()
                                      : row.ImageURL
                                        ? row.ImageURL
                                        : Config.getjvmLogo()
                                  }
                                  height={50}
                                  width={50}
                                  alt=""
                                />
                              </TableCell>
                              {!isView && (
                                <TableCell
                                  className={classes.tableRowPad}
                                  align="left"
                                >
                                  <IconButton
                                    style={{ padding: "0" }}
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                      ev.stopPropagation();
                                      setDeleteModal(true);
                                      setDeleteId(row.barcode);
                                    }}
                                  >
                                   <Icon className="mr-8 delete-icone">
                                        <img src={Icones.delete_red} alt="" />
                                      </Icon>
                                  </IconButton>
                                </TableCell>
                              )}
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>

                    <TablePagination
                             // rowsPerPageOptions={[5, 10, 25]}
                             labelRowsPerPage=''
                             component="div"
                             // count={apiData.length}
                             count={count}
                             rowsPerPage={10}
                             page={page}
                             backIconButtonProps={{
                             'aria-label': 'Previous Page',
                             }}
                             nextIconButtonProps={{
                             'aria-label': 'Next Page',
                             }}
                             onPageChange={handleChangePage}
                             // onChangeRowsPerPage={handleChangeRowsPerPage}
                      />

                  </div>

                  <Dialog
                    open={deleteModal}
                    onClose={() => {
                      setDeleteModal(false);
                      setDeleteId("");
                    }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      {"Alert!!!"}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this record?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        onClick={() => {
                          setDeleteModal(false);
                          setDeleteId("");
                        }}
                        color="primary"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={deleteHandler}
                        color="primary"
                        autoFocus
                      >
                        Delete
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Paper>
                <Grid xs={12} sm={12} md={12} lg={12} className="mt-16">
                  {!isView && (
                    <Button
                      variant="contained"
                      style={{ float: "right" }}
                      className={classes.button}
                      aria-label="Register"
                      onClick={(e) => {
                        handleSubmit(e);
                      }}
                    >
                      {isEdit ? "Update" : "Save"}
                    </Button>
                  )}
                </Grid>
              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default AddDisCatalog;
