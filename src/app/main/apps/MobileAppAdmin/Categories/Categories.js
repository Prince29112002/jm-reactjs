import React, { useState, useEffect } from "react";
import { TextField, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import TreeItem from "@material-ui/lab/TreeItem";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Button from "@material-ui/core/Button";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import Loader from "../../../Loader/Loader";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Search from "../../Masters/SearchHelper/SearchHelper";

const useStyles = makeStyles((theme) => ({
  root: {},
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "cornflowerblue",
    color: "white",
  },
  selectBox: {
    padding: 8,
    fontSize: "11pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
    // width: "100%",
    margin: "5px 0px 5px 10px",
    width: "132px",
    height: "37px",
  },
}));

const Categories = (props) => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);

  const [groupTree, setGroupTree] = useState([]);

  const [selectedSubCredit, setSelectedSubCredit] = useState([]);
  const [voucherToCreditErr, setVoucherToCreditErr] = useState("");

  const [searchData, setSearchData] = useState("");

  const [expanded, setExpanded] = useState(["1"]);

  const [viewOptions, setViewOption] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  useEffect(() => {
    getAlreadySetCategories();
    getListCategoryView();
    getProductCategories();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    NavbarSetting("Mobile-app Admin", dispatch);
    //eslint-disable-next-line
  }, []);

  function getAlreadySetCategories() {
    setLoading(true);
    axios
      .get(
        Config.getCommonUrl() + "api/productcategory/get-category-added-views"
      )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          let tempData = response.data.data;

          setSelectedSubCredit(tempData);
          if (tempData.length > 0) {
            let tempExpanded = [];
            tempExpanded.push("1");
            tempExpanded.push(
              ...tempData.map((item) => {
                return item.category_id.toString();
              })
            );
          }

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
          api: "api/productcategory/get-category-added-views",
        });
      });
  }

  function getListCategoryView() {
    setLoading(true);

    axios
      .get(Config.getCommonUrl() + "api/productcategory/list-category-view")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          let tempData = response.data.data;

          setViewOption(tempData);
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
          api: "api/productcategory/list-category-view",
        });
      });
  }

  function getProductCategories() {
    // setLoading(true);
    const nodes = [];
    setLoading(true);

    axios
      .get(Config.getCommonUrl() + "api/productcategory/category/tree")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response.data.data);
          const data = response.data.data;
          data.map((i, ind) => {
            if (i.mainCategoryname === null) {
              nodes.push({
                value: i.id,
                label: i.category_name,
                children: [],
              });
            } else {
              if (i[i.id].parent_category_id === null) {
                const index = nodes.findIndex(
                  (item) => item.value === i.parent_category_id
                );
                if (index > -1) {
                  nodes[index].children.push({
                    value: i.id,
                    label: i.category_name,
                    children: [],
                  });
                }
              } else {
                let index = nodes.findIndex(
                  (item) => item.value === i[i.id].parent_category_id
                );
                if (index === -1) {
                  let childIndex = -1;
                  childIndex = nodes[0].children.findIndex(
                    (item) => item.value === i[i.id].parent_category_id
                  );
                  if (childIndex === -1) {
                    childIndex = nodes[0].children.findIndex(
                      (item) =>
                        item.value === i[i.id][i[i.id].id].parent_category_id
                    );
                    if (childIndex > -1) {
                      let innerindex = -1;
                      innerindex = nodes[0].children[
                        childIndex
                      ].children.findIndex(
                        (item) => item.value === i[i.id].parent_category_id
                      );
                      if (childIndex > -1 && innerindex > -1) {
                        nodes[0].children[childIndex].children[
                          innerindex
                        ].children.push({
                          value: i.id,
                          label: i.category_name,
                          children: [],
                        });
                      }
                    }
                  } else {
                    let innerindex = -1;
                    innerindex = nodes[0].children[
                      childIndex
                    ].children.findIndex(
                      (item) => item.value === i.parent_category_id
                    );
                    if (childIndex > -1 && innerindex > -1) {
                      nodes[0].children[childIndex].children[
                        innerindex
                      ].children.push({
                        value: i.id,
                        label: i.category_name,
                        children: [],
                      });
                    }
                  }
                } else {
                  let innerindex = -1;
                  if (index > -1) {
                    innerindex = nodes[index].children.findIndex(
                      (item) => item.value === i.parent_category_id
                    );
                  }
                  if (index > -1 && innerindex > -1) {
                    nodes[index].children[innerindex].children.push({
                      value: i.id,
                      label: i.category_name,
                      children: [],
                    });
                  }
                }
              }
            }
            return null;
          });
          setGroupTree(nodes);
          setLoading(false);
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, {
          api: "api/productcategory/category/tree",
        });
      });
  }

  function renderCreditTree(nodes) {
    return nodes.map((x, i) => (
      <TreeItem
        key={`rtree-${i}`}
        // nodeId={`Node-${i}-${x.value.toString()}`}//no need unique id is here
        nodeId={x.value.toString()}
        label={
          <>
            <label style={{ fontSize: "12pt" }}>{<>{x.label}</>}</label>
            {x.children.length > 0 && (
              <select
                name="gender"
                className={classes.selectBox}
                value={
                  selectedSubCredit
                    .filter((y) => y.category_id === x.value)
                    .map((item) => {
                      return item.view_id;
                    }).length === 0
                    ? ""
                    : selectedSubCredit
                        .filter((y) => y.category_id === x.value)
                        .map((item) => {
                          return item.view_id;
                        })[0]
                }
                //here returns blank array which is creating issue so..
                // disabled={isView}
                onChange={(e) => {
                  // hangleGenderChange(e);
                  setViewDataForCategory(e.target.value, x);
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <option hidden value="">
                  View
                </option>

                {viewOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.per_page_view}
                  </option>
                ))}
              </select>
            )}
          </>
        }
      >
        {Array.isArray(x.children) ? renderCreditTree(x.children) : null}
      </TreeItem>
    ));
  }

  function setViewDataForCategory(value, x) {
    let index = selectedSubCredit.findIndex((item) => {
      return item.category_id === x.value;
    });

    if (index > -1) {
      //if already there then update
      let tempData = [...selectedSubCredit];
      tempData[index].view_id = Number(value);
      setSelectedSubCredit(tempData);
    } else {
      let tempData = [...selectedSubCredit];

      tempData.push({
        category_id: x.value,
        view_id: Number(value),
      });
      setSelectedSubCredit(tempData);
    }
  }

  function onSearchHandler(sData) {
    setSearchData(sData);

    const result = deepFilter(groupTree, (node) =>
      node.label.toLowerCase().includes(sData.toLowerCase())
    );
    if (sData === "") {
      setExpanded(["1"]);
    } else {
      if (result.length > 0) {
        let tempArr = [];
        tempArr.push(result[0].value.toString());

        result[0].children.map((item) => {
          tempArr.push(item.value.toString());
          item.children.map((x) => {
            tempArr.push(x.value.toString());
            return null;
          });
          return null;
        });

        setExpanded(tempArr);
      }
    }
  }

  function deepFilter(nodes, cb) {
    return nodes
      .map((node) => {
        if (cb(node)) return node;
        let children = deepFilter(node.children || [], cb);
        return children.length && { ...node, children };
      })
      .filter(Boolean);
  }

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  function handleFormSubmit(ev) {
    ev.preventDefault();
    if (selectedSubCredit.length === 0) {
      setVoucherToCreditErr("Please Change View to Submit");
      return;
    }

    AddCategoriesViewData();
  }

  function AddCategoriesViewData() {
    axios
      .post(Config.getCommonUrl() + "api/productcategory/set-category-view", {
        category_views: selectedSubCredit,
      })
      .then(function (response) {
        console.log(response);
        setLoading(false);

        if (response.data.success === true) {
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
              variant: "success",
            })
          );
        }
      })
      .catch((error) => {
        setLoading(false);

        handleError(error, dispatch, {
          api: "api/productcategory/set-category-view",
          body: {
            category_views: selectedSubCredit,
          },
        });
      });
  }

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20 ">
          <div className="flex flex-1 flex-col min-w-0">
            <Grid
              className="department-main-dv"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={12} sm={6} md={6} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-32 pt-16 pb-8 text-18 font-700">
                    Categories
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
            <div className="main-div-alll">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {loading && <Loader />}

                <div className="department-tbl-mt-dv">
                  <Grid className="" item xs={12} style={{ padding: 5 }}>
                    <TreeView
                      id="treeviewcateg"
                      defaultCollapseIcon={<ExpandMoreIcon />}
                      defaultExpandIcon={<ChevronRightIcon />}
                      expanded={expanded}
                      onNodeToggle={handleToggle}
                      style={{ Treeitem: { paddingTop: "10px" } }}
                    >
                      {renderCreditTree(
                        deepFilter(groupTree, (node) =>
                          node.label
                            .toLowerCase()
                            .includes(searchData.toLowerCase())
                        )
                      )}
                    </TreeView>
                    <span style={{ color: "red" }}>
                      {voucherToCreditErr.length > 0 ? voucherToCreditErr : ""}
                    </span>
                  </Grid>
                </div>

                <div style={{ display: "flex", justifyContent: "end" }}>
                  <label style={{ paddingTop: "17px" }}>
                    {" "}
                    Show Category / Subcategory :{" "}
                  </label>

                  <div>
                    <Search onSearch={onSearchHandler} />
                  </div>
                </div>
              </div>
              <div
                className="mr-3 mb-8"
                style={{
                  display: "flex",
                  justifyContent: "end",
                  marginTop: "30px",
                }}
              >
                <Button
                  id="btn-save"
                  // variant="contained"
                  // color="primary"
                  aria-label="Register"
                  onClick={(e) => {
                    handleFormSubmit(e);
                  }}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default Categories;
