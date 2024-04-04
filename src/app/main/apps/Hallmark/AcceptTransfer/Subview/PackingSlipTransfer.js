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

const PackingSlipTransfer = ({ accept, search, filterDate, sDate, eDate }) => {
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
    if (accept === 1) {
      if (slipList.length > 0) {
        acceptAllEntry()
      }
    } else if (filterDate) {
      let url = `api/hallmarkissue/slip/${selectedDepartment.value.split("-")[1]}?start=${sDate}&end=${eDate}`;
      getSlipFilter(url)
    }
    else {
      let url = `api/hallmarkissue/slip/${selectedDepartment.value.split("-")[1]}`
      getSlipData(url)
    }
  }
  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  function getSlipData(url) {
    setLoading(true);
    axios.get(Config.getCommonUrl() + url)
      .then((response) => {
        console.log(response);
        let tempData = response.data.TransferData;
        let data = tempData.map((item) => {
          return {
            id: item.id,
            packingslip_id: item.packing_slip_id,
            from_department: item.from_department,
            SlipBarCode: item.PackingSlipTransfer.SlipBarCode ? item.PackingSlipTransfer.SlipBarCode.barcode : '',
            purity: item.PackingSlipTransfer.purity ? item.PackingSlipTransfer.purity : '',
            phy_pcs: item.PackingSlipTransfer.phy_pcs ? item.PackingSlipTransfer.phy_pcs : "",
            gross_wgt: item.PackingSlipTransfer.gross_wgt ? item.PackingSlipTransfer.gross_wgt : '',
            other_wgt: item.PackingSlipTransfer.other_wgt ? item.PackingSlipTransfer.other_wgt : '',
            net_wgt: item.PackingSlipTransfer.net_wgt ? item.PackingSlipTransfer.net_wgt : '',
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

  function getSlipFilter(url) {
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
              packingslip_id: item.packing_slip_id,
              from_department: item.from_department,
              SlipBarCode: item.PackingSlipTransfer.SlipBarCode ? item.PackingSlipTransfer.SlipBarCode.barcode : '',
              purity: item.PackingSlipTransfer.purity ? item.PackingSlipTransfer.purity : '',
              phy_pcs: item.PackingSlipTransfer.phy_pcs ? item.PackingSlipTransfer.phy_pcs : "",
              gross_wgt: item.PackingSlipTransfer.gross_wgt ? item.PackingSlipTransfer.gross_wgt : '',
              other_wgt: item.PackingSlipTransfer.other_wgt ? item.PackingSlipTransfer.other_wgt : '',
              net_wgt: item.PackingSlipTransfer.net_wgt ? item.PackingSlipTransfer.net_wgt : '',
            }
          })
          setSlipList(data);
        }
        setLoading(false);
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, {api :url})

      });
  }

  const acceptRejectHandler = (e, id, fId, rId) => {
    e.preventDefault();
    const body = {
      transfer_id: id,
      from_department_id: fId,
      to_department_id: selectedDepartment.value.split("-")[1]
    }
    var callApi = `api/hallmarkissue/accept/${id}/${selectedDepartment.value.split("-")[1]}/${rId}`
    axios.put(Config.getCommonUrl() + callApi)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          getSlipData(`api/hallmarkissue/slip/${selectedDepartment.value.split("-")[1]}`);
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {api : callApi})

      })
  }

  const acceptRejectHandlerDelete = (e, id, rId) => {
    e.preventDefault();
    axios.delete(Config.getCommonUrl() + `api/hallmarkissue/reject/slip/${id}/${rId}`)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          getSlipData(`api/hallmarkissue/slip/${selectedDepartment.value.split("-")[1]}`);
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {api : `api/hallmarkissue/reject/slip/${id}/${rId}`})

      })
  }
  const acceptAllEntry = () => {
    axios.put(Config.getCommonUrl() + `api/hallmarkissue/slip/accept/all/${selectedDepartment.value.split("-")[1]}`)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          getSlipData(`api/hallmarkissue/slip/${selectedDepartment.value.split("-")[1]}`);
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {api : `api/hallmarkissue/slip/accept/all/${selectedDepartment.value.split("-")[1]}`})

      })
  }

  return (
    <div className="">
      <Paper className={clsx(classes.tabroot, "table-responsive")}>
      {loading && <Loader />}
        <MaUTable className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableRowPad}>BarCode</TableCell>
              <TableCell className={classes.tableRowPad}>Purity</TableCell>
              <TableCell className={classes.tableRowPad}>Pieces</TableCell>
              <TableCell className={classes.tableRowPad}>Gross Weight</TableCell>
              <TableCell className={classes.tableRowPad}>Other Weight</TableCell>
              <TableCell className={classes.tableRowPad}>Net Weight</TableCell>
              <TableCell className={classes.tableRowPad}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slipList.filter((temp) =>
              temp.SlipBarCode.toLowerCase().includes(search.toLowerCase()) ||
              temp.purity.toLowerCase().includes(search.toLowerCase()) ||
              temp.phy_pcs.toLowerCase().includes(search.toLowerCase()) ||
              temp.gross_wgt.toLowerCase().includes(search.toLowerCase()) ||
              temp.other_wgt.toLowerCase().includes(search.toLowerCase()) ||
              temp.net_wgt.toLowerCase().includes(search.toLowerCase())
            ).map((row, i) => (
              <TableRow key={i}>
                <TableCell className={classes.tableRowPad}>
                  {row.SlipBarCode}
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  {row.purity}
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  {row.phy_pcs}
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  {row.gross_wgt}
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  {row.other_wgt}
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  {row.net_wgt}
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

                    onClick={(e) => acceptRejectHandler(e, row.packingslip_id, row.from_department, row.id)}
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

                    onClick={(e) => acceptRejectHandlerDelete(e, row.packingslip_id, row.id)}
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

export default PackingSlipTransfer;