import React, { useState } from "react";
import { Typography, LinearProgress } from "@material-ui/core";
import { useTimeout } from "@fuse/hooks";
import PropTypes from "prop-types";

function FuseLoading(props) {
  const [showLoading, setShowLoading] = useState(!props.delay);

  useTimeout(() => {
    setShowLoading(true);
  }, props.delay);

  if (!showLoading) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
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
    </div>
  );
}

FuseLoading.propTypes = {
  delay: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
};

FuseLoading.defaultProps = {
  delay: false,
};

export default FuseLoading;
