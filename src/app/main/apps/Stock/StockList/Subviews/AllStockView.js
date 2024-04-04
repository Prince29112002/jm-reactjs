import React, { useState, useEffect } from "react";
import { Checkbox } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import TableFooter from "@material-ui/core/TableFooter";
import * as Actions from "app/store/actions";
import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from "@material-ui/core/Paper";
import History from "@history";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import Loader from '../../../../Loader/Loader';
import clsx from "clsx";
import StockTransfer from "../../StockTransfer/StockTransfer"
import Button from "@material-ui/core/Button";
import LotViewPopUp from "../PopUps/LotViewPopUp";
import { TextField } from "@material-ui/core";
import { Icon, IconButton } from "@material-ui/core";
import useSortableData from "../../Components/useSortableData";
import SplitDataView from "../PopUps/SplitDataView";
import GroupMerging from "../../../Tagging/GroupMerging/GroupMerging"
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import VoucherPopup from "../PopUps/VoucherPopup";
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
    tabroot: {
        overflowX: "auto",
        overflowY: "auto",
        height: 'calc(100vh - 280px)',
    },
    table: {
        minWidth: 1500,
    },
    tableRowPad: {
        padding: 7,
    },
    // centerHeading :{
    //     textAlign:'center',
    //     display:'block !important' 
    //     // text-align: center;
    //     // display: block;
    // },
    padding: {
        paddingBottom: "30px !important"
    },
    hoverClass: {
        // backgroundColor: "#fff",
        "&:hover": {
            // backgroundColor: "#999",
            cursor: "pointer",
        },
    },
}));


const AllStockView = ({
    authAccessArr,
    props,
    allData,
    refreshApi,
    dlData,
    pgName,
    flag,
  }) => {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [allStockList, setAllStockList] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [voucPopup, setVouchPopup] = useState(false); //for voucher print view popup
    const [popupData, setPopupData] = useState("");
    const [selectedId, setSelectedId] = useState([]);
    const [open, setOpen] = useState(false);
    const [packetDeleteId, setPacketDeleteId] = useState("");
    // const [selectedLots, setSelectedLots] = useState([]);
    const [afterData, setAfterData] = useState([]);
    const [StockType, setStockType] = useState("");
  
    const [searchData, setSearchData] = useState({
      stockType: "",
      StockCode: "",
      category: "",
      purity: "",
      pieces: "",
      grossWeight: "",
      netWeight: "",
      fineGold: "",
      otherWeight: "",
      info: "",
      materialDetails: "",
      previousProcess: "",
      lastVNum: "",
    });
    const [stock_name_code_id, set_stock_name_code_id] = useState([]);
  
    // const stockFlag = {
    //   goldStockCode: 1,
    //   looseStockCode: 2,
    //   lot: 3,
    //   barCode: 4,
    //   packet: 5,
    //   packingSlip: 6,
    // };
  
    useEffect(() => {
      if (loading) {
        setTimeout(() => setLoading(false), 1000);
      }
    }, [loading]);
  
    useEffect(() => {
      console.log("allData", allData);
      // console.log("flag", flag)
      if (allData !== undefined) {
        setAllStockList(allData);
      }
      //eslint-disable-next-line
    }, [props, allData]);
  
    const fetchData = () => {
      // History.push('/dashboard/stock');
    };
    useEffect(() => {
      return () => {
        setSelectedId([]);
        setAfterData([]);
        console.log("cleaned up");
      };
    }, []);
  
    // useEffect(() => {
    //   clearInlieneSearch();
    // }, [window.localStorage.getItem("SelectedDepartment")]);
  
    function editHandler(id, packetNum) {
      History.push("/dashboard/tagging/editpacket", {
        id: id,
        packetNum: packetNum,
      });
    }
  
    function deleteHandler(id) {
      setPacketDeleteId(id);
      setOpen(true);
    }
  
    function handleClose() {
      setPacketDeleteId("");
      setOpen(false);
    }
  
    function callDeleteApi() {
      axios
        .delete(Config.getCommonUrl() + `api/packet/delete/${packetDeleteId}`)
        .then((response) => {
          console.log(response);
          if (response.data.success) {
            dispatch(Actions.showMessage({ message: response.data.message }));
            refreshApi();
          } else {
            dispatch(Actions.showMessage({ message: response.data.message }));
          }
          setOpen(false);
        })
        .catch((error) => {
          setOpen(false);
          handleError(error, dispatch, {
            api: `api/packet/delete/${packetDeleteId}`,
          });
        });
    }
  
    function editHandlerSlip(id, slipNum) {
      History.push("/dashboard/tagging/editpackingslip", {
        id: id,
        slipNum: slipNum,
      });
    }
  
    const showModle = () => {
      if (props.location.search === "?transferstock" && selectedId.length > 0) {
        //tagging
        const isSameFlag = selectedId.every(
          (item) => item.flag === selectedId[0].flag
        );
        if (!isSameFlag) {
          console.log("if condition");
          History.push("/dashboard/stock");
          dispatch(
            Actions.showMessage({
              message: "All Selected stock types are not the same",
              variant: "error",
            })
          );
          // return null; // or any other appropriate action if the flags are not the same
        } else if (isSameFlag) {
          if (afterData.length > 0) {
            // if data is set or changed from split screen then show
            return (
              <StockTransfer
                Ids={afterData}
                stockType={StockType}
                resetVar={resetVar}
                stock_name_code_id={stock_name_code_id}
              />
            );
          } else {
            // console.log("filter ", selectedId.filter(item => item.flag === 1 || item.flag === 2).length)
            // console.log("selId len", selectedId.length)
            // console.log("cond", selectedId.filter(item => item.flag === 1 || item.flag === 2).length === selectedId.length)
  
            if (
              selectedId.filter((item) => item.flag === 1 || item.flag === 2)
                .length > 0
            ) {
              // || 2 condition too
              if (
                selectedId.filter((item) => item.flag === 1 || item.flag === 2)
                  .length === selectedId.length
              ) {
                return (
                  <SplitDataView
                    data={selectedId}
                    afterEffect={afterEffect}
                    resetVar={resetVar}
                  />
                );
              } else {
                History.push("/dashboard/stock");
                dispatch(
                  Actions.showMessage({
                    message: "Please Select Proper Type Data",
                    variant: "error",
                  })
                );
              }
            } else {
              return (
                <StockTransfer
                  Ids={selectedId}
                  stockType={StockType}
                  resetVar={resetVar}
                  pgName={pgName}
                />
              );
            }
          }
        }
        // return (<StockTransfer Ids={selectedId} />)
      }
      if (props.location.search === "?transferstocks" && selectedId.length > 0) {
        //normal stock transfer
        const isSameFlag = selectedId.every(
          (item) => item.flag === selectedId[0].flag
        );
        if (!isSameFlag) {
          console.log("if condition");
          History.push("/dashboard/stock/:stock");
          dispatch(
            Actions.showMessage({
              message: "All Selected stock types are not the same",
              variant: "error",
            })
          );
          // return null; // or any other appropriate action if the flags are not the same
        } else if (isSameFlag) {
          console.log("else condition");
          if (afterData.length > 0) {
            // if data is set or changed from split screen then show
            return (
              <StockTransfer
                Ids={afterData}
                stockType={StockType}
                resetVar={resetVar}
                stock_name_code_id={stock_name_code_id}
              />
            );
          } else {
            // console.log("filter ", selectedId.filter(item => item.flag === 1 || item.flag === 2).length)
            // console.log("selId len", selectedId.length)
            // console.log("cond", selectedId.filter(item => item.flag === 1 || item.flag === 2).length === selectedId.length)
  
            if (
              selectedId.filter((item) => item.flag === 1 || item.flag === 2)
                .length > 0
            ) {
              // || 2 condition too
              if (
                selectedId.filter((item) => item.flag === 1 || item.flag === 2)
                  .length === selectedId.length
              ) {
                return (
                  <SplitDataView
                    data={selectedId}
                    afterEffect={afterEffect}
                    resetVar={resetVar}
                  />
                );
              } else {
                History.push("/dashboard/stock");
                dispatch(
                  Actions.showMessage({
                    message: "Please Select Proper Type Data",
                    variant: "error",
                  })
                );
              }
            } else {
              return (
                <StockTransfer
                  Ids={selectedId}
                  stockType={StockType}
                  resetVar={resetVar}
                  pgName={pgName}
                />
              );
            }
          }
        }
  
        // return (<StockTransfer Ids={selectedId} />)
      } else if (props.location.search === "?tagmakinglot") {
        if (selectedId.length === 1 && validateLotOnly()) {
          const dataVal = selectedId[0].element;
          const lotValue = {
            id: dataVal.lot_id,
            stockname: dataVal.stock_name_code,
          };
          History.push("/dashboard/tagging/tagmakinglot", { lot_id: lotValue });
        } else {
          History.push("/dashboard/stock");
          dispatch(
            Actions.showMessage({ message: "Select only one lot from list" })
          );
        }
      } else if (props.location.search === "?tagmakingmix") {
        if (selectedId.length === 1 && validateLotOnly()) {
          const dataVal = selectedId[0].element;
          const lotValue = {
            id: dataVal.lot_id,
            stockname: dataVal.stock_name_code,
          };
          History.push("/dashboard/tagging/tagmakingmix", { lot_id: lotValue });
        } else {
          History.push("/dashboard/stock");
          dispatch(
            Actions.showMessage({ message: "Select only one lot from list" })
          );
        }
      } else if (
        props.location.search === "?groupmerging" &&
        selectedId.length > 1 &&
        validateLotOnly()
      ) {
        if (validateSelectedLot()) {
          const arrData = [];
          selectedId.map((item) => {
            arrData.push({
              id: item.element.lot_id,
              stockname: item.element.stock_name_code,
            });
            return null;
          });
          console.log(arrData);
          return <GroupMerging lot_id={arrData} getData={fetchData} />;
        } else {
          History.push("/dashboard/stock");
          dispatch(
            Actions.showMessage({
              message:
                "Select valid lot for Group Merging also it's not contain barcode",
            })
          );
        }
      } else {
        const isSameFlag = selectedId.every(
          (item) => item.flag === selectedId[0].flag
        );
        if (!isSameFlag) {
          dispatch(
            Actions.showMessage({
              message: "All Selected stock types are not the same",
              variant: "error",
            })
          );
        } else {
          if (pgName === "/dashboard/stock") {
            History.push("/dashboard/stock");
          } else {
            History.push("/dashboard/stock/:stock");
          }
          dispatch(
            Actions.showMessage({
              message: "Select Any Data From List To Transfer",
              variant: "info",
            })
          );
        }
      }
    };
  
    const validateLotOnly = () => {
      const list = selectedId;
      let count = 0;
      list.map((item) => {
        if (item.flag !== 3) {
          count++;
        }
        return null;
      });
      if (count > 0) {
        return false;
      } else {
        return true;
      }
    };
    const clearInlieneSearch = () => {
      setSearchData({
        stockType: "",
        StockCode: "",
        category: "",
        purity: "",
        pieces: "",
        grossWeight: "",
        netWeight: "",
        fineGold: "",
        otherWeight: "",
        info: [],
        materialDetails: "",
        previousProcess: "",
        lastVNum: "",
        workStation: "",
        transit: [],
        current_process: [],
        next_process: [],
      });
    };
    const validateSelectedLot = () => {
      const lotArr = selectedId;
      console.log(lotArr);
      let flag = true;
      const fElem = lotArr[0].element.stock_name_code;
      const data = fElem.split(".");
      lotArr.map((item) => {
        const inData = item.element.stock_name_code.split(".");
        if (
          `${inData[0]}.${inData[1]}` !== `${data[0]}.${data[1]}` ||
          item.is_lot_barcoded === true
        ) {
          flag = false;
        }
        return null;
      });
      console.log(flag);
      return flag;
    };
  
    const resetVar = () => {
      console.log("reset var called");
      setSelectedId([]);
      setAfterData([]);
      refreshApi();
    };
  
    const afterEffect = (data) => {
      console.log("afterEffect called", data);
      // setSelectedId([])
      setAfterData(data);
      let stock_name_data = data.map((item) => {
        return {
          stock_name_code_id: item.element.stock_name_code_id,
          weight: item.element.item_id !== 5 ? item.utilize : item.utilizeWeight,
          ...((item.element.item_id === 5 || item.element.item_id === 7) && {
            pcs: item.utilizePcs,
          }),
        };
      });
      console.log(stock_name_data);
      set_stock_name_code_id(stock_name_data);
      // return (<StockTransfer Ids={data} />)
    };
  
    function handleChecked(event, element) {
      console.log(element);
      let checked = event.target.checked;
      // console.log(checked, element);
      // console.log(selectedId)
  
      //with key
      if (checked === false) {
        // remove
        let selected = selectedId.filter(({ ids }) => {
          // console.log("ids",ids)
          // console.log("some", ids.some(v => !element.id.includes(v.stock_id)))
          return ids.some((v) => !element.id.includes(v.stock_id));
          // return !element.id.includes(ids.stock_id)
        });
        // let selected = selectedId.filter(item => {
        //     console.log("item", item)
        //     return item.ids.filter(idItem => {
        //         console.log("idItem", idItem)
        //         console.log("elem id",element.id)
        //         console.log("elem cond",!element.id.includes(Number(idItem.stock_id)))
  
        //         return !element.id.includes(Number(idItem.stock_id))
        //     })
        //     // console.log("elem", )
        //     //   return !element.id.includes(item)
        // })
        // console.log(selected);
        setSelectedId(selected);
        dlData(selected);
        setStockType("");
        console.log("in111", selected);
      } else {
        //add
        console.log(element);
        const stonePcs = element.stone_weight ? element.stone_weight : 0;
        const availablePcs = element.available_pcs ? element.available_pcs : 0;
        let tmpData = [
          ...selectedId,
          {
            // department_id: element.department_id,
            element: {
              ...element,
              pcs: element.hasOwnProperty("available_pcs")
                ? element.available_pcs
                : element.pcs,
            },
            flag: element.flag,
            isSame: true,
            utilize: element.hasOwnProperty("available_weight")
              ? element.available_weight
              : element.gross_weight,
            utilizeWeight: element.hasOwnProperty("available_weight")
              ? parseFloat(
                  parseFloat(availablePcs) * parseFloat(stonePcs)
                ).toFixed(3)
              : "",
            utiliseErr: "",
            utiliseWeightErr: "",
            pcserr: "",
            utilizePcs: element.hasOwnProperty("available_pcs")
              ? element.available_pcs
              : element.pcs,
            is_lot_barcoded: element.is_lot_barcoded,
            ids: element.id.map((data) => {
              return {
                stock_id: data,
              };
            }),
          },
        ];
        setSelectedId(tmpData);
        dlData(tmpData);
        setStockType(element.flag);
        console.log("in2222", tmpData);
      }
  
      //for only id in array
  
      // let checked = event.target.checked;
  
      // console.log(checked, element);
      // console.log(selectedId)
  
      // if (checked === false) {
      //     // remove
      //     let selected = selectedId.filter(item => !element.id.includes(item));
      //     // console.log(selected);
      //     setSelectedId(selected)
      // } else {
      //     //add
      //     setSelectedId([...selectedId, ...element.id])
      // }
    }
  
    const displayPopup = () => {
      // console.log("displayPopup", popupData)
      if (popupData.flag !== 1 && popupData.flag !== 2)
        return (
          <LotViewPopUp
            data={popupData}
            stockType={StockType}
            openFlag={showPopup}
            setOpenFlag={changeFlags}
          />
        );
    };
  
    const changeFlags = () => {
      setShowPopup(false);
      setVouchPopup(false);
      setPopupData("");
    };
  
    const handleClick = (element) => {
      // console.log(element);
  
      if (element.flag !== 1 && element.flag !== 2) {
        // console.log(element.flag)
        setShowPopup(true);
        setPopupData(element);
      } else {
        setShowPopup(false);
        setPopupData("");
      }
    };
  
    const displayVoucherPopup = () => {
      return (
        <VoucherPopup
          data={popupData}
          stockType={StockType}
          openFlag={voucPopup}
          setOpenFlag={changeFlags}
        />
      );
    };
  
    const handleVoucherClick = (element) => {
      console.log(element);
      if (
        element.id.length !== 0 ||
        element.voucher_no !== "" ||
        element.voucher_no !== null
      ) {
        setVouchPopup(true);
        setPopupData(element);
        setStockType(element.flag);
      } else {
        setVouchPopup(false);
        setPopupData("");
        setStockType("");
      }
    };
  
    const handleSearchData = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      // const searchItem = searchData;
      setSearchData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };
  
    const { items, requestSort, sortConfig } = useSortableData(allStockList);
    // const getClassNamesFor = (name) => {
    //     if (!sortConfig) {
    //         return;
    //     }
    //     return sortConfig.key === name ? sortConfig.direction : undefined;
    // };
  

    return (
        <div className="">
            {loading && <Loader />}
            <Paper className={classes.tabroot}>
                <MaUTable className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell className={clsx(classes.tableRowPad)} width="60px"></TableCell>
                            <TableCell className={clsx(classes.tableRowPad)}>Stock Type</TableCell>
                            <TableCell className={clsx(classes.tableRowPad)}>Stock Code</TableCell>
                            <TableCell className={clsx(classes.tableRowPad)}>Category</TableCell>
                            <TableCell className={clsx(classes.tableRowPad)}>Purity</TableCell>
                            <TableCell className={clsx(classes.tableRowPad)}>Pieces</TableCell>
                            <TableCell className={clsx(classes.tableRowPad)}>Gross Weight</TableCell>
                            <TableCell className={clsx(classes.tableRowPad)}>Net Weight</TableCell>
                            <TableCell className={clsx(classes.tableRowPad)}>Fine Gold</TableCell>
                            <TableCell className={clsx(classes.tableRowPad)}>Other Weight</TableCell>
                            <TableCell className={clsx(classes.tableRowPad)}>Info</TableCell>
                            <TableCell className={clsx(classes.tableRowPad)}>Material Details</TableCell>
                            <TableCell className={clsx(classes.tableRowPad)}>Previous Process</TableCell>
                            <TableCell className={clsx(classes.tableRowPad)}>Last Performed V. Num</TableCell>
                            <TableCell className={clsx(classes.tableRowPad)} 
                            style={{width:"12%", textAlign:"center"}}>
                                Transit
                           </TableCell>
                            <TableCell className={clsx(classes.tableRowPad,"w-64")}>Action</TableCell>

                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.tableRowPad}></TableCell>
                            <TableCell className={classes.tableRowPad}>
                                <TextField name="stockType" onChange={handleSearchData}
                                    inputProps={{ className: "all-Search-box-data" }}
                                />

                                <IconButton style={{ padding: "0" }} onClick={() => requestSort('stockType')} >
                                    <Icon className="mr-8" style={{ color: "#000" }}> sort  </Icon>

                                    {(sortConfig && sortConfig.key === "stockType" && sortConfig.direction === "ascending") &&
                                        <Icon className="mr-8" style={{ color: "#000" }}> arrow_downward </Icon>
                                    }
                                    {(sortConfig && sortConfig.key === "stockType" && sortConfig.direction === "descending") &&
                                        <Icon className="mr-8" style={{ color: "#000" }}> arrow_upward </Icon>
                                    }
                                </IconButton>
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                                <TextField name="StockCode" onChange={handleSearchData}
                                    inputProps={{ className: "all-Search-box-data" }}
                                />

                                <IconButton style={{ padding: "0" }} onClick={() => requestSort('stock_name_code')} >
                                    <Icon className="mr-8" style={{ color: "#000" }}> sort </Icon>

                                    {(sortConfig && sortConfig.key === "stock_name_code" && sortConfig.direction === "ascending") &&
                                        <Icon className="mr-8" style={{ color: "#000" }}> arrow_downward </Icon>
                                    }
                                    {(sortConfig && sortConfig.key === "stock_name_code" && sortConfig.direction === "descending") &&
                                        <Icon className="mr-8" style={{ color: "#000" }}> arrow_upward </Icon>
                                    }
                                </IconButton>
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                                <TextField name="category" onChange={handleSearchData}
                                    inputProps={{ className: "all-Search-box-data" }}
                                />

                                <IconButton style={{ padding: "0" }} onClick={() => requestSort('category_name')} >
                                    <Icon className="mr-8" style={{ color: "#000" }}> sort </Icon>

                                    {(sortConfig && sortConfig.key === "category_name" && sortConfig.direction === "ascending") &&
                                        <Icon className="mr-8" style={{ color: "#000" }}> arrow_downward </Icon>
                                    }
                                    {(sortConfig && sortConfig.key === "category_name" && sortConfig.direction === "descending") &&
                                        <Icon className="mr-8" style={{ color: "#000" }}> arrow_upward </Icon>
                                    }
                                </IconButton>
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                                <TextField name="purity" onChange={handleSearchData}
                                    inputProps={{ className: "all-Search-box-data" }}
                                />

                                <IconButton style={{ padding: "0" }} onClick={() => requestSort('purity')} >
                                    <Icon className="mr-8" style={{ color: "#000" }}> sort </Icon>

                                    {(sortConfig && sortConfig.key === "purity" && sortConfig.direction === "ascending") &&
                                        <Icon className="mr-8" style={{ color: "#000" }}> arrow_downward </Icon>
                                    }
                                    {(sortConfig && sortConfig.key === "purity" && sortConfig.direction === "descending") &&
                                        <Icon className="mr-8" style={{ color: "#000" }}> arrow_upward </Icon>
                                    }
                                </IconButton>
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                                <TextField name="pieces" onChange={handleSearchData}
                                    inputProps={{ className: "all-Search-box-data" }}
                                />

                                <IconButton style={{ padding: "0" }} onClick={() => requestSort('pcs')} >
                                    <Icon className="mr-8" style={{ color: "#000" }}> sort </Icon>

                                    {(sortConfig && sortConfig.key === "pcs" && sortConfig.direction === "ascending") &&
                                        <Icon className="mr-8" style={{ color: "#000" }}> arrow_downward </Icon>
                                    }
                                    {(sortConfig && sortConfig.key === "pcs" && sortConfig.direction === "descending") &&
                                        <Icon className="mr-8" style={{ color: "#000" }}> arrow_upward </Icon>
                                    }
                                </IconButton>
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                                <TextField name="grossWeight" onChange={handleSearchData}
                                    inputProps={{ className: "all-Search-box-data" }}
                                />

                                <IconButton style={{ padding: "0" }} onClick={() => requestSort('gross_weight')} >
                                    <Icon className="mr-8" style={{ color: "#000" }}> sort </Icon>

                                    {(sortConfig && sortConfig.key === "gross_weight" && sortConfig.direction === "ascending") &&
                                        <Icon className="mr-8" style={{ color: "#000" }}> arrow_downward </Icon>
                                    }
                                    {(sortConfig && sortConfig.key === "gross_weight" && sortConfig.direction === "descending") &&
                                        <Icon className="mr-8" style={{ color: "#000" }}> arrow_upward </Icon>
                                    }
                                </IconButton>
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                                <TextField name="netWeight" onChange={handleSearchData}
                                    inputProps={{ className: "all-Search-box-data" }}
                                />

                                <IconButton style={{ padding: "0" }} onClick={() => requestSort('net_weight')} >
                                    <Icon className="mr-8" style={{ color: "#000" }}> sort </Icon>

                                    {(sortConfig && sortConfig.key === "net_weight" && sortConfig.direction === "ascending") &&
                                        <Icon className="mr-8" style={{ color: "#000" }}> arrow_downward </Icon>
                                    }
                                    {(sortConfig && sortConfig.key === "net_weight" && sortConfig.direction === "descending") &&
                                        <Icon className="mr-8" style={{ color: "#000" }}> arrow_upward </Icon>
                                    }
                                </IconButton>
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                                <TextField name="fineGold" onChange={handleSearchData}
                                    inputProps={{ className: "all-Search-box-data" }}
                                />

                                <IconButton style={{ padding: "0" }} onClick={() => requestSort('fineGold')} >
                                    <Icon className="mr-8" style={{ color: "#000" }}> sort </Icon>

                                    {(sortConfig && sortConfig.key === "fineGold" && sortConfig.direction === "ascending") &&
                                        <Icon className="mr-8" style={{ color: "#000" }}> arrow_downward </Icon>
                                    }
                                    {(sortConfig && sortConfig.key === "fineGold" && sortConfig.direction === "descending") &&
                                        <Icon className="mr-8" style={{ color: "#000" }}> arrow_upward </Icon>
                                    }
                                </IconButton>
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                                <TextField name="otherWeight" onChange={handleSearchData}
                                    inputProps={{ className: "all-Search-box-data" }}
                                />

                                <IconButton style={{ padding: "0" }} onClick={() => requestSort('other_weight')} >
                                    <Icon className="mr-8" style={{ color: "#000" }}> sort </Icon>

                                    {(sortConfig && sortConfig.key === "other_weight" && sortConfig.direction === "ascending") &&
                                        <Icon className="mr-8" style={{ color: "#000" }}> arrow_downward </Icon>
                                    }
                                    {(sortConfig && sortConfig.key === "other_weight" && sortConfig.direction === "descending") &&
                                        <Icon className="mr-8" style={{ color: "#000" }}> arrow_upward </Icon>
                                    }
                                </IconButton>
                            </TableCell>
                            <TableCell className={clsx(classes.tableRowPad, classes.padding)}>
                                <TextField name="info" onChange={handleSearchData}
                                    inputProps={{ className: "all-Search-box-data" }}
                                />

                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                                <TextField name="materialDetails" onChange={handleSearchData}
                                    inputProps={{ className: "all-Search-box-data" }}
                                />

                                <IconButton style={{ padding: "0" }} onClick={() => requestSort('material_detail')} >
                                    <Icon className="mr-8" style={{ color: "#000" }}> sort </Icon>

                                    {(sortConfig && sortConfig.key === "material_detail" && sortConfig.direction === "ascending") &&
                                        <Icon className="mr-8" style={{ color: "#000" }}> arrow_downward </Icon>
                                    }
                                    {(sortConfig && sortConfig.key === "material_detail" && sortConfig.direction === "descending") &&
                                        <Icon className="mr-8" style={{ color: "#000" }}> arrow_upward </Icon>
                                    }
                                </IconButton>
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                                <TextField name="previousProcess" onChange={handleSearchData}
                                    inputProps={{ className: "all-Search-box-data" }}
                                />

                                <IconButton style={{ padding: "0" }} onClick={() => requestSort('process')} >
                                    <Icon className="mr-8" style={{ color: "#000" }}> sort </Icon>

                                    {(sortConfig && sortConfig.key === "process" && sortConfig.direction === "ascending") &&
                                        <Icon className="mr-8" style={{ color: "#000" }}> arrow_downward </Icon>
                                    }
                                    {(sortConfig && sortConfig.key === "process" && sortConfig.direction === "descending") &&
                                        <Icon className="mr-8" style={{ color: "#000" }}> arrow_upward </Icon>
                                    }
                                </IconButton>
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                                <TextField name="lastVNum" onChange={handleSearchData}
                                    inputProps={{ className: "all-Search-box-data" }}
                                />

                                <IconButton style={{ padding: "0" }} onClick={() => requestSort('voucher_no')} >
                                    <Icon className="mr-8" style={{ color: "#000" }}> sort </Icon>

                                    {(sortConfig && sortConfig.key === "voucher_no" && sortConfig.direction === "ascending") &&
                                        <Icon className="mr-8" style={{ color: "#000" }}> arrow_downward </Icon>
                                    }
                                    {(sortConfig && sortConfig.key === "voucher_no" && sortConfig.direction === "descending") &&
                                        <Icon className="mr-8" style={{ color: "#000" }}> arrow_upward </Icon>
                                    }
                                </IconButton>
                            </TableCell>
                            <TableCell className={classes.tableRowPad}></TableCell>
                            <TableCell className={classes.tableRowPad}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items
                            .filter(
                                (temp) => {

                                    if (searchData.stockType) {
                                        return temp.stockType
                                            .toLowerCase()
                                            .includes(searchData.stockType.toLowerCase())
                                    } else if (searchData.StockCode) {
                                        return temp.stock_name_code
                                            .toLowerCase()
                                            .includes(searchData.StockCode.toLowerCase())
                                    } else if (searchData.category) {//&& temp.category_name
                                        return temp.category_name !== undefined && temp.category_name !== null ?
                                            temp.category_name
                                                .toLowerCase()
                                                .includes(searchData.category.toLowerCase()) : null
                                    } else if (searchData.purity) {
                                        return temp.purity !== null ? temp.purity
                                            .toString()
                                            .toLowerCase()
                                            .includes(searchData.purity.toLowerCase()) : null
                                    } else if (searchData.pieces) {
                                        return temp.pcs !== null ? temp.pcs.toString()
                                            .toLowerCase()
                                            .includes(searchData.pieces.toLowerCase()) : null
                                    } else if (searchData.grossWeight) {
                                        return temp.gross_weight.toString()
                                            .toLowerCase()
                                            .includes(searchData.grossWeight.toLowerCase())
                                    } else if (searchData.netWeight) {
                                        return temp.net_weight.toString()
                                            .toLowerCase()
                                            .includes(searchData.netWeight.toLowerCase())
                                    } else if (searchData.fineGold) {
                                        return temp.fineGold !== null ? temp.fineGold.toString()
                                            .toLowerCase()
                                            .includes(searchData.fineGold.toLowerCase()) : null
                                    }
                                    else if (searchData.otherWeight) {
                                        return temp.other_weight.toString()
                                            .toLowerCase()
                                            .includes(searchData.otherWeight.toLowerCase())
                                    }
                                    else if (searchData.info) {
                                        return temp.amount.toString() // add info key from array here
                                            .toLowerCase()
                                            .includes(searchData.info.toLowerCase())
                                    }
                                    else if (searchData.materialDetails) {// && temp.material_detail !== null

                                        return temp.material_detail !== null ? temp.material_detail
                                            .toLowerCase()
                                            .includes(searchData.materialDetails.toLowerCase()) : null
                                    } else if (searchData.previousProcess) {
                                        return temp.process !== null ? temp.process
                                            .toLowerCase()
                                            .includes(searchData.previousProcess.toLowerCase()) : null
                                    } else if (searchData.lastVNum) {
                                        return temp.voucher_no !== null ? temp.voucher_no.toString()
                                            .toLowerCase()
                                            .includes(searchData.lastVNum.toLowerCase()) : null
                                    } else {
                                        return temp
                                    }
                                })
                            .map((element, index) => (
                                <TableRow key={index}>
                                    <TableCell className={classes.tableRowPad} >
                                        <Checkbox className="checkbox_border" name="selectlot" onChange={(e) => handleChecked(e, element)} disabled={element.transit === "Out" || element.is_issue_for_hallmark == 1}  />
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                        {/* Stock Type */}
                                        {element.stockType}
                                    </TableCell>
                                    <TableCell
                                        // className={classes.tableRowPad}
                                        className={clsx(classes.tableRowPad, classes.hoverClass)}
                                        onClick={(e) =>
                                            handleClick(element)
                                        }
                                    >
                                        {element.stock_name_code}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                        {/* Variant */}
                                        {element.hasOwnProperty("category_name") ? element.category_name : "-"}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                        {/* Purity */}
                                        {element.purity}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                        {element.pcs === null ? "-" : element.pcs}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                        {parseFloat(element.gross_weight).toFixed(3)}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>

                                        {parseFloat(element.net_weight).toFixed(3)}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>

                                        {element.fineGold}
                                        {/* {element.flag === 1 && element.item_id === 1 ? parseFloat(parseFloat(element.net_weight) * parseFloat(element.purity) / 100).toFixed(3) : "-"} */}
                                    </TableCell>

                                    <TableCell className={classes.tableRowPad}>

                                        {parseFloat(element.other_weight).toFixed(3)}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                        {/* Info */}
                                        {!element.hasOwnProperty("order_info")
                                                     ? "-"
                                                   : element.order_info === 0
                                                   ? "Not casted"
                                                   : element.order_info !== null
                                                   ? "Casted"
                                                   : "-"}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                        {/* Material Details */}
                                        {element.hasOwnProperty("material_detail") && element.material_detail !== null ? element.material_detail : "-"}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                        {/* Previous Process */}
                                        {element.process}
                                    </TableCell>
                                    <TableCell
                                        className={clsx(classes.tableRowPad)}>
                                        {/* Last Performed V. Num */}
                                        {element.voucher_no}
                                    </TableCell>
                                    <TableCell className={clsx(classes.tableRowPad,"w-52")} style={{textAlign:"center"}}>
                                          {/* Transit */}
                                          {element.transit === null ? "- " : `${element.transit} `}
                                         {element.transfer_voucher !== null ? (
                                            <span
                                                  className={classes.hoverClass}
                                                  onClick={(e) => handleVoucherClick(element)}
                                                  style={{ color: "#1e90ff", cursor: "pointer" }}
                                            >
                                              - {element.transfer_voucher}
                                             </span>
                                             ) : (
                                              " "
                                             )}
                                    </TableCell>
                                    <TableCell className={clsx(classes.tableRowPad,"w-64")} style={{display:"flex"}}>
                                        {element.flag === 5 ? <>{
                                                authAccessArr.includes('Edit Packet') &&  <IconButton
                                            style={{ padding: "0" }}
                                            onClick={(ev) => {
                                                ev.preventDefault();
                                                ev.stopPropagation();
                                                editHandler(element.packet_id, element.stock_name_code);
                                            }}
                                        >
                                               <Icon className="mr-4 mt-8 edit-icone">
                                  <img src={Icones.edit} alt="" />
                                </Icon>
                                        </IconButton>} {
                                                authAccessArr.includes('Delete Packet') && <IconButton
                                            style={{ padding: "0" }}
                                            onClick={(ev) => {
                                                ev.preventDefault();
                                                ev.stopPropagation();
                                                deleteHandler(element.packet_id);
                                            }}
                                        >
                                                    <Icon className="mt-8 delete-icone">
                                  <img src={Icones.delete_red} alt="" />
                                </Icon>
                                            </IconButton>}</> :
                                             element.flag === 6 ? <> {
                                            authAccessArr.includes('Edit Packing Slip') &&    <IconButton
                                                style={{ padding: "0" }}
                                                onClick={(ev) => {
                                                    ev.preventDefault();
                                                    ev.stopPropagation();
                                                    editHandlerSlip(element.packing_slip_id, element.stock_name_code);
                                                }}
                                                disabled={element.is_issue_for_hallmark == 1 ? true : false}
                                            >
                                                <Icon className="mr-8 mt-8 edit-icone"
                                                //  style={element.is_issue_for_hallmark == 1  ? { color: "lightgray" } : { color: "#000" }}
                                                >
                                                    <img src={Icones.edit} alt="" />
                                                </Icon>
                                            </IconButton>} </> : ''}

                                    </TableCell>

                                </TableRow>
                            ))}

                    </TableBody>
                    {flag === true &&
                        <TableFooter>
                            <TableRow >
                                <TableCell className={classes.tableRowPad}>

                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                    {/* Stock Type */}

                                </TableCell>
                                <TableCell className={classes.tableRowPad} >
                                    {/* {element.stock_name_code} */}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                    {/* Variant */}

                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                    {/* Purity */}

                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                    {/* {pcs } */}
                                    {parseFloat(
                                        items
                                            .filter((item) => item.pcs !== "" && item.pcs !== "-")
                                            .map((item) => parseFloat(item.pcs))
                                            .reduce(function (a, b) {
                                                return parseFloat(a) + parseFloat(b);
                                            }, 0)
                                    )}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                    {/* {gross_weight} */}
                                    {parseFloat(
                                        items
                                            .filter((item) => item.gross_weight !== "" && item.gross_weight !== "-")
                                            .map((item) => parseFloat(item.gross_weight))
                                            .reduce(function (a, b) {
                                                return parseFloat(a) + parseFloat(b);
                                            }, 0)
                                    ).toFixed(3)}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>

                                    {/* {net_weight} */}
                                    {parseFloat(
                                        items
                                            .filter((item) => item.net_weight !== "")
                                            .map((item) => parseFloat(item.net_weight))
                                            .reduce(function (a, b) {
                                                return parseFloat(a) + parseFloat(b);
                                            }, 0)
                                    ).toFixed(3)}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                    {/* {element.fineGold} */}
                                </TableCell>

                                <TableCell className={classes.tableRowPad}>
                                    {/* {other_weight} */}
                                    {parseFloat(
                                        items
                                            .filter((item) => item.other_weight !== "")
                                            .map((item) => parseFloat(item.other_weight))
                                            .reduce(function (a, b) {
                                                return parseFloat(a) + parseFloat(b);
                                            }, 0)
                                    ).toFixed(3)}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                    {/* Info */}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                    {/* Material Details */}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                    {/* Previous Process */}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}   >
                                    {/* Last Performed V. Num */}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                    {/* Transit */}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    }

                </MaUTable>
                {props.location.search ? showModle() : null}

                {showPopup ? displayPopup() : null}

                {voucPopup ? displayVoucherPopup() : null}
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title" className="popup-delete">{"Alert!!!"}      <IconButton
                  style={{
                    position: "absolute",
                    marginTop: "-5px",
                    right: "15px",
                  }}
                  onClick={handleClose}
                >
                  <img
                    src={Icones.cross}
                    className="delete-dialog-box-image-size"
                    alt=""
                  />
                </IconButton></DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete this record?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleClose}
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
            </Paper>
        </div>
    )
}

export default AllStockView;