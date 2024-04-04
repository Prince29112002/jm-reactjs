import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import { Button, TextField } from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import Grid from "@material-ui/core/Grid";

import History from "@history";
import Select, { createFilter } from "react-select";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { Icon, IconButton } from "@material-ui/core";
import moment from "moment";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Modal from "@material-ui/core/Modal";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},
  table: {
    // minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
  },
  form: {
    marginTop: "3%",
    display: "contents",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  formControl: {
    marginTop: 25,
    // margin: theme.spacing(3),
  },
  group: {
    margin: theme.spacing(1, 0),
    flexDirection: "row",
  },
  selectBox: {
    // marginTop: 16,
    padding: 8,
    fontSize: "12pt",

    width: "100%",
    // marginLeft: 15,
  },
  linkButton: {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    textDecoration: "underline",
    display: "inline",
    margin: 0,
    padding: 0,
    color: "blue",
  },
  rateFixPaper: {
    position: "absolute",
    width: 600,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    // padding: theme.spacing(4),
    outline: "none",
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

const EditClient = (props) => {
  const idToBeEdited = props.location.state;

  const [modalStyle] = useState(getModalStyle);

  const dispatch = useDispatch();

  const [isViewOnly, setIsViewOnly] = useState(false);

  const [partyName, setPartyName] = useState("");
  const [partyNameErr, setPartyNameErr] = useState("");

  const [partyCode, setPartyCode] = useState("");
  const [partyCodeErr, setPartyCodeErr] = useState("");

  const [partyTypeData, setPartyTypeData] = useState([]);
  const [partyType, setPartyType] = useState("");
  const [partyTypeErr, setPartyTypeErr] = useState("");

  const [registrationType, setRegistrationType] = useState([]);

  const [rateProfData, setRateProfData] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState("");
  const [selectedProfErrTxt, setSelectedProfErrTxt] = useState("");

  const [status, setStatus] = useState("");
  const [statusErr, setStatusErr] = useState("");

  const [countryData, setCountryData] = useState([]);

  const [voucherModalOpen, setvoucherModalOpen] = useState(false);

  const [currentLedgerData, setCurrentLedgerData] = useState([]); // selected Ledger Rate and Date Data popup, modal is out of form array so we need new variable here

  const [partyTypeid, setPartyTypeId] = useState("");
  // const [selectedRateProfId, setSelectedRateProfId] = useState("");

  const [formValues, setFormValues] = useState([]);

  const [contactformValues, setContactFormValues] = useState([
    {
      client_id: "",
      contact_name: "",
      number: "",
      second_number: "",
      email: "",
      birthday: "",
      anniversary: "",
      first_country_id: "",
      second_country_id: "",
      errors: {
        client_id: null,
        contact_name: null,
        number: null,
        second_number: null,
        email: null,
        birthday: null,
        anniversary: null,
        first_country_id: null,
        second_country_id: null,
      },
    },
  ]);

  useEffect(() => {
    NavbarSetting("Master", dispatch);
    //eslint-disable-next-line
  }, []);

  let handleContactChange = (i, e) => {
    let newFormValues = [...contactformValues];
    newFormValues[i][e.target.name] = e.target.value;

    // newFormValues[i].errors[e.target.name] =
    //   e.target.value.length > 0 ? null : [e.target.contact_name] + "required";

    let nm = e.target.name;
    if (nm === "email") {
      let email = e.target.value;
      //const Regex = /[a-zA-Z0-9]+[.]?([a-zA-Z0-9]+)?[@][a-z]{3,9}[.][a-z]{2,5}/g;
      const Regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!email || Regex.test(email) === false) {
        newFormValues[i].errors.email = "Enter Valid Email Id";
      } else {
        newFormValues[i].errors.email = null;
      }
    } else if (nm === "contact_name") {
      const Regex = /^[a-zA-Z\s]*$/;
      let contNm = e.target.value;
      if (!contNm || Regex.test(contNm) === false) {
        newFormValues[i].errors.contact_name = "Enter Valid Name";
      } else {
        newFormValues[i].errors.contact_name = null;
      }
    } else if (nm === "number") {
      if (newFormValues[i].first_country_id) {
        const Regex = /^[0-9]{3,}$/;
        let number = e.target.value;
        if (!number || Regex.test(number) === false) {
          newFormValues[i].errors.number = "Enter Valid Number";
        } else {
          newFormValues[i].errors.number = null;
        }
      } else {
        newFormValues[i].errors.first_country_id = "Select Code";
      }
    } else if (nm === "second_number") {
      if (newFormValues[i].second_country_id) {
        const Regex = /^[0-9]{3,}$/;
        let second_number = e.target.value;
        if (!second_number || Regex.test(second_number) === false) {
          newFormValues[i].errors.second_number = "Enter Valid Number";
        } else {
          newFormValues[i].errors.second_number = null;
        }
      } else {
        newFormValues[i].errors.second_country_id = "Select Code";
      }
    }
    // else if (nm === "birthday" || nm === "anniversary") {
    //   let today = new Date();
    //   today.setHours(0, 0, 0, 0);
    //   let dateVal = new Date(e.target.value);
    //   let minDateVal = new Date("01/01/1900");
    //   if (dateVal <= today && minDateVal < dateVal) {
    //     newFormValues[i].errors[e.target.name] = null;
    //   } else {
    //     newFormValues[i].errors[e.target.name] =
    //       "Enter Valid " + [e.target.name] + " Date";
    //   }
    // }
    setContactFormValues(newFormValues);
  };

  const prevContactIsValid = () => {
    if (contactformValues.length === 0) {
      return true;
    }
    const Regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const numberRegex = /^[0-9]{10}$/;
    const nameRegex = /^[a-zA-Z\s]*$/;
    // if (!email || Regex.test(email) === false) {

    const someEmpty = contactformValues.some((item) => {
      if (item.second_number === "") {
        return (
          item.contact_name === "" ||
          item.number === "" ||
          item.email === "" ||
          item.first_country_id === "" ||
          // item.birthday === "" ||
          // item.anniversary === "" ||
          nameRegex.test(item.contact_name) === false ||
          numberRegex.test(item.number) === false ||
          Regex.test(item.email) === false
          // moment(new Date(item.anniversary)).format("YYYY-MM-DD") <=
          //   moment(new Date(item.birthday)).format("YYYY-MM-DD")
        );
      } else {
        return (
          item.contact_name === "" ||
          item.number === "" ||
          item.second_number === "" ||
          item.email === "" ||
          item.first_country_id === "" ||
          item.second_country_id === "" ||
          // item.birthday === "" ||
          // item.anniversary === "" ||
          nameRegex.test(item.contact_name) === false ||
          numberRegex.test(item.number) === false ||
          numberRegex.test(item.second_number) === false ||
          Regex.test(item.email) === false
          // moment(new Date(item.anniversary)).format("YYYY-MM-DD") <=
          //   moment(new Date(item.birthday)).format("YYYY-MM-DD")
        );
      }
    });

    if (someEmpty) {
      contactformValues.map((item, index) => {
        const allPrev = [...contactformValues];

        let namevalue = contactformValues[index].contact_name;
        if (!namevalue || nameRegex.test(namevalue) === false) {
          allPrev[index].errors.contact_name = "Enter Valid Name";
        } else {
          allPrev[index].errors.contact_name = null;
        }

        let fcode = contactformValues[index].first_country_id;
        if (!fcode) {
          allPrev[index].errors.first_country_id = "Select country code";
        } else {
          allPrev[index].errors.first_country_id = null;
        }

        let number = contactformValues[index].number;
        if (!number || numberRegex.test(number) === false) {
          allPrev[index].errors.number = "Enter Valid Number";
        } else {
          allPrev[index].errors.number = null;
        }

        let second_number = contactformValues[index].second_number;

        if (second_number !== "") {
          let scode = contactformValues[index].second_country_id;
          if (!scode) {
            allPrev[index].errors.second_country_id = "Select country code";
          } else {
            allPrev[index].errors.second_country_id = null;
          }
        } else {
          allPrev[index].errors.second_country_id = null;
        }

        if (second_number !== "") {
          if (!second_number || numberRegex.test(second_number) === false) {
            allPrev[index].errors.second_number = "Enter Valid Number";
          } else {
            allPrev[index].errors.second_number = null;
          }
        } else {
          allPrev[index].errors.second_number = null;
        }

        let email = contactformValues[index].email;
        if (!email || Regex.test(email) === false) {
          allPrev[index].errors.email = "Enter Valid Email !";
        } else {
          allPrev[index].errors.email = null;
        }

        // if (contactformValues[index].birthday === "") {
        //   allPrev[index].errors.birthday = "Required";
        // } else {
        //   allPrev[index].errors.birthday = null;
        // }

        // if (contactformValues[index].anniversary === "") {
        //   allPrev[index].errors.anniversary = "Required";
        // } else {
        //   allPrev[index].errors.anniversary = null;
        // }

        // if (
        //   moment(new Date(contactformValues[index].anniversary)).format(
        //     "YYYY-MM-DD"
        //   ) <=
        //     moment(new Date(contactformValues[index].birthday)).format(
        //       "YYYY-MM-DD"
        //     ) &&
        //   contactformValues[index].anniversary !== ""
        // ) {
        //   allPrev[index].errors.anniversary =
        //     "Aniversary Date Should not be Less than Birth Date";
        // }

        setContactFormValues(allPrev);
        return true;
      });
    }

    return !someEmpty;
  };

  let addContactFormFields = () => {
    if (prevContactIsValid()) {
      setContactFormValues([
        ...contactformValues,
        {
          client_id: "",
          contact_name: "",
          number: "",
          second_number: "",
          email: "",
          birthday: "",
          anniversary: "",
          first_country_id: "",
          second_country_id: "",
          errors: {
            client_id: null,
            contact_name: null,
            number: null,
            second_number: null,
            email: null,
            birthday: null,
            anniversary: null,
            first_country_id: null,
            second_country_id: null,
          },
        },
      ]);
    } else {
    }
  };

  let removeContactFormFields = (i) => {
    let newFormValues = [...contactformValues];
    newFormValues.splice(i, 1);
    setContactFormValues(newFormValues);
  };

  let handleChange = (i, e) => {
    let newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;

    let nm = e.target.name;
    let val = e.target.value;

    if (nm === "pan_number" && val.length > 4) {
      newFormValues[i].firm_type = val.charAt(3);
    }

    if (nm === "state") {
      const removeId =
        e.target[e.target.selectedIndex].getAttribute("data-gst");
      newFormValues[i].gst_state_code = removeId;
    }

    newFormValues[i].errors[nm] =
      e.target.value.length > 0 ? null : [nm] + "required";
    const nameRegex = /^[a-zA-Z\s]*$/;
    const numTextRegex = /^[a-zA-Z0-9 ]+$/;
    const panNumRegex = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
    const GstRegex =
      /^([0][1-9]|[1-2][0-9]|[3][0-7])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/;
    const pincodeRegex = /^(\d{4}|\d{6})$/;
    const numberRegex = /^[0-9]*$/;
    const IFSCRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    // const dateRegex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
    // const rateRegex = /^(100(\.0{1,2})?|[1-9]?\d(\.\d{1,2})?)$/;

    if (nm === "company_name") {
      // let contNm = e.target.value;
      if (!val || nameRegex.test(val) === false) {
        newFormValues[i].errors.company_name = "Enter Valid Company Name";
      } else {
        newFormValues[i].errors.company_name = null;
      }
    } else if (nm === "registration_number") {
      // let contNm = e.target.value;
      if (!val || numTextRegex.test(val) === false) {
        newFormValues[i].errors.registration_number =
          "Enter Valid Registration Number";
      } else {
        newFormValues[i].errors.registration_number = null;
      }
    } else if (nm === "tax_registration_number") {
      // let contNm = e.target.value;
      if (!val || numTextRegex.test(val) === false) {
        newFormValues[i].errors.tax_registration_number =
          "Enter Valid Registration Number";
      } else {
        newFormValues[i].errors.tax_registration_number = null;
      }
    } else if (nm === "pan_number") {
      // let contNm = e.target.value;
      if (!val || panNumRegex.test(val) === false) {
        newFormValues[i].errors.pan_number = "Enter Valid Pan Number";
      } else {
        newFormValues[i].errors.pan_number = null;
      }
    }
    if (nm === "pan_number" && newFormValues[i].gst_number !== "") {
      if (!val || validateFisrstNum(val) === false) {
        newFormValues[i].errors.gst_number = "Enter Valid GST Number";
      } else {
        newFormValues[i].errors.gst_number = null;
      }
    }
    if (nm === "state" && newFormValues[i].gst_number !== "") {
      if (!val || validateFisrstNum(val) === false) {
        newFormValues[i].errors.gst_number = "Enter Valid GST Number";
      } else {
        newFormValues[i].errors.gst_number = null;
      }
    }
    // else if (nm === "firm_type") {
    //   // let contNm = e.target.value;
    //   if (!val || nameRegex.test(val) === false) {
    //     newFormValues[i].errors.firm_type = "Enter Valid Firm Type";
    //   } else {
    //     newFormValues[i].errors.firm_type = null;
    //   }
    // }
    else if (nm === "gst_number") {
      // let contNm = e.target.value;
      if (!val || validateFisrstNum(val) === false) {
        newFormValues[i].errors.gst_number = "Enter Valid GST Number";
      } else {
        newFormValues[i].errors.gst_number = null;
      }
    } else if (nm === "hallmark_number") {
      // let contNm = e.target.value;
      if (!val || numTextRegex.test(val) === false) {
        newFormValues[i].errors.hallmark_number = "Enter Valid Hallmark Number";
      } else {
        newFormValues[i].errors.hallmark_number = null;
      }
    } else if (nm === "pincode") {
      // let contNm = e.target.value;
      if (!val || pincodeRegex.test(val) === false) {
        newFormValues[i].errors.pincode = "Enter Valid Pincode";
      } else {
        newFormValues[i].errors.pincode = null;
      }
    } else if (nm === "bank_name") {
      // let contNm = e.target.value;
      if (!val || nameRegex.test(val) === false) {
        newFormValues[i].errors.bank_name = "Enter Valid Bank Name";
      } else {
        newFormValues[i].errors.bank_name = null;
      }
    } else if (nm === "account_holder_name") {
      // let contNm = e.target.value;
      if (!val || nameRegex.test(val) === false) {
        newFormValues[i].errors.account_holder_name =
          "Enter Valid Account Holder Name";
      } else {
        newFormValues[i].errors.account_holder_name = null;
      }
    } else if (nm === "account_number") {
      // let contNm = e.target.value;
      if (!val || numberRegex.test(val) === false) {
        newFormValues[i].errors.account_number = "Enter Valid Account Number";
      } else {
        newFormValues[i].errors.account_number = null;
      }
    } else if (nm === "ifsc_code") {
      // let contNm = e.target.value;
      if (!val || IFSCRegex.test(val) === false) {
        newFormValues[i].errors.ifsc_code = "Enter Valid IFSC Code";
      } else {
        newFormValues[i].errors.ifsc_code = null;
      }
    } else if (nm === "accountType") {
      // let contNm = e.target.value;
      if (!val || nameRegex.test(val) === false) {
        newFormValues[i].errors.accountType = "Enter Valid Account Type";
      } else {
        newFormValues[i].errors.accountType = null;
      }
    }

    function validateFisrstNum(val) {
      if (
        newFormValues[i].state != "" &&
        newFormValues[i].state != null &&
        newFormValues[i].gst_state_code != "" &&
        newFormValues[i].gst_state_code != null &&
        newFormValues[i].pan_number != "" &&
        newFormValues[i].pan_number != null
      ) {
        const gstCode = `${val[0]}${val[1]}`;
        const panNum = `${val[2]}${val[3]}${val[4]}${val[5]}${val[6]}${val[7]}${val[8]}${val[9]}${val[10]}${val[11]}`;
        if (newFormValues[i].gst_state_code !== gstCode) {
          return false;
        } else if (newFormValues[i].pan_number !== panNum) {
          return false;
        } else if (`${val[13]}` != "Z") {
          return false;
        } else if (val.length !== 15) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    }

    if (nm === "is_indian" && val === "1") {
      newFormValues[i].country = "1";
      newFormValues[i].state = "";
      newFormValues[i].states = [];
      newFormValues[i].city = "";
      newFormValues[i].cities = [];
      getStatedata("1", i);
    } else if (nm === "is_indian" && val === "2") {
      newFormValues[i].country = "";
      newFormValues[i].state = "";
      newFormValues[i].states = [];
      newFormValues[i].city = "";
      newFormValues[i].cities = [];
      getCountrydata();
    }

    if (e.target.name === "country") {
      newFormValues[i].city = "";
      newFormValues[i].cities = [];
      setFormValues(newFormValues);
      getStatedata(e.target.value, i);
    } else if (e.target.name === "state") {
      setFormValues(newFormValues);
      getCitydata(e.target.value, i);
    } else {
      setFormValues(newFormValues);
    }
  };

  const handleChangeseccode = (value) => {
    const newFormValuesArr = [...contactformValues];
    newFormValuesArr[value.index].second_country_id = value;
    newFormValuesArr[value.index].errors.second_country_id = null;
    setContactFormValues(newFormValuesArr);
  };

  const handleChangefirstcode = (value) => {
    const newFormValuesArr = [...contactformValues];
    newFormValuesArr[value.index].first_country_id = value;
    newFormValuesArr[value.index].errors.first_country_id = null;
    setContactFormValues(newFormValuesArr);
  };

  let handleTCSTdSChange = (i, e) => {
    let newFormValues = [...formValues];
    // let nm = e.target.name;
    let val = e.target.value;

    newFormValues[i].is_tds_tcs = val;
    newFormValues[i].errors.is_tds_tcs = null;

    // if (val !== "0") {
    //   // value="1" TCS
    //   // value="2" TDS
    //   newFormValues[i].ledgerMainData = []; //for select option name and id only
    //   newFormValues[i].ledger_id = ""; //selected ledger from option
    //   newFormValues[i].LedgerRateApiData = []; //whole api data
    //   newFormValues[i].setSelectedLedgerData = []; //show all rates popup data
    //   newFormValues[i].change_date = "";
    //   newFormValues[i].rate = "";

    //   getAllLedgerFromAccount(val === "1" ? "tcs" : "tds", newFormValues, i);
    // } else {
    //   newFormValues[i].ledgerMainData = []; //for select option name and id only
    //   newFormValues[i].ledger_id = ""; //selected ledger from option
    //   newFormValues[i].LedgerRateApiData = []; //whole api data
    //   newFormValues[i].setSelectedLedgerData = []; //show all rates popup data
    //   newFormValues[i].change_date = "";
    //   newFormValues[i].rate = "";

    // }
    setFormValues(newFormValues);
  };

  function getAllLedgerFromAccount(val, newFormValues, index) {
    //showing list in popup in main page
    axios
      .get(Config.getCommonUrl() + "api/ledgerMastar/" + val)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          let ledgerPopupData = response.data.data;
          // setLedgerRateApiData(ledgerPopupData);

          newFormValues[index].LedgerRateApiData = ledgerPopupData; //whole api data

          let tempArray = [];
          // let allData = [];

          for (let item of ledgerPopupData) {
            let ledgerNm = item.Ledger.name;
            let LedgerId = item.id;

            //other array for select dropdown name and id only
            tempArray.push({
              name: ledgerNm,
              id: LedgerId,
            });
          }

          // setLedgerMainData(tempArray); //dropdown
          newFormValues[index].ledgerMainData = tempArray; //for select option name and id only
          setFormValues(newFormValues);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, { api: "api/ledgerMastar/" + val });
      });
  }

  useEffect(() => {
    if (formValues.length !== 0) {
      //when user add new company then we have to call states with id 1 for india
      if (formValues[formValues.length - 1].states !== undefined) {
        if (formValues[formValues.length - 1].states.length === 0) {
          getStatedata("1", formValues.length - 1);
        }
      }
    }
    //eslint-disable-next-line
  }, [formValues.length]);

  let addFormFields = () => {
    if (prevCompaniesIsValid()) {
      setFormValues([
        ...formValues,
        {
          // id: "",
          // client_id: "",
          is_indian: "1",
          company_name: "",
          registration_number: "",
          tax_registration_number: "",
          pan_number: "",
          firm_type: "",
          registration_type_id: "",
          gst_state_code: "",
          gst_number: "",
          hallmark_number: "",
          is_tds_tcs: "",
          address: "",
          country: "1",
          state: "",
          states: [],
          city: "",
          cities: [],
          pincode: "",
          bank_name: "",
          account_holder_name: "",
          account_number: "",
          ifsc_code: "",
          accountType: "",
          status: "",
          image_file: "",
          // ledgerMainData: [], //for select option name and id only
          // ledger_id: "", //selected ledger from option
          // LedgerRateApiData: [], //whole api data
          // setSelectedLedgerData: [], //show all rates popup data
          // change_date: "",
          // rate: "",
          errors: {
            // id: null,
            // client_id: null,
            is_indian: null,
            company_name: null,
            registration_number: null,
            tax_registration_number: null,
            pan_number: null,
            firm_type: null,
            registration_type_id: null,
            gst_state_code: null,
            gst_number: null,
            hallmark_number: null,
            is_tds_tcs: null,
            address: null,
            country: null,
            state: null,
            states: null,
            city: null,
            cities: null,
            pincode: null,
            bank_name: null,
            account_holder_name: null,
            account_number: null,
            ifsc_code: null,
            accountType: null,
            status: null,
            image_file: null,
            // ledger_id: null,
            // change_date: null,
            // rate: null,
          },
        },
      ]);
    }
  };

  const prevCompaniesIsValid = () => {
    if (formValues.length === 0) {
      return true;
    }

    const nameRegex = /^[a-zA-Z\s]*$/;
    const numTextRegex = /^[a-zA-Z0-9 ]+$/;
    const panNumRegex = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
    const GstRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    const pincodeRegex = /^(\d{4}|\d{6})$/;
    const numberRegex = /^[0-9]*$/;
    const IFSCRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    const dateRegex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
    const rateRegex = /^(100(\.0{1,2})?|[1-9]?\d(\.\d{1,2})?)$/;

    const someEmpty = formValues.some((item) => {
      if (item.is_indian.toString() === "1") {
        return (
          item.pan_number === "" ||
          panNumRegex.test(item.pan_number) === false ||
          item.registration_type_id === "" ||
          item.gst_state_code === "" ||
          item.gst_number === "" ||
          GstRegex.test(item.gst_number) === false ||
          item.hallmark_number === "" ||
          numTextRegex.test(item.hallmark_number) === false ||
          item.is_tds_tcs === "" ||
          item.company_name === "" ||
          nameRegex.test(item.company_name) === false ||
          item.address === "" ||
          item.state === "" ||
          item.city === "" ||
          item.pincode === "" ||
          pincodeRegex.test(item.pincode) === false ||
          item.bank_name === "" ||
          nameRegex.test(item.bank_name) === false ||
          item.account_holder_name === "" ||
          nameRegex.test(item.account_holder_name) === false ||
          item.account_number === "" ||
          numberRegex.test(item.account_number) === false ||
          item.ifsc_code === "" ||
          IFSCRegex.test(item.ifsc_code) === false ||
          item.accountType === "" ||
          nameRegex.test(item.accountType) === false
        );
      } else {
        return (
          item.registration_number === "" ||
          numTextRegex.test(item.registration_number) === false ||
          item.tax_registration_number === "" ||
          numTextRegex.test(item.tax_registration_number) === false ||
          item.country === "" ||
          item.company_name === "" ||
          nameRegex.test(item.company_name) === false ||
          item.address === "" ||
          item.state === "" ||
          item.city === "" ||
          item.pincode === "" ||
          pincodeRegex.test(item.pincode) === false ||
          item.bank_name === "" ||
          nameRegex.test(item.bank_name) === false ||
          item.account_holder_name === "" ||
          nameRegex.test(item.account_holder_name) === false ||
          item.account_number === "" ||
          numberRegex.test(item.account_number) === false ||
          item.ifsc_code === "" ||
          IFSCRegex.test(item.ifsc_code) === false ||
          item.accountType === "" ||
          nameRegex.test(item.accountType) === false
        );
      }
    });

    if (someEmpty) {
      formValues.map((item, index) => {
        const allPrev = [...formValues];

        if (formValues[index].is_indian === "") {
          allPrev[index].errors.is_indian = "Required";
        } else {
          allPrev[index].errors.is_indian = null;
        }

        let namevalue = formValues[index].company_name;
        if (!namevalue || nameRegex.test(namevalue) === false) {
          allPrev[index].errors.company_name = "Enter Valid Company Name";
        } else {
          allPrev[index].errors.company_name = null;
        }

        if (formValues[index].address === "") {
          allPrev[index].errors.address = "Required";
        } else {
          allPrev[index].errors.address = null;
        }

        if (formValues[index].country === "") {
          allPrev[index].errors.country = "Required";
        } else {
          allPrev[index].errors.country = null;
        }

        if (formValues[index].state === "") {
          allPrev[index].errors.state = "Required";
        } else {
          allPrev[index].errors.state = null;
        }

        if (formValues[index].city === "") {
          allPrev[index].errors.city = "Required";
        } else {
          allPrev[index].errors.city = null;
        }

        let pincode = formValues[index].pincode;
        if (!pincode || pincodeRegex.test(pincode) === false) {
          allPrev[index].errors.pincode = "Enter Valid Pincode";
        } else {
          allPrev[index].errors.pincode = null;
        }

        let bankNm = formValues[index].bank_name;
        if (!bankNm || nameRegex.test(bankNm) === false) {
          allPrev[index].errors.bank_name = "Enter Valid Bank Name";
        } else {
          allPrev[index].errors.bank_name = null;
        }

        let bankholderNm = formValues[index].account_holder_name;
        if (!bankholderNm || nameRegex.test(bankholderNm) === false) {
          allPrev[index].errors.account_holder_name =
            "Enter Valid Account Holder Name";
        } else {
          allPrev[index].errors.account_holder_name = null;
        }

        let account_number = formValues[index].account_number;
        if (!account_number || numberRegex.test(account_number) === false) {
          allPrev[index].errors.account_number = "Enter Valid Account Number";
        } else {
          allPrev[index].errors.account_number = null;
        }

        let ifsc_code = formValues[index].ifsc_code;

        if (!ifsc_code || IFSCRegex.test(ifsc_code) === false) {
          allPrev[index].errors.ifsc_code = "Enter Valid IFSC Code";
        } else {
          allPrev[index].errors.ifsc_code = null;
        }

        let accountType = formValues[index].accountType;
        if (!accountType || nameRegex.test(accountType) === false) {
          allPrev[index].errors.accountType = "Enter Valid Account Type";
        } else {
          allPrev[index].errors.accountType = null;
        }

        if (formValues[index].is_indian.toString() === "1") {
          let pan_number = formValues[index].pan_number;
          if (!pan_number || panNumRegex.test(pan_number) === false) {
            allPrev[index].errors.pan_number = "Enter Valid Pan Number";
          } else {
            allPrev[index].errors.pan_number = null;
          }

          if (formValues[index].registration_type_id === "") {
            allPrev[index].errors.registration_type_id = "Required";
          } else {
            allPrev[index].errors.registration_type_id = null;
          }

          if (formValues[index].gst_state_code === "") {
            allPrev[index].errors.gst_state_code = "Required";
          } else {
            allPrev[index].errors.gst_state_code = null;
          }

          let gstNum = formValues[index].gst_number;
          if (!gstNum || GstRegex.test(gstNum) === false) {
            allPrev[index].errors.gst_number = "Enter Valid GST Number";
          } else {
            allPrev[index].errors.gst_number = null;
          }

          let hallmark_number = formValues[index].hallmark_number;

          if (
            !hallmark_number ||
            numTextRegex.test(hallmark_number) === false
          ) {
            allPrev[index].errors.hallmark_number =
              "Enter Valid Hallmark Number";
          } else {
            allPrev[index].errors.hallmark_number = null;
          }

          if (formValues[index].is_tds_tcs === "") {
            allPrev[index].errors.is_tds_tcs = "Required";
          } else {
            allPrev[index].errors.is_tds_tcs = null;
          }

          // if (formValues[index].is_tds_tcs !== "0") {
          //   if (
          //     formValues[index].ledger_id === "" ||
          //     formValues[index].ledger_id === null
          //   ) {
          //     allPrev[index].errors.ledger_id = "Required";
          //   } else {
          //     allPrev[index].errors.ledger_id = null;
          //   }

          //   let dataVal = formValues[index].change_date;
          //   if (!dataVal || dateRegex.test(dataVal) === false) {
          //     allPrev[index].errors.change_date = "Enter Valid Change Date";
          //   } else {
          //     allPrev[index].errors.change_date = null;
          //   }

          //   let rateVal = formValues[index].rate;
          //   if (!rateVal || rateRegex.test(rateVal) === false) {
          //     allPrev[index].errors.rate = "Enter Valid Rate";
          //   } else {
          //     allPrev[index].errors.rate = null;
          //   }
          // } else {
          //   allPrev[index].errors.ledger_id = null;

          //   allPrev[index].errors.change_date = null;

          //   allPrev[index].errors.rate = null;
          // }
        } else if (formValues[index].is_indian === "2") {
          let regiNum = formValues[index].registration_number;
          if (!regiNum || numTextRegex.test(regiNum) === false) {
            allPrev[index].errors.registration_number =
              "Enter Valid Registration Number";
          } else {
            allPrev[index].errors.registration_number = null;
          }

          let taxNum = formValues[index].tax_registration_number;
          if (!taxNum || numTextRegex.test(taxNum) === false) {
            allPrev[index].errors.tax_registration_number =
              "Enter Valid Registration Number";
          } else {
            allPrev[index].errors.tax_registration_number = null;
          }
        }
        setFormValues(allPrev);
        return null;
      });
    }

    return !someEmpty;
  };

  let removeFormFields = (i) => {
    let newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
    // setFormLength(newFormValues.length);
  };

  // let handleSubmit = (event) => {
  //   event.preventDefault();
  //   alert(JSON.stringify(formValues));
  // };

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

  function handleChangePartyType(value) {
    setPartyType(value);
    setPartyTypeErr("");
  }

  function handleProfileChange(value) {
    setSelectedProfile(value);
    setSelectedProfErrTxt("");
  }
  const handleImagechange = (i, e) => {
    let newFormValues = [...formValues];
    newFormValues[i].image_file = URL.createObjectURL(e.target.files[0]);
    newFormValues[i].image_url = e.target.files;
    setFormValues(newFormValues);
  };

  const classes = useStyles();

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name === "partyName") {
      setPartyName(value);
      setPartyNameErr("");
    } else if (name === "partyCode") {
      setPartyCodeErr("");
      setPartyCode(value);
    }
    // else if (name === "contact") {
    //   setPhoneNo(value);
    //   setPhoneNoErr("");
    // } else if (name === "email") {
    //   setEmailErrTxt("");
    //   setEmail(value);
    // } else if (name === "birthDt") {
    //   setBirthDt(value);
    //   setBirthDtErr("");
    // } else if (name === "aniversary") {
    //   setAniversaryDt(value);
    //   setAniversaryDtErr("");
    // }
  }

  function partyNmValidation() {
    var Regex = /^[a-zA-Z0-9 ]+$/;
    if (!partyName || Regex.test(partyName) === false) {
      setPartyNameErr("Enter Valid Party Name");
      return false;
    }
    return true;
  }

  function partyCodeValidation() {
    var Regex = /^[a-zA-Z0-9 ]+$/;
    if (!partyCode || Regex.test(partyCode) === false) {
      setPartyCodeErr("Enter Valid Party Code");
      return false;
    }
    return true;
  }

  function partyTypeValidation() {
    if (partyType === "") {
      setPartyTypeErr("Please select party type");
      return false;
    }
    return true;
  }

  function statusValidation() {
    if (status === "") {
      setStatusErr("Please select Valid status");
      return false;
    }
    return true;
  }

  function rateProfValidation() {
    if (selectedProfile === "") {
      setSelectedProfErrTxt("Please Select Valid Rate Profile");
      return false;
    }

    return true;
  }

  function handleFormSubmit() {
    // ev.preventDefault();
    // resetForm();

    if (
      partyNmValidation() &&
      partyCodeValidation() &&
      partyTypeValidation() &&
      statusValidation() &&
      rateProfValidation()
    ) {
      if (prevContactIsValid()) {
        if (prevCompaniesIsValid()) {
          callEditClientApi();
        }
      }
    }
  }

  function callEditClientApi() {
    const formData = new FormData();

    for (let i = 0; i < formValues.length; i++) {
      if (
        formValues[i].image_url &&
        formValues[i].image_url !== null &&
        formValues[i].image_url !== ""
      ) {
        formData.append("files", formValues[i].image_url[0]);
      }
    }

    let companies = formValues.map((x) => {
      if (x.is_indian.toString() === "1") {
        return {
          // process_id: x.value,
          id: x.id,
          image_file: x.image_url ? x.image_url[0].name : x.image_file,
          client_id: x.client_id,
          is_indian: x.is_indian,
          company_name: x.company_name,
          pan_number: x.pan_number,
          firm_type: x.firm_type,
          registration_type_id: x.registration_type_id,
          gst_state_code: x.gst_state_code,
          gst_number: x.gst_number,
          hallmark_number: x.hallmark_number,
          is_tds_tcs: x.is_tds_tcs,
          address: x.address,
          country: x.country,
          state: x.state,
          city: x.city,
          pincode: x.pincode,
          bank_name: x.bank_name,
          account_holder_name: x.account_holder_name,
          account_number: x.account_number,
          ifsc_code: x.ifsc_code,
          accountType: x.accountType,
          status: x.status,
          // ledger_id: x.ledger_id.value,
        };
      } else {
        return {
          tax_registration_number: x.tax_registration_number,
          registration_number: x.registration_number,
          id: x.id,
          image_file: x.image_url ? x.image_url[0].name : x.image_file,
          client_id: x.client_id,
          is_indian: x.is_indian,
          company_name: x.company_name,
          // pan_number: x.pan_number,
          // firm_type: x.firm_type,
          // registration_type_id: x.registration_type_id,
          // gst_state_code: x.gst_state_code,
          // gst_number: x.gst_number,
          // hallmark_number: x.hallmark_number,
          // is_tds_tcs: x.is_tds_tcs,
          address: x.address,
          country: x.country,
          state: x.state,
          city: x.city,
          pincode: x.pincode,
          bank_name: x.bank_name,
          account_holder_name: x.account_holder_name,
          account_number: x.account_number,
          ifsc_code: x.ifsc_code,
          accountType: x.accountType,
          status: x.status,
          // ledger_id: null,
        };
      }
    });

    let contacts = contactformValues.map((x) => {
      return {
        // process_id: x.value,
        id: x.id,
        contact_name: x.contact_name,
        number: x.number,
        second_number: x.second_number,
        email: x.email,
        first_country_id: x.first_country_id.value,
        second_country_id: x.second_country_id.value,
        // birthday: x.birthday,
        ...(x.birthday != "" && {
          birthday: x.birthday,
        }),
        // anniversary: x.anniversary,
        ...(x.anniversary != "" && {
          anniversary: x.anniversary,
        }),
      };
    });
    formData.append("name", partyName);
    formData.append("code", partyCode);
    formData.append("type_id", partyType.value);
    formData.append("status", status);
    formData.append("rate_profile_id", selectedProfile.value);
    formData.append("clientContacts", JSON.stringify(contacts));
    formData.append("clientCompanies", JSON.stringify(companies));
    axios
      .put(
        Config.getCommonUrl() + "api/client/update/" + idToBeEdited.row.id,
        formData
      )
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          // response.data.data.id

          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          // History.push("/dashboard/masters/clients");
          History.goBack();
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
          api: "api/client/update/" + idToBeEdited.row.id,
          body: formData,
        });
      });
  }

  function handleChangeStatus(event) {
    setStatus(event.target.value);
    setStatusErr("");
  }

  useEffect(() => {
    return () => {
      console.log("cleaned up");
    };
  }, []);

  useEffect(() => {
    if (idToBeEdited !== undefined) {
      setIsViewOnly(idToBeEdited.isViewOnly);
      GetOneClient();
      getRateProfileData();
    }
    //eslint-disable-next-line
  }, []);

  // This is for counter state variable
  React.useEffect(() => {
    // if (counter > 9) {
    // clearInterval(s);
    getPartyType();
    // }
    //eslint-disable-next-line
  }, [partyTypeid]);

  // React.useEffect(() => {
  //   getRateProfileData();
  //   //eslint-disable-next-line
  // }, [selectedRateProfId]);

  React.useEffect(() => {
    //is_indian 1- indian, 2- non indian
    //if indian then while adding company it will be one so no need to add conditions here
    for (let i = 0; i < formValues.length; i++) {
      getStatedata(formValues[i].country, i);
      getCitydata(formValues[i].state, i);

      let is_tds_tcs = formValues[i].is_tds_tcs.toString();
      if (is_tds_tcs !== "0") {
        getAllLedgerFromAccountforLoop(is_tds_tcs === "1" ? "tcs" : "tds", i);
      }
      // }
    }
  }, [countryData]);

  function getAllLedgerFromAccountforLoop(val, index) {
    //showing list in popup in main page
    axios
      .get(Config.getCommonUrl() + "api/ledgerMastar/" + val)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          let ledgerPopupData = response.data.data;
          let newFormValues = [...formValues];
          newFormValues[index].LedgerRateApiData = ledgerPopupData; //whole api data

          let tempArray = [];

          for (let item of ledgerPopupData) {
            let ledgerNm = item.Ledger.name;
            let LedgerId = item.id;

            tempArray.push({
              name: ledgerNm,
              id: LedgerId,
            });
          }

          newFormValues[index].ledgerMainData = tempArray; //for select option name and id only

          let ledger_id = newFormValues[index].ledger_id;

          if (ledger_id !== null && ledger_id !== undefined) {
            const findIndex = newFormValues[index].ledgerMainData.findIndex(
              (a) => a.id === ledger_id
            );

            if (findIndex !== -1) {
              newFormValues[index].setSelectedLedgerData =
                newFormValues[index].LedgerRateApiData[findIndex].LedgerRate;
              // setSelectedLedgerData(ledgerRateApiData[findIndex].LedgerRate); // popup data here should be update on selected from drop down

              newFormValues[index].ledger_id = {
                value: ledger_id,
                label: tempArray[findIndex].name,
              }; //selected option

              function findClosestPrevDate(arr, target) {
                let targetDate = new Date(target);
                let previousDates = arr.filter(
                  (e) => targetDate - new Date(e.change_date) >= 0
                );

                if (previousDates.length === 1) {
                  return previousDates[0];
                }

                let sortedPreviousDates = previousDates.sort(
                  (a, b) =>
                    Date.parse(b.change_date) - Date.parse(a.change_date)
                );

                return sortedPreviousDates[0] || null;
              }

              let r1 = findClosestPrevDate(
                newFormValues[index].LedgerRateApiData[findIndex].LedgerRate,
                moment().format("YYYY-MM-DD")
              );

              newFormValues[index].change_date = r1.change_date;
              newFormValues[index].rate = r1.rate;

              setFormValues(newFormValues);
            }
          }
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, { api: "api/ledgerMastar/" + val });
      });
  }

  function GetOneClient() {
    axios
      .get(
        Config.getCommonUrl() +
          "api/client/readOneClient/" +
          idToBeEdited.row.id
      )
      .then(function (response) {
        if (response.data.success === true) {
          var data = response.data.data;
          setPartyName(data.name);
          setPartyCode(data.code);

          const findIndex = partyTypeData.findIndex(
            (a) => a.value === data.type_id
          );

          if (findIndex !== -1) {
            setPartyType({
              value: data.type_id,
              label: partyTypeData[findIndex].label,
            });
          } else {
            setPartyTypeId(data.type_id);
          }

          let tempContacts = data.clientContacts;
          //adding error  object
          let newTemp = [];
          tempContacts.map((item) => {
            newTemp.push({
              ...item,
              first_country_id: item.number
                ? {
                    value: item.first_country_id,
                    label: `${item.first_country_name} (${item.first_country_code})`,
                  }
                : "",
              second_country_id: item.second_number
                ? {
                    value: item.second_country_id,
                    label: `${item.second_country_name} (${item.second_country_code})`,
                  }
                : "",
              errors: {
                contact_name: null,
                number: null,
                second_number: null,
                email: null,
                birthday: null,
                anniversary: null,
              },
            });
          });

          setContactFormValues(newTemp);
          let tempcompanies = data.clientCompanies;
          let tempComp = tempcompanies.map((item) => {
            return {
              ...item,
              states: [],
              cities: [],

              errors: {
                id: null,
                client_id: null,
                is_indian: null,
                company_name: null,
                registration_number: null,
                tax_registration_number: null,
                pan_number: null,
                firm_type: null,
                registration_type_id: null,
                gst_state_code: null,
                gst_number: null,
                hallmark_number: null,
                is_tds_tcs: null,
                address: null,
                country: null,
                state: null,
                states: null,
                city: null,
                cities: null,
                pincode: null,
                bank_name: null,
                account_holder_name: null,
                account_number: null,
                ifsc_code: null,
                accountType: null,
                status: null,
                // ledger_id: null,
                // change_date: null,
                // rate: null,
              },
            };
          });
          setFormValues(tempComp);

          setStatus(data.status); // 0 means deactive 1 means active
          getRegistrationType();
          // getStatedata();
          getCountrydata();

          setSelectedProfile({
            value: data.SalesRateProfile.id,
            label: data.SalesRateProfile.profile_name,
          });
          // setSelectedRateProfId(data.rate_profile_id);
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
          api: "api/client/readOneClient/" + idToBeEdited.row.id,
        });
      });
  }

  function getPartyType() {
    axios
      .get(Config.getCommonUrl() + "api/client/typelist")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          // setPartyTypeData(response.data.data);

          const key = Object.values(response.data.data);
          const values = Object.keys(response.data.data);

          let temp = [];

          for (let i = 0; i < values.length; i++) {
            temp.push({
              value: values[i],
              label: key[i],
            });
          }
          setPartyTypeData(temp);

          const findIndex = values.findIndex(
            (a) => a === partyTypeid.toString()
          );

          if (findIndex !== -1) {
            setPartyType({
              value: partyTypeid,
              label: key[findIndex],
            });
          }
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
        handleError(error, dispatch, { api: "api/client/typelist" });
      });
  }

  function getRateProfileData() {
    axios
      .get(Config.getCommonUrl() + "api/salesRateProfile")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setRateProfData(response.data.data);
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
        handleError(error, dispatch, { api: "api/salesRateProfile" });
      });
  }

  function getRegistrationType() {
    axios
      .get(Config.getCommonUrl() + "api/client/registertypelist")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          // setPartyTypeData(response.data.data);

          const key = Object.keys(response.data.data);
          const values = Object.values(response.data.data);

          let temp = [];

          for (let i = 0; i < values.length; i++) {
            temp.push({
              value: values[i],
              label: key[i],
            });
          }
          setRegistrationType(temp);
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
        handleError(error, dispatch, { api: "api/client/registertypelist" });
      });
  }

  function getCountrydata() {
    axios
      .get(Config.getCommonUrl() + "api/country")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setCountryData(response.data.data);
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
        handleError(error, dispatch, { api: "api/country" });
      });
  }

  function getStatedata(countyId, i) {
    if (countyId !== "" && countyId !== undefined && countyId !== null) {
      axios
        .get(Config.getCommonUrl() + "api/country/state/" + countyId)
        .then(function (response) {
          if (response.data.success === true) {
            console.log(response);
            // setStateData(response.data.data);
            let newFormValues = [...formValues];
            newFormValues[i]["states"] = response.data.data;
            setFormValues(newFormValues);
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
            api: "api/country/state/" + countyId,
          });
        });
    }
  }

  function getCitydata(stateID, i) {
    if (stateID !== "") {
      axios
        .get(Config.getCommonUrl() + "api/country/city/" + stateID)
        .then(function (response) {
          if (response.data.success === true) {
            console.log(response);
            // setCityData([...cityData, response.data.data]);

            let newFormValues = [...formValues];
            newFormValues[i]["cities"] = response.data.data;
            setFormValues(newFormValues);
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
          handleError(error, dispatch, { api: "api/country/city/" + stateID });
        });
    }
  }

  function checkRate(e, index) {
    e.preventDefault();
    setCurrentLedgerData(formValues[index].setSelectedLedgerData);
    setvoucherModalOpen(true);
  }

  function handleVoucherModalClose() {
    setvoucherModalOpen(false);
  }

  let handleLedgerChange = (index) => (option) => {
    let newFormValues = [...formValues];
    newFormValues[index].ledger_id = option;
    newFormValues[index].errors.ledger_id = null;
    newFormValues[index].errors.change_date = null;
    newFormValues[index].errors.rate = null;

    let ledger_id = option.value;

    if (ledger_id !== null && ledger_id !== undefined) {
      const findIndex = newFormValues[index].ledgerMainData.findIndex(
        (a) => a.id === ledger_id
      );

      if (findIndex !== -1) {
        newFormValues[index].setSelectedLedgerData =
          newFormValues[index].LedgerRateApiData[findIndex].LedgerRate;

        function findClosestPrevDate(arr, target) {
          let targetDate = new Date(target);
          let previousDates = arr.filter(
            (e) => targetDate - new Date(e.change_date) >= 0
          );

          if (previousDates.length === 1) {
            return previousDates[0];
          }

          let sortedPreviousDates = previousDates.sort(
            (a, b) => Date.parse(b.change_date) - Date.parse(a.change_date)
          );

          return sortedPreviousDates[0] || null;
        }

        let r1 = findClosestPrevDate(
          newFormValues[index].LedgerRateApiData[findIndex].LedgerRate,
          moment().format("YYYY-MM-DD")
        );

        newFormValues[index].change_date = r1.change_date;
        newFormValues[index].rate = r1.rate;

        setFormValues(newFormValues);
      }
    }
  };

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20 ">
            <Grid
              className="department-main-dv "
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={6} sm={5} md={5} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    {isViewOnly ? "View Client/Party" : "Edit Client/Party"}
                  </Typography>
                </FuseAnimate>

                {/* {!isViewOnly && <BreadcrumbsHelper />} */}
              </Grid>

              <Grid item xs={6} sm={7} md={7} key="2">
                <div className="btn-back">
                  {" "}
                  <img src={Icones.arrow_left_pagination} alt="" />
                  <Button
                    id="btn-back"
                    className=""
                    size="small"
                    onClick={(event) => {
                      // History.push("/dashboard/masters/clients");
                      History.goBack();
                      //   setDefaultView(btndata.id);
                      //   setIsEdit(false);
                    }}
                  >
                    Back
                  </Button>
                </div>
              </Grid>
            </Grid>

            <div className="main-div-alll ">
              {/* {JSON.stringify(contDetails)} */}
              <div>
                <form
                  name="registerForm"
                  noValidate
                  // onSubmit={handleFormSubmit}
                >
                  <h4 className="mb-5">Client/Party Details</h4>
                  <div className="add-client-row flex flex-row flex-wrap">
                    <div className="add-textfiled">
                      <p>Party name*</p>
                      <TextField
                        className=""
                        placeholder="Enter Party Name"
                        autoFocus
                        name="partyName"
                        value={partyName}
                        error={partyNameErr.length > 0 ? true : false}
                        helperText={partyNameErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={isViewOnly}
                      />
                    </div>
                    <div className="add-textfiled">
                      <p>Party code*</p>
                      <TextField
                        className=""
                        placeholder="Enter Party Code"
                        autoFocus
                        name="partyCode"
                        value={partyCode}
                        error={partyCodeErr.length > 0 ? true : false}
                        helperText={partyCodeErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={isViewOnly}
                      />
                    </div>
                    <div className="add-textfiled">
                      <p>Type (Distributor or Retailer)*</p>
                      <Select
                        // className="mb-16"
                        filterOption={createFilter({ ignoreAccents: false })}
                        classes={classes}
                        styles={selectStyles}
                        options={partyTypeData}
                        // components={components}
                        value={partyType}
                        onChange={handleChangePartyType}
                        placeholder="Type (Distributor or Retailer)"
                        isDisabled={isViewOnly}
                      />
                      <span style={{ color: "red" }}>
                        {partyTypeErr.length > 0 ? partyTypeErr : ""}
                      </span>
                    </div>
                    {contactformValues.map((element, index) => (
                      <>
                        <div className="add-textfiled">
                          <p>Contact person name*</p>
                          <TextField
                            className=""
                            placeholder="Enter Contact Person Name"
                            name="contact_name"
                            value={element.contact_name || ""}
                            disabled={isViewOnly}
                            error={
                              element.errors !== undefined
                                ? element.errors.contact_name
                                  ? true
                                  : false
                                : false
                            }
                            helperText={
                              element.errors !== undefined
                                ? element.errors.contact_name
                                : ""
                            }
                            onChange={(e) => handleContactChange(index, e)}
                            variant="outlined"
                            fullWidth
                          />
                        </div>
                        <div className="add-textfiled">
                          <p>Mobile number*</p>
                          <div style={{ display: "flex" }}>
                            <div style={{ width: "40%" }}>
                              <Select
                                className=""
                                placeholder="Country Code"
                                filterOption={createFilter({
                                  ignoreAccents: false,
                                })}
                                classes={classes}
                                styles={selectStyles}
                                options={countryData.map((suggestion) => ({
                                  value: suggestion.id,
                                  label: `${suggestion.name} (${suggestion.phonecode})`,
                                  index: index,
                                }))}
                                value={element.first_country_id}
                                onChange={handleChangefirstcode}
                                isDisabled={isViewOnly}
                              />
                              <span className={classes.errorMessage}>
                                {element.errors.first_country_id
                                  ? element.errors.first_country_id
                                  : ""}
                              </span>
                            </div>
                            <div style={{ width: "60%" }}>
                              <TextField
                                className=""
                                placeholder="Enter Mobile"
                                name="number"
                                disabled={isViewOnly}
                                value={element.number || ""}
                                error={
                                  element.errors !== undefined
                                    ? element.errors.number
                                      ? true
                                      : false
                                    : false
                                }
                                helperText={
                                  element.errors !== undefined
                                    ? element.errors.number
                                    : ""
                                }
                                onChange={(e) => handleContactChange(index, e)}
                                variant="outlined"
                                fullWidth
                              />
                            </div>
                          </div>
                        </div>

                        <div className="add-textfiled">
                          <p>Phone number</p>
                          <div style={{ display: "flex" }}>
                            <div style={{ width: "40%" }}>
                              <Select
                                className=" input-select-bdr-dv"
                                filterOption={createFilter({
                                  ignoreAccents: false,
                                })}
                                classes={classes}
                                styles={selectStyles}
                                options={countryData.map((suggestion) => ({
                                  value: suggestion.id,
                                  label: `${suggestion.name} (${suggestion.phonecode})`,
                                  index: index,
                                }))}
                                value={element.second_country_id}
                                onChange={handleChangeseccode}
                                isDisabled={isViewOnly}
                              />
                              <span className={classes.errorMessage}>
                                {element.errors.second_country_id
                                  ? element.errors.second_country_id
                                  : ""}
                              </span>
                            </div>

                            <div style={{ width: "60%" }}>
                              <TextField
                                className=""
                                placeholder="Enter Phone"
                                name="second_number"
                                disabled={isViewOnly}
                                value={element.second_number || ""}
                                error={
                                  element.errors !== undefined
                                    ? element.errors.second_number
                                      ? true
                                      : false
                                    : false
                                }
                                helperText={
                                  element.errors !== undefined
                                    ? element.errors.second_number
                                    : ""
                                }
                                onChange={(e) => handleContactChange(index, e)}
                                variant="outlined"
                                fullWidth
                              />
                            </div>
                          </div>
                        </div>

                        <div className="add-textfiled">
                          <p>Email id*</p>
                          <TextField
                            className=""
                            placeholder="Enter Email Id"
                            name="email"
                            disabled={isViewOnly}
                            value={element.email || ""}
                            error={
                              element.errors !== undefined
                                ? element.errors.email
                                  ? true
                                  : false
                                : false
                            }
                            helperText={
                              element.errors !== undefined
                                ? element.errors.email
                                : ""
                            }
                            onChange={(e) => handleContactChange(index, e)}
                            variant="outlined"
                            fullWidth
                          />
                        </div>
                        <div className="add-textfiled">
                          <p>Birth date</p>
                          <TextField
                            className=""
                            placeholder="Enter Birth Date"
                            name="birthday"
                            disabled={isViewOnly}
                            value={element.birthday || ""}
                            type="date"
                            variant="outlined"
                            onKeyDown={(e) => e.preventDefault()}
                            inputProps={{
                              max: moment().format("YYYY-MM-DD"),
                            }}
                            fullWidth
                            error={
                              element.errors !== undefined
                                ? element.errors.birthday
                                  ? true
                                  : false
                                : false
                            }
                            helperText={
                              element.errors !== undefined
                                ? element.errors.birthday
                                : ""
                            }
                            onChange={(e) => handleContactChange(index, e)}
                            format="yyyy/MM/dd"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </div>
                        <div className="add-textfiled">
                          <p>Anniversary date</p>
                          <TextField
                            className=""
                            placeholder="Enter Aniversary Date"
                            name="anniversary"
                            value={element.anniversary || ""}
                            type="date"
                            variant="outlined"
                            onKeyDown={(e) => e.preventDefault()}
                            inputProps={{
                              min: moment(new Date(element.birthday))
                                .add(1, "days")
                                .format("YYYY-MM-DD"),
                            }}
                            fullWidth
                            error={
                              element.errors !== undefined
                                ? element.errors.anniversary
                                  ? true
                                  : false
                                : false
                            }
                            helperText={
                              element.errors !== undefined
                                ? element.errors.anniversary
                                : ""
                            }
                            onChange={(e) => handleContactChange(index, e)}
                            format="yyyy/MM/dd"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </div>

                        <div className="add-textfiled client-but">
                          {!isViewOnly && contactformValues.length !== 1 && (
                            <IconButton
                              onClick={() => removeContactFormFields(index)}
                            >
                              <Icon className="mt-16 delete-icone">
                                <img src={Icones.delete_red} alt="" />
                              </Icon>
                            </IconButton>
                          )}
                        </div>
                      </>
                    ))}

                    <div className="add-textfiled client-but">
                      {!isViewOnly && (
                        <Button
                          variant="contained"
                          id="btn-save"
                          className=" mx-auto mt-16 float-right"
                          type="button"
                          onClick={() => addContactFormFields()}
                        >
                          Add More
                        </Button>
                      )}
                    </div>
                  </div>
                </form>
                <h4 className="mt-5">Company Details</h4>

                {formValues.map((element, index) => (
                  <>
                    <div className="">
                      <FormControl
                        component="fieldset"
                        className={classes.formControl}
                      >
                        <FormLabel component="legend">Country :</FormLabel>
                        <RadioGroup
                          aria-label="country"
                          name="is_indian"
                          className={classes.group}
                          value={element.is_indian.toString() || ""}
                          onChange={(e) => handleChange(index, e)}
                        >
                          <FormControlLabel
                            value="1"
                            control={<Radio />}
                            label="India"
                            disabled={isViewOnly}
                          />
                          <FormControlLabel
                            value="2"
                            control={<Radio />}
                            label="Other"
                            disabled={isViewOnly}
                          />
                        </RadioGroup>
                        <span style={{ color: "red" }}>
                          {element.errors !== undefined
                            ? element.errors.is_indian
                            : ""}
                        </span>
                      </FormControl>
                    </div>
                    <div className="add-client-row flex flex-row flex-wrap">
                      <div className="add-textfiled">
                        <p>Company name</p>
                        <TextField
                          placeholder="Enter Company Name"
                          name="company_name"
                          disabled={isViewOnly}
                          value={element.company_name || ""}
                          error={
                            element.errors !== undefined
                              ? element.errors.company_name
                                ? true
                                : false
                              : false
                          }
                          helperText={
                            element.errors !== undefined
                              ? element.errors.company_name
                              : ""
                          }
                          onChange={(e) => handleChange(index, e)}
                          variant="outlined"
                          fullWidth
                        />
                      </div>
                      {element.is_indian.toString() === "1" && (
                        <>
                          <div className="add-textfiled">
                            <p>Pan no.</p>
                            <TextField
                              placeholder="Enter Pan no."
                              name="pan_number"
                              disabled={isViewOnly}
                              value={element.pan_number || ""}
                              error={
                                element.errors !== undefined
                                  ? element.errors.pan_number
                                    ? true
                                    : false
                                  : false
                              }
                              helperText={
                                element.errors !== undefined
                                  ? element.errors.pan_number
                                  : ""
                              }
                              onChange={(e) => handleChange(index, e)}
                              variant="outlined"
                              fullWidth
                            />
                          </div>
                          <div className="add-textfiled">
                            <p>Firm type</p>
                            <TextField
                              placeholder="Enter Firm Type"
                              name="firm_type"
                              value={element.firm_type || ""}
                              error={
                                element.errors !== undefined
                                  ? element.errors.firm_type
                                    ? true
                                    : false
                                  : false
                              }
                              helperText={
                                element.errors !== undefined
                                  ? element.errors.firm_type
                                  : ""
                              }
                              disabled
                              onChange={(e) => handleChange(index, e)}
                              variant="outlined"
                              fullWidth
                            />
                          </div>
                          <div className="add-textfiled">
                            <p>Registration type</p>
                            <select
                              disabled={isViewOnly}
                              className={classes.selectBox}
                              name="registration_type_id"
                              required
                              value={element.registration_type_id || ""}
                              onChange={(e) => {
                                handleChange(index, e);
                              }}
                            >
                              <option hidden value="">
                                Registration Type
                              </option>
                              {/* <option value="Regular">Regular </option>
                              <option value="Consumer">Consumer </option>
                              <option value="Unregister"> Unregister</option>
                              <option value="Composition">Composition</option>
                               */}
                              {registrationType.map((row) => (
                                <option key={row.value} value={row.value}>
                                  {row.label}
                                </option>
                              ))}
                            </select>

                            <span style={{ color: "red" }}>
                              {element.errors !== undefined
                                ? element.errors.registration_type_id
                                : ""}
                            </span>
                          </div>
                          <div className="add-textfiled">
                            <p>Hallmark BIS LIC no.</p>
                            <TextField
                              placeholder="Enter Hallmark BIS LIC No."
                              name="hallmark_number"
                              value={element.hallmark_number || ""}
                              error={
                                element.errors !== undefined
                                  ? element.errors.hallmark_number
                                    ? true
                                    : false
                                  : false
                              }
                              helperText={
                                element.errors !== undefined
                                  ? element.errors.hallmark_number
                                  : ""
                              }
                              onChange={(e) => handleChange(index, e)}
                              variant="outlined"
                              fullWidth
                              disabled={isViewOnly}
                            />
                          </div>
                          <div className="add-textfiled">
                            <p>TCS/TDS/NA</p>
                            <select
                              disabled={isViewOnly}
                              className={classes.selectBox}
                              name="is_tds_tcs"
                              required
                              value={element.is_tds_tcs.toString() || ""}
                              onChange={(e) => {
                                handleTCSTdSChange(index, e);
                              }}
                            >
                              <option hidden value="">
                                TCS/TDS/NA
                              </option>
                              <option value="1">TCS </option>
                              <option value="2">TDS </option>
                              <option value="0"> NA</option>
                              {/* {dropdownData.map((item) => (
                                  <option key={item.id} value={item.id}>
                                    {item.name}
                                  </option>
                                ))} */}
                            </select>
                            <span style={{ color: "red" }}>
                              {element.errors !== undefined
                                ? element.errors.is_tds_tcs
                                : ""}
                            </span>
                          </div>
                        </>
                      )}
                      {element.is_indian.toString() === "2" && (
                        <>
                          <div className="add-textfiled">
                            <p>Registration Number</p>
                            <TextField
                              placeholder="Enter Registration Number"
                              name="registration_number"
                              value={element.registration_number || ""}
                              error={
                                element.errors !== undefined
                                  ? element.errors.registration_number
                                    ? true
                                    : false
                                  : false
                              }
                              helperText={
                                element.errors !== undefined
                                  ? element.errors.registration_number
                                  : ""
                              }
                              onChange={(e) => handleChange(index, e)}
                              variant="outlined"
                              fullWidth
                              disabled={isViewOnly}
                            />
                          </div>
                          <div className="add-textfiled">
                            <p>Tax Registration Number.</p>
                            <TextField
                              placeholder="Enter Tax Registration Number"
                              name="tax_registration_number"
                              value={element.tax_registration_number || ""}
                              error={
                                element.errors !== undefined
                                  ? element.errors.tax_registration_number
                                    ? true
                                    : false
                                  : false
                              }
                              helperText={
                                element.errors !== undefined
                                  ? element.errors.tax_registration_number
                                  : ""
                              }
                              onChange={(e) => handleChange(index, e)}
                              variant="outlined"
                              fullWidth
                              disabled={isViewOnly}
                            />
                          </div>
                        </>
                      )}

                      {element.is_indian.toString() === "2" && (
                        <div className="add-textfiled">
                          <p>country</p>
                          <select
                            className={classes.selectBox}
                            name="country"
                            disabled={isViewOnly}
                            required
                            value={element.country || ""}
                            onChange={(e) => {
                              handleChange(index, e);
                            }}
                          >
                            <option hidden value="">
                              country
                            </option>
                            {countryData.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                          <span style={{ color: "red" }}>
                            {element.errors !== undefined
                              ? element.errors.country
                              : ""}
                          </span>
                        </div>
                      )}

                      <div className="add-textfiled">
                        <p>State</p>
                        <select
                          className={classes.selectBox}
                          name="state"
                          required
                          disabled={isViewOnly}
                          value={element.state || ""}
                          onChange={(e) => {
                            handleChange(index, e);
                          }}
                        >
                          <option hidden value="">
                            State
                          </option>
                          {element.states !== undefined &&
                            element.states.map((item) => (
                              <option
                                key={item.id}
                                value={item.id}
                                data-gst={item.gst_code}
                              >
                                {item.name}
                              </option>
                            ))}
                          {/* {statedata.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))} */}
                        </select>
                        <span style={{ color: "red" }}>
                          {element.errors !== undefined
                            ? element.errors.state
                            : ""}
                        </span>
                      </div>
                      <div className="add-textfiled">
                        <p>GST state code</p>
                        <TextField
                          placeholder="Enter GST State Code"
                          name="gst_state_code"
                          disabled
                          value={element.gst_state_code || ""}
                          variant="outlined"
                          fullWidth
                        />
                      </div>
                      <div className="add-textfiled">
                        <p>GST number</p>
                        <TextField
                          placeholder="Enter GST Number"
                          name="gst_number"
                          disabled={isViewOnly}
                          value={element.gst_number || ""}
                          error={
                            element.errors !== undefined
                              ? element.errors.gst_number
                                ? true
                                : false
                              : false
                          }
                          helperText={
                            element.errors !== undefined
                              ? element.errors.gst_number
                              : ""
                          }
                          onChange={(e) => handleChange(index, e)}
                          variant="outlined"
                          fullWidth
                        />
                      </div>
                      <div className="add-textfiled">
                        <p>City</p>
                        <select
                          className={classes.selectBox}
                          disabled={isViewOnly}
                          name="city"
                          required
                          value={element.city || ""}
                          onChange={(e) => {
                            handleChange(index, e);
                          }}
                        >
                          <option hidden value="">
                            City
                          </option>
                          {element.cities !== undefined &&
                            element.cities.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                        </select>
                        <span style={{ color: "red" }}>
                          {element.errors !== undefined
                            ? element.errors.city
                            : ""}
                        </span>
                      </div>
                      <div className="add-textfiled">
                        <p>Pincode</p>
                        <TextField
                          placeholder="Enter Pincode"
                          name="pincode"
                          disabled={isViewOnly}
                          value={element.pincode || ""}
                          error={
                            element.errors !== undefined
                              ? element.errors.pincode
                                ? true
                                : false
                              : false
                          }
                          helperText={
                            element.errors !== undefined
                              ? element.errors.pincode
                              : ""
                          }
                          onChange={(e) => handleChange(index, e)}
                          variant="outlined"
                          fullWidth
                        />
                      </div>
                      {element.is_indian.toString() === "2" && (
                        <div className="add-textfiled">
                          <p>Rate profile</p>
                          <Select
                            classes={classes}
                            filterOption={createFilter({
                              ignoreAccents: false,
                            })}
                            styles={selectStyles}
                            options={rateProfData.map((suggestion) => ({
                              value: suggestion.id,
                              label: suggestion.profile_name,
                            }))}
                            // components={components}
                            value={selectedProfile}
                            onChange={handleProfileChange}
                            placeholder="Enter Rate Profile"
                          />

                          <span style={{ color: "red" }}>
                            {selectedProfErrTxt.length > 0
                              ? selectedProfErrTxt
                              : ""}
                          </span>
                        </div>
                      )}
                      <div className="add-textfiled addmaster-textara ">
                        <p>Address*</p>
                        <TextField
                          disabled={isViewOnly}
                          style={{ background: "white" }}
                          placeholder="Enter Address"
                          name="address"
                          value={element.address || ""}
                          error={
                            element.errors !== undefined
                              ? element.errors.address
                                ? true
                                : false
                              : false
                          }
                          helperText={
                            element.errors !== undefined
                              ? element.errors.address
                              : ""
                          }
                          onChange={(e) => handleChange(index, e)}
                          variant="outlined"
                          required
                          fullWidth
                        />
                      </div>
                      <div className="add-textfiled">
                        <p>Bank name</p>
                        <TextField
                          placeholder="Enter Bank Name"
                          name="bank_name"
                          disabled={isViewOnly}
                          value={element.bank_name || ""}
                          error={
                            element.errors !== undefined
                              ? element.errors.bank_name
                                ? true
                                : false
                              : false
                          }
                          helperText={
                            element.errors !== undefined
                              ? element.errors.bank_name
                              : ""
                          }
                          onChange={(e) => handleChange(index, e)}
                          variant="outlined"
                          fullWidth
                        />
                      </div>
                      <div className="add-textfiled">
                        <p>Account holder name</p>
                        <TextField
                          placeholder="Enter Account Holder Name"
                          disabled={isViewOnly}
                          name="account_holder_name"
                          value={element.account_holder_name || ""}
                          error={
                            element.errors !== undefined
                              ? element.errors.account_holder_name
                                ? true
                                : false
                              : false
                          }
                          helperText={
                            element.errors !== undefined
                              ? element.errors.account_holder_name
                              : ""
                          }
                          onChange={(e) => handleChange(index, e)}
                          variant="outlined"
                          fullWidth
                        />
                      </div>
                      <div className="add-textfiled">
                        <p>Account number</p>
                        <TextField
                          placeholder="Enter Account Number"
                          name="account_number"
                          disabled={isViewOnly}
                          value={element.account_number || ""}
                          error={
                            element.errors !== undefined
                              ? element.errors.account_number
                                ? true
                                : false
                              : false
                          }
                          helperText={
                            element.errors !== undefined
                              ? element.errors.account_number
                              : ""
                          }
                          onChange={(e) => handleChange(index, e)}
                          variant="outlined"
                          fullWidth
                        />
                      </div>

                      <div className="add-textfiled">
                        <p>IFSC code</p>
                        <TextField
                          placeholder="Enter IFSC Code"
                          name="ifsc_code"
                          disabled={isViewOnly}
                          value={element.ifsc_code || ""}
                          error={
                            element.errors !== undefined
                              ? element.errors.ifsc_code
                                ? true
                                : false
                              : false
                          }
                          helperText={
                            element.errors !== undefined
                              ? element.errors.ifsc_code
                              : ""
                          }
                          onChange={(e) => handleChange(index, e)}
                          variant="outlined"
                          fullWidth
                        />
                      </div>
                      <div className="add-textfiled">
                        <p>Account type</p>
                        <TextField
                          placeholder="Enter Account Type"
                          name="accountType"
                          disabled={isViewOnly}
                          value={element.accountType || ""}
                          error={
                            element.errors !== undefined
                              ? element.errors.accountType
                                ? true
                                : false
                              : false
                          }
                          helperText={
                            element.errors !== undefined
                              ? element.errors.accountType
                              : ""
                          }
                          onChange={(e) => handleChange(index, e)}
                          variant="outlined"
                          fullWidth
                        />
                      </div>

                      {element.is_indian.toString() === "1" && (
                        <div className="add-textfiled">
                          <p>Rate profile</p>
                          <Select
                            classes={classes}
                            filterOption={createFilter({
                              ignoreAccents: false,
                            })}
                            styles={selectStyles}
                            options={rateProfData.map((suggestion) => ({
                              value: suggestion.id,
                              label: suggestion.profile_name,
                            }))}
                            // components={components}
                            value={selectedProfile}
                            onChange={handleProfileChange}
                            placeholder="Rate Profile"
                            isDisabled={isViewOnly}
                          />

                          <span style={{ color: "red" }}>
                            {selectedProfErrTxt.length > 0
                              ? selectedProfErrTxt
                              : ""}
                          </span>
                        </div>
                      )}
                      {element.is_indian.toString() === "1" && (
                        <>
                          <div className="add-textfiled"></div>
                          <div className="add-textfiled"></div>
                          <div className="add-textfiled"></div>
                        </>
                      )}

                      <div
                        className="add-textfiled client-but"
                        style={{ textAlign: "end" }}
                      >
                        <div>
                          {!isViewOnly && (
                            <Button
                              id="btn-save"
                              variant="contained"
                              className=" mx-auto mt-16 float-right"
                              type="button"
                              onClick={() => addFormFields()}
                            >
                              Add Company
                            </Button>
                          )}
                        </div>
                        <div>
                          {!isViewOnly && formValues.length !== 1 && (
                            <IconButton onClick={() => removeFormFields(index)}>
                              <Icon className="delete-icone mt-12">
                                <img src={Icones.delete_red} alt="" />
                              </Icon>
                            </IconButton>
                          )}
                        </div>
                      </div>
                    </div>

                    <Grid
                      item
                      xs={6}
                      style={{ padding: 0, paddingInline: "12px" }}
                    >
                      <FormControl
                        id="mt-status-dv"
                        component="fieldset"
                        className={classes.formControl}
                      >
                        <FormLabel component="legend">Status :</FormLabel>
                        <RadioGroup
                          aria-label="Status"
                          name="status"
                          className={classes.group}
                          value={status.toString()}
                          onChange={handleChangeStatus}
                        >
                          <FormControlLabel
                            value="1"
                            control={<Radio />}
                            label="Active"
                            disabled={isViewOnly}
                          />
                          <FormControlLabel
                            value="0"
                            control={<Radio />}
                            label="Deactive"
                            disabled={isViewOnly}
                          />
                        </RadioGroup>
                        <span style={{ color: "red" }}>
                          {statusErr.length > 0 ? statusErr : ""}
                        </span>
                      </FormControl>
                    </Grid>
                    <Grid
                      className="mt-16"
                      item
                      xs={2}
                      style={{ padding: 0, paddingInline: "12px" }}
                    >
                      <Button
                        variant="contained"
                        component="span"
                        id="btn-save"
                      >
                        <label htmlFor={`contained-button-file${index}`}>
                          <TextField
                            id={`contained-button-file${index}`}
                            type="file"
                            style={{ display: "none" }}
                            onChange={(e) => handleImagechange(index, e)}
                            hidden={isViewOnly}
                          />
                          Upload Image
                        </label>
                      </Button>
                    </Grid>
                    <div>
                      {" "}
                      {element.image_file !== "" && (
                        <img
                          src={
                            element.image_url
                              ? element.image_file
                              : Config.getS3Url() +
                                `vkjdev/client/image/${element.image_file}`
                          }
                          style={{
                            width: "120px",
                            height: "120px",
                            marginLeft: "175px",
                            marginTop: "-35px",
                          }}
                          alt=""
                        />
                      )}
                    </div>
                  </>
                ))}
              </div>
              {!isViewOnly && (
                <Button
                  id="btn-save"
                  variant="contained"
                  color="primary"
                  className=" mx-auto  mr-16 float-right but-save-item"
                  aria-label="Register"
                  //   disabled={!isFormValid()}
                  // type="submit"
                  onClick={(e) => {
                    handleFormSubmit(e);
                  }}
                >
                  Save Changes
                </Button>
              )}
            </div>

            <Modal
              // disableBackdropClick rfModalOpen, setRfModalOpen
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              open={voucherModalOpen}
              onClose={(_, reason) => {
                if (reason !== "backdropClick") {
                  handleVoucherModalClose();
                }
              }}
            >
              <div style={modalStyle} className={classes.rateFixPaper}>
                <h5 className="popup-head p-20">
                  All Rates
                  <IconButton
                    style={{ position: "absolute", top: "0", right: "0" }}
                    onClick={handleVoucherModalClose}
                  >
                    <Icon>
                      <img src={Icones.cross} alt="" />
                    </Icon>
                  </IconButton>
                </h5>

                <div className="p-5 pl-16 pr-16">
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          className={classes.tableRowPad}
                          align="center"
                        >
                          Date
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="center"
                        >
                          Rate (%)
                        </TableCell>
                        {/* <TableCell
                          className={classes.tableRowPad}
                          align="center"
                        ></TableCell> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentLedgerData !== "" &&
                        currentLedgerData.map((row, index) => (
                          <TableRow
                            key={index}
                            // onClick={(e) => handleVoucherSelect(row.id)}
                            // className={classes.hoverClass}
                          >
                            <TableCell
                              align="center"
                              className={classes.tableRowPad}
                            >
                              {row.change_date}
                            </TableCell>

                            <TableCell
                              align="center"
                              className={classes.tableRowPad}
                            >
                              {/* disabled textfield and enable on edit */}
                              {/* <TextField
                                // className="mb-16"
                                // label="Rate (%)"
                                name="rate"
                                value={row.rate}
                                error={changeRateErr.length > 0 ? true : false}
                                helperText={changeRateErr}
                                onChange={(e) => handleRateChange(e, index)}
                                variant="outlined"
                                required
                                fullWidth
                                disabled={!row.isEditing}
                              /> */}
                              {row.rate}
                              {/* if editing flag is true then show input box here and save button too */}
                            </TableCell>
                            {/* <TableCell
                              align="center"
                              className={classes.tableRowPad}
                              style={{ width: "35%" }}
                            >
                              {!currentLedgerData.some(
                                (el) => el.isEditing === true
                              ) &&
                                !row.isEditing && (
                                  <IconButton
                                    style={{ padding: "0" }}
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                      ev.stopPropagation();
                                      editHandler(index);
                                    }}
                                  >
                                    <Icon className="mr-8 edit-icone">
                        <img src={Icones.edit} alt="" />
                      </Icon>
                                  </IconButton>
                                )}

                              {row.isEditing && (
                                <>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    // className="w-224 mx-auto mt-16"
                                    // aria-label="Register"
                                    //   disabled={!isFormValid()}
                                    // type="submit"
                                    onClick={(e) => {
                                      changeRate(e, index);
                                    }}
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    className="ml-2"
                                    // aria-label="Register"
                                    //   disabled={!isFormValid()}
                                    // type="submit"
                                    onClick={(e) => {
                                      cancelEdit(e, index);
                                    }}
                                  >
                                    cancel
                                  </Button>
                                </>
                              )}
                            </TableCell> */}
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>

                  {/* <Button
                    variant="contained"
                    color="primary"
                    className="w-full mx-auto mt-16"
                    style={{
                      backgroundColor: "#4caf50",
                      border: "none",
                      color: "white",
                    }}
                    onClick={(e) => adjustRateFix(e)}
                  >
                    Save
                  </Button> */}
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default EditClient;
