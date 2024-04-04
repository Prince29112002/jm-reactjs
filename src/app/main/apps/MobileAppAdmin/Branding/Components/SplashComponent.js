import React from "react";
import { Card, Icon, IconButton } from "@material-ui/core";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Icones from "assets/fornt-icons/Mainicons";


const SplashComponent = (props) => {
  // const classes = useStyles();

  return (
    <>
      <Card
        className="card"
        style={{ padding: "15px", marginTop: "15px", boxShadow: "none" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ paddingTop: "10px" }}>
            <span className="font-700">Titile: </span>
            {props.row.title}
          </div>
          <div style={{ paddingTop: "10px" }}>
           
            <IconButton
              style={{ padding: "0", float: "right" }}
              onClick={(ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                props.deleteHandler(props.row.id, 1);
              }}
            >
              <Icon className="mr-8 delete-icone">
                <img src={Icones.delete_red} alt="" />
              </Icon>
            </IconButton>

            <IconButton
              style={{ padding: "0", float: "right" }}
              onClick={(ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                props.viewHandler(props.row, 1);
              }}
            >
              <Icon className="mr-8 view-icone">
                <img src={Icones.view} alt="" />
              </Icon>
            </IconButton>
    
            <Link
              to={{
                pathname: "/dashboard/mobappadmin/updatebrandings",
                state: { flag: 1, isEdit: true, row: props.row },
              }}
              // to="#"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <IconButton style={{ padding: "0", float: "right" }}>
                {/* <Icon className="mr-8 edit-icone">
                  <img src={Icones.edit} alt="" />
                </Icon> */}
                <Icon className="ml-8" style={{ color: "dodgerblue" }}>
                  create
                </Icon>
              </IconButton>
            </Link>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            paddingTop: "10px",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              paddingTop: "10px",
              width: "310px",
              height: "113px",
              font: "normal normal normal 14px/24px",
              letterSpacing: "0.06px",
              color: "#242424",
            }}
          >
            <span className="font-700">Description: </span>

            {props.row.description}
          </div>
          <div>
            <img
              className=" "
              src={props.row.imageUrl}
              alt="logo"
              width={"200px"}
              height={"206px"}
              style={{ borderRadius: "7px" }}
            />
          </div>
        </div>
      </Card>
    </>
  );
};

export default SplashComponent;
