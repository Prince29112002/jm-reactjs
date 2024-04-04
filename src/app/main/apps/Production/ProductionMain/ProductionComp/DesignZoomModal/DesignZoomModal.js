import React from "react";

const DesignZoomModal = ({ imgPath }) => {
  return (
    <div className="imgModal">
      <div className="modal_inner">
        <img alt="design img" src={imgPath} />
      </div>
      <img alt="design img" src={imgPath} style={{ height: "50px" }} />
    </div>
  );
};

export default DesignZoomModal;
