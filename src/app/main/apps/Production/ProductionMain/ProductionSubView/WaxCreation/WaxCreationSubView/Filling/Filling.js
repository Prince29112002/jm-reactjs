import React from 'react'
import {
  Box,
  Checkbox,
  Chip,
  Icon,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { Delete, Edit, FlipCameraAndroid, Info, Print } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import Icones from 'assets/fornt-icons/Mainicons';

const useStyles = makeStyles((theme) => ({
  root: {},
  waxCreationTable: {
    overflowX: "auto"
  },
  table: {
    minWidth: 1500,
  },
  iconbtn: {
    fontSize: "0.8rem",
    padding: 0,
    "&:hover": {
      background: "transparent"
    },
  },
  iconsize: {
    fontSize: "2rem",
  },
  // checkbox: {
  //   ba:"#306ff1",
  // },
}))

const Filling = () => {
  const classes = useStyles();
  return (
    <div>
      <TableContainer className={classes.waxCreationTable}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell variant="head" style={{width: "50px"}}>
                <Checkbox
                  color="primary"
                />
              </TableCell>
              <TableCell variant="head" style={{width: "10%"}}>Stock Type</TableCell>
              <TableCell variant="head" style={{width: "12%"}}>Stock Code</TableCell>
              <TableCell variant="head" style={{width: "12%"}}>Category</TableCell>
              <TableCell variant="head" style={{width: "80px"}}>Purity</TableCell>
              <TableCell variant="head" style={{width: "60px"}}>QTY</TableCell>
              <TableCell variant="head" style={{width: "10%"}}>Gross Weight</TableCell>
              <TableCell variant="head" style={{width: "10%"}}>Stone Weight</TableCell>
              <TableCell variant="head" style={{width: "10%"}}>Net Weight</TableCell>
              <TableCell variant="head" style={{width: "12%"}}>Current Process</TableCell>
              <TableCell variant="head" style={{width: "12%"}}>Next Process</TableCell>
              <TableCell variant="head" style={{width: "10%"}}>Worker Name</TableCell>
              <TableCell variant="head" style={{width: "80px"}}>Transit</TableCell>
              <TableCell variant="head" style={{width: "12%"}}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <Checkbox
                  color="primary"
                  className={classes.checkbox}
                />
              </TableCell>
              <TableCell>
                Lot
              </TableCell>
              <TableCell>
                N214070101.2
              </TableCell>
              <TableCell>
                FN Mens Rings
              </TableCell>
              <TableCell>
                75.10
              </TableCell>
              <TableCell>
                12
              </TableCell>
              <TableCell>
                45
              </TableCell>
              <TableCell>
                245.120
              </TableCell>
              <TableCell>
                233.000
              </TableCell>
              <TableCell>
                Wax Creation
              </TableCell>
              <TableCell>
                Wax Setting
              </TableCell>
              <TableCell>
                
              </TableCell>
              <TableCell>
                <Chip label={"IN"} size="small" />
              </TableCell>
              <TableCell>
                <Box>
                  {/* <IconButton className={classes.iconbtn}>
                    <FlipCameraAndroid className={classes.iconsize}/>
                  </IconButton> */}
                  <IconButton className={classes.iconbtn}>
                  <Icon className="mr-8 edit-icone">
                                    <img src={Icones.edit} alt="" />
                                  </Icon>                  </IconButton>
                  {/* <IconButton className={classes.iconbtn}>
                    <Print className={classes.iconsize} />
                  </IconButton> */}
                  <IconButton className={classes.iconbtn}>
                  <Icon className="mr-8 delete-icone">
                                    <img src={Icones.delete_red} alt="" />
                                  </Icon>                  </IconButton>
                  {/* <IconButton className={classes.iconbtn}>
                    <Info className={classes.iconsize} />
                  </IconButton> */}
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default Filling
