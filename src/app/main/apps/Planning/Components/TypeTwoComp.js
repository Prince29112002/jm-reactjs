import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

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
}));

const TypeTwoComp = (props) => {
  const [apiData, setApiData] = useState("");

  useEffect(() => {
    setApiData(props.apiData);
  }, [props]);

  const classes = useStyles();

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={4} style={{ padding: 5 }}>
          <label className={clsx(classes.tableRowPad, "text-15")}>
            <span className="font-700"> Retailer : </span>{" "}
            {apiData && apiData.retailer?.company_name}
          </label>
        </Grid>

        <Grid item xs={4} style={{ padding: 5 }}>
          <label className={clsx(classes.tableRowPad, "text-15")}>
            <span className="font-700"> Distributor : </span>{" "}
            {apiData && apiData.distributor?.client?.name}
          </label>
        </Grid>

        <Grid item xs={4} style={{ padding: 5 }}>
          <label className={clsx(classes.tableRowPad, "text-15")}>
            <span className="font-700"> Rhodium on stone % : </span>{" "}
            {apiData && apiData.rhodium_on_stone_percentage}
          </label>
        </Grid>

        <Grid item xs={4} style={{ padding: 5 }}>
          <label className={clsx(classes.tableRowPad, "text-15")}>
            <span className="font-700"> Rhodium on Plain part % : </span>{" "}
            {apiData && apiData.rhodium_on_plain_part_percentage}
          </label>
        </Grid>

        <Grid item xs={4} style={{ padding: 5 }}>
          <label className={clsx(classes.tableRowPad, "text-15")}>
            <span className="font-700"> Rhodium Remarks : </span>{" "}
            {apiData && apiData.rhodium_remarks}
          </label>
        </Grid>

        <Grid item xs={4} style={{ padding: 5 }}>
          <label className={clsx(classes.tableRowPad, "text-15")}>
            <span className="font-700"> Sandblasting dull % : </span>{" "}
            {apiData && apiData.sandblasting_dull_percentage}
          </label>
        </Grid>

        <Grid item xs={4} style={{ padding: 5 }}>
          <label className={clsx(classes.tableRowPad, "text-15")}>
            <span className="font-700"> Satin dull % : </span>{" "}
            {apiData && apiData.satin_dull_percentage}
          </label>
        </Grid>

        <Grid item xs={4} style={{ padding: 5 }}>
          <label className={clsx(classes.tableRowPad, "text-15")}>
            <span className="font-700"> Dull Texture Remark : </span>{" "}
            {apiData && apiData.dull_texture_remark}
          </label>
        </Grid>

        <Grid item xs={4} style={{ padding: 5 }}>
          <label className={clsx(classes.tableRowPad, "text-15")}>
            <span className="font-700"> Enamel % : </span>{" "}
            {apiData && apiData.enamel_percentage}
          </label>
        </Grid>

        <Grid item xs={4} style={{ padding: 5 }}>
          <label className={clsx(classes.tableRowPad, "text-15")}>
            <span className="font-700"> Enamel Remark : </span>{" "}
            {apiData && apiData.enamel_remark}
          </label>
        </Grid>

        <Grid item xs={4} style={{ padding: 5 }}>
          <label className={clsx(classes.tableRowPad, "text-15")}>
            <span className="font-700"> Additional Color Stone % : </span>{" "}
            {apiData && apiData.additional_color_stone}
          </label>
        </Grid>

        <Grid item xs={4} style={{ padding: 5 }}>
          <label className={clsx(classes.tableRowPad, "text-15")}>
            <span className="font-700"> Additional Color Remark : </span>{" "}
            {apiData && apiData.additional_color_remark}
          </label>
        </Grid>

        <Grid item xs={4} style={{ padding: 5 }}>
          <label className={clsx(classes.tableRowPad, "text-15")}>
            <span className="font-700"> Final Order Remark : </span>{" "}
            {apiData && apiData.final_order_remark}
          </label>
        </Grid>

        <Grid item xs={4} style={{ padding: 5 }}>
          <label className={clsx(classes.tableRowPad, "text-15")}>
            <span className="font-700"> Screw Type : </span>{" "}
            {apiData && apiData.screw_type}
          </label>
        </Grid>
      </Grid>

      <Paper className={clsx(classes.tabroot, "table-responsive", "mt-16")}>
        <MaUTable className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableRowPad}>Category</TableCell>
              <TableCell className={classes.tableRowPad}>Variant No</TableCell>
              <TableCell className={classes.tableRowPad}>karat</TableCell>
              <TableCell className={classes.tableRowPad}>
                gross_weight
              </TableCell>
              <TableCell className={classes.tableRowPad}>net_weight</TableCell>
              <TableCell className={classes.tableRowPad}>pieces</TableCell>
              <TableCell className={classes.tableRowPad}>comment</TableCell>

              <TableCell className={classes.tableRowPad}>Image</TableCell>

              <TableCell className={classes.tableRowPad}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* <div className="mt-32" style={{ display: 'flex', overflowX: 'auto', maxWidth: 1600 }}> */}
            {apiData.ExhibitionOrderDesigns?.map((data, idx) => (
              <TableRow key={idx}>
                <TableCell className={classes.tableRowPad}>
                  {data.design?.ProductCategoryDetails?.category_name}
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  {data.design?.variant_number}
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  {data.karat}
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  {data.gross_weight.toFixed(3)}
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  {data.net_weight.toFixed(3)}
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  {data.pieces}
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  {data.comment}
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  {data.design?.image_files?.length > 0 && (
                    <img
                      src={data.design.image_files[0].image_file}
                      height={50}
                      width={50}
                    />
                  )}
                </TableCell>
                <TableCell className={classes.tableRowPad}></TableCell>
              </TableRow>
            ))}
            {/* </div> */}
          </TableBody>
        </MaUTable>
      </Paper>
    </>
  );
};

export default TypeTwoComp;
