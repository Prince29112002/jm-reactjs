import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TableFooter from "@material-ui/core/TableFooter";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Loader from "../../../../Loader/Loader";
import clsx from "clsx";
import LotViewPopUp from "../../../Stock/StockList/PopUps/LotViewPopUp";
import { TextField } from "@material-ui/core";
import { Icon, IconButton } from "@material-ui/core";
import useSortableData from "../../../Stock/Components/useSortableData";
import DetailsReportPopup from "./DetailsReportPopup";

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
    height: "100%",
  },
  table: {
    minWidth: 650,
    // tableLayout : 'fixed'
  },
  tableRowPad: {
    padding: 7,
    // overflow: "hidden"
  },
  hoverClass: {
    // backgroundColor: "#fff",
    "&:hover": {
      backgroundColor: "#FFFFFF",
      cursor: "pointer",
    },
  },
}));

const AllStockView = ({
  props,
  allData,
  date,
  refreshApi,
  dlData,
  pgName,
  flag,
}) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [allStockList, setAllStockList] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState("");
  const [detailPopup, setDetailPopup] = useState(false);
  const [detailsData, setDetailsData] = useState("");
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
    if (allData !== undefined) {
      setAllStockList(allData);
    }
  }, [props, allData]);

  useEffect(() => {
    return () => {
      console.log("cleaned up");
    };
  }, []);

  const handleSearchData = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    // const searchItem = searchData;
    setSearchData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRowSelect = (element) => {
    if (element.flag === 1 || element.flag === 2) {
      setDetailPopup(true);
      setDetailsData(element);
    } else {
      setShowPopup(true);
      setPopupData(element);
    }
  };

  const changeFlags = () => {
    setShowPopup(false);
    setDetailPopup(false);
    setDetailsData("");
    setPopupData("");
  };

  const displayPopup = () => {
    if (popupData.flag !== 1 && popupData.flag !== 2)
      return (
        <LotViewPopUp
          data={popupData}
          openFlag={showPopup}
          setOpenFlag={changeFlags}
        />
      );
  };

  const { items, requestSort, sortConfig } = useSortableData(allStockList);

  return (
    <div className="">
      {loading && <Loader />}
      <Paper className={clsx(classes.tabroot)}>
        <MaUTable className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableRowPad}>Stock Type </TableCell>
              <TableCell className={classes.tableRowPad}>Stock Code</TableCell>
              <TableCell className={classes.tableRowPad}>Fine Gold</TableCell>
              <TableCell className={classes.tableRowPad}>Category</TableCell>
              <TableCell className={classes.tableRowPad}>Purity</TableCell>
              <TableCell className={classes.tableRowPad}>Pieces</TableCell>
              <TableCell className={classes.tableRowPad}>
                Gross Weight
              </TableCell>
              <TableCell className={classes.tableRowPad}>Net Weight</TableCell>
              <TableCell className={classes.tableRowPad}>
                Other Weight
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.tableRowPad}>
                <TextField
                  name="stockType"
                  onChange={handleSearchData}
                  inputProps={{ className: "all-Search-box-data" }}
                />
                <IconButton
                  style={{ padding: "0" }}
                  onClick={() => requestSort("stockType")}
                >
                  <Icon className="mr-8" style={{ color: "#000" }}>
                    {" "}
                    sort{" "}
                  </Icon>

                  {sortConfig &&
                    sortConfig.key === "stockType" &&
                    sortConfig.direction === "ascending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_downward{" "}
                      </Icon>
                    )}
                  {sortConfig &&
                    sortConfig.key === "stockType" &&
                    sortConfig.direction === "descending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_upward{" "}
                      </Icon>
                    )}
                </IconButton>
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                <TextField
                  name="StockCode"
                  onChange={handleSearchData}
                  inputProps={{ className: "all-Search-box-data" }}
                />

                <IconButton
                  style={{ padding: "0" }}
                  onClick={() => requestSort("stock_name_code")}
                >
                  <Icon className="mr-8" style={{ color: "#000" }}>
                    {" "}
                    sort{" "}
                  </Icon>

                  {sortConfig &&
                    sortConfig.key === "stock_name_code" &&
                    sortConfig.direction === "ascending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_downward{" "}
                      </Icon>
                    )}
                  {sortConfig &&
                    sortConfig.key === "stock_name_code" &&
                    sortConfig.direction === "descending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_upward{" "}
                      </Icon>
                    )}
                </IconButton>
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                <TextField
                  name="fineGold"
                  onChange={handleSearchData}
                  inputProps={{ className: "all-Search-box-data" }}
                />

                <IconButton
                  style={{ padding: "0" }}
                  onClick={() => requestSort("fineGold")}
                >
                  <Icon className="mr-8" style={{ color: "#000" }}>
                    {" "}
                    sort{" "}
                  </Icon>

                  {sortConfig &&
                    sortConfig.key === "fineGold" &&
                    sortConfig.direction === "ascending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_downward{" "}
                      </Icon>
                    )}
                  {sortConfig &&
                    sortConfig.key === "fineGold" &&
                    sortConfig.direction === "descending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_upward{" "}
                      </Icon>
                    )}
                </IconButton>
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                <TextField
                  name="category"
                  onChange={handleSearchData}
                  inputProps={{ className: "all-Search-box-data" }}
                />

                <IconButton
                  style={{ padding: "0" }}
                  onClick={() => requestSort("category_name")}
                >
                  <Icon className="mr-8" style={{ color: "#000" }}>
                    {" "}
                    sort{" "}
                  </Icon>

                  {sortConfig &&
                    sortConfig.key === "category_name" &&
                    sortConfig.direction === "ascending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_downward{" "}
                      </Icon>
                    )}
                  {sortConfig &&
                    sortConfig.key === "category_name" &&
                    sortConfig.direction === "descending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_upward{" "}
                      </Icon>
                    )}
                </IconButton>
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                <TextField
                  name="purity"
                  onChange={handleSearchData}
                  inputProps={{ className: "all-Search-box-data" }}
                />

                <IconButton
                  style={{ padding: "0" }}
                  onClick={() => requestSort("purity")}
                >
                  <Icon className="mr-8" style={{ color: "#000" }}>
                    {" "}
                    sort{" "}
                  </Icon>

                  {sortConfig &&
                    sortConfig.key === "purity" &&
                    sortConfig.direction === "ascending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_downward{" "}
                      </Icon>
                    )}
                  {sortConfig &&
                    sortConfig.key === "purity" &&
                    sortConfig.direction === "descending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_upward{" "}
                      </Icon>
                    )}
                </IconButton>
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                <TextField
                  name="pieces"
                  onChange={handleSearchData}
                  inputProps={{ className: "all-Search-box-data" }}
                />

                <IconButton
                  style={{ padding: "0" }}
                  onClick={() => requestSort("pcs")}
                >
                  <Icon className="mr-8" style={{ color: "#000" }}>
                    {" "}
                    sort{" "}
                  </Icon>

                  {sortConfig &&
                    sortConfig.key === "pcs" &&
                    sortConfig.direction === "ascending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_downward{" "}
                      </Icon>
                    )}
                  {sortConfig &&
                    sortConfig.key === "pcs" &&
                    sortConfig.direction === "descending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_upward{" "}
                      </Icon>
                    )}
                </IconButton>
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                <TextField
                  name="grossWeight"
                  onChange={handleSearchData}
                  inputProps={{ className: "all-Search-box-data" }}
                />

                <IconButton
                  style={{ padding: "0" }}
                  onClick={() => requestSort("gross_weight")}
                >
                  <Icon className="mr-8" style={{ color: "#000" }}>
                    {" "}
                    sort{" "}
                  </Icon>

                  {sortConfig &&
                    sortConfig.key === "gross_weight" &&
                    sortConfig.direction === "ascending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_downward{" "}
                      </Icon>
                    )}
                  {sortConfig &&
                    sortConfig.key === "gross_weight" &&
                    sortConfig.direction === "descending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_upward{" "}
                      </Icon>
                    )}
                </IconButton>
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                <TextField
                  name="netWeight"
                  onChange={handleSearchData}
                  inputProps={{ className: "all-Search-box-data" }}
                />

                <IconButton
                  style={{ padding: "0" }}
                  onClick={() => requestSort("net_weight")}
                >
                  <Icon className="mr-8" style={{ color: "#000" }}>
                    {" "}
                    sort{" "}
                  </Icon>

                  {sortConfig &&
                    sortConfig.key === "net_weight" &&
                    sortConfig.direction === "ascending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_downward{" "}
                      </Icon>
                    )}
                  {sortConfig &&
                    sortConfig.key === "net_weight" &&
                    sortConfig.direction === "descending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_upward{" "}
                      </Icon>
                    )}
                </IconButton>
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                <TextField
                  name="otherWeight"
                  onChange={handleSearchData}
                  inputProps={{ className: "all-Search-box-data" }}
                />

                <IconButton
                  style={{ padding: "0" }}
                  onClick={() => requestSort("other_weight")}
                >
                  <Icon className="mr-8" style={{ color: "#000" }}>
                    {" "}
                    sort{" "}
                  </Icon>

                  {sortConfig &&
                    sortConfig.key === "other_weight" &&
                    sortConfig.direction === "ascending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_downward{" "}
                      </Icon>
                    )}
                  {sortConfig &&
                    sortConfig.key === "other_weight" &&
                    sortConfig.direction === "descending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_upward{" "}
                      </Icon>
                    )}
                </IconButton>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items
              .filter((temp) => {
                if (searchData.stockType) {
                  return temp.stockType
                    .toLowerCase()
                    .includes(searchData.stockType.toLowerCase());
                } else if (searchData.StockCode) {
                  return temp.stock_name_code
                    .toLowerCase()
                    .includes(searchData.StockCode.toLowerCase());
                } else if (searchData.category) {
                  //&& temp.category_name
                  return temp.category_name !== undefined &&
                    temp.category_name !== null
                    ? temp.category_name
                        .toLowerCase()
                        .includes(searchData.category.toLowerCase())
                    : null;
                } else if (searchData.purity) {
                  return temp.purity !== null
                    ? temp.purity
                        .toString()
                        .toLowerCase()
                        .includes(searchData.purity.toLowerCase())
                    : null;
                } else if (searchData.pieces) {
                  return temp.pcs
                    .toString()
                    .toLowerCase()
                    .includes(searchData.pieces.toLowerCase());
                } else if (searchData.grossWeight) {
                  return temp.gross_weight
                    .toString()
                    .toLowerCase()
                    .includes(searchData.grossWeight.toLowerCase());
                } else if (searchData.netWeight) {
                  return temp.net_weight
                    .toString()
                    .toLowerCase()
                    .includes(searchData.netWeight.toLowerCase());
                } else if (searchData.fineGold) {
                  return temp.fineGold
                    .toString()
                    .toLowerCase()
                    .includes(searchData.fineGold.toLowerCase());
                } else if (searchData.otherWeight) {
                  return temp.other_weight
                    .toString()
                    .toLowerCase()
                    .includes(searchData.otherWeight.toLowerCase());
                } else {
                  return temp;
                }
              })
              .map((element, index) => (
                <TableRow
                  key={index}
                  onClick={(e) => handleRowSelect(element)}
                  className={classes.hoverClass}
                >
                  <TableCell className={classes.tableRowPad}>
                    {/* Stock Type */}
                    {element.stockType}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {element.stock_name_code}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {element.fineGold}
                    {/* {element.flag === 1 && element.item_id === 1 ? parseFloat(parseFloat(element.net_weight) * parseFloat(element.purity) / 100).toFixed(3) : "-"} */}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {/* Variant */}
                    {element.hasOwnProperty("category_name")
                      ? element.category_name
                      : "-"}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {/* Purity */}
                    {element.purity}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {element.pcs === null ? "-" : element.pcs}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {element.gross_weight === null
                      ? "-"
                      : element.gross_weight.toFixed(3)}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {element.net_weight === null
                      ? "-"
                      : element.net_weight.toFixed(3)}
                  </TableCell>

                  <TableCell className={classes.tableRowPad}>
                    {/* {element.other_weight
                      ? element.other_weight
                      : "-"} */}
                      {element.other_weight === null
                      ? "-"
                      : element.other_weight}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
          {flag === true && (
            <TableFooter>
              <TableRow>
                <TableCell className={classes.tableRowPad}></TableCell>
                <TableCell className={classes.tableRowPad}>
                  {/* Stock Type */}
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  {/* {element.stock_name_code} */}
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  {/* {element.fineGold} */}
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
                      .filter(
                        (item) =>
                          item.gross_weight !== "" && item.gross_weight !== "-"
                      )
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
              </TableRow>
            </TableFooter>
          )}
        </MaUTable>
        {detailPopup ? (
          <DetailsReportPopup
            data={detailsData}
            date={date}
            openFlag={detailPopup}
            setOpenFlag={changeFlags}
          />
        ) : null}
        {showPopup ? displayPopup() : null}
      </Paper>
    </div>
  );
};

export default AllStockView;
