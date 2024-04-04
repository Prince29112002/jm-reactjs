import React, { useState, useEffect } from "react";
import { Typography, Icon, IconButton, InputBase } from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { Link } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
  root: {},
  tabroot: {
    overflowX: "auto",
    overflowY: "auto",
    height: "100%",
  },
  paper: {
    position: "absolute",
    width: 400,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    outline: "none",
  },
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "#FFFFFF",
    borderRadius: 7,
    letterSpacing: "0.06px",
  },
  table: {
    // tableLayout: "auto",
    minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
  },
  searchBox: {
    padding: 0,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
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
}));

// const classes = useStyles();

function getModalStyle() {
  const top = 50; //+ rand();
  const left = 50; //+ rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const Processline = (props) => {
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
  const [apiData, setApiData] = useState([]); // display list
  const [searchData, setSearchData] = useState("");

  const dispatch = useDispatch();
  const [modalStyle] = useState(getModalStyle);

  const [processNm, setProcessNm] = useState(""); //first textbox creating new department
  const [processNmErr, setProcessNmErr] = useState("");

  //   const [underDeptChecked, setUnderDeptChecked] = useState(false);

  const [mainDepartmentData, setMainDepartmentData] = useState([]); //dropdown data if first checkbox is checked

  const [selectedMainDepart, setSelectedMainDepart] = useState(""); //selected main department
  const [mainDepartErrTxt, setMainDepartErrTxt] = useState("");

  const [aliasCode, setAliasCode] = useState("");

  //   const [autoTransferChecked, setAutoTransferChecked] = useState(false);

  //   const [allDepartmentData, setAllDepartmentData] = useState([]);

  //   const [selectedAllDepart, setSelectedAllDepart] = useState(""); //selected main department
  //   const [allDepartErrTxt, setAllDepartErrTxt] = useState("");

  const [isEdit, setIsEdit] = useState(false);

  const [open, setOpen] = useState(false); //confirm delete Dialog
  const [selectedIdForEdit, setSelectedIdForEdit] = useState("");
  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");
  const [loading, setLoading] = useState(false);
  // const [normalLoading, setNormalLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const roleOfUser = localStorage.getItem("permission")
    ? JSON.parse(localStorage.getItem("permission"))
    : null;
  const [authAccessArr, setAuthAccessArr] = useState([]);
  function editHandler(id) {
    console.log(id);
    const index = apiData.findIndex((a) => a.id === id);
    if (index > -1) {
      console.log("editHandler", apiData[index]);
      // setSelectedIdForEdit(row.id);
      // setIsEdit(true);
      props.history.push("/dashboard/masters/processline/editprocessline", {
        row: apiData[index],
      });
    }
  }
  useEffect(() => {
    let arr = roleOfUser
      ? roleOfUser["Master"]["Process"]
        ? roleOfUser["Master"]["Process"]
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
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);
  function onSearchHandler(sData) {
    // console.log("Search on", sData);
    setSearchData(sData);
    // let newArr = data
    //   .filter(
    //     (temp) =>
    //     temp.stockGroupName.toLowerCase().includes(searchData.toLowerCase()) ||
    //     temp.variantName.toLowerCase().includes(searchData.toLowerCase())
    //   )
    //   .map(({ stockGroupName, variantName }) => ({ stockGroupName, variantName }));
    // console.log(newArr);

    // const filteredPersons = details.filter(
    //   person => {
    //     return (
    //       person
    //       .name
    //       .toLowerCase()
    //       .includes(searchField.toLowerCase()) ||
    //       person
    //       .email
    //       .toLowerCase()
    //       .includes(searchField.toLowerCase())
    //     );
    //   }
    // );
  }
  // useEffect(() => {
  //   if (normalLoading) {
  //     setTimeout(() => setNormalLoading(false), 7000); // 10초 뒤에
  //   }
  // }, [normalLoading]);

  useEffect(() => {
    console.log("useEffect");
    //get item types
    getProcessData(); //main list
    //eslint-disable-next-line
  }, [dispatch]);

  useEffect(() => {
    NavbarSetting("Master", dispatch);
    //eslint-disable-next-line
  }, []);

  const classes = useStyles();

  function getProcessData() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + "api/processline")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setLoading(false);

          setApiData(response.data.data);
          // setData(response.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, { api: "api/processline" });
      });
  }

  function callDeleteProcessApi(id) {
    axios
      .delete(Config.getCommonUrl() + "api/processline/" + id)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          // selectedIdForDelete

          // const findIndex = apiData.findIndex(
          //   (a) => a.id === selectedIdForDelete
          // );

          // findIndex !== -1 && apiData.splice(findIndex, 1);
          getProcessData();

          dispatch(Actions.showMessage({ message: response.data.message }));

          setSelectedIdForDelete("");
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        // console.log(error);
        handleError(error, dispatch, { api: "api/processline/" + id });
      });
  }

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20 ">
          <div className="flex flex-1 flex-col min-w-0">
            <Grid
              className="department-main-dv"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={4} sm={4} md={4} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    Process Master Line{" "}
                  </Typography>
                </FuseAnimate>

                {/* <BreadcrumbsHelper /> */}
              </Grid>

              <Grid
                item
                xs={8}
                sm={8}
                md={8}
                key="2"
                style={{ textAlign: "right" }}
              >
                <Link
                  to="/dashboard/masters/processline/addprocessline"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Button
                    variant="contained"
                    className={classes.button}
                    size="small"
                    onClick={(event) => {
                      // openModalHandler();
                      // getbtocclient();
                    }}
                  >
                    Add New
                  </Button>
                </Link>
              </Grid>
            </Grid>
            <div className="main-div-alll ">
              <div>
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
              </div>

              <div className="mt-56 department-tbl-mt-dv">
                <Paper
                  className={clsx(classes.tabroot)}
                  id="btoclient_tabel_dv"
                  style={{ height: "calc(100vh - 280px)" }}
                >
                  {/* <div className="table-responsive btoclients-tabel-dv  btwo_stock_group_tbel"> */}
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ width: "85px" }}
                        >
                          ID
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ width: "150px" }}
                          align="left"
                        >
                          Process Line Name
                        </TableCell>
                        {/* <TableCell className={classes.tableRowPad} style={{width:"150px"}}align="left">
                          Contact No.
                        </TableCell>
                        <TableCell className={classes.tableRowPad} style={{width:"200px"}} align="left">
                          Email
                        </TableCell>
                        <TableCell className={classes.tableRowPad} style={{width:"400px"}}align="left">
                          Address/Location
                        </TableCell>
                        <TableCell className={classes.tableRowPad} style={{width:"120px"}}align="left">
                          State
                        </TableCell>
                        <TableCell className={classes.tableRowPad} style={{width:"120px"}} align="left">
                          City
                        </TableCell>
                        <TableCell className={classes.tableRowPad} style={{width:"120px"}}align="left">
                          Pincode
                        </TableCell>
                        <TableCell className={classes.tableRowPad} style={{width:"150px"}}align="left">
                          Gov. Proof Name
                        </TableCell>
                        <TableCell className={classes.tableRowPad} style={{width:"135px"}}align="left">
                          Proof Id
                        </TableCell> */}
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ width: "120px" }}
                          align="left"
                        >
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {apiData
                        .filter(
                          (temp) =>
                            temp.process_line_name
                              .toLowerCase()
                              .includes(searchData.toLowerCase())
                          // temp.process_category.category_name
                          //   .toLowerCase()
                          //   .includes(searchData.toLowerCase())
                        )
                        .map((row, i) => (
                          <TableRow key={row.id}>
                            <TableCell
                              className={classes.tableRowPad}
                              style={{ maxWidth: 100 }}
                            >
                              {i + 1}
                            </TableCell>
                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                              style={{ maxWidth: 300 }}
                            >
                              {row.process_line_name}
                            </TableCell>
                            {/* <TableCell
                          align="left"
                          className={classes.tableRowPad}
                          style={{ maxWidth: 300 }}
                        >
                          {row.Department !== null ? row.Department.name : "-"}
                          {row.process_category.category_name}
                        </TableCell> */}
                            <TableCell
                              className={classes.tableRowPad}
                              style={{ maxWidth: 200 }}
                            >
                              {
                                // authAccessArr.includes('Edit Process') &&
                                <IconButton
                                  style={{ padding: "0" }}
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    ev.stopPropagation();
                                    editHandler(row.id);
                                  }}
                                >
                                  <Icon
                                    className="mr-8"
                                    style={{ color: "dodgerblue" }}
                                  >
                                    create
                                  </Icon>
                                </IconButton>
                              }
                              {
                                // authAccessArr.includes('Delete Process') &&
                                <IconButton
                                  style={{ padding: "0" }}
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    ev.stopPropagation();
                                    callDeleteProcessApi(row.id);
                                  }}
                                >
                                  <Icon
                                    className="mr-8"
                                    style={{ color: "red" }}
                                  >
                                    delete
                                  </Icon>
                                </IconButton>
                              }
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                  {/* </div> */}
                </Paper>
              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default Processline;
