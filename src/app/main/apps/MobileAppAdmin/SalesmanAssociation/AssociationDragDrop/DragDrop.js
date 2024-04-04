import React, { useState, useEffect } from "react";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { TextField, Icon, IconButton } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { Droppable, Draggable } from "react-tiny-drag-drop";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import clsx from "clsx";
import Icones from "assets/fornt-icons/Mainicons";
import { Typography } from "@material-ui/core";

// https://github.com/githubjonas/react-tiny-drag-drop
function getModalStyle() {
  const top = 50; //+ rand();
  const left = 50; //+ rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: {
    position: "absolute",
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
  horiDiv: {
    float: "left",
    clear: "none",
    width: "45%",
  },
  Droppable: {
    padding: "15px",
  },

  Draggable: {
    padding: "15px",
    margin: "5px",
  },
  modalwidth: {
    width: "780px",
  },
}));

const context = "names";

const DragDrop = (props) => {
  const [groupA, setGroupA] = useState([]);
  const [groupB, setGroupB] = useState([]);

  const [searchData, setSearchData] = useState({
    grpAComp: "",
    grpACity: "",
    grpBComp: "",
    grpBCity: "",
  });
  const dispatch = useDispatch();

  const handleDrop = useFunction((groupName, currentKey, currentContext) => {
    let a = [...groupA];
    let b = [...groupB];
    let selected = [...checkBoxItem];

    if (selected.length > 0) {
      if (groupName === "a") {
        b = b.filter((item) => {
          if (selected.includes(item.id)) {
            a.push(item);
            const index = selected.indexOf(item.id);
            selected.splice(index, 1);
          } else {
            return item;
          }
        });
        setMasterCheckedB(false);
      } else if (groupName === "b") {
        a = a.filter((item) => {
          if (selected.includes(item.id)) {
            b.push(item);
            const index = selected.indexOf(item.id);
            selected.splice(index, 1);
          } else {
            return item;
          }
        });
        setMasterChecked(false);
      }
      setCheckboxItem(selected);
      setGroupA(a);
      setGroupB(b);
    } else {
      //  Remove the dropped item if found in group A
      let aIndex = a.findIndex((item) => {
        return currentKey === item.id;
      });

      if (aIndex > -1) {
        // Items will always be added to the bottom in this simple demo.
        // A Droppable can be added to each Draggable to determine sort order in
        // the group, but that's out of scope for this demo.
        if (groupName === "a") {
          a.push(a[aIndex]);
        } else {
          b.push(a[aIndex]);
        }
        a.splice(aIndex, 1);
      }
      a.forEach((v, i) => {
        if (currentKey === v.id) {
          a.splice(i, 1);
        }
      });

      //  Remove the dropped item if found in group B
      let bIndex = b.findIndex((item) => {
        return currentKey === item.id;
      });

      if (bIndex > -1) {
        // Items will always be added to the bottom in this simple demo.
        // A Droppable can be added to each Draggable to determine sort order in
        // the group, but that's out of scope for this demo.
        if (groupName === "a") {
          a.push(b[bIndex]);
        } else {
          b.push(b[bIndex]);
        }
        b.splice(bIndex, 1);
      }
      // b.forEach((v, i) => {
      //     if (currentKey === v.id) {
      //         b.splice(i, 1);
      //     }
      // });
      // Update state
      setGroupA(a);
      setGroupB(b);
    }
  });

  const [open, setOpen] = React.useState(true);
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();
  const [checkBoxItem, setCheckboxItem] = useState([]);
  const [salesmanId, setSalesmanId] = useState("");
  const [masterCheck, setMasterChecked] = useState(false);
  const [masterCheckB, setMasterCheckedB] = useState(false);

  const handleClose = () => {
    setOpen(false);
    props.modalColsed();
  };

  useEffect(() => {
    let selectItem = [];
    if (masterCheck) {
      groupA.map((item) => {
        selectItem.push(item.id);
      });
    }
    setCheckboxItem(selectItem);
  }, [masterCheck]);

  useEffect(() => {
    let selectItem = [];
    if (masterCheckB) {
      groupB.map((item) => {
        selectItem.push(item.id);
      });
    }
    setCheckboxItem(selectItem);
  }, [masterCheckB]);

  const onCheckBoxCheck = (event, element) => {
    let checked = event.target.checked;
    if (checked) {
      let selectedData = [...checkBoxItem, element];
      setCheckboxItem(selectedData);
    } else {
      let selected = checkBoxItem.filter((id) => {
        return id !== element;
      });
      setCheckboxItem(selected);
    }
  };

  useEffect(() => {
    setSalesmanId(props.salesmanId);

    let tempDistriComp = props.distriComp;
    // let temp = tempDistriComp.map(item => {
    let tempA = [];
    let tempB = [];
    tempDistriComp.map((item) => {
      if (item.DistributorSalesManAssociation.length !== 0) {
        if (
          props.salesmanId ===
          item.DistributorSalesManAssociation[0].salesman_id
        ) {
          tempB.push({
            id: item.id,
            client_id: item.client_id,
            company: item.company?.company_name,
            cityName: item.company?.CityName?.name,
          });
        } else {
          tempA.push({
            id: item.id,
            client_id: item.client_id,
            company: item.company?.company_name,
            cityName: item.company?.CityName?.name,
          });
        }
      } else {
        tempA.push({
          id: item.id,
          client_id: item.client_id,
          company: item.company?.company_name,
          cityName: item.company?.CityName?.name,
        });
      }
    });
    setGroupA(tempA);
    setGroupB(tempB);
  }, [props]);

  const handleSearchData = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setSearchData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (groupB.length === 0) {
      dispatch(
        Actions.showMessage({
          message: "Please Select Company for Allocation",
          variant: "error",
        })
      );
      return;
    }
    // get id key from groupB array for associate id
    let associated_ids = groupB.map((item) => {
      return item.id;
    });
    Association(associated_ids);
  };

  function Association(associated_ids) {
    let data = {
      is_salesmanDataFrom: Number(props.is_salesmanDataFrom),
      distributorsArray: associated_ids,
    };

    axios
      .post(
        Config.getCommonUrl() +
          "api/salesmanassociation/allocateDistributorTo/" +
          salesmanId,
        data
      )
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          // response.data.data
          // setGoldColor("");
          // History.goBack(); //.push("/dashboard/masters/vendors");
          handleClose();

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
          api: "api/salesmanassociation/allocateDistributorTo/" + salesmanId,
          body: data,
        });
      });
  }

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            handleClose();
          }
        }}
      >
        <div
          style={modalStyle}
          className={clsx(classes.paper, classes.modalwidth, "rounded-8")}
        >
          <h5
            className="popup-head"
            style={{
              padding: "14px",
              paddingTop: "17px",
            }}
          >
            Allocation
            <IconButton
              style={{ position: "absolute", top: "-2px", right: "8px" }}
              onClick={handleClose}
            >
              <Icon>
                <img src={Icones.cross} alt="" />
              </Icon>
            </IconButton>
          </h5>
          <div className="p-5 pl-16 pr-16" style={{ display: "flex" }}>
            <div className={classes.horiDiv}>
              <div className={classes.horiDiv}>
                <lebel className="pl-1">Company name</lebel>
                <TextField
                  className="pt-1"
                  placeholder="Company name"
                  name="grpAComp"
                  onChange={handleSearchData}
                  inputProps={{ className: "all-Search-box-data" }}
                  variant="outlined"
                  fullWidth
                />
              </div>
              <div className={classes.horiDiv} style={{ marginLeft: "10%" }}>
                <lebel className="pl-1">City</lebel>
                <TextField
                  className="pt-1"
                  placeholder="City"
                  name="grpACity"
                  onChange={handleSearchData}
                  inputProps={{ className: "all-Search-box-data" }}
                  variant="outlined"
                  fullWidth
                />
              </div>
            </div>
            <div className={classes.horiDiv} style={{ marginLeft: "10%" }}>
              <div className={classes.horiDiv}>
                <lebel className="pl-1">Company name</lebel>
                <TextField
                  className="pt-1"
                  label="Company Name"
                  name="grpBComp"
                  onChange={handleSearchData}
                  variant="outlined"
                  fullWidth
                />
              </div>
              <div className={classes.horiDiv} style={{ marginLeft: "10%" }}>
                <lebel className="pl-1">City</lebel>
                <TextField
                  className="pt-1"
                  label="City"
                  name="grpBCity"
                  onChange={handleSearchData}
                  variant="outlined"
                  fullWidth
                />
              </div>
            </div>
          </div>
          <div className="p-5 pl-16 pr-16 text-left">
            <div
              className={classes.horiDiv}
              style={{
                height: "calc(60vh)",
                overflowX: "hidden",
                overflowY: "auto",
              }}
            >
              <Typography className="font-700">Allocated</Typography>
              <Droppable
                context={context}
                onDrop={(currentKey, currentContext) => {
                  handleDrop("a", currentKey, currentContext);
                }}
              >
                <div
                  className={classes.Droppable}
                  style={{ border: "3px solid #EBEEFB" }}
                >
                  <div>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      style={{
                        float: "left",
                        margin: "3px",
                        marginRight: "10px",
                      }}
                      checked={masterCheck}
                      id="mastercheck"
                      onChange={(e) => setMasterChecked(!masterCheck)}
                    />
                    <div style={{ paddingRight: "200px" }}>
                      <b>Select all </b>
                    </div>
                  </div>
                  {/* <h4>Group A</h4> */}
                  {/* {renderList(groupA)} */}
                  {groupA
                    .filter((temp) => {
                      if (searchData.grpAComp) {
                        return temp.company
                          .toLowerCase()
                          .includes(searchData.grpAComp.toLowerCase());
                      } else if (searchData.grpACity) {
                        return temp.cityName
                          .toLowerCase()
                          .includes(searchData.grpACity.toLowerCase());
                      }
                      //  else if (searchData.grpBComp) {//&& temp.category_name
                      //     return temp.company
                      //         .toLowerCase()
                      //         .includes(searchData.grpBComp.toLowerCase())
                      // } else if (searchData.grpBCity) {
                      //     return temp.cityName
                      //         .toLowerCase()
                      //         .includes(searchData.grpBCity.toLowerCase())
                      // }
                      else {
                        return temp;
                      }
                    })
                    .map((item) => (
                      <Draggable
                        key={item.id}
                        context={context}
                        dataKey={item.id}
                      >
                        <div style={{ display: "flex" }}>
                          <div className={classes.Draggable}>
                            {" "}
                            <input
                              type="checkbox"
                              className="form-check-input"
                              style={{ float: "left" }}
                              checked={checkBoxItem.includes(item.id)}
                              id="mastercheck"
                              onChange={(e) => onCheckBoxCheck(e, item.id)}
                            />
                          </div>
                          <div style={{ paddingTop: "16px" }}>
                            {item.company}
                          </div>
                        </div>
                      </Draggable>
                    ))}
                </div>
              </Droppable>
            </div>
            <div
              className={classes.horiDiv}
              style={{
                height: "calc(60vh)",
                overflowX: "hidden",
                overflowY: "auto",
                marginLeft: "8%",
                marginTop: "20px",
              }}
            >
              <Typography style={{ textAlign: "center" }} className="font-700">
                Allocated
              </Typography>
              <Droppable
                context={context}
                onDrop={(currentKey, currentContext) => {
                  handleDrop("b", currentKey, currentContext);
                }}
              >
                <div
                  className={classes.Droppable}
                  style={{ border: "3px solid #EBEEFB" }}
                >
                  <div>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      style={{
                        float: "left",
                        margin: "3px",
                        marginRight: "10px",
                      }}
                      checked={masterCheckB}
                      id="mastercheck"
                      onChange={(e) => setMasterCheckedB(!masterCheckB)}
                    />
                    <div style={{ paddingRight: "200px" }}>
                      <b>Select all</b>
                    </div>
                  </div>
                  {/* <h4>Group B</h4> */}
                  {/* {renderList(groupB)} */}
                  {groupB
                    .filter((temp) => {
                      if (searchData.grpBComp) {
                        //&& temp.category_name
                        return temp.company
                          .toLowerCase()
                          .includes(searchData.grpBComp.toLowerCase());
                      } else if (searchData.grpBCity) {
                        return temp.cityName
                          .toLowerCase()
                          .includes(searchData.grpBCity.toLowerCase());
                      } else {
                        return temp;
                      }
                    })
                    .map((item) => (
                      <Draggable
                        key={item.id}
                        context={context}
                        dataKey={item.id}
                      >
                        <div style={{ display: "flex" }}>
                          <div className={classes.Draggable}>
                            {" "}
                            <input
                              type="checkbox"
                              className="form-check-input"
                              style={{ float: "left" }}
                              checked={checkBoxItem.includes(item.id)}
                              id="mastercheck"
                              onChange={(e) => onCheckBoxCheck(e, item.id)}
                            />
                          </div>
                          <div style={{ paddingTop: "16px" }}>
                            {item.company}
                          </div>
                        </div>
                      </Draggable>
                    ))}
                </div>
              </Droppable>
            </div>

            <div
              style={{
                textAlign: "right",
                marginBottom: "2%",
                marginRight: "20px",
              }}
            >
              <Button
                variant="contained"
                className="mx-auto mt-16 popup-cancel"
                onClick={handleClose}
                // onClick={(e) => handleFileUpload(e)}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                className="ml-16 mx-auto mt-16 popup-save"
                onClick={(e) => handleSubmit(e)}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

function useFunction(callback) {
  const ref = React.useRef();
  ref.current = callback;

  return React.useCallback(function () {
    const callback = ref.current;
    if (typeof callback === "function") {
      return callback.apply(this, arguments);
    }
  }, []);
}

export default DragDrop;
