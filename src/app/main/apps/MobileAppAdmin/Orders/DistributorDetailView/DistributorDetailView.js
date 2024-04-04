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
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting"
import Button from "@material-ui/core/Button";
import { FuseAnimate } from "@fuse";
import { Typography } from "@material-ui/core";
import { TextField, Icon, IconButton, Box, Collapse } from "@material-ui/core";
import Loader from "app/main/Loader/Loader";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import BreadcrumbsHelper from "../../../../BreadCrubms/BreadcrumbsHelper";
import History from "@history";

const useStyles = makeStyles((theme) => ({
    root: {},
    tabroot: {
      overflowX: "auto",
      overflowY: "auto",
      // height: "100%",
    },
    tableRowPad: {
      padding: 7,
    },
    button: {
      margin: 5,
      textTransform: "none",
      backgroundColor: "cornflowerblue",
      color: "white",
    },
    normalSelect: {
      // marginTop: 8,
      padding: 8,
      fontSize: "12pt",
      borderColor: "darkgray",
      borderWidth: 1,
      borderRadius: 0,
      width: "100%",
      // marginLeft: 15,
    },
    textOverFlow: {
      display: "block",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  }));

const DistributorDetailView = (props) => {

    const [designApiData, setDesignApiData] = useState([]);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const classes = useStyles();
    const [orderNum, setOrderNumber] = useState("")
    const [catalogueName, setCatalogueName] = useState("")
    const [isView, setIsView] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [remark, setRemark] = useState("");
    const [orderId, setOrderId] = useState("")
    const [searchData, setSearchData] = useState({
        design_num: "",
        karat: "",
        pcs: "",
        gross_wgt: "",
        net_wgt: "",
        remark: "",
  });

  useEffect(() => {
    NavbarSetting('Mobile-app Admin', dispatch)
    //eslint-disable-next-line
}, [])

    useEffect(() => {
        if (loading) {
          setTimeout(() => setLoading(false), 7000);
        }
      }, [loading]);

      useEffect(() => {
       
        if(props.location.state){
            const data = props.location.state
            setOrderNumber(data.order_number)
            setIsView(data.isView);
            setIsEdit(!data.isView);
            setOrderId(data.id)
            getDistributorViewData(data.id)
        }
      }, []);

      function getDistributorViewData(id) {
        setLoading(true)
        axios
          .get(Config.getCommonUrl() + `api/distCatalogueOrder/${id}`)
          .then(function (response) {
            console.log(response);
            if (response.data.success === true) {
              setDesignApiData(response.data.data.DistCatalogueOrderDesigns); 
              setCatalogueName(response.data.data.DistributorCatalogue.name);
              setRemark(response.data.data.final_order_remark)
            } else {
              dispatch(Actions.showMessage({ message: response.data.message,variant:"error"}));
            }
            setLoading(false)
          })
          .catch((error) => {
            setLoading(false)
            handleError(error, dispatch, { api: `api/distCatalogueOrder/${id}` });
          });
      }

      const handleSearchData = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        
        setSearchData((prevState) => ({
            ...prevState, [name]: value
        })
        );
    }

    const handleFormSubmit = (event) => {
      event.preventDefault();
      const body = {
        final_order_remark : remark
      }
      axios
      .put(Config.getCommonUrl() + `api/distCatalogueOrder/update-${orderId}`, body)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success"}));
          History.goBack();
        } else {
          dispatch(Actions.showMessage({ message: response.data.message,variant:"error"}));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: `api/distCatalogueOrder/update-${orderId}` });
      });
    }

    return (
        <div className={clsx(classes.root, props.className, "w-full")} style={{ height: 'calc(100vh - 100px)', overflowX: 'hidden' }}>
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
                <Grid item xs={12} sm={6} md={6} key="1" style={{ padding: 0 }}>
                  <FuseAnimate delay={300}>
                    <Typography className="p-16 pb-8 text-18 font-700">
                      View Distributor Order 
                    </Typography>
                  </FuseAnimate>
  
                  <BreadcrumbsHelper />  / <b>{orderNum}</b> 
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    key="2"
                    style={{ textAlign: "right" }}
                >
                    <Button
                        variant="contained"
                        className={classes.button}
                        size="small"
                            onClick={() => History.push(`/dashboard/mobappadmin/orders`)}
                    >
                        Back
                    </Button>
                </Grid>
              </Grid>

              <Grid item xs={4} sm={4} md={4} style={{ padding: 10 }}>
              <TextField
                className="mt-16"
                label="Catalogue Name"
                name="catalogueName"
                value={catalogueName}
                variant="outlined"
                fullWidth
                disabled
            />
            </Grid>
              {loading && <Loader />}
              <div className="m-16 mt-56 department-tbl-mt-dv" >
                <Paper className={classes.tabroot} id="department-tbl-fix ">
                  <div className="table-responsive new-add_stock_group_tbel" style={{ maxHeight: "calc(100vh - 300px)" }} >
                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell className={classes.tableRowPad} align="left">
                            Design No
                          </TableCell>
                          <TableCell className={classes.tableRowPad} align="left">
                          Karat
                          </TableCell>
                          <TableCell className={classes.tableRowPad} align="left">
                          Pieces
                          </TableCell>
                          <TableCell className={classes.tableRowPad} align="left">
                          Gross Weight
                          </TableCell>
                          <TableCell className={classes.tableRowPad} align="left">
                          Net Weight
                          </TableCell>
                          <TableCell className={classes.tableRowPad} align="left">
                          Remarks
                          </TableCell>
                          <TableCell className={classes.tableRowPad} align="left">
                          Image
                          </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.tableRowPad}>
                                <TextField name="design_num" onChange={handleSearchData} />
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                                <TextField name="karat" onChange={handleSearchData} />
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                                <TextField name="pcs" onChange={handleSearchData} />
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                                <TextField name="gross_wgt" onChange={handleSearchData} />
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                                <TextField name="net_wgt" onChange={handleSearchData} />
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              <TextField name="remark" onChange={handleSearchData} />
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                                </TableCell>
                              </TableRow>
                          </TableHead>
                          <TableBody>
                        {designApiData
                              .filter(
                                (temp) => {

                                    if (searchData.design_num) {
                                        return temp.variant_number
                                            .toLowerCase()
                                            .includes(searchData.design_num.toLowerCase())
                                    } else if (searchData.karat) {
                                        return temp.karat.toString()
                                            .toLowerCase()
                                            .includes(searchData.karat.toLowerCase())
                                    }else if (searchData.pcs) {
                                      return temp.quantity.toString()
                                          .toLowerCase()
                                          .includes(searchData.pcs.toLowerCase())
                                  }else if (searchData.gross_wgt) {
                                    return temp.gross_weight
                                        .toLowerCase()
                                        .includes(searchData.gross_wgt.toLowerCase())
                                }else if (searchData.net_wgt) {
                                  return temp.net_weight
                                      .toLowerCase()
                                      .includes(searchData.net_wgt.toLowerCase())
                              }else if (searchData.remark) {
                                return temp.admin_comment ? temp.admin_comment : ""
                                    .toLowerCase()
                                    .includes(searchData.remark.toLowerCase())
                            } else {
                                        return temp
                                    }
                                })
                          .map((row) => (
                            <TableRow key={row.id}>
  
                              <TableCell align="left" className={clsx(classes.tableRowPad, `${row.status == "Deactive" ? classes.bolderName : ""}`)}>
                                {row.variant_number}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.karat}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                                style={{ overflowWrap: "anywhere" }}
                              >
                                {row.quantity}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.gross_weight}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.net_weight}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                                
                              >
                                {row.admin_comment}
                              </TableCell>
                              <TableCell align="left" className={classes.tableRowPad}>
                                {/* iamge */}
                                <img
                                    src={row.designs.image_files.length > 0 ? row.designs.image_files[0].ImageURL : Config.getjvmLogo()}
                                    height={50}
                                    width={50}
                                />
                                </TableCell>
                            </TableRow>
                         )) }
                      </TableBody>
                    </Table>
                  </div>
                </Paper>
              </div>
              <Grid item xs={4} sm={4} md={4} style={{ padding: 10 }}>
            <TextField
                className="mt-16"
                label="Remark"
                name="remark"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                variant="outlined"
                fullWidth
                multiline
                rowsMax={3}
                disabled={isView}
              />
            </Grid>
            {
              isEdit  && <Grid
              className="department-main-dv"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={12} sm={12} md={12} style={{ padding: 5 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ float: "right", backgroundColor: "limegreen" }}
                    className="mx-auto mt-16"
                    aria-label="Register"
                    onClick={(e) => {
                      handleFormSubmit(e);
                    }}
                  >
                    Update
                  </Button>
              </Grid>
            </Grid>
            }
             
            </div>
          </div>
        </FuseAnimate>
      </div>
    )
}

export default DistributorDetailView