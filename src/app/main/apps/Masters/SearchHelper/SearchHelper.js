import React, { useState } from "react";
import { TextField} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {},
  searchBox: {
    padding: 8,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
    width: "424px",
    height: "40px",
  },
}));
const Search = (props) => {
  const classes = useStyles();
  const [searchField, setSearchField] = useState("");

  const handleChange = (e) => {
    setSearchField(e.target.value);
    props.onSearch(e.target.value);
  };

  return (
    <TextField
    className={classes.searchBox}
      type="search"
      placeholder=""
      onChange={handleChange}
      value={searchField}
      variant="outlined"
      fullWidth
    />
  );
};

export default Search;
