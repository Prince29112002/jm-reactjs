import React, { useState, useEffect, useContext } from "react";
import { Checkbox } from "@material-ui/core";
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

const PackingSlipList = ({
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
      let url = `api/packingslip/issue/${
        selectedDepartment.value.split("-")[1]
      }?start=${sDate}&end=${eDate}`;
      getSlipFilter(url);
    } else {
      let url = `api/packingslip/issue/${
        selectedDepartment.value.split("-")[1]
      }`;
      getSlipData(url);
    }
  }

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  function getSlipData(url) {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + url)
      .then((response) => {
        console.log(response);
        let tempData = response.data.data;
        const data = tempData.map((item) => {
          return {
            ...item,
            SlipBarCode: item.SlipBarCode ? item.SlipBarCode.barcode : "",
            purity: item.purity ? item.purity : "",
            phy_pcs: item.phy_pcs ? item.phy_pcs.toString() : "",
            gross_wgt: item.gross_wgt ? item.gross_wgt : "",
            other_wgt: item.other_wgt ? item.other_wgt : "",
            net_wgt: item.net_wgt ? item.net_wgt : "",
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

  function getSlipFilter(url) {
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
              SlipBarCode: item.SlipBarCode ? item.SlipBarCode.barcode : "",
              purity: item.purity ? item.purity : "",
              phy_pcs: item.phy_pcs ? item.phy_pcs.toString() : "",
              gross_wgt: item.gross_wgt ? item.gross_wgt : "",
              other_wgt: item.other_wgt ? item.other_wgt : "",
              net_wgt: item.net_wgt ? item.net_wgt : "",
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
    getSlipData(
      `api/packingslip/issue/${selectedDepartment.value.split("-")[1]}`
    );
    setSelectedId([]);
  };

  const showModle = () => {
    if (
      props.location.search === "?transferhallmark" &&
      selectedId.length > 0
    ) {
      return (
        <TransferHm
          lot_id={selectedId}
          getData={fetchData}
          from="packingslip"
        />
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

  return (
    <div className="">
      <Paper
        className={clsx(classes.tabroot, "table-responsive packinghallmark_dv")}
      >
        {loading && <Loader />}
        <MaUTable className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableRowPad}></TableCell>
              <TableCell className={classes.tableRowPad}>BarCode</TableCell>
              <TableCell className={classes.tableRowPad}>Purity</TableCell>
              <TableCell className={classes.tableRowPad}>Pieces</TableCell>
              <TableCell className={classes.tableRowPad}>
                Gross Weight
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                Other Weight
              </TableCell>
              <TableCell className={classes.tableRowPad}>Net Weight</TableCell>
              <TableCell className={classes.tableRowPad}>Transit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slipList
              .filter(
                (temp) =>
                  temp.SlipBarCode.toLowerCase().includes(
                    search.toLowerCase()
                  ) ||
                  temp.purity.toLowerCase().includes(search.toLowerCase()) ||
                  temp.phy_pcs.toLowerCase().includes(search.toLowerCase()) ||
                  temp.gross_wgt.toLowerCase().includes(search.toLowerCase()) ||
                  temp.other_wgt.toLowerCase().includes(search.toLowerCase()) ||
                  temp.net_wgt.toLowerCase().includes(search.toLowerCase())
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
                    {displayOut(row.is_transfer)}
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

export default PackingSlipList;
