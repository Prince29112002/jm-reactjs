import React, { useEffect, useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import CompanyDetails from "./SubView/CompanyDetails";
import { useDispatch } from "react-redux";
import clsx from "clsx";
import { Typography, Button } from "@material-ui/core";
import { FuseAnimate } from "@fuse";
import ProductAllocation from "./SubView/ProductAllocation";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import History from "@history";
import moment from "moment";
import OrderHistory from "../../DistributorMaster/CreateDistributor/SubView/OrderHistory";
import Icones from 'assets/fornt-icons/Mainicons';

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100px",
  },
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
}));


const CreateCompany = (props) => {
  const classes = useStyles();
const path_name_ = props.location.pathname
  const propsData = props.location.state;

  const [isViewOnly, setIsViewOnly] = useState(false);

  const [modalView, setModalView] = useState(0);

  const [oneData, setOneData] = useState("")

  const [isEdit, setIsEdit] = useState(false)
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const dispatch = useDispatch();

  const [treeView, setTreeView] = useState("")//if already allocated then showing selected
  const [expDtTime, setExpDtTime] = useState("")
  const [categoryFlag, setCategoryFlag] = useState("")
  const [expDate, setExpDate] = useState("")
  const [shortcut, setShortcut] = useState("")
  const [selectedStaging, setSelectedStaging] = useState("")

  const childRef = useRef();

  const handleChangeTab = (event, value) => {
      // setModalView(value);
      if (value === 1) {
          changeTab()
      } else {
          setModalView(value);
      }
  };

  // useEffect(() => {
  //     console.log("productData", props);
  //     // setProductData(props.productData);
  //     //eslint-disable-next-line
  // }, [props]);

  useEffect(() => {
      return () => {
          console.log("cleaned up");
      };
  }, []);


  useEffect(() => {
      NavbarSetting('Mobile-app Admin', dispatch)
      // eslint-disable-next-line
  }, [])

  useEffect(() => {
      console.log("idToBeEdited", propsData);
      if (propsData !== undefined) {
          setIsViewOnly(propsData.isViewOnly);
          setIsEdit(propsData.isEdit)
          if (propsData.isViewOnly === true || propsData.isEdit === true) {
              GetOneRetailer();
          }
          // getRateProfileData();
      }
      //eslint-disable-next-line
  }, []);

  function GetOneRetailer() {
      axios
          .get(Config.getCommonUrl() + "api/retailerMaster/" + propsData.row)
          .then(function (response) {
              if (response.data.success === true) {
                  console.log(JSON.stringify(response.data.data));
                  var data = response.data.data;
                  setOneData(data)
                  setExpDtTime(data.expiry_date_time?.toString())
                  setShortcut(data.shortcut?.toString())
                  setCategoryFlag(data.is_category?.toString())
                  // setCompanyId({
                  //     value: tempData.company_id,
                  //     label: tempData.company.company_name
                  // })
                  // setExpDate(moment(new Date(data.date_time)).format("YYYY-MM-DD hh:mm:ss"))
                  setExpDate(moment(data.date_time).utc().format("YYYY-MM-DD hh:mm:ss A"))

                  const tempTree = []
                  data.productAllocationRetailer.map((item) => {
                      tempTree.push({
                          value: item.product_category_id,
                          label: item.ProductCategoryDetails?.category_name,
                          children: []
                      })
                  })
                  if (data.is_category == 0) {
                      setSelectedStaging({
                          value: data.retailerStaging?.id,
                          label: data.retailerStaging?.name
                      })
                  }
                  setTreeView(tempTree)
                  console.log(tempTree)
              } else {
                  dispatch(Actions.showMessage({ message: response.data.message }));
              }
          })
          .catch((error) => {
              handleError(error, dispatch, { api: "api/retailerMaster/" + propsData.row })

          });
  }

  function changeTab() {
      if (childRef?.current?.checkValidation()) {
          const data = childRef.current.getData()
          console.log(data)
          // console.log(oneData)
          let temp = {
              ...oneData,
              company_name: data.company_name,
              pincode: data.pincode,
              "country_name": {
                  "id": data.country_name.value,
                  "name": data.country_name.label
              },
              "state_name": {
                  "id": data.state_name.value,
                  "name": data.state_name.label
              },
              "city_name": {
                  "id": data.city_name.value,
                  "name": data.city_name.label
              },
              address: data.address,
              company_mob: data.company_mob,
              company_tel: data.company_tel,
              company_email_for_orders: data.company_email_for_orders,
              gst_in: data.gst_in,
              pan_number: data.pan_number,
              order_pieces: data.order_pieces,
              client_id: data.client_id,
              first_country_id:data.first_country_id,
              // retailer: oneData.retailer.filter(item => data.client_id.includes(item.Distributor?.id))
              retailer: updateRetailerArr(oneData.retailer, data.client_id)// oneData.retailer.filter(item => data.client_id.includes(item.Distributor?.id))
          }
          console.log("temp", temp)
          setOneData(temp)
          setModalView(1);
      }
  }

  function updateRetailerArr(retailer, client_id) {
      //if any removed
      let tempRetData = retailer?.filter(array => client_id.some(filter => (filter.value === array.Distributor?.id)))
      // console.log("tempRetData", tempRetData)
      if (tempRetData === undefined) tempRetData = []
      //if any new added
      let newClientData = client_id.filter(array => !tempRetData?.some(filter => (filter.Distributor?.id === array.value)))
      // console.log("newClData", newClientData)
      for (let i = 0; i < newClientData.length; i++) {
          tempRetData.push({
              Distributor: {
                  id: newClientData[i].value,
                  name: newClientData[i].label
              }
          })
      }
      return tempRetData;
  }

  function checkDetails(e) {
      e.preventDefault()
      if (childRef.current.checkValidation()) {
          // const mainIds = childRef.current.finalArrIds();
          // console.log(mainIds)
          setButtonDisabled(true);
          const data = childRef.current.getData();
          const cateArr = [];
          data.product_category_id.map((curVal) => {
              cateArr.push(curVal.value);
              return null
          });
          const clientArr = []
          oneData.client_id.map((item) => clientArr.push(item.value))
          console.log(oneData);
          let dateFormat = ''
          if(data.expiry_date_time == 1){
             dateFormat = new Date(data.date_time).toISOString()// moment(new Date(data.date_time)).format("YYYY-MM-DD h : i : s"),
          }

          const body = {
              "company_name": oneData.company_name,
              "country_id": oneData.country_name.id,
              "state_id": oneData.state_name.id,
              "city_id": oneData.city_name.id,
              "pincode": oneData.pincode,
              "address": oneData.address,
              "company_mob": oneData.company_mob,
              "company_tel": oneData.company_tel,
              "company_email_for_orders": oneData.company_email_for_orders,
              "gst_in": oneData.gst_in,
              "pan_number": oneData.pan_number,
              // "under_distributor_name": partyType.label,
              "client_id": clientArr,//client id in array might be multiple so
              "order_pieces": oneData.order_pieces,
              "first_country_id":oneData.first_country_id,
              expiry_date_time: data.expiry_date_time,
            
              is_category: data.is_category,
              ...((data.is_category == "1") && {
                  product_category_id: cateArr,
              }),
              ...((data.is_category == "0") && {
                  "staging_id": data.staging_id,
              }),
              ...((data.expiry_date_time == "2") && {
                  "date_time": data.shortcut ,
                  "shortcut":  ""
              }),
              ...((data.expiry_date_time !== "2") && {
                  "date_time": dateFormat ,
                  "shortcut":  data.shortcut
              }),
          }
          console.log(body)
          if (isEdit === true) {
              updateCompany(body)
          } else {
              createCompany(body)
          }
      }
  }

  function createCompany(body) {

      axios
          .post(Config.getCommonUrl() + "api/retailerMaster", body)
          .then(function (response) {
              console.log(response);
              setButtonDisabled(false);
              if (response.data.success === true) {
                  // response.data.data
                  // setGoldColor("");
                  History.goBack(); //.push("/dashboard/masters/vendors");

                  dispatch(Actions.showMessage({ message: response.data.message }));
              } else {
                  dispatch(Actions.showMessage({ message: response.data.message }));
              }
          })
          .catch((error) => {
              handleError(error, dispatch, { api: "api/retailerMaster", body: body })

          });
  }

  function updateCompany(body) {

      axios
          .put(Config.getCommonUrl() + "api/retailerMaster/" + oneData.id, body)
          .then(function (response) {
              console.log(response);
              setButtonDisabled(false);
              if (response.data.success === true) {
                  dispatch(Actions.showMessage({ message: response.data.message }));
                  propsData.apiData.splice(propsData.page*10)
                  History.push('/dashboard/mobappadmin/retailermaster',
                   {iseditView : true, page : propsData.page ,
                       search : propsData.search , 
                       apiData : propsData.apiData, 
                       count : propsData.count})
              } else {
                  dispatch(Actions.showMessage({ message: response.data.message }));
              }
          })
          .catch((error) => {
              handleError(error, dispatch, { api: "api/retailerMaster/" + oneData.id, body: body })
          });
  }


  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0">
            <Grid
              className="department-main-dv"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={7} sm={7} md={7} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="p-16 pb-8 text-18 font-700">
                    {/* Orders */}
                    {/* {isView ? "View Sales Invoice (Jobwork)" : "Add Sales Invoice (Jobwork)"} */}
                  </Typography>
                </FuseAnimate>
                {/* {!isView && <BreadcrumbsHelper />} */}
                {/* <BreadcrumbsHelper /> */}
              </Grid>
              <Grid
                   item xs={5} sm={5} md={5}
                   key="2"
                   style={{ textAlign: "right" }}
                   >
                   <div className="btn-back mt-2">
                    <Button
                      id="btn-back"
                      size="small"
                      onClick={(event) => { (isViewOnly && path_name_ === "/dashboard/mobappadmin/retailermaster/createretailer" ) || isEdit?
                      History.push('/dashboard/mobappadmin/retailermaster', { page : propsData.page , search : propsData.search , apiData : propsData.apiData, count : propsData.count})
                      : propsData?.from ? History.push(propsData.from ,{mainTab : propsData?.mainTab , subTab : propsData?.subTab,page : propsData.page , search : propsData.search , apiData : propsData.apiData, count : propsData.count}) 
                      :History.goBack()
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
              className="pl-8 pr-8  salesdomestic-work-pt"
              style={{ marginBottom: "10%" }}
            >
              <Grid container spacing={3}></Grid>

              <Grid className="">
                <div className={classes.root}>
                  <Tabs
                    value={modalView}
                    onChange={handleChangeTab}
                    className="ml-32"
                  >
                    <Tab label="Company Details" />
                    <Tab label="Product Allocation" />
                    <Tab label="Order History" />

                  </Tabs>
                  {modalView === 0 && (
                    <>
                      <CompanyDetails
                        isViewOnly={isViewOnly}
                        oneData={oneData}
                        isEdit={isEdit}
                        ref={childRef}
                      />

                      <Button
                        variant="contained"
                        id="btn-save"
                        color="primary"
                        className="mx-auto mt-4 float-right mr-20"
                        aria-label="Register"
                        // disabled={isView}
                        // type="submit"
                        onClick={() => changeTab()}
                      >
                        Next
                      </Button>
                    </>
                    // <CompanyDetails isViewOnly={isViewOnly} ref={childRef} clientId={clientId} companyId={companyId} email={email} ordersPcs={orderPcs} changetab={changeTab} />
                  )}
                  {modalView === 1 && (
                    <>
                      <ProductAllocation
                        isViewOnly={isViewOnly}
                        ref={childRef}
                        treeView={treeView}
                        expDtTime={expDtTime}
                        categoryFlag={categoryFlag}
                        expDate={expDate}
                        shortcut={shortcut}
                        selectedStaging={selectedStaging}
                      />

                      <Button
                        id="btn-save"
                        className="ml-16  mx-auto  mr-20"
                        aria-label="Register"
                        style={{ float: "right" }}
                        //   disabled={!isFormValid()}
                        // type="submit"
                        onClick={(event) => { (isViewOnly && path_name_ === "/dashboard/mobappadmin/retailermaster/createretailer" ) || isEdit?
                        History.push('/dashboard/mobappadmin/retailermaster', { page : propsData.page , search : propsData.search , apiData : propsData.apiData, count : propsData.count})
                        : propsData?.from ? History.push(propsData.from ,{mainTab : propsData?.mainTab , subTab : propsData?.subTab,page : propsData.page , search : propsData.search , apiData : propsData.apiData, count : propsData.count}) 
                        :History.goBack()
                    }}
                      >
                        Cancel
                      </Button>

                      <Button
                        id="btn-save"
                        variant="contained"
                        color="primary"
                        className="ml-16 mx-auto "
                        aria-label="Register"
                        style={{ float: "right" }}
                        disabled={isViewOnly || isButtonDisabled}
                        type="submit"
                        onClick={(e) => checkDetails(e)}
                      >
                        Submit
                      </Button>
                    </>
                  )}

                 {modalView === 2 && 
                  <OrderHistory client_id={oneData.id} propsData={propsData} />}

                </div>
              </Grid>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default CreateCompany;
