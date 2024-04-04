import React, {  useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { TextField} from "@material-ui/core";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import Loader from "app/main/Loader/Loader";
import { CSVLink } from "react-csv";
import Select, { createFilter } from "react-select";
import moment from "moment";
import Button from "@material-ui/core/Button";
import ReportListView from './Subviews/ReportListView';
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting"
import handleError from "app/main/ErrorComponent/ErrorComponent";

const useStyles = makeStyles((theme) => ({
  root: {},
  table: {
    minWidth: 650,
  },
}));

const Report = (props) => {

  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();
  const [modalView, setModalView] = useState(0);

  const [allData, setAllData] = useState([]);
  const [goldLooseList, setGoldLooseList] = useState([])
  const [otherLooseList, setOtherLooseList] = useState([])
  const [packingSLipData, setPackingSlipData] = useState([])
  const [packetData, setPacketData] = useState([]);
  const [lotData, setLotData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [downloadData, setDownloadData] = useState([])
  const [deptList, setDeptList] = useState([]);
  const [selectedDept, setSelectedDept] = useState("")
  const [selectedDeptErr, setSelectedDeptErr] = useState("")
  const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"));
  const [selectedDateErr, setSelectedDateErr] = useState("");


  const [loading, setLoading] = useState(true);

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };
  useEffect(() => {
    NavbarSetting('Factory Report', dispatch)
  }, [])

  useEffect(() => {
    getdepartmentlist()
    getStockData(`api/stock?end=${selectedDate}`)
  }, [dispatch]);

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 3000);
    }
  }, [loading]);

  const handleChangeTab = (event, value) => {
    setModalView(value);
  };

  function getStockData(url) {
    setLoading(true)
    axios
      .get(Config.getCommonUrl() + url)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          const tmpAllData = response.data.data;
          let tempData = tmpAllData.map(item => {
            return {
              ...item,
              fineGold: item.flag === 1 && item.item_id === 1 ? parseFloat(parseFloat(item.net_weight) * parseFloat(item.purity) / 100).toFixed(3) : "-",
              pcs: item.flag === 1 && item.item_id === 1 ? "-" : item.pcs
            }
          })
          let allArr = [];
          let goldLooseArr = [];
          let otherLooseArr = [];
          let packingSlipArr = [];
          let packetArr = [];
          let productArr = [];
          let lotData = [];
   

          for (let item of tempData) {
            allArr.push(item)

            if (item.flag === 1) {
              goldLooseArr.push(item)

            } else if (item.flag === 2) {
              otherLooseArr.push(item)

            } else if (item.flag === 3) {
              lotData.push(item)
            } else if (item.flag === 4) {
              productArr.push(item)
            } else if (item.flag === 5) {
              packetArr.push(item)

            } else if (item.flag === 6) {//packing slip data
              packingSlipArr.push(item)

            }
          }

          setAllData(allArr)
          setGoldLooseList(goldLooseArr)
          setOtherLooseList(otherLooseArr)
          setPackingSlipData(packingSlipArr)
          setPacketData(packetArr)
          setProductData(productArr);
          setLotData(lotData);

          setLoading(false)

          let tmpDlData = allArr.map(item => {
            return {
              "Stock Type": item.stockType,
              "Stock Code": item.stock_name_code,
              "Category": item.hasOwnProperty("category_name") ? item.category_name : "",
              "Purity": item.purity,
              "Pieces": item.pcs,
              "Gross Weight": item.gross_weight,
              "Net Weight": item.net_weight,
              "Fine Gold": item.fineGold,
              "Other Wight": item.other_weight,
              // below fields are not needed in csv
              // info: "",//item.element.
              // material_details: item.hasOwnProperty("material_detail") ? item.material_detail : "",
              // previous_process: item.process,
              // last_Performed_V_Num: item.voucher_no,
              // transit: ""
            }
          })

          setDownloadData(tmpDlData)


        } else {
          setLoading(false)
          setAllData([])
          setGoldLooseList([])
          setOtherLooseList([])
          setPackingSlipData([])
          setPacketData([])
          setProductData([]);
          setLotData([]);
          dispatch(
            Actions.showMessage({
              message: response.data.message
            })
          );
        }
      })
      .catch(function (error) {
        setLoading(false)
        setAllData([])
        setGoldLooseList([])
        setOtherLooseList([])
        setPackingSlipData([])
        setPacketData([])
        setProductData([]);
        setLotData([]);

        handleError(error, dispatch, { api: url })

      });
  }

  function getdepartmentlist() {
    axios
      .get(Config.getCommonUrl() + `api/department/common/all`)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          setDeptList(response.data.data)
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message
            })
          );
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, { api: `api/department/common/all` })

      });
  }

  const handleChangeDept = (value) => {
    setSelectedDept(value)
    setSelectedDeptErr("")
  }

  function validateDept() {
    if (selectedDept === "") {
      setSelectedDeptErr("Please select department");
      return false;
    }
    return true;
  }

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    var today = moment().format("YYYY-MM-DD"); 
    if (name === "date") {
      setSelectedDate(value);
      let dateVal = moment(value).format("YYYY-MM-DD"); //new Date(value);
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD");
      if (dateVal <= today && minDateVal < dateVal) {
        setSelectedDateErr("");
      } else {
        setSelectedDateErr("Enter Valid Date");
      }
    }
  }
  function validateDate() {
    if (selectedDate === "") {
      setSelectedDateErr("Please select Date");
      return false;
    }
    return true;
  }

  const setFilter = () => {
    if (validateDept() && validateDate()) {
      const filtreApi = `api/stock?department_id=${selectedDept.value}&end=${selectedDate}`
      getStockData(filtreApi)
    }
  }

  const resetFuncCall = () => {
    if (selectedDept !== "") {
      setSelectedDept("")
      setSelectedDeptErr("")
      setSelectedDate(moment().format("YYYY-MM-DD"))
      setSelectedDateErr("")
      getStockData(`api/stock`)
    }
  }




  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container table-width-mt">
        <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20">
            <Grid
              className="report-fullwidth-title pb-8"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={12} sm={4} md={3} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                <Typography className="pl-28 pt-16 text-18 font-700">
                    Factory Stock
                  </Typography>
                </FuseAnimate>
              </Grid>

              <Grid item xs={12} sm={4} md={9} key="2">
                <Button className="csvbutton"
                disabled={downloadData.length === 0}
                >
                  <CSVLink
                  className="csvbuttontext"
                    data={downloadData}
                    filename={"Factory_" +
                      new Date().getDate() +
                      "_" +
                      (new Date().getMonth() + 1) +
                      "_" +
                      new Date().getFullYear() +
                      ".csv"
                    }
                  >
                    Download
                  </CSVLink>
                </Button>
              </Grid>
              </Grid>

            <div className="main-div-alll">   
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4} md={3} key="2">
                  <label>Select Department</label>
                  <Select
                    className="mt-1"
                    classes={classes}
                    styles={selectStyles}
                    options={deptList.map((dept) => ({
                      value: dept.id,
                      label: dept.name,
                    }))}
                    filterOption={createFilter({ ignoreAccents: false })}
                    value={selectedDept}
                    onChange={handleChangeDept}
                    placeholder="Select Department"
                  />
                  <span style={{ color: "red" }}>
                    {selectedDeptErr.length > 0 ? selectedDeptErr : ""}
                  </span>
                </Grid>

                <Grid item xs={12} sm={4} md={3} key="3">
                <label>Date</label>
                  <TextField
                    placeholder="Date"
                    className="mt-1"
                    autoFocus
                    name="date"
                    type="date"
                    value={selectedDate}
                    error={selectedDateErr.length > 0 ? true : false}
                    helperText={selectedDateErr}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    required
                    fullWidth
                    inputProps={{
                      max: moment().format("YYYY-MM-DD"),
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid style={{ marginTop: "33px" }}>

                  <Button
                    variant="contained"
                    className="filter_reset_button ml-10"
                    size="small"
                    onClick={setFilter}
                  >
                    Filter
                  </Button>

                  <Button
                    variant="contained"
                    className="filter_reset_button ml-10"
                    size="small"
                    onClick={resetFuncCall}
                  >
                    Reset
                  </Button>
                </Grid>
              </Grid>
            
            {loading && <Loader />}

            {/* <Grid className="department-tab-pt department-tab-blg-dv stocklist-tabel-blg" style={{ marginBottom: "8%" }}> */}
              <div className="report_table">
                  <Tabs value={modalView} onChange={handleChangeTab} className="report_table_header">
                    <Tab label="All List" />
                    <Tab label="Loose Metal" />
                    <Tab label="Other Material" />
                    <Tab label="Lot List" />
                    <Tab label="Barcode List" />
                    <Tab label="Packet List" />
                    <Tab label="Packing Slip List" />
                  </Tabs>
                {modalView === 0 && <ReportListView props={props} allData={allData} date={selectedDate} />}
                {modalView === 1 && <ReportListView props={props} allData={goldLooseList} date={selectedDate} />}
                {modalView === 2 && <ReportListView props={props} allData={otherLooseList} date={selectedDate} />}
                {modalView === 3 && <ReportListView props={props} allData={lotData} date={selectedDate} />}
                {modalView === 4 && <ReportListView props={props} allData={productData} date={selectedDate} />}
                {modalView === 5 && <ReportListView props={props} allData={packetData} date={selectedDate} />}
                {modalView === 6 && <ReportListView props={props} allData={packingSLipData} date={selectedDate} />}


              </div>
            {/* </Grid> */}
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
}

export default Report;