import React, {
    useState,
    useEffect,
    forwardRef,
    useImperativeHandle,
  } from "react";
  import { Button, TextField } from "@material-ui/core";
  import axios from "axios";
  import Config from "app/fuse-configs/Config";
  import { FuseAnimate } from "@fuse";
  import clsx from "clsx";
  import { makeStyles, useTheme } from "@material-ui/core/styles";
  import "react-checkbox-tree/lib/react-checkbox-tree.css";
  import { useDispatch } from "react-redux";
  import * as Actions from "app/store/actions";
  import Select, { createFilter } from "react-select";
  import handleError from "app/main/ErrorComponent/ErrorComponent";
  
  const useStyles = makeStyles((theme) => ({
    root: {},
    form: {
      marginTop: "3%",
      display: "contents",
    },
  }));
  
  // const CompanyDetails = (props) => {
  const CompanyDetails = forwardRef((props, ref) => {
    // The component instance will be extended
    // with whatever you return from the callback passed
    // as the second argument
    useImperativeHandle(ref, () => ({
      checkValidation() {
        // alert("getAlert from Child");
        return compValidation() && emailValidation() && orderPcsValidation();
      },
      getData() {
        return {
          comp: selectedComp,
          email: companyEmail,
          order_pieces: orderPcs,
        };
      },
    }));
  
    const dispatch = useDispatch();
  
    const [companyData, setCompanyData] = useState([]);
    const [selectedComp, setSelectedComp] = useState("");
    const [selectedCompErr, setSelectedCompErr] = useState("");
  
    const [companyEmail, setCompanyEmail] = useState("");
    const [compEmailErr, setCompEmailErr] = useState("");
  
    const [orderPcs, setOrderPcs] = useState("");
    const [orderPcsErr, setOrderPcsErr] = useState("");
  
    const [clientId, setClientId] = useState("");
  
    const theme = useTheme();
  
    const [isView, setIsView] = useState(false);
  
    const selectStyles = {
      input: (base) => ({
        ...base,
        color: theme.palette.text.primary,
        "& input": {
          font: "inherit",
        },
      }),
    };
  
    useEffect(() => {
      setIsView(props.isViewOnly);
      let cliId = props.clientId;
      let companyId = props.companyId;
      let emailId = props.email;
      let order_Pcs = props.ordersPcs;
      if (companyId) {
        setSelectedComp(companyId);
      }
      if (emailId) {
        setCompanyEmail(emailId);
      }
      if (order_Pcs) {
        setOrderPcs(order_Pcs);
      }
      if (cliId !== "") {
        setClientId(cliId);
      }
  
    }, [props]);
  
    useEffect(() => {
      if (clientId) getClientCompanies(clientId);
    }, [clientId]);
  
    function getClientCompanies(id) {
      axios
        .get(Config.getCommonUrl() + "api/client/all/company/" + id)
        .then(function (response) {
          if (response.data.success === true) {
            console.log(response);
            let tempData = response.data.data[0].clientCompanies;

            setCompanyData(tempData);
          }  else {
            dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
          }
        })
        .catch(function (error) {
          // setLoading(false);
          handleError(error, dispatch, { api: "api/client/all/company/" + id });
        });
    }
  
    const classes = useStyles();
  
    function handleInputChange(event) {
  
      const target = event.target;
      const value = target.type === "checkbox" ? target.checked : target.value;
      const name = target.name;
      if (name === "companyEmail") {
        setCompanyEmail(value);
        setCompEmailErr("");
      } else if (name === "orderPcs") {
        setOrderPcs(value);
        setOrderPcsErr("");
      }
    }
  
    function emailValidation() {
      //const Regex = /[a-zA-Z0-9]+[.]?([a-zA-Z0-9]+)?[@][a-z]{3,9}[.][a-z]{2,5}/g;
      const Regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!companyEmail || Regex.test(companyEmail) === false) {
        setCompEmailErr("Enter Valid Email Id");
        return false;
      }
      return true;
    }
  
    function compValidation() {
      if (selectedComp === "") {
        setSelectedCompErr("Please Select Company");
        return false;
      }
      return true;
    }
  
    function orderPcsValidation() {
      const numberRegex = /^[0-9]*$/;
  
      if (!orderPcs || numberRegex.test(orderPcs) === false) {
        setOrderPcsErr("Enter Valid Pieces for Order");
        return false;
      }
      return true;
    }
  
    function handleFormSubmit(ev) {
      ev.preventDefault();
    
    }
  
    function handleCompanyChange(value) {
      setSelectedComp(value);
      setSelectedCompErr("");
    }
  
    return (
      <div className={clsx(classes.root, props.className, "w-full")}>
        <FuseAnimate animation="transition.slideUpIn" delay={200}>
          <div className="flex flex-col md:flex-row container">
            <div className="flex flex-1 flex-col min-w-0">
              <div className="main-div-alll">
                <div>
                  <form
                    name="registerForm"
                    noValidate
                    className="flex flex-col justify-center w-full"
                    onSubmit={handleFormSubmit}
                  >
                    <div className="w-full flex flex-row flex-wrap">
                      <div className="add-textfiled-Tgrid add-textfiled">
                        <p>Company Name</p>
                        <Select
                          className="view_consumablepurchase_dv"
                          filterOption={createFilter({
                            ignoreAccents: false,
                          })}
                          classes={classes}
                          styles={selectStyles}
                          options={companyData.map((suggestion) => ({
                            value: suggestion.id,
                            label: suggestion.company_name,
                            img : suggestion.image_file
                          }))}
                          // components={components}
                          value={selectedComp}
                          onChange={handleCompanyChange}
                          placeholder="Select Company"
                        />
  
                        <span style={{ color: "red" }}>
                          {selectedCompErr.length > 0 ? selectedCompErr : ""}
                        </span>
                      </div>
  
                      <div className="add-textfiled-Tgrid add-textfiled ">
                        <p>Company Email For Orders</p>
                        <TextField
                          className=""
                          placeholder="Company Email For Orders"
                          name="companyEmail"
                          value={companyEmail}
                          error={compEmailErr.length > 0 ? true : false}
                          helperText={compEmailErr}
                          onChange={(e) => handleInputChange(e)}
                          variant="outlined"
                          required
                          fullWidth
                          disabled={isView}
                        />
                      </div>
                      <div className="add-textfiled-Tgrid add-textfiled">
                        <p>Default Order Pieces</p>
                        <TextField
                          className=""
                          placeholder="Default Order Pieces"
                          name="orderPcs"
                          value={orderPcs}
                          error={orderPcsErr.length > 0 ? true : false}
                          helperText={orderPcsErr}
                          onChange={(e) => handleInputChange(e)}
                          variant="outlined"
                          required
                          fullWidth
                          disabled={isView}
                        />
                      </div>

                      <div>
                            <img src={selectedComp.img} style={{ width: "100px", height: "100px" }} />                
                      </div>

                    </div>
                  </form>
                </div>
              </div>
              <div>

                <Button 
                style={{paddingRight:"12px"}}
                id="btn-save"
                  className="mr-20 float-right"
                  aria-label="Register"
                  // disabled={isView}
                  // type="submit"
                  onClick={() => props.changetab()}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </FuseAnimate>
      </div>
    );
  });
  
  export default CompanyDetails;
  