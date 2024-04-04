import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import Select, { createFilter } from "react-select";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Button, TextField } from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import History from "@history";
import Loader from "app/main/Loader/Loader";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "#FFFFFF",
    borderRadius: 7,
    letterSpacing: "0.06px",
  },
}));

const UpdateBrandings = (props) => {
  const classes = useStyles();
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

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imgFile, setImgFile] = useState("");

  const [title, setTitle] = useState("");
  const [titleErr, setTitleErr] = useState("");

  const [description, setDescription] = useState("");
  const [descErr, setDescErr] = useState("");

  const propsData = props.location.state;

  const [flag, setFlag] = useState("");
  const [isEdit, setIsEdit] = useState("");

  const [productCategory, setProductCategory] = useState([]);
  const [selectedProdCat, setSelectedProdCat] = useState("");
  const [prodCatErr, setProdCatErr] = useState("");

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  useEffect(() => {
    NavbarSetting("Mobile-app Admin", dispatch);
    //eslint-disable-next-line
  }, []);

  const hiddenFileInput = React.useRef(null);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  useEffect(() => {
    if (propsData !== undefined) {
      setFlag(propsData.flag);
      setIsEdit(propsData.isEdit);
      if (propsData.isEdit === true) {
        setImageUrl(propsData.row.imageUrl);
      }
      if (propsData.flag === 1 && propsData.isEdit === true) {
        setTitle(propsData.row.title);
        setDescription(propsData.row.description);
      }
      if (propsData.flag === 3) {
        getProductCategories();
      }
    }
    //eslint-disable-next-line
  }, [dispatch]);

  function getProductCategories() {
    axios
      .get(Config.getCommonUrl() + "api/productcategory/main/category")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          let tempData = response.data.data;
          setProductCategory(tempData);

          if (propsData.isEdit === true) {
            setSelectedProdCat({
              value: propsData.row.product_category_id,
              label: propsData.row.forCategory_name.category_name,
            });
          }
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {
          api: "api/productcategory/main/category",
        });
      });
  }

  let handleCategoryChange = (e) => {
    setSelectedProdCat({
      value: e.value,
      label: e.label,
    });
    setProdCatErr("");
  };

  function setImages(imgFile) {
    console.log(imgFile, "TYPE");
    if (
      imgFile.name.endsWith(".jpeg") ||
      imgFile.name.endsWith(".png") ||
      imgFile.name.endsWith(".jpg")
    ) {
      setImageUrl(URL.createObjectURL(imgFile));
      setImgFile(imgFile);
    } else {
      dispatch(
        Actions.showMessage({
          message: "Accept only .jpg, .png, or .jpeg files.",
        })
      );
    }
 
  }

  function titleValidation() {
    // var Regex = /^[A-Za-z0-9 ]*[A-Za-z]+[A-Za-z0-9 ]*$/;
    if (!title || title === "") {
      setTitleErr("Please Enter Title");
      return false;
    }
    return true;
  }

  function descValidation() {
    // var Regex = /^[a-zA-Z0-9\s.,'-]*$/;
    if (!description || description === "") {
      setDescErr("Please Enter Description");
      return false;
    }
    return true;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    if (!ev.detail || ev.detail == 1) {
      if (imgFile === "" && isEdit === false) {
        dispatch(Actions.showMessage({ message: "Please Upload Image File" }));
        return;
      }
      if (flag === 1) {
        if (titleValidation() && descValidation()) {
          const formData = new FormData();
          formData.append("image", imgFile);
          formData.append("title", title);
          formData.append("description", description);

          if (isEdit === true) {
            UpdateData("api/splashScreen/" + propsData.row.id, formData);
          } else {
            UploadData("api/splashScreen", formData);
          }
        }
      } else if (flag === 2) {
        const formData = new FormData();
        formData.append("image", imgFile);

        if (isEdit === true) {
          UpdateData("api/sliderImages/" + propsData.row.id, formData);
        } else {
          UploadData("api/sliderImages", formData);
        }
      } else if (flag === 3) {
        const formData = new FormData();
        formData.append("image", imgFile);
        formData.append("product_category_id", selectedProdCat.value);

        if (selectedProdCat === "") {
          setProdCatErr("Please Select Product Category");
          return;
        }

        if (isEdit === true) {
          UpdateData("api/brandBannerImages/" + propsData.row.id, formData);
        } else {
          UploadData("api/brandBannerImages", formData);
        }
      }
    }
  }

  function UpdateData(URl, data) {
    axios
      .put(Config.getCommonUrl() + URl, data)
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          setLoading(false);

          History.goBack(); //.push("/dashboard/masters/vendors");

          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          ) 
        }else {
          setLoading(false);

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

        handleError(error, dispatch, { api: URl, body: data });
      });
  }

  function UploadData(URl, data) {
    axios
      .post(Config.getCommonUrl() + URl, data)
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          setLoading(false);

          History.goBack(); //.push("/dashboard/masters/vendors");

          dispatch(  Actions.showMessage({
            message: response.data.message,
            variant: "success",
          })
        );
        } else {
          setLoading(false);

          dispatch( Actions.showMessage({
            message: response.data.message,
            variant: "error",
          })
        );
        }
      })
      .catch((error) => {
        setLoading(false);

        handleError(error, dispatch, { api: URl, body: data });
      });
  }

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (name === "title") {
      setTitle(value);
      setTitleErr("");
    } else if (name === "description") {
      setDescription(value);
      setDescErr("");
    }
  }


  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20 ">
            <Grid
              className="department-main-dv"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={12} sm={6} md={6} key="1" style={{ padding: 0 }}>
                {/* <FuseAnimate delay={300}>
                                    <Typography className="p-16 pb-8 text-18 font-700">
                                        Branding
                                    </Typography>
                                </FuseAnimate>

                                <BreadcrumbsHelper /> */}
              </Grid>

              {/* <Grid
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
                  onClick={(event) => {
                    History.goBack();
                  }}
                >
                  Back
                </Button>
              </Grid> */}
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                key="2"
                style={{ textAlign: "right" }}
              >
                <div className="btn-back">
                  <Button
                    id="btn-back"
                    className=""
                    size="small"
                    onClick={(event) => {
                      History.goBack();
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

            {loading && <Loader />}

            <div className="main-div-alll">
              {flag === 1 && (
                <div>
                  <Typography className="p-16 pb-8 text-16 font-700">
                    Splash Screen
                  </Typography>

                  {/* <div>Splash Screen</div> */}
                  <Grid
                    className="department-main-dv p-16"
                    container
                    spacing={4}
                    alignItems="stretch"
                    style={{ margin: 0 }}
                  >
                    <Grid
                      item
                      xs={4}
                      sm={4}
                      md={4}
                      key="1"
                      style={{ padding: 5 }}
                    >
                      <label>Title</label>
                      <TextField
                        className=""
                        placeholder="Title"
                        name="title"
                        value={title}
                        error={titleErr.length > 0 ? true : false}
                        helperText={titleErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </Grid>

                    <Grid
                      item
                      xs={4}
                      sm={4}
                      md={4}
                      key="2"
                      style={{ padding: 5 }}
                    >
                      <label>Description</label>

                      <TextField
                        id="standard-multiline-static"
                        multiline
                        placeholder="Description"
                        name="description"
                        value={description}
                        error={descErr.length > 0 ? true : false}
                        helperText={descErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </Grid>

                    <Grid
                      item
                      xs={2}
                      sm={2}
                      md={2}
                      key="3"
                      style={{ padding: 5, paddingTop: "25px" }}
                    >
                      <Button id="btn-save" onClick={handleClick}>
                        Browse Image
                      </Button>

                      <input
                        type="file"
                        // id="fileinput"
                        ref={hiddenFileInput}
                        onChange={(event) => {
                          setImages(event.target.files[0]);
                        }}
                        accept="image/*"
                        style={{ display: "none" }}
                      />
                      {/* <Button variant="contained" component="span" style={{ backgroundColor: "#283428", color: "white" }}>
                                            <label htmlFor="contained-button-file">
                                                <input id="contained-button-file" type="file" style={{ display: "none" }} onChange={(event) => { setImages(event.target.files[0]) }} accept="image/*" />
                                                Browse Image
                                            </label>
                                            </Button> */}
                    </Grid>
                    <Grid
                      item
                      xs={2}
                      sm={2}
                      md={2}
                      key="4"
                      style={{ padding: 5, paddingTop: "25px" }}
                    >
                      {imageUrl !== "" && (
                        <img
                          src={imageUrl}
                          style={{
                            width: "350px",
                            height: "300px",
                            borderRadius: "7px",
                          }}
                          alt=""
                        />
                      )}
                    </Grid>

                    {/* <Grid item xs={4} sm={4} md={4} key="4" style={{ padding: 5 }}>
                                        <TextField
                                            className=""
                                            label="Extra Field"
                                            // name="pincode"
                                            // value={pincode}
                                            // error={pincodeErr.length > 0 ? true : false}
                                            // helperText={pincodeErr}
                                            // onChange={(e) => handleInputChange(e)}
                                            variant="outlined"
                                            required
                                            fullWidth
                                        />
                                    </Grid> */}

                    {/* what in add more button? only extra field will be added or all field will be added? */}
                  </Grid>
                </div>
              )}

              {flag === 2 && (
                <div>
                  <Typography className="p-16 pb-8 text-18 font-700">
                    Slider Images
                  </Typography>

                  <Grid
                    className="department-main-dv p-16"
                    container
                    spacing={4}
                    alignItems="stretch"
                    style={{ margin: 0 }}
                  >
                    {/* {imageUploadFile.map((row, index) => ( */}

                    <Grid
                      container={true}
                      item
                      xs={3}
                      sm={3}
                      md={3}
                      style={{ padding: 0 }}
                    >
                      <Grid item xs={6} sm={6} md={6} style={{ padding: 0 }}>
                        <Button
                          id="btn-save"
                          variant="contained"
                          color="primary"
                          style={{
                            backgroundColor: "#283428",
                            color: "white",
                            width: "100%",
                          }}
                          // className="w-224 mx-auto "
                          onClick={handleClick}
                        >
                          Browse Image
                        </Button>

                        <input
                          type="file"
                          // id="fileinput"
                          ref={hiddenFileInput}
                          onChange={(event) => {
                            setImages(event.target.files[0]);
                          }}
                          accept="image/*"
                          style={{ display: "none" }}
                        />

                        {imageUrl !== "" && (
                          <img
                            src={imageUrl}
                            style={{ minWidth: "530px", borderRadius: "7px" }}
                            className="mt-16"
                            alt=""
                          />
                        )}
                        {/* onClick={() => { setModalView(true); setDisplayImage(image_file[0].image_file) }}  */}
                      </Grid>
                    </Grid>
                    {/* ))} */}
                  </Grid>
                </div>
              )}

              {flag === 3 && (
                <div>
                  <Typography className="p-16 pb-8 text-18 font-700">
                    Brand Banners
                  </Typography>
                  <Grid
                    className="department-main-dv p-16"
                    container
                    spacing={4}
                    alignItems="stretch"
                    style={{ margin: 0 }}
                  >
                    <Grid
                      container={true}
                      item
                      xs={3}
                      sm={3}
                      md={3}
                      style={{ padding: 0 }}
                    >
                      <label className="pl-3 pb-2">Category name</label>
                      <Select
                        className={clsx(
                          classes.selectBox,
                          "ml-2",
                          "purchase-select-dv selectsales-dv"
                        )}
                        filterOption={createFilter({
                          ignoreAccents: false,
                        })}
                        // className={clsx(classes.selectBox, "ml-2")}
                        // classes={classes}
                        // className="ml-2"
                        styles={selectStyles}
                        options={productCategory.map((suggestion) => ({
                          value: suggestion.id,
                          label: suggestion.category_name,
                        }))}
                        // components={components}
                        value={selectedProdCat}
                        onChange={(e) => {
                          handleCategoryChange(e);
                        }}
                        placeholder="Category name"
                        // isDisabled={isView}
                      />
                      <span style={{ color: "red" }}>
                        {prodCatErr.length > 0 ? prodCatErr : ""}
                      </span>
                    </Grid>
                  </Grid>

                  <Grid
                    className="department-main-dv p-16"
                    container
                    spacing={4}
                    alignItems="stretch"
                    style={{ margin: 0 }}
                  >
                    <Grid
                      container={true}
                      item
                      xs={3}
                      sm={3}
                      md={3}
                      style={{ padding: 0 }}
                    >
                      <Grid item xs={6} sm={6} md={6} style={{ padding: 0 }}>
                        <Button
                          id="btn-save"
                          variant="contained"
                          color="primary"
                          style={{
                            backgroundColor: "#283428",
                            color: "white",
                            width: "100%",
                          }}
                          // className="w-224 mx-auto "
                          onClick={handleClick}
                        >
                          Browse Image
                        </Button>

                        <input
                          type="file"
                          // id="fileinput"
                          ref={hiddenFileInput}
                          onChange={(event) => {
                            setImages(event.target.files[0]);
                          }}
                          accept="image/*"
                          style={{ display: "none" }}
                        />

                        {imageUrl !== "" && (
                          <img
                            src={imageUrl}
                            style={{ minWidth: "530px", borderRadius: "7px" }}
                            className="mt-16"
                            alt=""
                          />
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </div>
              )}

              <div className="pr-16">
                <Button
                  id="btn-save"
                  variant="contained"
                  style={{ float: "right" }}
                  className="mx-auto mt-16  mr-16"
                  aria-label="Register"
                  // disabled={isView}
                  // type="submit"
                  onClick={(e) => {
                    handleSubmit(e);
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default UpdateBrandings;
