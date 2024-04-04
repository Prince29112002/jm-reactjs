import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Icon,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Box,
  InputBase,
  TableContainer,
  TableFooter,
  TextField,
  FormControlLabel,
  Radio,
  FormControl,
  RadioGroup,
} from "@material-ui/core";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { FuseAnimate } from "@fuse";
// import Icones from "assets/fornt-icons/Mainicons";
import History from "@history";
import Modal from "@material-ui/core/Modal";
import { Add } from "@material-ui/icons";
import Axios from "axios";
import Config from "app/fuse-configs/Config";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { useDispatch } from "react-redux";
import HelperFunc from "../../SalesPurchase/Helper/HelperFunc";
import * as Actions from "app/store/actions";
import Select, { createFilter } from "react-select";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import BreadcrumbsHelper from "app/main/BreadCrubms/BreadcrumbsHelper";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import LotSummary from "../../Production/ProductionMain/LotPrint/LotSummary";
import LotDesign from "../../Production/ProductionMain/LotPrint/LotDesign";
import Icones from "assets/fornt-icons/Mainicons";


const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 800,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    outline: "none",
  },
  actionBtn: {
    background: "#1fd319",
    color: "#FFFFFF",
    width: "100%",
    borderRadius: "10px",
  },
  modalContainer: {
    paddingBlock: "20px",
    background: "rgba(0,0,0,0)",
    justifyContent: "space-between",
  },
  modal: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    padding: 12,
    background: "#03113b",
    color: "#FFFFFF",
  },
  customList: {
    listStyleType: "square",
  },
  notavAilableList: {
    paddingBlock: 3,
  },
  scroll: {
    overflowX: "auto",
  },
  table: {
    minWidth: 650,
  },
  modalBody: {
    padding: 20,
  },
  textfield: {
    width: "100%",
    marginBottom: 15,
  },
  Modalwidth: {
    width: "30%",
  },
  addBtn: {
    display: "block",
    borderRadius: "8px",
    background: "#1E65FD",
    minWidth: "40px",
  },
  tableRowPad: {
    padding: 7,
  },
  tableFooter: {
    padding: 7,
  },
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "gray",
    color: "white",
  },
  errorMessage: {
    color: "#f44336",
    position: "absolute",
    bottom: "0px",
    fontSize: "9px",
    lineHeight: "8px",
    marginTop: 3,
  },
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

const CreatePlanAndLot = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStyle] = useState(getModalStyle);
  const [id, setId] = useState(props.history.location.state.row);
  const [createPlanAndLotList, setCreatePlanAndLotList] = useState({});
  const [productionOrderDesigns, setProductionOrderDesigns] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [transferredRows, setTransferredRows] = useState([]);
  console.log(transferredRows.length);
  const [flag, setFlag] = useState("1");
  const [CreatedLotList, setCreatedLotList] = useState([]);
  const [fieldSets, setFieldSets] = useState([{}]);
  const [processList, setProcessList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [lotId, setLotId] = useState("");
  const [lotDetailId, setLotDetailId] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState("");
  const [searchData, setSearchData] = useState("");
  const [searchDataTransfer, setSearchDataTransfer] = useState("");
  const [processName, setProcessName] = useState([]);
  const [categoryName, setCategoryName] = useState([]);
  const [shippingDate, setShippingDate] = useState("");
  const [shippingDateErr, setShippingDateErr] = useState("");
  const [categoryNmErr, setCategoryNmErr] = useState("");
  const [processSaveFlag, setProcessSaveFlag] = useState(0);
  const [selectedCheckedAll, setSelectedCheckedAll] = useState(false);
  const [isView, setIsView] = useState(false); //for view Only

  const theme = useTheme();
  const componentRefDesign = React.useRef(null);
  const componentRefSummary = React.useRef(null);
  const [printObj, setPrintObj] = useState([]);
  const [printObjMultiple, setPrintObjMultiple] = useState([]);
  const onBeforeGetContentResolve = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  const [remarkList, setRemarkList] = useState({
    remarkOne: "",
    remarkTwo: "",
    remarkThree: "",
  });

  const handleSetPrint = (id) => {
    console.log(id);
    handlePrintLot(id);
    setOpen(true);
  };

  const [voucherPrintType, setVoucherPrintType] = useState(0);

  const handleAfterPrint = () => {
    //React.useCallback
    console.log("`onAfterPrint` called", isView); // tslint:disable-line no-console
    //resetting after print
    checkAndReset();
  };

  function checkAndReset() {
    if (isView === false) {
      console.log("cond true", isView);
      // History.goBack();
      // resetForm();
      // getVoucherNumber();
    }
  }
  
  const handleBeforePrint = React.useCallback(() => {
    console.log("`onBeforePrint` called"); // tslint:disable-line no-console
  }, []);

  const handleOnBeforeGetContent = React.useCallback(() => {
    console.log("`onBeforeGetContent` called"); // tslint:disable-line no-console
    // setLoading(true);
    // setText("Loading new text...");

    return new Promise((resolve) => {
      onBeforeGetContentResolve.current = resolve;

      setTimeout(() => {
        // setLoading(false);
        // setText("New, Updated Text!");
        resolve();
      }, 10);
    });
  }, []); //setText

  const reactToPrintContentSummary = React.useCallback(() => {
    return componentRefSummary.current;
    //eslint-disable-next-line
  }, [componentRefSummary.current]);

  const reactToPrintContentDesign = React.useCallback(() => {
    return componentRefDesign.current;
    //eslint-disable-next-line
  }, [componentRefDesign.current]);

  function getDateAndTime() {
    const currentDate = new Date();
    return moment(currentDate).format("DD-MM-YYYY h:mm A");
  }

  const handleLotDesignPrint = useReactToPrint({
    content: reactToPrintContentDesign,
    documentTitle: "Plan_And_Lot_Design" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    // removeAfterPrint: true
  });

  const handleLotSummaryPrint = useReactToPrint({
    content: reactToPrintContentSummary,
    documentTitle: "Plan_And_Lot_Summary_" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    // removeAfterPrint: true
  });

  function handleChange(e) {
    const isSelected = parseFloat(e.target.value);
    console.log(e.target.value);
    setVoucherPrintType(isSelected);
  }

  function handlePrint() {
    console.log(voucherPrintType);
    if (voucherPrintType === 0) {
      handleLotSummaryPrint();
    } else {
      handleLotDesignPrint();
    }
  }

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };

  const designArr = transferredRows.map((item) => ({
    design_id: item.design_id,
  }));

  // const category = transferredRows.map((item) => ({
  //   category_id: item.category_id,
  // }));

  const DepartmentId = localStorage.getItem("SelectedDepartment");
  const OrderId = createPlanAndLotList.id;

  function handleModalClose(call) {
    setModalOpen(false);
  }

  function openModal() {
    getDefaultCatefgory();
    setProcessSaveFlag(0);
    setModalOpen(true);
  }

  function getDefaultCatefgory() {
    const uniqueCategoryIds = [
      ...new Set(transferredRows.map((data) => data.category_id)),
    ];

    if (uniqueCategoryIds.length === 1) {
      setCategoryName({
        value: transferredRows[0].Design.ProductCategoryDetails.id,
        label: transferredRows[0].Design.ProductCategoryDetails.category_name,
      });
    } else {
      // Category IDs are different, setting empty array
      setCategoryName([]);
    }
  }

  function AddopenModal(row) {
    console.log(row);
    if (row) {
      setCategoryName({
        value: row.ProductCategory.id,
        label: row.ProductCategory.category_name,
      });
      setProcessName({
        value: row.ProcessLineDetails?.Id,
        label: row.ProcessLineDetails?.process_line_name,
      });
      setRemarkList({
        remarkOne: row.remark_1,
        remarkTwo: row.remark_2,
        remarkThree: row.remark_3,
      });
    }
    setShippingDate(row?.shipping_date);
    setLotId(row.id);
    // setLotId(row.id);
    // const LotProcessDetailsIds = row.id;
    // setLotDetailId(LotProcessDetailsIds);
    // const updateFieldset = row.LotProcessDetails.map((detail) => {
    //   console.log(detail);
    //   return {
    //     process_id: {
    //       value: detail.ProcessDetails?.id,
    //       label: detail.ProcessDetails?.process_name,
    //     },
    //     start_date: detail.start_date,
    //     end_date: detail.end_date,
    //   };
    // });
    // setFieldSets(updateFieldset);
    setProcessSaveFlag(1);
    setModalOpen(true);
  }

  function getCreatePlanAndLot() {
    Axios.get(
      Config.getCommonUrl() + `api/productionPlanning/planningOrder/${id}`
    )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response.data.data);
          setCreatePlanAndLotList(response.data.data);
          setProductionOrderDesigns(response.data.data.ProductionOrderDesigns);
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
          api: `api/productionPlanning/planningOrder/${id}`,
        });
      });
  }

  function CreatedLot() {
    const body = {
      production_order_id: id,
    };
    Axios.post(
      Config.getCommonUrl() + `api/productionPlanning/lot/details/listing`,
      body
    )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response.data.data);
          setCreatedLotList(response.data.data);
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
          api: `api/productionPlanning/lot/details/listing`,
          body: body,
        });
      });
  }

  function getProcessList() {
    Axios.get(Config.getCommonUrl() + `api/productionPlanning/process/read/24`)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response.data.data);
          setProcessList(response.data.data);
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
          api: `api/productionPlanning/process/read/24`,
        });
      });
  }

  useEffect(() => {
    getProcessData();
    getCategoryListData();
  }, []);

  function getProcessData(id) {
    console.log(id);
    // setLoading(true)
    Axios.get(Config.getCommonUrl() + "api/processline")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setProcessList(response.data.data);
          const desiredObject = response.data.data.find(
            (item) => item.product_category_id === id
          );
          if (desiredObject) {
            setProcessName({
              value: desiredObject.id,
              label: desiredObject.process_line_name,
            });
          }
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
          // setLoading(false)
        }
      })
      .catch((error) => {
        // setLoading(false)
        handleError(error, dispatch, { api: "api/processline" });
      });
  }

  function getCategoryListData() {
    Axios.get(Config.getCommonUrl() + "api/productionPlanning/category")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setCategoryList(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/productionPlanning/category",
        });
      });
  }

  useEffect(() => {
    if (id) {
      getCreatePlanAndLot();
      CreatedLot();
      // getProcessList();
    }
  }, []);

  function CreateLot() {
    // const transformedFieldSets = fieldSets.map((item) => ({
    //   process_id: item.process_id?.value,
    //   start_date: item.start_date,
    //   end_date: item.end_date,
    //   shipping_date: item.shipping_date,
    // }));
    // console.log(transformedFieldSets);
    // console.log(transformedFieldSets[0].shipping_date);
    const body = {
      category_ids: categoryName.value,
      stock_code: 0,
      design_arr: designArr,
      order_id: OrderId,
      department_id: DepartmentId,
      // department_id: 0,
      process_line_id: processName.value,
      shipping_date: shippingDate,
      remark_1: remarkList.remarkOne,
      remark_2: remarkList.remarkTwo,
      remark_3: remarkList.remarkThree,
      // process_arr: transformedFieldSets,
    };
    Axios.post(
      Config.getCommonUrl() + `api/productionPlanning/lotFromOrder`,
      body
    )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response.data.data);
          setTransferredRows([]);
          setSelectedRows([]);
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          CreatedLot();
          getCreatePlanAndLot();
          setRemarkList((prevData) => ({
            // ...prevData,
            remarkOne: "",
            remarkTwo: "",
            remarkThree: "",
          }));
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
          api: `api/productionPlanning/lotFromOrder`,
          body: body,
        });
      });
  }

  function AddProcess() {
    console.log(lotId);
    const lot_process_id = lotDetailId;
    const transformedFieldSets = fieldSets.map((item, index) => {
      console.log(item);
      return {
        process_id: item.process_id.value,
        start_date: item.start_date,
        end_date: item.end_date,
        lot_process_id: lot_process_id[index],
      };
    });
    const body = {
      process_arr: transformedFieldSets,
    };
    console.log(body);
    Axios.post(
      Config.getCommonUrl() + `api/productionPlanning/process/${lotId}`,
      body
    )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response.data.data);
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          CreatedLot();
          getCreatePlanAndLot();
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
          api: `api/productionPlanning/process/${lotId}`,
          body: body,
        });
      });
  }

  function DeleteLot() {
    console.log(itemToDelete);
    Axios.delete(
      Config.getCommonUrl() +
        `api/productionPlanning/lot/delete/${itemToDelete}`
    )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response.data.data);
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          handleDeleteClose();
          CreatedLot();
          getCreatePlanAndLot();
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
          api: `api/productionPlanning/lot/delete/${itemToDelete}`,
        });
      });
  }

  const handleCheckboxChange = (row) => {
    const selectedIndex = selectedRows.indexOf(row);

    if (selectedIndex === -1) {
      setSelectedRows([...selectedRows, row]);
    } else {
      const updatedSelectedRows = [...selectedRows];
      updatedSelectedRows.splice(selectedIndex, 1);
      setSelectedRows(updatedSelectedRows);
    }
  };

  const handleTransfer = () => {
    console.log(selectedRows, transferredRows);
    if (selectedRows.length !== 0) {
      const updatedTransferredRows = [...transferredRows, ...selectedRows];
      setTransferredRows(updatedTransferredRows);
      setSelectedRows([]);
      setSelectedCheckedAll(false);
    }
    setProductionOrderDesigns((prevDesigns) =>
      prevDesigns.filter((design) => !selectedRows.includes(design))
    );
  };

  const handleDeleteRow = (row) => {
    const updatedRows = transferredRows.filter((r) => r !== row);
    setTransferredRows(updatedRows);

    setProductionOrderDesigns((prevDesigns) => [...prevDesigns, row]);
    setSelectedRows([]);
    setSelectedCheckedAll(false);
  };

  const handleSaveClick = () => {
    History.push({
      pathname: "/dashboard/planningdashboard",
      state: flag,
    });
  };

  const addFieldSet = () => {
    setFieldSets([
      ...fieldSets,
      { process_id: "", start_date: "", end_date: "", shipping_date: "" },
    ]);
  };

  function shippingDateValid(value) {
    let today = moment().format("YYYY-MM-DD");
    let dateVal = moment(value).format("YYYY-MM-DD");
    const isValidDate = moment(value, "YYYY-MM-DD", true).isValid();
    const selectedDate = moment(value, "YYYY-MM-DD");
    const currentDate = moment();
    // let minDateVal = moment(new Date("")).format("YYYY-MM-DD");
    console.log("value", value, today, dateVal);
    // if (dateVal >= today) {
    //   setShippingDateErr("");
    //   return true;
    // } else if(!isValidDate) {
    //   setShippingDateErr("Enter Date");
    // }else if() {
    //   setShippingDateErr("Enter Valid Date");
    //   return false;
    // }

    if (!isValidDate) {
      setShippingDateErr("Please Enter Date");
      return false;
    } else if (selectedDate.isBefore(currentDate, "day")) {
      setShippingDateErr("Please Enter a Date greater than or equal to today");
      return false;
    } else {
      setShippingDateErr("");
      return true;
    }
  }

  function categoryValid(value) {
    if (value.length === 0) {
      setCategoryNmErr("Please Select Category Name");
      return false;
    } else {
      setCategoryNmErr("");
      return true;
    }
  }

  // function shippingDateValid(value) {
  //   if (!value) {
  //     setShippingDateErr("");
  //     return true;
  //   }
  //   const isValidDate = moment(value, "YYYY-MM-DD", true).isValid();
  //   const selectedDate = moment(value, "YYYY-MM-DD");
  //   const currentDate = moment();
  //   if (!isValidDate) {
  //     setShippingDateErr("Please enter a valid date");
  //     return false;
  //   } else if (selectedDate.isBefore(currentDate, "day")) {
  //     setShippingDateErr("Please enter a date greater than or equal to today");
  //     return false;
  //   } else {
  //     setShippingDateErr("");
  //     return true;
  //   }
  // }

  const handleFieldChange = (index, fieldName, value) => {
    console.log(value);
    if (fieldName === "category_name") {
      setCategoryName(value);
      categoryValid(value);
    } else if (fieldName === "process_id") {
      setProcessName({
        value: value.value,
        label: value.label,
      });
    } else if (fieldName === "shipping_date") {
      setShippingDate(value);
      shippingDateValid(value);
    } else if (
      fieldName === "remarkOne" ||
      fieldName === "remarkTwo" ||
      fieldName === "remarkThree"
    ) {
      setRemarkList((prevFieldData) => ({
        ...prevFieldData,
        [fieldName]: value,
      }));
    }
  };

  const handleButtonClick = () => {
    if (categoryValid(categoryName) && shippingDateValid(shippingDate)) {
      CreateLot();
      setModalOpen(false);
    }
  };

  const handleDeleteClose = () => {
    setDeleteModal(false);
  };

  const handleDelete = (id) => {
    console.log(id);
    setDeleteModal(true);
    setItemToDelete(id);
  };

  const handleSearchChange = (event) => {
    setSearchData(event.target.value);
  };

  console.log(productionOrderDesigns);

  // const filteredData = productionOrderDesigns.filter((row) => {
  //   const searchDataLower = searchData.toLowerCase();
  //   const fieldsToSearch = [
  //     "variant_no",
  //     "batch_number",
  //     "pieces",
  //     "stone_pieces",
  //     "gross_weight",
  //     "stone_weight",
  //     "net_weight",
  //   ];

  //   return fieldsToSearch.some((field) => {
  //     const fieldValue = String(row[field]).toLowerCase();
  //     return fieldValue.includes(searchDataLower);
  //   });
  // });

  const filteredData = productionOrderDesigns.filter((row) => {
    const searchDataLower = searchData.toLowerCase();
    const fieldsToSearch = [
      "variant_no",
      "batch_number",
      "pieces",
      "stone_pieces",
      "gross_weight",
      "stone_weight",
      "net_weight",
      "Design.ProductCategoryDetails.category_name",
    ];

    return fieldsToSearch.some((field) => {
      const fieldHierarchy = field.split(".");
      let fieldValue = row;
      for (const key of fieldHierarchy) {
        fieldValue = fieldValue[key];
        if (fieldValue === undefined) {
          return false;
        }
      }
      fieldValue = String(fieldValue).toLowerCase();
      return fieldValue.includes(searchDataLower);
    });
  });

  const handleSearchTransfer = (event) => {
    setSearchDataTransfer(event.target.value);
  };

  // const filteredDataTransfer = transferredRows.filter((row) => {
  //   const searchDataLower = searchDataTransfer.toLowerCase();
  //   const fieldsToSearch = [
  //     "variant_no",
  //     "batch_number",
  //     "pieces",
  //     "stone_pieces",
  //     "gross_weight",
  //     "stone_weight",
  //     "net_weight",
  //   ];

  //   return fieldsToSearch.some((field) => {
  //     const fieldValue = String(row[field]).toLowerCase();
  //     return fieldValue.includes(searchDataLower);
  //   });
  // });
  
  const filteredDataTransfer = transferredRows.filter((row) => {
    const searchDataLower = searchDataTransfer.toLowerCase();
    const fieldsToSearch = [
      "variant_no",
      "batch_number",
      "pieces",
      "stone_pieces",
      "gross_weight",
      "stone_weight",
      "net_weight",
      "Design.ProductCategoryDetails.category_name",
    ];

    return fieldsToSearch.some((field) => {
      const fieldHierarchy = field.split(".");
      let fieldValue = row;
      for (const key of fieldHierarchy) {
        fieldValue = fieldValue[key];
        if (fieldValue === undefined) {
          return false;
        }
      }
      fieldValue = String(fieldValue).toLowerCase();
      return fieldValue.includes(searchDataLower);
    });
  });
  const currentDate = new Date().toISOString().split("T")[0];

  function handleAutoTransfer() {
    const targetCategoryId =
      productionOrderDesigns[0].Design.ProductCategoryDetails.id;
    if (transferredRows.length === 0 && selectedRows.length === 0) {
      const filteredDesigns = productionOrderDesigns.filter(
        (design) => design.Design.ProductCategoryDetails.id === targetCategoryId
      );
      setTransferredRows(filteredDesigns);
      const remainingDesigns = productionOrderDesigns.filter(
        (design) => design.Design.ProductCategoryDetails.id !== targetCategoryId
      );
      setProductionOrderDesigns(remainingDesigns);
      console.log(remainingDesigns);
    }
  }

  function handleUpdateProccessLine() {
    const body = {
      category_ids: categoryName.value,
      process_line_id: processName.value,
      shipping_date: shippingDate,
      remark_1: remarkList.remarkOne,
      remark_2: remarkList.remarkTwo,
      remark_3: remarkList.remarkThree,
    };
    Axios.put(
      Config.getCommonUrl() + `api/productionPlanning/process/update/${lotId}`,
      body
    )
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setModalOpen(false);
          CreatedLot();
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/productionPlanning/process/update/${lotId}`,
          body: body,
        });
      });
  }

  function handlePrintLot(id) {
    Axios.get(
      Config.getCommonUrl() + `api/productionPrintVoucher/planAndlot/${id}`
    )
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setModalOpen(false);
          setPrintObj(response.data.data);
          setPrintObjMultiple(response.data.MultipleData);
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
          api: `api/productionPrintVoucher/planAndlot/${id}`,
        });
      });
  }

  const handleSelectAll = (e) => {
    console.log(e.target.checked);
    if (selectedRows.length > 0) {
      // If all rows are selected, unselect all
      setSelectedRows([]);
      setSelectedCheckedAll(false);
      // setSelectedArray([]);
    } else {
      // if (transferredRows.length === 0) {
      const targetCategoryId =
        filteredData[0].Design.ProductCategoryDetails.parent_cate_code;
      const filteredDesigns = filteredData.filter(
        (design) =>
          design.Design.ProductCategoryDetails.parent_cate_code ===
          targetCategoryId
      );
      setSelectedCheckedAll(true);
      // const allRowNames = filteredData.map((data) => data);
      setSelectedRows(filteredDesigns);
      // setSelectedArray(filteredData);
      // } else {
      //   const targetCategoryId = transferredRows[0]?.category_id;
      //   const filteredDesigns = filteredData.filter(
      //     (design) =>
      //       design.Design.ProductCategoryDetails.id === targetCategoryId
      //   );
      //   // const allRowNames = filteredData.map((data) => data);
      //   setSelectedRows(filteredDesigns);
      //   // setSelectedArray(filteredData);
      // }
    }
  };



  return (
    <Box style={{ overflowY: "auto" }}>
      <Grid
        container
        alignItems="center"
        style={{ marginBottom: 20, marginTop: 30, paddingInline: 30 }}
      >
        <Grid item xs={4} sm={4} md={4} lg={5} key="1">
          <FuseAnimate delay={300}>
            <Typography className="text-18 font-700">
              Create Plan & Lot
            </Typography>
          </FuseAnimate>
        </Grid>

        <Grid
          item
          xs={8}
          sm={8}
          md={8}
          lg={7}
          key="2"
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Button
            id="btn-back"
            size="medium"
            onClick={(event) => {
              History.goBack();
            }}
          >
            <img
              className="back_arrow"
              src={Icones.arrow_left_pagination}
              alt=""
            />
            Back
          </Button>
        </Grid>
      </Grid>

      <div className="main-div-alll ">
        <Box style={{ paddingInline: 16 }}>
          <Grid container>
            <Grid item xs={12} style={{ marginBottom: 16 }}>
              <TableContainer className={classes.scroll}>
                <Table
                  className={`${classes.table}`}
                  style={{ minWidth: "900px" }}
                >
                  <TableHead className={classes.tablehead}>
                    <TableRow>
                      <TableCell width="130px" className={classes.tableRowPad}>
                        Order Number
                      </TableCell>
                      {/* <TableCell width="140px" className={classes.tableRowPad}>
                        Order Category
                      </TableCell> */}
                      <TableCell width="70px" className={classes.tableRowPad}>
                        Purity
                      </TableCell>
                      <TableCell width="90px" className={classes.tableRowPad}>
                      Order Pcs
                      </TableCell>
                      <TableCell width="130px" className={classes.tableRowPad}>
                        Gross Weight
                      </TableCell>
                      <TableCell width="130px" className={classes.tableRowPad}>
                        Stone Weight
                      </TableCell>
                      <TableCell width="120px" className={classes.tableRowPad}>
                        Net Weight
                      </TableCell>
                      <TableCell className={classes.tableRowPad}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>

                      <TableCell>
                        {createPlanAndLotList.order_number}
                        </TableCell>

                      {/* <TableCell>
                        {createPlanAndLotList?.ProductCategory?.category_name}
                      </TableCell> */}

                      <TableCell>
                        {createPlanAndLotList.purity}
                      </TableCell>
                      <TableCell>
                        {createPlanAndLotList.total_pieces}
                      </TableCell>
                      <TableCell>
                        {createPlanAndLotList.total_gross_weight}
                      </TableCell>
                      <TableCell>
                        {createPlanAndLotList.total_stone_weight}
                      </TableCell>
                      <TableCell>
                        {createPlanAndLotList.total_net_weight}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>

          <Grid item>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box style={{ marginBottom: 16 }}>
                  <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                    style={{ padding: 10, background: "#e3e3e3" }}
                  >
                    <Grid item>
                      <Typography style={{ fontWeight: 700 }}>
                        Order Pcs(
                        <span>{createPlanAndLotList.total_pieces}Pcs</span>)
                      </Typography>
                    </Grid>
                    {/* <Grid item>
                    <TextField variant="outlined" placeholder="Scan / Search" />
                  </Grid> */}
                    <InputBase
                      placeholder="Search"
                      inputProps={{ "aria-label": "search" }}
                      value={searchData}
                      onChange={handleSearchChange}
                    ></InputBase>
                  </Grid>
                  <TableContainer
                    className={classes.scroll}
                    style={{ maxHeight:"431px"}}
                  >
                    <Table className={classes.addStockTableContainer}>
                    
                      <TableHead>
                        <TableRow>  
                          <TableCell
                            width="50px"
                            align="center"
                            className={classes.tableRowPad}
                          >
                            <Checkbox
                              style={{ color: "#415BD4", padding: 0 }}
                              color="primary"
                              checked={selectedCheckedAll}
                              onChange={handleSelectAll}
                            />
                          </TableCell>
 
                          <TableCell width="130px" className={classes.tableRowPad}>
                            Design No
                          </TableCell>

                          <TableCell width="130px" className={classes.tableRowPad}>
                            Batch No
                          </TableCell>

                          <TableCell width="140px" className={classes.tableRowPad}>
                            Category Name
                          </TableCell>

                          <TableCell width="50px" className={classes.tableRowPad}>
                            Pcs
                          </TableCell>

                          <TableCell width="100px" className={classes.tableRowPad}>
                            No of Stone
                          </TableCell>

                          <TableCell width="100px" className={classes.tableRowPad}>
                            Gross Weight
                          </TableCell>

                          <TableCell width="100px" className={classes.tableRowPad}>
                            Stone Weight
                          </TableCell>

                          <TableCell width="100px" className={classes.tableRowPad}>
                            Net Weight
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {productionOrderDesigns.length > 0 ? (
                          filteredData.map((row, i) => (
                            <TableRow key={i}>
                          
                             <TableCell
                                  className={clsx(
                                    classes.tableRowPad,
                                    "textcenter"
                                  )}
                                  align="center"
                                >
                                  {console.log(
                                    selectedRows[0]?.category_id ===
                                      row.category_id,
                                    selectedRows[0]?.category_id,
                                    row.category_id
                                  )}
                                  <Checkbox
                                    style={{
                                      padding: 0,
                                      color: "#415bd4",
                                      // transferredRows.length !== 0
                                      //   ? transferredRows[0]?.category_id !==
                                      //     row.category_id
                                      //     ? "gray"
                                      //     : "#415bd4"
                                      //   : selectedRows.length !== 0 &&
                                      //     selectedRows[0]?.category_id !==
                                      //       row.category_id
                                      //   ? "gray"
                                      //   : "#415bd4",
                                    }}
                                    // color="primary"
                                    checked={selectedRows.includes(row)}
                                    onChange={() => handleCheckboxChange(row)}
                                    // disabled={
                                    //   transferredRows.length !== 0
                                    //     ? transferredRows[0]?.category_id !==
                                    //       row.category_id
                                    //     : selectedRows.length !== 0 &&
                                    //       selectedRows[0]?.category_id !==
                                    //         row.category_id
                                    // }
                                  />
                             </TableCell>

                              {/* <TableCell
                                className={clsx(
                                  classes.tableRowPad,
                                  "textcenter"
                                )}
                                align="center"
                              >
                                <Checkbox
                                  style={{ color: "blue", padding: 0 }}
                                  color="primary"
                                  checked={selectedRows.includes(row)}
                                  onChange={() => handleCheckboxChange(row)}
                                />
                              </TableCell> */}

                              <TableCell align="left" className={classes.tableRowPad}>
                                 {row.variant_no}
                              </TableCell>

                              <TableCell align="left" className={classes.tableRowPad}>
                              {row.batch_number ? row.batch_number : "-"}
                              </TableCell>

                              <TableCell align="left" className={classes.tableRowPad}>
                                  {
                                    row.Design.ProductCategoryDetails
                                      .category_name
                                  }
                                  ({
                                    row.Design.ProductCategoryDetails
                                      .parent_cate_code
                                  })
                              </TableCell>

                              <TableCell align="left" className={classes.tableRowPad}>
                              {row.pieces}
                              </TableCell>

                              <TableCell align="left" className={classes.tableRowPad}>
                              {row.stone_pieces * row.pieces}
                              </TableCell>

                              <TableCell align="left" className={classes.tableRowPad}>
                              {parseFloat(
                                    row.gross_weight * row.pieces
                                  ).toFixed(3)}
                              </TableCell>

                              <TableCell align="left" className={classes.tableRowPad}>
                              {parseFloat(
                                    row.stone_weight * row.pieces
                                  ).toFixed(3)}
                              </TableCell>

                              <TableCell style={{textAlign:"center"}} className={classes.tableRowPad}>
                              {parseFloat(
                                    row.net_weight * row.pieces
                                  ).toFixed(3)}
                              </TableCell>

                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={9}
                              align="center"
                              style={{ textAlign: "center" }}
                            >
                              No Data
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>

                      <TableFooter>
                        <TableRow style={{ background: "#ebeefb" }}>

                          <TableCell className={classes.tableFooter}></TableCell>
                          <TableCell className={classes.tableFooter}></TableCell>
                          <TableCell className={classes.tableFooter}></TableCell>
                        
                          <TableCell className={classes.tableFooter}>
                            <b>Total</b>
                          </TableCell>

                          <TableCell className={classes.tableFooter}>
                            <b>
                              {HelperFunc.getTotalOfFieldNoDecimal(
                                productionOrderDesigns,
                                "pieces"
                              ) || " "}
                            </b>
                          </TableCell>

                          <TableCell className={classes.tableFooter}>
                            <b>
                              {parseInt(
                                HelperFunc.getTotalOfMultipliedFields(
                                  productionOrderDesigns,
                                  "stone_pieces",
                                  "pieces"
                                )
                              ) || " "}
                            </b>
                          </TableCell>

                         <TableCell className={classes.tableFooter}>
                            <b>
                              {HelperFunc.getTotalOfMultipliedFields(
                                productionOrderDesigns,
                                "gross_weight",
                                "pieces"
                              ) || " "}
                            </b>
                          </TableCell>

                          <TableCell className={classes.tableFooter}>
                            <b>
                              {HelperFunc.getTotalOfMultipliedFields(
                                productionOrderDesigns,
                                "stone_weight",
                                "pieces"
                              ) || " "}
                            </b>
                          </TableCell>
                           
                          <TableCell style={{textAlign:"center"}} className={classes.tableFooter}>
                            <b>
                              {HelperFunc.getTotalOfMultipliedFields(
                                productionOrderDesigns,
                                "net_weight",
                                "pieces"
                              ) || " "}
                            </b>
                          </TableCell>
                     
                        </TableRow>

                        <TableRow style={{ background: "#ebeefb" }}>
                          <TableCell className={classes.tableFooter} colSpan={6}></TableCell>

                          <TableCell
                            className={classes.tableFooter}
                            colSpan={3}
                            align="right"
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                columnGap: 10,
                              }}
                            >
                              <Button
                                variant="contained"
                                size="small"
                                style={{
                                  background: "#DFAD08",
                                  color: "#FFFFFF",
                                  textTransform: "capitalize",
                                  paddingRight: "5px",
                                }}
                                onClick={handleTransfer}
                              >
                                Transfer
                              </Button>
                              <Button
                                variant="contained"
                                size="small"
                                style={{
                                  background: "#415bd4",
                                  color: "#FFFFFF",
                                  textTransform: "capitalize",
                                  paddingRight: "5px",
                                }}
                                onClick={handleAutoTransfer}
                              >
                                Auto
                              </Button>
                            </div>
                          </TableCell>


                        </TableRow>

                      </TableFooter>
                    </Table>
                  </TableContainer>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box style={{ marginBottom: 16 }}>
                  <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                    style={{ padding: 10, background: "#e3e3e3" }}
                  >
                    <Grid item>
                      <Typography style={{ fontWeight: 700 }}>
                        Selected Pcs(
                        <span>
                          {HelperFunc.getTotalOfFieldNoDecimal(
                            transferredRows,
                            "pieces"
                          )}
                          Pcs
                        </span>
                        )
                      </Typography>
                    </Grid>
                    {/* <Grid item>
                    <TextField variant="outlined" placeholder="Scan / Search" />
                  </Grid> */}
                    <InputBase
                      placeholder="Search"
                      inputProps={{ "aria-label": "search" }}
                      value={searchDataTransfer}
                      onChange={handleSearchTransfer}
                    ></InputBase>
                  </Grid>

                  <TableContainer
                    className={classes.scroll}
                    style={{ maxHeight:"431px"}}
                  >
                    <Table className={classes.addStockTableContainer}>
                      <TableHead>
                        <TableRow>
                          {/* <TableCell width="35px"></TableCell> */}
                          <TableCell width="40px"></TableCell>

                          <TableCell width="130px" className={classes.tableRowPad}>
                            Design No
                          </TableCell>

                          <TableCell
                            width="130px" className={classes.tableRowPad}>
                            Batch No
                          </TableCell>

                          <TableCell
                            className={classes.tableRowPad} width="130px" >
                              Category Name
                          </TableCell>

                          <TableCell
                            className={classes.tableRowPad}
                            width="50px"
                          >
                            Pcs
                          </TableCell>


                          <TableCell
                            className={classes.tableRowPad} width="100px" >
                            No of Stone
                          </TableCell>

                          <TableCell
                            className={classes.tableRowPad} width="100px" >
                            Gross Weight
                          </TableCell>

                          <TableCell
                            className={classes.tableRowPad} width="100px">
                            Stone Weight
                          </TableCell>

                          <TableCell
                            width="100px" className={classes.tableRowPad}>
                            Net Weight
                          </TableCell>

                          {/* <TableCell width="80px" className={classes.tableRowPad}> </TableCell> */}                      

                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {transferredRows.length > 0 ? (
                          filteredDataTransfer.map((row, i) => (
                            <TableRow key={i}>

                              {/* <TableCell align="left" className={classes.tableRowPad}></TableCell> */}

                              <TableCell className={clsx(
                                  classes.tableRowPad,
                                  "textcenter"
                                )}
                                align="center"
                              >
                                <IconButton
                                  style={{ padding: "0" }}
                                  onClick={() => handleDeleteRow(row)}
                                >
                                  <Icon className="delete-icone">
                                    <img src={Icones.delete_red} alt="" />
                                  </Icon>
                                </IconButton>
                              </TableCell> 

                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.variant_no}
                              </TableCell>

                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.batch_number ? row.batch_number : "-"}

                              </TableCell>

                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                  {
                                    row.Design.ProductCategoryDetails
                                      .category_name
                                  }
                              </TableCell>

                              <TableCell 
                              align="left" className={classes.tableRowPad}>
                                 {row.pieces}
                               </TableCell>

                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                 {row.stone_pieces * row.pieces}
                              </TableCell>

                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                               {parseFloat(
                                    row.gross_weight * row.pieces
                                  ).toFixed(3)}
                              </TableCell>

                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {parseFloat(
                                    row.stone_weight * row.pieces
                                  ).toFixed(3)}
                              </TableCell>

                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                                style={{
                                  paddingRight: "0px",
                                  textAlign: "left",
                                }}
                              >
                                  {parseFloat(
                                    row.net_weight * row.pieces
                                  ).toFixed(3)}
                              </TableCell>

                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={9}
                              align="center"
                              style={{ textAlign: "center" }}
                            >
                              No Data
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                      <TableFooter>
                        <TableRow style={{ background: "#ebeefb" }}>
                          <TableCell className={classes.tableFooter}></TableCell>
                          <TableCell className={classes.tableFooter}></TableCell>
                          <TableCell className={classes.tableFooter}></TableCell>
                     
                          <TableCell className={classes.tableFooter}>
                            <b>Total</b>
                          </TableCell>

                          <TableCell className={classes.tableFooter}>
                            <b>
                              {HelperFunc.getTotalOfFieldNoDecimal(
                                transferredRows,
                                "pieces"
                              ) || " "}
                            </b>
                          </TableCell>

                          <TableCell className={classes.tableFooter}>
                          <b>
                              {parseInt(
                                HelperFunc.getTotalOfMultipliedFields(
                                  transferredRows,
                                  "stone_pieces",
                                  "pieces"
                                )
                              ) || " "}
                            </b>
                          </TableCell>

                          <TableCell
                            className={classes.tableFooter}
                          >
                           <b>
                              {HelperFunc.getTotalOfMultipliedFields(
                                transferredRows,
                                "gross_weight",
                                "pieces"
                              ) || " "}
                            </b>
                          </TableCell>

                          <TableCell className={classes.tableFooter}>
                            <b>
                              {HelperFunc.getTotalOfMultipliedFields(
                                transferredRows,
                                "stone_weight",
                                "pieces"
                              ) || " "}
                            </b>
                          </TableCell>

                          <TableCell
                            className={classes.tableFooter} style={{textAlign:"center"}}
                          >
                            <b>
                              {HelperFunc.getTotalOfMultipliedFields(
                                transferredRows,
                                "net_weight",
                                "pieces"
                              ) || " "}
                            </b>
                          </TableCell>

                          {/* <TableCell className={classes.tableFooter}></TableCell> */}

                        </TableRow>
                      </TableFooter>

                    </Table>
                  </TableContainer>
                </Box>

                <Grid container spacing={1} style={{ marginBottom: 16 }}>
                  <Grid
                    item
                    xs={12}
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: 16,
                    }}
                  >
                    <Button
                      variant="contained"
                      style={{
                        color: "#FFFFFF",
                        background: "#415bd4",
                        fontWeight: "700",
                        marginRight: 5,
                      }}
                      onClick={() => {
                        if (transferredRows.length === 0) {
                          dispatch(
                            Actions.showMessage({
                              message:
                                "You can't create a lot without transferring Design",
                              variant: "error",
                            })
                          );
                        } else {
                          openModal();
                        }
                      }}
                    >
                      Create Lot & Add Process
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} style={{ marginBottom: 16 }}>
            <Typography style={{ paddingBlock: 10, fontSize: 18 }}>
              Created Lot
            </Typography>
            <TableContainer
              className={classes.scroll}
              style={{ maxHeight: "431px" }}
            >
              <Table
                className={`${classes.table}`}
                style={{ minWidth: "900px" }}
              >
                <TableHead className={classes.tablehead}>
                  <TableRow>
                    <TableCell
                      width="50px"
                      className={classes.tableRowPad}
                    ></TableCell>
                    <TableCell width="130px" className={classes.tableRowPad}>
                      Lot Number
                    </TableCell>
                    <TableCell width="140px" className={classes.tableRowPad}>
                      Lot Category
                    </TableCell>
                    <TableCell width="70px" className={classes.tableRowPad}>
                      Purity
                    </TableCell>
                    <TableCell width="90px" className={classes.tableRowPad}>
                      Lot Pcs
                    </TableCell>
                    <TableCell width="100px" className={classes.tableRowPad}>
                      Stone Pcs
                    </TableCell>
                    <TableCell width="130px" className={classes.tableRowPad}>
                      Gross Weight
                    </TableCell>
                    <TableCell width="130px" className={classes.tableRowPad}>
                      Stone Weight
                    </TableCell>
                    <TableCell width="120px" className={classes.tableRowPad}>
                      Net Weight
                    </TableCell>
                    <TableCell width="140px" className={classes.tableRowPad}>
                      Current Process
                    </TableCell>
                    <TableCell width="120px" className={classes.tableRowPad}>
                      Status
                    </TableCell> 
                    <TableCell width="120px" className={classes.tableRowPad}>
                     Shipping Date
                    </TableCell> 
                    <TableCell width="13%" className={classes.tableRowPad}>
                      Action
                    </TableCell>
                    {/* <TableCell width="120px" className={classes.tableRowPad}>
                      Start Date
                    </TableCell>
                    <TableCell width="120px" className={classes.tableRowPad}>
                      End Date
                    </TableCell> */}
                  
                    {/* <TableCell className={classes.tableRowPad}></TableCell> */}
                  </TableRow>
                </TableHead>

                <TableBody>
                {CreatedLotList.length === 0 ? (
                    <TableRow>
                      <TableCell
                        className={classes.tableRowPad}
                        align="center"
                        colSpan={13}
                      >
                        No Data Available
                      </TableCell>
                    </TableRow>
                  ) : (
                  CreatedLotList.map((row, i) => {
                    return (
                    <TableRow key={row.id}>
                      {console.log(row)}
                     
                      <TableCell className={classes.tableRowPad}>
                        <IconButton
                          style={{ padding: "0" }}
                          onClick={() => handleDelete(row.id)}
                        >
                          <Icon className="mr-8 delete-icone">
                            <img src={Icones.delete_red} alt="" />
                          </Icon>
                        </IconButton>
                      </TableCell>

                      <TableCell className={classes.tableRowPad}>
                        {row.number}
                      </TableCell>

                      <TableCell className={classes.tableRowPad}>
                        {row.ProductCategory?.category_name}
                      </TableCell>

                      <TableCell className={classes.tableRowPad}>
                        {row.purity}
                      </TableCell>

                      <TableCell className={classes.tableRowPad}>
                        {row.pcs}
                      </TableCell>

                      <TableCell className={classes.tableRowPad}>
                        {row.stone_pcs}
                      </TableCell>

                      <TableCell className={classes.tableRowPad}>
                        {row.total_gross_wgt}
                      </TableCell>

                      <TableCell className={classes.tableRowPad}>
                        {row.total_stone_weight}
                      </TableCell>

                      <TableCell className={classes.tableRowPad}>
                        {row.total_net_wgt}
                      </TableCell>

                      <TableCell className={classes.tableRowPad}>
                      {row.ProcessDetails?.process_name}
                      </TableCell>

                      <TableCell className={classes.tableRowPad}>
                       pending
                      </TableCell>

                      <TableCell className={classes.tableRowPad}>
                       {row.shipping_date
                              ? moment(row.shipping_date).format("DD-MM-YYYY")
                              : "-"}
                      </TableCell>

                      {/* <TableCell className={classes.tableRowPad}></TableCell> */}

                      <TableCell className={classes.tableRowPad}> 
                       <Button
                              // id="btn-all-production"
                              size="small"
                              style={{
                                color: "#FFFFFF",
                                backgroundColor: "#415bd4",
                                fontSize: 12,
                                textTransform: "capitalize",
                              }}
                              variant="contained"
                              onClick={() => AddopenModal(row)}
                            >
                              Edit Proccessline
                         </Button>

                          <Button
                              //  id="btn-all-production"
                              size="small"
                              style={{
                                color: "#FFFFFF",
                                background: "#DFAD08",
                                fontSize: 12,
                                textTransform: "capitalize",
                                marginLeft: "10px",
                              }}
                              variant="contained"
                              onClick={() => handleSetPrint(row.id)}
                            >
                              Print
                          </Button>

                      </TableCell>

                    </TableRow>
                    );
                   })
                  )}
                </TableBody>

              </Table>
            </TableContainer>
          </Grid>

          <Grid
            item
            xs={12}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button
              id="btn-all-production"
              className="w-22"
              style={{
                width: "150px",
                color: "#FFFFFF",
              }}
              onClick={handleSaveClick}
            >
              Save
            </Button>
          </Grid>
        </Box>

        <Modal
          // disableBackdropClick
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={modalOpen}
          // onClose={(_, reason) => {
          //   if (reason !== "backdropClick") {
          //     handleModalClose(false);
          //   }
          // }}
        >
          <div style={modalStyle} className={clsx(classes.paper, "rounded-8")}>
            <h5 className="popup-head p-20">
              {"Process Line"}
              <IconButton
                style={{ position: "absolute", top: "3px", right: "6px" }}
                onClick={handleModalClose}
              >
                <Icon>
                  <img src={Icones.cross} alt="" />
                </Icon>
              </IconButton>
            </h5>
            <Box style={{ padding: 15 }}>
              {fieldSets.map((row, index) => (
                <div key={index}>
                  {console.log(row)}

                  <Grid
                    container
                    spacing={2}
                    className="mt-16"
                    style={{ alignItems: "flex-end" }}
                  >
                    <Grid item  xs={12} sm={6} >
                      <label className="popup-labl p-4">Category Name</label>
                      <Select
                        id="heading-select-input"
                        classes={clsx(classes, "mb-16")}
                        filterOption={createFilter({ ignoreAccents: false })}
                        styles={selectStyles}
                        value={categoryName}
                        onChange={(selectedOption) =>
                          handleFieldChange(
                            index,
                            "category_name",
                            selectedOption
                          )
                        }
                        optionsProps={{
                          style: {
                            height: "10px",
                            backgroundColor: "red",
                          },
                        }}
                        options={categoryList.map((suggestion) => {
                          console.log(suggestion);
                          return {
                            value: suggestion.id,
                            label: suggestion.category_name,
                          };
                        })}
                        placeholder="Category"
                      />
                      <span className={classes.errorMessage} style={{display:"contents"}}>
                        {categoryNmErr.length > 0 ? categoryNmErr : ""}
                      </span>
                    </Grid>

                   <Grid item sm={6} xs={12}>
                      <label className="popup-labl p-4">Process Line Name</label>
                      {console.log(processName)}
                      <Select
                        id="heading-select-input"
                        classes={clsx(classes, "mb-16")}
                        filterOption={createFilter({ ignoreAccents: false })}
                        styles={selectStyles}
                        value={processName.value && processName}
                        onChange={(selectedOption) =>
                          handleFieldChange(index, "process_id", selectedOption)
                        }
                        optionsProps={{
                          style: {
                            height: "10px",
                            backgroundColor: "red",
                          },
                        }}
                        options={processList.map((suggestion) => {
                          console.log(suggestion);
                          return {
                            value: suggestion.id,
                            label: suggestion.process_line_name,
                          };
                        })}
                        placeholder="Process Line Name"
                      />
                    </Grid>

                    <Grid item sm={6} xs={12}>
                      <label className="popup-labl p-4">Shipping Date</label>
                      {console.log(currentDate)}
                      <TextField
                        type="date"
                        name="shippingDate"
                        value={shippingDate}
                        onChange={(e) =>
                          handleFieldChange(
                            index,
                            "shipping_date",
                            e.target.value
                          )
                        }
                        variant="outlined"
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                        error={shippingDateErr.length > 0 ? true : false}
                        helperText={shippingDateErr}
                        style={{ display: "flex" }}
                        inputProps={{
                          min: moment().format("YYYY-MM-DD"),
                          max: moment("9999-12-31").format("YYYY-MM-DD"),
                        }}
                      />
                    </Grid>

                    <Grid item sm={6} xs={12}>
                      <label className="popup-labl pt-4">Remark 1</label>
                      <TextField
                        // label="Remark 1"
                        name="remarkOne"
                        // className="alias-input-dv"
                        value={remarkList.remarkOne}
                        onChange={(e) =>
                          handleFieldChange(index, "remarkOne", e.target.value)
                        }
                        variant="outlined"
                        fullWidth
                        // disabled={isViewOnly}
                      />
                    </Grid>

                    <Grid item sm={6} xs={12}>
                      <label className="popup-labl pt-4">Remark 2</label>
                      <TextField
                        // label="Remark 2"
                        name="remarkTwo"
                        // className="alias-input-dv"
                        value={remarkList.remarkTwo}
                        onChange={(e) =>
                          handleFieldChange(index, "remarkTwo", e.target.value)
                        }
                        variant="outlined"
                        fullWidth
                        // disabled={isViewOnly}
                      />
                    </Grid>

                    <Grid item sm={6} xs={12}>
                      <label className="popup-labl pt-4">Remark 3</label>
                      <TextField
                        // label="Remark 3"
                        name="remarkThree"
                        // className="alias-input-dv"
                        value={remarkList.remarkThree}
                        onChange={(e) =>
                          handleFieldChange(
                            index,
                            "remarkThree",
                            e.target.value
                          )
                        }
                        variant="outlined"
                        fullWidth
                        // disabled={isViewOnly}
                      />
                    </Grid>

                   {/* <Grid item lg={3} md={3} sm={3} xs={12}>
                      <label className="popup-labl p-4">Start Date</label>
                      <TextField
                        type="date"
                        name="startDate"
                        value={row.start_date}
                        onChange={(e) =>
                          handleFieldChange(index, "start_date", e.target.value)
                        }
                        variant="outlined"
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                        style={{ display: "flex" }}
                        InputProps={{
                          inputProps: {
                            min: currentDate,
                          },
                        }}
                      />
                    </Grid> */}

                    {/* <Grid item lg={3} md={3} sm={3} xs={12}>
                      <label className="popup-labl p-4">End Date</label>
                      <TextField
                        type="date"
                        name="endDate"
                        value={row.end_date}
                        onChange={(e) =>
                          handleFieldChange(index, "end_date", e.target.value)
                        }
                        variant="outlined"
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                        style={{ display: "flex" }}
                        InputProps={{
                          inputProps: {
                            min: currentDate,
                          },
                        }}
                      />
                    </Grid> */}

                    {/* {index === fieldSets.length - 1 && (
                      <Grid item>
                        <Button
                          variant="contained"
                          className={classes.addBtn}
                          size="small"
                          style={{ marginBottom: "2px" }}
                          onClick={addFieldSet}
                        >
                          <Add
                            style={{
                              color: "#FFFFFF",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          />
                        </Button>
                      </Grid>
                    )} */}

                  </Grid>
                </div>
              ))}

              <div className="model-actions flex flex-row pb-20">
               
                <Button
                  id="popup-cancel-btn"
                  variant="contained"
                  className="w-128 mx-auto mt-20"
                  onClick={handleModalClose}
                  style={{
                  }}
                >
                  Cancel
                </Button>

              {processSaveFlag === 0 && (
                <Button
                  id="color-popup-save"
                  variant="contained"
                  className="w-128 mx-auto mt-20 "
                  onClick={handleButtonClick}
                  style={{
                    background: "#415bd4",
                    color: "#FFFFFF",
                  }}
                >
                  Save
                </Button>
                )}

              {processSaveFlag === 1 && (
               <Button
                   id="color-popup-save"
                   variant="contained"
                   className="w-128 mx-auto mt-20 "
                     onClick={() => {
                     if (shippingDateValid(shippingDate)) {
                     handleUpdateProccessLine();
                     }
                    }}
                   style={{
                         background: "#415bd4",
                         color: "#FFFFFF",
                     }}
                  >
                  Save
                </Button>
              )}
              </div>
            </Box>
          </div>
        </Modal>

        <Dialog
          open={deleteModal}
          onClose={handleDeleteClose}
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
              onClick={handleDeleteClose}
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
              Are you sure you want to delete this record?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleDeleteClose}
              className="delete-dialog-box-cancle-button"
            >
              Cancel
            </Button>
            <Button
              onClick={DeleteLot}
              className="delete-dialog-box-delete-button"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      <div>
        <Modal open={open} onClose={handleClose} className={classes.modal}>
          <div style={{ width: 500, background: "#FFFFFF" }}>
            <Typography
              variant="h6"
              className={classes.title}
              style={{ textAlign: "center", position: "relative" }}
            >
              Voucher Format
              <IconButton
                style={{
                  padding: "0",
                  position: "absolute",
                  right: "5px",
                  top: "16px",
                  fontSize: "22px",
                }}
                onClick={handleClose}
              >
                <Icon className="mr-8" style={{ color: "#ffffff" }}>
                  close
                </Icon>
              </IconButton>
            </Typography>

            <Grid container className={classes.modalBody} spacing={2}>
              <FormControl>
                <RadioGroup
                  className="packingslip-table-main"
                  // defaultValue={0}
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={voucherPrintType}
                  onChange={(e) => handleChange(e)}
                >
                  <FormControlLabel
                    value={0}
                    control={<Radio />}
                    label="Lot Summary"
                  />
                  <FormControlLabel
                    value={1}
                    control={<Radio />}
                    label="Lot Design"
                  />
                </RadioGroup>
              </FormControl>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  className={classes.actionBtn}
                  onClick={handlePrint}
                >
                  Print
                </Button>
              </Grid>
            </Grid>
          </div>
        </Modal>
      </div>

      <div style={{ display: "none" }}>
        <LotSummary
          ref={componentRefSummary}
          printObj={printObj}
          getDateAndTime={getDateAndTime()}
        ></LotSummary>
      </div>

      <div style={{ display: "none" }}>
        <LotDesign
          ref={componentRefDesign}
          printObj={printObjMultiple}
        ></LotDesign>
      </div>

    </Box>
  );
};

export default CreatePlanAndLot;
