import React, { useState, useEffect } from "react";
import { Button, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import * as Actions from "app/store/actions";
import Config from "app/fuse-configs/Config";
import { Icon, IconButton } from "@material-ui/core";
import useSortableData from "app/main/apps/Stock/Components/useSortableData";
import Icones from "assets/fornt-icons/Mainicons";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import TablePagination from "@material-ui/core/TablePagination";

const useStyles = makeStyles((theme) => ({
  root: {},
  form: {
    marginTop: "3%",
    display: "contents",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "#FFFFFF",
    borderRadius: 7,
    letterSpacing: "0.06px",
  },
}));

const RetailerTable = (props) => {
  // const isEdit = props.isEdit; //if comes from edit
  // const idToBeEdited = props.editID;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState({
    compName: "",
    mobNo: "",
    email: "",
    city: "",
  });

  const [page, setPage] = React.useState(0);
  const [count, setCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [retailersList, setRetailersList] = useState([]);

  const handleSearchData = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    // const searchItem = searchData;
    setSearchData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    console.log(props, "999999999999");
    const timeout = setTimeout(() => {
      if (searchData && props.location && props.location.state) {
        console.log("innnn1");
        const preDta = props.location.state;
        setPage(preDta.page);
        setCount(preDta.count);
        setRetailersList(preDta.retailersList);
        setSearchData(preDta.search);
        History.replace("/dashboard/mobappadmin/companyassociation", null);
      } else {
        console.log("innnn2222xxxxxx");
        setRetailersList([]);
        setCount(0);
        setPage(0);
        setFilters();
      }
    }, 800);
    return () => {
      clearTimeout(timeout);
    };
  }, [searchData]);

  function handleChangePage(event, newPage) {
    let tempPage = page;
    setPage(newPage);
    if (newPage > tempPage && (newPage + 1) * 10 > retailersList.length) {
      setFilters(Number(newPage + 1));
    }
  }

  function setFilters(tempPageNo) {
    let url = "api/retailerMaster?";

    if (page !== "") {
      if (!tempPageNo) {
        url = url + "page=" + 1;
      } else {
        url = url + "page=" + tempPageNo;
      }
    }

    if (searchData.compName !== "") {
      url = url + "&company_name=" + searchData.compName;
    }

    if (searchData.mobNo !== "") {
      url = url + "&company_mob=" + searchData.mobNo;
    }

    if (searchData.email !== "") {
      url = url + "&company_email_for_orders=" + searchData.email;
    }

    if (searchData.city !== "") {
      url = url + "&city_id=" + searchData.city;
    }

    console.log(url, "---------", tempPageNo);

    if (!tempPageNo) {
      getRetailers(url);
    } else {
      if (count > retailersList.length) {
        getRetailers(url);
      }
    }
  }
  function getRetailers(url) {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + url)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          let tempData = response.data.data;
          setCount(Number(response.data.count));
          let tempApi = tempData.map((x) => {
            return {
              ...x,
              selected: false,
              cityNm: x.city_name?.name,
            };
          });
          if (retailersList.length === 0) {
            setRetailersList(tempApi);
          } else {
            setRetailersList((retailersList) => [...retailersList, ...tempApi]);
          }
          setLoading(false);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, { api: url });
      });
  }
  useEffect(() => {
    // setIsView(props.isViewOnly)
    // setIsEdit(props.isEdit)
    // if (props.isViewOnly === true) {
    setRetailersList(props.retailersList);
    // let oneData = props.oneData;

    // }
    //eslint-disable-next-line
  }, [props]);

  const classes = useStyles();

  const { items, requestSort, sortConfig } = useSortableData(retailersList);

  return (
    <div className="m-16 mt-56 department-tbl-mt-dv">
      <Paper className={classes.tabroot} id="department-tbl-fix ">
        <div
          className="table-responsive "
          style={{ maxHeight: "calc(100vh - 300px)" }}
        >
          <TablePagination
            labelRowsPerPage=""
            component="div"
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
          />
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {/* <TableCell className={classes.tableRowPad}>
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        checked={MasterChecked}
                                                        id="mastercheck"
                                                        onChange={(e) => onMasterCheck(e)}
                                                    />
                                                </TableCell> */}
                <TableCell className={classes.tableRowPad} align="left">
                  Company Name
                </TableCell>
                <TableCell className={classes.tableRowPad} align="left">
                  Mobile No.
                </TableCell>
                <TableCell className={classes.tableRowPad} align="left">
                  Email-id
                </TableCell>
                <TableCell className={classes.tableRowPad} align="left">
                  City
                </TableCell>
                <TableCell className={classes.tableRowPad} align="left">
                  Actions
                </TableCell>
              </TableRow>
              <TableRow>
                {/* <TableCell className={classes.tableRowPad}></TableCell> */}
                <TableCell className={classes.tableRowPad}>
                  {/* Company Name */}
                  <TextField
                    name="compName"
                    onChange={handleSearchData}
                    inputProps={{ className: "all-Search-box-data" }}
                  />

                  <IconButton
                    style={{ padding: "10px" }}
                    onClick={() => requestSort("company_name")}
                  >
                    <Icon className="mr-8" style={{ color: "#000" }}>
                      {" "}
                      sort{" "}
                    </Icon>

                    {sortConfig &&
                      sortConfig.key === "company_name" &&
                      sortConfig.direction === "ascending" && (
                        <Icon className="mr-8" style={{ color: "#000" }}>
                          {" "}
                          arrow_downward{" "}
                        </Icon>
                      )}
                    {sortConfig &&
                      sortConfig.key === "company_name" &&
                      sortConfig.direction === "descending" && (
                        <Icon className="mr-8" style={{ color: "#000" }}>
                          {" "}
                          arrow_upward{" "}
                        </Icon>
                      )}
                  </IconButton>
                </TableCell>
                <TableCell className={classes.tableRowPad} align="left">
                  {/* Mobile No. */}
                  <TextField
                    name="mobNo"
                    onChange={handleSearchData}
                    inputProps={{ className: "all-Search-box-data" }}
                  />

                  <IconButton
                    style={{ padding: "10px" }}
                    onClick={() => requestSort("company_mob")}
                  >
                    <Icon className="mr-8" style={{ color: "#000" }}>
                      {" "}
                      sort{" "}
                    </Icon>

                    {sortConfig &&
                      sortConfig.key === "company_mob" &&
                      sortConfig.direction === "ascending" && (
                        <Icon className="mr-8" style={{ color: "#000" }}>
                          {" "}
                          arrow_downward{" "}
                        </Icon>
                      )}
                    {sortConfig &&
                      sortConfig.key === "company_mob" &&
                      sortConfig.direction === "descending" && (
                        <Icon className="mr-8" style={{ color: "#000" }}>
                          {" "}
                          arrow_upward{" "}
                        </Icon>
                      )}
                  </IconButton>
                </TableCell>
                <TableCell className={classes.tableRowPad} align="left">
                  {/*  Email-id */}
                  <TextField
                    name="email"
                    onChange={handleSearchData}
                    inputProps={{ className: "all-Search-box-data" }}
                  />

                  <IconButton
                    style={{ padding: "10px" }}
                    onClick={() => requestSort("company_email_for_orders")}
                  >
                    <Icon className="mr-8" style={{ color: "#000" }}>
                      {" "}
                      sort{" "}
                    </Icon>

                    {sortConfig &&
                      sortConfig.key === "company_email_for_orders" &&
                      sortConfig.direction === "ascending" && (
                        <Icon className="mr-8" style={{ color: "#000" }}>
                          {" "}
                          arrow_downward{" "}
                        </Icon>
                      )}
                    {sortConfig &&
                      sortConfig.key === "company_email_for_orders" &&
                      sortConfig.direction === "descending" && (
                        <Icon className="mr-8" style={{ color: "#000" }}>
                          {" "}
                          arrow_upward{" "}
                        </Icon>
                      )}
                  </IconButton>
                </TableCell>
                <TableCell className={classes.tableRowPad} align="left">
                  {/* City */}
                  <TextField
                    name="city"
                    onChange={handleSearchData}
                    inputProps={{ className: "all-Search-box-data" }}
                  />

                  <IconButton
                    style={{ padding: "10px" }}
                    onClick={() => requestSort("cityNm")}
                  >
                    <Icon className="mr-8" style={{ color: "#000" }}>
                      {" "}
                      sort{" "}
                    </Icon>

                    {sortConfig &&
                      sortConfig.key === "cityNm" &&
                      sortConfig.direction === "ascending" && (
                        <Icon className="mr-8" style={{ color: "#000" }}>
                          {" "}
                          arrow_downward{" "}
                        </Icon>
                      )}
                    {sortConfig &&
                      sortConfig.key === "cityNm" &&
                      sortConfig.direction === "descending" && (
                        <Icon className="mr-8" style={{ color: "#000" }}>
                          {" "}
                          arrow_upward{" "}
                        </Icon>
                      )}
                  </IconButton>
                </TableCell>
                <TableCell className={classes.tableRowPad} align="left">
                  {/* Actions */}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items
                .filter((temp) => {
                  //             compName: "",
                  //                 mobNo: "",
                  // email: "",
                  // city: "",
                  if (searchData.compName) {
                    return temp.company_name
                      .toLowerCase()
                      .includes(searchData.compName.toLowerCase());
                  } else if (searchData.mobNo) {
                    return temp.company_mob
                      .toLowerCase()
                      .includes(searchData.mobNo.toLowerCase());
                  } else if (searchData.email) {
                    return temp.company_email_for_orders
                      .toLowerCase()
                      .includes(searchData.email.toLowerCase());
                  } else if (searchData.city) {
                    return temp.city_name.name
                      .toLowerCase()
                      .includes(searchData.city.toLowerCase());
                  } else {
                    return temp;
                  }
                })
                .map((row) => (
                  <TableRow key={row.id}>
                    {/* component="th" scope="row" */}
                    {/* <TableCell className={classes.tableRowPad}>
                                                            <input
                                                                type="checkbox"
                                                                checked={row.selected}
                                                                className="form-check-input"
                                                                id="rowcheck{user.id}"
                                                                onChange={(e) => onItemCheck(e, row)}
                                                            />
                                                        </TableCell> */}
                    <TableCell align="left" className={classes.tableRowPad}>
                      {row.company_name}
                    </TableCell>

                    <TableCell align="left" className={classes.tableRowPad}>
                      {row.company_mob}
                    </TableCell>
                    <TableCell align="left" className={classes.tableRowPad}>
                      {row.company_email_for_orders}
                    </TableCell>

                    <TableCell
                      align="left"
                      className={classes.tableRowPad}
                      style={{ overflowWrap: "anywhere" }}
                    >
                      {/* designation */}
                      {row.city_name.name}
                    </TableCell>

                    <TableCell className={classes.tableRowPad}>
                      <Button
                        className={classes.button}
                        variant="contained"
                        onClick={(e) => props.handleAllocation(row)}
                      >
                        Allocate Distributor
                      </Button>

                      {/* <IconButton
                                  style={{ padding: "0" }}
                                  onClick={(e) => handleAllocation(row)}
                                >
                                  <Icon className="mr-8 allocationdis-icone">
                                    <img
                                      src={Icones.allocation_distributor}
                                      alt=""
                                    />
                                  </Icon>
                                </IconButton> */}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            labelRowsPerPage=""
            component="div"
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
          />
        </div>
      </Paper>
    </div>
  );
};

export default RetailerTable;
