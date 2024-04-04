import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import clsx from "clsx";

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
    button: {
        margin: 5,
        textTransform: "none",
        backgroundColor: "cornflowerblue",
        color: "white",
    },
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
    searchBox: {
        padding: 6,
        fontSize: "12pt",
        borderColor: "darkgray",
        borderWidth: 1,
        borderRadius: 5,
    },
}));

const Device = (props) => {
    const classes = useStyles();

    const [productData, setProductData] = useState([]); //category wise Data

    useEffect(() => {
        // setProductData(props.productData);
        //eslint-disable-next-line
    }, [props]);

    return (
        <Paper className={clsx(classes.tabroot, "m-16 table-responsive")}>
            <MaUTable className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.tableRowPad}>Device Name</TableCell>
                        <TableCell className={classes.tableRowPad}>
                            Device Token
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>Device ID</TableCell>
                        <TableCell className={classes.tableRowPad}>
                            Version No
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                            Build No
                        </TableCell>
                        
                        <TableCell className={classes.tableRowPad}>
                            Actions
                        </TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {/* {productData.map((element, index) => (
                        <TableRow key={index}>
                            <TableCell className={classes.tableRowPad}>
                                {element.category_name}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                                {element.billing_category_name}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                                {element.pcs}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                                {parseFloat(element.gross_wgt).toFixed(3)}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                                {element.net_wgt}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                                {element.purity}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                                {element.karat}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                                {element.wastage}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                                {element.wastageFine}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                                {element.wastageFineAmount}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                                {element.other_amt === null ? 0 : element.other_amt}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                                {element.labourRate}
                            </TableCell>

                            <TableCell className={classes.tableRowPad}>
                                {element.totalAmount}
                            </TableCell>
                        </TableRow>
                    ))} */}
                    
                </TableBody>
            </MaUTable>
        </Paper>
    );
};

export default Device;
