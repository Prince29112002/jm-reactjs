import React, {useEffect, useState} from "react";
import { useDispatch } from "react-redux";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting"
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from "axios";
import Config from "app/fuse-configs/Config";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { FuseAnimate } from "@fuse";
import { Grid, Typography } from "@material-ui/core";

const SalesBlankPage = () => {
  const [GraphData, setGraphData] = useState("");
  const [loading, setLoading] = useState(true);

  // const data = [
  //   {
  //     name: 'January',
  //     Sales: 40000,
  //     Purchase: 24000,
  //   },
  //   {
  //     name: 'February',
  //     Sales: 30000,
  //     Purchase: 13980,
  //   },
  //   {
  //     name: 'March',
  //     Sales: 20000,
  //     Purchase: 98000,
  //   },
  //   {
  //     name: 'April',
  //     Sales: 27800,
  //     Purchase: 39080,
  //   },
  //   {
  //     name: 'May',
  //     Sales: 18900,
  //     Purchase: 48000,
  //   },
  //   {
  //     name: 'June',
  //     Sales: 20000,
  //     Purchase: 98000,
  //   },
  //   {
  //     name: 'July',
  //     Sales: 27800,
  //     Purchase: 39080,
  //   },
  //   {
  //     name: 'August',
  //     Sales: 18900,
  //     Purchase: 48000,
  //   },
  //   {
  //     name: 'September',
  //     Sales: 18900,
  //     Purchase: 48000,
  //   },
  //   {
  //     name: 'October',
  //     Sales: 80000,
  //     Purchase: 68000,
  //   },
  //   {
  //     name: 'November',
  //     Sales: 27800,
  //     Purchase: 39080,
  //   },
  //   {
  //     name: 'December',
  //     Sales: 100000,
  //     Purchase: 48000,
  //   },
  // ];
 
  const dispatch = useDispatch();
  useEffect(() => {
    getGraphData();
    NavbarSetting('Sales',dispatch)
    //eslint-disable-next-line
  },[])

  // useEffect(() => {
  //   getGraphData();
  //   //eslint-disable-next-line
  // },[])

console.log(GraphData);
  function getGraphData() {
    setLoading(true);
    axios.get(Config.getCommonUrl() + "api/graph/view")
      .then((response) => {
        console.log(response);
        setGraphData(response.data.GraphData          );
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {api : "api/graph/view"})
      })
  }

  return (   
    <>
    <Grid
    className="department-main-dv pt-20"
    container
    spacing={4}
    alignItems="stretch"
    style={{ margin: 0 }}
  >
    <Grid item xs={4} sm={4} md={4} key="1" style={{ padding: 0 }}> 
      <FuseAnimate delay={300}>
        <Typography className="pl-28 pt-16 text-18 font-700">
        Sales / Purchase
        </Typography>
      </FuseAnimate>

      {/* <BreadcrumbsHelper /> */}
    </Grid>

  </Grid>
  <div className="main-div-alll">
  <ResponsiveContainer width="100%" height="80%" className="mt-96">
  <BarChart
    width={500}
    height={300}
    data={GraphData}
    margin={{
      top: 5,
      right: 30,
      left: 20,
      bottom: 5,
    }}
  >
    {/* <CartesianGrid strokeDasharray="3 3" /> */}
    <XAxis dataKey="Month" />
    <YAxis />
    <Legend />
    <Tooltip />
    <Bar dataKey="Purchase" fill="#415bd4" />
    <Bar dataKey="Sales" fill="#82ca9d" />
  </BarChart>
</ResponsiveContainer>
</div>
</>
  );
};

export default SalesBlankPage;
