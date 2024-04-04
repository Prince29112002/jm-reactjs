import {
  Box,
  Button,
  Grid,
  List,
  ListItem,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { useContext, useEffect, useRef, useState } from "react";
import WaxSetting from "./ProductionSubView/WaxSetting/WaxSetting";
import TransferPopup from "./PopUps/TransferPopup";
import History from "@history";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Config from "app/fuse-configs/Config";
import Axios from "axios";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import AppContext from "app/AppContext";
import SplitDataView from "./PopUps/SplitDataView/SplitDataView";

const useStyles = makeStyles((theme) => ({
  root: {},
  productionContainer: {
    display: "flex",
    overflowY: "auto",
    height: "calc(100vh - 65px)",
    position: "relative",
  },
  menu: {
    flexWrap: "nowrap",
  },
  button: {
    textTransform: "none",
    backgroundColor: "#E5EAF3",
    color: "#306ff1",
    fontWeight: 700,
    transition: "0.6s",
    "&:hover": {
      backgroundColor: "#306ff1",
      color: "white",
    },
  },
  subButton: {
    textTransform: "none",
    backgroundColor: "#fcde304f",
    color: "#f1a800",
    fontWeight: 700,
    transition: "0.6s",
    "&:hover": {
      backgroundColor: "#FCDE30",
      color: "#000000",
    },
  },
  activeButton: {
    textTransform: "none",
    backgroundColor: "#306ff1",
    color: "white",
    fontWeight: 700,
  },
  activeSubButton: {
    textTransform: "none",
    backgroundColor: "#FCDE30",
    color: "#000000",
    fontWeight: 700,
  },
  hideScroll: {
    "&::-webkit-scrollbar": {
      display: "none",
    },
    "-ms-overflow-style": "none" /* IE and Edge */,
    "scrollbar-width": "none" /* Firefox */,
  },
  titleWidth: {
    width: "100px",
    paddingRight: "10px",
    fontWeight: 700,
    [theme.breakpoints.up("md")]: {
      width: "100px",
      textAlign: "right",
    },
  },
  sideMenuBtnReset: {
    borderRadius: "7px",
    // background: "#efb120e3",
    marginBottom: "10px",
    justifyContent: "center",
    color: "#FFFFFF",
    cursor: "pointer",
    "&:hover": {
      // background: "#ffb200",
    },
  },
  productionLeft: {
    width: "calc(100% - 300px)",
    paddingInline: 16,
    overflowY: "auto",
  },
  defaultView: {
    height: "250px",
    width: "100%",
    background: "#F6F6F6",
    border: "2px solid #BAC0C7",
    fontSize: "5rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#BAC0C7",
    marginTop: 40,
  },
  sidebar: {
    width: 300,
    background: "#FFFFFF",
    boxShadow: "-2px 0 20px gray",
    padding: "10px 15px",
    display: "flex",
    justifyContent: "center",
    overflowY: "auto",
    flexShrink: 0,
  },
  sideMenuBtn: {
    borderRadius: "7px",
    background: "#306ff1",
    marginBottom: "10px",
    justifyContent: "center",
    color: "#FFFFFF",
    cursor: "pointer",
    "&:hover": {
      background: "#3751C9",
    },
  },
  processItem: {
    background: "#FFDA00",
    color: "#0A0802",
  },
  shortItem: {
    background: "#D7C7D3",
    color: "#4a053a",
  },
  // shortItemActive: {
  //   background: "#4a053a",
  //   color: "#ffffff",
  // },
  processContainer: {
    alignItems: "center",
    flexWrap: "nowrap",
    marginBlock: 15,
  },
  shortContainer: {
    alignItems: "center",
    columnGap: 5,
    flexWrap: "nowrap",
    marginBlock: 15,
  },
  shortItems: {
    columnGap: "5px",
    display: "flex",
    overflowX: "auto",
    paddingRight: 5,
  },
}));

const DepartmentMain = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { selectedDepartment, setSelectedDepartment } = useContext(AppContext);
  const [modalView, setModalView] = useState(0);
  const [openTransferPopup, setOpenTransferPopup] = useState(false);
  const [departmentList, setDepartmentList] = useState([]);
  const [selectedDepartmenta, setSelectedDepartmenta] = useState("");
  const [selectedSubDepartment, setSelectedSubDepartment] = useState("");
  const [activeDepartment, setActiveDepartment] = useState("");
  const [subDepartment, setSubDepartment] = useState([]);
  const [lotIds, setLotIds] = useState([]);
  const [treeIds, setTreeIds] = useState([]);
  const [selectedArray, setSelectedArray] = useState([]);
  const [renderApi, setRenderApi] = useState(false);
  const [height, setHeight] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [afterData, setAfterData] = useState([]);
  const [stock_name_code_id, set_stock_name_code_id] = useState([]);

  console.log(selectedArray, "arraaaayyy");

  const roleOfUser = localStorage.getItem("permission")
    ? JSON.parse(localStorage.getItem("permission"))
    : null;
  const [authAccessArr, setAuthAccessArr] = useState([]);
  useEffect(() => {
    let arr = roleOfUser
      ? roleOfUser["Production"]["Production"]
        ? roleOfUser["Production"]["Production"]
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
    NavbarSetting("Planing", dispatch);
  }, []);

  const divRef = useRef(null);

  useEffect(() => {
    const height = divRef.current.clientHeight;
    setHeight(height);
    console.log("Dynamic Height:", height);
  }, [selectedDepartmenta, selectedSubDepartment]);

  useEffect(() => {
    const DepartmentId = parseFloat(localStorage.getItem("SelectedDepartment"));
    let departmentFlag;
    const findDepartmentById = (departments, targetId) => {
      for (const department of departments) {
        if (department.id === targetId) {
          setSelectedDepartmenta(department.id);
          setActiveDepartment(department.id);
          setSubDepartment(department.childDepartmentName);
          setSelectedSubDepartment("");
          return department;
        }

        if (
          department.childDepartmentName &&
          department.childDepartmentName.length > 0
        ) {
          const foundInChild = findDepartmentById(
            department.childDepartmentName,
            targetId
          );
          if (foundInChild) {
            console.log(department);
            console.log(foundInChild);
            setSelectedDepartmenta(department.id);
            setSelectedSubDepartment(foundInChild.id);
            setSubDepartment(department.childDepartmentName);
            setActiveDepartment(foundInChild.id);
            return foundInChild;
          }
        }
      }

      return null;
    };
    const foundDepartment = findDepartmentById(departmentList, DepartmentId);
    // const foundDepartment = departmentList.find(
    //   (dep) => dep.id === parseInt(DepartmentId)
    // );
    console.log(foundDepartment);
    console.log(departmentFlag);
    // if (foundDepartment) {
    //   if (departmentFlag === true) {
    //     // If childDepartmentName is empty
    //     setSelectedDepartmenta(DepartmentId);
    //     setActiveDepartment(DepartmentId);
    //     setSubDepartment([]);
    //   } else {
    //     // If childDepartmentName is not empty
    //     setSelectedDepartmenta(foundDepartment.id);
    //     setSelectedSubDepartment(foundDepartment.childDepartmentName[0].id);
    //     setSubDepartment(foundDepartment.childDepartmentName);
    //     setActiveDepartment(foundDepartment.childDepartmentName[0].id);
    //   }
    // }
  }, [
    departmentList.length !== 0 && localStorage.getItem("SelectedDepartment"),
  ]);
  // localStorage.getItem("SelectedDepartment");

  // const handleTransferOpenPopup = () => {
  //   const isSameFlag = selectedArray.every(
  //     (item) => item.flag === selectedArray[0].flag
  //   );
  //   console.log(isSameFlag);
  //   if (!isSameFlag) {
  //     dispatch(
  //       Actions.showMessage({
  //         message: "All Selected stock types are not the same",
  //         variant: "error",
  //       })
  //     );
  //     return null;
  //   } else {
  //     console.log(afterData);
  //     if (afterData.length > 0) {
  //       console.log("aaaa bbbb ccccc");
  //       return setOpenTransferPopup(true);
  //     } else {
  //       console.log("ddd");
  //       if (
  //         selectedArray.filter((item) => item.flag === 1 || item.flag === 2)
  //           .length > 0
  //       ) {
  //         if (
  //           selectedArray.filter((item) => item.flag === 1 || item.flag === 2)
  //             .length === selectedArray.length
  //         ) {
  //           return setShowModal(true);
  //         } else {
  //           dispatch(
  //             Actions.showMessage({
  //               message: "Please Select Proper Type Data",
  //               variant: "error",
  //             })
  //           );
  //         }
  //       } else {
  //         console.log("eeeee");
  //         return setOpenTransferPopup(true);
  //       }
  //     }
  //   }
  // };
  const handleTransferOpenPopup = () => {
    if (selectedArray.length === 0) {
      dispatch(
        Actions.showMessage({ message: "Please Select Stock", variant: "error" })
      );
    } else {
      const isSameFlag = selectedArray.every(
        (item) => item.flag === selectedArray[0].flag
      );
      if (!isSameFlag) {
        dispatch(
          Actions.showMessage({
            message: "All Selected stock types are not the same",
            variant: "error",
          })
        );
        return null;
      } else if (isSameFlag) {
        console.log("else condition");
        if (afterData.length > 0) {
          // if data is set or changed from split screen then show
          return setOpenTransferPopup(true);
        } else {
          // console.log("filter ", selectedId.filter(item => item.flag === 1 || item.flag === 2).length)
          // console.log("selId len", selectedId.length)
          // console.log("cond", selectedId.filter(item => item.flag === 1 || item.flag === 2).length === selectedId.length)

          if (
            selectedArray.filter((item) => item.flag === 1 || item.flag === 2)
              .length > 0
          ) {
            const findFilter = selectedArray.filter(
              (item) => item.flag === 1 || item.flag === 2
            );
            if (
              selectedArray.filter((item) => item.flag === 1 || item.flag === 2)
                .length === selectedArray.length
            ) {
              return setShowModal(true);
            } else if (findFilter.length < 0) {
              dispatch(
                Actions.showMessage({
                  message: "Please Select Proper Type Data",
                  variant: "error",
                })
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
            return setOpenTransferPopup(true);
          }
        }
      }
    }

    //   console.log("imm1111");
    //   const isSameFlag = selectedArray.every(
    //     (item) => item.flag === selectedArray[0].flag
    //   );
    //   console.log(isSameFlag);
    //   if (!isSameFlag) {
    //     dispatch(
    //       Actions.showMessage({
    //         message: "All Selected stock types are not the same",
    //         variant: "error",
    //       })
    //     );
    //     return null;
    //   } else {
    //     console.log(afterData);
    //     if (afterData.length > 0) {
    //       return setOpenTransferPopup(true);
    //     } else {
    //       const findFilter = selectedArray.filter(
    //         (item) => item.flag === 1 || item.flag === 2
    //       );
    //       if (findFilter.length === selectedArray.length) {
    //         return setShowModal(true);
    //       } else if (findFilter.length < 0) {
    //         dispatch(
    //           Actions.showMessage({
    //             message: "Please Select Proper Type Data",
    //             variant: "error",
    //           })
    //         );
    //       } else {
    //         console.log("eeeee");
    //         return setOpenTransferPopup(true);
    //       }
    //     }
    //   }
    // };
    // const handleTransferOpenPopup = () => {
    //   if (lotIds.length === 0 && treeIds.length === 0) {
    //     dispatch(
    //       Actions.showMessage({ message: "Select Lot Or Tree", variant: "error" })
    //     );
    //   } else {
    //     if (
    //       selectedArray.filter((item) => item.flag === 1 || item.flag === 2)
    //         .length > 0
    //     ) {
    //       if (
    //         selectedArray.filter((item) => item.flag === 1 || item.flag === 2)
    //           .length === selectedArray.length
    //       ) {
    //         setShowModal(true);
    //       } else {
    //         dispatch(
    //           Actions.showMessage({ message: "Please Select Proper Type Data" })
    //         );
    //       }
    //     } else {
    //       setOpenTransferPopup(true);
    //     }
    //   }
  };
  const handleTransferClosePopup = () => {
    setOpenTransferPopup(false);
  };
  const handleBreackaTree = () => {
    History.push(`/dashboard/production/breackatree`);
  };
  const handleIssueforAlloying = () => {
    History.push(`/dashboard/production/issueforalloying`);
  };

  const receiveBalanceStock = () => {
    History.push(`/dashboard/production/receivebalancestock`);
  };

  const handleAcceptTransfer = () => {
    History.push(`/dashboard/production/accepttransfer`);
  };

  const makeATree = () => {
    History.push(`/dashboard/production/makeatree`);
  };

  const receiveFromWorker = () => {
    History.push(`/dashboard/production/receivefromworker`);
  };
  const handleAddToWorker = () => {
    History.push(`/dashboard/production/addtoworker`, {
      data: selectedArray,
    });
  };

  const returnFromWorker = () => {
    History.push(`/dashboard/production/returnfromworker`);
  };

  const handleIssueWorker = () => {
    History.push(`/dashboard/production/issuetoworker`);
  };
  const handleAddReferenceNumber = () => {
    History.push(`/dashboard/production/addreferencenumber`);
  };

  const makeaBunch = () => {
    History.push(`/dashboard/production/makeabunch`);
  };
  const split = () => {
    History.push(`/dashboard/production/split`);
  };

  const merge = () => {
    History.push(`/dashboard/production/merge`);
  };

  const receiveTree = () => {
    History.push("/dashboard/production/receivetree");
  };

  function getModalStyle() {
    const top = 50; //+ rand();
    const left = 50; //+ rand();
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

  useEffect(() => {
    getDepartmentData();
  }, []);
  function getDepartmentData() {
    Axios.get(Config.getCommonUrl() + "api/department/sub/department/list")
      .then((response) => {
        if (response.data.success) {
          console.log(response.data.data);
          setDepartmentList(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/department/sub/department/list",
        });
      });
  }
  const reset = () => {
    // setRenderApi(true);
    window.location.reload();
  };

  const handleDepartmentSelect = (data) => {
    console.log(data);
    setSelectedDepartmenta(data.id);
    setActiveDepartment(data.id);
    setSelectedSubDepartment("");
    if (data.childDepartmentName.length === 0) {
      setSubDepartment([]);
      setSelectedDepartment({ value: `SL0-${data.id}`, label: data.name });
      window.localStorage.setItem("SelectedDepartment", data.id);
      window.localStorage.setItem("selDeptNm", data.name);
    } else {
      // setSelectedSubDepartment(data.childDepartmentName[0].id);
      setSubDepartment(data.childDepartmentName);
      setSelectedDepartment({
        value: `SL0-${data.id}`,
        label: data.name,
      });
      window.localStorage.setItem("SelectedDepartment", data.id);
      window.localStorage.setItem("selDeptNm", data.name);
    }
  };
  const handleSubDepartmentSelect = (data) => {
    console.log(data);
    setSelectedSubDepartment(data.id);
    setSelectedDepartment({
      value: `SL0-${data.id}`,
      label: data.name,
    });
    setActiveDepartment(data.id);
    window.localStorage.setItem("SelectedDepartment", data.id);
    window.localStorage.setItem("selDeptNm", data.name);
  };

  function selectedLotData(lot, data) {
    console.log(data);
    let lotId = [];
    let treeId = [];
    data.map((item) => {
      if (item.flag === 3) {
        lotId = [...lotId, item.lot_id];
      } else {
        treeId = [...treeId, item.tree_id];
      }
    });
    setLotIds(lotId);
    setTreeIds(treeId);
    setSelectedArray(data);
  }
  function submitTransfer() {
    setLotIds([]);
    setTreeIds([]);
    setSelectedArray([]);
    set_stock_name_code_id([]);
    setRenderApi(true);
  }
  const afterEffect = (data) => {
    console.log("afterEffect called", data);
    // setSelectedId([])
    setSelectedArray(data);
    let stock_name_data = data.map((item) => {
      return {
        stock_name_code_id: item.element.stock_name_code_id,
        weight: item.element.item_id !== 5 ? item.utilize : item.utilizeWeight,
        ...(item.element.item_id === 5 && {
          pcs: item.utilizePcs,
        }),
      };
    });
    console.log(stock_name_data);
    set_stock_name_code_id(stock_name_data);
    return setOpenTransferPopup(true);
  };
  const resetVar = () => {
    console.log("reset var called");
    setSelectedArray([]);
    // setAfterData([]);
    // refreshApi();
  };
  return (
    <>
      <div className={classes.productionContainer}>
        <Box className={classes.productionLeft}>
          <Box ref={divRef}>
            <Typography variant="h6" className="my-3">
              Department :
            </Typography>
            <Grid container className={classes.menu}>
              {/* <span className={classes.titleWidth}>
              <Button className={classes.activeButton} variant="contained">
                Production A
              </Button>
            </span> */}
              <Box
                style={{
                  gap: "15px",
                  display: "flex",
                  flexWrap: "wrap",
                  overflowX: "auto",
                  marginInline: 5,
                }}
                className={`${classes.hideScroll}`}
              >
                {departmentList
                  // .filter((data) => data.is_location === 0)
                  .map((department, idx) => {
                    return (
                      <Button
                        className={`${classes.button} ${
                          selectedDepartmenta == department.id
                            ? classes.activeButton
                            : ""
                        }`}
                        variant="contained"
                        key={idx}
                        onClick={() => handleDepartmentSelect(department)}
                      >
                        {department.name}
                      </Button>
                    );
                  })}
              </Box>
            </Grid>
            <Grid
              container
              className={classes.menu}
              style={{ marginTop: "16px" }}
            >
              {/* <span className={classes.titleWidth}>
              <Button className={classes.activeButton} variant="contained">
                Production A
              </Button>
            </span> */}
              <Box
                style={{
                  gap: "15px",
                  display: "flex",
                  flexWrap: "wrap",
                  overflowX: "auto",
                  marginInline: 5,
                }}
                className={`${classes.hideScroll}`}
              >
                {subDepartment.length !== 0 &&
                  subDepartment
                    // .filter((data) => data.is_location === 0)
                    .map((subdepartment, idx) => {
                      return (
                        <Button
                          className={`${classes.subButton} ${
                            selectedSubDepartment === subdepartment.id
                              ? classes.activeSubButton
                              : ""
                          }`}
                          variant="contained"
                          key={idx}
                          onClick={() =>
                            handleSubDepartmentSelect(subdepartment)
                          }
                        >
                          {subdepartment.name}
                        </Button>
                      );
                    })}
              </Box>
            </Grid>
          </Box>
          {/* <Grid container className={`${classes.processContainer}`}>
            <span className={classes.titleWidth}>Process</span>
            <Chip
              className={classes.processItem}
              size="medium"
              label={"Filling"}
              style={{ marginInline: 5 }}
            />
            <Box
              style={{ columnGap: "5px", display: "flex", overflowX: "auto" }}
              className={`${classes.hideScroll}`}
            >
              {Process.map((process, index) => (
                <Chip
                  className={classes.processItem}
                  size="medium"
                  label={process}
                  clickable
                  key={index}
                />
              ))}
            </Box>
          </Grid>
          <Grid container className={classes.shortContainer}>
            <span className={classes.titleWidth}>Short By</span>
            <Box className={`${classes.shortItems} ${classes.hideScroll}`}>
              {ShortBy.map((shortitem, index) => (
                <Chip
                  className={classes.shortItem}
                  size="small"
                  label={shortitem}
                  clickable
                  key={index}
                />
              ))}
            </Box>
          </Grid> */}
          {/* {modalView === 0 && (
            <Box className={classes.defaultView}>
              Please select a Department
            </Box>
          )} */}
          <WaxSetting
            departmentId={activeDepartment}
            selectedLotData={selectedLotData}
            renderApi={renderApi}
            setRenderApi={setRenderApi}
            height={height}
          />
        </Box>
        <Box className={classes.sidebar}>
          <List style={{ padding: 0, width: "100%" }}>
            <ListItem
              id="coloe-yellow-all"
              className={classes.sideMenuBtnReset}
              // style={{ background: "#ffb200e3", "&:hover":"#ffb200" }}
              onClick={() => reset()}
            >
              Reset
            </ListItem>
            <ListItem
              className={classes.sideMenuBtn}
               onClick={handleTransferOpenPopup} 
            >
              Transfer
            </ListItem>

            <ListItem
              className={classes.sideMenuBtn}
              onClick={handleAcceptTransfer}
            >
              Accept Transfer
            </ListItem>
            <ListItem
              className={classes.sideMenuBtn}
              onClick={handleIssueWorker}
            >
              Issue to Workstation
            </ListItem>
            <ListItem
              className={classes.sideMenuBtn}
              onClick={handleAddToWorker}
            >
              Add to Lot
            </ListItem>
            <ListItem
              className={classes.sideMenuBtn}
              onClick={returnFromWorker}
            >
              Remove from Lot
            </ListItem>
            <ListItem
              className={classes.sideMenuBtn}
              onClick={receiveFromWorker}
            >
              Receive from Workstation
            </ListItem>
            <ListItem className={classes.sideMenuBtn} onClick={makeaBunch}>
              Make a Bunch
            </ListItem>
            <ListItem className={classes.sideMenuBtn} onClick={makeATree}>
              Make a Tree
            </ListItem>
            <ListItem
              className={classes.sideMenuBtn}
              onClick={handleBreackaTree}
            >
              Break a Tree
            </ListItem>
            <ListItem className={classes.sideMenuBtn} onClick={split}>
              Split
            </ListItem>
            <ListItem className={classes.sideMenuBtn} onClick={merge}>
              Merge
            </ListItem>
            <ListItem
              className={classes.sideMenuBtn}
              onClick={receiveBalanceStock}
            >
              Receive Balance Stock
            </ListItem>
            <ListItem
              className={classes.sideMenuBtn}
              onClick={handleIssueforAlloying}
            >
              Issue for Alloying
            </ListItem>
            <ListItem className={classes.sideMenuBtn} onClick={receiveTree}>
              Receive Tree
            </ListItem>
            <ListItem
              className={classes.sideMenuBtn}
              onClick={handleAddReferenceNumber}
            >
              Add Reference Number
            </ListItem>
            {/* <ListItem
              className={classes.sideMenuBtnRed}
              // style={{ background: "#f21a12" }}
            >
              Delete
            </ListItem>
            <ListItem
              className={classes.sideMenuBtnRed}
              // style={{ background: "#f21a12" }}
            >
              Log Out
            </ListItem> */}
          </List>
        </Box>
      </div>
      <TransferPopup
        openPopup={openTransferPopup}
        closePopup={handleTransferClosePopup}
        selectedRowData={lotIds}
        selectedTreeIds={treeIds}
        fromDepartmentId={activeDepartment}
        submitTransfer={submitTransfer}
        rowData={selectedArray}
        stock_name_code_id={stock_name_code_id}
        // Ids={afterData}
      />
      <SplitDataView
        openPopup={showModal}
        closePopup={setShowModal}
        data={selectedArray}
        afterEffect={afterEffect}
        resetVar={resetVar}
      />

      {/* <Modal
        style={{ textAlign: "center" }}
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          style={{
            modalStyle,
            background: "white",
            // height: "270px",
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "500px",
            transform: "translate(-50%, -50%)",
            // margin: "100px", // temporary
            borderRadius: "10px",
          }}
        >
          <div>
            <h2
              style={{
                textAlign: "center",
                background: "#F15656",
                height: "70px",
                padding: "20px",
                color: "white",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
                position: "relative",
              }}
            >
              Alert !!
              <IconButton
                onClick={handleClose}
                style={{
                  position: "absolute",
                  color: "white",
                  right: "10px",
                  top: "10px",
                }}
              >
                X
              </IconButton>
            </h2>

            <div
              style={{ fontSize: "20px", padding: "30px", textAlign: "center" }}
            >
              Are you sure you want to Delete this Lot ?
            </div>

            <div
              onClick={handleClose}
              style={{ textAlign: "center", paddingBottom: "25px" }}
            >
              <button
                style={{
                  padding: "12px",
                  fontSize: "15px",
                  width: "120px",
                  background: "none",
                  color: "#F15656",
                  border: "1px solid #F15656",
                  marginRight: "20px",
                }}
              >
                No
              </button>
              <button
                style={{
                  padding: "13px",
                  fontSize: "15px",
                  width: "120px",
                  background: "#20A720",
                  color: "white",
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </Box>
      </Modal> */}
    </>
  );
};

export default DepartmentMain;
