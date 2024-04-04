import * as React from "react";
import { useReactToPrint } from "react-to-print";

import { ComponentToPrint } from "./ComponentToPrint";

const TempPrint = () => {
  const componentRef = React.useRef(null);

  const onBeforeGetContentResolve = React.useRef(null);

  const [loading, setLoading] = React.useState(false);
  const [text, setText] = React.useState("old boring text");

  const handleAfterPrint = React.useCallback(() => {
  }, []);

  const handleBeforePrint = React.useCallback(() => {
  }, []);

  const handleOnBeforeGetContent = React.useCallback(() => {
    setLoading(true);
    setText("Loading new text...");

    return new Promise((resolve) => {
      onBeforeGetContentResolve.current = resolve;

      setTimeout(() => {
        setLoading(false);
        setText("New, Updated Text!");
        resolve();
      }, 10);
    });
  }, [setLoading, setText]);

  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "AwesomeFileName",
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    removeAfterPrint: true
  });

  React.useEffect(() => {
    if (
      text === "New, Updated Text!" &&
      typeof onBeforeGetContentResolve.current === "function"
    ) {
      onBeforeGetContentResolve.current();
    }
  }, [onBeforeGetContentResolve.current, text]);

  return (
    <div>
      {loading && <p className="indicator">onBeforeGetContent: Loading...</p>}
      <button onClick={handlePrint} className="my-16">
        Print using a Functional Component with the useReactToPrint hook
      </button>
      {/* <div style={{ display: "none" }}> */}
      <ComponentToPrint ref={componentRef} text={text} />
      {/* </div> */}
    </div>
  );
};

export default TempPrint;
