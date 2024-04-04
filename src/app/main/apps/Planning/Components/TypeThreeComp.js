import React, { useState, useEffect } from "react";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  TextField,
  Icon,
  IconButton,
  Divider,
  Link,
  Checkbox,
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Loader from "app/main/Loader/Loader";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Select, { createFilter } from "react-select";
import UploadFile from "./UploadFile";
import HelperFunc from "../../SalesPurchase/Helper/HelperFunc";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import EditDesignModal from "./EditDesignModal";
import History from "@history";

const useStyles = makeStyles((theme) => ({
  root: {},
  tabroot: {
    overflowX: "auto",
    overflowY: "auto",
    // height: "100%",
  },
  modalStyle: {
    background: "#FFFFFF",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "#000000",
    position: "absolute",
  },
  tableRowPad: {
    padding: 7,
  },
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "white",
  },
  normalSelect: {
    padding: 8,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 0,
    width: "100%",
  },
  textOverFlow: {
    display: "block",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  errorMessage: {
    color: "#f44336",
    position: "absolute",
    bottom: "-2px",
    fontSize: "9px",
    lineHeight: "8px",
    marginTop: 3,
  },
}));

const TypeThreeComp = (props) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");
  const [orderOneDetail, setOrderOneDetail] = useState({
    orderNumber: "",
    customername: [],
    retailerName: "",
    rhodiumStone: "",
    rhodiumPlainPart: "",
    rhodiumRemark: "",
    sandblastingDull: "",
    satinDull: "",
    dullTextureRemark: "",
    enamel: "",
    enamelRemark: "",
    additionalColorStone: "",
    additionalColorRemark: "",
    finalOrderRemark: "",
    salesPersonName: [],
    karat: "",
    weight: "",
    stockGroup: "",
    stockNameCode: "",
    stockType: "",
    shipmentDate: "",
  });
  const [ordernumber, setoedernumber] = useState("");
  const [ordernumberErr, setordernumberErr] = useState("");

  const [customername, setcustomername] = useState("");
  const [customernameErr, setcustomernameErr] = useState("");

  const [Weight, setWeight] = useState("");
  const [WeightErr, setWeightErr] = useState("");

  const [remarkone, setremarkone] = useState("");
  const [remarkoneErr, setremarkoneErr] = useState("");

  const [remarktwo, setremarktwo] = useState("");
  const [remarktwoErr, setremarktwoErr] = useState("");

  const [remarkthree, setremarkthree] = useState("");
  const [remarkthreeErr, setremarkthreeErr] = useState("");

  const [remarkfore, setremarkfore] = useState("");
  const [remarkforeErr, setremarkforeErr] = useState("");

  const [StockGroup, setStockGroup] = useState([]);
  const [selectStockGroup, setselectStockGroup] = useState("");
  const [stockGroupErr, setstockGroupErr] = useState("");
  const [StockCategory, setStockCategory] = useState([]);
  const [selectCategory, setselectCategory] = useState("");
  const [stockTypeErr, setstockTypeErr] = useState("");
  const [retailerdata, setretailerdata] = useState([]);
  const [selectretailerdata, setselectretailerdata] = useState("");
  const [selectretailerdataErr, setselectretailerdataErr] = useState("");
  const [Salesdata, setSalesdata] = useState([]);
  const [selectSalesdata, setselectSalesdata] = useState("");
  const [selectSalesdataErr, setselectSalesdataErr] = useState("");
  const [ShipmentDate, setShipmentDate] = useState("");
  const [ShipmentDateErr, setShipmentDateErr] = useState("");

  const [isEdit, setIsEdit] = useState(false);

  const [isView, setIsView] = useState(false);

  const [orderData, setOrderData] = useState("");

  const [retailer, setRetailer] = useState([]);
  const [distributerArr, setDistributerArr] = useState([]);
  const [distributer, setDistributer] = useState("");
  const [distributerErr, setDistributerErr] = useState("");

  const [rhodiumOnStone, setRhodiumOnStone] = useState("");
  const [rhodiumOnStoneErr, setRhodiumOnStoneErr] = useState("");

  const [rhodiumOnPlainPart, setRhodiumOnPlainPart] = useState("");
  const [rhodiumOnPlainPartErr, setRhodiumOnPlainPartErr] = useState("");
  const [retailerList, setRetailerList] = useState([]);
  const [retailerErr, setRetailerErr] = useState("");
  const [rhodiumRemark, setRhodiumRemark] = useState("");
  const [karatMain, setKaratMain] = useState("");
  console.log(karatMain);
  const [karatMainErr, setKaratMainErr] = useState("");
  const [SandblastingDull, setSundblastingDull] = useState("");
  const [SandblastingDullErr, setSundblastingDullErr] = useState("");

  const [satinDull, setSatinDull] = useState("");
  const [satinDullErr, setSatinDullErr] = useState("");

  const [dullTexureRemark, setDullTexureRemark] = useState("");

  const [enamel, setEnamel] = useState("");
  const [enamelErr, setEnamelErr] = useState("");
  const karatArr = [{ value: 14 }, { value: 18 }, { value: 20 }, { value: 22 }];
  const [enamelRemark, setEnamelRemark] = useState("");

  const [additionStoneColor, setAdditionalStoneColor] = useState("");
  const [additionStoneColorErr, setAdditionalStoneColorErr] = useState("");

  const [additionalColorRemark, setAdditionalColorRemark] = useState("");

  const [finalOrderRemark, setFinalOrderRemark] = useState("");

  const [screwType, setScrewType] = useState([]);
  const [screwTypeErr, setScrewTypeErr] = useState("");

  const [apiData, setApiData] = useState([]);

  const [addFlag, setAddFlag] = useState(true);
  const [editFlag, setEditFlag] = useState(false);

  const [open, setOpen] = useState(false);

  const [showAddBtn, setShowAddBtn] = useState(true);

  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [swappingOpen, setSwappingOpen] = useState(false);
  const handleOpenModal = () => setSwappingOpen(true);
  const handleSwappingClose = () => setSwappingOpen(false);

  const [Stockcode, setStockcode] = useState([]);
  const [selectStockcode, setselectStockcode] = useState("");
  const [stockcodeErr, setstockcodeErr] = useState("");

  const [lotSwapeList, setLotSwapeList] = useState([]);
  const [selectedLot, setSelectedLot] = useState(null);
  const [lotSwapeId, setLotSwapeId] = useState([]);
  const [collectionCSV, setCollectionCSV] = useState(null);

  const [lotSwappingData, setLotSwappingData] = useState({});

  useEffect(() => {
    getLotSwapeList();
  }, []);

  const [orderType, setOrderType] = useState("");
  const screwTypeArr = [
    { id: 1, label: "Bombay Post with Screw" },
    { id: 2, label: "Bombay Post without Screw" },
    { id: 3, label: "South Screw" },
    { id: 4, label: "Push Butterfly Screw" },
  ];
  const [updtRecord, setUpdtRecord] = useState({
    designNo: "",
    karat: "",
    pcs: "",
    grossWt: "",
    netWt: "",
    remarks: "",
    stoneWt: "",
    stonepcs: "",
    FineWt: "",
    total_stone_difference: "",
    imageUrl: "",
    batchNo: "",
    errors: {
      designNo: null,
      karat: null,
      pcs: null,
      grossWt: null,
      netWt: null,
      remarks: null,
      FineWt: null,
      imageUrl: null,
    },
  });
  const [searchData, setSearchData] = useState({
    design_no: "",
    batch_no: "",
    lot_no: "",
    qty: "",
    gross_weight: "",
    stone_weight: "",
    net_weight: "",
    fine_weight: "",
  });
  const [designApiData, setDesignApiData] = useState([]);

  const [editDesignModal, setEditDesignModal] = useState(false);
  const [designData, setDesignData] = useState([]);

  const [selectedDesign, setSelectedDesign] = useState([]);
  const [designArray, setDesignArray] = useState([]);
  const [filteredData, setFilteredData] = useState(apiData);
  useEffect(() => {
    NavbarSetting("Planing", dispatch);
  }, []);

  const [designSearch, setDesignSearch] = useState("");
  useEffect(() => {
    if (distributer) {
      // getRetailerList();
    }
  }, [distributer]);
  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);
  useEffect(() => {
    const grossWt = HelperFunc.getTotalOfField(apiData, "gross_weight");
    console.log(grossWt, "123456789");
    setWeight(grossWt);
  }, [apiData]);

  const [firstTime, setFirstTime] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (designSearch) {
        getDesignData(designSearch);
      } else {
        setDesignApiData([]);
      }
    }, 800);
    return () => {
      console.log("clearTimeout");

      clearTimeout(timeout);
    };
    //eslint-disable-next-line
  }, [designSearch]);

  const applyFilter = () => {
    // Check if any search field is non-empty
    const hasSearchCriteria = Object.values(searchData).some(
      (value) => value !== ""
    );

    if (!hasSearchCriteria) {
      // If no search criteria, show all data
      setFilteredData(apiData);
      return;
    }

    // Apply filtering
    const filtered = apiData.filter((temp) => {
      if (searchData.design_no && temp.Design) {
        return temp.Design.variant_number
          .toLowerCase()
          .includes(searchData.design_no.toLowerCase());
      }
      if (searchData.batch_no) {
        return temp.batch_number
          .toLowerCase()
          .includes(searchData.batch_no.toLowerCase());
      }
      if (searchData.lot_no) {
        return temp.lot_number
          .toLowerCase()
          .includes(searchData.lot_no.toLowerCase());
      }
      if (searchData.qty) {
        return temp.pieces === parseFloat(searchData.qty);
      }
      if (searchData.gross_weight) {
        return temp.gross_weight
          .toLowerCase()
          .includes(searchData.gross_weight.toLowerCase());
      }
      if (searchData.stone_weight) {
        return temp.stone_weight
          .toLowerCase()
          .includes(searchData.stone_weight.toLowerCase());
      }
      if (searchData.net_weight) {
        return temp.net_weight
          .toLowerCase()
          .includes(searchData.net_weight.toLowerCase());
      }
      if (searchData.fine_weight) {
        return temp.fine_weight
          .toLowerCase()
          .includes(searchData.fine_weight.toLowerCase());
      }

      return true; // Return true by default
    });

    // Update filtered data state
    setFilteredData(filtered);
  };

  useEffect(() => {
    applyFilter();
  }, [searchData, apiData]);

  function getDesignData(designNo) {
    axios
      .get(
        Config.getCommonUrl() + `api/productionorder/search/variant/${designNo}`
      )
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          console.log(response.data.data);

          if (response.data.data.length > 0) {
            setDesignApiData(response.data.data);
          } else {
            setDesignApiData([]);
            dispatch(
              Actions.showMessage({
                message: "Please Insert Proper Job No",
                variant: "error",
              })
            );
          }
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/productionorder/search/variant/${designNo}`,
        });
      });
  }

  useEffect(() => {
    setIsView(props.isView);
    if (props.isView) {
      setAddFlag(false);
    }
    setIsEdit(props.isEdit);
    if (props.isEdit) {
      // getDistributerList();
      getStockGroups();
      // getProductCategories();
      getRetailerMasterData();
      // getSalesMen();
    }
    if (props.apiData?.id) setApiData(props.apiData.ProductionOrderDesigns);
    const arrData = props.apiData;
    console.log(arrData);
    if (!Array.isArray(arrData)) {
      setOrderData(arrData);
      setOrderOneDetail({
        orderNumber: arrData.order_number,
        customername: {
          value: arrData.distributor?.client.id,
          label: arrData.distributor?.client.name,
        },
        // retailerName: {
        //   value: arrData.retailer.id,
        //   label: arrData.retailer.company_name,
        // },
        rhodiumStone: arrData.rhodium_on_stone_percentage,
        rhodiumPlainPart: arrData.rhodium_on_plain_part_percentage,
        rhodiumRemark: arrData.rhodium_remarks,
        sandblastingDull: arrData.sandblasting_dull_percentage,
        satinDull: arrData.satin_dull_percentage,
        dullTextureRemark: arrData.dull_texture_remark,
        enamel: arrData.enamel_percentage,
        enamelRemark: arrData.enamel_remark,
        additionalColorStone: arrData.additional_color_stone,
        additionalColorRemark: arrData.additional_color_remark,
        finalOrderRemark: arrData.final_order_remark,
        salesPersonName: {
          value: arrData.StockGroup?.id,
          label: arrData.StockGroup?.group_name,
        },
        karat: arrData.karat,
      });
      // if (arrData.stock_name_id) {
      getStockcode(arrData.stock_name_id);
      // }
      setRetailer(arrData.retailer?.company_name);
      setOrderType(arrData.order_type);
      setoedernumber(arrData.order_number);
      setcustomername(arrData.customer_name);
      setRetailer({
        value: arrData.retailer_id,
        label: arrData.RetailerMaster?.company_name,
      });
      setRetailer({
        value: arrData.RetailerMaster?.id,
        label: arrData.RetailerMaster?.company_name,
      });
      setDistributer({
        value: arrData.distributor?.client_id,
        label: arrData.distributor?.client.name,
      });
      setselectSalesdata({
        value: arrData.SalesMan?.id,
        label: arrData.SalesMan?.full_name,
      });
      setKaratMain({
        value: arrData.karat,
        label: arrData.karat,
      });
      // setWeight(arrData.weight)
      setselectStockGroup({
        value: arrData.StockGroup?.id,
        label: arrData.StockGroup?.group_name,
      });
      setselectStockcode({
        value: arrData.Stock_name_code?.id,
        label: arrData.Stock_name_code?.stock_code,
      });
      setselectCategory({
        value: arrData.ProductCategor?.id,
        label: arrData.ProductCategory?.billing_category_name,
      });
      setremarkone(arrData.order_remark_1);
      setremarktwo(arrData.order_remark_2);
      setremarkthree(arrData.order_remark_3);
      setremarkfore(arrData.order_remark_4);
      setShipmentDate(arrData.shipment_date);
      // setKaratMain(arrData.karat);
      updtRecord.karat = arrData.karat;
      setUpdtRecord(updtRecord);
      console.log(updtRecord, "updtRecordupdtRecordupdtRecord");
      screwTypeArr.map((item) => {
        if (item.label === arrData.screw_type) {
          setScrewType({
            value: item.id,
            label: item.label,
          });
        }
      });
    }
  }, [props]);

  function getDistributerList() {
    axios
      .get(Config.getCommonUrl() + `api/client/all/client`)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          console.log(response.data.data);
          setDistributerArr(response.data.data);
        } else {
          setDistributerArr([]);
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/client/all/client`,
        });
      });
  }

  // function editHandler(id) {
  //   setAddFlag(false);

  //   let index = apiData.findIndex((item) => item.id === id);
  //   if (index > -1) {
  //     setFirstTime(true);

  //     setUpdtRecord({
  //       designNo: apiData[index].Design.variant_number,
  //       design_id: apiData[index].design_id,
  //       karat: apiData[index].karat,
  //       pcs: apiData[index].pieces,
  //       grossWt: apiData[index].gross_weight,
  //       netWt: apiData[index].net_weight,
  //       remarks: apiData[index].comment,
  //       FineWt: apiData[index].fine_weight,
  //       stoneWt: apiData[index].stone_weight,
  //       imageUrl:
  //         apiData[index].Design.image_files.length > 0
  //           ? apiData[index].Design.image_files[0].image_file
  //           : Config.getjvmLogo(),
  //       errors: {
  //         designNo: null,
  //         karat: null,
  //         pcs: null,
  //         grossWt: null,
  //         netWt: null,
  //         remarks: null,
  //         stoneWt: null,
  //         FineWt: null,
  //         imageUrl: null,
  //       },
  //     });
  //     // setDesignSearch(apiData[index].design.variant_number)

  //     let tempApi = [...apiData];
  //     tempApi[index].isEdit = true;
  //     setSelectedIdForEdt(id);
  //     setApiData(tempApi);
  //     setShowAddBtn(false);
  //     setEditFlag(true);
  //   }
  // }

  // const handleChangeScrew = (value) => {
  //   setScrewType(value);
  //   setScrewTypeErr("");
  // };

  // const handleChangeDistributer = (value) => {
  //   setDistributer(value);
  //   setDistributerErr("");
  // };

  function deleteHandler(id) {
    setSelectedIdForDelete(id);
    setOpen(true);
  }

  function handleClose() {
    setSelectedIdForDelete("");
    setOpen(false);
  }

  function callDeleteApi() {
    const body = {
      id: selectedIdForDelete,
      order_id: orderData.id,
    };
    axios
      .post(
        Config.getCommonUrl() + "api/ProductionOrder/remove-order-design/",
        body
      )
      .then(function (response) {
        console.log(response);
        setOpen(false);
        if (response.data.success === true) {
          // selectedIdForDelete
          props.callApi(orderData.id);
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          setSelectedIdForDelete("");
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
      })
      .catch((error) => {
        setOpen(false);
        handleError(error, dispatch, {
          api: "api/ProductionOrder/remove-order-design/",
          body: body,
        });
      });
  }

  const classes = useStyles();

  function cancelAdd() {
    // setAddFlag(false);
    setEditFlag(false);
    setFirstTime(false);
    setUpdtRecord({
      designNo: "",
      karat: "",
      pcs: "",
      grossWt: "",
      netWt: "",
      remarks: "",
      imageUrl: "",
      stoneWt: "",
      total_stone_difference: "",
      stonepcs: "",
      FineWt: "",
      errors: {
        designNo: null,
        karat: null,
        pcs: null,
        grossWt: null,
        netWt: null,
        remarks: null,
        imageUrl: null,
        stoneWt: null,
        FineWt: null,
      },
    });
    setDesignApiData([]);
    setShowAddBtn(true);
    setDesignSearch("");
  }

  function validateIsAdded(temp) {
    console.log(temp);
    const tempRecord = { ...updtRecord };
    const mainArr = temp ? temp : [...apiData];
    let result = true;
    console.log(tempRecord, mainArr);

    mainArr.map((item) => {
      if (
        item.Design.variant_number === tempRecord.designNo
        // item.karat == tempRecord.karat
      ) {
        result = false;
        dispatch(
          Actions.showMessage({
            message: "This Entry already exist",
            variant: "error",
          })
        );
      }
    });
    return result;
  }

  function addRecord() {
    //validate , call add api then do this
    if (validateIsAdded() && validateRecord()) {
      setAddFlag(true);
      AddNewOrderApi();
    }
  }

  function AddNewOrderApi() {
    console.log(updtRecord);
    const body = {
      // "id": 1,
      design_id: designApiData[0].id,
      karat: updtRecord.karat,
      order_id: orderData.id,
      pieces: parseFloat(updtRecord.pcs),
      gross_weight: updtRecord.grossWt,
      fine_weight: updtRecord.FineWt,
      net_weight: updtRecord.netWt,
      stone_pieces: updtRecord.stonepcs,
      stone_weight: updtRecord.stoneWt,
      stone_difference: updtRecord.total_stone_difference,
      variant_no: updtRecord.designNo,
    };

    axios
      .post(
        Config.getCommonUrl() + "api/ProductionOrder/add-order-design-info",
        body
      )
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          setAddFlag(true);
          setEditFlag(false);
          setShowAddBtn(true);

          setUpdtRecord({
            designNo: "",
            karat: "",
            pcs: "",
            grossWt: "",
            netWt: "",
            remarks: "",
            imageUrl: "",
            stoneWt: "",
            stonepcs: "",
            FineWt: "",
            total_stone_difference: "",

            errors: {
              designNo: null,
              karat: null,
              pcs: null,
              grossWt: null,
              netWt: null,
              remarks: null,
              imageUrl: null,
              stoneWt: null,
              FineWt: null,
            },
          });
          setDesignApiData([]);
          setDesignSearch("");

          props.callApi(orderData.id);
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/ProductionOrder/add-order-design-info",
          body: body,
        });
      });
  }

  useEffect(() => {
    const timeouttwo = setTimeout(() => {
      let tempRecord = { ...updtRecord };

      let pass = true;
      if (tempRecord.designNo === "") {
        pass = false;
      }

      if (tempRecord.karat === "") {
        pass = false;
      }
      let percentRegex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;

      if (
        tempRecord.pcs === "" ||
        percentRegex.test(tempRecord.pcs) === false
      ) {
        pass = false;
      }

      if (editFlag && pass) {
        if (firstTime === false) {
          getWeightsForDesign();
        } else {
          setFirstTime(false);
        }
      } else if (addFlag && pass) {
        getWeightsForDesign();
      }
    }, 800);
    return () => {
      clearTimeout(timeouttwo);
    };
    //eslint-disable-next-line
  }, [updtRecord.designNo, updtRecord.karat, updtRecord.pcs]);

  function getWeightsForDesign() {
    setLoading(true);
    axios
      .post(
        Config.getCommonUrl() + "api/productionorder/designWeightCalculation",
        {
          variant_number: updtRecord.designNo,
          karat: karatMain.label,
          pcs: updtRecord.pcs,
        }
      )
      .then(function (response) {
        console.log(response);

        setLoading(false);
        if (response.data.success === true) {
          let tempRecord = { ...updtRecord };
          tempRecord.grossWt = response.data.data.total_gross_weight;
          tempRecord.FineWt = response.data.data.total_fine_weight;
          tempRecord.netWt = response.data.data.total_net_weight;
          tempRecord.total_stone_difference =
            response.data.data.total_stone_difference;
          tempRecord.stonepcs = response.data.data.total_stone_pieces;
          tempRecord.stoneWt = response.data.data.total_stone_weight;
          setUpdtRecord(tempRecord);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {
          api: "api/productionorder/designWeightCalculation",
          body: {
            variant_number: updtRecord.designNo,
            karat: Number(updtRecord.karat),
            pcs: updtRecord.pcs,
          },
        });
      });
  }

  // function updateRecord(id) {
  //   console.log(id);
  //   let temp = apiData.filter((x) => x.id !== selectedIdForEdt);

  //   if (validateIsAdded(temp) && validateRecord()) {
  //     updateOrderApi(id);
  //   }
  // }

  // function cancelUpdtRecord(id) {
  //   setAddFlag(true);

  //   let index = apiData.findIndex((item) => item.id === id);
  //   if (index > -1) {
  //     let tempApi = [...apiData];
  //     tempApi[index].isEdit = false;
  //     setEditFlag(false);
  //     setApiData(tempApi);
  //     setSelectedIdForEdt("");
  //     setUpdtRecord({
  //       designNo: "",
  //       karat: "",
  //       pcs: "",
  //       grossWt: "",
  //       netWt: "",
  //       remarks: "",
  //       imageUrl: "",
  //       stoneWt: "",
  //       stonepcs: "",
  //       FineWt: "",
  //       total_stone_difference: "",

  //       errors: {
  //         designNo: null,
  //         karat: null,
  //         pcs: null,
  //         grossWt: null,
  //         netWt: null,
  //         remarks: null,
  //         imageUrl: null,
  //         stoneWt: null,
  //         FineWt: null,
  //       },
  //     });
  //     setDesignApiData([]);
  //     setDesignSearch("");
  //     setShowAddBtn(true);
  //   }
  // }

  const handleModalClose = (callApi) => {
    setOpenModal(false);
    if (callApi) {
      props.callApi(orderData.id);
    }
  };

  // function updateOrderApi(id) {
  //   //remove selected and add new
  //   console.log(updtRecord);
  //   const body = {
  //     id: selectedIdForEdt,
  //     design_id: updtRecord.design_id,
  //     variant_no: updtRecord.designNo,
  //     karat: karatMain.label,
  //     order_id: orderData.id,
  //     pieces: updtRecord.pcs,
  //     gross_weight: updtRecord.grossWt,
  //     net_weight: updtRecord.netWt,
  //     fine_weight: updtRecord.FineWt,
  //     stone_pieces: updtRecord.stonepcs,
  //     stone_weight: updtRecord.stoneWt,
  //     stone_difference: updtRecord.total_stone_difference,
  //   };
  //   axios
  //     .put(
  //       Config.getCommonUrl() + "api/ProductionOrder/change-order-design-info",
  //       body
  //     )
  //     .then(function (response) {
  //       if (response.data.success === true) {
  //         let index = apiData.findIndex((item) => item.id === id);

  //         if (index > -1) {
  //           let tempApi = [...apiData];
  //           tempApi[index].isEdit = false;
  //           setSelectedIdForEdt("");
  //           setEditFlag(false);
  //           setAddFlag(true);
  //           setApiData(tempApi);

  //           setUpdtRecord({
  //             designNo: "",
  //             karat: "",
  //             pcs: "",
  //             grossWt: "",
  //             netWt: "",
  //             remarks: "",
  //             imageUrl: "",
  //             stoneWt: "",
  //             total_stone_difference: "",
  //             stonepcs: "",

  //             FineWt: "",
  //             errors: {
  //               designNo: null,
  //               karat: null,
  //               pcs: null,
  //               grossWt: null,
  //               netWt: null,
  //               remarks: null,
  //               imageUrl: null,
  //               stoneWt: null,
  //               FineWt: null,
  //             },
  //           });
  //           setDesignApiData([]);
  //           setDesignSearch("");
  //           setShowAddBtn(true);
  //         }

  //         props.callApi(orderData.id);
  //         dispatch(
  //           Actions.showMessage({
  //             message: response.data.message,
  //             variant: "success",
  //           })
  //         );
  //       } else {
  //         dispatch(
  //           Actions.showMessage({
  //             message: response.data.message,
  //             variant: "error",
  //           })
  //         );
  //       }
  //     })
  //     .catch((error) => {
  //       handleError(error, dispatch, {
  //         api: "api/ProductionOrder/change-order-design-info",
  //         body: body,
  //       });
  //     });
  // }
  const handleSelectDsgn = (row) => {
    console.log(row);
    const selectedIndex = designArray.findIndex(
      (item) => item.p_o_design_id === row.id
    );
    console.log(selectedIndex);
    if (selectedIndex === -1) {
      const updatedSelectedRows = [...designArray, { p_o_design_id: row.id }];
      setDesignArray(updatedSelectedRows);
    } else {
      const updatedSelectedRows = [...designArray];
      updatedSelectedRows.splice(selectedIndex, 1);
      setDesignArray(updatedSelectedRows);
    }
  };

  const handleSelectAll = (e) => {
    console.log(e.target.checked);
    if (!e.target.checked) {
      setDesignArray([]);
    } else {
      const designArray = filteredData.map((selectedRow) => {
        return { p_o_design_id: selectedRow.id };
      });
      setDesignArray(designArray);
    }
  };

  console.log(selectedDesign);
  console.log(designArray);

  function validateRecord() {
    let tempRecord = { ...updtRecord };
    // tempRecord[name] = value;
    // tempRecord.errors[name] = null;
    let pass = true;
    if (tempRecord.designNo === "") {
      // setDesignNoErr("Please Select Design No")
      tempRecord.errors.designNo = "Please Select Design No";
      pass = false;
    }

    if (tempRecord.karat === "") {
      tempRecord.errors.karat = "Please Select Karat";
      pass = false;
    }
    let percentRegex = /^[0-9]{1,6}$/;

    if (
      tempRecord.pcs === "" ||
      percentRegex.test(tempRecord.pcs) === false ||
      tempRecord.pcs == 0
    ) {
      tempRecord.errors.pcs = "Please Enter Pieces";
      pass = false;
    }

    // if (tempRecord.grossWt === "") {
    //   tempRecord.errors.grossWt = "Please Select Proper Data";
    //   pass = false;
    // }

    // if (tempRecord.netWt === "") {
    //   tempRecord.errors.netWt = "Please Select Proper Data";
    //   pass = false;
    // }

    setUpdtRecord(tempRecord);
    return pass;
  }

  let handleDesignNoSelect = (designNo) => {
    console.log(designNo);
    let filteredArray = designApiData.filter(
      (item) => item.variant_number === designNo
    );
    console.log(filteredArray);

    if (filteredArray.length > 0) {
      setDesignApiData(filteredArray);

      // setDesignNoErr("");
      let tempRecord = { ...updtRecord };
      tempRecord.designNo = designNo;
      tempRecord.design_id = filteredArray[0].id;
      tempRecord.batchNo = "";
      tempRecord.errors.designNo = null;
      setUpdtRecord(tempRecord);

      // setUpdtRecord((prevState) => ({
      //     ...prevState, [designNo]: designNo
      // })
      // );
    } else {
      let tempRecord = { ...updtRecord };
      tempRecord.designNo = "";
      tempRecord.errors.designNo = "Please Select Proper Design No";
      setUpdtRecord(tempRecord);
    }
  };

  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    let tempRecord = { ...updtRecord };
    tempRecord[name] = value;
    tempRecord.errors[name] = null;

    setUpdtRecord(tempRecord);
  };

  // function handleKaratChange(e) {
  //   let value = e.target.value;
  //   let tempRecord = { ...updtRecord };
  //   tempRecord.karat = value;
  //   tempRecord.errors.karat = null;

  //   setUpdtRecord(tempRecord);
  // }

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };

  function editBomDetailsHandler(id) {
    History.push(
      "/dashboard/planningdashboard/planningorders/orderView/editbomdetails",
      {
        id: id,
        isEdit: true,
        isView: false,
      }
    );
  }
  const editSelecModal = (id) => {
    if (designArray.length === 0) {
      dispatch(
        Actions.showMessage({
          message: "Please Select Design",
          variant: "error",
        })
      );
    } else {
      editSelectedDesignHandler(id);
    }
  };
  function editSelectedDesignHandler(id) {
    History.push(
      "/dashboard/planningdashboard/planningorders/orderView/editselectedbomdetails",
      {
        id: id,
        designArray: designArray,
      }
    );
  }

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setOrderOneDetail((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(value);
    if (name === "ordernumber") {
      setoedernumber(value);
      setordernumberErr("");
    } else if (name === "customername") {
      setcustomername(value);
      setcustomernameErr("");
    } else if (name === "Weight") {
      setWeight(value);
      setWeightErr("");
    } else if (name === "remarkone") {
      setremarkone(value);
      setremarkoneErr("");
    } else if (name === "remarktwo") {
      setremarktwo(value);
      setremarktwoErr("");
    } else if (name === "remarkthree") {
      setremarkthree(value);
      setremarkthreeErr("");
    } else if (name === "remarkfore") {
      setremarkfore(value);
      setremarkforeErr("");
    }
  };
  // const handleChangestockgroup = (value) => {
  //   setselectStockcode("");
  //   setselectStockGroup(value);
  //   getStockcode(value.value);
  //   setstockGroupErr("");
  // };
  // const handleChangestcockcode = (value) => {
  //   setselectStockcode(value);
  //   setstockcodeErr("");
  // };
  // const handleChangecategory = (value) => {
  //   setselectCategory(value);
  //   setstockTypeErr("");
  // };
  // const handleChangeRetailer = (value) => {
  //   setRetailer(value);
  //   setRetailerErr("");
  // };
  // const handleChangeSales = (value) => {
  //   setselectSalesdata(value);
  //   setselectSalesdataErr("");
  // };

  const handleChangeKarat = (value) => {
    setKaratMain(value);
    setKaratMainErr("");
  };
  const handleChangeDistribyter = (value) => {
    setOrderOneDetail((prevState) => ({
      ...prevState,
      customername: value,
    }));
    setDistributer(value);
    setDistributerErr("");
    setRetailer("");
    setRetailerErr("");
  };
  // function validateCustomerName() {
  //   if (customername === "") {
  //     setcustomernameErr("Enter Customer Name");
  //     return false;
  //   }
  //   return true;
  // }
  function validateRetailer() {
    if (retailer === "") {
      setRetailerErr("Select Retailer Name");
      return false;
    }
    return true;
  }
  function validateStockcode() {
    if (selectStockcode === "") {
      setstockcodeErr("Select Stock Code");
      return false;
    }
    return true;
  }
  let regex = /^(0*(\d+(\.\d*)?|\.\d+)|[1-9]\d*(\.\d*)?)$/; // no decimal number 0-100

  // function validateWeight() {
  //   if (Weight === "" || regex.test(Weight) === false) {
  //     setWeightErr("Enter valid Weight");
  //     return false;
  //   }
  //   return true;
  // }

  function validateStockGroup() {
    if (selectStockGroup === "") {
      setstockGroupErr("Select Stock Group");
      return false;
    }
    return true;
  }
  function validateStockType() {
    if (selectCategory === "") {
      setstockTypeErr("Select Stock Type");
      return false;
    }
    return true;
  }
  function validateDate() {
    if (ShipmentDate === "") {
      setShipmentDateErr("Select Shipment Date");
      return false;
    }
    return true;
  }
  function validatesalesname() {
    if (selectSalesdata === "") {
      setselectSalesdataErr("Select Sales Name");
      return false;
    }
    return true;
  }

  function validateDistribute() {
    if (distributer === "") {
      setDistributerErr("Select Distributer Name");
      return false;
    }
    return true;
  }
  // let regex = /^[0-9]$|^[1-9][0-9]$|^(100)$/; // no decimal number 0-100
  // let regex =  /^([0-9]{1,2}){1}(\.[0-9]{1,2})?$/  // with decimal 0-100
  // function validateOnStone() {
  //   if (rhodiumOnStone === "" || regex.test(rhodiumOnStone) === false) {
  //     setRhodiumOnStoneErr("Enter valid rate");
  //     return false;
  //   }
  //   return true;
  // }

  // function validatePlainPart() {
  //   if (rhodiumOnPlainPart === "" || regex.test(rhodiumOnPlainPart) === false) {
  //     setRhodiumOnPlainPartErr("Enter valid rate");
  //     return false;
  //   }
  //   return true;
  // }

  // function validateSunblastingDull() {
  //   if (SandblastingDull === "" || regex.test(SandblastingDull) === false) {
  //     setSundblastingDullErr("Enter valid rate");
  //     return false;
  //   }
  //   return true;
  // }

  // function validateStainDull() {
  //   if (satinDull === "" || regex.test(satinDull) === false) {
  //     setSatinDullErr("Enter valid rate");
  //     return false;
  //   }
  //   return true;
  // }

  // function validateEnamel() {
  //   if (enamel === "" || regex.test(enamel) === false) {
  //     setEnamelErr("Enter valid rate");
  //     return false;
  //   }
  //   return true;
  // }

  // function validateStoneColor() {
  //   if (additionStoneColor === "" || regex.test(additionStoneColor) === false) {
  //     setAdditionalStoneColorErr("Enter valid rate");
  //     return false;
  //   }
  //   return true;
  // }

  // function validateScrewType() {
  //   if (screwType === "") {
  //     setScrewTypeErr("Select screwType");
  //     return false;
  //   }
  //   return true;
  // }
  function validateKarat() {
    if (karatMain === "") {
      setKaratMainErr("Enter valid karat");
      return false;
    }
    return true;
  }
  const handleUpdateData = (e) => {
    e.preventDefault();
    if (
      // validateDistribute() &&
      // validateRetailer() &&
      // validatesalesname() &&
      // validateWeight() &&
      validateKarat() &&
      validateStockGroup() &&
      validateStockcode() &&
      validateStockType() &&
      validateDate()
    )
      callApiForUpdateData();
  };

  console.log(orderOneDetail);
  function callApiForUpdateData() {
    const body = {
      // retailer_id: retailer.value,
      // salesman_id: selectSalesdata.value,

      // stock_group_id: selectStockGroup.value,

      category_id: selectCategory.value,

      // distributor_id: distributer.value,
      // order_remark_1: remarkone,
      // order_remark_2: remarktwo,
      // order_remark_3: remarkthree,
      // order_remark_4: remarkfore,

      stock_name_id: selectStockcode.id,
      karat: orderOneDetail.karat,
      shipment_date: ShipmentDate,
      weight: Weight,
      client_id: orderOneDetail.customername.value,
      rhodium_on_stone_percentage: orderOneDetail.rhodiumStone,
      rhodium_on_plain_part_percentage: orderOneDetail.rhodiumPlainPart,
      rhodium_remarks: orderOneDetail.rhodiumRemark,
      sandblasting_dull_percentage: orderOneDetail.sandblastingDull,
      satin_dull_percentage: orderOneDetail.satinDull,
      dull_texture_remark: orderOneDetail.dullTextureRemark,
      enamel_percentage: orderOneDetail.enamel,
      enamel_remark: orderOneDetail.enamelRemark,
      additional_color_stone: orderOneDetail.additionalColorStone,
      additional_color_remark: orderOneDetail.additionalColorRemark,
      final_order_remark: orderOneDetail.finalOrderRemark,
      screw_type: screwType.value,
    };
    axios
      .put(
        Config.getCommonUrl() +
          `api/ProductionOrder/details/update/${orderData.id}`,
        body
      )
      .then((response) => {
        if (response.data.success) {
          props.callApi(orderData.id);
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/ProductionOrder/details/update/${orderData.id}`,
          body,
        });
      });
  }
  function getStockGroups() {
    // setLoading(true);
    axios
      .get(Config.getCommonUrl() + "api/stockgroup")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          const filteredData = response.data?.data.filter(
            (item) => item.item_type.id === 1
          );

          const arrData = response.data?.data?.map((item) => {
            return {
              "Item Type": item.item_type.name,
              "Stock Group Name": item.group_name,
            };
          });
          setStockGroup(filteredData);

          // setData(response.data);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, { api: "api/stockgroup" });
      });
  }
  function getProductCategories() {
    axios
      .get(Config.getCommonUrl() + "api/productcategory")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setStockCategory(response.data.data);
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, { api: "api/productcategory" });
      });
  }
  function getRetailerMasterData() {
    axios
      .get(Config.getCommonUrl() + "api/retailerMaster")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          let tempData = response.data.data;
          setretailerdata(tempData);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, { api: "api/retailerMaster" });
      });
  }
  function getSalesMen() {
    axios
      .get(Config.getCommonUrl() + "api/salesManMaster")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setSalesdata(response.data.data);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, { api: "api/salesManMaster" });
      });
  }
  function getStockcode(id) {
    console.log(id);
    // const body = { id_stock_group_id: id };
    axios
      .get(Config.getCommonUrl() + `api/productionOrder/metalread`)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setStockcode(response.data.data);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {
          api: "api/productionOrder/metalread",
        });
      });
  }
  function getRetailerList() {
    axios
      .get(
        Config.getCommonUrl() +
          `api/distributormaster/distributor-retailer/${distributer.value}`
      )
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          console.log(response.data.data);
          setRetailerList(response.data.data);
        } else {
          setRetailerList([]);
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/distributormaster/distributor-retailer/${distributer.value}`,
        });
      });
  }
  function EditDesignModalOpen(data) {
    setDesignData(data);
    console.log(data);
    setEditDesignModal(true);
  }
  function EditDesignModalClose() {
    setEditDesignModal(false);
    props.callApi(orderData.id);
  }
  const handleSearchData = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    if (name === "qty") {
      const isNumber = /^[0-9]*$/;
      if (!isNumber.test(value)) {
        return;
      }
    }
    if (
      ["fine_weight", "net_weight", "stone_weight", "gross_weight"].includes(
        name
      )
    ) {
      const isDecimal = /^[0-9]*\.?[0-9]*$/;
      if (!isDecimal.test(value)) {
        return;
      }
    }
    setSearchData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const downloadData = (url) => {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.setAttribute("download", "");
    document.body.appendChild(anchor);

    anchor.click();
    document.body.removeChild(anchor);
  };

  const DownloadErrData = (url) => {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.setAttribute("download", "");
    document.body.appendChild(anchor);

    anchor.click();
    document.body.removeChild(anchor);
  };

  const handleLotSwapeInput = (e) => {
    setCollectionCSV(e.target.files);
  };

  // useEffect(() => {
  //   if(selectedLot) {
  //     getLotSwipeOrderId(selectedLot.value)
  //   }
  // }, [selectedLot])

  const handleSelectLotNo = (e) => {
    setSelectedLot(e);
    setLotSwappingData(e.data);
  };

  function getLotSwapeList() {
    axios
      .get(Config.getCommonUrl() + "api/lotSwipe/notCasted/order/number")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response.data.data);
          setLotSwapeList(response.data.data);
          setLotSwapeId(response.data.id);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/lotSwipe/notCasted/order/number",
        });
      });
  }

  function getLotSwipeOrderId(id) {
    axios
      .get(
        Config.getCommonUrl() +
          `api/lotSwipe/export/csv?production_order_id=${id}&department_id=${localStorage.getItem(
            "SelectedDepartment"
          )}`
      )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response.data);
          downloadData(response.data.url);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/lotSwipe/export/csv?production_order_id=${id}&department_id=${localStorage.getItem(
            "SelectedDepartment"
          )}`,
        });
      });
  }

  const handleExportData = () => {
    if (!selectedLot) {
      dispatch(
        Actions.showMessage({
          message: "Please Select Lot number !",
          variant: "error",
        })
      );
      return false;
    } else {
      getLotSwipeOrderId(selectedLot.value);
    }
  };

  const HandleSave = () => {
    if (!selectedLot) {
      dispatch(
        Actions.showMessage({
          message: "Please Select Swapping Lot Number",
          variant: "error",
        })
      );
    } else if (!collectionCSV) {
      dispatch(
        Actions.showMessage({
          message: "Please Upload CSV File !",
          variant: "error",
        })
      );
    } else {
      postLotSwapeSave();
    }
  };

  function clearDataLotSwapping() {
    setCollectionCSV(null);
    setLotSwappingData({});
    setSelectedLot(null);
  }

  function postLotSwapeSave() {
    const formData = new FormData();
    for (let i = 0; i < collectionCSV.length; i++) {
      formData.append("file", collectionCSV[i]);
    }
    formData.append("new_production_order_id", orderData.id);

    axios
      .post(Config.getCommonUrl() + `api/lotSwipe/upload/csv`, formData)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response.data);
          dispatch(
            Actions.showMessage({
              message: "CSV file Uploaded Successfully",
              variant: "success",
            })
          );
          props.callApi(props.apiData.id);
          clearDataLotSwapping();
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
          DownloadErrData(response.data.url);
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/lotSwipe/upload/csv`,
          body: formData,
        });
      });
  }

  return (
    <>
      {openModal && (
        <UploadFile handleModalClose={handleModalClose} id={orderData.id} />
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <span className=""> Order Number</span>
          <TextField
            placeholder="Enter Order Number"
            // className="mt-16"
            // label="Rhodium on stone %"
            name="ordernumber"
            value={orderOneDetail.orderNumber}
            error={ordernumberErr.length > 0 ? true : false}
            helperText={ordernumberErr}
            onChange={(e) => handleChange(e)}
            variant="outlined"
            required
            disabled
            fullWidth
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          style={{ position: "relative" }}
        >
          <span className="">Customer Name</span>
          <Select
            placeholder="Select Stock Type"
            styles={{ selectStyles }}
            options={distributerArr.map((group) => ({
              value: group.id,
              label: group.name,
            }))}
            filterOption={createFilter({ ignoreAccents: false })}
            value={orderOneDetail.customername}
            onChange={handleChangeDistribyter}
            isDisabled={isView}
          />
          <span className={classes.errorMessage}>
            {distributerErr ? distributerErr : ""}
          </span>
        </Grid>
        {/* <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          style={{ position: "relative" }}
        >
          <span className="">Retailer Name</span>
          <Select
            placeholder="Select Stock Type"
            styles={{ selectStyles }}
            options={retailerList.map((group) => ({
              value: group.id,
              label: group.company_name,
            }))}
            filterOption={createFilter({ ignoreAccents: false })}
            value={orderOneDetail.retailerName}
            onChange={handleChangeRetailer}
            isDisabled={isView}
          />
          <span className={classes.errorMessage}>
            {retailerErr ? retailerErr : ""}
          </span>
        </Grid> */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <span className="">Rhodium on stone %</span>
          <TextField
            // className="mt-16"
            // label="Rhodium on stone %"
            name="rhodiumStone"
            value={
              orderOneDetail.rhodiumStone ? orderOneDetail.rhodiumStone : ""
            }
            error={rhodiumOnStoneErr.length > 0 ? true : false}
            helperText={rhodiumOnStoneErr}
            onChange={(e) => handleChange(e)}
            variant="outlined"
            required
            disabled={isView}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <span>Rhodium on Plain part %</span>
          <TextField
            // label="Rhodium on Plain part %"
            name="rhodiumPlainPart"
            value={
              orderOneDetail.rhodiumPlainPart
                ? orderOneDetail.rhodiumPlainPart
                : ""
            }
            error={rhodiumOnPlainPartErr.length > 0 ? true : false}
            helperText={rhodiumOnPlainPartErr}
            onChange={(e) => handleChange(e)}
            variant="outlined"
            required
            fullWidth
            disabled={isView}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <span className="">Rhodium Remarks</span>
          <TextField
            // label="Rhodium Remarks"
            name="rhodiumRemark"
            value={
              orderOneDetail.rhodiumRemark ? orderOneDetail.rhodiumRemark : ""
            }
            onChange={(e) => handleChange(e)}
            variant="outlined"
            required
            disabled={isView}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <span className="">Sandblasting dull %</span>
          <TextField
            // label="Sandblasting dull %"
            name="sandblastingDull"
            value={
              orderOneDetail.sandblastingDull
                ? orderOneDetail.sandblastingDull
                : ""
            }
            error={SandblastingDullErr.length > 0 ? true : false}
            helperText={SandblastingDullErr}
            onChange={(e) => handleChange(e)}
            variant="outlined"
            required
            disabled={isView}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3}>
          <span className="">Satin dull %</span>
          <TextField
            // label="Satin dull %"
            name="satinDull"
            value={orderOneDetail.satinDull ? orderOneDetail.satinDull : ""}
            error={satinDullErr.length > 0 ? true : false}
            helperText={satinDullErr}
            onChange={(e) => handleChange(e)}
            variant="outlined"
            required
            disabled={isView}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3}>
          <span className="">Dull Texture Remark</span>
          <TextField
            // label="Dull Texture Remark"
            name="dullTextureRemark"
            value={
              orderOneDetail.dullTextureRemark
                ? orderOneDetail.dullTextureRemark
                : ""
            }
            onChange={(e) => handleChange(e)}
            variant="outlined"
            required
            disabled={isView}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3}>
          <span className="">Enamel %</span>
          <TextField
            // label="Enamel %"
            name="enamel"
            value={orderOneDetail.enamel ? orderOneDetail.enamel : ""}
            error={enamelErr.length > 0 ? true : false}
            helperText={enamelErr}
            onChange={(e) => handleChange(e)}
            variant="outlined"
            required
            disabled={isView}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3}>
          <span className="">Enamel Remark</span>
          <TextField
            // label="Enamel Remark"
            name="enamelRemark"
            value={
              orderOneDetail.enamelRemark ? orderOneDetail.enamelRemark : ""
            }
            onChange={(e) => handleChange(e)}
            variant="outlined"
            required
            disabled={isView}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3}>
          <span className="">Additional Color Stone %</span>
          <TextField
            // label="Additional Color Stone %"
            name="additionalColorStone"
            value={
              orderOneDetail.additionalColorStone
                ? orderOneDetail.additionalColorStone
                : ""
            }
            error={additionStoneColorErr.length > 0 ? true : false}
            helperText={additionStoneColorErr}
            onChange={(e) => handleChange(e)}
            variant="outlined"
            required
            disabled={isView}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3}>
          <span className="">Additional Color Remark</span>
          <TextField
            // label="Additional Color Remark"
            name="additionalColorRemark"
            value={
              orderOneDetail.additionalColorRemark
                ? orderOneDetail.additionalColorRemark
                : ""
            }
            onChange={(e) => handleChange(e)}
            variant="outlined"
            required
            disabled={isView}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3}>
          <span className="">Final Order Remark</span>
          <TextField
            // label="Final Order Remark"
            name="finalOrderRemark"
            value={
              orderOneDetail.finalOrderRemark
                ? orderOneDetail.finalOrderRemark
                : ""
            }
            onChange={(e) => handleChange(e)}
            variant="outlined"
            required
            disabled={isView}
            fullWidth
          />
        </Grid>
        {/* <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          style={{ position: "relative" }}
        >
          <span className="">Sales Person Name</span>
          <Select
            placeholder="Select Sales Name"
            styles={{ selectStyles }}
            options={Salesdata.map((group) => ({
              value: group.id,
              label: group.full_name,
            }))}
            filterOption={createFilter({ ignoreAccents: false })}
            value={selectSalesdata}
            isDisabled={isView}
            onChange={handleChangeSales}
          />
          <span className={classes.errorMessage}>
            {selectSalesdataErr ? selectSalesdataErr : ""}
          </span>
        </Grid> */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          style={{ position: "relative" }}
        >
          <span> Karat</span>
          <Select
            styles={selectStyles}
            options={karatArr.map((group) => ({
              value: group.value,
              label: group.value,
            }))}
            filterOption={createFilter({ ignoreAccents: false })}
            value={karatMain}
            onChange={handleChangeKarat}
            isDisabled={apiData.length > 0 ? true : false}
          />
          <span className={classes.errorMessage}>
            {karatMainErr.length > 0 ? karatMainErr : ""}
          </span>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <span className="">Weight</span>
          <TextField
            placeholder="Enter Weight"
            // className="mt-16"
            // label="Rhodium on stone %"
            name="Weight"
            value={Weight}
            error={WeightErr.length > 0 ? true : false}
            helperText={WeightErr}
            disabled
            onChange={(e) => handleChange(e)}
            variant="outlined"
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <span className="">Screw Type</span>
          <Select
            styles={selectStyles}
            options={screwTypeArr.map((group) => ({
              value: group.id,
              label: group.label,
            }))}
            filterOption={createFilter({ ignoreAccents: false })}
            value={screwType}
            // onChange={handleChangeScrew}
            isDisabled
          />
          <span style={{ color: "red" }}>
            {screwTypeErr.length > 0 ? screwTypeErr : ""}
          </span>
        </Grid>
        {/* <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          style={{ position: "relative" }}
        >
          <span className="">Stock Group</span>
          <Select
            placeholder="Select Stock Group"
            styles={{ selectStyles }}
            options={StockGroup.map((group) => ({
              value: group.id,
              label: group.group_name,
            }))}
            filterOption={createFilter({ ignoreAccents: false })}
            value={selectStockGroup}
            isDisabled={isView}
            onChange={handleChangestockgroup}
          />
          <span className={classes.errorMessage}>
            {stockGroupErr ? stockGroupErr : ""}
          </span>
        </Grid> */}
        {/* <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          style={{ position: "relative" }}
        >
          <span className="">Stock Name Code</span>
          <Select
            placeholder="Select Stock Code"
            styles={{ selectStyles }}
            options={Stockcode.map((group) => ({
              value: group.stock_name_code.stock_code,
              label: group.stock_name_code.stock_code,
              id: group.stock_name_code.id,
            }))}
            filterOption={createFilter({ ignoreAccents: false })}
            value={selectStockcode}
            onChange={handleChangestcockcode}
            isDisabled={isView}
          />
          <span className={classes.errorMessage}>
            {stockcodeErr.length > 0 ? stockcodeErr : ""}
          </span>
        </Grid> */}
        {/* <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          style={{ position: "relative" }}
        >
          <span className="">Stock Type (Categories)</span>
          <Select
            placeholder="Select Stock Type"
            styles={{ selectStyles }}
            options={StockCategory.map((group) => ({
              value: group.id,
              label: group.billing_category_name,
            }))}
            filterOption={createFilter({ ignoreAccents: false })}
            value={selectCategory}
            isDisabled={isView}
            onChange={handleChangecategory}
          />
          <span className={classes.errorMessage}>
            {stockTypeErr.length > 0 ? stockTypeErr : ""}
          </span>
        </Grid> */}
        {/* <Grid item xs={12} sm={6} md={4} lg={3}>
          <span className="">Shipment Date</span>
          <TextField
            placeholder="Shipment Dat"
            type="date"
            name="partyVoucherDate"
            value={ShipmentDate}
            onChange={(e) => {
              setShipmentDate(e.target.value);
              setShipmentDateErr("");
            }}
            onKeyDown={(e => e.preventDefault())}
            error={ShipmentDateErr.length > 0 ? true : false}
            helperText={ShipmentDateErr}
            variant="outlined"
            disabled={isView}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            disabled={isView}
          />
        </Grid> */}
        {/* <Grid item xs={12} sm={6} md={4} lg={3}>
          <span className="">Order Remark-1</span>
          <TextField
            placeholder="Enter Order Remark-1"
            label="Rhodium on stone %"
            name="remarkone"
            value={remarkone}
            error={remarkoneErr.length > 0 ? true : false}
            helperText={remarkoneErr}
            onChange={(e) => handleChange(e)}
            variant="outlined"
            disabled={isView}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <span className="">Order Remark-2</span>
          <TextField
            placeholder="Enter Order Remark-2"
            label="Rhodium on stone %"
            name="remarktwo"
            value={remarktwo}
            error={remarktwoErr.length > 0 ? true : false}
            helperText={remarktwoErr}
            onChange={(e) => handleChange(e)}
            variant="outlined"
            disabled={isView}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <span className="">Order Remark-3</span>
          <TextField
            placeholder="Enter Order Remark-3"
            label="Rhodium on stone %"
            name="remarkthree"
            value={remarkthree}
            error={remarkthreeErr.length > 0 ? true : false}
            helperText={remarkthreeErr}
            onChange={(e) => handleChange(e)}
            variant="outlined"
            disabled={isView}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <span className="">Order Remark-4</span>
          <TextField
            placeholder="Enter Order Remark-4"
            label="Rhodium on stone %"
            name="remarkfore"
            value={remarkfore}
            error={remarkforeErr.length > 0 ? true : false}
            helperText={remarkforeErr}
            onChange={(e) => handleChange(e)}
            variant="outlined"
            disabled={isView}
            required
            fullWidth
          />
        </Grid> */}
      </Grid>
      <Grid
        item
        xs={12}
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        <Button
          variant="contained"
          // color="primary"
          // aria-label="Register"
          hidden={!isEdit}
          onClick={handleUpdateData}
          style={{
            backgroundColor: "#415BD4",
            color: "#FFFFFF",
            marginTop: 16,
          }}
        >
          Update
        </Button>
      </Grid>
      <Divider style={{ marginTop: "16px" }} />
      {loading && <Loader />}

      <Grid container style={{ marginBlock: "30px" }}>
        <Grid item xs={12}>
          <h3 style={{ marginBottom: 10 }}>Lot Swapping</h3>
        </Grid>
        <Grid item xs={12}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item style={{ width: "24%" }}>
              <Select
                styles={selectStyles}
                label=""
                name=""
                filterOption={createFilter({ ignoreAccents: false })}
                variant="outlined"
                fullWidth
                value={selectedLot}
                onChange={(e) => handleSelectLotNo(e)}
                options={lotSwapeList
                  .filter(
                    (lotnm) => lotnm.order_number !== orderOneDetail.orderNumber
                  )
                  .map((item) => ({
                    value: item.id,
                    label: item.order_number,
                    data: item,
                  }))}
              />
            </Grid>

            <Grid item style={{ marginLeft: "10px" }}>
              <Link
                style={{
                  color: "#415BD4",
                  borderBottom: "1px solid #415BD4",
                  cursor: "pointer",
                }}
                onClick={handleExportData}
              >
                Export Order Data
              </Link>
            </Grid>

            <Grid item style={{ width: "24%", marginLeft: "10px" }}>
              <TextField
                label="Upload CSV Excel File"
                type="file"
                placeholder={collectionCSV ? collectionCSV.name : null}
                onChange={(e) => handleLotSwapeInput(e)}
                variant="outlined"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  inputProps: {
                    accept: ".csv",
                  },
                }}
                disabled={isView}
              />
            </Grid>

            <Grid item style={{ marginLeft: "10px" }}>
              <Button
                // variant="contained"
                color="primary"
                style={{
                  backgroundColor: "#415BD4",
                  border: "none",
                  color: "white",
                }}
                onClick={HandleSave}
                disabled={isView}
              >
                Upload CSV
              </Button>
            </Grid>

            <Grid
              style={{
                border: "1px solid #d3d3d3",
                width: "35%",
                marginLeft: "10px",
                padding: "8px",
              }}
            >
              <Grid container style={{ alignItems: "center" }}>
                <Grid item xs={6}>
                  <span
                    spacing={4}
                    style={{
                      fontWeight: 600,
                      width: "32%",
                      display: "inline-block",
                    }}
                  >
                    Order Number
                  </span>
                  :
                  {lotSwappingData.order_number !== null
                    ? lotSwappingData.order_number
                    : "-"}
                </Grid>
                <Grid item xs={6}>
                  <span
                    spacing={2}
                    style={{
                      fontWeight: 600,
                      paddingLeft: "50px",
                      width: "45%",
                      display: "inline-block",
                    }}
                  >
                    Distributor
                  </span>
                  :
                  {lotSwappingData?.distributor?.client?.name !== null
                    ? lotSwappingData?.distributor?.client?.name
                    : "-"}
                </Grid>
              </Grid>

              <Grid container style={{ alignItems: "center" }}>
                <Grid item xs={6}>
                  <span
                    style={{
                      fontWeight: 600,
                      width: "32%",
                      display: "inline-block",
                    }}
                  >
                    Karat
                  </span>
                  :
                  {lotSwappingData.karat !== null
                    ? lotSwappingData.karat
                    : "-"}
                </Grid>
                <Grid item xs={6}>
                  <span
                    style={{
                      fontWeight: 600,
                      paddingLeft: "50px",
                      width: "45%",
                      display: "inline-block",
                    }}
                  >
                    Total Pieces
                  </span>
                  :
                  {lotSwappingData.total_pieces !== null
                    ? lotSwappingData.total_pieces
                    : "-"}
                </Grid>
              </Grid>

              <Grid container style={{ alignItems: "center" }}>
                <Grid item xs={6}>
                  <span
                    style={{
                      fontWeight: 600,
                      width: "32%",
                      display: "inline-block",
                    }}
                  >
                   Screw Type
                  </span>
                  :
                  {lotSwappingData.screw_type !== null
                    ? lotSwappingData.screw_type
                    : "-"}
                </Grid>
                <Grid item xs={6}>
                  <span
                    style={{
                      fontWeight: 600,
                      paddingLeft: "50px",
                      width: "45%",
                      display: "inline-block",
                    }}
                  >
                    Order Type
                  </span>
                  :
                  {lotSwappingData.order_type !== null
                    ? lotSwappingData.order_type
                    : "-"}
                </Grid>
              </Grid>

              <Grid container style={{ alignItems: "center" }}>
                <Grid item xs={6}>
                  <span
                    style={{
                      fontWeight: 600,
                      width: "32%",
                      display: "inline-block",
                    }}
                  >
                    Retailor
                  </span>
                  :
                  {lotSwappingData.retailer !== null
                    ? lotSwappingData.retailer
                    : "-"}
                </Grid>
                <Grid item xs={6}>
                  <span
                    style={{
                      fontWeight: 600,
                      paddingLeft: "50px",
                      width: "45%",
                      display: "inline-block",
                    }}
                  >
                    Order Status
                  </span>
                  :
                  {lotSwappingData.order_status !== null
                    ? lotSwappingData.order_status
                    : "-"}
                </Grid>
              </Grid>

              <Grid container style={{ alignItems: "center" }}>
                <Grid item xs={12}>
                  <span
                    style={{
                      fontWeight: 600,
                      width: "16%",
                      display: "inline-block",
                    }}
                  >
                    Final Remark
                  </span>
                  :
                  {lotSwappingData.final_order_remark !== null
                    ? lotSwappingData.final_order_remark
                    : "-"}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Paper
        className={clsx(classes.tabroot, "table-responsive", "mt-16")}
        style={{ marginBottom: "5%" }}
      >
        <Grid container>
          <Grid item xs={6}>
            {/* {showAddBtn && isEdit && ( */}
            <>
              {/* <Button
                  variant="contained"
                  className={classes.button}
                  size="small"
                  onClick={(event) => {
                    setAddFlag(true);
                    setEditFlag(true);
                    setShowAddBtn(false);
                  }}
                >
                  Add New Design
                </Button> */}
              <Button
                variant="contained"
                className={classes.button}
                size="small"
                onClick={() => setOpenModal(true)}
              >
                Upload New Design
              </Button>
            </>
            {/* )} */}
          </Grid>
          <Grid item xs={6} style={{ textAlign: "end" }}>
            {isEdit && (
              <>
                <Button
                  variant="contained"
                  className={classes.button}
                  size="small"
                  onClick={() => editSelecModal(props.apiData.id)}
                  style={{ marginRight: 7 }}
                >
                  Edit Selected Design
                </Button>

                <Button
                  variant="contained"
                  className={classes.button}
                  size="small"
                  onClick={() => editBomDetailsHandler(props.apiData.id)}
                >
                  Edit All
                </Button>
              </>
            )}
          </Grid>
        </Grid>

        <div
          className={clsx(classes.tabroot, "new-add_stock_group_tbel")}
          style={{ overflowY: "auto" }}
        >
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {isEdit && (
                  <TableCell
                    className={classes.tableRowPad}
                    align="center"
                    width={50}
                  >
                    <Checkbox
                      style={{ color: "#415BD4", padding: 0 }}
                      color="primary"
                      checked={filteredData.length === designArray.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                )}
                <TableCell className={classes.tableRowPad} align="left">
                  Design No
                </TableCell>
                <TableCell className={classes.tableRowPad} align="left">
                  Batch No.
                </TableCell>
                <TableCell className={classes.tableRowPad} align="left">
                  Lot No.
                </TableCell>
                <TableCell className={classes.tableRowPad} align="left">
                  Qty
                </TableCell>
                <TableCell className={classes.tableRowPad} align="left">
                  Gross Weight
                </TableCell>
                <TableCell className={classes.tableRowPad} align="left">
                  Stone Weight
                </TableCell>
                <TableCell className={classes.tableRowPad} align="left">
                  Net Weight
                </TableCell>
                <TableCell className={classes.tableRowPad} align="left">
                  Fine Weight
                </TableCell>
                {/* <TableCell className={classes.tableRowPad} align="left">
                  Image
                </TableCell> */}
                {isEdit && (
                  <TableCell
                    className={classes.tableRowPad}
                    align="left"
                    width={165}
                  >
                    Actions
                  </TableCell>
                )}
              </TableRow>
              <TableRow>
                {isEdit && (
                  <TableCell className={classes.tableRowPad}></TableCell>
                )}
                <TableCell className={classes.tableRowPad}>
                  <TextField
                    name="design_no"
                    placeholder="Design No"
                    onChange={handleSearchData}
                    value={searchData.design_no}
                  />
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  <TextField
                    name="batch_no"
                    placeholder="Batch No."
                    onChange={handleSearchData}
                    value={searchData.batch_no}
                  />
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  <TextField
                    name="lot_no"
                    placeholder="Lot No."
                    onChange={handleSearchData}
                    value={searchData.lot_no}
                  />
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  <TextField
                    name="qty"
                    placeholder="Qty"
                    onChange={handleSearchData}
                    value={searchData.qty}
                  />
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  <TextField
                    name="gross_weight"
                    placeholder="Gross Weight"
                    onChange={handleSearchData}
                    value={searchData.gross_weight}
                  />
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  <TextField
                    name="stone_weight"
                    placeholder="Stone Weight"
                    onChange={handleSearchData}
                    value={searchData.stone_weight}
                  />
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  <TextField
                    name="net_weight"
                    placeholder="Net Weight"
                    onChange={handleSearchData}
                    value={searchData.net_weight}
                  />
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  <TextField
                    name="fine_weight"
                    placeholder="Fine Weight"
                    onChange={handleSearchData}
                    value={searchData.fine_weight}
                  />
                </TableCell>

                {isEdit && (
                  <TableCell className={classes.tableRowPad}></TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {console.log(updtRecord)}
              {addFlag && (
                <TableRow>
                  {isEdit && (
                    <TableCell className={classes.tableRowPad}></TableCell>
                  )}
                  <TableCell
                    align="left"
                    className={clsx(classes.tableRowPad, "packing-slip-input")}
                    style={{ overflowWrap: "anywhere", position: "relative" }}
                  >
                    <Autocomplete
                      id="free-solo-demo"
                      freeSolo
                      disableClearable
                      onChange={(event, newValue) => {
                        handleDesignNoSelect(newValue);
                      }}
                      onInputChange={(event, newInputValue) => {
                        if (event !== null) {
                          if (event.type === "change")
                            setDesignSearch(newInputValue);
                        } else {
                          setDesignSearch("");
                        }
                      }}
                      value={updtRecord.designNo}
                      options={designApiData.map(
                        (option) => option.variant_number
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          style={{ padding: 0 }}
                          label="Design Number"
                        />
                      )}
                    />
                    <span className={classes.errorMessage}>
                      {updtRecord.errors !== undefined
                        ? updtRecord.errors.designNo
                        : ""}
                    </span>
                  </TableCell>
                  {/* <TableCell align="left" className={classes.tableRowPad}>
                    <select
                      className={classes.normalSelect}
                      required
                      value={updtRecord.karat}
                      onChange={(e) => handleKaratChange(e)}
                     disabled
                    >
                      <option hidden value="">
                       {karatMain}
                      </option>
                      <option value="14">14 </option>
                      <option value="18">18 </option>
                      <option value="20">20 </option>
                      <option value="22">22 </option>
                    </select>
                    <span style={{ color: "red" }}>
                      {updtRecord.errors !== undefined
                        ? updtRecord.errors.karat
                        : ""}
                    </span>
                  </TableCell> */}
                  {/* <TableCell align="left" className={classes.tableRowPad}>
                    <TextField
                      className=""
                      label="Karat"
                      name="karat"
                      value={updtRecord.karat}
                      variant="outlined"
                      required
                      disabled
                      fullWidth
                    />
                  </TableCell> */}
                  <TableCell
                    align="left"
                    className={classes.tableRowPad}
                    style={{ overflowWrap: "anywhere" }}
                  >
                    {/* <TextField
                      // className=""
                      label="Batch No."
                      name="batchno"
                      // value={updtRecord.pcs}
                      // error={
                      //   updtRecord.errors !== undefined
                      //     ? updtRecord.errors.pcs
                      //       ? true
                      //       : false
                      //     : false
                      // }
                      // helperText={
                      //   updtRecord.errors !== undefined
                      //     ? updtRecord.errors.pcs
                      //     : ""
                      // }
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      fullWidth
                    /> */}
                  </TableCell>
                  <TableCell
                    align="left"
                    className={classes.tableRowPad}
                    style={{ overflowWrap: "anywhere" }}
                  >
                    {/* lot */}
                  </TableCell>
                  <TableCell
                    align="left"
                    className={classes.tableRowPad}
                    style={{ overflowWrap: "anywhere" }}
                  >
                    <TextField
                      className=""
                      label="Pieces"
                      name="pcs"
                      value={updtRecord.pcs}
                      error={
                        updtRecord.errors !== undefined
                          ? updtRecord.errors.pcs
                            ? true
                            : false
                          : false
                      }
                      helperText={
                        updtRecord.errors !== undefined
                          ? updtRecord.errors.pcs
                          : ""
                      }
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </TableCell>
                  <TableCell align="left" className={classes.tableRowPad}>
                    <TextField
                      className=""
                      label="Gross Weight"
                      name="grossWt"
                      value={updtRecord.grossWt}
                      error={
                        updtRecord.errors !== undefined
                          ? updtRecord.errors.grossWt
                            ? true
                            : false
                          : false
                      }
                      helperText={
                        updtRecord.errors !== undefined
                          ? updtRecord.errors.grossWt
                          : ""
                      }
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                      disabled
                    />
                  </TableCell>
                  <TableCell align="left" className={classes.tableRowPad}>
                    <TextField
                      className=""
                      label="Stone Weight"
                      name="stoneWt"
                      value={updtRecord.stoneWt}
                      error={
                        updtRecord.errors !== undefined
                          ? updtRecord.errors.stoneWt
                            ? true
                            : false
                          : false
                      }
                      helperText={
                        updtRecord.errors !== undefined
                          ? updtRecord.errors.stoneWt
                          : ""
                      }
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                      disabled
                    />
                  </TableCell>
                  <TableCell align="left" className={classes.tableRowPad}>
                    <TextField
                      className=""
                      label="Net Weight"
                      name="netWt"
                      value={updtRecord.netWt}
                      error={
                        updtRecord.errors !== undefined
                          ? updtRecord.errors.netWt
                            ? true
                            : false
                          : false
                      }
                      helperText={
                        updtRecord.errors !== undefined
                          ? updtRecord.errors.netWt
                          : ""
                      }
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                      disabled
                    />
                  </TableCell>

                  <TableCell
                    align="left"
                    className={classes.tableRowPad}
                    style={{ overflowWrap: "anywhere" }}
                  >
                    <TextField
                      className=""
                      label="FineWt"
                      name="FineWt"
                      value={updtRecord.FineWt}
                      error={
                        updtRecord.errors !== undefined
                          ? updtRecord.errors.FineWt
                            ? true
                            : false
                          : false
                      }
                      helperText={
                        updtRecord.errors !== undefined
                          ? updtRecord.errors.FineWt
                          : ""
                      }
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </TableCell>
                  {/* <TableCell align="left" className={classes.tableRowPad}>
                      <img src={row.design.image_files[0].image_file} height={50} width={50} />
                    </TableCell> */}
                  {isEdit && (
                    <TableCell className={classes.tableRowPad}>
                      <Button
                        variant="contained"
                        // color="primary"
                        size="small"
                        style={{ backgroundColor: "#415BD4", color: "#FFFFFF" }}
                        aria-label="Register"
                        //   disabled={!isFormValid()}
                        // type="submit"
                        onClick={(e) => addRecord()}
                      >
                        Save
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        // color="primary"
                        aria-label="Register"
                        className="ml-2"
                        //   disabled={!isFormValid()}
                        // type="submit"
                        style={{ backgroundColor: "#415BD4", color: "#FFFFFF" }}
                        onClick={(e) => cancelAdd()}
                      >
                        Cancel
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              )}
              {filteredData
                // .filter((temp) => {
                //   console.log(temp);
                //   console.log(searchData);
                // console.log(temp.order_info, searchData.info);
                // console.log(temp.order_info === searchData.info?.value);
                //   if (searchData.design_no) {
                //     return temp.Design?.variant_number
                //       .toLowerCase()
                //       .includes(searchData.design_no.toLowerCase());
                //   } else if (searchData.batch_no) {
                //     return temp.batch_number
                //       .toLowerCase()
                //       .includes(searchData.batch_no.toLowerCase());
                //   } else if (searchData.lot_no) {
                //     return temp.lot_number
                //       .toLowerCase()
                //       .includes(searchData.lot_no.toLowerCase());
                //   } else if (searchData.qty) {
                //     return temp.pieces === parseFloat(searchData.qty);
                //   } else if (searchData.gross_weight) {
                //     return temp.gross_weight
                //       .toLowerCase()
                //       .includes(searchData.gross_weight.toLowerCase());
                //   } else if (searchData.stone_weight) {
                //     return temp.stone_weight
                //       .toLowerCase()
                //       .includes(searchData.stone_weight.toLowerCase());
                //   } else if (searchData.net_weight) {
                //     return temp.net_weight
                //       .toLowerCase()
                //       .includes(searchData.net_weight.toLowerCase());
                //   } else if (searchData.fine_weight) {
                //     return temp.fine_weight
                //       .toLowerCase()
                //       .includes(searchData.fine_weight.toLowerCase());
                //   } else {
                //     return temp;
                //   }
                // })
                .map((row) => {
                  console.log(row);
                  return (
                    <TableRow
                      sx={{ "& > *": { borderBottom: "unset" } }}
                      key={row.id}
                    >
                      {/* <TableCell style={{ width: "5%" }}>
                  {!row.isEdit && row.Design?.MainVariantCombination?.length > 0 && (
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => setOpen(!open)}
                    >
                      {open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                    </IconButton>
                  )}
                </TableCell> */}
                      {row.isEdit ? (
                        <>
                          {console.log(props.updtRecord)}
                          <TableCell
                            align="left"
                            className={clsx(
                              classes.tableRowPad,
                              "packing-slip-input"
                            )}
                            style={{ overflowWrap: "anywhere" }}
                          >
                            <Autocomplete
                              id="free-solo-demo"
                              freeSolo
                              disableClearable
                              onChange={(event, newValue) => {
                                props.handleDesignNoSelect(newValue);
                              }}
                              onInputChange={(event, newInputValue) => {
                                if (event !== null) {
                                  if (event.type === "change")
                                    props.setDesignSearch(newInputValue);
                                } else {
                                  props.setDesignSearch("");
                                }
                              }}
                              value={props.updtRecord.designNo}
                              options={props.designApiData.map(
                                (option) => option.variant_number
                              )}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="outlined"
                                  style={{ padding: 0 }}
                                  // label="Design Number"
                                  placeholder="Enter Design No."
                                />
                              )}
                            />
                            <span style={{ color: "red" }}>
                              {props.updtRecord.errors !== undefined
                                ? props.updtRecord.errors.designNo
                                : ""}
                            </span>
                          </TableCell>
                          {/* <TableCell align="left" className={classes.tableRowPad}>
                     
                      <select
                        className={classes.normalSelect}
                        required
                        value={props.updtRecord.karat}
                        onChange={(e) => props.handleKaratChange(e)}
                      
                      >
                        <option hidden value="">
                          Select Karat
                        </option>
                        <option value="14">14 </option>
                        <option value="18">18 </option>
                        <option value="20">20 </option>
                        <option value="22">22 </option>
                      </select>
                      <span style={{ color: "red" }}>
                        {props.updtRecord.errors !== undefined
                          ? props.updtRecord.errors.karat
                          : ""}
                      </span>
                    </TableCell> */}
                          {/* <TableCell align="left" className={classes.tableRowPad}>
                      <TextField
                        className=""
                        label="Karat"
                        name="karat"
                        value={props.updtRecord.karat}
                        variant="outlined"
                        required
                        disabled
                        fullWidth
                      />
                    </TableCell> */}
                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                            style={{ overflowWrap: "anywhere" }}
                          >
                            {/* lot */}
                          </TableCell>
                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                            style={{ overflowWrap: "anywhere" }}
                          >
                            {/* pieces */}
                            {/* {row.pieces} */}
                            <TextField
                              className=""
                              // label="Pieces"
                              placeholder="Enter PCS"
                              name="pcs"
                              value={props.updtRecord.pcs}
                              error={
                                props.updtRecord.errors !== undefined
                                  ? props.updtRecord.errors.pcs
                                    ? true
                                    : false
                                  : false
                              }
                              helperText={
                                props.updtRecord.errors !== undefined
                                  ? props.updtRecord.errors.pcs
                                  : ""
                              }
                              onChange={(e) => props.handleInputChange(e)}
                              variant="outlined"
                              required
                              fullWidth
                              // disabled={isView}
                            />
                          </TableCell>

                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                          >
                            {/* Gross */}
                            {/* {row.gross_weight} */}
                            <TextField
                              className=""
                              // label="Gross Weight"
                              placeholder="Gross Weight"
                              name="grossWt"
                              value={props.updtRecord.grossWt}
                              error={
                                props.updtRecord.errors !== undefined
                                  ? props.updtRecord.errors.grossWt
                                    ? true
                                    : false
                                  : false
                              }
                              helperText={
                                props.updtRecord.errors !== undefined
                                  ? props.updtRecord.errors.grossWt
                                  : ""
                              }
                              onChange={(e) => props.handleInputChange(e)}
                              variant="outlined"
                              required
                              fullWidth
                              disabled
                            />
                          </TableCell>
                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                          >
                            {/* Gross */}
                            {/* {row.gross_weight} */}
                            <TextField
                              className=""
                              // label="Gross Weight"
                              placeholder="Stone Wt"
                              name="stoneWt"
                              value={props.updtRecord.stoneWt}
                              error={
                                props.updtRecord.errors !== undefined
                                  ? props.updtRecord.errors.stoneWt
                                    ? true
                                    : false
                                  : false
                              }
                              helperText={
                                props.updtRecord.errors !== undefined
                                  ? props.updtRecord.errors.stoneWt
                                  : ""
                              }
                              onChange={(e) => props.handleInputChange(e)}
                              variant="outlined"
                              required
                              fullWidth
                              disabled
                            />
                          </TableCell>
                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                          >
                            {/* Net */}

                            <TextField
                              className=""
                              // label="Net Weight"
                              placeholder="Net Wt"
                              name="netWt"
                              value={props.updtRecord.netWt}
                              error={
                                props.updtRecord.errors !== undefined
                                  ? props.updtRecord.errors.netWt
                                    ? true
                                    : false
                                  : false
                              }
                              helperText={
                                props.updtRecord.errors !== undefined
                                  ? props.updtRecord.errors.netWt
                                  : ""
                              }
                              onChange={(e) => props.handleInputChange(e)}
                              variant="outlined"
                              required
                              fullWidth
                              disabled
                            />
                          </TableCell>

                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                            style={{ overflowWrap: "anywhere" }}
                          >
                            <TextField
                              className=""
                              // label="Remarks"
                              name="FineWt"
                              value={props.updtRecord.FineWt}
                              error={
                                props.updtRecord.errors !== undefined
                                  ? props.updtRecord.errors.FineWt
                                    ? true
                                    : false
                                  : false
                              }
                              helperText={
                                props.updtRecord.errors !== undefined
                                  ? props.updtRecord.errors.FineWt
                                  : ""
                              }
                              onChange={(e) => props.handleInputChange(e)}
                              variant="outlined"
                              required
                              fullWidth
                            />
                          </TableCell>
                          {/* <TableCell align="left" className={classes.tableRowPad}>
                      <img src={row.design.image_files[0].image_file} height={50} width={50} />
                    </TableCell> */}
                          {isEdit && (
                            <TableCell className={classes.tableRowPad}>
                              <Button
                                variant="contained"
                                color="primary"
                                aria-label="Register"
                                size="small"
                                style={{
                                  backgroundColor: "#415BD4",
                                  color: "#FFFFFF",
                                }}
                                //   disabled={!isFormValid()}
                                // type="submit"
                                onClick={(e) => {
                                  props.updateRecord(row.id);
                                }}
                              >
                                Save
                              </Button>
                              <Button
                                variant="contained"
                                color="primary"
                                className="ml-2"
                                aria-label="Register"
                                size="small"
                                style={{
                                  backgroundColor: "#415BD4",
                                  color: "#FFFFFF",
                                }}
                                //   disabled={!isFormValid()}
                                // type="submit"
                                onClick={(e) => props.cancelUpdtRecord(row.id)}
                              >
                                Cancel
                              </Button>
                            </TableCell>
                          )}
                        </>
                      ) : (
                        <>
                          {isEdit && (
                            <TableCell
                              align="center"
                              className={classes.tableRowPad}
                              style={{ overflowWrap: "anywhere" }}
                            >
                              {console.log(designArray)}
                              <Checkbox
                                style={{
                                  padding: 0,
                                  color: "#415bd4",
                                }}
                                checked={designArray.some(
                                  (item) => item.p_o_design_id === row.id
                                )}
                                onChange={() => handleSelectDsgn(row)}
                              />
                            </TableCell>
                          )}
                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                            style={{ overflowWrap: "anywhere" }}
                          >
                            {/* Design No */}
                            {row.Design?.variant_number}
                          </TableCell>
                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                          >
                            {/* karat */}
                            {row.batch_number}
                          </TableCell>
                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                          >
                            {/* karat */}
                            {row.lot_number}
                          </TableCell>
                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                          >
                            {/* karat */}
                            {row.pieces}
                          </TableCell>
                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                            style={{ overflowWrap: "anywhere" }}
                          >
                            {/* pieces */}
                            {row.gross_weight}
                          </TableCell>
                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                          >
                            {/* Gross */}
                            {row.stone_weight}
                          </TableCell>
                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                          >
                            {/* Net */}
                            {row.net_weight}
                          </TableCell>

                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                            style={{ overflowWrap: "anywhere" }}
                          >
                            {row.fine_weight}
                          </TableCell>
                          {/* <TableCell align="left" className={classes.tableRowPad}>
                      <img
                        src={
                          row.design.image_files.length > 0
                            ? row.design.image_files[0].image_file
                            : Config.getjvmLogo()
                        }
                        height={50}
                        width={50}
                      />
                    </TableCell> */}

                          {/* {props.isEdit && ( */}
                          {isEdit && (
                            <TableCell className={classes.tableRowPad}>
                              {/* {!props.editFlag && ( */}
                              <>
                                <IconButton
                                  style={{ padding: "0" }}
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    ev.stopPropagation();
                                    EditDesignModalOpen(row);
                                    // editHandler(row.id);
                                    setOpen(false);
                                  }}
                                >
                                  {/* <Icon className="mr-8 edit-icone">
                                <img src={Icones.edit} alt="" />
                              </Icon> */}
                                  <Icon
                                    className="mr-8"
                                    style={{ color: "dodgerblue" }}
                                  >
                                    create
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
                                  {/* <Icon className="mr-8 delete-icone">
                                <img src={Icones.delete_red} alt="" />
                              </Icon> */}
                                  <Icon
                                    className="mr-8"
                                    style={{ color: "red" }}
                                  >
                                    delete
                                  </Icon>
                                </IconButton>
                              </>
                              {/* )} */}

                              {/*<IconButton
                          style={{ padding: "0" }}
                          onClick={(ev) => {
                              ev.preventDefault();
                              ev.stopPropagation();
                              viewHandler(row);
                          }}
                      >
                          <Icon
                              className="mr-8"
                              style={{ color: "dodgerblue" }}
                          >
                              visibility
                          </Icon>
                      </IconButton> */}
                            </TableCell>
                          )}
                          {/* )} */}
                        </>
                      )}
                    </TableRow>
                    // <Row
                    //   key={row.id}
                    //   row={row}
                    //   classes={classes}
                    //   handleDesignNoSelect={handleDesignNoSelect}
                    //   setDesignSearch={setDesignSearch}
                    //   updtRecord={updtRecord}
                    //   designApiData={designApiData}
                    //   handleKaratChange={handleKaratChange}
                    //   handleInputChange={handleInputChange}
                    //   cancelUpdtRecord={cancelUpdtRecord}
                    //   updateRecord={updateRecord}
                    //   isEdit={isEdit}
                    //   editFlag={editFlag}
                    //   editHandler={editHandler}
                    //   deleteHandler={deleteHandler}
                    // />
                  );
                })}
            </TableBody>
          </Table>
        </div>
      </Paper>
      <EditDesignModal
        openModal={editDesignModal}
        closeModal={EditDesignModalClose}
        data={designData}
      />
      <Dialog
        open={open}
        onClose={handleClose}
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
            onClick={handleClose}
          >
            {/* <img
              src={Icones.cross}
              className="delete-dialog-box-image-size"
              alt=""
            /> */}
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this record?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="primary"
            className="delete-dialog-box-cancle-button"
          >
            Cancel
          </Button>
          <Button
            onClick={callDeleteApi}
            color="primary"
            autoFocus
            className="delete-dialog-box-delete-button"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TypeThreeComp;
