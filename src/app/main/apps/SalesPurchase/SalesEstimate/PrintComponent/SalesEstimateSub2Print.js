import * as React from "react";
import { ToWords } from 'to-words';
import Config from "app/fuse-configs/Config";



export class SalesEstimateSub2Print extends React.PureComponent {

    render() {
        // const { text } = this.props;
        const { printObj } = this.props;
        const toWords = new ToWords({
            localeCode: 'en-IN',
            converterOptions: {
                currency: true,
                ignoreDecimal: false,
                ignoreZeroCurrency: false,
                doNotAddOnly: false,
            }
        });

        // const theme = useTheme();
        return (
            <div style={{ border: "1px solid black" }} >
                <h1 style={{ textAlign: "center" }}>PackingSlip</h1>
                <table className="table-class">


                    <style type="text/css" media="print">
                        {"\
                        @page { size: A5 landscape !important; margin:10px; }\
                    "}
                    </style>



                    <thead >
                        <tr >
                            <th className="table-class" >Packet No</th>
                            <th className="table-class" >Packing Slip Number</th>
                            <th className="table-class" >Category</th>
                            <th className="table-class" >Barcode</th>
                            <th className="table-class" >Design No</th>
                            <th className="table-class" >Purity.</th>
                            <th className="table-class" >Pcs</th>
                            <th className="table-class" >Size</th>
                            <th className="table-class" >Gross Wt</th>
                            <th className="table-class" >Net Wt</th>
                            <th className="table-class" >Wastage percentage</th>
                            <th className="table-class" >Stone Wt</th>
                            <th className="table-class" >BeadsWt</th>
                            <th className="table-class" >Solitaire Wt</th>
                            <th className="table-class" >Oth wt</th>
                            <th className="table-class" >HM Before Disc</th>
                            <th className="table-class" >HM After Disc</th>
                            <th className="table-class" >Amount Before Discount</th>
                            <th className="table-class" >Amount After Discount</th>
                            <th className="table-class" >HUID</th>

                        </tr>
                    </thead>
                    <tbody>
                        {printObj.orderDetail.map((row, index) => (

                            <tr key={index}>
                                <td className="table-class-data" > {row.Packet_No}</td>
                                <td className="table-class-data" > {row.Packing_Slip_number}</td>
                                <td className="table-class-data" > {row.Category}</td>
                                <td className="table-class-data" > {row.Barcode}</td>
                                <td className="table-class-data" > {row.Design_No}</td>
                                <td className="table-class-data" > {row.Purity}</td>
                                <td className="table-class-data" > {row.Pcs !== null ? row.Pcs : ""}</td>
                                <td className="table-class-data" > {row.Size}</td>
                                <td className="table-class-data" > {(row.Gross_Wt) !== null ? row.Gross_Wt : ""}</td>
                                <td className="table-class-data" > {row.Net_Wt !== null ? row.Net_Wt : ""}</td>
                                <td className="table-class-data" > {row.Wastage_percentage}</td>
                                <td className="table-class-data" > {row.Stone_Wt !== null ? row.Stone_Wt : ""}</td>
                                <td className="table-class-data" > {row.Beads_Wt !== null ? row.Beads_Wt : ""}</td>
                                <td className="table-class-data" > {row.Solitaire_Wt !== null ? row.Solitaire_Wt : ""}</td>
                                <td className="table-class-data" > {row.Oth_wt}</td>
                                <td className="table-class-data" > {row.HM_Before_Disc}</td>
                                <td className="table-class-data" > {row.HM_After_Disc}</td>
                                <td className="table-class-data" > {row.Amount_Before_Discount}</td>
                                <td className="table-class-data" > {row.Amount_After_Discount}</td>
                                <td className="table-class-data" > {row.HUID}</td>

                            </tr>

                        ))}


                    </tbody>
                    {/* <tfoot >  
<tr >
              
                    <td className="table-class"> <b>Total</b></td>
                    <td className="table-class"> &nbsp;</td>
                    <td className="table-class"> &nbsp;</td>
                    <td className="table-class"> &nbsp;</td>
                    <td className="table-class"> &nbsp;</td>
                    <td className="table-class"> &nbsp;</td>
                    <td className="table-class"> {printObj.pcstotal}</td>
                    <td className="table-class"> &nbsp;</td>
                    <td className="table-class"> {printObj.grossWtTOt}</td>
                    <td className="table-class"> {printObj.netWtTOt}</td>
                    <td className="table-class"> &nbsp;</td>
                    <td className="table-class"> {printObj.stonWtTot}</td>
                    <td className="table-class"> {printObj.beadswgtTot}</td>
                    <td className="table-class"> {printObj.sol_wgtTot}</td>
                    <td className="table-class"> {printObj.totalother_wgt}</td>
                    <td className="table-class"> &nbsp;</td>
                    <td className="table-class"> &nbsp;</td>
                    <td className="table-class"> &nbsp;</td>
                    <td className="table-class"> &nbsp;</td>
                    <td className="table-class"> &nbsp;</td>
                    </tr>
                 

                    </tfoot> */}

                </table>
            </div>
        );
    }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
    // eslint-disable-line max-len text={props.text}
    return <SalesEstimateSub2Print ref={ref} printObj={props.printObj} />;
});
