import React from "react";

const FooterPrint = () => {
    const myprofileData = localStorage.getItem("myprofile")
    ? JSON.parse(localStorage.getItem("myprofile"))
    : {};
    return (
        <>
            <div
                style={{
                    width: "805px",
                    height: "75px",
                    margin: 5
                }}
            >
            {
              myprofileData.terms_and_conditions_flag && <><p>Terms and conditions</p><p>{myprofileData.terms_and_conditions && myprofileData.terms_and_conditions}</p></>
            }
        </div >
        </>
    )
}

export default FooterPrint