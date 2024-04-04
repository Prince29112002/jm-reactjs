class Config {

  static getCommonUrl() {
    return "https://uat.api.jewelmaker.it/";
  }
  static getS3Url() {
    return "https://jewelmakerit.s3.ap-south-1.amazonaws.com/"
  }
  static getCatalogUrl() {
    return "https://uat.catalogue.jewelmaker.it/"
    //return "https://catalogue.vkjewels.net/"
  }
  static getjvmLogo() {
    const siteSetData = localStorage.getItem("siteSetting")
    ? JSON.parse(localStorage.getItem("siteSetting"))
    : [];
    return  `https://jewelmakerit.s3.ap-south-1.amazonaws.com/vkjdev/siteSetting/image/${siteSetData.image_file}`
  }
  static numWithComma(num) {
    if (isNaN(num) || num === "") {
      return "";
    }
    const n1 = parseFloat(num);
    return n1.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  static numWithoutDecimal(num) {
    if (isNaN(num) || num === "") {
      return "";
    }
    const n1 = parseFloat(num);
    return n1.toLocaleString("en-IN");
  }
  
  static idDesigner(){
    return localStorage.getItem("isDesigner") == "true"
  }
  static checkFile(arr, type) {
    let result = true
    for (let i = 0; i < arr.length; i++) {
      if (type == "image") {
        let type1 = arr[i].type.split("/")
        if (type1[0] != type) {
          return false
        }
      } else {
        if (arr[i].type != type) {
          result = false
        }
      }
    }
    return result
  }
  static getDesignationList() {
    const roles = [
      "Director",
      "Managing Director",
      "CEO",
      "General Manager",
      "Proprietor",
      "Partner",
      "CFO",
      "Purchase Manager",
      "Purchase Head",
      "Salesman",
      "Other",
    ];
    return roles;
  }
}

export default Config;
