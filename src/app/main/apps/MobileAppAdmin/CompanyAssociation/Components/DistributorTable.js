import React, { useState, useEffect } from "react";
import { TablePagination, Typography } from "@material-ui/core";
import { Button, TextField } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Icon, IconButton } from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import useSortableData from "app/main/apps/Stock/Components/useSortableData";
import Icones from "assets/fornt-icons/Mainicons";
import * as Actions from "app/store/actions";

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

const DistributorTable = (props) => {
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
  const [distributorList, setDistributorList] = useState([]);

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
    // setIsView(props.isViewOnly)
    // setIsEdit(props.isEdit)
    // if (props.isViewOnly === true) {
    setDistributorList(props.distributorList);
    // let oneData = props.oneData;

    // }
    //eslint-disable-next-line
  }, [props]);

  useEffect(() => {
    console.log(props, "999999999999");
    const timeout = setTimeout(() => {
      if (searchData && props.location && props.location.state) {
        console.log("innnn1");
        const preDta = props.location.state;
        setPage(preDta.page);
        setCount(preDta.count);
        setDistributorList(preDta.distributorList);
        setSearchData(preDta.search);
        History.replace("/dashboard/mobappadmin/companyassociation", null);
      } else {
        console.log("innnn2222");
        setDistributorList([]);
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
    if (newPage > tempPage && (newPage + 1) * 10 > distributorList.length) {
      setFilters(Number(newPage + 1));
    }
  }

  function setFilters(tempPageNo) {
    let url = "api/client/all/client?";

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
      url = url + "&number=" + searchData.mobNo;
    }

    if (searchData.email !== "") {
      url = url + "&email=" + searchData.email;
    }

    if (searchData.city !== "") {
      url = url + "&cityName=" + searchData.city;
    }

    console.log(url, "---------", tempPageNo);

    if (!tempPageNo) {
      console.log("innnnnnnnnnnnnnn444444");
      getDistributor(url);
    } else {
      if (count > distributorList.length) {
        getDistributor(url);
      }
    }
  }
  function getDistributor(url) {
    setLoading(true);
    // api/distributormaster/all-distributors
    axios
      .get(Config.getCommonUrl() + url)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          let tempData = response.data.data;
          setCount(Number(response.data.count));
          let tempApi = tempData.map((x) => {
            let comp =
              x.clientCompanies.length > 0 && x.companyId
                ? x.clientCompanies.filter((y) => {
                    return y.id === x.companyId.company_id;
                  })
                : "";

            return {
              ...x,
              // toBeSelect: x.clientCompanies.length > 0 ? true : false,
              companyDetails: comp,
              selected: false, //below keys are used for sorting purpose
              email:
                x.clientContacts.length > 0 ? x.clientContacts[0].email : "",
              mobNo:
                x.clientContacts.length > 0 ? x.clientContacts[0].number : "",
              cityNm: comp.length > 0 ? comp[0].CityName.name : "",
              compNm: comp.length > 0 ? comp[0].company_name : "",
            };
          });
          console.log(tempApi);
          if (distributorList.length === 0) {
            setDistributorList(tempApi);
          } else {
            setDistributorList((distributorList) => [
              ...distributorList,
              ...tempApi,
            ]);
          }
          setLoading(false);
          // setData(response.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, { api: url });
      });
  }
  const classes = useStyles();

  const { items, requestSort, sortConfig } = useSortableData(distributorList);

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
                    onClick={() => requestSort("compNm")}
                  >
                    <Icon className="mr-8" style={{ color: "#000" }}>
                      {" "}
                      sort{" "}
                    </Icon>

                    {sortConfig &&
                      sortConfig.key === "compNm" &&
                      sortConfig.direction === "ascending" && (
                        <Icon className="mr-8" style={{ color: "#000" }}>
                          {" "}
                          arrow_downward{" "}
                        </Icon>
                      )}
                    {sortConfig &&
                      sortConfig.key === "compNm" &&
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
                    onClick={() => requestSort("mobNo")}
                  >
                    <Icon className="mr-8" style={{ color: "#000" }}>
                      {" "}
                      sort{" "}
                    </Icon>

                    {sortConfig &&
                      sortConfig.key === "mobNo" &&
                      sortConfig.direction === "ascending" && (
                        <Icon className="mr-8" style={{ color: "#000" }}>
                          {" "}
                          arrow_downward{" "}
                        </Icon>
                      )}
                    {sortConfig &&
                      sortConfig.key === "mobNo" &&
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
                    onClick={() => requestSort("email")}
                  >
                    <Icon className="mr-8" style={{ color: "#000" }}>
                      {" "}
                      sort{" "}
                    </Icon>

                    {sortConfig &&
                      sortConfig.key === "email" &&
                      sortConfig.direction === "ascending" && (
                        <Icon className="mr-8" style={{ color: "#000" }}>
                          {" "}
                          arrow_downward{" "}
                        </Icon>
                      )}
                    {sortConfig &&
                      sortConfig.key === "email" &&
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
                  if (searchData.compName) {
                    return temp.companyDetails.length > 0
                      ? temp.companyDetails[0].company_name
                          .toLowerCase()
                          .includes(searchData.compName.toLowerCase())
                      : null;
                  } else if (searchData.mobNo) {
                    return temp.clientContacts.length > 0
                      ? temp.clientContacts[0].number
                          .toLowerCase()
                          .includes(searchData.mobNo.toLowerCase())
                      : null;
                  } else if (searchData.email) {
                    return temp.clientContacts.length > 0
                      ? temp.clientContacts[0].email
                          .toLowerCase()
                          .includes(searchData.email.toLowerCase())
                      : null;
                  } else if (searchData.city) {
                    return temp.companyDetails.length > 0
                      ? temp.companyDetails[0].CityName.name
                          .toLowerCase()
                          .includes(searchData.city.toLowerCase())
                      : null;
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
                      {row.companyDetails.length > 0
                        ? row.companyDetails[0].company_name
                        : "-"}
                    </TableCell>

                    <TableCell align="left" className={classes.tableRowPad}>
                      {row.clientContacts[0].number}
                    </TableCell>
                    <TableCell align="left" className={classes.tableRowPad}>
                      {row.clientContacts[0].email}
                    </TableCell>

                    <TableCell
                      align="left"
                      className={classes.tableRowPad}
                      style={{ overflowWrap: "anywhere" }}
                    >
                      {row.companyDetails.length > 0
                        ? row.companyDetails[0].CityName.name
                        : "-"}
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

export default DistributorTable;
