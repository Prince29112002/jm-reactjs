import React from "react";
import VKjLoader from "./VKJLoader.gif";

const Loader = () => {
  return (
    <div
      className="loader-main-dv"
      style={{
        position: "absolute",
        height: "100vh",
        width: "100%",
        justifyContent: "center",
        display: "flex",
      }}
    >
      <div
        className="custom-loader "
        style={{
          alignSelf: "center",
          zIndex: "999",
          background: "#fff",
          borderRadius: "50%",
        }}
      ></div>
    </div>
  );
};

export default Loader;
