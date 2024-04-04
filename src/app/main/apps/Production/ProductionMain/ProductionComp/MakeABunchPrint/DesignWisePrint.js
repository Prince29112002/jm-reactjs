import * as React from "react";
import { ToWords } from "to-words";
// import Config from "app/fuse-configs/Config";
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import QRCode from "react-qr-code";
import HelperFunc from "app/main/apps/SalesPurchase/Helper/HelperFunc";
import Config from "app/fuse-configs/Config";

export class DesignWisePrint extends React.PureComponent {
  //   componentDidMount() {
  //     // console.log("componentDidMount", this.props)
  //   }

  // setRef = (ref) => (this.canvasEl = ref);

  render() {
    const { designWiseData } = this.props;
    console.log(designWiseData);
    // const toWords = new ToWords({
    //   localeCode: "en-IN",
    //   converterOptions: {
    //     currency: true,
    //     ignoreDecimal: false,
    //     ignoreZeroCurrency: false,
    //     doNotAddOnly: false,
    //   },
    // });
    // Function to split the stockCodeDesign into parts of size 'chunkSize'
    // const designWiseData = [
    //   {
    //     lotNo: "NT244020050.1",
    //     purity: "91.8",
    //     designNo: "FNNKSE71078B",
    //     moldPcs: 8,
    //     item: "FN Necklace Earrings",
    //     batch_no: "NT244020050-001",
    //     StonePcs: 180,
    //     stockCodeDesign: [
    //       {
    //         group: "Swarovski",
    //         variant: "SRDGN120",
    //         totalStonePcs: 64,
    //         weight: "0.003",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "Swarovski",
    //         variant: "SRDGN110",
    //         totalStonePcs: 12,
    //         weight: "0.000",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZHH",
    //         variant: "HHRDW120",
    //         totalStonePcs: 88,
    //         weight: "0.003",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZHH",
    //         variant: "HHRDW115",
    //         totalStonePcs: 16,
    //         weight: "0.000",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "Swarovski",
    //         variant: "SRDGN120",
    //         totalStonePcs: 64,
    //         weight: "0.003",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "Swarovski",
    //         variant: "SRDGN110",
    //         totalStonePcs: 12,
    //         weight: "0.000",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZHH",
    //         variant: "HHRDW120",
    //         totalStonePcs: 88,
    //         weight: "0.003",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZHH",
    //         variant: "HHRDW115",
    //         totalStonePcs: 16,
    //         weight: "0.000",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "Swarovski",
    //         variant: "SRDGN120",
    //         totalStonePcs: 64,
    //         weight: "0.003",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "Swarovski",
    //         variant: "SRDGN110",
    //         totalStonePcs: 12,
    //         weight: "0.000",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZHH",
    //         variant: "HHRDW120",
    //         totalStonePcs: 88,
    //         weight: "0.003",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZHH",
    //         variant: "HHRDW115",
    //         totalStonePcs: 16,
    //         weight: "0.000",
    //         type_of_setting: "WAX",
    //       },
    //     ],
    //   },
    //   {
    //     lotNo: "NT244020050.1",
    //     purity: "91.8",
    //     designNo: "FNNKSEHH002B",
    //     moldPcs: 12,
    //     item: "FN Necklace Earrings",
    //     batch_no: "NT244020050-002",
    //     StonePcs: 592,
    //     stockCodeDesign: [
    //       {
    //         group: "CZHH",
    //         variant: "HHRDW115",
    //         totalStonePcs: 176,
    //         weight: "0.003",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZH",
    //         variant: "HRDW130",
    //         totalStonePcs: 28,
    //         weight: "0.004",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZ",
    //         variant: "CRDRUD110",
    //         totalStonePcs: 88,
    //         weight: "0.001",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "Swarovski",
    //         variant: "SRDGN110",
    //         totalStonePcs: 44,
    //         weight: "0.002",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "Swarovski",
    //         variant: "SRDGN100",
    //         totalStonePcs: 64,
    //         weight: "0.001",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZHH",
    //         variant: "HHRDW100",
    //         totalStonePcs: 64,
    //         weight: "0.002",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZHH",
    //         variant: "HHRDW110",
    //         totalStonePcs: 88,
    //         weight: "0.003",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZH",
    //         variant: "HRDW140",
    //         totalStonePcs: 40,
    //         weight: "0.011",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZHH",
    //         variant: "HHRDW115",
    //         totalStonePcs: 176,
    //         weight: "0.003",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZH",
    //         variant: "HRDW130",
    //         totalStonePcs: 28,
    //         weight: "0.004",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZ",
    //         variant: "CRDRUD110",
    //         totalStonePcs: 88,
    //         weight: "0.001",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "Swarovski",
    //         variant: "SRDGN110",
    //         totalStonePcs: 44,
    //         weight: "0.002",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "Swarovski",
    //         variant: "SRDGN100",
    //         totalStonePcs: 64,
    //         weight: "0.001",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZHH",
    //         variant: "HHRDW100",
    //         totalStonePcs: 64,
    //         weight: "0.002",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZHH",
    //         variant: "HHRDW110",
    //         totalStonePcs: 88,
    //         weight: "0.003",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZH",
    //         variant: "HRDW140",
    //         totalStonePcs: 40,
    //         weight: "0.011",
    //         type_of_setting: "WAX",
    //       },
    //     ],
    //   },
    //   {
    //     lotNo: "NT244020050.1",
    //     purity: "91.8",
    //     designNo: "FNNKSE71078B",
    //     moldPcs: 8,
    //     item: "FN Necklace Earrings",
    //     batch_no: "NT244020050-001",
    //     StonePcs: 180,
    //     stockCodeDesign: [
    //       {
    //         group: "Swarovski",
    //         variant: "SRDGN120",
    //         totalStonePcs: 64,
    //         weight: "0.003",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "Swarovski",
    //         variant: "SRDGN110",
    //         totalStonePcs: 12,
    //         weight: "0.000",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZHH",
    //         variant: "HHRDW120",
    //         totalStonePcs: 88,
    //         weight: "0.003",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZHH",
    //         variant: "HHRDW115",
    //         totalStonePcs: 16,
    //         weight: "0.000",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "Swarovski",
    //         variant: "SRDGN120",
    //         totalStonePcs: 64,
    //         weight: "0.003",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "Swarovski",
    //         variant: "SRDGN110",
    //         totalStonePcs: 12,
    //         weight: "0.000",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZHH",
    //         variant: "HHRDW120",
    //         totalStonePcs: 88,
    //         weight: "0.003",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZHH",
    //         variant: "HHRDW115",
    //         totalStonePcs: 16,
    //         weight: "0.000",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "Swarovski",
    //         variant: "SRDGN120",
    //         totalStonePcs: 64,
    //         weight: "0.003",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "Swarovski",
    //         variant: "SRDGN110",
    //         totalStonePcs: 12,
    //         weight: "0.000",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZHH",
    //         variant: "HHRDW120",
    //         totalStonePcs: 88,
    //         weight: "0.003",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZHH",
    //         variant: "HHRDW115",
    //         totalStonePcs: 16,
    //         weight: "0.000",
    //         type_of_setting: "WAX",
    //       },
    //     ],
    //   },
    //   {
    //     lotNo: "NT244020050.1",
    //     purity: "91.8",
    //     designNo: "FNNKSEHH002B",
    //     moldPcs: 12,
    //     item: "FN Necklace Earrings",
    //     batch_no: "NT244020050-002",
    //     StonePcs: 592,
    //     stockCodeDesign: [
    //       {
    //         group: "CZHH",
    //         variant: "HHRDW115",
    //         totalStonePcs: 176,
    //         weight: "0.003",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZH",
    //         variant: "HRDW130",
    //         totalStonePcs: 28,
    //         weight: "0.004",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZ",
    //         variant: "CRDRUD110",
    //         totalStonePcs: 88,
    //         weight: "0.001",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "Swarovski",
    //         variant: "SRDGN110",
    //         totalStonePcs: 44,
    //         weight: "0.002",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "Swarovski",
    //         variant: "SRDGN100",
    //         totalStonePcs: 64,
    //         weight: "0.001",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZHH",
    //         variant: "HHRDW100",
    //         totalStonePcs: 64,
    //         weight: "0.002",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZHH",
    //         variant: "HHRDW110",
    //         totalStonePcs: 88,
    //         weight: "0.003",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZH",
    //         variant: "HRDW140",
    //         totalStonePcs: 40,
    //         weight: "0.011",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZHH",
    //         variant: "HHRDW115",
    //         totalStonePcs: 176,
    //         weight: "0.003",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZH",
    //         variant: "HRDW130",
    //         totalStonePcs: 28,
    //         weight: "0.004",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZ",
    //         variant: "CRDRUD110",
    //         totalStonePcs: 88,
    //         weight: "0.001",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "Swarovski",
    //         variant: "SRDGN110",
    //         totalStonePcs: 44,
    //         weight: "0.002",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "Swarovski",
    //         variant: "SRDGN100",
    //         totalStonePcs: 64,
    //         weight: "0.001",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZHH",
    //         variant: "HHRDW100",
    //         totalStonePcs: 64,
    //         weight: "0.002",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZHH",
    //         variant: "HHRDW110",
    //         totalStonePcs: 88,
    //         weight: "0.003",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZH",
    //         variant: "HRDW140",
    //         totalStonePcs: 40,
    //         weight: "0.011",
    //         type_of_setting: "WAX",
    //       },
    //     ],
    //   },
    //   {
    //     lotNo: "NT244020050.1",
    //     purity: "91.8",
    //     designNo: "FNNKSE71078B",
    //     moldPcs: 8,
    //     item: "FN Necklace Earrings",
    //     batch_no: "NT244020050-001",
    //     StonePcs: 180,
    //     stockCodeDesign: [
    //       {
    //         group: "Swarovski",
    //         variant: "SRDGN120",
    //         totalStonePcs: 64,
    //         weight: "0.003",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "Swarovski",
    //         variant: "SRDGN110",
    //         totalStonePcs: 12,
    //         weight: "0.000",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZHH",
    //         variant: "HHRDW120",
    //         totalStonePcs: 88,
    //         weight: "0.003",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZHH",
    //         variant: "HHRDW115",
    //         totalStonePcs: 16,
    //         weight: "0.000",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "Swarovski",
    //         variant: "SRDGN120",
    //         totalStonePcs: 64,
    //         weight: "0.003",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "Swarovski",
    //         variant: "SRDGN110",
    //         totalStonePcs: 12,
    //         weight: "0.000",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZHH",
    //         variant: "HHRDW120",
    //         totalStonePcs: 88,
    //         weight: "0.003",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZHH",
    //         variant: "HHRDW115",
    //         totalStonePcs: 16,
    //         weight: "0.000",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "Swarovski",
    //         variant: "SRDGN120",
    //         totalStonePcs: 64,
    //         weight: "0.003",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "Swarovski",
    //         variant: "SRDGN110",
    //         totalStonePcs: 12,
    //         weight: "0.000",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZHH",
    //         variant: "HHRDW120",
    //         totalStonePcs: 88,
    //         weight: "0.003",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZHH",
    //         variant: "HHRDW115",
    //         totalStonePcs: 16,
    //         weight: "0.000",
    //         type_of_setting: "WAX",
    //       },
    //     ],
    //   },
    //   {
    //     lotNo: "NT244020050.1",
    //     purity: "91.8",
    //     designNo: "FNNKSEHH002B",
    //     moldPcs: 12,
    //     item: "FN Necklace Earrings",
    //     batch_no: "NT244020050-002",
    //     StonePcs: 592,
    //     stockCodeDesign: [
    //       {
    //         group: "CZHH",
    //         variant: "HHRDW115",
    //         totalStonePcs: 176,
    //         weight: "0.003",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZH",
    //         variant: "HRDW130",
    //         totalStonePcs: 28,
    //         weight: "0.004",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZ",
    //         variant: "CRDRUD110",
    //         totalStonePcs: 88,
    //         weight: "0.001",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "Swarovski",
    //         variant: "SRDGN110",
    //         totalStonePcs: 44,
    //         weight: "0.002",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "Swarovski",
    //         variant: "SRDGN100",
    //         totalStonePcs: 64,
    //         weight: "0.001",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZHH",
    //         variant: "HHRDW100",
    //         totalStonePcs: 64,
    //         weight: "0.002",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZHH",
    //         variant: "HHRDW110",
    //         totalStonePcs: 88,
    //         weight: "0.003",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZH",
    //         variant: "HRDW140",
    //         totalStonePcs: 40,
    //         weight: "0.011",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZHH",
    //         variant: "HHRDW115",
    //         totalStonePcs: 176,
    //         weight: "0.003",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZH",
    //         variant: "HRDW130",
    //         totalStonePcs: 28,
    //         weight: "0.004",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZ",
    //         variant: "CRDRUD110",
    //         totalStonePcs: 88,
    //         weight: "0.001",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "Swarovski",
    //         variant: "SRDGN110",
    //         totalStonePcs: 44,
    //         weight: "0.002",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "Swarovski",
    //         variant: "SRDGN100",
    //         totalStonePcs: 64,
    //         weight: "0.001",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZHH",
    //         variant: "HHRDW100",
    //         totalStonePcs: 64,
    //         weight: "0.002",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZHH",
    //         variant: "HHRDW110",
    //         totalStonePcs: 88,
    //         weight: "0.003",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZH",
    //         variant: "HRDW140",
    //         totalStonePcs: 40,
    //         weight: "0.011",
    //         type_of_setting: "WAX",
    //       },
    //     ],
    //   },
    //   {
    //     lotNo: "NT244020050.1",
    //     purity: "91.8",
    //     designNo: "FNNKSEHH002B",
    //     moldPcs: 12,
    //     item: "FN Necklace Earrings",
    //     batch_no: "NT244020050-002",
    //     StonePcs: 592,
    //     stockCodeDesign: [
    //       {
    //         group: "CZHH",
    //         variant: "HHRDW115",
    //         totalStonePcs: 176,
    //         weight: "0.003",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZH",
    //         variant: "HRDW130",
    //         totalStonePcs: 28,
    //         weight: "0.004",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZ",
    //         variant: "CRDRUD110",
    //         totalStonePcs: 88,
    //         weight: "0.001",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "Swarovski",
    //         variant: "SRDGN110",
    //         totalStonePcs: 44,
    //         weight: "0.002",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "Swarovski",
    //         variant: "SRDGN100",
    //         totalStonePcs: 64,
    //         weight: "0.001",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZHH",
    //         variant: "HHRDW100",
    //         totalStonePcs: 64,
    //         weight: "0.002",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZHH",
    //         variant: "HHRDW110",
    //         totalStonePcs: 88,
    //         weight: "0.003",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZH",
    //         variant: "HRDW140",
    //         totalStonePcs: 40,
    //         weight: "0.011",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZHH",
    //         variant: "HHRDW115",
    //         totalStonePcs: 176,
    //         weight: "0.003",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZH",
    //         variant: "HRDW130",
    //         totalStonePcs: 28,
    //         weight: "0.004",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZ",
    //         variant: "CRDRUD110",
    //         totalStonePcs: 88,
    //         weight: "0.001",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "Swarovski",
    //         variant: "SRDGN110",
    //         totalStonePcs: 44,
    //         weight: "0.002",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "Swarovski",
    //         variant: "SRDGN100",
    //         totalStonePcs: 64,
    //         weight: "0.001",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZHH",
    //         variant: "HHRDW100",
    //         totalStonePcs: 64,
    //         weight: "0.002",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZHH",
    //         variant: "HHRDW110",
    //         totalStonePcs: 88,
    //         weight: "0.003",
    //         type_of_setting: "WAX",
    //       },
    //       {
    //         group: "CZH",
    //         variant: "HRDW140",
    //         totalStonePcs: 40,
    //         weight: "0.011",
    //         type_of_setting: "WAX",
    //       },
    //     ],
    //   },
    // ];

    const updatedDesignWiseData = [];

    designWiseData.forEach((item) => {
      const stockCodeDesignArray = item.stockCodeDesign;

      // Determine the number of iterations required to ensure each newItem has 10 stockCodeDesign entries
      const iterations = Math.ceil(stockCodeDesignArray.length / 10);

      for (let j = 0; j < iterations; j++) {
        const slicedDesigns = stockCodeDesignArray.slice(j * 10, j * 10 + 10);

        // Fill in missing entries with blank data
        const remainingEmptySlots = 10 - slicedDesigns.length;
        for (let k = 0; k < remainingEmptySlots; k++) {
          slicedDesigns.push({
            // Add properties with blank data
            // Adjust property names and blank data as per your requirement
            group: "",
            variant: "",
            totalStonePcs: "",
            weight: "",
            type_of_setting: "",
            // Add more properties as needed
          });
        }

        const newItem = {
          lotNo: item.lotNo,
          purity: item.purity,
          designNo: item.designNo,
          moldPcs: item.moldPcs,
          item: item.item,
          batch_no: item.batch_no,
          StonePcs: item.StonePcs,
          stockCodeDesign: slicedDesigns,
          design_pcs: item.design_pcs,
        };

        updatedDesignWiseData.push(newItem);
      }
    });

    console.log(updatedDesignWiseData);
    return (
      <div>
        <style type="text/css" media="print">
          {
            "\
             @page { size: A4 landscape !important;margin:30px 20px 30px 20px; }\
          "
          }
        </style>

        {/* <div style={{ height: "30px" }}></div> */}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "15px",
            fontSize: "8px",
          }}
        >
          {updatedDesignWiseData &&
            updatedDesignWiseData.map((data, index) => {
              return (
                <Box
                  style={{
                    width: "23.9%",
                    pageBreakBefore:
                      index % 12 === 0 && index !== 0 ? "always" : "auto",
                  }}
                  key={index}
                >
                  <Grid
                    container
                    style={{
                      justifyContent: "space-between",
                      padding: "5px",
                      border: "1px solid",
                      borderBottom: "none",
                      paddingBottom: "2px",
                    }}
                  >
                    <Grid item xs={5} key={index}>
                      <div>L # : {data?.lotNo}</div>
                      <div>Item : {data?.item}</div>
                      <div>
                        Purity : {data?.purity}{" "}
                        <span
                          style={{ display: "inline-block", marginLeft: 7 }}
                        >
                          Pcs : {data?.design_pcs}
                        </span>
                      </div>
                    </Grid>
                    <Grid item xs={5}>
                      <div>DNo : {data?.designNo}</div>
                      <div>B # : {data?.batch_no}</div>
                      <div>Mould Pcs : {data?.moldPcs}</div>
                    </Grid>
                    <Grid item>
                      <QRCode
                        style={{
                          height: "35px",
                          width: "35px",
                        }}
                        value={data?.batch_no}
                        viewBox={`0 0 256 256`}
                      />
                    </Grid>
                  </Grid>
                  {/* {data.stockCodeDesign.length > 0 && (
                    <> */}
                  <Table
                    style={{
                      border: "1px solid black",
                      tableLayout: "auto",
                    }}
                  >
                    <TableHead>
                      <TableRow style={{ height: 15 }}>
                        <TableCell
                          className="metal_purchase_bdr_dv"
                          style={{
                            fontSize: "8px",
                            padding: "1px",
                            textAlign: "center",
                            lineHeight: "initial",
                          }}
                        >
                          Group
                        </TableCell>
                        <TableCell
                          className="metal_purchase_bdr_dv"
                          style={{
                            fontSize: "8px",
                            padding: "1px",
                            textAlign: "center",
                            lineHeight: "initial",
                          }}
                        >
                          Variant
                        </TableCell>
                        <TableCell
                          className="metal_purchase_bdr_dv"
                          style={{
                            fontSize: "8px",
                            padding: "1px",
                            textAlign: "center",
                            lineHeight: "initial",
                          }}
                        >
                          Pcs
                        </TableCell>
                        <TableCell
                          className="metal_purchase_bdr_dv"
                          style={{
                            fontSize: "8px",
                            padding: "1px",
                            textAlign: "center",
                            lineHeight: "initial",
                          }}
                        >
                          Wt
                        </TableCell>
                        <TableCell
                          style={{
                            fontSize: "8px",
                            padding: "1px",
                            textAlign: "center",
                            lineHeight: "initial",
                          }}
                        >
                          Set Type
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* {designWiseData.length !== 0 &&
                        designWiseData?.map((data) => */}
                      {data?.stockCodeDesign.map((design, i) => {
                        console.log(design);
                        return (
                          <TableRow key={i} style={{ height: 15 }}>
                            <TableCell
                              style={{
                                fontSize: "8px",
                                padding: "1px",
                                textAlign: "center",
                              }}
                              className="metal_purchase_bdr_dv"
                            >
                              {design?.group}
                            </TableCell>
                            <TableCell
                              style={{
                                fontSize: "8px",
                                padding: "1px",
                                textAlign: "center",
                              }}
                              className="metal_purchase_bdr_dv"
                            >
                              {design?.variant}
                            </TableCell>
                            <TableCell
                              style={{
                                fontSize: "8px",
                                padding: "1px",
                                textAlign: "center",
                              }}
                              className="metal_purchase_bdr_dv"
                            >
                              {design?.totalStonePcs}
                            </TableCell>
                            <TableCell
                              style={{
                                fontSize: "8px",
                                padding: "1px",
                                textAlign: "center",
                              }}
                              className="metal_purchase_bdr_dv"
                            >
                              {design?.weight}
                            </TableCell>
                            <TableCell
                              style={{
                                fontSize: "8px",
                                padding: "1px",
                                textAlign: "center",
                              }}
                            >
                              {design?.type_of_setting}
                            </TableCell>
                          </TableRow>
                        );
                      })}

                      <TableRow style={{ backgroundColor: "#d3d3d3" }}>
                        <TableCell
                          style={{
                            fontSize: "8px",
                            padding: "1px",
                            textAlign: "center",
                            lineHeight: "initial",
                          }}
                          className="metal_purchase_bdr_dv"
                        ></TableCell>
                        <TableCell
                          style={{
                            fontSize: "8px",
                            padding: "1px",
                            textAlign: "center",
                            lineHeight: "initial",
                          }}
                          className="metal_purchase_bdr_dv"
                        >
                          <b>TOTAL</b>
                        </TableCell>
                        <TableCell
                          style={{
                            fontSize: "8px",
                            padding: "1px",
                            textAlign: "center",
                            lineHeight: "initial",
                          }}
                          className="metal_purchase_bdr_dv"
                        >
                          <b>
                            {Config.numWithoutDecimal(
                              HelperFunc.getTotalOfFieldNoDecimal(
                                data?.stockCodeDesign,
                                "totalStonePcs"
                              )
                            )}
                          </b>
                        </TableCell>
                        <TableCell
                          style={{
                            fontSize: "8px",
                            padding: "1px",
                            textAlign: "center",
                            lineHeight: "initial",
                          }}
                          className="metal_purchase_bdr_dv"
                        >
                          <b>
                            {Config.numWithComma(
                              HelperFunc.getTotalOfField(
                                data?.stockCodeDesign,
                                "weight"
                              )
                            )}
                          </b>
                        </TableCell>
                        <TableCell
                          style={{
                            fontSize: "8px",
                            padding: "1px",
                            textAlign: "center",
                            lineHeight: "initial",
                          }}
                        ></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  {/* </>
                  )} */}
                  {/* {innerIndex + 1 < data.stockCodeDesign.length && (
                    <hr /> 
                  )} */}
                </Box>
              );
            })}
        </div>
      </div>
    );
  }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
  // eslint-disable-line max-len text={props.text}
  return <DesignWisePrint ref={ref} designWiseData={props.designWiseData} />;
});
