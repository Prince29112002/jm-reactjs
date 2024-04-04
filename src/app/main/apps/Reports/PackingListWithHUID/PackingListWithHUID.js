import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Select, { createFilter } from "react-select";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import * as XLSX from "xlsx";
import Loader from "app/main/Loader/Loader";

const useStyles = makeStyles((theme) => ({
  root: {},
  table: {
    // minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
    fontSize: "1.2rem",
  },
  leftBorder: {
    borderLeft: "1px solid darkgray",
  },
  hoverClass: {
    // backgroundColor: "#fff",
    color: "#1e90ff",
    "&:hover": {
      // backgroundColor: "#999",
      cursor: "pointer",
    },
  },
}));

const PackingListWithHUID = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [partyName, setPartyName] = useState([]);
  const [selectedPartyName, setSelectedPartyName] = useState("");
  const [selectedPartyNameErr, setSelectedPartyNameErr] = useState("");

  const [packingData, setPackingData] = useState([]);
  const [selectedPacking, setSelectedPacking] = useState("");
  const [selectedPackingErr, setSelectedPackingErr] = useState("");

  const [apiData, setApiData] = useState([]);
  const [resultData, setResultData] = useState([]);
  const [totalData, setTotalData] = useState([]);
  const [noOfPacket, setNoOfPacket] = useState();
  useEffect(() => {
    NavbarSetting("Factory Report", dispatch);
  }, []);

  useEffect(() => {
    getpartyName();
  }, [dispatch]);

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };
  function handlePartyChage(value) {
    setSelectedPartyName(value);
    setSelectedPartyNameErr("");
    setPackingData([]);
    setSelectedPacking("");
    setSelectedPackingErr("");
    setApiData([]);
    setTotalData([]);
    setResultData([]);
    setNoOfPacket("");
    getpackingData(value.value);
  }

  function handleChangeState(value) {
    setSelectedPacking(value);
    setSelectedPackingErr("");
  }

  const exportToExcel = (type, fn, dl) => {
    if (packingData.length > 0) {
      const wb = XLSX.utils.book_new();

      // Export the first table
      const tbl1 = document.getElementById("tbl_exporttable_to_xls");
      const ws1 = XLSX.utils.table_to_sheet(tbl1);
      XLSX.utils.book_append_sheet(wb, ws1, "Table 1");

      // Export the second table
      const tbl2 = document.getElementById("tbl_exporttable_to_xls2");
      const ws2 = XLSX.utils.table_to_sheet(tbl2);
      XLSX.utils.book_append_sheet(wb, ws2, "Table 2");

      return dl
        ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
        : XLSX.writeFile(wb, fn || `Packet_list_with_HUID.${type || "xlsx"}`);
    } else {
      // console.log("else")
      dispatch(Actions.showMessage({ message: "Can not Export Empty Data", variant: "error"}));
    }
  };
  function countryValidation() {
    if (selectedPartyName === "") {
      setSelectedPartyNameErr("Please Select Party Name");
      return false;
    }
    return true;
  }
  function stateValidation() {
    if (selectedPacking === "") {
      setSelectedPackingErr("Please Select Packing No");
      return false;
    }
    return true;
  }
  function getpartyName() {
    axios
      .get(Config.getCommonUrl() + "api/client")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setPartyName(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message, variant: "error"}));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/country" });
      });
  }

  function getpackingData(client_id) {
    axios
      .get(
        Config.getCommonUrl() +
          "api/packingslip/packingslip/list/client/" +
          client_id
      )
      .then(function (response) {
        if (response.data.success === true) {
          setPackingData(response.data.data);

          let data = response.data.data;
          const selectClientArr = [];
          data.map((optn) => {
            selectClientArr.push(optn.value);
          });
          const selectClient = [];
          data.map((item) => {
            if (selectClientArr.includes(item.id)) {
              selectClient.push({
                value: item.id,
                label: item.name,
              });
            }
          });
          setSelectedPacking(selectClient);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message, variant: "error"}));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/packingslip/packingslip/list/client/" + client_id,
        });
      });
  }

  function setFilters() {
    if (countryValidation() && stateValidation()) {
      setLoading(true);
      const packingId = selectedPacking.map((x) => {
        return x.label;
      });
      const body = {
        barcode: packingId,
      };
      axios
        .post(
          Config.getCommonUrl() + "api/packingslip/listwise/huid/report",
          body
        )
        .then(function (response) {
          console.log(response.data.data);
          if (response.data.success === true) {
            setLoading(false);
            const packinArr = [];
            response.data.data.lotDetailsData.map((e) => {
              e.lotDetails.map((item, index) => {
                packinArr.push(item);
              });
            });
            setNoOfPacket(response.data.data.lotDetailsData.length);
            setApiData(packinArr);
            setResultData(response.data.data.result);
            setTotalData(response.data.data.grandTotal);
            dispatch(Actions.showMessage({ message: response.data.message, variant: "success"}));
          } else {
            setLoading(false);
            dispatch(Actions.showMessage({ message: response.data.message, variant: "error"}));
          }
        })
        .catch(function (error) {
          setLoading(false);
          handleError(error, dispatch, {
            api: "api/packingslip/listwise/huid/report/",
            body,
          });
        });
    }
  }

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
        <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20">
            <Grid
              className="jewellerypreturn-main pb-16"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                key="1"
                style={{ padding: 0 }}
                // className="metal-purchase-input-ml"
              >
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    Packing List With HUID{" "}
                  </Typography>
                </FuseAnimate>
                {/* <BreadcrumbsHelper /> */}
              </Grid>
            </Grid>
            {loading && <Loader />}
            <div className="main-div-alll">

            <Grid
              // className="metalled-statement-pr"
              container
              // spacing={3}
              // style={{ padding: 20 }}
            >
              <Grid item lg={3} md={4} sm={6} xs={12} style={{ padding: 5 }}>
                <p style={{ paddingBottom: "3px" }}>Select party name</p>
                <Select
                  filterOption={createFilter({ ignoreAccents: false })}
                  classes={classes}
                  styles={selectStyles}
                  options={partyName.map((suggestion) => ({
                    value: suggestion.id,
                    label: suggestion.name,
                  }))}
                  // components={components}
                  value={selectedPartyName}
                  onChange={handlePartyChage}
                  placeholder="Select party name"
                />

                <span style={{ color: "red" }}>
                  {selectedPartyNameErr.length > 0 ? selectedPartyNameErr : ""}
                </span>
              </Grid>

              <Grid item lg={3} md={4} sm={6} xs={12} style={{ padding: 5 }}>
                <p style={{ paddingBottom: "3px" }}>Select packing no</p>
                <Select
                  filterOption={createFilter({ ignoreAccents: false })}
                  classes={classes}
                  styles={selectStyles}
                  options={packingData.map((suggestion) => ({
                    value: suggestion.BarCodePackingSlip.id,
                    label: suggestion.BarCodePackingSlip.barcode,
                  }))}
                  // components={components}
                  value={selectedPacking}
                  onChange={handleChangeState}
                  placeholder="Packing No"
                  isMulti
                />

                <span style={{ color: "red" }}>
                  {selectedPackingErr.length > 0 ? selectedPackingErr : ""}
                </span>
              </Grid>

              <Grid className="mt-28" item lg={3} md={4} sm={12} xs={12}>
                <Button
                  className="report-btn ml-5"
                  variant="contained"
                  color="primary"
                  aria-label="Register"
                  onClick={(event) => {
                    setFilters();
                  }}
                >
                  Load Data
                </Button>
                 <Button
                  className="report-btn ml-5"
                  variant="contained"
                  color="primary"
                  aria-label="Register"
                  onClick={(event) => {
                    exportToExcel("xlsx");
                  }}
                >
                  Export
                </Button>
              </Grid>

             
            </Grid>

            <div className="mt-20 mb-16 metalled_statements_blg metalled_statements_table">
              <Table aria-label="simple table" id="tbl_exporttable_to_xls">
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.tableRowPad} align="left">
                      SR_NO
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                    Packing Slip No
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      BARCODE
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      Packet Category
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      Design No
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      GR_WT
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      NT_WT
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      HUID
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      HM_CHARGES
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {apiData.map((element, index) => (
                    <TableRow key={index}>
                      <TableCell className={classes.tableRowPad} align="left">
                        {index + 1}
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        {element?.packing_slip_no}
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        {element?.BarCodeProduct?.barcode}
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        {element?.ProductCategory?.billing_category_name}
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                      {element?.DesignInfo?.variant_number}
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        {element?.gross_wgt}
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        {element?.net_wgt}
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        {element?.huid}
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        {element?.total_hallmark_charges}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Table
                aria-label="simple table"
                id="tbl_exporttable_to_xls2"
                className="mt-60"
              >
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.tableRowPad} align="left">
                      Packat name
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      KT
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      Pcs
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      NO. OF PKT
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      Gross Weight
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      Net Weight
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {resultData.map((e, index) => (
                    <TableRow key={index}>
                      <TableCell className={classes.tableRowPad} align="left">
                        {e.productCategory.category_name}
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        {e.purity}
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        {e.total_pcs}
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        {noOfPacket}
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        {e.gross_wgt}
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        {e.net_wgt}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell
                      className={classes.tableRowPad}
                      align="left"
                      colSpan={2}
                    >
                      <b>Total</b>
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                    <b>{totalData.total_pcs}</b>
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                    <b>{noOfPacket}</b>
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                    <b>{totalData.total_gross_wgt}</b>
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                    <b>{totalData.total_net_wgt}</b>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default PackingListWithHUID;
