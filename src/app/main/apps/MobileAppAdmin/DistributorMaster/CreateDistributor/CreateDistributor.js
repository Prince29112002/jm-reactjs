import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { useDispatch } from "react-redux";
import clsx from "clsx";
import { Typography, Button } from "@material-ui/core";
import { FuseAnimate } from "@fuse";
import History from "@history";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import CompanyDetails from "./SubView/CompanyDetails";
import ProductAllocation from "./SubView/ProductAllocation";
import moment from "moment";
import OrderHistory from './SubView/OrderHistory';
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "#FFFFFF",
    borderRadius: 7,
    letterSpacing: "0.06px",
  },
}));

const CreateDistributor = (props) => {
  const classes = useStyles();
  const path_name = props.location.pathname

  const propsData = props.location.state;

  const [isViewOnly, setIsViewOnly] = useState(false);

  const [modalView, setModalView] = useState(0);

  const dispatch = useDispatch();

  const childRef = useRef();

  const [clientId, setClientId] = useState("")
  const [companyId, setCompanyId] = useState("")
  const [email, setEmail] = useState("")
  const [orderPcs, setOrderPcs] = useState("")

  const [treeView, setTreeView] = useState("")//if already allocated then showing selected
  const [expDtTime, setExpDtTime] = useState("")
  const [categoryFlag, setCategoryFlag] = useState("")
  const [expDate, setExpDate] = useState("")
  const [shortcut, setShortcut] = useState("")
  const [selectedStaging, setSelectedStaging] = useState("")

  useEffect(() => {
      NavbarSetting('Mobile-app Admin', dispatch)
      //eslint-disable-next-line
  }, [])

  const handleChangeTab = (event, value) => {
      if (modalView === 2) {
          setModalView(value);
      } else {
          if (value === 1) {
              if (childRef.current.checkValidation()) {
                  const data = childRef.current.getData()
                  setCompanyId(data.comp)
                  setEmail(data.email)
                  setOrderPcs(data.order_pieces)
                  setModalView(value);
              }
          } else {
              setModalView(value);
          }
      }
  };

  const changeTab = () => {
      if (childRef.current.checkValidation()) {
          const data = childRef.current.getData()
          setCompanyId(data.comp)
          setEmail(data.email)
          setOrderPcs(data.order_pieces)
          setModalView(1);
      }
  }


  useEffect(() => {
      return () => {
          console.log("cleaned up");
      };
  }, []);

  useEffect(() => {
      console.log("idToBeEdited", propsData);
      if (propsData !== undefined) {
          setIsViewOnly(propsData.isViewOnly);
          setClientId(propsData.row)
          getDetails(propsData.row)//checking if already allocated
      }
      //eslint-disable-next-line
  }, []);

  function getDetails(id) {
      axios
          .get(Config.getCommonUrl() + "api/distributorMaster/get-distributor-master-details/" + id)
          .then(function (response) {
              if (response.data.success === true) {
                  console.log(response);
                  let tempData = response.data.data;
                  setEmail(tempData.email)
                  setOrderPcs(tempData.order_pieces)
                  setExpDtTime(tempData.expiry_date_time?.toString())
                  setCategoryFlag(tempData.is_category?.toString())
                  setShortcut(tempData.shortcut?.toString())
                  setCompanyId({
                      value: tempData.company_id,
                      label: tempData.company.company_name,
                      img: tempData.company.image_file
                  })
                  setExpDate(moment(tempData.date_time).utc().format("YYYY-MM-DD hh:mm:ss A"))
                  const tempTree = []
                  tempData.Distributor.map((item) => {
                      tempTree.push({
                          value: item.product_category_id,
                          label: item.ProductCategoryDetails?.category_name,
                          children: []
                      })
                  })
                  if (tempData.is_category == 0) {
                      setSelectedStaging({
                          value: tempData.distributorStaging?.id,
                          label: tempData.distributorStaging?.name
                      })
                  }
                  setTreeView(tempTree)
                  console.log(tempTree)
              } else {
                  dispatch(Actions.showMessage({ message: response.data.message }));
              }
          })
          .catch(function (error) {
              // setLoading(false);
              setTreeView([])
              handleError(error, dispatch, { api: "api/distributorMaster/get-distributor-master-details/" + id })
          });
  }

  function checkDetails() {
      if (childRef.current.checkValidation()) {
          // const mainIds = childRef.current.finalArrIds();
          // console.log(mainIds)
          const data = childRef.current.getData();
          console.log(data)
          const cateArr = [];
          data.product_category_id.map((curVal) => {
              cateArr.push(curVal.value);
              return null
          });
          let dateFormat = ''
          
          if (data.expiry_date_time == 1) {
              dateFormat = new Date(data.date_time).toISOString()// moment(new Date(data.date_time)).format("YYYY-MM-DD h : i : s"),
          }
          const body = {
              client_id: clientId,
              company_id: companyId.value,
              email: email,
              order_pieces: orderPcs,
              expiry_date_time: data.expiry_date_time,
              shortcut: data.shortcut,
              date_time: dateFormat,
              is_category: data.is_category,
              ...((data.is_category == "1") && {
                  product_category_id: cateArr,
              }),
              ...((data.is_category == "0") && {
                  "staging_id": data.staging_id,
              }),
          }
          console.log(body)
          axios.post(Config.getCommonUrl() + "api/distributormaster", body)
              .then((response) => {
                  console.log(response);
                  if (response.data.success) {
                      dispatch(Actions.showMessage({ message: response.data.message }));
                      propsData.apiData.splice(propsData.page * 10)
                      History.push('/dashboard/mobappadmin/distributormaster', 
                      { iseditView: true, page: propsData.page, 
                          search: propsData.search, apiData: 
                          propsData.apiData, count: propsData.count })
                  } else {
                      dispatch(Actions.showMessage({ message: response.data.message }));
                  }
              })
              .catch((error) => {
                  handleError(error, dispatch, { api: "api/distributormaster", body: body })

              })
      }
  }

  function checkDetails() {
    if (childRef.current.checkValidation()) {
        // const mainIds = childRef.current.finalArrIds();
        // console.log(mainIds)
        const data = childRef.current.getData();
        console.log(data)
        const cateArr = [];
        data.product_category_id.map((curVal) => {
            cateArr.push(curVal.value);
            return null
        });
        let dateFormat = ''
        
        if (data.expiry_date_time == 1) {
            dateFormat = new Date(data.date_time).toISOString()// moment(new Date(data.date_time)).format("YYYY-MM-DD h : i : s"),
        }
        const body = {
            client_id: clientId,
            company_id: companyId.value,
            email: email,
            order_pieces: orderPcs,
            expiry_date_time: data.expiry_date_time,
            shortcut: data.shortcut,
            date_time: dateFormat,
            is_category: data.is_category,
            ...((data.is_category == "1") && {
                product_category_id: cateArr,
            }),
            ...((data.is_category == "0") && {
                "staging_id": data.staging_id,
            }),
        }
        console.log(body)
        axios.post(Config.getCommonUrl() + "api/distributormaster", body)
            .then((response) => {
                console.log(response);
                if (response.data.success) {
                    dispatch(Actions.showMessage({ message: response.data.message }));
                    propsData.apiData.splice(propsData.page * 10)
                    History.push('/dashboard/mobappadmin/distributormaster', 
                    { iseditView: true, page: propsData.page, 
                        search: propsData.search, apiData: 
                        propsData.apiData, count: propsData.count })
                } else {
                    dispatch(Actions.showMessage({ message: response.data.message }));
                }
            })
            .catch((error) => {
                handleError(error, dispatch, { api: "api/distributormaster", body: body })

            })
    }
}

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1">
            <Grid
              className="department-main-dv"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={7} sm={7} md={7} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="p-16 pb-8 text-18 pl-32 font-700">
                    <Tabs value={modalView} onChange={handleChangeTab}>
                      <Tab label="Other Details" />
                      <Tab label="Product Allocation" />
                      <Tab label="Order History" />
                    </Tabs>
                  </Typography>
                </FuseAnimate>
              </Grid>

              <Grid
                item
                xs={5}
                sm={5}
                md={5}
                key="2"
                style={{ textAlign: "right" }}
              >
                <div className="btn-back mt-10">
                  <Button
                    id="btn-back"
                    size="small"
                    onClick={(event) => {
                      // History.goBack();
                      {
                        (path_name === "/dashboard/mobappadmin/distributormaster/createdistributor") ?
                        History.push('/dashboard/mobappadmin/distributormaster', { page: propsData.page, search: propsData.search, apiData: propsData.apiData, count: propsData.count, search: propsData.search })
                        : propsData?.from ? History.push(propsData.from, { mainTab: propsData?.mainTab, subTab: propsData?.subTab, page: propsData.page, search: propsData.search, apiData: propsData.apiData, count: propsData.count })
                        : History.goBack()
                    }
                    }}
                  >
                    <img
                                  className="back_arrow"
                                  src={Icones.arrow_left_pagination}
                                  alt=""/>
                    Back
                  </Button>
                </div>
              </Grid>
            </Grid>

            {/* {loading && <Loader />} */}

            <div
              className="  salesdomestic-work-pt"
              style={{ marginBottom: "10%" }}
            >
              <Grid className="">
                <div className={classes.root}>
                  {modalView === 0 && (
                    <CompanyDetails
                      isViewOnly={isViewOnly}
                      ref={childRef}
                      clientId={clientId}
                      companyId={companyId}
                      email={email}
                      ordersPcs={orderPcs}
                      changetab={changeTab}
                    />
                  )}
                  {modalView === 1 && (
                    <ProductAllocation
                      isViewOnly={isViewOnly}
                      ref={childRef}
                      treeView={treeView}
                      expDtTime={expDtTime}
                      shortcut={shortcut}
                      categoryFlag={categoryFlag}
                      expDate={expDate}
                      selectedStaging={selectedStaging}
                    />
                  )}
                  {modalView === 2 && 
                     <OrderHistory client_id={clientId} propsData={propsData} />
                  }

                </div>
                {modalView === 1 && (
                  <>
                    <Button
                      id="btn-save"
                      className="mr-20 ml-16 mx-auto "
                      aria-label="Register"
                      style={{ float: "right" }}
                      //   disabled={!isFormValid()}
                      // type="submit"
                      onClick={(e) => {
                        // handleFormSubmit(e);
                        // History.goBack();
                        {
                          (path_name === "/dashboard/mobappadmin/distributormaster/createdistributor") ?
                          History.push('/dashboard/mobappadmin/distributormaster', { page: propsData.page, search: propsData.search, apiData: propsData.apiData, count: propsData.count, search: propsData.search }) : History.goBack()
                        }
                      }}
                    >
                      Cancel
                    </Button>

                    <Button
                      id="btn-save"
                      className="ml-16 mx-auto "
                      aria-label="Register"
                      style={{ float: "right" }}
                      // disabled={isView}
                      // type="submit"
                      onClick={() => checkDetails()}
                      // onClick={(e) => {
                      //     // handleFormSubmit(e);
                      // }}
                    >
                      Submit
                    </Button>
                  </>
                )}
              </Grid>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default CreateDistributor;
