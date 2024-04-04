import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Typography } from "@material-ui/core";
import { TextField, Checkbox } from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import Grid from "@material-ui/core/Grid";
import moment from "moment";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import TreeItem from "@material-ui/lab/TreeItem";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import Search from "app/main/apps/Masters/SearchHelper/SearchHelper";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Select, { createFilter } from "react-select";
import * as Actions from "app/store/actions";
import CheckboxTree from "react-checkbox-tree";
import "react-checkbox-tree/lib/react-checkbox-tree.css";

const useStyles = makeStyles((theme) => ({
  root: {},

  form: {
    marginTop: "3%",
    display: "contents",
  },
  formControl: {
    margin: 10,
  },
  group: {
    flexDirection: "row",
  },
  searchBox: {
    padding: 8,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
  },
}));



const ProductAllocation = forwardRef((props, ref) => {

  useImperativeHandle(ref, () => ({

      checkValidation() {
          // alert("getAlert from Child");
          console.log("getAlert from Child")
          return dateValidation() && designValidation()
      },

      finalArrIds() {
          return finalArr()
      },

      getData() {
          return {
              expiry_date_time: expDtTime,
              date_time: expDate,
              shortcut: expTime,
              is_category: categoryFlag,
              product_category_id: selectedSubCredit,
              staging_id: selectedStaging.value
          }
      }
  }));

  // const isEdit = props.isEdit; //if comes from edit
  // const idToBeEdited = props.editID;

  const [searchData, setSearchData] = useState("");
  const [expanded, setExpanded] = useState([])

  const dispatch = useDispatch();

  // const [gstType, setGstType] = useState("1");

  // const [modalView, setModalView] = useState(true);

  const [groupTree, setGroupTree] = useState([]);

  const [selectedSubCredit, setSelectedSubCredit] = useState([]);
  const [voucherToCreditErr, setVoucherToCreditErr] = useState("");

  const [expDtTime, setExpDtTime] = useState("")
  const [expDtTimeErr, setExpDtTimeErr] = useState("")

  const [expDate, setExpDate] = useState("")
  // const [expDateErr, setExpDateErr] = useState("")
  const [finalCatIds, setFinalCatIds] = useState([]);

  const [expTime, setExpTime] = useState("2-hours")
  const [expTimeErr, setExpTimeErr] = useState("")

  const [categoryFlag, setCategoryFlag] = useState("")
  const [catFlagErr, setCatFlagErr] = useState("");

  const [stagingList, setStagingList] = useState([]);
  const [stagingErr, setStagingErr] = useState("");

  const [selectedStaging, setSelectedStaging] = useState("")

  const [isView, setIsView] = useState(false)
  const [catArr, setCatArr] = useState([])

  const theme = useTheme();

  const selectStyles = {
      input: (base) => ({
          ...base,
          color: theme.palette.text.primary,
          "& input": {
              font: "inherit",
          },
      }),
  };

  const classes = useStyles();

  useEffect(() => {
      if(categoryFlag === "1" && groupTree.length === 0){
        getProductCategories()
      }else if(categoryFlag === "0" && stagingList.length === 0){
        getStagingDesingsList()
      }    
      //eslint-disable-next-line
  }, [categoryFlag]);

  function getStagingDesingsList() {
      axios
          .get(Config.getCommonUrl() + "api/designStaging")
          .then(function (response) {
              if (response.data.success === true) {
                  console.log(response);
                  let tempData = response.data.data;
                  setStagingList(tempData);
              } else {
                  dispatch(Actions.showMessage({ message: response.data.message }));
                  setStagingList([])
              }
          })
          .catch(function (error) {
              handleError(error, dispatch, { api: "api/designStaging" })
          });
  }

  useEffect(() => {
      console.log("ProductAllocation--", props);
      setIsView(props.isViewOnly)
      let treeView = props.treeView;
      let expDtTim = props.expDtTime
      let categoryFlg = props.categoryFlag
      let expDt = props.expDate;
      let shortcut = props.shortcut;
      if (treeView) {
          setSelectedSubCredit(treeView)
          if (treeView.length > 0) {
              let tempExpanded = [];
              tempExpanded.push('1')
              tempExpanded.push(...treeView.map(item => { return item.value.toString() }));
              // console.log("----", tempExpanded)
              // setExpanded(tempExpanded)
              // console.log("-----", treeView.map(item => { return item.value.toString() }))
          }
      }

      if (expDtTim) {
          setExpDtTime(expDtTim)
      }

      if (categoryFlg) {
          setCategoryFlag(categoryFlg)
          if (categoryFlg == "0") {
              setSelectedStaging(props.selectedStaging)
          }
      }
      if (expDtTim == 1) {
          setExpTime(shortcut)
          const data = shortcut != null ? shortcut.split("-") : ""
          const today = moment().format('DD/MM/YYYY hh:mm:ss A')
          const time = moment(today, "DD-MM-YYYY hh:mm:ss A").add(data[0], data[1]).format('YYYY-MM-DD hh:mm:ss A');
          setExpDate(time)
      }
      if (expDtTim == 2) {
          setExpTime(props.expDate)
      }
  }, [props]);

  function getProductCategories() {
      axios
          .get(Config.getCommonUrl() + "api/productcategory/category/tree")
          .then(function (response) {

              if (response.data.success === true) {
                  console.log(response.data.data);
                  const data = response.data.data;
                  setCatArr(data)
                  const categoryTree = buildCategoryTree(data);
                  console.log(categoryTree)
                  setGroupTree(categoryTree)
              }
          })
          .catch(function (error) {
              handleError(error, dispatch, { api: "api/productcategory/category/tree" })
          });
  }

  function buildCategoryTree(data, parentId = null) {
      const tree = [];
      
      for (const item of data) {
        if (item.parent_category_id === parentId) {
          const { id, category_name } = item;
          const children = buildCategoryTree(data, id);
          const category = {
            value: id,
            label: category_name
          };
          if (children.length > 0) {
            category.children = children;
          }
          tree.push(category);
        }
      }
      
      return tree;
    }

  function dateValidation() {
      if (expDtTime === "") {
          setExpDtTimeErr("Select Expiry Date & Time");
          return false;
      } else if (expDtTime === "1") {
          if (validatetime()) {
              return true;
          } else {
              return false;
          }
      }
      return true;
  }

  function validatetime() {
      if (expDate !== "") {
          return true
      } else {

          if (expTime === "" || expTime === null) {
              setExpTimeErr("Select Expiry Date & Time");
              return false;
          }
          return true;
      }

  }

  function validatcategory() {
      if (selectedSubCredit.length === 0) {
          setVoucherToCreditErr("Select category");
          return false;
      }
      return true;
  }

  function stagingValidation() {
      if (selectedStaging === "") {
          setStagingErr("Please Select Any Staging")
          return false;
      }
      return true;
  }

  function designValidation() {
      if (categoryFlag === "") {
          setCatFlagErr("Select Design Option");
          return false;
      } else if (categoryFlag === "0") {
          if (stagingValidation()) {
              return true;
          } else {
              return false;
          }
      } else if (categoryFlag === "1") {
          if (validatcategory()) {
              return true;
          } else {
              return false;
          }
      }
      return true;
  }

  function onSearchHandler(sData) {
      // console.log("Search on", sData);
      setSearchData(sData);

      const result = deepFilter(groupTree, (node) =>
          node.label.toLowerCase().includes(sData.toLowerCase())
      )
      // console.log(result);
      if (sData === "") {
          setExpanded([])
      } else {
          console.log(result,"99999")
          if (result.length > 0) {
              const tree = [];
      
      for (const item of result) {
   
          const { id, category_name } = item;
          const children = buildCategoryTree(result, id);
          const category = {
            value: id,
            label: category_name
          };
          if (children.length > 0) {
            category.children = children;
          }
          tree.push(category);
        
      }
              // let tempArr = []
              // tempArr.push(result[0].value.toString())

              // result[0].children.map(item => {
              //     tempArr.push(item.value.toString())
              //     item.children.map(x => {
              //         tempArr.push(x.value.toString())
              //         return null
              //     })
              //     return null
              // })

              // console.log(tempArr)
              setExpanded(tree.toString())
          }
      }

  }

  function renderCreditTree(nodes) {
      return nodes.map((x, i) => (
          <TreeItem
              key={`rtree-${i}`}
              // nodeId={`Node-${i}-${x.value.toString()}`}
              nodeId={x.value.toString()}
              label={
                  <FormControlLabel
                      control={
                          <Checkbox
                              checked={selectedSubCredit.some((item) => item.value === x.value)}//&& item.name === x.name
                              onChange={(event) =>
                                  getOnCreditChange(event.currentTarget.checked, x)
                              }
                              onClick={(e) => e.stopPropagation()}
                              disabled={isView}
                          />
                      }
                      label={<>{x.label}</>}
                      key={x.value}
                  />
              }
          >
              {Array.isArray(x.children) ? renderCreditTree(x.children) : null}
          </TreeItem>
      ))
  }

  function getOnCreditChange(checked, nodes) {
      // console.log(checked, nodes)
      const allNode = getChildByCreditId(nodes, nodes.value);
      // console.log(allNode)
      let array = checked
          ? [...selectedSubCredit, ...allNode]
          // : selectedSubCredit.filter((value) => !allNode.includes(value));
          : selectedSubCredit.filter((value) => !allNode.some((item) => item.value === value.value));
      //here selectedSubCredit data comes from createDistributor page and that doesnot contain children element, so above comment line is comparing with children, so it is not deselecting,
      //so here only comparing id value
      // console.log(selectedSubCredit.filter((value) => !allNode.some((item) => item.value === value.value)))
      // console.log(array)
      array = array.filter((v, i) => array.indexOf(v) === i);
      setVoucherToCreditErr("")
      setSelectedSubCredit(array);
      console.log(array)
  }

  function getChildByCreditId(node, value) {
      let array = [];

      function getAllCreditChild(nodes) {
          if (nodes === null) return [];
          array.push(nodes);
          if (Array.isArray(nodes.children)) {
              nodes.children.forEach((node) => {
                  array = [...array, ...getAllCreditChild(node)];
                  array = array.filter((v, i) => array.indexOf(v) === i);
              });
          }
          return array;
      }

      function getNodeByCreditId(nodes, value) {
          if (nodes.value === value) {
              return nodes;
          } else if (Array.isArray(nodes.children)) {
              let result = null;
              nodes.children.forEach((node) => {
                  if (!!getNodeByCreditId(node, value)) {
                      result = getNodeByCreditId(node, value);
                  }
              });
              return result;
          }

          return null;
      }

      return getAllCreditChild(getNodeByCreditId(node, value));
  }

  const handleToggle = (event, nodeIds) => {
      // console.log(nodeIds)
      setExpanded(nodeIds);
  };

  function deepFilter(nodes, cb) {
      return nodes
          .map((node) => {
              if (cb(node)) return node;
              let children = deepFilter(node.children || [], cb);
              return children.length && { ...node, children };
          })
          .filter(Boolean);
  }

  const handleInputChange = (e) => {
      const name = e.target.name;
      const value = e.target.value;

      if (name === "expDtTime") {
          setExpDtTime(value)
          setExpDtTimeErr("")
          if (value == 1) {
              setExpTime("2-hours")
              const today = moment().format('DD/MM/YYYY hh:mm:ss A')
              const time = moment(today, "DD-MM-YYYY hh:mm:ss A").add(2, "hours").format('YYYY-MM-DD hh:mm:ss A');
              setExpDate(time)
          } else if(value === "2") {
              const today = moment();
          const futureDate = today.add(2, 'months').format('YYYY-MM-DD hh:mm:ss A');
          console.log(futureDate, "futureDate")
          setExpTime(futureDate);
          }
      } else if (name === "expTime") {
          setExpTime(value)
          setExpTimeErr("")
          const data = value.split("-")
          const today = moment().format('DD/MM/YYYY hh:mm:ss A')
          const time = moment(today, "DD-MM-YYYY hh:mm:ss A").add(data[0], data[1]).format('YYYY-MM-DD hh:mm:ss A');
          setExpDate(time)
      } else if (name === "categoryFlag") {
          setCategoryFlag(value)
          setCatFlagErr("")
      }
  }

  let handleStagingChange = (e) => {
      setSelectedStaging({
          value: e.value,
          label: e.label,
      });
      setStagingErr("")
  };

  function finalArr() {
      const dataArr = [...selectedSubCredit]
      const catttArr = [...catArr]
      const mainId = []
      catttArr.map((item) => {
          if (dataArr.includes(item.id.toString()) && item.parent_category_id !== null) {
              mainId.push(item.parent_category_id.toString())
              if (item[item.parent_category_id]) {
                  mainId.push(item[item.parent_category_id].id.toString())
                  console.log(item[item[item.parent_category_id].id])
                  if (item[item[item.parent_category_id].id]) {
                      mainId.push(item[item[item.parent_category_id].id].id.toString())
                  }
              }
          }
      })

      const finalArr = [...selectedSubCredit, ...mainId]
      const uniqueChars = [...new Set(finalArr)];
      console.log(uniqueChars, "final")
      setFinalCatIds(uniqueChars)
      return uniqueChars
  }


  return (
    <>
      <div className={clsx(classes.root, props.className, "w-full")}>
        <FuseAnimate animation="transition.slideUpIn" delay={200}>
          <div className="flex flex-col md:flex-row container">
            <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20 ">
              <div className="main-div-alll">
                {/* {JSON.stringify(contDetails)} */}
                <div>
                  <form
                    name="registerForm"
                    noValidate
                    className="flex flex-col justify-center w-full"
                  >
                    <FormControl
                      id="redio-input-dv"
                      component="fieldset"
                      className={classes.formControl}
                    >
                      <FormLabel component="legend">
                        Expiry Date & Time :
                      </FormLabel>
                      <RadioGroup
                        aria-label="categoryType"
                        id="radio-row-dv"
                        name="expDtTime"
                        className={classes.group}
                        value={expDtTime}
                        onChange={handleInputChange}
                      >
                        <FormControlLabel
                          value="1"
                          control={<Radio />}
                          label="Yes"
                          disabled={isView}
                        />

                        <FormControlLabel
                          value="0"
                          control={<Radio />}
                          label="No"
                          disabled={isView}
                        />
                         <FormControlLabel
                                value="2"
                                control={<Radio />}
                                label="Two months"
                                disabled={isView}
                        />
                         <span className="mt-2">
                               {expDtTime === "2" && <p className="mt-2">
                               {expTime}  </p>}
                         </span>
                      </RadioGroup>
                    </FormControl>

                    <span style={{ color: "red" }}>
                      {expDtTimeErr.length > 0 ? expDtTimeErr : ""}
                    </span>

                    {expDtTime === "1" && (
                      <Grid container spacing={3} className="m-16">
                        <Grid item xs={8} style={{ padding: 5 }}>
                          <FormControl
                            id="redio-input-dv"
                            component="fieldset"
                            className={classes.formControl}
                          >
                            <FormLabel component="legend"> Shortcut:</FormLabel>
                            <RadioGroup
                              aria-label="Gender"
                              id="radio-row-dv"
                              name="expTime"
                              className={classes.group}
                              value={expTime}
                              onChange={handleInputChange}
                            >
                              <FormControlLabel
                                value="2-hours"
                                control={<Radio />}
                                label="2 Hrs"
                                disabled={isView}
                              />

                              <FormControlLabel
                                value="6-hours"
                                control={<Radio />}
                                label="6 Hrs"
                                disabled={isView}
                              />

                              <FormControlLabel
                                value="12-hours"
                                control={<Radio />}
                                label="12 Hrs"
                                disabled={isView}
                              />

                              <FormControlLabel
                                value="1-days"
                                control={<Radio />}
                                label="1 Day"
                                disabled={isView}
                              />

                              <FormControlLabel
                                value="2-days"
                                control={<Radio />}
                                label="2 Day"
                                disabled={isView}
                              />

                              <FormControlLabel
                                value="7-days"
                                control={<Radio />}
                                label="7 Day"
                                disabled={isView}
                              />

                              <FormControlLabel
                                value="15-days"
                                control={<Radio />}
                                label="15 Day"
                                disabled={isView}
                              />

                              <FormControlLabel
                                value="30-days"
                                control={<Radio />}
                                label="30 Day"
                                disabled={isView}
                              />

                              <FormControlLabel
                                value="1-years"
                                control={<Radio />}
                                label="1 Year"
                                disabled={isView}
                              />
                            </RadioGroup>
                          </FormControl>
                          <span style={{ color: "red" }}>
                            {expTimeErr.length > 0 ? expTimeErr : ""}
                          </span>
                        </Grid>
                        <Grid item xs={3} style={{ padding: 5 }}>
                          <TextField
                            className="mt-32"
                            label="Expiry Date & Time"
                            name="expDate"
                            value={expDate}
                            variant="outlined"
                            fullWidth
                            disabled
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>
                      </Grid>
                    )}
                    <FormControl
                      id="redio-input-dv"
                      component="fieldset"
                      className={classes.formControl}
                    >
                      <FormLabel component="legend">Design Option :</FormLabel>
                      <RadioGroup
                        aria-label="categoryType"
                        id="radio-row-dv"
                        name="categoryFlag"
                        className={classes.group}
                        value={categoryFlag}
                        onChange={handleInputChange}
                      >
                        <FormControlLabel
                          value="1"
                          control={<Radio />}
                          label="Categories"
                          disabled={isView}
                        />

                        <FormControlLabel
                          value="0"
                          control={<Radio />}
                          label="Staging"
                          disabled={isView}
                        />
                      </RadioGroup>
                    </FormControl>
                    <span style={{ color: "red" }}>
                      {catFlagErr.length > 0 ? catFlagErr : ""}
                    </span>
                    {categoryFlag === "1" && (
                      <Grid className="" item xs={12} style={{ padding: 5 }}>
                        <div className="ml-16 mt-16">
                          <label style={{ display: "contents" }}>
                            {" "}
                            Show Category / Subcategory :{" "}
                          </label>
                          <Search
                            className={classes.searchBox}
                            onSearch={onSearchHandler}
                          />
                        </div>

                        <div
                          className="account-li-dv mt-16"
                          style={{ marginBottom: "10%" }}
                        >
                          {/* <CheckboxTree
                            nodes={groupTree}
                            checked={selectedSubCredit}
                            expanded={expanded}
                            checkModel="all"
                            onCheck={(checked) => {
                              setSelectedSubCredit(checked);
                              setVoucherToCreditErr("");
                            }}
                            onExpand={(expanded) => setExpanded(expanded)}
                            showNodeIcon={false}
                          /> */}

                              <TreeView
                                  defaultCollapseIcon={<ExpandMoreIcon />}
                                  defaultExpandIcon={<ChevronRightIcon />}
                                  expanded={expanded}
                                  onNodeToggle={handleToggle}
                                  >
                                  {/* {modalView ? renderCreditTree(groupTree) : ''} */}
                                  {renderCreditTree(deepFilter(groupTree, (node) =>
                                  node.label.toLowerCase().includes(searchData.toLowerCase())
                                  ))}
                              </TreeView>

                          {/* </Typography> */}
                          {/* </AccordionDetails>
                                    </Accordion> */}
                          <span style={{ color: "red" }} className="m-2">
                            {voucherToCreditErr.length > 0
                              ? voucherToCreditErr
                              : ""}
                          </span>
                        </div>
                      </Grid>
                    )}
                    {categoryFlag === "0" && (
                      <Grid
                        className=""
                        item
                        xs={3}
                        sm={3}
                        md={3}
                        style={{ padding: 5 }}
                      >
                        <Select
                          className={clsx(classes.selectBox, "ml-2")}
                          filterOption={createFilter({
                            ignoreAccents: false,
                          })}
                          styles={selectStyles}
                          options={stagingList.map((suggestion) => ({
                            value: suggestion.id,
                            label: suggestion.name,
                          }))}
                          value={selectedStaging}
                          onChange={(e) => {
                            handleStagingChange(e);
                          }}
                          placeholder="Select Staging"
                          isDisabled={isView}
                        />
                        <span style={{ color: "red" }} className="m-2">
                          {stagingErr.length > 0 ? stagingErr : ""}
                        </span>
                      </Grid>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </FuseAnimate>
      </div>
    </>
  );
});

export default ProductAllocation;
