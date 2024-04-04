import {
    Grid,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
  } from "@material-ui/core";
  import * as React from "react";
  export class SplitMultiLotPrint extends React.PureComponent {
    componentDidMount() {}
  
    render() {
      const { printObj } = this.props;
      // const printObj = {
      //   Main_lot_number: "NC241030014.1",
      //   Date_time: "27-03-2024 12:06 PM",
      //   Department_name: "Production",
      //   Process_name: "Wax Creation",
      //   purity: "58.5",
      //   ActivityNumber: "ACT20240327120617",
      //   NewLotData: [
      //     {
      //       LotID: 123,
      //       NewLotNumber: "NC241030014.1.1",
      //       BatchNumber: "NC241030014-001",
      //       DesignPcs: 2,
      //       StoneWeignt: "0.000000",
      //       GrossWeight: "0.000",
      //       NetWeight: "0.000",
      //       Purity: "58.5",
      //       lot_category: "FN Couple Ladies Ring",
      //     },
      //     {
      //       LotID: 124,
      //       NewLotNumber: "NC241030014.1.2",
      //       BatchNumber: "NC241030014-002",
      //       DesignPcs: 2,
      //       StoneWeignt: "0.000000",
      //       GrossWeight: "0.000",
      //       NetWeight: "0.000",
      //       Purity: "58.5",
      //       lot_category: "FN Couple Ladies Ring",
      //     },
      //     {
      //       LotID: 125,
      //       NewLotNumber: "NC241030014.1.3",
      //       BatchNumber: "NC241030014-003",
      //       DesignPcs: 2,
      //       StoneWeignt: "0.000000",
      //       GrossWeight: "0.000",
      //       NetWeight: "0.000",
      //       Purity: "58.5",
      //       lot_category: "FN Couple Ladies Ring",
      //     },
      //   ],
      // };
      console.log(printObj);
      return (
        <div>
          <style type="text/css" media="print">
            {
              "\
               @page { size: A4 portrait !important;margin:10px 25px 10px 25px; }\
            "
            }
          </style>
          <div className="multi_split_print">
            <Grid container>
              <Grid item xs={12} style={{ textAlign: "center" }}>
                <b
                  style={{
                    display: "inline-block",
                    paddingRight: 8,
                  }}
                >
                  Department :
                </b>
                {Object.keys(printObj).length !== 0 && printObj.Department_name}
              </Grid>
              <Grid item xs={12} style={{ textAlign: "center" }}>
                <b
                  style={{
                    display: "inline-block",
                    paddingRight: 8,
                  }}
                >
                  Process :
                </b>
                {Object.keys(printObj).length !== 0 && printObj.Process_name}
              </Grid>
              <Grid item xs={6}>
                <b
                  style={{
                    display: "inline-block",
                    width: "110px",
                    paddingRight: 8,
                  }}
                >
                  Date :
                </b>
                {Object.keys(printObj).length !== 0 && printObj.Date_time}
              </Grid>
              <Grid item xs={6}>
                <b
                  style={{
                    display: "inline-block",
                    width: "110px",
                    paddingRight: 8,
                  }}
                >
                  Main Lot No. :
                </b>
                {Object.keys(printObj).length !== 0 && printObj.Main_lot_number}
              </Grid>
              <Grid item xs={6}>
                <b
                  style={{
                    display: "inline-block",
                    width: "110px",
                    paddingRight: 8,
                  }}
                >
                  Purity :
                </b>
                {Object.keys(printObj).length !== 0 && printObj.purity}
              </Grid>
            </Grid>
            <Table style={{ marginTop: 7 }}>
              <TableHead>
                <TableRow>
                  <TableCell className="table_pad">Sr. No.</TableCell>
                  <TableCell className="table_pad">Child Lot No.</TableCell>
                  <TableCell className="table_pad">Batch No.</TableCell>
                  <TableCell className="table_pad">Design Pcs</TableCell>
                  <TableCell className="table_pad">Stone Weight</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(printObj).length !== 0 &&
                  printObj.NewLotData.map((data, index) => {
                    console.log(data);
                    return (
                      <TableRow key={index}>
                        <TableCell className="table_pad" width={70}>
                          {index + 1}
                        </TableCell>
                        <TableCell className="table_pad">
                          {data.lot_number}
                        </TableCell>
                        <TableCell className="table_pad">
                          {data.batch_number}
                        </TableCell>
                        <TableCell className="table_pad">
                          {data.Lot_pcs}
                        </TableCell>
                        <TableCell className="table_pad">
                          {parseFloat(data.stone_weight).toFixed(3)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
        </div>
      );
    }
  }
  
  export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
    // eslint-disable-line max-len text={props.text}
    return <SplitMultiLotPrint ref={ref} printObj={props.printObj} />;
  });
  