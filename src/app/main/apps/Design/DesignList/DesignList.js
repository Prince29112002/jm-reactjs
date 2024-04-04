import React, { useState, useEffect, useRef } from "react";
import {
  Typography,
  Icon,
  IconButton,
  TextField,
  Checkbox,
  Switch,
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import BreadcrumbsHelper from "../../../BreadCrubms/BreadcrumbsHelper";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import axios from "axios";
import Config from "app/fuse-configs/Config";
// import * as authActions from "app/auth/store/actions";
import * as Actions from "app/store/actions";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import FileUpload from "./SubViews/FileUpload";
import ImageUpload from "./SubViews/ImageUpload";
import DisplayImage from "./SubViews/DisplayImage";
import Select, { createFilter } from "react-select";
// import { Link } from "react-router-dom";
import Loader from "../../../Loader/Loader";
import History from "@history";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
// import CollectionVariantWise from "./SubViews/CollectionVariantWise";
// import CollectionSizeWise from "./SubViews/CollectionSizeWise";
import InfiniteScroll from "react-infinite-scroll-component";
import { CSVLink } from "react-csv";
import Threeswitch from "./SubViews/Threeswitch";

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
  searchBox: {
    padding: 6,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
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

const DesignList = ( props ) => {
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [designList, setDesignList] = useState([]);
  const [image, setImage] = useState("");
  const [PendingDesign, setPendingDesign] = useState("");
  const [searchData, setSearchData] = useState({
    variant_number: "",
    cad_number: "",
    setting_method: "",
    category_code: "",
    size: "",
    manual_show_in_app: "",
    show_in_app: "",
    is_new: "",
    stone_pcs: "",
    mold_pcs: "",
    finding_volume: "",
    net_wgt: "",
    gross_wgt: "",
    total_mold: "",
    pageNumber: 1,
    pageSize: 50,
  });
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState([]);
  const [modalView, setModalView] = useState("");
  const [viewManualStatus, setViewManualStatus] = useState("");
  const [viewManualStatusId, setViewManualStatusId] = useState("");
  const [viewStatus, setViewStatus] = useState("");
  const [viewStatusId, setViewStatusId] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [newStatusId, setNewStatusId] = useState("");
  const [checkAll, setCheckAll] = useState(false);
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();

  const [totalDesigns, setTotalDesigns] = useState(0);
  const [totalShowInApp, setTotalShowInApp] = useState(0);
  const [totalManualShowInApp, setTotalManualShowInApp] = useState(0);
  const [totalNewDesigns, setTotalNewDesigns] = useState(0);
  const [totalDesignCategory, setTotalDesignCategory] = useState(0);

  const [switchPositionOne, setSwitchPositionOne] = useState("center");
  const [animationOne, setAnimationOne] = useState(null);

  const [switchPositionTwo, setSwitchPositionTwo] = useState("center");
  const [animationTwo, setAnimationTwo] = useState(null);

  const [switchPositionThree, setSwitchPositionThree] = useState("center");
  const [animationThree, setAnimationThree] = useState(null);

  const perPageArr = [
    { value: 50, label: 50 },
    { value: 100, label: 100 },
    { value: 150, label: 150 },
    { value: 500, label: 500 },
  ];
  const [selectedPerPage, setSelectedPerPage] = useState({
    value: 50,
    label: 50,
  });
  const [sliderImgArr, setSliderImgArr] = useState([]);

  const roleOfUser = localStorage.getItem("permission")
  ? JSON.parse(localStorage.getItem("permission"))
  : null;
  const [authAccessArr, setAuthAccessArr] = useState([]);


  useEffect(() => {
    let arr = roleOfUser
        ? roleOfUser["Variant Master"]["Design List"]
          ? roleOfUser["Variant Master"]["Design List"]
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
    getTotalValueApi();
  }, []);

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };

  const checkData = (key, value) => {
    let switchVal = "";

    if (value === "center") {
      switchVal = null;
    } else if (value === "left") {
      switchVal = 0;
    } else if (value === "right") {
      switchVal = 1;
    }

    setSearchData((prevState) => ({
      ...prevState,
      [key]: switchVal,
      pageNumber: 1,
    }));
    setPage(1);
    setDesignList([]);
  };

  useEffect(() => {
    if (animationOne && switchPositionOne) {
      checkData("manual_show_in_app", switchPositionOne);
    }
  }, [switchPositionOne]);

  useEffect(() => {
    if (switchPositionTwo && animationTwo) {
      checkData("show_in_app", switchPositionTwo);
    }
  }, [switchPositionTwo]);

  useEffect(() => {
    if (animationThree && switchPositionThree) {
      checkData("is_new", switchPositionThree);
    }
  }, [switchPositionThree]);

  function editHandler(id) {
    History.push("/dashboard/design/editdesign", {
      id: id,
      isEdit: true,
      isView: false,
    });
  }

  function viewHandler(id) {
    History.push("/dashboard/design/editdesign", {
      id: id,
      isEdit: false,
      isView: true,
    });
  }

  function changeView(id) {
    if (id === 6) {
      History.push("/dashboard/design/collectionvarinatwise");
    } else if (id === 7) {
      History.push("/dashboard/design/collectionsizewise");
    } else if (id === 4 && selectedId.length > 0) {
      callExportFileApi();
    } else {
      setModalView(id);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      getAllDesignList();
    }, 800);
    return () => {
      clearTimeout(timeout);
    };
  }, [searchData]);

  useEffect(() => {
    if (viewManualStatusId) {
      callUpdateManualStatusApi();
    }
  }, [viewManualStatus]);

  useEffect(() => {
    if (viewStatusId) {
      callUpdateStatusApi();
    }
  }, [viewStatus]);

  useEffect(() => {
    if (newStatusId) {
      callUpdateNewStatusApi();
    }
  }, [newStatus]);

  useEffect(() => {
    NavbarSetting("Design", dispatch);
  }, []);

  function callUpdateManualStatusApi() {
    axios
      .put(
        Config.getCommonUrl() +
          `api/design/variant/manualSwitch/show/${viewManualStatusId}/${viewManualStatus}`
      )
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          let index = designList.findIndex(
            (item) => item.id === viewManualStatusId
          );
          console.log("index", index);

          if (index > -1) {
            let tempDesignData = [...designList];
            tempDesignData[index].manual_show_in_app = viewManualStatus;
            setDesignList(tempDesignData);
            setViewManualStatusId("");
            setViewManualStatus("");
          }
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
          setViewManualStatusId("");
          setViewManualStatus("");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        handleError(error, dispatch, {
          api: `api/design/variant/manualSwitch/show/${viewManualStatusId}/${viewManualStatus}`,
        });
      });
  }

  function callUpdateStatusApi() {
    axios
      .put(
        Config.getCommonUrl() +
          `api/design/variant/show/${viewStatusId}/${viewStatus}`
      )
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          let index = designList.findIndex((item) => item.id === viewStatusId);
          console.log("index", index);
          if (index > -1) {
            let tempDesignData = [...designList];
            tempDesignData[index].show_in_app = viewStatus;
            setDesignList(tempDesignData);
            setViewStatusId("");
            setViewStatus("");
          }
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
          setViewStatusId("");
          setViewStatus("");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        handleError(error, dispatch, {
          api: `api/design/variant/show/${viewStatusId}/${viewStatus}`,
        });
      });
  }

  function callUpdateNewStatusApi() {
    axios
      .put(
        Config.getCommonUrl() +
          `api/design/variant/isnew/${newStatusId}/${newStatus}`
      )
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          let index = designList.findIndex((item) => item.id === newStatusId);
          console.log("index", index);
          if (index > -1) {
            let tempDesignData = [...designList];
            tempDesignData[index].is_new = newStatus;
            setDesignList(tempDesignData);
            setNewStatusId("");
            setNewStatus("");
          }
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
          setNewStatusId("");
          setNewStatus("");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        handleError(error, dispatch, {
          api: `api/design/variant/isnew/${newStatusId}/${newStatus}`,
        });
      });
  }

  const getTotalValueApi = () => {
    axios
      .post(Config.getCommonUrl() + `api/design/designcount`)
      .then(function (response) {
        if (response.data.success === true) {
          const dataArr = response.data.data;
          setTotalDesigns(dataArr.TotalDesigns);
          setTotalShowInApp(dataArr.TotalShowInApp);
          setTotalManualShowInApp(dataArr.TotalManualShowInApp);
          setTotalNewDesigns(dataArr.TotalNewDesign);
          setTotalDesignCategory(dataArr.TotalDesignCategory);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {
          api: `api/design/designcount`,
        });
      });
  };

  const fetchData = () => {
    console.log("fetch", page);
    setPage(page + 1);
    setSearchData((prevState) => ({
      ...prevState,
      pageNumber: page + 1,
    }));
  };

  async function getAllDesignList(num) {
    const pageNum = num ? num : searchData.pageNumber;
    setLoading(true);
    axios
      .post(
        Config.getCommonUrl() + `api/design/multisearch/${pageNum}`,
        searchData
      )
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          const tempData = response.data.design;
          const countData = response.data.count;
          const imgArrs = [];
          const finalData = tempData.map((item) => {
            imgArrs.push(
              item.image_files.length > 0
                ? item.image_files[0].image_file
                : Config.getvkjLogo()
            );
            return {
              ...item,
              cad_number: item.CadNumber ? item.CadNumber.cad_number : "-",
              image_file_url:
                item.image_files.length > 0
                  ? item.image_files[0].image_file
                  : Config.getvkjLogo(),
              variant_number: item.variant_number ? item.variant_number : "-",
              category_name: item.Category ? item.Category.category_name : "-",
              setting_method: item.SettingMethod
                ? item.SettingMethod.method
                : "-",
              size: item.size ? item.size : "-",
              // finding_volume: item.design_findings.length > 0 ? item.design_findings.reduce((a, b) => +a + +b.finding_pcs, 0).toString() : "-",
              // mold_pcs: item.design_molds.length > 0 ? item.design_molds.reduce((a, b) => +a + +b.mold_pcs, 0).toString() : "-",
              // stone_pcs: item.design_molds.length > 0 ? addStone(item) : '-',
              mold_pieces: item.mold_pieces,
              no_of_stone: item.no_of_stone,
              finding_pieces:
                item.finding_pieces == 0 ? "-" : item.finding_pieces,
              show_in_app: item.show_in_app,
              manual_show_in_app: item.manual_show_in_app,
              is_new: item.is_new,
              gross_weight:
                item.design_weights.length > 0
                  ? item.design_weights[0].gross_weight
                  : "-",
              net_weight:
                item.design_weights.length > 0
                  ? item.design_weights[0].net_weight
                  : "-",
              total_mold_volume: item.total_mold ? item.total_mold : "-",
            };
          });
          {
            console.log(imgArrs.length);
          }
          setSliderImgArr(imgArrs);
          setTotalRecords(countData);
          if (searchData.pageNumber === 1) {
            setDesignList(finalData);
          } else {
            setDesignList([...designList, ...finalData]);
          }
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        handleError(error, dispatch, {
          api: `api/design/multisearch/${pageNum}`,
          data: searchData,
        });
      });
  }

  const handleChangeToggleManual = (event, id) => {
    const status = event.target.checked;
    console.log(status);
    if (status) {
      setViewManualStatus(1);
      setViewManualStatusId(id);
    } else {
      setViewManualStatus(0);
      setViewManualStatusId(id);
    }
  };

  const handleChangeToggle = (event, id) => {
    const status = event.target.checked;
    if (status) {
      setViewStatus(1);
      setViewStatusId(id);
    } else if (!status) {
      setViewStatus(0);
      setViewStatusId(id);
    }
  };

  const handleChangeToggleNew = (event, id) => {
    const status = event.target.checked;
    if (status) {
      setNewStatus(1);
      setNewStatusId(id);
    } else if (!status) {
      setNewStatus(0);
      setNewStatusId(id);
    }
  };

  function callExportFileApi() {
    setLoading(true);
    const body = {
      design_id: selectedId,
    };
    axios
      .post(Config.getCommonUrl() + "api/design/csv", body)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          let downloadUrl = response.data.url;
          window.open(downloadUrl);
          setModalView("");
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        handleError(error, dispatch, { api: "api/design/csv" });
      });
  }

  const handleSearchData = (event) => {
    console.log(event.target.value, event.target.name);
    const name = event.target.name;
    const value = event.target.value;

    setSearchData((prevState) => ({
      ...prevState,
      [name]: value,
      pageNumber: 1,
    }));
    setPage(1);
    setDesignList([]);
  };

  const ButtonArr = [
    {
      id: 1,
      text: "Upload New Variants",
      isAccess: authAccessArr.includes("Upload New Variants"),
    },
    {
      id: 2,
      text: "Upload Images",
      isAccess: authAccessArr.includes("Upload Images"),
    },
    {
      id: 5,
      text: "Update Design",
      isAccess: authAccessArr.includes("Update Design"),
    },
    { id: 4, text: "Export", isAccess: authAccessArr.includes("Export") },
    {
      id: 6,
      text: "Design Combination",
      isAccess: authAccessArr.includes("Design Combination"),
    },
    {
      id: 7,
      text: "Size Combination",
      isAccess: authAccessArr.includes("Size Combination"),
    },
  ];

  const handleClose = () => {
    setModalView("");
    getAllDesignList(1);
  };

  const handleCloseImage = () => {
    setModalView("");
  };

  const handleChecked = (e, i, id) => {
    const newSelection = id;
    setCheckAll(false);
    if (e.target.checked) {
      const dataArr = [...designList];
      dataArr[i]["checked"] = true;
      setDesignList(dataArr);
    } else {
      const dataArr = [...designList];
      dataArr[i]["checked"] = false;
      setDesignList(dataArr);
    }

    let newSelectionArrayId;
    if (selectedId.indexOf(newSelection) > -1) {
      newSelectionArrayId = selectedId.filter((s) => s !== newSelection);
    } else {
      newSelectionArrayId = [...selectedId, newSelection];
    }
    setSelectedId(newSelectionArrayId);
  };

  const handleCheckedAll = (e) => {
    setCheckAll(e.target.checked);
    if (e.target.checked) {
      const allId = [];
      const dataArr = [...designList];

      const arr = dataArr.map((item) => {
        allId.push(item.id);
        return {
          ...item,
          checked: true,
        };
      });
      setSelectedId(allId);
      setDesignList(arr);
    } else {
      const dataArr = [...designList];
      const arr = dataArr.map((item) => {
        return {
          ...item,
          checked: false,
        };
      });
      setDesignList(arr);
      setSelectedId([]);
    }
  };

  function designUploadPendingData() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + "api/design/error/csv")
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          let downloadUrl = res.data.url;
          window.open(downloadUrl);
          // pendingDesign(temp)
        } else {
          dispatch(Actions.showMessage({ message: res.data.message }));
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {
          api: "api/design/error/csv",
        });
      });
  }

  function pendingDesign(temp) {
    let tempData = temp.map((item) => {
      return {
        Id: item.id,
        "Variant Number": item.variant_number,
        "Image Files": item.image_files[0]?.image_file,
        "Design Id": item.image_files[0]?.design_id,
      };
    });
    setPendingDesign(tempData);
  }

  const handlePerpageChange = (value) => {
    setPage(1);
    setDesignList([]);
    setSelectedPerPage(value);
    setSearchData((prevState) => ({
      ...prevState,
      pageNumber: 1,
      pageSize: value.value,
    }));
  };

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0">
            {/* <Grid
                  container
                  spacing={4}
                  alignItems="stretch"
                  style={{ margin: 0 }}
                >
                  <Grid item xs={12} sm={4} md={3} key="1" style={{ padding: 0 }}>
                    <FuseAnimate delay={300}>
                      <Typography className="p-16 pb-8 text-18 font-700">
                        Design List
                      </Typography>
                    </FuseAnimate>
                    <BreadcrumbsHelper />
                  </Grid>
                </Grid> */}
            <Grid
              className="design-nav-width"
              container
              spacing={4}
              alignItems="center"
              style={{ margin: 0 }}
            >
              <Grid item xs={12} sm={10} md={12} key="1">
                <Grid container alignItems="center">
                  <Grid item xs={12} lg={2} style={{ marginBottom: "10px" }}>
                    <FuseAnimate delay={300}>
                      <Typography className="p-16 pb-8 text-18 font-700">
                        Design List
                      </Typography>
                    </FuseAnimate>
                    {/* <BreadcrumbsHelper /> */}
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    lg={4}
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography>
                      <b>Total Design :</b> {totalDesigns}
                    </Typography>
                    <Typography>
                      <b>Total New Designs :</b> {totalNewDesigns}
                    </Typography>
                    <Typography>
                      <b>Total ShowInApp :</b> {totalShowInApp}
                    </Typography>
                    <Typography>
                      <b>Total Manual ShowInApp :</b> {totalManualShowInApp}
                    </Typography>
                    <Typography>
                      <b>Total DesignCategory :</b> {totalDesignCategory}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    lg={6}
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                      justifyContent: "flex-end",
                    }}
                  >
                     {ButtonArr.map((btndata, idx) => (
                    <Button
                      variant="contained"
                      className={classes.button}
                      size="small"
                      key={idx}
                      onClick={(event) => changeView(btndata.id)}
                    >
                      {btndata.text}
                    </Button>
                  ))}
                    {authAccessArr.includes("Design Upload Pending List") && (
                      <Button
                        variant="contained"
                        className={classes.button}
                        size="small"
                        onClick={() => designUploadPendingData()}
                      >
                        Design Upload Pending List
                      </Button>
                    )}
                    <Select
                      classes={classes}
                      styles={selectStyles}
                      options={perPageArr}
                      filterOption={createFilter({
                        ignoreAccents: false,
                      })}
                      value={selectedPerPage}
                      onChange={handlePerpageChange}
                      placeholder="Per Page"
                      className={classes.selectPerPage}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            {loading && <Loader />}
            <div>
              {modalView === 1 && (
                <FileUpload
                  modalColsed={handleClose}
                  moldalheaderClose={handleCloseImage}
                  btn={modalView}
                  setPage={setPage}
                />
              )}
              {modalView === 5 && (
                <FileUpload
                  modalColsed={handleClose}
                  moldalheaderClose={handleCloseImage}
                  btn={modalView}
                  setPage={setPage}
                />
              )}
              {modalView === 2 && (
                <ImageUpload
                  modalColsed={handleClose}
                  moldalheaderClose={handleCloseImage}
                />
              )}
              
              {modalView === 3 && (
                <DisplayImage
                  modalColsed={handleCloseImage}
                  image={sliderImgArr}
                  from="list"
                  index={image}
                  data={designList}
                />
              )}
              {/* {modalView === 6 &&                
                <CollectionVariantWise modalColsed={handleClose} moldalheaderClose={handleCloseImage} />
              }
              {modalView === 7 &&
                <CollectionSizeWise modalColsed={handleClose} moldalheaderClose={handleCloseImage} btn={modalView} />                
              } */}
            </div>
            <div className="mt-16 design_list_tbl">
              <Paper
                className={clsx(
                  classes.tabroot,
                  "table-responsive design_list_blg view_design_list_blg Scroll"
                )}
                id="ScrollTable"
              >
                <InfiniteScroll
                  dataLength={designList.length}
                  next={fetchData}
                  hasMore={designList.length != totalRecords}
                  loader={<h4>Loading...</h4>}
                  scrollableTarget="ScrollTable"
                >
                  <MaUTable className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ width: "80px" }}
                        >
                          <Checkbox
                            name="selectdesign"
                            onChange={handleCheckedAll}
                            checked={checkAll}
                          />
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          CAD Number
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Image
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Design/Variant Number
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Category
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ width: "100px" }}
                        >
                          Setting Method
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ width: "80px" }}
                        >
                          Size
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          22K GW
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          22K NW
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ width: "80px" }}
                        >
                          Mold Volume
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ width: "80px" }}
                        >
                          Mold Pieces
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ width: "80px" }}
                        >
                          No of Stone
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          22K Finding
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ width: "80px" }}
                        >
                          Manually Display in App
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ width: "80px" }}
                        >
                          Display in App
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ width: "100px" }}
                        >
                          Is New
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ width: "80px" }}
                        >
                          Action
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ width: "80px" }}
                        ></TableCell>
                        <TableCell className={classes.tableRowPad}>
                          <TextField
                            placeholder="CAD Number"
                            name="cad_number"
                            onChange={handleSearchData}
                          />
                        </TableCell>
                        <TableCell className={classes.tableRowPad}></TableCell>
                        <TableCell className={classes.tableRowPad}>
                          <TextField
                            placeholder="Design/Variant No"
                            name="variant_number"
                            onChange={handleSearchData}
                          />
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          <TextField
                            placeholder="Category"
                            name="category_code"
                            onChange={handleSearchData}
                          />
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ width: "100px" }}
                        >
                          <TextField
                            placeholder="Setting Method"
                            name="setting_method"
                            onChange={handleSearchData}
                          />
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ width: "80px" }}
                        >
                          <TextField
                            placeholder="Size"
                            name="size"
                            onChange={handleSearchData}
                          />
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          <TextField
                            placeholder="22K GW"
                            name="gross_wgt"
                            onChange={handleSearchData}
                          />
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          <TextField
                            placeholder="22k NW"
                            name="net_wgt"
                            onChange={handleSearchData}
                          />
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ width: "80px" }}
                        >
                          <TextField
                            placeholder="Mold Volume"
                            name="total_mold"
                            onChange={handleSearchData}
                          />
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ width: "80px" }}
                        >
                          <TextField
                            placeholder="Mold Pieces"
                            name="mold_pcs"
                            onChange={handleSearchData}
                          />
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ width: "80px" }}
                        >
                          <TextField
                            placeholder="No of Stone"
                            name="stone_pcs"
                            onChange={handleSearchData}
                          />
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          <TextField
                            placeholder="22K Finding"
                            name="finding_volume"
                            onChange={handleSearchData}
                          />
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ width: "60px" }}
                        >
                          <Threeswitch
                            id={1}
                            switchPosition={switchPositionOne}
                            setSwitchPosition={setSwitchPositionOne}
                            animation={animationOne}
                            setAnimation={setAnimationOne}
                          />
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ width: "60px" }}
                        >
                          <Threeswitch
                            id={2}
                            switchPosition={switchPositionTwo}
                            setSwitchPosition={setSwitchPositionTwo}
                            animation={animationTwo}
                            setAnimation={setAnimationTwo}
                          />
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ width: "60px" }}
                        >
                          <Threeswitch
                            id={3}
                            switchPosition={switchPositionThree}
                            setSwitchPosition={setSwitchPositionThree}
                            animation={animationThree}
                            setAnimation={setAnimationThree}
                          />
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ width: "60px" }}
                        ></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {designList.map((row, i) => {
                        console.log(i);
                        return (
                          <TableRow key={i}>
                            <TableCell
                              className={classes.tableRowPad}
                              style={{ width: "80px" }}
                            >
                              <Checkbox
                                name="selectdesign"
                                onChange={(e) => handleChecked(e, i, row.id)}
                                // checked={selectedId.includes(row.id.toString()) ? true : false}
                                checked={row.checked ? true : false}
                              />
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row?.cad_number}
                            </TableCell>
                            <TableCell
                              className={clsx(
                                classes.tableRowPad,
                                classes.hoverClass
                              )}
                              style={{ width: "100px", textAlign: "center" }}
                            >
                              <img
                                src={row?.image_file_url}
                                height={50}
                                width="auto"
                                onClick={() => {
                                  setModalView(3);
                                  setImage(i);
                                }}
                                alt="img"
                              />
                            </TableCell>
                            <TableCell
                              className={clsx(
                                classes.tableRowPad,
                                classes.hoverClass
                              )}
                            >
                              {/* <Link
                                to={{     
                                  pathname: '/dashboard/design/editdesign',
                                  state: {id : row.id}
                                  }}
                              style={{ textDecoration: "none", color: "inherit" }}
                              state={{ id: row.id}}
                              >   */}
                              <span
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  ev.stopPropagation();
                                  viewHandler(row.variant_number);
                                }}
                              >
                                {" "}
                                {row?.variant_number}
                              </span>
                              {/* </Link> */}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row?.category_name}
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              style={{ width: "100px", textAlign: "center" }}
                            >
                              {row?.setting_method}
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              style={{ width: "80px", textAlign: "center" }}
                            >
                              {row?.size}
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              style={{ textAlign: "center" }}
                            >
                              {row?.gross_weight}
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              style={{ textAlign: "center" }}
                            >
                              {row?.net_weight}
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              style={{ width: "100px", textAlign: "center" }}
                            >
                              {row?.total_mold_volume}
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              style={{ width: "10px", textAlign: "center" }}
                            >
                              {row?.mold_pieces}
                            </TableCell>

                            <TableCell
                              className={classes.tableRowPad}
                              style={{ width: "100px", textAlign: "center" }}
                            >
                              {row?.no_of_stone}
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              style={{ textAlign: "center" }}
                            >
                              {row?.finding_pieces}
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              style={{ width: "80px" }}
                            >
                              {/* {row. manual_show_in_app} */}
                              <Switch
                                checked={
                                  row.manual_show_in_app === 1 ? true : false
                                }
                                onChange={(e) =>
                                  handleChangeToggleManual(e, row.id)
                                }
                              />
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              style={{ width: "80px" }}
                            >
                              {/* {row.show_in_app} */}
                              <Switch
                                checked={row.show_in_app === 1 ? true : false}
                                disabled
                                onChange={(e) => handleChangeToggle(e, row.id)}
                              />
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              style={{ width: "80px" }}
                            >
                              {/* {row.isnew} */}
                              <Switch
                                checked={row.is_new === 1 ? true : false}
                                onChange={(e) =>
                                  handleChangeToggleNew(e, row.id)
                                }
                              />
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              style={{ width: "80px", textAlign: "center" }}
                            >
                              {authAccessArr.includes("View Design List") && (
                                <IconButton
                                  style={{ padding: "0" }}
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    ev.stopPropagation();
                                    viewHandler(row.variant_number);
                                  }}
                                >
                                  <Icon
                                    className="mr-8"
                                    style={{ color: "dodgerblue" }}
                                  >
                                    visibility
                                  </Icon>
                                </IconButton>
                              )}
                              {authAccessArr.includes(
                                "Edit Variant Master"
                              ) && (
                                <IconButton
                                  style={{ padding: "0" }}
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    ev.stopPropagation();
                                    editHandler(row.variant_number);
                                  }}
                                >
                                  <Icon
                                    className="mr-8"
                                    style={{ color: "dodgerblue" }}
                                  >
                                    edit
                                  </Icon>
                                </IconButton>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </MaUTable>
                </InfiniteScroll>
              </Paper>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default DesignList;
