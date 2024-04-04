import React, { useState, useEffect, useContext } from "react";
import { Checkbox, Icon, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Loader from "../../../../Loader/Loader";
import History from "@history";
import clsx from "clsx";
import AppContext from "app/AppContext";
import TransferHm from "../../TransferHm/TransferHm";
import handleError from "app/main/ErrorComponent/ErrorComponent";

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: {
    position: "absolute",
    width: 400,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    outline: "none",
  },
  tabroot: {
    overflowX: "auto",
    overflowY: "auto",
    height: "100%",
  },
  table: {
    tableLayout: "auto",
    minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
  },
}));

const HallmarkList = ({
  props,
  search,
  filterDate,
  sDate,
  eDate,
  func,
  reset,
}) => {
  const [slipList, setSlipList] = useState([]);
  const [selectedId, setSelectedId] = useState([]);
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const appContext = useContext(AppContext);

  const { selectedDepartment } = appContext;

  useEffect(() => {
    if (selectedDepartment !== "") {
      setFilters();
    }
  }, [selectedDepartment, filterDate]);

  function setFilters() {
    if (filterDate) {
      let url = `api/hallmarkissue/issue/list/2/${
        selectedDepartment.value.split("-")[1]
      }?start=${sDate}&end=${eDate}`;
      getHallmarkFilter(url);
    } else {
      let url = `api/hallmarkissue/issue/list/2/${
        selectedDepartment.value.split("-")[1]
      }`;
      getHallmarkData(url);
    }
  }

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  function getHallmarkData(url) {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + url)
      .then((response) => {
        console.log(response);
        let tempData = response.data.data;
        const data = tempData.map((item) => {
          return {
            ...item,
            ReqNum: item.request_number ? item.request_number : "",
            Client: item.Client ? item.Client.name : "",
            Company: item.Company ? item.Company.company_name : "",
            HallmarkIssueStation: item.HallmarkIssueStation
              ? item.HallmarkIssueStation.name
              : "",
          };
        });
        setSlipList(data);
        func(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, { api: url });
      });
  }

  function getHallmarkFilter(url) {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + url)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          let tempData = response.data.data;
          const data = tempData.map((item) => {
            return {
              ...item,
              ReqNum: item.request_number ? item.request_number : "",
              Client: item.Client ? item.Client.name : "",
              Company: item.Company ? item.Company.company_name : "",
              HallmarkIssueStation: item.HallmarkIssueStation
                ? item.HallmarkIssueStation.name
                : "",
            };
          });
          setSlipList(data);
          func(data);
        }
        setLoading(false);
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, { api: url });
      });
  }

  const handleSelectLot = (e) => {
    const newSelection = e.target.value;
    let newSelectionArrayId;
    if (selectedId.indexOf(newSelection) > -1) {
      newSelectionArrayId = selectedId.filter((s) => s !== newSelection);
    } else {
      newSelectionArrayId = [...selectedId, newSelection];
    }
    setSelectedId(newSelectionArrayId);
  };

  const displayOut = (transferId) => {
    if (transferId === 1) {
      return (
        <span style={{ backgroundColor: "gray", color: "white" }}>OUT</span>
      );
    } else {
      return;
    }
  };

  const fetchData = () => {
    getHallmarkData(
      `api/hallmarkissue/issue/list/2/${selectedDepartment.value.split("-")[1]}`
    );
    setSelectedId([]);
  };

  const showModle = () => {
    if (
      props.location.search === "?transferhallmark" &&
      selectedId.length > 0
    ) {
      return (
        <TransferHm lot_id={selectedId} getData={fetchData} from="hallmark" />
      );
    } else if (props.location.search === "?reset") {
      reset();
      History.push("/dashboard/hallmark");
    } else {
      History.push("/dashboard/hallmark");
      dispatch(
        Actions.showMessage({
          message: "Select slip from List",
          variant: "error",
        })
      );
    }
  };

  function editHandler(reqId) {
    History.push("/dashboard/hallmark/recfromhallmark", { reqId: reqId });
  }

  return (
    <div className="">
      <Paper className={clsx(classes.tabroot, "table-responsive")}>
        {loading && <Loader />}
        <MaUTable className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableRowPad}></TableCell>
              <TableCell className={classes.tableRowPad}>
                Request Number
              </TableCell>
              <TableCell className={classes.tableRowPad}>Client Name</TableCell>
              <TableCell className={classes.tableRowPad}>
                Company Name
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                Hallmark Station
              </TableCell>
              <TableCell className={classes.tableRowPad}>Transit</TableCell>
              <TableCell className={classes.tableRowPad}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slipList
              .filter(
                (temp) =>
                  temp.ReqNum.toLowerCase().includes(search.toLowerCase()) ||
                  temp.Client.toLowerCase().includes(search.toLowerCase()) ||
                  temp.Company.toLowerCase().includes(search.toLowerCase()) ||
                  temp.HallmarkIssueStation.toLowerCase().includes(
                    search.toLowerCase()
                  )
              )
              .map((row, i) => (
                <TableRow key={i}>
                  <TableCell className={classes.tableRowPad}>
                    <Checkbox
                      name="selectlot"
                      value={row.id}
                      onChange={handleSelectLot}
                      disabled={row.is_transfer === 1 ? true : false}
                      checked={
                        selectedId.includes(row.id.toString()) ? true : false
                      }
                    />
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {row.ReqNum}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {row.Client}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {row.Company}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {row.HallmarkIssueStation}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {displayOut(row.is_transfer)}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    <IconButton
                      style={{ padding: "0" }}
                      onClick={(ev) => {
                        ev.preventDefault();
                        ev.stopPropagation();
                        editHandler(row.ReqNum);
                      }}
                      disabled={row.is_transfer === 1 ? true : false}
                    >
                      <Icon
                        className="mr-8"
                        style={
                          row.is_transfer === 1
                            ? { color: "gray" }
                            : { color: "dodgerblue" }
                        }
                      >
                        edit
                      </Icon>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
          {props.location.search ? showModle() : null}
        </MaUTable>
      </Paper>
    </div>
  );
};

export default HallmarkList;
