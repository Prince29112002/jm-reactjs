import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { TextField, } from "@material-ui/core";
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
        margin: 10
        // margin: theme.spacing(3),
    },
    group: {
        // margin: theme.spacing(1, 0),

        flexDirection: "row",
    },
    searchBox: {
        padding: 8,
        fontSize: "12pt",
        borderColor: "darkgray",
        borderWidth: 1,
    borderRadius:"7px !important",
    },
}));


const ProductAllocation = forwardRef((props, ref) => {

    useImperativeHandle(ref, () => ({
        checkValidation() {
            // alert("getAlert from Child");
            return dateValidation() && designValidation()
        },

        finalArrIds(){
          return finalArr()
        },

        getData() {
            return {
                expiry_date_time: expDtTime,
                date_time: expDate,
                is_category: categoryFlag,
                shortcut:expTime,
                product_category_id: selectedSubCredit,
                staging_id: selectedStaging.value
            }
        }
    }));

    // const isEdit = props.isEdit; //if comes from edit
    // const idToBeEdited = props.editID;

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

    const [expTime, setExpTime] = useState("")
    const [expTimeErr, setExpTimeErr] = useState("")

    const [categoryFlag, setCategoryFlag] = useState("")
    const [catFlagErr, setCatFlagErr] = useState("");

    const [stagingList, setStagingList] = useState([]);
    const [stagingErr, setStagingErr] = useState("");

    const [selectedStaging, setSelectedStaging] = useState("")
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
                dispatch(Actions.showMessage({ message: response.data.message,variant:"error"}));
                setStagingList([])
            }
        })
        .catch(function (error) {
            handleError(error, dispatch, { api: "api/designStaging" })
        });
    }

    useEffect(() => {
        // setIsView(props.isViewOnly)
        let treeView = props.treeView;
        let expDtTim = props.expDtTime
        let categoryFlg = props.categoryFlag
        let shortcut= props.shortcut;
        if (treeView) {
            if (treeView.length > 0) {
                const arrData = []
                treeView.map((item) => {
                    arrData.push(item.value)
                })
                  setSelectedSubCredit(arrData)
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
            const data = shortcut !=null?shortcut.split("-"):""
            const today = moment().format('DD/MM/YYYY hh:mm:ss A')
            const time = moment(today, "DD-MM-YYYY hh:mm:ss A").add(data[0], data[1]).format('YYYY-MM-DD hh:mm:ss A');
            setExpDate(time)
        }

        //eslint-disable-next-line
    }, [props]);

    function getProductCategories() {
        // setLoading(true);
        const nodes = []

        axios
            .get(Config.getCommonUrl() + "api/productcategory/category/tree")
            .then(function (response) {

                if (response.data.success === true) {
                    console.log(response.data.data);
                    setCatArr(response.data.data)
                    const data = response.data.data;
                    data.map((i, ind) => {
                        if (i.mainCategoryname === null) {
                            nodes.push({
                                value: i.id,
                                label: i.category_name,
                                children: []
                            })
                        } else {
                            if (i[i.id].parent_category_id === null) {
                                const index = nodes.findIndex(item => item.value === i.parent_category_id);
                                if (index > -1) {
                                    nodes[index].children.push({
                                        value: i.id,
                                        label: i.category_name,
                                        children: [],
                                    })
                                }

                            }
                            else {
                                let index = nodes.findIndex(item => item.value === i[i.id].parent_category_id);
                                if (index === -1) {
                                    let childIndex = -1;
                                    childIndex = nodes[0].children.findIndex(item => item.value === i[i.id].parent_category_id)
                                    if (childIndex === -1) {
                                 
                                        childIndex = nodes[0].children.findIndex(item => item.value === i[i.id][i[i.id].id].parent_category_id)
                                       
                                        if (childIndex > -1) {
                                            let innerindex = -1;
                                            innerindex = nodes[0].children[childIndex].children.findIndex(item => item.value === i[i.id].parent_category_id);
                                            if (childIndex > -1 && innerindex > -1) {
                                                nodes[0].children[childIndex].children[innerindex].children.push({
                                                    value: i.id,
                                                    label: i.category_name,
                                                    children: []
                                                })
                                            }
                                        }

                                    } else {
                                        let innerindex = -1;
                                        innerindex = nodes[0].children[childIndex].children.findIndex(item => item.value === i.parent_category_id);
                                        if (childIndex > -1 && innerindex > -1) {
                                            nodes[0].children[childIndex].children[innerindex].children.push({
                                                value: i.id,
                                                label: i.category_name,
                                                children: []
                                            })
                                        }
                                    }
                                } else {
                                    let innerindex = -1;
                                    if (index > -1) {
                                        innerindex = nodes[index].children.findIndex(item => item.value === i.parent_category_id);
                                    }
                                    if (index > -1 && innerindex > -1) {
                                        nodes[index].children[innerindex].children.push({
                                            value: i.id,
                                            label: i.category_name,
                                            children: []
                                        })
                                    }

                                }

                            }
                        }
                        return null
                    })
                    setGroupTree(nodes)
                }
            })
            .catch(function (error) {
                handleError(error, dispatch, { api: "api/productcategory/category/tree" })

            });
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

        const result = deepFilter(groupTree, (node) =>
            node.label.toLowerCase().includes(sData.toLowerCase())
        )
        if (sData === "") {
            setExpanded([])
        } else {
            if (result.length > 0) {
                let tempArr = []
                tempArr.push(result[0].value.toString())

                result[0].children.map(item => {
                    tempArr.push(item.value.toString())
                    item.children.map(x => {
                        tempArr.push(x.value.toString())
                        return null
                    })
                    return null
                })

                setExpanded(tempArr)
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

    const handleInputChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        if (name === "expDtTime") {
            setExpDtTime(value)
            setExpDtTimeErr("")
            if(value == 1){
                setExpTime("2-hours")
                const today = moment().format('DD/MM/YYYY hh:mm:ss A')
                const time = moment(today, "DD-MM-YYYY hh:mm:ss A").add(2,"hours").format('YYYY-MM-DD hh:mm:ss A');
                setExpDate(time)
            }else{
                setExpDate("")
                setExpTime("")
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

    function finalArr(){
        const dataArr = [...selectedSubCredit]
        const catttArr = [...catArr]
        const mainId = []
        catttArr.map((item) =>{
            if(dataArr.includes(item.id.toString()) && item.parent_category_id !== null){
                mainId.push(item.parent_category_id.toString())
                if(item[item.parent_category_id]){
                    mainId.push(item[item.parent_category_id].id.toString())
                    if(item[item[item.parent_category_id].id]){
                        mainId.push(item[item[item.parent_category_id].id].id.toString())
                    }
                }
            }
        })

        const finalArr = [...selectedSubCredit,...mainId]
        const uniqueChars = [...new Set(finalArr)];
        return uniqueChars
    }

    return (
        <>
            <div className={clsx(classes.root, props.className, "w-full")}>
                <FuseAnimate animation="transition.slideUpIn" delay={200}>
                    <div className="flex flex-col md:flex-row container">
            <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 ">
              <div className="main-div-alll">
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
                                            <FormLabel component="legend">Expiry Date & Time :</FormLabel>
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
                                                />

                                                <FormControlLabel
                                                    value="0"
                                                    control={<Radio />}
                                                    label="No"
                                                />

                                            </RadioGroup>
                                        </FormControl>

                                        <span style={{ color: "red" }}>
                                            {expDtTimeErr.length > 0 ? expDtTimeErr : ""}
                                        </span>

                                        {expDtTime === "1" &&
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
                                                            />

                                                            <FormControlLabel
                                                                value="6-hours"
                                                                control={<Radio />}
                                                                label="6 Hrs"
                                                            />

                                                            <FormControlLabel
                                                                value="12-hours"
                                                                control={<Radio />}
                                                                label="12 Hrs"
                                                            />

                                                            <FormControlLabel
                                                                value="1-days"
                                                                control={<Radio />}
                                                                label="1 Day"
                                                            />

                                                            <FormControlLabel
                                                                value="2-days"
                                                                control={<Radio />}
                                                                label="2 Day"
                                                            />

                                                            <FormControlLabel
                                                                value="7-days"
                                                                control={<Radio />}
                                                                label="7 Day"
                                                            />

                                                            <FormControlLabel
                                                                value="15-days"
                                                                control={<Radio />}
                                                                label="15 Day"
                                                            />

                                                            <FormControlLabel
                                                                value="30-days"
                                                                control={<Radio />}
                                                                label="30 Day"
                                                            />

                                                            <FormControlLabel
                                                                value="1-years"
                                                                control={<Radio />}
                                                                label="1 Year"
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
                                                        // value={expDate}
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
                                        }
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
                                                />

                                                <FormControlLabel
                                                    value="0"
                                                    control={<Radio />}
                                                    label="Staging"
                                                />
                                            </RadioGroup>
                                        </FormControl>
                                        <span style={{ color: "red" }}>
                                            {catFlagErr.length > 0 ? catFlagErr : ""}
                                        </span>
                                        {categoryFlag === "1" &&
                                            <Grid
                                                className=""
                                                item
                                                xs={12}
                                                style={{ padding: 5 }}
                                            >
                                                <div className="ml-16 mt-16">
                                                    <label style={{ display: "contents" }}> Show Category / Subcategory : </label>
                                                    <Search
                                                        className={classes.searchBox}
                                                        onSearch={onSearchHandler}
                                                    />
                                                </div>
                                            
                                     
                                                <div className="account-li-dv mt-16" style={{ marginBottom: "10%" }}>
                                                <CheckboxTree
                                                    nodes={groupTree}
                                                    checked={selectedSubCredit}
                                                    expanded={expanded}
                                                    checkModel="all"
                                                    onCheck={(checke) => {
                                                        setSelectedSubCredit(checke);
                                                        setVoucherToCreditErr("");
                                                    }}
                                                    onExpand={(expanded) => setExpanded(expanded)}
                                                    showNodeIcon={false}
                                                    />
                                                <span style={{ color: "red" }} className="m-2">
                                                    {voucherToCreditErr.length > 0
                                                        ? voucherToCreditErr
                                                        : ""}
                                                </span>
                                                </div>
                                            </Grid>
                                        }
                                        {categoryFlag === "0" &&
                                            <Grid
                                                className=""
                                                item
                                                xs={3} sm={3} md={3}
                                                style={{ padding: 5 }}
                                            >
                                                <Select
                                                    className={clsx(
                                                        classes.selectBox,
                                                        "ml-2",
                                                    )}
                                                    filterOption={createFilter({
                                                        ignoreAccents: false,
                                                    })}
                                                    styles={selectStyles}
                                                    options={stagingList.map((suggestion) => ({
                                                        value: suggestion.id,
                                                        label: suggestion.name,
                                                    }))}
                                                    // components={components}
                                                    value={selectedStaging}
                                                    onChange={(e) => {
                                                        handleStagingChange(e);
                                                    }}
                                                    placeholder="Select Staging"
                                                // isDisabled={isView}
                                                />
                                                <span style={{ color: "red" }} className="m-2">
                                                    {stagingErr.length > 0 ? stagingErr : ""}
                                                </span>
                                            </Grid>
                                        }
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
