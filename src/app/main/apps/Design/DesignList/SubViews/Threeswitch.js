import React from "react";

function Threeswitch({id, switchPosition, setSwitchPosition, animation, setAnimation}) {    
    const getSwitchAnimation = (value) => {
        let newAnimation = null;
        if (value === 'center' && switchPosition === 'left') {
          newAnimation = "left_to_center"
        } else if (value === 'right' && switchPosition === 'center') {
          newAnimation = "center_to_right"
        } else if (value === 'center' && switchPosition === 'right') {
          newAnimation = "right_to_center"
        } else if (value === 'left' && switchPosition === 'center') {
          newAnimation = "center_to_left"
        } else if (value === 'right' && switchPosition === 'left') {
          newAnimation = "left_to_right"
        } else if (value === 'left' && switchPosition === 'right') {
          newAnimation = "right_to_left"
        }
    
        setSwitchPosition(value);
        setAnimation(newAnimation);
        
    };
  return (
    <div className="threesteptoggle">
      <div className={`switch ${animation} ${switchPosition}-position`}></div>
      <input
        defaultChecked
        name="map-switch"
        id={`left-${id}`}
        type="radio"
        value="left"
        onChange={(e) => getSwitchAnimation(e.target.value)}
      />
      <label className={`left-label ${switchPosition}-position`} htmlFor={`left-${id}`}>
        N
      </label>
      <input
        name="map-switch"
        id={`center-${id}`}
        type="radio"
        value="center"
        onChange={(e) => getSwitchAnimation(e.target.value)}
      />
      <label className={`left-label`} htmlFor={`center-${id}`}>
        
      </label>
      <input
        name="map-switch"
        id={`right-${id}`}
        type="radio"
        value="right"
        onChange={(e) => getSwitchAnimation(e.target.value)}
      />
      <label className={`left-label`} htmlFor={`right-${id}`}>
        Y
      </label>
    </div>
  );
};

export default Threeswitch;
