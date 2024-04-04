import React, { useState, useEffect } from "react";
import { InputBase, Typography, TablePagination } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Paper from "@material-ui/core/Paper";
import { Icon, IconButton } from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import SearchIcon from "@material-ui/icons/Search";
import Icones from "assets/fornt-icons/Mainicons";
import History from "@history";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: "none",
  },
  button: {
    // margin: 5,
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "#FFFFFF",
    borderRadius: 7,
    letterSpacing: "0.06px",
  },
  tabroot: {
    overflowX: "auto",
    overflowY: "auto",
    height: "100%",
  },
  table: {
    // tableLayout: "auto",
    minWidth: 1500,
  },
  tableRowPad: {
    padding: 7,
    wordBreak: "break-all",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    width: "340px",
    height: "37px",
    color: "#CCCCCC",
    opacity: 1,
    letterSpacing: "0.06px",
    font: "normal normal normal 14px/17px Inter",
  },
  search: {
    display: "flex",
    border: "1px solid #cccccc",
    float: "right",
    height: "38px",
    width: "340px",
    borderRadius: "7px !important",
    background: "#FFFFFF 0% 0% no-repeat padding-box",
    opacity: 1,
    padding: "2px 4px",
    alignItems: "center",
  },
  iconButton: {
    width: "19px",
    height: "19px",
    opacity: 1,
    color: "#CCCCCC",
  },
  wrapText: {
    whiteSpace: "nowrap",
    width: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));

const Scheme = (props) => {

  const [searchData, setSearchData] = useState("");
  const [apiData, setApiData] = useState([]);
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const [modalView, setModalView] = useState(0)
  const roleOfUser = localStorage.getItem("permission")
    ? JSON.parse(localStorage.getItem("permission"))
    : null;
  const [authAccessArr, setAuthAccessArr] = useState([]);

  useEffect(() => {
    let arr = roleOfUser
      ? roleOfUser["Scheme-Retailer"]["Scheme list-Retailer"]
        ? roleOfUser["Scheme-Retailer"]["Scheme list-Retailer"]
        : []
      : [];
    const arrData = [];
    if (arr.length > 0) {
      arr.map((item) => {
        arrData.push(item.name);
      });
    }
    setAuthAccessArr(arrData);
  }, []);

  useEffect(() => {
    NavbarSetting("Scheme-Retailer", dispatch);
  }, []);

  function onSearchHandler(sData) {
    setSearchData(sData);
  }
  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  useEffect(() =>{
    const timeout = setTimeout(() => {
      setPage(0)
      setCount(0)
      setApiData([])
      setFilters()
    }, 800);
    return () => {
        clearTimeout(timeout);
    };
  },[searchData,modalView])

  function setFilters(tempPageNo) {
    let url = `retailerProduct/api/scheme?is_close=${modalView}&`;

    if (page !== "") {
      if (!tempPageNo) {
        url = url + "page=" + 1;
      } else {
        url = url + "page=" + tempPageNo;
      }
    }
     if(searchData){
      url = url + "&search=" + searchData;
    }
    // console.log(url, "---------", tempPageNo);
    if (!tempPageNo) {
      getSchemeList(url);
    } else {
      if (count > apiData.length) {
        getSchemeList(url);
      }
    }
  }

  function handleChangePage(event, newPage) {
    let tempPage = page;
    setPage(newPage);
    if (newPage > tempPage && (newPage + 1) * 10 > apiData.length) {
      setFilters(Number(newPage + 1));
    }
  }
  
  function getSchemeList(url) {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + url)
      .then(function (response) {
        if (response.data.success === true) {
          setLoading(false);
          setCount(response.data.totalRecord);
          const arrData = response.data.data
          if(apiData.length === 0){
            setApiData(arrData);
          }else{
            setApiData((apiData) => [...apiData, ...arrData]);
          }
        } else {
          dispatch(Actions.showMessage({ message: response.data.message, variant: "error" }));
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, { api: url });
      });
  }

  const handleChangeTab = (event, value) => {
    setModalView(value);
  };

  return (
    <div className={clsx(classes.root, props.className, "w-full ")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1">
            <Grid
             container
             alignItems="center"
             style={{ marginBottom: 20, marginTop: 20, paddingInline: 30 }}
            >
              <Grid item xs={12} sm={4} md={3} key="1">
                <FuseAnimate delay={300}>
                  <Typography className="text-18 font-700">
                    Gold/Silver Scheme
                  </Typography>
                </FuseAnimate>
              </Grid>
              {
                authAccessArr.includes('Add Scheme-Retailer') && <Grid
                  item
                  xs={12}
                  sm={4}
                  md={9}
                  key="2"
                  style={{ textAlign: "right" }}
                >
                  <Button
                    variant="contained"
                    className={classes.button}
                    size="small"
                    onClick={() => History.push('/dashboard/scheme/addscheme')}
                  >
                    Add New
                  </Button>
                </Grid>
              }

            </Grid>
            <div className="main-div-alll ">
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Tabs
                    value={modalView}
                    onChange={handleChangeTab}
                    variant="scrollable"
                    scrollButtons="auto"
                  >
                    <Tab className={classes.tab} label="Running Scheme" />
                    <Tab className={classes.tab} label="Closed Scheme" />
                  </Tabs>
                </Grid>
                <Grid item>
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
                      <SearchIcon />
                    </IconButton>
                  </div>
                </Grid>
              </Grid>
              <div className="department-tbl-mt-dv" style={{marginTop: 16}}>
                <Paper className={classes.tabroot} id="department-tbl-fix ">
                  <div
                    className="table-responsive "
                    style={{ maxHeight: "calc(100vh - 321px)", overflow: "auto" }}
                  >
                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          {/* <TableCell className={classes.tableRowPad}>Sr No.</TableCell> */}
                          <TableCell className={classes.tableRowPad}>Date</TableCell>
                          <TableCell className={classes.tableRowPad}>Doc. Id</TableCell>
                          <TableCell className={classes.tableRowPad} width="11%">Customer Name</TableCell>
                          <TableCell className={classes.tableRowPad}>Metal Type</TableCell>
                          <TableCell className={classes.tableRowPad}>Total Tenure</TableCell>
                          <TableCell className={classes.tableRowPad}>Customer Tenure</TableCell>
                          <TableCell className={classes.tableRowPad}>Admin Tenure</TableCell>
                          <TableCell className={classes.tableRowPad} align="right" width="150px">Scheme Amount</TableCell>
                          <TableCell className={classes.tableRowPad} align="center">Status</TableCell>
                          <TableCell className={classes.tableRowPad}>Sales Voucher No</TableCell>
                          <TableCell className={classes.tableRowPad}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {apiData
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, i) => (
                            <TableRow key={i}>
                              {/* <TableCell className={classes.tableRowPad}>
                                {(page * 10)+i+1}
                              </TableCell> */}
                              <TableCell className={classes.tableRowPad}>
                                {moment(row.issue_date).format("DD-MM-YYYY")}  
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {row?.doc_number}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {row?.ClientDetails?.client_Name}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {row.is_gold_silver === 0 ? 'Gold' : 'Silver'}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {row?.tenure + ' months'}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {row?.customer_tenure + ' months'}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {row?.admin_tenure + ' months'}
                              </TableCell>
                              <TableCell className={classes.tableRowPad} align="right">
                              {parseFloat(row?.amount).toFixed(2)}
                              </TableCell>
                              <TableCell className={classes.tableRowPad} align="center">
                                {row.is_close === 0 ?
                                <span  style={{padding: 3, borderRadius: 7, background: "#ebeefb", color:"green" }}>Running</span>: 
                                <span  style={{padding: 3, borderRadius: 7, background: "#ebeefb", color:"red"}}>Closed</span>}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {row.is_used_sales === 0 ? "-" : row?.SalesDomestic?.voucher_no}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                  {
                                    authAccessArr.includes('View Scheme-Retailer') && <IconButton
                                    style={{ padding: "0" }}
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                      ev.stopPropagation();
                                      History.push(`/dashboard/scheme/addscheme`,{id:row.id, isView : true});
                                    }}
                                  >
                                    <Icon className="mr-8 view-icone">
                                      <img src={Icones.view} alt="" />
                                    </Icon>
                                  </IconButton>
                                  }
                                   {
                                    authAccessArr.includes('EMI Scheme-Retailer') && row.is_close !== 1 &&  <Button
                                    variant="contained"
                                    className={classes.button}
                                    size="small"
                                    disabled={ row.is_close ? true : false}
                                    onClick={()=>History.push(`/dashboard/scheme/emipay`,{id:row.id, isView : true})}
                                  >
                                    Pay EMI
                                  </Button>
                                  }
                              </TableCell>
                            </TableRow>
                           ))}
                      </TableBody>
                    </Table>
                  </div>
                </Paper>
                <TablePagination
                  labelRowsPerPage=""
                  component="div"
                  // count={apiData.length}
                  count={count}
                  rowsPerPage={10}
                  page={page}
                  backIconButtonProps={{
                    "aria-label": "Previous Page",
                  }}
                  nextIconButtonProps={{
                    "aria-label": "Next Page",
                  }}
                  onPageChange={handleChangePage}
                  // onChangeRowsPerPage={handleChangeRowsPerPage}
                />
              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default Scheme;
