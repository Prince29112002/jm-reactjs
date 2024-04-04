import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";

import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import Loader from "../../../Loader/Loader";
import DragDrop from "./AssociationDragDrop/DragDrop";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import RetailerTable from "./Components/RetailerTable";
import DistributorTable from "./Components/DistributorTable";

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: "none",
  },
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "cornflowerblue",
    color: "white",
  },
  tabroot: {
    // width: "fit-content",
    // marginTop: theme.spacing(3),
    overflowX: "auto",
    overflowY: "auto",
    // height: "100%",
    height: "100%",
  },
  table: {
    minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
  },
  selectBox: {
    // marginTop: 8,
    padding: 8,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
    width: "100%",
    // marginLeft: 15,
  },
}));

const CompanyAssociation = (props) => {
  //main list
  const [retailersList, setRetailersList] = useState([]);
  const [distributorList, setDistributorList] = useState([]);
  const classes = useStyles();
  // const history = useHistory();
  // const navigate = useNavigate();
  const [openPopUp, setOpenPopUp] = useState(false); //popup

  const [distriComp, setDistriComp] = useState([]);
  const [retComp, setRetComp] = useState([]);

  const [clientType, setClientType] = useState([]);
  const [selectedCType, setSelectedCType] = useState("");

  const [distriId, setDistriId] = useState("");
  const [retId, setRetId] = useState("");

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    NavbarSetting("Mobile-app Admin", dispatch);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  useEffect(() => {
    GetClientTypeList();
    //eslint-disable-next-line
  }, [dispatch]);

  function GetClientTypeList() {
    axios
      .get(Config.getCommonUrl() + "api/client/company-association-typelist")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          const key = Object.keys(response.data.data);
          const values = Object.values(response.data.data);

          let temp = [];

          for (let i = 0; i < values.length; i++) {
            temp.push({
              value: key[i],
              label: values[i],
            });
          }
          setClientType(temp);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
        }
      })
      .catch(function (error) {
        // setLoading(false);
        handleError(error, dispatch, {
          api: "api/client/company-association-typelist",
        });
      });
  }

  function hangleCTypeChange(e) {
    let value = e.target.value;
    setSelectedCType(value);
    // if retailer then call retailer listing api and btn will be allocate distributor, call distributor companies inside popup
    // if distributor then call allocated distributor listing api and btn will be allocate retailer, call retailer companies inside popup
    //call api for listing here
    if (value === "1") {
      getDistributor();
    } else if (value === "2") {
      getRetailers();
    }
  }

  function getDistributor() {
    setLoading(true);
    // api/distributormaster/all-distributors
    axios
      .get(Config.getCommonUrl() + "api/client/all/client")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          let tempData = response.data.data;
          let tempApiData = tempData.map((x) => {
            let comp =
              x.clientCompanies.length > 0 && x.companyId
                ? x.clientCompanies.filter((y) => {
                    return y.id === x.companyId.company_id;
                  })
                : "";

            return {
              ...x,
              // toBeSelect: x.clientCompanies.length > 0 ? true : false,
              companyDetails: comp,
              selected: false, //below keys are used for sorting purpose
              email:
                x.clientContacts.length > 0 ? x.clientContacts[0].email : "",
              mobNo:
                x.clientContacts.length > 0 ? x.clientContacts[0].number : "",
              cityNm: comp.length > 0 ? comp[0].CityName.name : "",
              compNm: comp.length > 0 ? comp[0].company_name : "",
            };
          });
          setDistributorList(tempApiData);
          setLoading(false);
          // setData(response.data);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, { api: "api/client/all/client" });
      });
  }

  function getRetailers() {
    setLoading(true);

    axios
      .get(Config.getCommonUrl() + "api/retailerMaster")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          let tempData = response.data.data;
          let tempApiData = tempData.map((x) => {
            return {
              ...x,
              selected: false,
              cityNm: x.city_name?.name,
            };
          });
          setRetailersList(tempApiData);
          setLoading(false);
          // setData(response.data);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, { api: "api/retailerMaster" });
      });
  }

  function handleAllocation(id) {
    // client type check based on that show listing
    setOpenPopUp(true);
    // if retailer then call retailer listing api and btn will be allocate distributor, call distributor companies inside popup
    // if distributor then call allocated distributor listing api and btn will be allocate retailer, call retailer companies inside popup
    if (selectedCType === "1") {
      //distributor
      setDistriId(id);
      getRetCompanies(id);
    } else if (selectedCType === "2") {
      //retailer
      setRetId(id);
      getDistriCompanies(id);
    }
  }

  function getRetCompanies(id) {
    axios
      .get(
        Config.getCommonUrl() +
          "api/retailerMaster/listing-with-associated-retailer/" +
          id
      )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          let tempData = response.data.data;

          setRetComp(tempData);
          setLoading(false);
          // setData(response.data);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, {
          api: "api/retailerMaster/listing-with-associated-retailer/" + id,
        });
      });
  }

  function getDistriCompanies(id) {
    axios
      .get(
        Config.getCommonUrl() +
          "api/client/listing-with-associated-clients/" +
          id
      )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          let tempData = response.data.data;

          setDistriComp(tempData);
          setLoading(false);
          // setData(response.data);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, {
          api: "api/client/listing-with-associated-clients/" + id,
        });
      });
  }

  const handleClose = () => {
    setOpenPopUp(false);
    setDistriComp([]);
    setRetComp([]);
    setDistriId("");
    setRetId("");

    if (selectedCType === "1") {
      //distributor
      getDistributor();
    } else if (selectedCType === "2") {
      //retailer
      getRetailers();
    }
    // distriComp={distriComp} retComp={retComp} distriId={distriId} retId={retId}
  };

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 pb-64 flex-col min-w-0 makeStyles-root-1 pt-20">
            <Grid
              className="department-main-dv"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={12} sm={6} md={6} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    Company Association
                  </Typography>
                </FuseAnimate>

                {/* <BreadcrumbsHelper /> */}
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                key="2"
                style={{ textAlign: "right" }}
              ></Grid>
            </Grid>

            {loading && <Loader />}
            <div className="main-div-alll ">
              <div className="mt-8 pl-16">
                <Grid item xs={3} sm={3} md={3} style={{ padding: 5 }}>
                  <label>Client Type</label>

                  <select
                    name="gender"
                    className={classes.selectBox}
                    value={selectedCType}
                    onChange={(e) => {
                      hangleCTypeChange(e);
                    }}
                  >
                    <option hidden value="">
                      Select Client Type
                    </option>
                    {/* <option value="0">Distributor</option>
                                    <option value="1">Other</option> */}
                    {clientType.map((row) => (
                      <option key={row.value} value={row.value}>
                        {row.label}
                      </option>
                    ))}
                  </select>
                </Grid>
              </div>

              {selectedCType === "2" && (
                <RetailerTable
                  retailersList={retailersList}
                  handleAllocation={handleAllocation}
                />
              )}

              {selectedCType === "1" && (
                <DistributorTable
                  distributorList={distributorList}
                  handleAllocation={handleAllocation}
                />
              )}

              {openPopUp && (
                <DragDrop
                  modalColsed={handleClose}
                  selectedCType={selectedCType}
                  distriComp={distriComp}
                  retComp={retComp}
                  distriId={distriId}
                  retId={retId}
                />
              )}
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default CompanyAssociation;
