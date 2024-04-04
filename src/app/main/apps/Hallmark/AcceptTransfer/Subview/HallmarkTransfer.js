import React, { useState, useEffect, useContext } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from "@material-ui/core/Paper";
import Loader from '../../../../Loader/Loader';
import AppContext from "app/AppContext";
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
  button: {
    margin: 5,
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
    minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
  },
}));

const HallmarkTransfer = ({ accept, search, filterDate, sDate, eDate }) => {
  const [slipList, setSlipList] = useState([]);

  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const appContext = useContext(AppContext);

  const { selectedDepartment } = appContext;

  useEffect(() => {
    if (selectedDepartment !== "") {
      setFilters()
    }
  }, [selectedDepartment, accept, filterDate]);

  function setFilters() {
    if (accept === 0) {
      if (slipList.length > 0) {
        acceptAllEntry()
      }
    } else if (filterDate) {
      let url = `api/hallmarkissue/${selectedDepartment.value.split("-")[1]}?start=${sDate}&end=${eDate}`;
      getHallmarkFilter(url)
    }
    else {
      let url = `api/hallmarkissue/${selectedDepartment.value.split("-")[1]}`
      getHallmarkData(url)
    }
  }

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  function getHallmarkData(url) {
    setLoading(true);
    axios.get(Config.getCommonUrl() + url)
      .then((response) => {
        console.log(response);
        let tempData = response.data.TransferData;
        let data = tempData.map((item) => {
          return {
            id: item.id,
            from_department: item.from_department,
            hallmark_id: item.hallmark_issue_id,
            Client: item.HallmarkTransfer.Client ? item.HallmarkTransfer.Client.name : "",
            Company: item.HallmarkTransfer.Company ? item.HallmarkTransfer.Company.company_name : "",
            HallmarkIssueStation: item.HallmarkTransfer.HallmarkIssueStation ? item.HallmarkTransfer.HallmarkIssueStation.name : "",
          }
        })
        setSlipList(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {api : url})

      })
  }

  function getHallmarkFilter(url) {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + url)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          let tempData = response.data.TransferData;
          let data = tempData.map((item) => {
            return {
              id: item.id,
              from_department: item.from_department,
              hallmark_id: item.hallmark_issue_id,
              Client: item.HallmarkTransfer.Client ? item.HallmarkTransfer.Client.name : "",
              Company: item.HallmarkTransfer.Company ? item.HallmarkTransfer.Company.company_name : "",
              HallmarkIssueStation: item.HallmarkTransfer.HallmarkIssueStation ? item.HallmarkTransfer.HallmarkIssueStation.name : "",
            }
          })
          setSlipList(data);
        }
        setLoading(false);
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, {api : url})

      });
  }

  const acceptRejectHandler = (e, id, fId, rId) => {
    e.preventDefault();
    const body = {
      transfer_id: id,
      from_department_id: fId,
      to_department_id: selectedDepartment.value.split("-")[1]
    }
    var callApi = `api/hallmarkissue/${id}/${selectedDepartment.value.split("-")[1]}/${rId}`
    axios.put(Config.getCommonUrl() + callApi, body)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          getHallmarkData(`api/hallmarkissue/${selectedDepartment.value.split("-")[1]}`);
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {api : callApi, body: body})

      })
  }

  const acceptRejectHandlerDelete = (e, id, rId) => {
    e.preventDefault();
    axios.delete(Config.getCommonUrl() + `api/hallmarkissue/reject/${id}/${rId}`)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          getHallmarkData(`api/hallmarkissue/${selectedDepartment.value.split("-")[1]}`);
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {api :  `api/hallmarkissue/reject/${id}/${rId}`})

      })
  }
  const acceptAllEntry = () => {
    axios.put(Config.getCommonUrl() + `api/hallmarkissue/hallmark/accept/all/${selectedDepartment.value.split("-")[1]}`)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          getHallmarkData(`api/hallmarkissue/${selectedDepartment.value.split("-")[1]}`);
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {api : `api/hallmarkissue/hallmark/accept/all/${selectedDepartment.value.split("-")[1]}`})

      })
  }

  return (
    <div className="">
      <Paper className={clsx(classes.tabroot, "table-responsive")}>
      {loading && <Loader />}
        <MaUTable className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableRowPad}>Client Name</TableCell>
              <TableCell className={classes.tableRowPad}>Company Name</TableCell>
              <TableCell className={classes.tableRowPad}>Hallmark Station</TableCell>
              <TableCell className={classes.tableRowPad}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slipList.filter((temp) =>
              temp.Client.toLowerCase().includes(search.toLowerCase()) ||
              temp.Company.toLowerCase().includes(search.toLowerCase()) ||
              temp.HallmarkIssueStation.toLowerCase().includes(search.toLowerCase())
            ).map((row, i) => (
              <TableRow key={i}>
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
                  <Button
                    variant="contained"
                    className={classes.button}
                    style={{
                      backgroundColor: "#4caf50",
                      border: "none",
                      color: "white",
                    }}
                    size="small"

                    onClick={(e) => acceptRejectHandler(e, row.hallmark_id, row.from_department, row.id)}
                  >
                    Accept
                  </Button>

                  <Button
                    variant="contained"
                    className={classes.button}
                    size="small"
                    style={{
                      backgroundColor: "red",
                      border: "none",
                      color: "white",
                    }}

                    onClick={(e) => acceptRejectHandlerDelete(e, row.hallmark_id, row.id)}
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))
            }
          </TableBody>
        </MaUTable>
      </Paper>
    </div>
  )
}

export default HallmarkTransfer;