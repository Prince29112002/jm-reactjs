import React, { useState, useEffect } from "react";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Icon, IconButton } from "@material-ui/core";
import axios from "axios";
import * as Actions from "app/store/actions";
import Config from "app/fuse-configs/Config";
import { useDispatch } from "react-redux";
import handleError from "app/main/ErrorComponent/ErrorComponent";

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    outline: "none",
  },
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "cornflowerblue",
    color: "white",
  },
  table: {
    minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
  },
}));

const ViewClientVenRateFix = (props) => {

  const [listData, setListData] = useState("");
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading , setLoading] = useState(false);

  useEffect(() => {
    getRateFixEntry()
  }, [dispatch]);


  function getRateFixEntry() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + `api/ratefix/client/vendor/rate/fix?id=${props.voucherId}`)
      .then(function (response) {
        console.log(response);
        if (response.data.success) {
          let fixData = response.data.data;
          setListData(fixData);
        }else {
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          }
        setLoading(false);
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch,{api : `api/ratefix/client/vendor/rate/fix?id=${props.voucherId}`})
      });
  }
  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0">
            <div className="m-16 mt-10">
              <Paper className={clsx(classes.tabroot, "table-responsive ratefix_tabel_dv ratefix_tabel_dv-blg view_ratefix_tabel_dv-blg")}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        className={classes.tableRowPad}
                        align="left"
                      >
                        Date
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Voucher No
                      </TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        align="left"
                      >
                        Firm Name
                      </TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        align="left"
                      >
                         Name
                      </TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        align="left"
                      >
                        Balance
                      </TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        align="left"
                      >
                        Weight
                      </TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        align="left"
                      >
                        Rate
                      </TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        align="left"
                      >
                        Total
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listData !== "" ? 
                        <TableRow>
                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                          >
                            {/* {listData.date} */}

                            {listData.date}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            {listData.voucher_no}
                          </TableCell>
                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                          >
                            {listData.Compnyname 
                              ? listData.Compnyname.company_name
                              : "-"}
                          </TableCell>
                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                          >
                            {listData.Clientname ? listData.Clientname.name : listData.Vendorname ? listData.Vendorname.name : "-"}
                          </TableCell>
                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                          >
                            {listData.balance ? parseFloat(listData.balance).toFixed(3) : parseFloat(listData.weight).toFixed(3)}
                          </TableCell>
                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                          >
                            {parseFloat(listData.weight).toFixed(3)}
                          </TableCell>

                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                          >
                            {Config.numWithComma(listData.rate)}
                          </TableCell>

                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                          >
                            {Config.numWithComma(listData.amount)}
                          </TableCell>
                        </TableRow>
                      : <TableRow><TableCell colSpan="9" style={{ textAlign: "center", color: "red" }}><b>No Data Available</b></TableCell></TableRow>}
                  </TableBody>
                </Table>
              </Paper>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default ViewClientVenRateFix;
