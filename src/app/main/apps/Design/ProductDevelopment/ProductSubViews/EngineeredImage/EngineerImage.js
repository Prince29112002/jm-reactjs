import React, { useState, useEffect, useRef } from "react";
import {
  Typography,
  TextField,
  Icon,
  IconButton,
  Button,
  Checkbox,
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
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
import Loader from "../../../../../Loader/Loader";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroll-component";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { CSVLink } from "react-csv";
import History from "@history";
import Icones from "assets/fornt-icons/Mainicons";

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
    backgroundColor: "#FE8E0B",
    color: "white",
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
  tableFooter: {
    padding: 7,
    backgroundColor: "#E3E3E3",
  },
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "#FFFFFF",
    borderRadius: 7,
    letterSpacing: "0.06px",
  },
  searchBox: {
    padding: 6,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
  },
}));

const EngineerImage = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [apiList, setApiList] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(0);
  const [searchData, setSearchData] = useState({
    temp_cad_no: "",
    cam_weight: "",
    updated_at: "",
    size: "",
  });
  const [selectedId, setSelectedId] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [cadJobId, setcadJobId] = useState("");

  function editHandler(id, view) {
    History.push("/dashboard/design/vieweditengimg", { id: id, view: view });
  }

  useEffect(() => {
    getAllDataList();
  }, [dispatch]);

  useEffect(() => {
    NavbarSetting("Design", dispatch);
  }, []);

  function getAllDataList(num) {
    setLoading(true);
    const pageNum = num === undefined ? page : num;
    axios
      .post(
        Config.getCommonUrl() +
          `api/cadjobreceivedesign/image/data/info/search/${pageNum + 1}`,
        searchData
      )
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          const temp = res.data.data.rows;
          const arrData = temp.map((item) => {
            return {
              imgfile: item.image_file !== null ? item.image_file : "",
              final_cad_number:
                item.temp_cad_no !== null ? item.temp_cad_no : "",
              // totalMoldPcs: item.totalMoldPcs !== null ? item.totalMoldPcs.toString() : "",
              cam_weight:
                item.EngineeringDetails !== null
                  ? item.EngineeringDetails.weight
                  : "",
              assignDate: moment
                .utc(item.updated_at)
                .local()
                .format("DD-MM-YYYY"),
              id: item.id !== null ? item.id : null,
              size:
                item.EngineeringDetails !== null
                  ? item.EngineeringDetails.size
                  : "",
              status: item.EngineeringDetails
                ? item.EngineeringDetails.active_deactive
                : "",
              process: item.current_process !== "" ? item.current_process : "",
            };
          });
          setTotalRecords(res.data.data.count);
          setPage(pageNum + 1);
          setApiList(arrData);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {
          api: `api/cadjobreceivedesign/image/data/info/search/${pageNum + 1}`,
          body: searchData,
        });
      });
  }
  const handleSearchData = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    // const searchItem = searchData;
    setSearchData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setPage(0);
  };

  const useIsMount = () => {
    const isMountRef = useRef(true);
    useEffect(() => {
      isMountRef.current = false;
    }, []);
    return isMountRef.current;
  };
  const isMount = useIsMount();
  useEffect(() => {
    if (!isMount) {
      const timeout = setTimeout(() => {
        setLoading(true);
        axios
          .post(
            Config.getCommonUrl() +
              `api/cadjobreceivedesign/image/data/info/search/${page + 1}`,
            searchData
          )
          .then((response) => {
            console.log(response);
            if (response.data.success) {
              let tempData = response.data.data.rows;
              let data = tempData.map((item) => {
                return {
                  ...item,
                  imgfile: item.image_file !== null ? item.image_file : "",
                  final_cad_number:
                    item.temp_cad_no !== null ? item.temp_cad_no : "",
                  // totalMoldPcs: item.totalMoldPcs !== null ? item.totalMoldPcs.toString() : "",
                  cam_weight: item.cam_weight !== null ? item.cam_weight : "",
                  assignDate: moment
                    .utc(item.updated_at)
                    .local()
                    .format("DD-MM-YYYY"),
                  id: item.id !== null ? item.id : null,
                  size: item.size !== null ? item.size : "",
                  status: item.EngineeringDetails
                    ? item.EngineeringDetails.active_deactive
                    : "",
                  process:
                    item.current_process !== "" ? item.current_process : "",
                };
              });
              setApiList(data);
              setTotalRecords(response.data.data.count);
              setPage(page + 1);
            } else {
              dispatch(
                Actions.showMessage({
                  message: response.data.message,
                  variant: "success",
                })
              );
            }
            setLoading(false);
          })
          .catch((error) => {
            setLoading(false);
            handleError(error, dispatch, {
              api: `api/cadjobreceivedesign/image/data/info/search/${page + 1}`,
              body: searchData,
            });
          });
      }, 800);
      return () => {
        clearTimeout(timeout);
      };
    }
    //eslint-disable-next-line
  }, [searchData]);
  const fetchData = async () => {
    // a fake async api call like which sends
    // 20 more records in 1.5 secs
    const response = await axios.post(
      Config.getCommonUrl() +
        `api/cadjobreceivedesign/image/data/info/search/${page + 1}`,
      searchData
    );
    if (response.data.success) {
      let tempData = response.data.data.rows;
      let data = tempData.map((item) => {
        return {
          ...item,
          imgfile: item.image_file !== null ? item.image_file : "",
          final_cad_number: item.temp_cad_no !== null ? item.temp_cad_no : "",
          // totalMoldPcs: item.totalMoldPcs !== null ? item.totalMoldPcs.toString() : "",
          cam_weight: item.cam_weight !== null ? item.cam_weight : "",
          assignDate: moment.utc(item.updated_at).local().format("DD-MM-YYYY"),
          id: item.id !== null ? item.id : null,
          size: item.size !== null ? item.size : "",
          status: item.EngineeringDetails
            ? item.EngineeringDetails.active_deactive
            : "",
          process: item.current_process !== "" ? item.current_process : "",
        };
      });
      setTimeout(() => {
        setApiList(apiList.concat(data));
        setPage(page + 1);
        setTotalRecords(response.data.data.count);
      }, 1500);
    } else {
      dispatch(
        Actions.showMessage({
          message: response.data.message,
          variant: "error",
        })
      );
    }
    setLoading(false);
  };

  const handleChecked = (e) => {
    const newSelection = e.target.value;
    let newSelectionArrayId;
    if (selectedId.indexOf(newSelection) > -1) {
      newSelectionArrayId = selectedId.filter((s) => s !== newSelection);
    } else {
      newSelectionArrayId = [...selectedId, newSelection];
    }
    setSelectedId(newSelectionArrayId);
  };

  function callExportFileApi() {
    if (selectedId.length > 0) {
      setLoading(true);
      const body = {
        design_id: selectedId,
      };
      axios
        .post(
          Config.getCommonUrl() + "api/cadjobreceivedesign/engg/data/csv",
          body
        )
        .then((response) => {
          console.log(response);
          if (response.data.success) {
            let downloadUrl = response.data.url;
            window.open(downloadUrl);
            setSelectedId([]);
          } else {
            dispatch(
              Actions.showMessage({
                message: response.data.message,
                variant: "error",
              })
            );
          }
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          handleError(error, dispatch, {
            api: "api/cadjobreceivedesign/engg/data/csv",
          });
        });
    } else {
      dispatch(
        Actions.showMessage({
          message: "Please Select Any Records",
          variant: "error",
        })
      );
    }
  }

  const handleTransferJob = () => {
    axios
      .put(
        Config.getCommonUrl() +
          `api/cadjobreceivedesign/cad/active/deactive/${cadJobId}/0`
      )
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setcadJobId("");
          setModalOpen(false);
          getAllDataList(0);
        }
        dispatch(
          Actions.showMessage({
            message: response.data.message,
            variant: "error",
          })
        );
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/cadjobreceivedesign/cad/active/deactive/${cadJobId}/0`,
        });
      });
  };

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0">
            <div className="main-div-alll">
              <Button
                // variant="contained"
                className={classes.button}
                size="small"
                style={{
                  // backgroundColor: "#306ff1",
                  // color:"white",
                  float: "right",
                  width: "auto",
                  // height: "30PX",
                  alignSelf: "flex-end",
                  // marginRight: "20px",
                }}
                onClick={() => callExportFileApi()}
              >
                Export
              </Button>

              <Grid
                className="department-main-dv create-account-main-dv"
                container
                spacing={4}
                alignItems="stretch"
                style={{ margin: 0 }}
              ></Grid>

              {loading && <Loader />}
              <div className="design_list_tbl">
                <Paper
                  className={clsx(
                    classes.tabroot,
                    "table-responsive design_list_blg view_design_list_blg Scroll"
                  )}
                  id="ScrollTable"
                >
                  <InfiniteScroll
                    dataLength={apiList.length}
                    next={fetchData}
                    hasMore={apiList.length !== totalRecords}
                    loader={<h4>Loading...</h4>}
                    scrollableTarget="ScrollTable"
                  >
                    <MaUTable className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            className={classes.tableRowPad}
                          ></TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Design
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            CAD File Number
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Weight
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Size
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Date
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Current Process
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Status
                          </TableCell>
                          {!Config.idDesigner() && (
                            <TableCell className={classes.tableRowPad}>
                              Action
                            </TableCell>
                          )}
                        </TableRow>
                        <TableRow>
                          <TableCell
                            className={classes.tableRowPad}
                          ></TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                          ></TableCell>
                          <TableCell className={classes.tableRowPad}>
                            <TextField
                              // placeholder="CAD File Number"
                              name="temp_cad_no"
                              onChange={handleSearchData}
                              inputProps={{ className: "all-Search-box-data" }}
                            />
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            <TextField
                              // placeholder="Weight"
                              name="cam_weight"
                              onChange={handleSearchData}
                              inputProps={{ className: "all-Search-box-data" }}
                            />
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            <TextField
                              // placeholder="Size"
                              name="size"
                              onChange={handleSearchData}
                              inputProps={{ className: "all-Search-box-data" }}
                            />
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            <TextField
                              // placeholder="Date"
                              name="updated_at"
                              onChange={handleSearchData}
                              inputProps={{ className: "all-Search-box-data" }}
                            />
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                          ></TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                          ></TableCell>
                          {!Config.idDesigner() && (
                            <TableCell
                              className={classes.tableRowPad}
                            ></TableCell>
                          )}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {apiList
                          // .filter((temp) =>
                          //   temp.final_cad_number.toLowerCase().includes(searchData.toLowerCase()) ||
                          //   temp.totalMoldPcs.toLowerCase().includes(searchData.toLowerCase()) ||
                          //   temp.cam_weight.toLowerCase().includes(searchData.toLowerCase()) ||
                          //   temp.assignDate.toLowerCase().includes(searchData.toLowerCase())
                          // )
                          .map((row, index) => (
                            <TableRow key={index}>
                              <TableCell className={classes.tableRowPad}>
                                <Checkbox
                                  name="selectdesign"
                                  value={row.id}
                                  onChange={handleChecked}
                                  checked={
                                    selectedId.includes(row.id.toString())
                                      ? true
                                      : false
                                  }
                                />
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                <img
                                  src={`${Config.getS3Url()}vkjdev/cadJob/images/${
                                    row.imgfile
                                  }`}
                                  height={50}
                                  width={50}
                                />
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {row.final_cad_number}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {row.cam_weight}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {row.size}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {row.assignDate}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {row.process === 1 && "-"}
                                {row.process === 2 && "Cam"}
                                {row.process === 3 && "Master Finish"}
                                {row.process === 4 && "Silver Casting"}
                                {row.process === 5 && "Chrome Plating"}
                                {row.process === 6 && "Mold Cutting"}
                                {row.process === 7 && "Cad"}
                              </TableCell>
                              {row.status === 1 && (
                                <TableCell className={classes.tableRowPad}>
                                  <b style={{ color: "#4CAF50" }}>Completed</b>
                                </TableCell>
                              )}
                              {row.status === 0 && (
                                <TableCell className={classes.tableRowPad}>
                                  <b style={{ color: "#FF4C4C" }}>Hold</b>
                                </TableCell>
                              )}
                              {!Config.idDesigner() && (
                                <TableCell className={classes.tableRowPad}>
                                  {row.status === 1 && (
                                    <Button
                                      className="mr-8 repair-btn"
                                      //  variant="contained"
                                      //  style={{ backgroundColor: "#ff4f1e" , color : "white"}}
                                      size="small"
                                      onClick={() => {
                                        setModalOpen(true);
                                        setcadJobId(row.id);
                                      }}
                                    >
                                      Repair
                                    </Button>
                                  )}
                                  <IconButton
                                    style={{ padding: "0" }}
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                      ev.stopPropagation();
                                      editHandler(row.id, false);
                                    }}
                                  >
                                    <Icon className="mr-8 edit-icone">
                                      <img src={Icones.edit} alt="" />
                                    </Icon>
                                  </IconButton>
                                  <IconButton
                                    style={{ padding: "0" }}
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                      ev.stopPropagation();
                                      editHandler(row.id, true);
                                    }}
                                  >
                                    <Icon className="mr-8 view-icone">
                                      <img src={Icones.view} alt="" />
                                    </Icon>
                                  </IconButton>
                                </TableCell>
                              )}
                            </TableRow>
                          ))}
                      </TableBody>
                    </MaUTable>
                  </InfiniteScroll>
                </Paper>
              </div>
            </div>
            <Dialog
              open={modalOpen}
              onClose={() => {
                setModalOpen(false);
                setcadJobId("");
              }}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title" className="popup-delete">
                {"Alert!!!"}
                <IconButton
                  style={{
                    position: "absolute",
                    marginTop: "-5px",
                    right: "15px",
                  }}
                  onClick={() => {
                    setModalOpen(false);
                    setcadJobId("");
                  }}
                >
                  <img
                    src={Icones.cross}
                    className="delete-dialog-box-image-size"
                    alt=""
                  />
                </IconButton>
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to transfer for the repair?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    setModalOpen(false);
                    setcadJobId("");
                  }}
                  className="delete-dialog-box-cancle-button"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleTransferJob}
                  className="delete-dialog-box-cancle-button"
                  autoFocus
                >
                  OK
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default EngineerImage;
