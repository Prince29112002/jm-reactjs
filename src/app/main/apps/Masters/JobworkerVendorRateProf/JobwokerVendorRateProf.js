import React, { useState, useEffect } from "react";
import { Typography, Icon, IconButton, InputBase } from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";  
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Search from "../SearchHelper/SearchHelper";
import Modal from "@material-ui/core/Modal";
import { TextField } from "@material-ui/core";
import Loader from "../../../Loader/Loader";
import LoaderPopup from "../../../Loader/LoaderPopup";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import sampleFile from "app/main/SampleFiles/RateProfiles/Jobworker_vendor_rate_profile.csv"
import SearchIcon from "@material-ui/icons/Search";
import Icones from "assets/fornt-icons/Mainicons";
import { FuseAnimate } from "@fuse";

const useStyles = makeStyles((theme) => ({
  root: {},
  tabroot: {
    // width: "fit-content",
    // marginTop: theme.spacing(3),
    overflowX: "auto",
    overflowY: "auto",
    height: "80%",
  },
  paper: {
    position: "absolute",
    width: 400,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    // padding: theme.spacing(4),
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
  table: {
    minWidth: 650,
  },
  tableRowPad: {
    // minWidth: 200,
    textOverflow: "ellipsis",
    // maxWidth: 250,
    // min-width: 200px;
    // text-overflow: ellipsis;
    // max-width: 250px;
    overflow: "hidden",
    padding: 7,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    width: "340px",
    height: "37px",
    color: "#CCCCCC",
    opacity: 1,
    letterSpacing: "0.06px",
    font: "normal normal normal 14px/17px Inter"

  },
  search: {
    display: 'flex',
    border: "1px solid #cccccc",
    float: "right",
    height: "38px",
    width: "340px",
    borderRadius: "7px !important",
    background: "#FFFFFF 0% 0% no-repeat padding-box",
    opacity: 1,
    padding: '2px 4px',
    alignItems: "center",
  },
  iconButton: {
    width: "19px",
    height: "19px",
    opacity: 1,
    color: "#CCCCCC"
  }
}));

function getModalStyle() {
  const top = 50; //+ rand();
  const left = 50; //+ rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const JobwokerVendorRateProf = (props) => {
  const [apiData, setApiData] = useState([]); // display list
  const [searchData, setSearchData] = useState("");

  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);

  const [open, setOpen] = useState(false); //confirm delete Dialog

  const [rateProfNm, setRateProfNm] = useState("");
  const [rateProfNmErr, setRateProfNmErr] = useState("");
  const [modalStyle] = useState(getModalStyle);

  const [selectedIdForEdit, setSelectedIdForEdit] = useState("");

  const [isEdit, setIsEdit] = useState(false);

  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");

  const [loading, setLoading] = useState(false);

  const [normalLoading, setNormalLoading] = useState(true);

  const hiddenFileInput = React.useRef(null);

  const handleClick = (event) => {
    // if (isVoucherSelected) {
    if (rateProfValidation()) {
      hiddenFileInput.current.click();
    }

    // } else {
    // setSelectVoucherErr("Please Select Voucher");
    // }
  };

  useEffect(() => {
    NavbarSetting("Master", dispatch);
  }, []);

  useEffect(() => {
    // visible true -> false
    if (normalLoading) {
      //setTimeout(() => setLoaded(true), 250); // 0.25초 뒤에 해제
      //debugger;
      setTimeout(() => setNormalLoading(false), 7000); // 10초 뒤에
    }

    //setLoaded(loaded);
  }, [normalLoading]);

  useEffect(() => {
    // visible true -> false
    if (loading) {
      //setTimeout(() => setLoaded(true), 250); // 0.25초 뒤에 해제
      //debugger;
      setTimeout(() => setLoading(false), 50000); // 10초 뒤에
    }

    //setLoaded(loaded);
  }, [loading]);

  const handlefilechange = (event) => {
    handleFile(event);
  };

  useEffect(() => {
    getJwAndVendRateProfile();

    //eslint-disable-next-line
  }, [dispatch]);

  const classes = useStyles();

  function getJwAndVendRateProfile() {
    setNormalLoading(true);
    axios
      .get(Config.getCommonUrl() + "api/jobworkerRateProfile")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setApiData(response.data.data);
          // setData(response.data);
          setNormalLoading(false);
        } else {
          setApiData([]);

          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          setNormalLoading(false);
        }
      })
      .catch((error) => {
        setNormalLoading(false);
        handleError(error, dispatch, { api: "api/jobworkerRateProfile" });
      });
  }

  function editHandler(id) {
    setSelectedIdForEdit(id);
    setIsEdit(true);
    setModalOpen(true);

    const Index = apiData.findIndex((a) => a.id === id);
    if (Index > -1) {
      setRateProfNm(apiData[Index].profile_name);
    }
  }

  function deleteHandler(id) {
    setSelectedIdForDelete(id);
    setOpen(true);
  }

  function viewHandler(id) {
    props.history.push("/dashboard/masters/viewjwvendrateprofile", { id: id });
  }

  function callDeleteRateProfileApi() {
    axios
      .delete(
        Config.getCommonUrl() +
        "api/jobworkerRateProfile/" +
        selectedIdForDelete
      )
      .then(function (response) {
        console.log(response);
        setOpen(false);
        if (response.data.success === true) {
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          getJwAndVendRateProfile();
          setSelectedIdForDelete("");
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch((error) => {
        setOpen(false);
        handleError(error, dispatch, {
          api: "api/jobworkerRateProfile/" + selectedIdForDelete,
        });
      });
  }

  function handleClose() {
    setSelectedIdForDelete("");
    setOpen(false);
  }

  function onSearchHandler(sData) {
    setSearchData(sData);
  }

  function handleModalClose(callApi) {
    setModalOpen(false);
    setSelectedIdForEdit("");
    setIsEdit(false);
    setRateProfNm("");
    setRateProfNmErr("");

    if (callApi === true) {
      getJwAndVendRateProfile(); //main list
    }
  }

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name === "rateProfNm") {
      setRateProfNm(value);
      setRateProfNmErr("");
    }
  }

  function rateProfValidation() {
    var Regex = /^[a-zA-Z0-9 ]+$/;
    if (!rateProfNm || Regex.test(rateProfNm) === false) {
      // setIsEdtStkGrpNmErr(true);
      setRateProfNmErr("Please Enter Valid s Name");

      return false;
    }
    return true;
  }

  function handleFile(e) {
    e.preventDefault();
    var files = e.target.files,
      f = files[0];
    uploadfileapicall(f);
  }

  function uploadfileapicall(f) {
    const formData = new FormData();
    formData.append("file", f);
    formData.append("profile_name", rateProfNm);
    if (isEdit === true) {
      formData.append("id", selectedIdForEdit);
    }
    setLoading(true);

    axios
      .post(Config.getCommonUrl() + "api/jobworkerRateProfile/upload", formData)
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {

          setLoading(false);

          if (response.data.hasOwnProperty("url")) {
            let downloadUrl = response.data.url;
            // window.open(downloadUrl);
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.click();
          }
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          handleModalClose(true);
        } else {
          setLoading(false);

          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          document.getElementById("fileinput").value = "";
        }
      })
      .catch((error) => {
        setLoading(false);
        document.getElementById("fileinput").value = "";
        handleError(error, dispatch, { api: "api/jobworkerRateProfile/upload", body: JSON.stringify(formData) });
      });
  }

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      {/* <FuseAnimate animation="transition.slideUpIn" delay={200}> */}
      <div className="flex flex-col md:flex-row container">
      <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20 ">
          <Grid
            className="department-main-dv"
            container
            spacing={4}
            alignItems="stretch"
            style={{ margin: 0 }}
          >
            <Grid item xs={6} sm={6} md={6} key="1" style={{ padding: 0 }}>
              {/* <FuseAnimate delay={300}> */}
              <Typography className="pl-28 pt-16 text-18 font-700">
                Job Worker & Vendor Rate Profile
              </Typography>
              {/* </FuseAnimate> */}

              {/* <BreadcrumbsHelper /> */}
            </Grid>

            <Grid
              item
              xs={6}
              sm={6}
              md={6}
              key="2"
              style={{ textAlign: "right" }}
            >
              {/* <Link
                  to={{
                    pathname: "/dashboard/masters/addtaggingrateprofile",
                    // search: "?sort=name",
                    // hash: "#the-hash",
                    state: { isEdit: false },
                  }}
                  // to="/dashboard/masters/addtaggingrateprofile"
                  style={{ textDecoration: "none", color: "inherit" }}
                > */}
              <Button
                
                className={classes.button}
                size="small"
                onClick={(event) => {
                  setModalOpen(true);
                  setIsEdit(false);
                }}
              >
                Add New
              </Button>
              {/* </Link> */}
            </Grid>
          </Grid>
          <div className="main-div-alll ">
          <div>
            <div style={{ borderRadius: "7px !important" }} component="form" className={classes.search}>
          <InputBase
            className={classes.input}
            placeholder="Search"
            inputProps={{ 'aria-label': 'search' }}
            value={searchData}
            onChange={(event) => setSearchData(event.target.value)}
          />
          <IconButton type="submit" className={classes.iconButton} aria-label="search">
            <SearchIcon />
          </IconButton>
        </div>
        </div>
          {normalLoading && <Loader />}
          <div className="mt-56 department-tbl-mt-dv">
          <Paper
            className={clsx(
              classes.tabroot,
              "mt-56 jobworkervender_tabel_dv "
            )}
          >
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell
                    className={classes.tableRowPad}
                    style={{ maxWidth: 100 }}
                  >
                    ID
                  </TableCell>

                  <TableCell className={classes.tableRowPad} align="left">
                    Rate Profile
                  </TableCell>
                  {/* <TableCell className={classes.tableRowPad} align="left">
                        Category Name
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Wastage
                      </TableCell> */}

                  <TableCell className={classes.tableRowPad} align="left">
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {apiData
                  .filter((temp) =>
                    temp.profile_name
                      .toLowerCase()
                      .includes(searchData.toLowerCase())
                  )
                  .map((row) => (
                    <TableRow key={row.id}>
                      <TableCell
                        className={classes.tableRowPad}
                        style={{ maxWidth: 100 }}
                      >
                        {row.id}
                      </TableCell>
                      <TableCell align="left" className={classes.tableRowPad}>
                        {row.profile_name}
                      </TableCell>

                      <TableCell className={classes.tableRowPad}>
                        <IconButton
                          style={{ padding: "0" }}
                          onClick={(ev) => {
                            //   // ev.preventDefault();
                            //   // ev.stopPropagation();
                            editHandler(row.id);
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
                            deleteHandler(row.id);
                          }}
                        >
                        <Icon className="mr-8 delete-icone">
                                  <img src={Icones.delete_red} alt="" />
                                </Icon>
                        </IconButton>

                        <IconButton
                          style={{ padding: "0" }}
                          onClick={(ev) => {
                            ev.preventDefault();
                            ev.stopPropagation();
                            viewHandler(row.id);
                          }}
                        >
                      <Icon className="mr-8 view-icone">
                                  <img src={Icones.view} alt="" />
                                </Icon>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Paper>
          </div>
          </div>
          {/* )}*/}
          </div>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title" className="popup-delete">{"Alert!!!"}
            <IconButton
                    style={{ position: "absolute", marginTop:"-5px", right: "15px"}}
                    onClick={handleClose}
                  >
                    <img src={Icones.cross} className="delete-dialog-box-image-size" alt="" />
                  </IconButton>
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this record?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} className="delete-dialog-box-cancle-button">
                Cancel
              </Button>
              <Button
                onClick={callDeleteRateProfileApi}
                className="delete-dialog-box-delete-button"
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          <Modal
            // disableBackdropClick
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={modalOpen}
            onClose={(_, reason) => {
              if (reason !== "backdropClick") {
                handleModalClose();
              }
            }}
            // style={{ overflow: "scroll" }}
          >
            <div style={modalStyle} className={clsx(classes.paper,"rounded-8")}>
              {loading && <LoaderPopup />}
              <h5 className="popup-head p-20">
                {isEdit === false
                  ? "Add Job Worker & Vendor Rate Profile"
                  : "Edit Job Worker & Vendor Rate Profile"}
                <IconButton
                  style={{ position: "absolute", marginTop:-15, right:8}}
                  onClick={handleModalClose}
                >
                  <Icon><img src={Icones.cross} alt="" /></Icon>
                </IconButton>
              </h5>
              <div className="pl-32 pr-32 pb-10 pt-10">
              <p className="popup-labl p-4 ">Rate Profile Name</p>
                <TextField
                  placeholder="Enter Rate Profile Name"
                  name="rateProfNm"
                  className="input-select-bdr-dv mb-32"
                  value={rateProfNm}
                  error={rateProfNmErr.length > 0 ? true : false}
                  helperText={rateProfNmErr}
                  onChange={(e) => handleInputChange(e)}
                  variant="outlined"
                  autoFocus
                  fullWidth
                />

                <div className="download-sample-link">
                <a href={sampleFile} download="Jobworker_vendor_rate_profile.csv" >Download Sample </a>
                </div> 

                <div className="flex flex-row justify-between">
                      <Button
                        variant="contained"
                        className="w-155 mt-5 popup-cancel delete-dialog-box-cancle-button"
                        onClick={handleModalClose}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        className="w-155 mt-5 popup-save"
                        onClick={handleClick}
                      >
                        upload a file
                      </Button>

                      <input
                  type="file"
                  id="fileinput"
                  // accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  accept=".csv"
                  ref={hiddenFileInput}
                  onChange={handlefilechange}
                  style={{ display: "none" }}
                />
                    </div>

                {/* <Button
                  variant="contained"
                  color="primary"
                  className="w-full mx-auto mt-16"
                  style={{
                    backgroundColor: "#4caf50",
                    border: "none",
                    color: "white",
                  }}
                  onClick={handleClick}
                >
                  Upload a file
                </Button>

                <input
                  type="file"
                  id="fileinput"
                  // accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  accept=".csv"
                  ref={hiddenFileInput}
                  onChange={handlefilechange}
                  style={{ display: "none" }}
                /> */}
              </div>
            </div>
          </Modal>
        </div>
      </div>
      // </FuseAnimate>
    // </div>
  );
};

export default JobwokerVendorRateProf;
