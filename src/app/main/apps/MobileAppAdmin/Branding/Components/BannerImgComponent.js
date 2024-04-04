import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card, Icon, IconButton } from "@material-ui/core";
import { Link } from "react-router-dom";
import clsx from "clsx";
import logo from "assets/images/logo/logo 2.png";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},
  horiDiv: {
    float: "left",
    clear: "none",
    // width: '45%'
  },
}));

const BannerImgComponent = (props) => {
  const classes = useStyles();

  return (
    <Card
      className="brand-banners-card"
      style={{ padding: "15px", marginTop: "15px", boxShadow: "none" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ paddingTop: "10px" }}>
          <span className="font">Collection Image </span>
          {props.num}
        </div>
        <div style={{ paddingTop: "10px" }}>
          <IconButton
            style={{ padding: "0", float: "right" }}
            onClick={(ev) => {
              ev.preventDefault();
              ev.stopPropagation();
              props.viewHandler(props.row, 3);
            }}
          >
            <Icon className="mr-8 view-icone">
              <img src={Icones.view} alt="" />
            </Icon>
          </IconButton>
          <IconButton
            style={{ padding: "0", float: "right" }}
            onClick={(ev) => {
              ev.preventDefault();
              ev.stopPropagation();
              props.deleteHandler(props.row.id, 3);
            }}
          >
            <Icon className="mr-8 delete-icone">
              <img src={Icones.delete_red} alt="" />
            </Icon>
          </IconButton>

          <Link
            to={{
              pathname: "/dashboard/mobappadmin/updatebrandings",
              state: { flag: 3, isEdit: true, row: props.row },
            }}
            // to="#"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <IconButton style={{ padding: "0", float: "right" }}>
              <Icon className="mr-8 edit-icone">
                <img src={Icones.edit} alt="" />
              </Icon>
            </IconButton>
          </Link>
        </div>
      </div>

      <div style={{ paddingTop: "10px" }}>
        <img
          className=" "
          src={props.row.imageUrl}
          alt="logo"
          // width={"530px"} height={"286px"}
          style={{ borderRadius: "7px" }}
        />
      </div>
    </Card>
  );
};

export default BannerImgComponent;
