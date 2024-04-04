import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import clsx from "clsx";
import HelperFunc from "../../Helper/HelperFunc";

const useStyles = makeStyles((theme) => ({
  root: {},

  tabroot: {
    overflowX: "auto",
    overflowY: "auto",
    height: "100%",
  },
  table: {
    minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
  },
}));

const BomDetails = (props) => {
  const classes = useStyles();

  const [bomList, setBomList] = useState([]); //category wise Data
  //   const [stateId, setStateId] = useState("");
  // const [selectedLoad, setSelectedLoad] = useState("");
  //   const [isView, setIsView] = useState(false);

  useEffect(() => {
    setBomList(props.bomList);
  }, [props]);

  return (
    <Paper className={clsx(classes.tabroot, "m-16 table-responsive")}>
      <MaUTable className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableRowPad}>lotNumber</TableCell>
            <TableCell className={classes.tableRowPad}>Stock Code</TableCell>
            <TableCell className={classes.tableRowPad}>Design No</TableCell>
            <TableCell className={classes.tableRowPad}>Design Pieces</TableCell>
            <TableCell className={classes.tableRowPad}>Batch No</TableCell>
            <TableCell className={classes.tableRowPad}>Pieces</TableCell>
            <TableCell className={classes.tableRowPad}>Weight</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bomList.map((element, index) => (
            <TableRow key={index}>
              <TableCell className={classes.tableRowPad}>
                {element.lotNumber}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {element.stock_name_code}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {element.design_no}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {element.design_pcs}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {element.batch_no}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {element.pcs}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {parseFloat(element.weight).toFixed(3)}
              </TableCell>
            </TableRow>
          ))}
          <TableRow style={{ backgroundColor: "#D1D8F5" }}>
            <TableCell
              className={classes.tableRowPad}
              style={{ fontWeight: "700" }}
            >
              {/* {element.lotNumber} */}
            </TableCell>
            <TableCell
              className={classes.tableRowPad}
              style={{ fontWeight: "700" }}
            >
              {/* {element.stock_name_code} */}
            </TableCell>
            <TableCell
              className={classes.tableRowPad}
              style={{ fontWeight: "700" }}
            >
              {/* {element.design_no} */}
            </TableCell>
            <TableCell
              className={classes.tableRowPad}
              style={{ fontWeight: "700" }}
            >
              {/* {element.design_pcs} */}
              {HelperFunc.getTotalOfField(bomList, "design_pcs")}
              {/* {parseFloat(
                                bomList
                                    .filter((item) => item.design_pcs !== "")
                                    .map((item) => parseFloat(item.design_pcs))
                                    .reduce(function (a, b) {
                                        return parseFloat(a) + parseFloat(b);
                                    }, 0)
                            ).toFixed(3)} */}
            </TableCell>
            <TableCell
              className={classes.tableRowPad}
              style={{ fontWeight: "700" }}
            >
              {/* {element.batch_no} */}
            </TableCell>
            <TableCell
              className={classes.tableRowPad}
              style={{ fontWeight: "700" }}
            >
              {/* {element.pcs} */}
              {HelperFunc.getTotalOfFieldNoDecimal(bomList, "pcs")}
            </TableCell>
            <TableCell
              className={classes.tableRowPad}
              style={{ fontWeight: "700" }}
            >
              {/* {element.weight} */}
              {HelperFunc.getTotalOfField(bomList, "weight")}
            </TableCell>
          </TableRow>
        </TableBody>
      </MaUTable>
    </Paper>
  );
};

export default BomDetails;
