import React from "react";
// import SilverAura from "../../../../../../assets/images/Login Vector/silver_aura.png"
import SilverAura from "../../../../../assets/images/Login Vector/silver_aura.png"

const HeaderPrint = () => {
    const myprofileData = localStorage.getItem("myprofile")
        ? JSON.parse(localStorage.getItem("myprofile"))
        : {};
    return (
        <>
         <div
              style={{
                // display: "flex",
                // width: "100%",
                // justifyContent: "space-around",
                padding: "5px",
                height: "106px",
                backgroundColor: myprofileData.is_header_image_flag === 1 ? "#cc017e" : "transparent",
                color: myprofileData.is_header_image_flag === 1 ? "#FFFFFF" : "inherit"
              }}
            >
            {myprofileData.top_header_name_flag && <h5 style={{ textAlign: "center", fontWeight: 500 , color : myprofileData?.is_mortgage_print === 1 && 'red'}}>{myprofileData.top_header_name && myprofileData.top_header_name}</h5>}

            <div style={{ display: "flex", justifyContent: "space-between", width: "100%" , height: "75px" ,alignItems:"flex-end"}}>
                <div style={{ flexBasis: "33.33%" }}>
                    {myprofileData.name_flag && <h5 style={{ fontWeight: 500 }}>{myprofileData.name && myprofileData.name}</h5>}
                    {myprofileData.email_flag && <h5 style={{ fontWeight: 500 }}>{myprofileData.email && myprofileData.email}</h5>}
                    {myprofileData.mobile_no_flag || myprofileData.phone_no_flag ? <h5 style={{fontWeight: 500}}>{myprofileData.mobile_no_flag && myprofileData.mobile_no && myprofileData.mobile_no}{myprofileData.mobile_no_flag && myprofileData.phone_no_flag ? "," : ''}{myprofileData.phone_no_flag && myprofileData.phone_no && myprofileData.phone_no} </h5> : ''}  
                </div>
                <div style={{ flexBasis: "33.33%", alignSelf:"flex-start" }}>
                    {myprofileData.firm_name_flag && <h2 style={{ textAlign: "center" }}>{myprofileData.firm_name && myprofileData.firm_name}</h2>}
                    {myprofileData.voucher_logo && 
                    <img src={myprofileData.voucher_logo} alt="" width="auto" height="50px" style={{display: "block", marginInline:"auto", marginTop: 5}} /> 
                    } 
                </div>
                <div style={{ flexBasis: "33.33%", textAlign: "right" }}>
                    {myprofileData.address_flag && <h5 style={{ fontWeight: 500 }}>{myprofileData.address && myprofileData.address}</h5>}
                    {myprofileData.state_flag && <h5 style={{ fontWeight: 500 }}>{myprofileData.StateName && myprofileData.StateName.name}</h5>}
                    {myprofileData.city_flag || myprofileData.pincode_flag ? <h5 style={{fontWeight: 500}}>{myprofileData.city_flag && myprofileData.CityName && myprofileData.CityName.name} {myprofileData.city_flag && myprofileData.pincode_flag ? "-" :''} {myprofileData.pincode_flag && myprofileData.pincode && myprofileData.pincode}</h5> : ''}
                </div>
            </div>
            </div>
        </>
    )
}

export default HeaderPrint