import "typeface-muli";

import "./styles/index.css";
import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import App from "app/App";
import "./styles/AllModuleCss/ReportModuleCss/Report.css";
import "./styles/AllModuleCss/ReportModuleCss/MetalLedStatement.css";
import "./styles/AllModuleCss/TaggingModuleCss/TagMakingLot.css";
import "./styles/AllModuleCss/TaggingModuleCss/ReGenBarcode.css";
import "./styles/AllModuleCss/MasterRetailerCss/MasterRetailerTable.css";

ReactDOM.render(<App />, document.getElementById("root"));

serviceWorker.unregister();
