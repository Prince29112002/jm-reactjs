import React, { useState, useEffect, useContext } from "react";
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
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from "@material-ui/core/TableFooter";
import Paper from "@material-ui/core/Paper";
import Select, { createFilter } from "react-select";
import History from "@history";
import Modal from "@material-ui/core/Modal";
import Loader from "../../../Loader/Loader";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Icon,
  IconButton,
} from "@material-ui/core";
import AppContext from "app/AppContext";
import EditVariant from "./EditVariant/EditVariant";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
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
    backgroundColor: "cornflowerblue",
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

const TagMakingLot = (props) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");

  const [edtOpen, setEdtOpen] = useState(false);
  const [selectedDataForEdit, setSelectedDataForEdit] = useState("");

  const [edtGrossWeight, setEdtGrossWeight] = useState("");
  const [edtGrossWtErr, setEdtGrossWtErr] = useState("");

  const [variation, setVariation] = useState("");

  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(true);

  const [rateList, setRateList] = useState([]);
  const [selectedPartyRate, setSelectedPartyRate] = useState("");
  const [selectedPartyRateErr, setSelectedPartyRateErr] = useState("");

  const [lotGross, setLotGross] = useState(0);
  const [lotNet, setLotNet] = useState(0);
  const [lotRemPcs, setLotRemPcs] = useState(0);
  const [stoneRemPcs, setStoneRemPcs] = useState(0);

  const [lotInput, setLotInput] = useState("");
  const [lotErr, setLotErr] = useState("");
  const [lotId, setLotId] = useState("");
  const [productId, setProductId] = useState("");
  const [lotInputDetails, setLotInputDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [variantInput, setVariantInput] = useState("");
  const [variantInputErr, setVariantInputErr] = useState("");
  const [variantList, setVariantList] = useState([]);
  const [selectedVariantArr, setSelectedVariantArr] = useState([]);
  const [variantArrData, setVariantArrData] = useState({
    pcs: 0,
    batch_number: 0,
    Balance_Pcs: 0,
  });
  const [mainPcs, setMainPcs] = useState(0);
  const [remaining_pcs, setRemainingPcs] = useState(0);
  const [lotPcs, setLotPcs] = useState(0);
  const [mainLotPcs, setMainLotPcs] = useState(0);
  const [displayData, setDisplayData] = useState([]);
  const [variantTotalWeight, setVariantTotalWeight] = useState(0);
  const [netWeight, setNetWeight] = useState(0);
  const [grossWeight, setGrossWeight] = useState(0);
  const [grossWeightErr, setGrossWeightErr] = useState("");
  const [phyQty, setPhyQty] = useState(1);
  const [phyQtyErr, setPhyQtyErr] = useState("");
  const [image, setImage] = useState("");
  const [showmore, setShowmore] = useState(false);
  const [showmoreArr, setShowmoreArr] = useState([]);
  const [singleWeight, setSingleWeight] = useState(0);
  const [totalRate, setTotalRate] = useState(0);
  const [designId, setDesignId] = useState("");
  const [alertModal, setAlertModal] = useState(false);
  const [usedVariant, setUsedVariant] = useState([]);
  const [otherProduct, setOtherProduct] = useState("");
  const displayObject = {
    Variant: "",
    Barcode: "",
    "Gross Weight": "",
    "Net Weight": "",
    "Phy Pcs": "",
    purity: "",
    "Stone Pcs": "",
    "Stone Weight": "",
    "Stone Amt": "",
    "Others Pcs": "",
    "Others Weight": "",
    "Others Amt": "",
    "Beads Pcs": "",
    "Beads Weight": "",
    "Beads Amt": "",
    "CZ Pcs": "",
    "CZ Weight": "",
    "CZ Amt": "",
    "CZH Pcs": "",
    "CZH Weight": "",
    "CZH Amt": "",
    "CZHH Pcs": "",
    "CZHH Weight": "",
    "CZHH Amt": "",
    "Solitaire Pcs": "",
    "Solitaire Weight": "",
    "Solitaire Amt": "",
    "Swarovski Pcs": "",
    "Swarovski Weight": "",
    "Swarovski Amt": "",
    "Brass Bracelets Pcs": "",
    "Brass Bracelets Weight": "",
    "Brass Bracelets Amt": "",
    "Ball Bearing Pcs": "",
    "Ball Bearing Weight": "",
    "Ball Bearing Amt": "",
    "Kundan Pcs": "",
    "Kundan Weight": "",
    "Kundan Amt": "",
    "Synthetic Rubber Belt Pcs": "",
    "Synthetic Rubber Belt Weight": "",
    "Synthetic Rubber Belt Amt": "",
    "Magnet Pcs": "",
    "Magnet Weight": "",
    "Magnet Amt": "",
    "Silicon Rubber Pcs": "",
    "Silicon Rubber Weight": "",
    "Silicon Rubber Amt": "",
    "SS Spring Pcs": "",
    "SS Spring Weight": "",
    "SS Spring Amt": "",
    "Ball Pcs": "",
    "Ball Weight": "",
    "Ball Amt": "",
    "Bracelet Pipe Pcs": "",
    "Bracelet Pipe Weight": "",
    "Bracelet Pipe Amt": "",
    "Chain Pcs": "",
    "Chain Weight": "",
    "Chain Amt": "",
    "Chain Latkan Pcs": "",
    "Chain Latkan Weight": "",
    "Chain Latkan Amt": "",
    "Chain Ball Pcs": "",
    "Chain Ball Weight": "",
    "Chain Ball Amt": "",
    "Latkan Pcs": "",
    "Latkan Weight": "",
    "Latkan Amt": "",
    "South Post Pcs": "",
    "South Post Weight": "",
    "South Post Amt": "",
    "South Patch Pcs": "",
    "South Patch Weight": "",
    "South Patch Amt": "",
    "Threaded Post Pcs": "",
    "Threaded Post Weight": "",
    "Threaded Post Amt": "",
    "North Patch Pcs": "",
    "North Patch Weight": "",
    "North Patch Amt": "",
    "Small Pcs": "",
    "Small Loop Weight": "",
    "Small Loop Amt": "",
    "Big Loop Pcs": "",
    "Big Loop Weight": "",
    "Big Loop Amt": "",
    "Solder Pcs": "",
    "Solder Weight": "",
    "Solder Amt": "",
    "Filing Sprue Pcs": "",
    "Filing Sprue Weight": "",
    "Filing Sprue Amt": "",
    "Flower Pcs": "",
    "Flower Weight": "",
    "Flower Amt": "",
    "Push Post Pcs": "",
    "Push Post Weight": "",
    "Push Post Amt": "",
    "Push Patch Pcs": "",
    "Push Patch Weight": "",
    "Push Patch Amt": "",
    "Hand Machine Dust Pcs": "",
    "Hand Machine Dust Weight": "",
    "Hand Machine Dust Amt": "",
    "Total Weight": "",
    "Total Amt": "",
  };

  const [variantData, setVariantData] = useState([]);
  const [AllVariants, setAllVariants] = useState([]);
  const [modalView, setModalView] = useState(0);
  const [header, setHeader] = useState({
    Variant: "",
    Barcode: "",
    "Gross Weight": "",
    "Net Weight": "",
    "Phy Pcs": "",
    purity: "",
    "Stone Pcs": "",
    "Stone Weight": "",
    "Stone Amt": "",
    "Others Pcs": "",
    "Others Weight": "",
    "Others Amt": "",
    "Beads Pcs": "",
    "Beads Weight": "",
    "Beads Amt": "",
    "CZ Pcs": "",
    "CZ Weight": "",
    "CZ Amt": "",
    "CZH Pcs": "",
    "CZH Weight": "",
    "CZH Amt": "",
    "CZHH Pcs": "",
    "CZHH Weight": "",
    "CZHH Amt": "",
    "Solitaire Pcs": "",
    "Solitaire Weight": "",
    "Solitaire Amt": "",
    "Swarovski Pcs": "",
    "Swarovski Weight": "",
    "Swarovski Amt": "",
    "Brass Bracelets Pcs": "",
    "Brass Bracelets Weight": "",
    "Brass Bracelets Amt": "",
    "Ball Bearing Pcs": "",
    "Ball Bearing Weight": "",
    "Ball Bearing Amt": "",
    "Kundan Pcs": "",
    "Kundan Weight": "",
    "Kundan Amt": "",
    "Synthetic Rubber Belt Pcs": "",
    "Synthetic Rubber Belt Weight": "",
    "Synthetic Rubber Belt Amt": "",
    "Magnet Pcs": "",
    "Magnet Weight": "",
    "Magnet Amt": "",
    "Silicon Rubber Pcs": "",
    "Silicon Rubber Weight": "",
    "Silicon Rubber Amt": "",
    "SS Spring Pcs": "",
    "SS Spring Weight": "",
    "SS Spring Amt": "",
    "Ball Pcs": "",
    "Ball Weight": "",
    "Ball Amt": "",
    "Bracelet Pipe Pcs": "",
    "Bracelet Pipe Weight": "",
    "Bracelet Pipe Amt": "",
    "Chain Pcs": "",
    "Chain Weight": "",
    "Chain Amt": "",
    "Chain Latkan Pcs": "",
    "Chain Latkan Weight": "",
    "Chain Latkan Amt": "",
    "Chain Ball Pcs": "",
    "Chain Ball Weight": "",
    "Chain Ball Amt": "",
    "Latkan Pcs": "",
    "Latkan Weight": "",
    "Latkan Amt": "",
    "South Post Pcs": "",
    "South Post Weight": "",
    "South Post Amt": "",
    "South Patch Pcs": "",
    "South Patch Weight": "",
    "South Patch Amt": "",
    "Threaded Post Pcs": "",
    "Threaded Post Weight": "",
    "Threaded Post Amt": "",
    "North Patch Pcs": "",
    "North Patch Weight": "",
    "North Patch Amt": "",
    "Small Pcs": "",
    "Small Loop Weight": "",
    "Small Loop Amt": "",
    "Big Loop Pcs": "",
    "Big Loop Weight": "",
    "Big Loop Amt": "",
    "Solder Pcs": "",
    "Solder Weight": "",
    "Solder Amt": "",
    "Filing Sprue Pcs": "",
    "Filing Sprue Weight": "",
    "Filing Sprue Amt": "",
    "Flower Pcs": "",
    "Flower Weight": "",
    "Flower Amt": "",
    "Push Post Pcs": "",
    "Push Post Weight": "",
    "Push Post Amt": "",
    "Push Patch Pcs": "",
    "Push Patch Weight": "",
    "Push Patch Amt": "",
    "Hand Machine Dust Pcs": "",
    "Hand Machine Dust Weight": "",
    "Hand Machine Dust Amt": "",
    "Total Weight": "",
    "Total Amt": "",
  });
  const [Mainheader, setMainHeader] = useState({
    Variant: "",
    Barcode: "",
    "Gross Weight": "",
    "Net Weight": "",
    "Phy Pcs": "",
    purity: "",
    "Stone Pcs": "",
    "Stone Weight": "",
    "Stone Amt": "",
    "Others Pcs": "",
    "Others Weight": "",
    "Others Amt": "",
    "Beads Pcs": "",
    "Beads Weight": "",
    "Beads Amt": "",
    "CZ Pcs": "",
    "CZ Weight": "",
    "CZ Amt": "",
    "CZH Pcs": "",
    "CZH Weight": "",
    "CZH Amt": "",
    "CZHH Pcs": "",
    "CZHH Weight": "",
    "CZHH Amt": "",
    "Solitaire Pcs": "",
    "Solitaire Weight": "",
    "Solitaire Amt": "",
    "Swarovski Pcs": "",
    "Swarovski Weight": "",
    "Swarovski Amt": "",
    "Brass Bracelets Pcs": "",
    "Brass Bracelets Weight": "",
    "Brass Bracelets Amt": "",
    "Ball Bearing Pcs": "",
    "Ball Bearing Weight": "",
    "Ball Bearing Amt": "",
    "Kundan Pcs": "",
    "Kundan Weight": "",
    "Kundan Amt": "",
    "Synthetic Rubber Belt Pcs": "",
    "Synthetic Rubber Belt Weight": "",
    "Synthetic Rubber Belt Amt": "",
    "Magnet Pcs": "",
    "Magnet Weight": "",
    "Magnet Amt": "",
    "Silicon Rubber Pcs": "",
    "Silicon Rubber Weight": "",
    "Silicon Rubber Amt": "",
    "SS Spring Pcs": "",
    "SS Spring Weight": "",
    "SS Spring Amt": "",
    "Ball Pcs": "",
    "Ball Weight": "",
    "Ball Amt": "",
    "Bracelet Pipe Pcs": "",
    "Bracelet Pipe Weight": "",
    "Bracelet Pipe Amt": "",
    "Chain Pcs": "",
    "Chain Weight": "",
    "Chain Amt": "",
    "Chain Latkan Pcs": "",
    "Chain Latkan Weight": "",
    "Chain Latkan Amt": "",
    "Chain Ball Pcs": "",
    "Chain Ball Weight": "",
    "Chain Ball Amt": "",
    "Latkan Pcs": "",
    "Latkan Weight": "",
    "Latkan Amt": "",
    "South Post Pcs": "",
    "South Post Weight": "",
    "South Post Amt": "",
    "South Patch Pcs": "",
    "South Patch Weight": "",
    "South Patch Amt": "",
    "Threaded Post Pcs": "",
    "Threaded Post Weight": "",
    "Threaded Post Amt": "",
    "North Patch Pcs": "",
    "North Patch Weight": "",
    "North Patch Amt": "",
    "Small Pcs": "",
    "Small Loop Weight": "",
    "Small Loop Amt": "",
    "Big Loop Pcs": "",
    "Big Loop Weight": "",
    "Big Loop Amt": "",
    "Solder Pcs": "",
    "Solder Weight": "",
    "Solder Amt": "",
    "Filing Sprue Pcs": "",
    "Filing Sprue Weight": "",
    "Filing Sprue Amt": "",
    "Flower Pcs": "",
    "Flower Weight": "",
    "Flower Amt": "",
    "Push Post Pcs": "",
    "Push Post Weight": "",
    "Push Post Amt": "",
    "Push Patch Pcs": "",
    "Push Patch Weight": "",
    "Push Patch Amt": "",
    "Hand Machine Dust Pcs": "",
    "Hand Machine Dust Weight": "",
    "Hand Machine Dust Amt": "",
    "Total Weight": "",
    "Total Amt": "",
  });
  const [merge, Setmerge] = useState(false);
  const [addedTotalGrossWgt, setAddedTotalGrossWgt] = useState(0);
  const [addedTotalNetWgt, setAddedTotalNetWgt] = useState(0);
  const [addedTotalPcs, setAddedTotalPcs] = useState(0);

  const [currentTotalGrossWeight, setCurrentTotalGrossWeight] = useState(0);
  const [currentTotalNetWeight, setCurrentTotalNetWeight] = useState(0);
  const [currentTotalPcs, setCurrentTotalPcs] = useState(0);
  const [weightDifference, setWeightDifference] = useState(0);

  const [viewMoreTotalWgt, setViewMoreTotalWgt] = useState(0);
  const [viewNintyTotalWgt, setViewNintyTotalWgt] = useState(0);
  const [viewMorePcs, setViewMorePcs] = useState(0);

  const [formatList, setFormatList] = useState([]);
  const [printerList, setPrinterList] = useState([]);
  const [systemList, setSystemList] = useState([]);

  const [selectedFormat, setSelectedFormat] = useState([]);

  const appContext = useContext(AppContext);
  const { selectedDepartment } = appContext;

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 5000);
    }
  }, [loading]);

  useEffect(() => {
    getRateList();
    getFormatList();
    getPrinterList();
    getSystemList();
  }, [dispatch]);

  useEffect(() => {
    NavbarSetting("Tagging", dispatch);
  }, []);

  useEffect(() => {
    if (lotInput) {
      callLotDetailsApi(lotInput);
    }
  }, [selectedDepartment]);

  useEffect(() => {
    if (grossWeight > 0 && phyQty != 0) {
      callNetWeightcalculation();
    } else {
      setNetWeight(0);
    }
  }, [grossWeight, phyQty]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (lotInput) {
        callLotDetailsApi(lotInput);
      }
    }, 800);
    return () => {
      clearTimeout(timeout);
    };
  }, [lotInput]);

  useEffect(() => {
    const lotNum = props.location.state.lot_id;
    setLotInput(lotNum.stockname);
  }, [props.location.state]);

  useEffect(() => {
    updateFormatListArr();
  }, [selectedFormat]);

  function updateFormatListArr() {
    const arrData = [...formatList];

    arrData.map((item) => {
      if (selectedFormat.includes(item.id)) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    });
    setFormatList(arrData);
  }

  function getRateList() {
    axios
      .get(Config.getCommonUrl() + "api/taggingRateProfile")
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setRateList(response.data.data);
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
        handleError(error, dispatch, { api: "api/taggingRateProfile" });
      });
  }

  function getFormatList() {
    axios
      .get(Config.getCommonUrl() + "api/tagformat")
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setFormatList(response.data.data);
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
        handleError(error, dispatch, { api: "api/tagformat" });
      });
  }

  function getPrinterList() {
    axios
      .get(Config.getCommonUrl() + "api/tagprinter")
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setPrinterList(response.data.data);
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
        handleError(error, dispatch, { api: "api/tagprinter" });
      });
  }

  function getSystemList() {
    axios
      .get(Config.getCommonUrl() + "api/tagsystem")
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setSystemList(response.data.data);
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
        handleError(error, dispatch, { api: "api/tagsystem" });
      });
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

  const handlepartyRate = (value) => {
    setSelectedPartyRate(value);
    setSelectedPartyRateErr("");
  };

  const handleVariantInput = (value, data) => {
    if (selectedPartyRate === "") {
      setSelectedPartyRateErr("Please select  party rate profile");
    } else {
      if (remaining_pcs === 0) {
        setVariantInput(value);
        setVariantInputErr("");
        if (data.action === "select-option") {
          const variantName = value.label.split("-")[0];
          setCurrentTotalGrossWeight(0);
          setCurrentTotalNetWeight(0);
          setCurrentTotalPcs(0);
          callVariantDetailsApi(variantName);
        }
      } else {
        setAlertModal(true);
      }
    }
  };

  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    if (name === "lotInput") {
      setLotInput(value);
      setLotErr("");
    } else if (name === "grossWeight") {
      if (value.length < 10) {
        setGrossWeight(value);
        setGrossWeightErr("");
      }
      if (isNaN(Number(value)) || value <= 0 || value.length > 8) {
        setGrossWeightErr("Please enter valid gross weight");
      }
    } else if (name === "phyQty") {
      if (
        isNaN(Number(value)) ||
        value > variantArrData.Balance_Pcs ||
        value <= 0 ||
        value % 1 !== 0
      ) {
        setPhyQtyErr("Please enter valid Qty");
        setPhyQty(value);
      } else {
        setPhyQty(value);
        setPhyQtyErr("");
        setQtyWeight(value);
      }
    } else if (name === "edtGrossWeight") {
      setEdtGrossWeight(value);
      setEdtGrossWtErr("");
    }
  };

  function setQtyWeight(value) {
    const pastDisplay = [...displayData];
    var totalSweight = 0;
    var totalRate = 0;
    pastDisplay.map((w) => {
      w.sWeight = (w.weight * value) / variantArrData.Balance_Pcs;
      w.sRate = (w.rate * w.sWeight) / w.weight;
      totalSweight += w.sWeight;
      totalRate += w.sRate;
    });
    setTotalRate(totalRate);
    setSingleWeight(totalSweight);
    setDisplayData(pastDisplay);
  }

  function callLotDetailsApi(lotInput) {
    if (selectedDepartment.value) {
      setLoading(true);
      axios
        .get(
          Config.getCommonUrl() +
            `api/lot/Number/${lotInput}/${
              selectedDepartment.value.split("-")[1]
            }`
        )
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            if (res.data.data[0].length > 0) {
              const data = res.data.data[0];
              setLotInputDetails(data[0]);
              setLotId(data[0].id);
              setProductId(data[0].product_category_id);
              res.data.MergeSetting ? Setmerge(true) : Setmerge(false);
              setLotPcs(data[0].pcs);
              setMainLotPcs(data[0].pcs);
              getAlldeatailVariant(data[0].id, data[0].pcs, data[0]);
            } else {
              setLotInputDetails([]);
              setLotId("");
              setProductId("");
              setLotPcs(0);
              setMainLotPcs(0);
              dispatch(
                Actions.showMessage({
                  message: "Lot details not available",
                  variant: "error",
                })
              );
            }
          } else {
            dispatch(Actions.showMessage({ message: res.data.message }));
          }
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          handleError(error, dispatch, {
            api: `api/lot/Number/${lotInput}/${
              selectedDepartment.value.split("-")[1]
            }`,
          });
        });
    }
  }

  function callAllVariantApi(lotid, arrayDta) {
    axios
      .get(Config.getCommonUrl() + `api/lotdetail/lot/variant/${lotid}`)
      .then((res) => {
        const arr = res.data.data[0];

        const dataArr = arr.filter((i) => {
          if (i.batch_no in arrayDta) {
            if (arrayDta[i.batch_no].phy_pcs !== i.design_pcs) return i;
          } else {
            return i;
          }
        });
        setVariantList(dataArr);
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/lotdetail/lot/variant/${lotid}`,
        });
      });
  }

  function callMeargeVariant(lotid, arrayDta) {
    axios
      .get(
        Config.getCommonUrl() + `api/groupmerging/group/lot/merging/${lotid}`
      )
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          const List = res.data.data;
          let tempData = [];
          List.map((item) => {
            tempData = [...tempData, ...item[0]];
          });

          const dataArr = tempData.filter((i) => {
            if (i.batch_no in arrayDta) {
              if (arrayDta[i.batch_no].phy_pcs > i.design_pcs) return i;
            } else {
              return i;
            }
          });
          setVariantList(dataArr);
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/groupmerging/group/lot/merging/${lotid}`,
        });
      });
  }

  function callVariantDetailsApi(variant) {
    axios
      .get(
        Config.getCommonUrl() +
          `api/design/variant/${lotId}/${selectedPartyRate.value}/${productId}/${variant}`
      )
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          const apiData = res.data.data;
          const stockData = res.data.CheckStock;
          setImage(
            `${Config.getS3Url()}vkjdev/design/image/${
              apiData.image_files[0].image_file
            }`
          );
          const design_Id = apiData.id;
          setDesignId(design_Id);

          if (apiData.DesignData.length > 0 && stockData.length > 0) {
            const otherProducts = stockData[0].product_categorie_id;
            setOtherProduct(otherProducts);
            callDisplayDataApi(design_Id, otherProducts);
            const tempData = variantArrData;
            const moreData = [...showmoreArr];
            let moreTotalWgt = 0;
            let moreTotalPcs = 0;
            let nintyTotalWgt = 0;
            apiData.DesignData.map((item) => {
              const data = stockData.filter((optn) => {
                return optn.stock_name_code_id === item.stock_code_id;
              });

              const saprateData = data[0].stone_name_code.stock_description;
              const stockArrData = data[0].stone_name_code;
              const rateData = data[0];

              moreTotalPcs += parseFloat(item.pcs);
              const wgt = parseFloat(stockArrData.weight) * item.pcs;
              moreTotalWgt += wgt;
              const nintyPerWgt = (wgt * rateData.weight) / 100;
              nintyTotalWgt += nintyPerWgt;

              moreData.push({
                variantNo: apiData.variant_number,
                stockNo: stockArrData.stock_code,
                description: saprateData.description,
                pcs: item.pcs,
                weight: wgt,
                nintyweight: nintyPerWgt,
                is_pcs_grm: rateData.is_pcs_grm,
                rate: rateData.rate,
              });

              setMainPcs(item.design_pcs);
              setRemainingPcs(item.pcs);

              tempData.pcs = item.design_pcs;
              tempData.batch_number = item.batch_no;
              tempData.Balance_Pcs = item.design_pcs;
            });

            setVariantArrData((prevState) => ({
              ...prevState,
              tempData,
            }));
            setShowmoreArr(moreData);
            setViewMoreTotalWgt(moreTotalWgt);
            setViewNintyTotalWgt(nintyTotalWgt);
            setWeightDifference(moreTotalWgt - nintyTotalWgt);
            setViewMorePcs(moreTotalPcs);
          } else {
            dispatch(
              Actions.showMessage({
                message: "Stock data is not available",
                variant: "error",
              })
            );
          }
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/design/variant/${lotId}/${selectedPartyRate.value}/${productId}/${variant}`,
        });
      });
  }

  function callDisplayDataApi(designIds, otherProducts) {
    setLoading(true);
    axios
      .get(
        Config.getCommonUrl() +
          `api/lotdetail/product/${lotId}/${designIds}/${selectedPartyRate.value}/${otherProducts}/1`
      )
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          const data = res.data.data[0];
          var total = 0;
          var totalSweight = 0;
          var totalRate = 0;
          data.map((w) => {
            total += w.weight;
            w.mainWeight = w.weight;
            w.sWeight = (w.weight * phyQty) / variantArrData.Balance_Pcs;
            w.sRate = (w.rate * w.sWeight) / w.mainWeight;
            totalSweight += w.sWeight;
            totalRate += w.sRate;
          });
          setTotalRate(totalRate);
          setSingleWeight(totalSweight);
          setVariantTotalWeight(total);
          setDisplayData(data);
          getAddedVariantData(designIds, data);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {
          api: `api/lotdetail/product/${lotId}/${designIds}/${selectedPartyRate.value}/${otherProducts}/1`,
        });
      });
  }

  function getAlldeatailVariant(lotid, totlalPcs, lotArrayData) {
    setLoading(true);
    axios
      .get(
        Config.getCommonUrl() +
          `api/packet/product/entry/all/${lotid}/${
            selectedDepartment.value.split("-")[1]
          }`
      )
      .then((response) => {
        console.log(response);
        let addedVariant = [];
        if (response.data.success) {
          setVariation(
            response.data.Variation
              ? response.data.Variation.tagging_lot_variation
              : ""
          );
          if (response.data.data.length > 0) {
            const apiData = response.data.data;
            let phy_total = 0;
            let totalGross = 0;
            let totalNet = 0;
            let stone_total = 0;
            let arr = [];
            let headers = Mainheader;
            apiData.map((x) => {
              let res = JSON.parse(x.details_json);
              let temp = {
                Variant: "",
                Barcode: "",
                "Gross Weight": "",
                "Net Weight": "",
                "Phy Pcs": "",
                purity: "",
                "Stone Pcs": "",
                "Stone Weight": "",
                "Stone Amt": "",
                "Others Pcs": "",
                "Others Weight": "",
                "Others Amt": "",
                "Beads Pcs": "",
                "Beads Weight": "",
                "Beads Amt": "",
                "CZ Pcs": "",
                "CZ Weight": "",
                "CZ Amt": "",
                "CZH Pcs": "",
                "CZH Weight": "",
                "CZH Amt": "",
                "CZHH Pcs": "",
                "CZHH Weight": "",
                "CZHH Amt": "",
                "Solitaire Pcs": "",
                "Solitaire Weight": "",
                "Solitaire Amt": "",
                "Swarovski Pcs": "",
                "Swarovski Weight": "",
                "Swarovski Amt": "",
                "Brass Bracelets Pcs": "",
                "Brass Bracelets Weight": "",
                "Brass Bracelets Amt": "",
                "Ball Bearing Pcs": "",
                "Ball Bearing Weight": "",
                "Ball Bearing Amt": "",
                "Kundan Pcs": "",
                "Kundan Weight": "",
                "Kundan Amt": "",
                "Synthetic Rubber Belt Pcs": "",
                "Synthetic Rubber Belt Weight": "",
                "Synthetic Rubber Belt Amt": "",
                "Magnet Pcs": "",
                "Magnet Weight": "",
                "Magnet Amt": "",
                "Silicon Rubber Pcs": "",
                "Silicon Rubber Weight": "",
                "Silicon Rubber Amt": "",
                "SS Spring Pcs": "",
                "SS Spring Weight": "",
                "SS Spring Amt": "",
                "Ball Pcs": "",
                "Ball Weight": "",
                "Ball Amt": "",
                "Bracelet Pipe Pcs": "",
                "Bracelet Pipe Weight": "",
                "Bracelet Pipe Amt": "",
                "Chain Pcs": "",
                "Chain Weight": "",
                "Chain Amt": "",
                "Chain Latkan Pcs": "",
                "Chain Latkan Weight": "",
                "Chain Latkan Amt": "",
                "Chain Ball Pcs": "",
                "Chain Ball Weight": "",
                "Chain Ball Amt": "",
                "Latkan Pcs": "",
                "Latkan Weight": "",
                "Latkan Amt": "",
                "South Post Pcs": "",
                "South Post Weight": "",
                "South Post Amt": "",
                "South Patch Pcs": "",
                "South Patch Weight": "",
                "South Patch Amt": "",
                "Threaded Post Pcs": "",
                "Threaded Post Weight": "",
                "Threaded Post Amt": "",
                "North Patch Pcs": "",
                "North Patch Weight": "",
                "North Patch Amt": "",
                "Small Pcs": "",
                "Small Loop Weight": "",
                "Small Loop Amt": "",
                "Big Loop Pcs": "",
                "Big Loop Weight": "",
                "Big Loop Amt": "",
                "Solder Pcs": "",
                "Solder Weight": "",
                "Solder Amt": "",
                "Filing Sprue Pcs": "",
                "Filing Sprue Weight": "",
                "Filing Sprue Amt": "",
                "Flower Pcs": "",
                "Flower Weight": "",
                "Flower Amt": "",
                "Push Post Pcs": "",
                "Push Post Weight": "",
                "Push Post Amt": "",
                "Push Patch Pcs": "",
                "Push Patch Weight": "",
                "Push Patch Amt": "",
                "Hand Machine Dust Pcs": "",
                "Hand Machine Dust Weight": "",
                "Hand Machine Dust Amt": "",
                "Total Weight": "",
                "Total Amt": "",
              };
              for (let x in res) {
                headers[x] = true;
                temp[x] = res[x];
              }
              temp.Barcode = x.BarCodeProduct.barcode;
              headers["Barcode"] = true;
              headers["Gross Weight"] = true;
              headers["Net Weight"] = true;
              headers["Phy Pcs"] = true;
              temp["Gross Weight"] = x.gross_wgt;
              temp["Net Weight"] = x.net_wgt;
              temp["Phy Pcs"] = x.phy_pcs;
              temp["id"] = x.id;
              phy_total += x.phy_pcs;
              stone_total += x.stone_pcs;
              totalGross += parseFloat(x.gross_wgt);
              totalNet += parseFloat(x.net_wgt);
              if (x.batch_number in addedVariant) {
                addedVariant[x.batch_number].phy_pcs += x.phy_pcs;
              } else {
                addedVariant[x.batch_number] = {
                  batch_number: x.batch_number,
                  phy_pcs: x.phy_pcs,
                };
              }
              arr.push(temp);
            });
            setMainHeader(headers);
            setAllVariants(arr);
            const dataRemain = totlalPcs - phy_total;
            setLotPcs(dataRemain);
            setAddedTotalGrossWgt(totalGross);
            setAddedTotalNetWgt(totalNet);
            setAddedTotalPcs(phy_total);
            const total_gross_wgt =
              parseFloat(lotArrayData.total_gross_wgt) - totalGross;
            const total_net_wgt =
              parseFloat(lotArrayData.total_net_wgt) - totalNet;
            const pcs = lotArrayData.pcs - phy_total;
            const stoneRemainingPcs = lotArrayData.stone_pcs - stone_total;
            setLotGross(total_gross_wgt);
            setLotNet(total_net_wgt);
            setLotRemPcs(pcs);
            setStoneRemPcs(stoneRemainingPcs);
            setUsedVariant(addedVariant);
          } else {
            setLotGross(lotArrayData.total_gross_wgt);
            setLotNet(lotArrayData.total_net_wgt);
            setLotRemPcs(lotArrayData.pcs);
            setStoneRemPcs(lotArrayData.stone_pcs);
            setAllVariants([]);
          }
          if (merge) {
            callMeargeVariant(lotArrayData.id, addedVariant);
          } else {
            callAllVariantApi(lotArrayData.id, addedVariant);
          }
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {
          api: `api/packet/product/entry/all/${lotid}/${
            selectedDepartment.value.split("-")[1]
          }`,
        });
      });
  }

  function getAddedVariantData(designIds, objData) {
    axios
      .get(Config.getCommonUrl() + `api/lotdetail/entry/${lotId}/${designIds}`)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          let currGross = 0;
          let currNet = 0;
          let currPcs = 0;
          if (response.data.data.length > 0) {
            const childPcs = variantArrData.Balance_Pcs;
            const apiData = response.data.data;
            let added_pcs = 0;
            apiData.map((item) => (added_pcs += item.phy_pcs));
            var remainingEntry = childPcs - added_pcs;
            if (remainingEntry === 0) {
              setVariantArrData({
                pcs: 0,
                batch_number: 0,
                Balance_Pcs: 0,
              });
              setDesignId("");
              setMainPcs(0);
              setRemainingPcs(0);
              setTotalRate(0);
              setSingleWeight(0);
              setShowmoreArr([]);
              setShowmore(false);
              setGrossWeight(0);
              setNetWeight(0);
              setVariantTotalWeight(0);
              setDisplayData([]);
              let arr = [];
              let headers = header;
              apiData.map((x) => {
                let res = JSON.parse(x.details_json);
                let temp = {
                  Variant: "",
                  Barcode: "",
                  "Gross Weight": "",
                  "Net Weight": "",
                  "Phy Pcs": "",
                  purity: "",
                  "Stone Pcs": "",
                  "Stone Weight": "",
                  "Stone Amt": "",
                  "Others Pcs": "",
                  "Others Weight": "",
                  "Others Amt": "",
                  "Beads Pcs": "",
                  "Beads Weight": "",
                  "Beads Amt": "",
                  "CZ Pcs": "",
                  "CZ Weight": "",
                  "CZ Amt": "",
                  "CZH Pcs": "",
                  "CZH Weight": "",
                  "CZH Amt": "",
                  "CZHH Pcs": "",
                  "CZHH Weight": "",
                  "CZHH Amt": "",
                  "Solitaire Pcs": "",
                  "Solitaire Weight": "",
                  "Solitaire Amt": "",
                  "Swarovski Pcs": "",
                  "Swarovski Weight": "",
                  "Swarovski Amt": "",
                  "Brass Bracelets Pcs": "",
                  "Brass Bracelets Weight": "",
                  "Brass Bracelets Amt": "",
                  "Ball Bearing Pcs": "",
                  "Ball Bearing Weight": "",
                  "Ball Bearing Amt": "",
                  "Kundan Pcs": "",
                  "Kundan Weight": "",
                  "Kundan Amt": "",
                  "Synthetic Rubber Belt Pcs": "",
                  "Synthetic Rubber Belt Weight": "",
                  "Synthetic Rubber Belt Amt": "",
                  "Magnet Pcs": "",
                  "Magnet Weight": "",
                  "Magnet Amt": "",
                  "Silicon Rubber Pcs": "",
                  "Silicon Rubber Weight": "",
                  "Silicon Rubber Amt": "",
                  "SS Spring Pcs": "",
                  "SS Spring Weight": "",
                  "SS Spring Amt": "",
                  "Ball Pcs": "",
                  "Ball Weight": "",
                  "Ball Amt": "",
                  "Bracelet Pipe Pcs": "",
                  "Bracelet Pipe Weight": "",
                  "Bracelet Pipe Amt": "",
                  "Chain Pcs": "",
                  "Chain Weight": "",
                  "Chain Amt": "",
                  "Chain Latkan Pcs": "",
                  "Chain Latkan Weight": "",
                  "Chain Latkan Amt": "",
                  "Chain Ball Pcs": "",
                  "Chain Ball Weight": "",
                  "Chain Ball Amt": "",
                  "Latkan Pcs": "",
                  "Latkan Weight": "",
                  "Latkan Amt": "",
                  "South Post Pcs": "",
                  "South Post Weight": "",
                  "South Post Amt": "",
                  "South Patch Pcs": "",
                  "South Patch Weight": "",
                  "South Patch Amt": "",
                  "Threaded Post Pcs": "",
                  "Threaded Post Weight": "",
                  "Threaded Post Amt": "",
                  "North Patch Pcs": "",
                  "North Patch Weight": "",
                  "North Patch Amt": "",
                  "Small Pcs": "",
                  "Small Loop Weight": "",
                  "Small Loop Amt": "",
                  "Big Loop Pcs": "",
                  "Big Loop Weight": "",
                  "Big Loop Amt": "",
                  "Solder Pcs": "",
                  "Solder Weight": "",
                  "Solder Amt": "",
                  "Filing Sprue Pcs": "",
                  "Filing Sprue Weight": "",
                  "Filing Sprue Amt": "",
                  "Flower Pcs": "",
                  "Flower Weight": "",
                  "Flower Amt": "",
                  "Push Post Pcs": "",
                  "Push Post Weight": "",
                  "Push Post Amt": "",
                  "Push Patch Pcs": "",
                  "Push Patch Weight": "",
                  "Push Patch Amt": "",
                  "Hand Machine Dust Pcs": "",
                  "Hand Machine Dust Weight": "",
                  "Hand Machine Dust Amt": "",
                  "Total Weight": "",
                  "Total Amt": "",
                };
                for (let x in res) {
                  headers[x] = true;
                  temp[x] = res[x];
                }
                temp.Barcode = x.BarCodeProduct.barcode;
                headers["Barcode"] = true;
                headers["Gross Weight"] = true;
                headers["Net Weight"] = true;
                headers["Phy Pcs"] = true;
                temp["Gross Weight"] = x.gross_wgt;
                temp["Net Weight"] = x.net_wgt;
                temp["Phy Pcs"] = x.phy_pcs;
                currGross += parseFloat(x.gross_wgt);
                currNet += parseFloat(x.net_wgt);
                currPcs += x.phy_pcs;
                arr.push(temp);
              });
              setCurrentTotalGrossWeight(currGross);
              setCurrentTotalNetWeight(currNet);
              setCurrentTotalPcs(currPcs);
              setHeader(headers);
              setVariantData(arr);
            } else {
              let arr = [];
              let headers = header;
              let displayObject = objData;
              var total = 0;
              var totalSweight = 0;
              var totalRate = 0;
              apiData.map((x) => {
                let res = JSON.parse(x.details_json);
                let temp = {
                  Variant: "",
                  Barcode: "",
                  "Gross Weight": "",
                  "Net Weight": "",
                  "Phy Pcs": "",
                  purity: "",
                  "Stone Pcs": "",
                  "Stone Weight": "",
                  "Stone Amt": "",
                  "Others Pcs": "",
                  "Others Weight": "",
                  "Others Amt": "",
                  "Beads Pcs": "",
                  "Beads Weight": "",
                  "Beads Amt": "",
                  "CZ Pcs": "",
                  "CZ Weight": "",
                  "CZ Amt": "",
                  "CZH Pcs": "",
                  "CZH Weight": "",
                  "CZH Amt": "",
                  "CZHH Pcs": "",
                  "CZHH Weight": "",
                  "CZHH Amt": "",
                  "Solitaire Pcs": "",
                  "Solitaire Weight": "",
                  "Solitaire Amt": "",
                  "Swarovski Pcs": "",
                  "Swarovski Weight": "",
                  "Swarovski Amt": "",
                  "Brass Bracelets Pcs": "",
                  "Brass Bracelets Weight": "",
                  "Brass Bracelets Amt": "",
                  "Ball Bearing Pcs": "",
                  "Ball Bearing Weight": "",
                  "Ball Bearing Amt": "",
                  "Kundan Pcs": "",
                  "Kundan Weight": "",
                  "Kundan Amt": "",
                  "Synthetic Rubber Belt Pcs": "",
                  "Synthetic Rubber Belt Weight": "",
                  "Synthetic Rubber Belt Amt": "",
                  "Magnet Pcs": "",
                  "Magnet Weight": "",
                  "Magnet Amt": "",
                  "Silicon Rubber Pcs": "",
                  "Silicon Rubber Weight": "",
                  "Silicon Rubber Amt": "",
                  "SS Spring Pcs": "",
                  "SS Spring Weight": "",
                  "SS Spring Amt": "",
                  "Ball Pcs": "",
                  "Ball Weight": "",
                  "Ball Amt": "",
                  "Bracelet Pipe Pcs": "",
                  "Bracelet Pipe Weight": "",
                  "Bracelet Pipe Amt": "",
                  "Chain Pcs": "",
                  "Chain Weight": "",
                  "Chain Amt": "",
                  "Chain Latkan Pcs": "",
                  "Chain Latkan Weight": "",
                  "Chain Latkan Amt": "",
                  "Chain Ball Pcs": "",
                  "Chain Ball Weight": "",
                  "Chain Ball Amt": "",
                  "Latkan Pcs": "",
                  "Latkan Weight": "",
                  "Latkan Amt": "",
                  "South Post Pcs": "",
                  "South Post Weight": "",
                  "South Post Amt": "",
                  "South Patch Pcs": "",
                  "South Patch Weight": "",
                  "South Patch Amt": "",
                  "Threaded Post Pcs": "",
                  "Threaded Post Weight": "",
                  "Threaded Post Amt": "",
                  "North Patch Pcs": "",
                  "North Patch Weight": "",
                  "North Patch Amt": "",
                  "Small Pcs": "",
                  "Small Loop Weight": "",
                  "Small Loop Amt": "",
                  "Big Loop Pcs": "",
                  "Big Loop Weight": "",
                  "Big Loop Amt": "",
                  "Solder Pcs": "",
                  "Solder Weight": "",
                  "Solder Amt": "",
                  "Filing Sprue Pcs": "",
                  "Filing Sprue Weight": "",
                  "Filing Sprue Amt": "",
                  "Flower Pcs": "",
                  "Flower Weight": "",
                  "Flower Amt": "",
                  "Push Post Pcs": "",
                  "Push Post Weight": "",
                  "Push Post Amt": "",
                  "Push Patch Pcs": "",
                  "Push Patch Weight": "",
                  "Push Patch Amt": "",
                  "Hand Machine Dust Pcs": "",
                  "Hand Machine Dust Weight": "",
                  "Hand Machine Dust Amt": "",
                  "Total Weight": "",
                  "Total Amt": "",
                };

                for (let x in res) {
                  displayObject.map((item) => {
                    var temp1 = x.split(" ");
                    if (temp1[0] === item.description) {
                      if (`${temp1[0]} Pcs` == x) {
                        item.pcs -= res[`${temp1[0]} Pcs`];
                      }
                      if (`${temp1[0]} Weight` == x) {
                        item.weight -= res[`${temp1[0]} Weight`];
                      }
                      item.sWeight = (item.weight * phyQty) / remainingEntry;
                      item.sRate = (item.rate * item.sWeight) / item.mainWeight;
                    }
                  });
                  headers[x] = true;
                  temp[x] = res[x];
                }
                temp.Barcode = x.BarCodeProduct.barcode;
                headers["Barcode"] = true;
                headers["Gross Weight"] = true;
                headers["Net Weight"] = true;
                headers["Phy Pcs"] = true;
                temp["Gross Weight"] = x.gross_wgt;
                temp["Net Weight"] = x.net_wgt;
                temp["Phy Pcs"] = x.phy_pcs;
                currGross += parseFloat(x.gross_wgt);
                currNet += parseFloat(x.net_wgt);
                currPcs += x.phy_pcs;
                arr.push(temp);
              });
              displayObject.map((t) => {
                totalSweight += t.sWeight;
                totalRate += t.sRate;
                total += t.weight;
              });
              setVariantArrData({
                pcs: remainingEntry,
                batch_number: variantArrData.batch_number,
                Balance_Pcs: remainingEntry,
              });
              setCurrentTotalGrossWeight(currGross);
              setCurrentTotalNetWeight(currNet);
              setCurrentTotalPcs(currPcs);
              setTotalRate(totalRate);
              setSingleWeight(totalSweight);
              setVariantTotalWeight(total);
              setDisplayData(displayObject);
              setHeader(headers);
              setVariantData(arr);
            }
          } else {
            setVariantData([]);
          }
        }
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {
          api: `api/lotdetail/entry/${lotId}/${designIds}`,
        });
      });
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (selectedFormat.length > 0) {
      if (validateFormatArr()) {
        setOpen(false);
      }
    }
  };

  const validateFormatArr = () => {
    const res = formatList.map((item) => {
      if (item.selected) {
        if (!item.printer_id || !item.system_id) {
          dispatch(
            Actions.showMessage({
              message: "Select Printer and System for selected format",
              variant: "error",
            })
          );
          return false;
        }
      }
    });
    if (res.includes(false)) {
      return false;
    } else {
      return true;
    }
  };

  const handleClose = () => {
    setOpen(false);
    History.push("/dashboard/stock");
  };

  function validateLotNum() {
    if (lotInput === "") {
      setLotErr("Enter or Scan lot Barcode");
      return false;
    }
    return true;
  }

  function validatePartyRate() {
    if (selectedPartyRate === "") {
      setSelectedPartyRateErr("Please select  party rate profile");
      return false;
    }
    return true;
  }

  function validateVariant() {
    if (variantInput === "") {
      setVariantInputErr("Please Select variant Number");
      return false;
    }
    return true;
  }

  function validateGrossWeight() {
    if (grossWeight === "" || grossWeight <= 0) {
      setGrossWeightErr("Please enter valid gross weight");
      return false;
    }
    if (grossWeightErr) {
      return false;
    }
    return true;
  }

  function validatePhyQty() {
    if (phyQty === "" || phyQty > variantArrData.Balance_Pcs || phyQty === 0) {
      setPhyQtyErr("Please enter valid Qty");
      return false;
    }
    if (phyQtyErr) {
      return false;
    }
    return true;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      validateLotNum() &&
      validatePartyRate() &&
      validateVariant() &&
      validateGrossWeight() &&
      validatePhyQty()
    ) {
      if (displayData.length > 0) {
        callCreateLotApi();
      }
    }
  };

  function callCreateLotApi() {
    setLoading(true);
    let printerArr = [];
    formatList.map((item) => {
      if (item.selected) {
        printerArr.push({
          format_id: item.id,
          printer_id: item.printer_id,
          system_id: item.system_id,
        });
      }
    });
    const body = {
      lot_id: lotId,
      design_id: designId,
      product_category_id: productId,
      stock_bar_code: lotInput,
      phy_pcs: phyQty,
      batch_number: variantArrData.batch_number,
      gross_wgt: parseFloat(grossWeight),
      net_wgt: parseFloat(netWeight),
      Variant: variantInput.value.split("-")[0],
      purity: lotInputDetails.purity,
      "Total Weight": singleWeight.toFixed(3),
      "Total Amt": totalRate.toFixed(3),
      department_id: selectedDepartment.value.split("-")[1],
      wgt_diff: weightDifference,
    };
    let stonepcs = 0;
    displayData.map((item) => {
      body[`${item.description} Pcs`] =
        (item.pcs * phyQty) / variantArrData.Balance_Pcs;
      body[`${item.description} Weight`] = item.sWeight.toFixed(3);
      body[`${item.description} Amt`] = item.sRate.toFixed(3);
      stonepcs += (item.pcs * phyQty) / variantArrData.Balance_Pcs;
    });
    body["stone_pcs"] = stonepcs;
    body["system_print_format"] = printerArr;
    axios
      .post(Config.getCommonUrl() + "api/lotdetail/product", body)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          const childPcs = variantArrData.Balance_Pcs - phyQty;
          getAddedData(response.data.data.id);
          if (childPcs === 0) {
            setSelectedVariantArr([
              ...selectedVariantArr,
              variantInput.value.split("-")[0],
            ]);
            setVariantArrData({
              pcs: 0,
              batch_number: 0,
              Balance_Pcs: 0,
            });
            setDesignId("");
            setMainPcs(0);
            setRemainingPcs(0);
            setTotalRate(0);
            setSingleWeight(0);
            setShowmoreArr([]);
            setShowmore(false);
            setGrossWeight(0);
            setNetWeight(0);
            setVariantTotalWeight(0);
            setDisplayData([]);
            setVariantInput("");
            setVariantInputErr("");
            setImage("");
            if (!validateVariation()) {
              dispatch(
                Actions.showMessage({
                  message: `Gross weight must be within  ${variation} % variation`,
                })
              );
            }
          } else {
            setRemainingPcs(childPcs);
            setGrossWeight(0);
            setNetWeight(0);
            var total = 0;
            var totalSweight = 0;
            var totalRate = 0;

            displayData.map((i) => {
              i.weight = i.weight - i.sWeight;
              i.pcs = i.pcs / variantArrData.Balance_Pcs;
              total += i.weight;
              i.sWeight = (i.weight * phyQty) / childPcs;
              i.sRate = (i.rate * i.sWeight) / i.mainWeight;
              totalSweight += i.sWeight;
              totalRate += i.sRate;
            });

            setTotalRate(totalRate);
            setSingleWeight(totalSweight);
            setVariantTotalWeight(total);
            setDisplayData(displayData);
            setVariantArrData({
              pcs: childPcs,
              batch_number: variantArrData.batch_number,
              Balance_Pcs: childPcs,
            });
          }
          getAlldeatailVariant(lotId, mainLotPcs, lotInputDetails);
          dispatch(
            Actions.showMessage({
              message: "Tag generate successfully",
              variant: "success",
            })
          );
          setLoading(false);
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
        handleError(error, dispatch, {
          api: "api/lotdetail/product",
          body: body,
        });
      });
  }

  function getAddedData(id) {
    axios
      .get(Config.getCommonUrl() + `api/lotdetail/mix/${id}/${lotId}`)
      .then((response) => {
        console.log(response);
        const data = response.data.data;
        const resData = JSON.parse(data.details_json);
        resData.Barcode = data.BarCodeProduct.barcode;
        resData["Gross Weight"] = data.gross_wgt;
        resData["Net Weight"] = data.net_wgt;
        resData["Phy Pcs"] = data.phy_pcs;
        const showData = displayObject;
        const headerData = header;
        const arrData = [...variantData];

        for (let x in resData) {
          showData[x] = resData[x];
          headerData[x] = true;
        }
        setHeader(headerData);
        arrData.push(showData);
        setVariantData(arrData);
        setCurrentTotalGrossWeight(
          currentTotalGrossWeight + parseFloat(data.gross_wgt)
        );
        setCurrentTotalNetWeight(
          currentTotalNetWeight + parseFloat(data.net_wgt)
        );
        setCurrentTotalPcs(currentTotalPcs + data.phy_pcs);
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/lotdetail/mix/${id}/${lotId}`,
        });
      });
  }

  function resetAllArray() {
    setVariantArrData({
      pcs: 0,
      batch_number: 0,
      Balance_Pcs: 0,
    });
    setDesignId("");
    setMainPcs(0);
    setRemainingPcs(0);
    setTotalRate(0);
    setSingleWeight(0);
    setShowmoreArr([]);
    setShowmore(false);
    setImage("");
    setGrossWeight(0);
    setGrossWeightErr("");
    setNetWeight(0);
    setVariantTotalWeight(0);
    setDisplayData([]);
    setVariantInputErr("");
    setVariantInput("");
    setVariantData([]);
    setCurrentTotalGrossWeight(0);
    setCurrentTotalNetWeight(0);
    setCurrentTotalPcs(0);
    setViewMoreTotalWgt(0);
    setViewNintyTotalWgt(0);
    setViewMorePcs(0);
    setPhyQtyErr("");
    setPhyQty(1);
  }

  function callNetWeightcalculation() {
    if (
      grossWeight !== "" &&
      phyQty !== "" &&
      variantTotalWeight !== "" &&
      phyQty !== 0 &&
      grossWeight >= 0
    ) {
      var signgalWeight = (variantTotalWeight * phyQty) / variantArrData.pcs;
      var qtyWiseWeight = grossWeight - signgalWeight;
      if (qtyWiseWeight <= 0) {
        setGrossWeightErr(
          "Net Weight should not be negative , so enter valid Gross Weight or phy qty"
        );
        setNetWeight(qtyWiseWeight.toFixed(3));
      } else {
        setNetWeight(qtyWiseWeight.toFixed(3));
      }
    } else {
      setNetWeight(0);
    }
  }

  const showMore = () => {
    setShowmore(!showmore);
  };

  const handleChangeTab = (event, value) => {
    setModalView(value);
  };

  function handleModalEditClose() {
    setEdtOpen(false);
    setSelectedDataForEdit("");
    getAlldeatailVariant(lotId, mainLotPcs, lotInputDetails);
  }

  function editHandler(row) {
    setEdtOpen(true);
    setSelectedDataForEdit(row);
  }

  function deleteHandler(id) {
    setDeleteOpen(true);
    setSelectedIdForDelete(id);
  }

  function handleDeleteClose() {
    setDeleteOpen(false);
    setSelectedIdForDelete("");
  }

  function callDeleteApi() {
    axios
      .delete(
        Config.getCommonUrl() +
          "api/lotdetail/delete/details/" +
          selectedIdForDelete
      )
      .then(function (response) {
        console.log(response);
        setOpen(false);
        if (response.data.success === true) {
          resetAllArray();
          setLotPcs(lotPcs + 1);
          getAlldeatailVariant(lotId, mainLotPcs, lotInputDetails);
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          handleDeleteClose();
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
          api: "api/lotdetail/delete/details/" + selectedIdForDelete,
        });
      });
  }

  const validateVariation = () => {
    const dataVariation = variation;
    const grossTotal = lotInputDetails.total_gross_wgt;
    const minGross = parseFloat(
      grossTotal - (grossTotal * dataVariation) / 100
    ).toFixed(3);
    const maxGross = (
      parseFloat(grossTotal) + parseFloat((grossTotal * dataVariation) / 100)
    ).toFixed(3);

    if (addedTotalGrossWgt >= minGross && addedTotalGrossWgt <= maxGross) {
      return true;
    } else {
      return false;
    }
  };

  function handleSubmitAllVariant() {
    if (validateVariation()) {
      setLoading(true);
      axios
        .post(
          Config.getCommonUrl() + `api/lotdetail/submit/lot/details/${lotId}`
        )
        .then((response) => {
          console.log(response);
          if (response.data.success) {
            dispatch(
              Actions.showMessage({
                message: "All Barcode Created Successfully",
                variant: "success",
              })
            );
            setLoading(false);
            History.push("/dashboard/stock");
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
          handleError(error, dispatch, {
            api: `api/lotdetail/submit/lot/details/${lotId}`,
          });
        });
    } else {
      dispatch(
        Actions.showMessage({
          message: `Gross weight variation must be within  ${variation} % `,
        })
      );
    }
  }
  const handleInputFormatChange = (event) => {
    const newValue = Number(event.target.value);
    let newFormat;

    if (selectedFormat.indexOf(newValue) > -1) {
      newFormat = selectedFormat.filter((s) => s !== newValue);
    } else {
      newFormat = [...selectedFormat, newValue];
    }
    setSelectedFormat(newFormat);
  };

  const handleChangePrinter = (value) => {
    const newPrinter = [...formatList];
    newPrinter.map((item) => {
      if (item.id === value.formatId) {
        item.printer_id = value.value;
        item.printer = value;
      }
    });
    setFormatList(newPrinter);
  };

  const handleChangeSystem = (value) => {
    const newSystem = [...formatList];
    newSystem.map((item) => {
      if (item.id === value.formatId) {
        item.system_id = value.value;
        item.system = value;
      }
    });
    setFormatList(newSystem);
  };

  function callTable(viewData, viewHeader, from) {
    return (
      <Grid className="" item xs={12}>
        <div className="mr-16 ml-16 mt-32">
          <Paper className={classes.tabroot}>
            <div className="table-responsive tag-making-mix_tbl tag-making-overflow">
              <MaUTable className={classes.table} id="main-tag-making-mix_tbl">
                <TableHead>
                  <TableRow>
                    {Object.keys(viewHeader).map((x) => {
                      if (viewHeader[x] == true) {
                        return (
                          <TableCell className={classes.tableRowPad}>
                            {x}
                          </TableCell>
                        );
                      }
                    })}
                    {from === "main" ? (
                      <TableCell className={classes.tableRowPad}>
                        {" "}
                        Action{" "}
                      </TableCell>
                    ) : (
                      ""
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {viewData.map((row, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell className={classes.tableRowPad}>
                          {row["Variant"]}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {row["Barcode"]}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {row["Gross Weight"]}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {row["Net Weight"]}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {row["Phy Pcs"]}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {row["purity"]}
                        </TableCell>
                        {row["Stone Weight"] !== "" ? (
                          <>
                            <TableCell className={classes.tableRowPad}>
                              {row["Stone Pcs"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Stone Weight"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Stone Amt"]}
                            </TableCell>
                          </>
                        ) : (
                          ""
                        )}
                        {row["Others Weight"] ? (
                          <>
                            <TableCell className={classes.tableRowPad}>
                              {row["Others Pcs"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Others Weight"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Others Amt"]}
                            </TableCell>
                          </>
                        ) : (
                          ""
                        )}
                        {row["Beads Weight"] ? (
                          <>
                            <TableCell className={classes.tableRowPad}>
                              {row["Beads Pcs"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Beads Weight"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Beads Amt"]}
                            </TableCell>
                          </>
                        ) : (
                          ""
                        )}
                        {row["CZ Weight"] ? (
                          <>
                            <TableCell className={classes.tableRowPad}>
                              {row["CZ Pcs"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["CZ Weight"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["CZ Amt"]}
                            </TableCell>
                          </>
                        ) : (
                          ""
                        )}
                        {row["CZH Weight"] ? (
                          <>
                            <TableCell className={classes.tableRowPad}>
                              {row["CZH Pcs"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["CZH Weight"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["CZH Amt"]}
                            </TableCell>
                          </>
                        ) : (
                          ""
                        )}
                        {row["CZHH Weight"] ? (
                          <>
                            <TableCell className={classes.tableRowPad}>
                              {row["CZHH Pcs"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["CZHH Weight"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["CZHH Amt"]}
                            </TableCell>
                          </>
                        ) : (
                          ""
                        )}
                        {row["Solitaire Weight"] ? (
                          <>
                            <TableCell className={classes.tableRowPad}>
                              {row["Solitaire Pcs"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Solitaire Weight"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Solitaire Amt"]}
                            </TableCell>
                          </>
                        ) : (
                          ""
                        )}
                        {row["Swarovski Weight"] ? (
                          <>
                            <TableCell className={classes.tableRowPad}>
                              {row["Swarovski Pcs"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Swarovski Weight"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Swarovski Amt"]}
                            </TableCell>
                          </>
                        ) : (
                          ""
                        )}
                        {row["Brass Weight"] ? (
                          <>
                            <TableCell className={classes.tableRowPad}>
                              {row["Brass Weight"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Brass Weight"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Brass Amt"]}
                            </TableCell>
                          </>
                        ) : (
                          ""
                        )}
                        {row["Ball Weight"] ? (
                          <>
                            <TableCell className={classes.tableRowPad}>
                              {row["Ball Pcs"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Ball Weight"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Ball Amt"]}
                            </TableCell>
                          </>
                        ) : (
                          ""
                        )}
                        {row["Kundan Weight"] ? (
                          <>
                            <TableCell className={classes.tableRowPad}>
                              {row["Kundan Pcs"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Kundan Weight"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Kundan Amt"]}
                            </TableCell>
                          </>
                        ) : (
                          ""
                        )}
                        {row["Synthetic Rubber Belt Weight"] ? (
                          <>
                            <TableCell className={classes.tableRowPad}>
                              {row["Synthetic Rubber Belt Pcs"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Synthetic Rubber Belt Weight"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Synthetic Rubber Belt Amt"]}
                            </TableCell>
                          </>
                        ) : (
                          ""
                        )}
                        {row["Magnet Weight"] ? (
                          <>
                            <TableCell className={classes.tableRowPad}>
                              {row["Magnet Pcs"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Magnet Weight"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Magnet Amt"]}
                            </TableCell>
                          </>
                        ) : (
                          ""
                        )}
                        {row["Silicon Rubber Weight"] ? (
                          <>
                            <TableCell className={classes.tableRowPad}>
                              {row["Silicon Rubber Pcs"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Silicon Rubber Weight"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Silicon Rubber Amt"]}
                            </TableCell>
                          </>
                        ) : (
                          ""
                        )}
                        {row["SS Spring Weight"] ? (
                          <>
                            <TableCell className={classes.tableRowPad}>
                              {row["SS Spring Pcs"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["SS Spring Weight"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["SS Spring Amt"]}
                            </TableCell>
                          </>
                        ) : (
                          ""
                        )}
                        {row["Ball Weight"] ? (
                          <>
                            <TableCell className={classes.tableRowPad}>
                              {row["Ball Pcs"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Ball Weight"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Ball Amt"]}
                            </TableCell>
                          </>
                        ) : (
                          ""
                        )}
                        {row["Bracelet Pipe Weight"] ? (
                          <>
                            <TableCell className={classes.tableRowPad}>
                              {row["Bracelet Pipe Pcs"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Bracelet Pipe Weight"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Bracelet Pipe Amt"]}
                            </TableCell>
                          </>
                        ) : (
                          ""
                        )}
                        {row["Chain Weight"] ? (
                          <>
                            <TableCell className={classes.tableRowPad}>
                              {row["Chain Pcs"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Chain Weight"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Chain Amt"]}
                            </TableCell>
                          </>
                        ) : (
                          ""
                        )}
                        {row["Chain Latkan Weight"] ? (
                          <>
                            <TableCell className={classes.tableRowPad}>
                              {row["Chain Latkan Pcs"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Chain Latkan Weight"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Chain Latkan Amt"]}
                            </TableCell>
                          </>
                        ) : (
                          ""
                        )}
                        {row["Chain Ball Weight"] ? (
                          <>
                            <TableCell className={classes.tableRowPad}>
                              {row["Chain Ball Pcs"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Chain Ball Weight"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Chain Ball Amt"]}
                            </TableCell>
                          </>
                        ) : (
                          ""
                        )}
                        {row["Latkan Weight"] ? (
                          <>
                            <TableCell className={classes.tableRowPad}>
                              {row["Latkan Pcs"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Latkan Weight"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Latkan Amt"]}
                            </TableCell>
                          </>
                        ) : (
                          ""
                        )}
                        {row["South Post Weight"] ? (
                          <>
                            <TableCell className={classes.tableRowPad}>
                              {row["South Post Pcs"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["South Post Weight"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["South Post Amt"]}
                            </TableCell>
                          </>
                        ) : (
                          ""
                        )}
                        {row["South Patch Weight"] ? (
                          <>
                            <TableCell className={classes.tableRowPad}>
                              {row["South Patch Pcs"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["South Patch Weight"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["South Patch Amt"]}
                            </TableCell>
                          </>
                        ) : (
                          ""
                        )}
                        {row["Threaded Post Weight"] ? (
                          <>
                            <TableCell className={classes.tableRowPad}>
                              {row["Threaded Post Pcs"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Threaded Post Weight"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Threaded Post Amt"]}
                            </TableCell>
                          </>
                        ) : (
                          ""
                        )}
                        {row["North Patch Weight"] ? (
                          <>
                            <TableCell className={classes.tableRowPad}>
                              {row["North Patch Pcs"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["North Patch Weight"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["North Patch Amt"]}
                            </TableCell>
                          </>
                        ) : (
                          ""
                        )}
                        {row["Small Loop Weight"] ? (
                          <>
                            <TableCell className={classes.tableRowPad}>
                              {row["Small Loop Pcs"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Small Loop Weight"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Small Loop Amt"]}
                            </TableCell>
                          </>
                        ) : (
                          ""
                        )}
                        {row["Big Loop Weight"] ? (
                          <>
                            <TableCell className={classes.tableRowPad}>
                              {row["Big Loop Pcs"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Big Loop Weight"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Big Loop Amt"]}
                            </TableCell>
                          </>
                        ) : (
                          ""
                        )}
                        {row["Solder Weight"] ? (
                          <>
                            <TableCell className={classes.tableRowPad}>
                              {row["Solder Pcs"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Solder Weight"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Solder Amt"]}
                            </TableCell>
                          </>
                        ) : (
                          ""
                        )}
                        {row["Filing Sprue Weight"] ? (
                          <>
                            <TableCell className={classes.tableRowPad}>
                              {row["Filing Sprue Pcs"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Filing Sprue Weight"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Filing Sprue Amt"]}
                            </TableCell>
                          </>
                        ) : (
                          ""
                        )}
                        {row["Flower Weight"] ? (
                          <>
                            <TableCell className={classes.tableRowPad}>
                              {row["Flower Pcs"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Flower Weight"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Flower Amt"]}
                            </TableCell>
                          </>
                        ) : (
                          ""
                        )}
                        {row["Push Post Weight"] ? (
                          <>
                            <TableCell className={classes.tableRowPad}>
                              {row["Push Post Pcs"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Push Post Weight"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Push Post Amt"]}
                            </TableCell>
                          </>
                        ) : (
                          ""
                        )}
                        {row["Push Patch Weight"] ? (
                          <>
                            <TableCell className={classes.tableRowPad}>
                              {row["Push Patch Pcs"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Push Patch Weight"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Push Patch Amt"]}
                            </TableCell>
                          </>
                        ) : (
                          ""
                        )}
                        {row["Hand Machine Dust Weight"] ? (
                          <>
                            <TableCell className={classes.tableRowPad}>
                              {row["Hand Machine Dust Pcs"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Hand Machine Dust Weight"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Hand Machine Dust Amt"]}
                            </TableCell>
                          </>
                        ) : (
                          ""
                        )}
                        {row["Total Weight"] ? (
                          <>
                            <TableCell className={classes.tableRowPad}>
                              {row["Total Weight"]}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row["Total Amt"]}
                            </TableCell>
                          </>
                        ) : (
                          ""
                        )}
                        {from === "main" ? (
                          <>
                            <TableCell className={classes.tableRowPad}>
                              <IconButton
                                style={{ padding: "0" }}
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  ev.stopPropagation();
                                  editHandler(row);
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
                            </TableCell>{" "}
                          </>
                        ) : (
                          ""
                        )}
                      </TableRow>
                    );
                  })}
                  {from === "main" ? (
                    <TableRow>
                      {Object.keys(viewHeader).map((x) => {
                        if (viewHeader[x] == true) {
                          if (x === "Gross Weight") {
                            return (
                              <TableCell className={classes.tableFooter}>
                                <b>
                                  {addedTotalGrossWgt !== 0
                                    ? addedTotalGrossWgt.toFixed(3)
                                    : 0}
                                </b>
                              </TableCell>
                            );
                          } else if (x === "Net Weight") {
                            return (
                              <TableCell className={classes.tableFooter}>
                                <b>
                                  {addedTotalNetWgt !== 0
                                    ? addedTotalNetWgt.toFixed(3)
                                    : 0}
                                </b>
                              </TableCell>
                            );
                          } else if (x === "Phy Pcs") {
                            return (
                              <TableCell className={classes.tableFooter}>
                                <b>{addedTotalPcs !== 0 ? addedTotalPcs : 0}</b>
                              </TableCell>
                            );
                          } else {
                            return (
                              <TableCell
                                className={classes.tableFooter}
                              ></TableCell>
                            );
                          }
                        }
                      })}
                      <TableCell className={classes.tableFooter}></TableCell>
                    </TableRow>
                  ) : (
                    <TableRow>
                      {Object.keys(viewHeader).map((x) => {
                        if (viewHeader[x] == true) {
                          if (x === "Gross Weight") {
                            return (
                              <TableCell className={classes.tableFooter}>
                                <b>
                                  {currentTotalGrossWeight !== 0
                                    ? currentTotalGrossWeight.toFixed(3)
                                    : 0}
                                </b>
                              </TableCell>
                            );
                          } else if (x === "Net Weight") {
                            return (
                              <TableCell className={classes.tableFooter}>
                                <b>
                                  {currentTotalNetWeight !== 0
                                    ? currentTotalNetWeight.toFixed(3)
                                    : 0}
                                </b>
                              </TableCell>
                            );
                          } else if (x === "Phy Pcs") {
                            return (
                              <TableCell className={classes.tableFooter}>
                                <b>
                                  {currentTotalPcs !== 0 ? currentTotalPcs : 0}
                                </b>
                              </TableCell>
                            );
                          } else {
                            return (
                              <TableCell
                                className={classes.tableFooter}
                              ></TableCell>
                            );
                          }
                        }
                      })}
                    </TableRow>
                  )}
                </TableBody>
              </MaUTable>
            </div>
          </Paper>
          <Dialog
            open={alertModal}
            // onClose={handleModalClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Oops !!!</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                You can not select another variant , Click on Reset to select
                another variant !
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setAlertModal(false)} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </Grid>
    );
  }

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 lot-tabel-mainpt-20">
            {loading && <Loader />}
            {open === true && (
              <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={open}
                style={{ overflow: "scroll" }}
                onClose={(_, reason) => {
                  if (reason !== "backdropClick") {
                    handleClose();
                  }
                }}
              >
                <div
                  style={modalStyle}
                  className={clsx(classes.paper, "rounded-8")}
                  id="modesize-dv"
                >
                  <h5
                    className="popup-head mb-10"
                    style={{
                      padding: "14px",
                    }}
                  >
                    Select Printer
                    <IconButton
                      style={{ position: "absolute", top: "0", right: "0" }}
                      onClick={handleClose}
                    >
                      <Icon style={{ color: "white" }}>close</Icon>
                    </IconButton>
                  </h5>
                  <div
                    className="pl-16 pr-16"
                    style={{ overflow: "auto", height: "400px" }}
                  >
                    <MaUTable>
                      <TableHead>
                        <TableRow>
                          <TableCell className="tagmakinglot-th">
                            Tag Format
                          </TableCell>
                          <TableCell className="tagmakinglot-th">
                            Printer
                          </TableCell>
                          <TableCell className="tagmakinglot-th">
                            <span className="float-left"> System </span>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {formatList &&
                          formatList.map((temp, i) => (
                            <TableRow key={i}>
                              <TableCell className="tagmakinglot-td">
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      name="print"
                                      onChange={(e) =>
                                        handleInputFormatChange(e)
                                      }
                                      value={temp.id}
                                      checked={
                                        temp.selected
                                          ? temp.selected
                                            ? true
                                            : false
                                          : false
                                      }
                                    />
                                  }
                                  label={temp.name}
                                />
                              </TableCell>
                              <TableCell className="tagmakinglot-td">
                                <label>Select printer</label>
                                <Select
                                  classes={classes}
                                  styles={selectStyles}
                                  options={printerList.map((group) => ({
                                    value: group.id,
                                    label: group.name,
                                    formatId: temp.id,
                                  }))}
                                  filterOption={createFilter({
                                    ignoreAccents: false,
                                  })}
                                  value={temp.printer ? temp.printer : ""}
                                  onChange={handleChangePrinter}
                                  placeholder="select printer"
                                />

                                {/* <span style={{ color: "red" }}>
                                  {underGroupErrTxt.length > 0 ? underGroupErrTxt : ""}
                                  </span> */}
                              </TableCell>
                              <TableCell className="tagmakinglot-td text-left padding">
                                <label>Select system</label>
                                <Select
                                  classes={classes}
                                  styles={selectStyles}
                                  options={systemList.map((group) => ({
                                    value: group.id,
                                    label: group.name,
                                    formatId: temp.id,
                                  }))}
                                  filterOption={createFilter({
                                    ignoreAccents: false,
                                  })}
                                  value={temp.system ? temp.system : ""}
                                  onChange={handleChangeSystem}
                                  placeholder="select system"
                                />

                                {/* <span style={{ color: "red" }}>
                                  {underGroupErrTxt.length > 0 ? underGroupErrTxt : ""}
                                  </span> */}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </MaUTable>
                  </div>
                  <div style={{ textAlign: "center" }} className="p-20">
                    <Button
                      variant="contained"
                      className="w-128 mx-auto popup-cancel"
                      aria-label="Register"
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>

                    <Button
                      variant="contained"
                      className="w-160 mx-auto popup-save"
                      style={{ marginLeft: "20px" }}
                      aria-label="Register"
                      onClick={(e) => handleFormSubmit(e)}
                    >
                      Save
                    </Button>
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
                      // onClick={(e) => handleFormSubmit(e)}
                    >
                      Save
                    </Button> */}
                </div>
              </Modal>
            )}
            {open === false && (
              <>
                <Grid
                  className="tagmarking-btn-fullwidth pb-20 pt-28"
                  container
                  spacing={4}
                  alignItems="stretch"
                  style={{ margin: 0 }}
                >
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                    key="1"
                    style={{ padding: 0 }}
                  >
                    <FuseAnimate delay={300}>
                      <Typography className="pl-28 pt-16 text-18 font-700">
                        Tag Making LOT
                      </Typography>
                    </FuseAnimate>
                    {/* <BreadcrumbsHelper /> */}
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={8}
                    md={9}
                    key="2"
                    style={{ textAlign: "right" }}
                  >
                    {/* <Button
                      variant="contained"
                      className={classes.button}
                      style={{
                        backgroundColor: "gray",
                        border: "none",
                        color: "white",
                      }}
                      size="small"
                      onClick={() => { History.push('/dashboard/stock') }}
                    >
                      Back
                    </Button> */}
                    <div className="btn-back pt-3">
                      {" "}
                      <img src={Icones.arrow_left_pagination} alt="" />
                      <Button
                        id="btn-back"
                        className=""
                        size="small"
                        onClick={() => {
                          History.push("/dashboard/stock");
                        }}
                      >
                        Back
                      </Button>
                    </div>

                    <Button
                      variant="contained"
                      className={classes.button}
                      size="small"
                      style={{
                        backgroundColor: "#415BD4",
                        border: "none",
                        color: "white",
                      }}
                      onClick={resetAllArray}
                    >
                      Reset
                    </Button>

                    <Button
                      variant="contained"
                      className={classes.button}
                      size="small"
                      style={{
                        backgroundColor: "#415BD4",
                        border: "none",
                        color: "white",
                      }}
                      onClick={() => {
                        setOpen(true);
                      }}
                    >
                      Change Tag style
                    </Button>
                  </Grid>
                </Grid>
                <div className="main-div-alll">
                  <div className="m-16 tagmarking-fullwidth">
                    <Grid container spacing={3}>
                      <Grid
                        item
                        xs={4}
                        style={{ padding: 10, paddingInline: "12px" }}
                      >
                        <label>Scan set / barcode</label>
                        <TextField
                          autoFocus
                          placeholder="Enter barcode"
                          name="lotInput"
                          value={lotInput}
                          error={lotErr.length > 0 ? true : false}
                          helperText={lotErr}
                          disabled
                          onChange={(e) => handleInputChange(e)}
                          variant="outlined"
                          required
                          fullWidth
                        />
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        style={{ padding: 10, paddingInline: "12px" }}
                      >
                        <label>Party rate profile</label>
                        <Select
                          classes={classes}
                          styles={selectStyles}
                          autoFocus
                          options={rateList.map((optn) => ({
                            value: optn.id,
                            label: optn.profile_name,
                          }))}
                          filterOption={createFilter({
                            ignoreAccents: false,
                          })}
                          value={selectedPartyRate}
                          onChange={handlepartyRate}
                          placeholder="Select party rate profile"
                        />
                        <span style={{ color: "red" }}>
                          {selectedPartyRateErr.length > 0
                            ? selectedPartyRateErr
                            : ""}
                        </span>
                      </Grid>
                    </Grid>
                  </div>

                  <div className="ml-16 mr-16 tag-making-width">
                    <Paper className={classes.tabroot}>
                      <div className="table-responsive making-first-tbl-mix">
                        <MaUTable
                          className={clsx(classes.table, "table_width")}
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell
                                className={classes.tableRowPad}
                              ></TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Lot Number
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Lot category
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Purity
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Lot Pcs
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Stone Pcs
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Gross Weight
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Net Weight
                              </TableCell>
                              <TableCell
                                className={clsx(
                                  classes.tableRowPad,
                                  "text-left"
                                )}
                              >
                                Other Material Weight
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell className={classes.table}>
                                Lot Details :{" "}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {lotInputDetails.number}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {lotInputDetails.category_name}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {lotInputDetails.purity}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {lotInputDetails.pcs}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {lotInputDetails.stone_pcs}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {lotInputDetails.total_gross_wgt}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {lotInputDetails.total_net_wgt}
                              </TableCell>
                              <TableCell
                                className={clsx(
                                  classes.tableRowPad,
                                  "text-left"
                                )}
                              >
                                {lotInputDetails.other_met_wgt}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className={classes.table}>
                                Remaining Data :{" "}
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                              ></TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                              ></TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                              ></TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {lotRemPcs}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {stoneRemPcs}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {lotGross.toFixed(3)}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {lotNet.toFixed(3)}
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                              ></TableCell>
                            </TableRow>
                          </TableBody>
                        </MaUTable>
                      </div>
                    </Paper>
                  </div>

                  <Grid container spacing={3}>
                    <Grid
                      className="tabel-left-width-dv"
                      style={{ padding: 10 }}
                    >
                      <Grid item xs={12} style={{ padding: 0 }}>
                        <div className="m-16 tagmarking-fullwidth">
                          <Grid container spacing={3}>
                            <Grid item xs={4} style={{ padding: 10 }}>
                              <label>Variant no</label>
                              <Select
                                className="mt-1"
                                classes={classes}
                                styles={selectStyles}
                                options={variantList.map((optn) => ({
                                  value: `${optn.variant_number} - ${optn.batch_no}`,
                                  label: `${optn.variant_number} - ${optn.batch_no}`,
                                  isDisabled: selectedVariantArr.includes(
                                    optn.variant_number
                                  )
                                    ? true
                                    : false,
                                }))}
                                filterOption={createFilter({
                                  ignoreAccents: false,
                                })}
                                value={variantInput}
                                onChange={handleVariantInput}
                                placeholder="Select variant no"
                              />
                              <span style={{ color: "red" }}>
                                {variantInputErr.length > 0
                                  ? variantInputErr
                                  : ""}
                              </span>
                            </Grid>
                            <Grid
                              item
                              xs={4}
                              style={{ padding: 0, paddingInline: "12px" }}
                            >
                              <label>Pcs</label>
                              <TextField
                                className="mt-1"
                                placeholder="Enter pcs"
                                name="pcs"
                                value={mainPcs}
                                disabled
                                variant="outlined"
                                fullWidth
                              />
                            </Grid>
                            <Grid
                              item
                              xs={4}
                              style={{ padding: 0, paddingInline: "12px" }}
                            >
                              <label>Batch no</label>
                              <TextField
                                className="mt-1"
                                placeholder="Enter batch no"
                                name="batchNo"
                                value={variantArrData.batch_number}
                                disabled
                                variant="outlined"
                                fullWidth
                              />
                            </Grid>
                          </Grid>
                        </div>

                        <div className="ml-16 mr-16">
                          <Paper className={classes.tabroot}>
                            <div className="table-responsive secandtagmaking_tabel_dv ">
                              <MaUTable className={classes.table}>
                                <TableHead>
                                  <TableRow>
                                    <TableCell className={classes.tableRowPad}>
                                      Balance Pcs
                                    </TableCell>
                                    {/* <TableCell className={classes.tableRowPad}>Lot Pcs</TableCell> */}
                                    {displayData.map((item, i) => (
                                      <>
                                        <TableCell
                                          className={classes.tableRowPad}
                                        >
                                          {item.description} Pcs
                                        </TableCell>
                                        <TableCell
                                          className={classes.tableRowPad}
                                        >
                                          {item.description} Weight
                                        </TableCell>
                                      </>
                                    ))}
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  <TableRow>
                                    <TableCell className={classes.tableRowPad}>
                                      {variantArrData.pcs}
                                    </TableCell>
                                    {/* <TableCell className={classes.tableRowPad}>
                                    {lotPcs}
                                  </TableCell> */}
                                    {displayData.map((item, i) => (
                                      <>
                                        <TableCell
                                          key={i}
                                          className={classes.tableRowPad}
                                        >
                                          {item.pcs}
                                        </TableCell>
                                        <TableCell
                                          className={classes.tableRowPad}
                                        >
                                          {item.weight.toFixed(3)}
                                        </TableCell>
                                      </>
                                    ))}
                                  </TableRow>
                                </TableBody>
                              </MaUTable>
                            </div>
                          </Paper>
                        </div>

                        {showmoreArr.length > 0 && (
                          <Grid
                            className="btn-show-less ml-16 mr-16 mt-16 "
                            style={{ textAlign: "right" }}
                          >
                            <Button className="csvbutton" onClick={showMore}>
                              {showmore ? "Show less" : "Show More"}
                            </Button>
                          </Grid>
                        )}

                        {showmore && (
                          <Modal
                            aria-labelledby="simple-modal-title"
                            aria-describedby="simple-modal-description"
                            open={showmore}
                            onClose={(_, reason) => {
                              if (reason !== "backdropClick") {
                                showMore();
                              }
                            }}
                          >
                            <div
                              id="model-popup-width"
                              style={modalStyle}
                              className={clsx(classes.paper, "rounded-8")}
                            >
                              <h5
                                className="popup-head mb-10"
                                style={{
                                  padding: "14px",
                                }}
                              >
                                {showmoreArr[0].variantNo}
                                <IconButton
                                  style={{
                                    position: "absolute",
                                    top: "0",
                                    right: "0",
                                  }}
                                  onClick={showMore}
                                >
                                  <Icon style={{ color: "white" }}>close</Icon>
                                </IconButton>
                              </h5>
                              <div className="table-responsive making-first-tbl-mix making-first-tbl-mix-dv">
                                <MaUTable className={classes.table}>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        Stock Code
                                      </TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        Description
                                      </TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        Pcs
                                      </TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        Total Weight
                                      </TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        90% Weight
                                      </TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        Rate
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {showmoreArr.length > 0 ? (
                                      showmoreArr.map((row, i) => (
                                        <TableRow key={i}>
                                          <TableCell
                                            className={classes.tableRowPad}
                                          >
                                            {row.stockNo}
                                          </TableCell>
                                          <TableCell
                                            className={classes.tableRowPad}
                                          >
                                            {row.description}
                                          </TableCell>
                                          <TableCell
                                            className={classes.tableRowPad}
                                          >
                                            {row.pcs}
                                          </TableCell>
                                          <TableCell
                                            className={classes.tableRowPad}
                                          >
                                            {row.weight.toFixed(3)}
                                          </TableCell>
                                          <TableCell
                                            className={classes.tableRowPad}
                                          >
                                            {row.nintyweight.toFixed(3)}
                                          </TableCell>
                                          <TableCell
                                            className={classes.tableRowPad}
                                          >
                                            {row.is_pcs_grm === 1
                                              ? `${row.rate} /pcs`
                                              : `${row.rate} /g`}
                                          </TableCell>
                                        </TableRow>
                                      ))
                                    ) : (
                                      <TableRow>
                                        <TableCell
                                          colSpan="5"
                                          style={{ textAlign: "center" }}
                                        >
                                          No Variant Selected
                                        </TableCell>
                                      </TableRow>
                                    )}
                                  </TableBody>
                                  <TableFooter>
                                    <TableRow>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      ></TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      ></TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        <b>{viewMorePcs}</b>
                                      </TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        <b>{viewMoreTotalWgt.toFixed(3)}</b>
                                      </TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        <b>{viewNintyTotalWgt.toFixed(3)}</b>
                                      </TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      ></TableCell>
                                    </TableRow>
                                  </TableFooter>
                                </MaUTable>
                              </div>
                            </div>
                          </Modal>
                        )}

                        <div className="m-16 tagmarking-fullwidth">
                          <Grid container spacing={3}>
                            <Grid
                              item
                              xs={4}
                              style={{ padding: 10, paddingInline: "12px" }}
                            >
                              <label>Gross weight</label>
                              <TextField
                                className="mt-1"
                                placeholder="Enter gross weight"
                                name="grossWeight"
                                value={grossWeight}
                                error={grossWeightErr.length > 0 ? true : false}
                                helperText={grossWeightErr}
                                onChange={(e) => handleInputChange(e)}
                                variant="outlined"
                                fullWidth
                              />
                            </Grid>
                            <Grid
                              item
                              xs={4}
                              style={{ padding: 10, paddingInline: "12px" }}
                            >
                              <label>Net weight</label>
                              <TextField
                                className="mt-1"
                                placeholder="Enter net weight"
                                name="netWeight"
                                disabled
                                value={netWeight}
                                variant="outlined"
                                fullWidth
                              />
                            </Grid>
                            <Grid
                              item
                              xs={4}
                              style={{ padding: 10, paddingInline: "12px" }}
                            >
                              <label>Phy qty</label>
                              <TextField
                                className="mt-1"
                                placeholder="Enter phy qty"
                                name="phyQty"
                                value={phyQty}
                                error={phyQtyErr.length > 0 ? true : false}
                                helperText={phyQtyErr}
                                onChange={(e) => handleInputChange(e)}
                                variant="outlined"
                                fullWidth
                              />
                            </Grid>
                          </Grid>
                        </div>

                        <div className="ml-16 mr-16">
                          <Paper className={classes.tabroot}>
                            <div className="table-responsive tagmaking-lot-last-tbl">
                              <MaUTable className={classes.table}>
                                <TableHead>
                                  <TableRow>
                                    {displayData.map((item) => (
                                      <>
                                        <TableCell
                                          className={classes.tableRowPad}
                                        >
                                          {item.description} Weight
                                        </TableCell>
                                        <TableCell
                                          className={classes.tableRowPad}
                                        >
                                          {item.description} Amt
                                        </TableCell>
                                      </>
                                    ))}
                                    <TableCell className={classes.tableRowPad}>
                                      Total Weight
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                      Total Amt
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  <TableRow>
                                    {displayData.map((item, i) => (
                                      <>
                                        <TableCell
                                          className={classes.tableRowPad}
                                        >
                                          {item.sWeight.toFixed(3)}
                                        </TableCell>
                                        <TableCell
                                          className={classes.tableRowPad}
                                        >
                                          {item.sRate.toFixed(3)}
                                        </TableCell>
                                      </>
                                    ))}
                                    <TableCell className={classes.tableRowPad}>
                                      <b>{singleWeight.toFixed(3)}</b>
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                      <b>{totalRate.toFixed(3)}</b>
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </MaUTable>
                            </div>
                          </Paper>
                        </div>
                      </Grid>
                    </Grid>
                    <Grid className="image_div">
                      <img src={image} />
                    </Grid>
                    <Grid className="mix-savebtn-mr">
                      <Button
                        id="savebtn-mr"
                        variant="contained"
                        className={classes.button}
                        size="small"
                        style={{
                          backgroundColor: "#415BD4",
                          border: "none",
                          color: "white",
                        }}
                        disabled={phyQty === 0 ? true : false}
                        onClick={handleSubmit}
                      >
                        Save
                      </Button>
                    </Grid>

                    {AllVariants.length > 0 ? (
                      <>
                        <Grid item xs={12}>
                          <div className="mr-16 ml-16 mt-32">
                            <Tabs value={modalView} onChange={handleChangeTab}>
                              <Tab label="Current Variant List" />
                              <Tab label="All variant List" />
                            </Tabs>
                            {modalView === 0
                              ? callTable(variantData, header, "curr")
                              : callTable(AllVariants, Mainheader, "main")}
                          </div>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={11}
                          key="2"
                          className="mix-savebtn-mr"
                          style={{ textAlign: "right" }}
                        >
                          {" "}
                          <Button
                            id="savebtn-mr"
                            variant="contained"
                            className={classes.button}
                            disabled={lotRemPcs !== 0 ? true : false}
                            size="small"
                            // style={{
                            //   backgroundColor: lotRemPcs !== 0 ? "gray" : "#1FD319",
                            //   border: "none",
                            //   color: "white",
                            // }}
                            style={{
                              backgroundColor:
                                lotRemPcs !== 0 ? "gray" : "#1E66FD",
                              border: "none",
                              color: "white",
                            }}
                            onClick={handleSubmitAllVariant}
                          >
                            Submit
                          </Button>
                        </Grid>
                      </>
                    ) : (
                      ""
                    )}
                  </Grid>
                </div>
              </>
            )}

            {edtOpen ? (
              <EditVariant
                barcode={selectedDataForEdit.Barcode}
                modalColsed={handleModalEditClose}
              />
            ) : (
              ""
            )}

            <Dialog
              open={deleteOpen}
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
                  onClick={callDeleteApi}
                  className="delete-dialog-box-delete-button"
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default TagMakingLot;
