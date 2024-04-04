import moment from "moment";

const HelperFunc = {
  getTotalOfFieldNoDecimal: function (arrayList, key) {
    return parseFloat(
      arrayList
        .filter((item) => item[key] !== "")
        .map((item) => parseFloat(item[key]))
        .reduce(function (a, b) {
          return parseFloat(a) + parseFloat(b);
        }, 0)
    );
  },

  getTotalOfField: function (arrayList, key) {
    return parseFloat(
      arrayList
        .filter((item) => item[key] !== "" && item[key] !== null)
        .map((item) => parseFloat(item[key]))
        .reduce(function (a, b) {
          return parseFloat(a) + parseFloat(b);
        }, 0)
    ).toFixed(3);
  },

  getTotalOfTwoFields: function (arrayList, key1, key2) {
    return parseFloat(
      arrayList
        .filter(
          (item) =>
            item[key1] !== "" &&
            item[key1] !== null &&
            item[key2] !== "" &&
            item[key2] !== null
        )
        .map((item) => parseFloat(item[key1]) + parseFloat(item[key2]))
        .reduce(function (a, b) {
          return parseFloat(a) + parseFloat(b);
        }, 0)
    ).toFixed(3);
  },

  getTotalOfFieldTwoDecimal: function (arrayList, key) {
    return parseFloat(
      arrayList
        .filter((item) => item[key] !== "" && item[key] !== null)
        .map((item) => parseFloat(item[key]))
        .reduce(function (a, b) {
          return parseFloat(a) + parseFloat(b);
        }, 0)
    ).toFixed(2);
  },

  getTotalOfMultipliedFields: function (arrayList, firstKey, secondKey) {
    console.log(arrayList, firstKey, secondKey);

    return parseFloat(
      arrayList
        .filter(
          (item) =>
            item[firstKey] !== "" &&
            item[firstKey] !== null &&
            item[secondKey] !== "" &&
            item[secondKey] !== null
        )
        .map((item) => parseFloat(item[firstKey]) * parseFloat(item[secondKey]))
        .reduce((a, b) => parseFloat(a) + parseFloat(b), 0)
    ).toFixed(3);
  },

  getOppositeAccountDetails: function (key) {
    var apiRes = JSON.parse(window.localStorage.getItem("oppositeAccount"));
    let oppositeAcc = [];
    if (apiRes === null) {
      return oppositeAcc; //blank array
    }
    for (let item of Object.keys(apiRes)) {
      var data = apiRes[item];
      if (item === key) {
        for (let i of Object.keys(data)) {
          let dt = data[i];
          oppositeAcc.push({
            value: dt,
            label: i,
          });
        }
      }
    }

    return oppositeAcc;
  },

  packingSlipViewDataSalesJobwork: function (
    data,
    fineRate,
    stateId,
    jobWorkerGst
  ) {
    let packingSlipArr = [];
    let packetDataArr = [];
    let ProductDataArr = [];
    let tagWiseDataArr = [];
    let bomDataArr = [];

    for (let one of data) {
      let tempPackingSlip = one.PackingSlip;
      let tempPacketData = one.packetData;
      let tempProductData = one.productData;
      let temCategoryData = one.categoryData;

      let wastFine = parseFloat(
        (parseFloat(tempPackingSlip.net_wgt) *
          parseFloat(tempPackingSlip.wastage)) /
          100
      ).toFixed(3);

      let wastFineAmt = parseFloat(
        (parseFloat(wastFine) * parseFloat(fineRate)) / 10
      ).toFixed(3);

      let tolAmt = parseFloat(
        parseFloat(wastFineAmt) + parseFloat(tempPackingSlip.other_amt)
      ).toFixed(3);

      let labourRate = parseFloat(
        parseFloat(tolAmt) / parseFloat(tempPackingSlip.net_wgt)
      ).toFixed(3);

      let newTemp = {
        ...tempPackingSlip,
        NoOfPacket: tempPacketData.length,
        billingCategory: tempProductData[0].billing_category_name,
        wastageFine: wastFine,
        wastageFineAmount: wastFineAmt,
        labourRate: labourRate,
        totalAmount: tolAmt,
      };

      packingSlipArr.push(newTemp);

      const newTempPacketData = tempPacketData.map((item) => {
        let wastFine = parseFloat(
          (parseFloat(item.net_wgt) * parseFloat(newTemp.wastage)) / 100
        ).toFixed(3);

        let wastFineAmt = parseFloat(
          (parseFloat(wastFine) * parseFloat(fineRate)) / 10
        ).toFixed(3);

        let tolAmt = parseFloat(
          parseFloat(wastFineAmt) + parseFloat(item.other_amt)
        ).toFixed(3);

        let labourRate = parseFloat(
          parseFloat(tolAmt) / parseFloat(item.net_wgt)
        ).toFixed(3);

        return {
          ...item,
          billingCategory: tempProductData[0].billing_category_name,
          wastage: newTemp.wastage,
          wastageFine: wastFine,
          wastageFineAmount: wastFineAmt,
          labourRate: labourRate,
          totalAmount: tolAmt,
        };
      });

      packetDataArr.push(...newTempPacketData);

      const newTempProductData = temCategoryData.map((item) => {
        let wastFine = parseFloat(
          (parseFloat(item.net_wgt) * parseFloat(newTemp.wastage)) / 100
        ).toFixed(3);

        let wastFineAmt = parseFloat(
          (parseFloat(wastFine) * parseFloat(fineRate)) / 10
        ).toFixed(3);

        let tolAmt = parseFloat(
          parseFloat(wastFineAmt) + parseFloat(item.other_amt)
        ).toFixed(3);

        let labourRate = parseFloat(
          parseFloat(tolAmt) / parseFloat(item.net_wgt)
        ).toFixed(3);

        let cgstPer =
          stateId === 12
            ? parseFloat(parseFloat(jobWorkerGst) / 2).toFixed(3)
            : "";

        let sGstPer =
          stateId === 12
            ? parseFloat(parseFloat(jobWorkerGst) / 2).toFixed(3)
            : "";

        let IGSTper = stateId !== 12 ? parseFloat(jobWorkerGst).toFixed(3) : "";

        return {
          ...item,
          wastage: newTemp.wastage,
          wastageFine: parseFloat(wastFine).toFixed(3),
          wastageFineAmount: wastFineAmt,
          labourRate: labourRate,
          totalAmount: tolAmt,
          cgstPer: cgstPer,
          cgstVal:
            stateId === 12
              ? parseFloat(
                  (parseFloat(tolAmt) * parseFloat(cgstPer)) / 100
                ).toFixed(3)
              : "",
          sGstPer: sGstPer,
          sGstVal:
            stateId === 12
              ? parseFloat(
                  (parseFloat(tolAmt) * parseFloat(sGstPer)) / 100
                ).toFixed(3)
              : "",
          IGSTper: IGSTper,
          IGSTVal:
            stateId !== 12
              ? parseFloat(
                  (parseFloat(tolAmt) * parseFloat(IGSTper)) / 100
                ).toFixed(3)
              : "",
        };
      });

      // let temp = newTempProductData//[...productData, ...newTempProductData];

      ProductDataArr.push(...newTempProductData);
      // setProductData((productData) => [
      //   ...productData,
      //   ...newTempProductData,
      // ]);

      const tempTagWise = tempProductData.map((item) => {
        let wastFine = parseFloat(
          (parseFloat(item.net_wgt) * parseFloat(newTemp.wastage)) / 100
        ).toFixed(3);

        let wastFineAmt = parseFloat(
          (parseFloat(wastFine) * parseFloat(fineRate)) / 10
        ).toFixed(3);

        let tolAmt = parseFloat(
          parseFloat(wastFineAmt) + parseFloat(item.other_amt)
        ).toFixed(3);

        let labourRate = parseFloat(
          parseFloat(tolAmt) / parseFloat(item.net_wgt)
        ).toFixed(3);

        return {
          ...item,
          wastage: newTemp.wastage,
          wastageFine: wastFine,
          wastageFineAmount: wastFineAmt,
          labourRate: labourRate,
          totalAmount: tolAmt,
        };
      });

      tagWiseDataArr.push(...tempTagWise);

      const tempBillMaterial = tempProductData.map((item) => {
        // let metalWeight = parseFloat(item.gross_wgt) -
        // (parseFloat(item.stone_wgt) +
        //   parseFloat(item.beads_wgt) +
        //   parseFloat(item.silver_wgt) +
        //   parseFloat(item.sol_wgt) +
        //   parseFloat(item.other_wgt));

        let wastFine = parseFloat(
          (parseFloat(item.net_wgt) * parseFloat(newTemp.wastage)) / 100
        ).toFixed(3);

        // let totFine = parseFloat(
        //   (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100 +
        //     parseFloat(wastFine)
        // ).toFixed(3)

        let wastFineAmt = parseFloat(
          (parseFloat(wastFine) * parseFloat(fineRate)) / 10
        ).toFixed(3);

        let totalAmt = parseFloat(
          parseFloat(wastFineAmt) +
            parseFloat(item.stone_amt) +
            parseFloat(item.beads_amt) +
            parseFloat(item.silver_amt) +
            parseFloat(item.sol_amt) +
            parseFloat(item.other_amt)
        ).toFixed(3);

        return {
          ...item,
          wastageFineAmount: wastFineAmt,
          labourRate: labourRate,
          wastage: newTemp.wastage,
          wastageFine: wastFine,
          totalAmount: totalAmt,
        };
      });

      bomDataArr.push(...tempBillMaterial);
    }

    return {
      packingSlipArr: packingSlipArr,
      packetDataArr: packetDataArr,
      ProductDataArr: ProductDataArr,
      tagWiseDataArr: tagWiseDataArr,
      bomDataArr: bomDataArr,
    };
  },

  packingSlipViewDataSalesDomestic: function (data, fine_Rate, stateId) {
    let packingSlipArr = [];
    let packetDataArr = [];
    let ProductDataArr = [];
    let tagWiseDataArr = [];
    let bomDataArr = [];

    for (let one of data) {
      let tempPackingSlip = one.PackingSlip;
      let tempPacketData = one.packetData;
      let tempProductData = one.productData;
      let temCategoryData = one.categoryData;

      let psTotFine = parseFloat(
        (parseFloat(tempPackingSlip.net_wgt) *
          parseFloat(tempPackingSlip.purity)) /
          100 +
          (parseFloat(tempPackingSlip.net_wgt) *
            parseFloat(tempPackingSlip.wastage)) /
            100
      ).toFixed(3);

      let psHm_pcs_charge = parseFloat(
        tempPackingSlip.hallmarkChargesFrontEnd
      ).toFixed(3);

      let newTemp = {
        ...tempPackingSlip,
        hallmark_charges_pcs: psHm_pcs_charge,
        NoOfPacket: tempPacketData.length,
        billingCategory: tempProductData[0].billing_category_name,
        wastageFine: parseFloat(
          (parseFloat(tempPackingSlip.net_wgt) *
            parseFloat(tempPackingSlip.wastage)) /
            100
        ).toFixed(3),
        totalFine: psTotFine,
        fineRate: parseFloat(fine_Rate).toFixed(3),
        amount: parseFloat(
          (parseFloat(fine_Rate) * parseFloat(psTotFine)) / 10 +
            parseFloat(tempPackingSlip.other_amt)
        ).toFixed(3),
        totalAmount: parseFloat(
          (parseFloat(fine_Rate) * parseFloat(psTotFine)) / 10 +
            parseFloat(tempPackingSlip.other_amt) +
            parseFloat(psHm_pcs_charge)
        ).toFixed(3),
      };

      packingSlipArr.push(newTemp);

      const newTempPacketData = tempPacketData.map((item) => {
        let packTotFine = parseFloat(
          (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100 +
            (parseFloat(item.net_wgt) * parseFloat(tempPackingSlip.wastage)) /
              100
        ).toFixed(3);

        let packHmCharges = parseFloat(item.hallmarkChargesFrontEnd).toFixed(3);

        return {
          ...item,
          billingCategory: tempProductData[0].billing_category_name,
          wastage: tempPackingSlip.wastage,
          wastageFine: parseFloat(
            (parseFloat(item.net_wgt) * parseFloat(tempPackingSlip.wastage)) /
              100
          ).toFixed(3),
          totalFine: packTotFine,
          // fineRate: "",
          // amount: "",
          hallmark_charges: packHmCharges, // newTemp.hallmark_charges,
          // totalAmount: "",
          fineRate: parseFloat(fine_Rate).toFixed(3),
          amount: parseFloat(
            (parseFloat(fine_Rate) * parseFloat(packTotFine)) / 10 +
              parseFloat(item.other_amt)
          ).toFixed(3),
          totalAmount: parseFloat(
            (parseFloat(fine_Rate) * parseFloat(packTotFine)) / 10 +
              parseFloat(item.other_amt) +
              parseFloat(packHmCharges)
          ).toFixed(3),
        };
      });

      packetDataArr.push(...newTempPacketData);

      const newTempProductData = temCategoryData.map((item) => {
        let catTotFine = parseFloat(
          (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100 +
            (parseFloat(item.net_wgt) * parseFloat(tempPackingSlip.wastage)) /
              100
        ).toFixed(3);

        let catAmount = parseFloat(
          (parseFloat(fine_Rate) * parseFloat(catTotFine)) / 10 +
            parseFloat(item.other_amt)
        ).toFixed(3);

        let catHmcharge = parseFloat(item.hallmarkChargesFrontEnd).toFixed(3);

        let catTotalAmount = parseFloat(
          parseFloat(catAmount) + parseFloat(catHmcharge)
        ).toFixed(3);

        let catCgstPer =
          stateId === 12
            ? parseFloat(parseFloat(tempPacketData[0].gst) / 2).toFixed(3)
            : 0;

        let catSgstPer =
          stateId === 12
            ? parseFloat(parseFloat(tempPacketData[0].gst) / 2).toFixed(3)
            : "";

        let catIgstPer =
          stateId !== 12 ? parseFloat(tempPacketData[0].gst).toFixed(3) : "";

        return {
          ...item,
          gross_wgt: parseFloat(item.gross_wgt).toFixed(3),
          wastage: tempPackingSlip.wastage,
          wastageFine: parseFloat(
            (parseFloat(item.net_wgt) * parseFloat(tempPackingSlip.wastage)) /
              100
          ).toFixed(3),
          totalFine: catTotFine,
          hallmark_charges: catHmcharge,
          cgstPer: catCgstPer,
          sGstPer: catSgstPer,
          IGSTper: catIgstPer,
          fineRate: parseFloat(fine_Rate).toFixed(3),
          catRate: parseFloat(
            (((parseFloat(fine_Rate) * parseFloat(catTotFine)) / 10 +
              parseFloat(item.other_amt)) /
              parseFloat(item.net_wgt)) *
              10
          ).toFixed(3),
          amount: parseFloat(catAmount).toFixed(3),
          totalAmount: parseFloat(catTotalAmount).toFixed(3),
          IGSTVal:
            stateId !== 12
              ? parseFloat(
                  (parseFloat(catTotalAmount) * parseFloat(catIgstPer)) / 100
                ).toFixed(3)
              : "",
          cgstVal:
            stateId === 12
              ? parseFloat(
                  (parseFloat(catTotalAmount) * parseFloat(catCgstPer)) / 100
                ).toFixed(3)
              : "",
          sGstVal:
            stateId === 12
              ? parseFloat(
                  (parseFloat(catTotalAmount) * parseFloat(catSgstPer)) / 100
                ).toFixed(3)
              : "",
        };
      });

      ProductDataArr.push(...newTempProductData);

      const tempTagWise = tempProductData.map((item) => {
        let tagTotFine = parseFloat(
          (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100 +
            (parseFloat(item.net_wgt) * parseFloat(tempPackingSlip.wastage)) /
              100
        ).toFixed(3);

        let tagHmCharge = parseFloat(item.hallmarkChargesFrontEnd).toFixed(3);

        return {
          ...item,
          wastage: tempPackingSlip.wastage,
          wastageFine: parseFloat(
            (parseFloat(item.net_wgt) * parseFloat(tempPackingSlip.wastage)) /
              100
          ).toFixed(3),
          totalFine: tagTotFine,
          // fineRate: "",
          // amount: "",
          hallmark_charges: tagHmCharge,
          // totalAmount: "",
          fineRate: parseFloat(fine_Rate).toFixed(3),
          amount: parseFloat(
            (parseFloat(fine_Rate) * parseFloat(tagTotFine)) / 10 +
              parseFloat(item.other_amt)
          ).toFixed(3),
          totalAmount: parseFloat(
            (parseFloat(fine_Rate) * parseFloat(tagTotFine)) / 10 +
              parseFloat(item.other_amt) +
              parseFloat(tagHmCharge)
          ).toFixed(3),
        };
      });

      tagWiseDataArr.push(...tempTagWise);

      const tempBillMaterial = tempProductData.map((item) => {
        let bomMetWgt = parseFloat(
          parseFloat(item.gross_wgt) -
            (parseFloat(item.stone_wgt) +
              parseFloat(item.beads_wgt) +
              parseFloat(item.silver_wgt) +
              parseFloat(item.sol_wgt) +
              parseFloat(item.other_wgt))
        ).toFixed(3);

        let bomTotFine = parseFloat(
          (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100 +
            (parseFloat(item.net_wgt) * parseFloat(tempPackingSlip.wastage)) /
              100
        ).toFixed(3);

        let bomWastFine = parseFloat(
          (parseFloat(item.net_wgt) * parseFloat(tempPackingSlip.wastage)) / 100
        ).toFixed(3);

        let bomHmCharge = parseFloat(item.hallmarkChargesFrontEnd).toFixed(3);

        return {
          ...item,
          metal_wgt: bomMetWgt,
          // metal_amt: "",
          stone_wgt: parseFloat(item.stone_wgt).toFixed(3),
          wastage: tempPackingSlip.wastage,
          wastageFine: bomWastFine,
          totalFine: bomTotFine,
          hallmark_charges: bomHmCharge,
          // totalAmount: "",
          metal_amt: parseFloat(
            ((parseFloat(bomMetWgt) * parseFloat(item.purity)) / 100 +
              parseFloat(bomWastFine)) *
              (parseFloat(fine_Rate) / 10)
          ).toFixed(3),
          totalAmount: parseFloat(
            ((parseFloat(bomMetWgt) * parseFloat(item.purity)) / 100 +
              parseFloat(bomWastFine)) *
              (parseFloat(fine_Rate) / 10) +
              (parseFloat(item.stone_amt) +
                parseFloat(item.beads_amt) +
                parseFloat(item.silver_amt) +
                parseFloat(item.sol_amt) +
                parseFloat(item.other_amt) +
                parseFloat(bomHmCharge))
          ).toFixed(3),
        };
      });

      bomDataArr.push(...tempBillMaterial);
    }

    return {
      packingSlipArr: packingSlipArr,
      packetDataArr: packetDataArr,
      ProductDataArr: ProductDataArr,
      tagWiseDataArr: tagWiseDataArr,
      bomDataArr: bomDataArr,
    };
  },

  packingSlipViewDataJewelPurcReturn: function (
    data,
    fine_Rate,
    stateId,
    igstPer,
    cgstPer,
    sgstPer
  ) {
    let packingSlipArr = [];
    let packetDataArr = [];
    let ProductDataArr = [];
    let tagWiseDataArr = [];
    let bomDataArr = [];

    for (let one of data) {
      let tempPackingSlip = one.PackingSlip;
      let tempPacketData = one.packetData;
      let tempProductData = one.productData;
      let temCategoryData = one.categoryData;

      let wastFine = parseFloat(
        (parseFloat(tempPackingSlip.net_wgt) *
          parseFloat(tempPackingSlip.wastage)) /
          100
      ).toFixed(3);

      let totFine = parseFloat(
        (parseFloat(tempPackingSlip.net_wgt) *
          parseFloat(tempPackingSlip.purity)) /
          100 +
          parseFloat(wastFine)
      ).toFixed(3);

      let psHmCharge = parseFloat(
        tempPackingSlip.hallmarkChargesFrontEnd
      ).toFixed(3);

      let totAmtps = parseFloat(
        (parseFloat(fine_Rate) * parseFloat(totFine)) / 10 +
          parseFloat(tempPackingSlip.other_amt) +
          parseFloat(psHmCharge)
      ).toFixed(3);

      let psCgstPer =
        igstPer === null
          ? cgstPer //getting gst from packet data for packing slip
          : "";

      let tempCgstVal =
        igstPer === null
          ? parseFloat(
              (parseFloat(totAmtps) * parseFloat(psCgstPer)) / 100
            ).toFixed(3)
          : "";

      let psSgstPer = igstPer === null ? sgstPer : "";

      let tempSgstVal =
        igstPer === null
          ? parseFloat(
              (parseFloat(totAmtps) * parseFloat(psSgstPer)) / 100
            ).toFixed(3)
          : "";

      let psIgstPer = igstPer !== null ? igstPer : "";

      let tempIgstVal =
        igstPer !== null
          ? parseFloat(
              (parseFloat(totAmtps) * parseFloat(psIgstPer)) / 100
            ).toFixed(3)
          : "";

      let totAmt =
        igstPer === null
          ? parseFloat(
              parseFloat(totAmtps) +
                parseFloat(tempCgstVal) +
                parseFloat(tempSgstVal)
            ).toFixed(3)
          : parseFloat(parseFloat(totAmtps) + parseFloat(tempIgstVal)).toFixed(
              3
            );

      let newTemp = {
        ...tempPackingSlip,
        hallmark_charges_pcs: psHmCharge,
        NoOfPacket: tempPacketData.length,
        billingCategory: tempProductData[0].billing_category_name,
        wastageFine: wastFine,
        totalFine: totFine,
        cgstPer: psCgstPer,
        sGstPer: psSgstPer,
        IGSTper: psIgstPer,
        fineRate: parseFloat(fine_Rate).toFixed(3),
        amount: parseFloat(
          (parseFloat(fine_Rate) * parseFloat(totFine)) / 10 +
            parseFloat(tempPackingSlip.other_amt)
        ).toFixed(3),
        totalAmount: totAmtps,
        cgstVal: tempCgstVal,
        sGstVal: tempSgstVal,
        IGSTVal: tempIgstVal,
        total: totAmt,
      };

      packingSlipArr.push(newTemp);

      const newTempPacketData = tempPacketData.map((item) => {
        let packWasFine = parseFloat(
          (parseFloat(item.net_wgt) * parseFloat(tempPackingSlip.wastage)) / 100
        ).toFixed(3);

        let packTotFine = parseFloat(
          (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100 +
            parseFloat(packWasFine)
        ).toFixed(3);

        let packHmCharge = parseFloat(item.hallmarkChargesFrontEnd).toFixed(3);

        let totAmtPack = parseFloat(
          (parseFloat(fine_Rate) * parseFloat(packTotFine)) / 10 +
            parseFloat(item.other_amt) +
            parseFloat(packHmCharge)
        ).toFixed(3);

        let packCgstPer =
          igstPer === null
            ? item.cgst //getting gst from packet data for packing slip
            : "";

        let packCgstVal =
          igstPer === null
            ? parseFloat(
                (parseFloat(totAmtPack) * parseFloat(packCgstPer)) / 100
              ).toFixed(3)
            : 0;

        let packSgstPer = igstPer === null ? item.sgst : "";

        let packSgstVal =
          igstPer === null
            ? parseFloat(
                (parseFloat(totAmtPack) * parseFloat(packSgstPer)) / 100
              ).toFixed(3)
            : 0;

        let packIgstPer = igstPer !== null ? igstPer : "";

        let packIgstVal =
          igstPer !== null
            ? parseFloat(
                (parseFloat(totAmtPack) * parseFloat(packIgstPer)) / 100
              ).toFixed(3)
            : 0;

        let packTotAmt =
          igstPer === null
            ? parseFloat(
                parseFloat(totAmtPack) +
                  parseFloat(packCgstVal) +
                  parseFloat(packSgstVal)
              ).toFixed(3)
            : parseFloat(
                parseFloat(totAmtPack) + parseFloat(packIgstVal)
              ).toFixed(3);

        return {
          ...item,
          billingCategory: tempProductData[0].billing_category_name,
          wastage: tempPackingSlip.wastage,
          wastageFine: packWasFine,
          totalFine: packTotFine,
          hallmark_charges: packHmCharge, // newTemp.hallmark_charges,
          cgstPer: packCgstPer,
          sGstPer: packSgstPer,
          IGSTper: packIgstPer,
          fineRate: parseFloat(fine_Rate).toFixed(3),
          amount: parseFloat(
            (parseFloat(fine_Rate) * parseFloat(packTotFine)) / 10 +
              parseFloat(item.other_amt)
          ).toFixed(3),
          totalAmount: totAmtPack,
          cgstVal: packCgstVal,
          sGstVal: packSgstVal,
          IGSTVal: packIgstVal,
          total: packTotAmt,
        };
      });

      packetDataArr.push(...newTempPacketData);

      const newTempProductData = temCategoryData.map((item) => {
        let prodWasFine = parseFloat(
          (parseFloat(item.net_wgt) * parseFloat(tempPackingSlip.wastage)) / 100
        ).toFixed(3);

        let prodTotFine = parseFloat(
          (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100 +
            parseFloat(prodWasFine)
        ).toFixed(3);

        let prodHmCharges = parseFloat(item.hallmarkChargesFrontEnd).toFixed(3);

        let prodCgstPer =
          igstPer === null
            ? cgstPer //getting gst from packet data for packing slip
            : "";

        let prodSgstPer =
          igstPer === null
            ? sgstPer //getting gst from packet data for packing slip
            : "";

        let prodIgstPer = igstPer !== null ? igstPer : "";

        let prodAmount = parseFloat(
          (parseFloat(fine_Rate) * parseFloat(prodTotFine)) / 10 +
            parseFloat(item.other_amt)
        ).toFixed(3);

        let prodTotalAmount = parseFloat(
          parseFloat(prodAmount) + parseFloat(prodHmCharges)
        ).toFixed(3);

        let prodIgstVal =
          igstPer !== null
            ? parseFloat(
                (parseFloat(prodTotalAmount) * parseFloat(prodIgstPer)) / 100
              ).toFixed(3)
            : 0;

        let prodCgstVal =
          igstPer === null
            ? parseFloat(
                (parseFloat(prodTotalAmount) * parseFloat(prodCgstPer)) / 100
              ).toFixed(3)
            : 0;

        let prodSgstVal =
          igstPer === null
            ? parseFloat(
                (parseFloat(prodTotalAmount) * parseFloat(prodSgstPer)) / 100
              ).toFixed(3)
            : 0;

        let prodTotAmt =
          igstPer === null
            ? parseFloat(
                parseFloat(prodTotalAmount) +
                  parseFloat(prodCgstVal) +
                  parseFloat(prodSgstVal)
              ).toFixed(3)
            : parseFloat(
                parseFloat(prodTotalAmount) + parseFloat(prodIgstVal)
              ).toFixed(3);

        return {
          ...item,
          wastage: tempPackingSlip.wastage,
          wastageFine: prodWasFine,
          totalFine: prodTotFine,
          hallmark_charges: prodHmCharges,
          cgstPer: prodCgstPer,
          sGstPer: prodSgstPer,
          IGSTper: prodIgstPer,
          fineRate: parseFloat(fine_Rate).toFixed(3),
          catRate: parseFloat(
            (((parseFloat(fine_Rate) * parseFloat(prodTotFine)) / 10 +
              parseFloat(item.other_amt)) /
              parseFloat(item.net_wgt)) *
              10
          ).toFixed(3),
          amount: parseFloat(prodAmount).toFixed(3),
          totalAmount: parseFloat(prodTotalAmount).toFixed(3),
          IGSTVal: prodIgstVal,
          cgstVal: prodCgstVal,
          sGstVal: prodSgstVal,
          total: prodTotAmt,
        };
      });

      ProductDataArr.push(...newTempProductData);
      //   setProductData((productData) => [
      //     ...productData.map((item) => {
      //       return {
      //         ...item,
      //         fineRate: "",
      //         amount: "",
      //         totalAmount: "",
      //         catRate: "",
      //         cgstVal: "",
      //         sGstVal: "",
      //         IGSTVal: "",
      //         total: "",
      //       };
      //     }),
      //     ...newTempProductData,
      //   ]);

      const tempTagWise = tempProductData.map((item) => {
        let tagWasFine = parseFloat(
          (parseFloat(item.net_wgt) * parseFloat(tempPackingSlip.wastage)) / 100
        ).toFixed(3);

        let tagTotFine = parseFloat(
          (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100 +
            parseFloat(tagWasFine)
        ).toFixed(3);

        let tagHmCharge = parseFloat(item.hallmarkChargesFrontEnd).toFixed(3);

        let tagTotalAmount = parseFloat(
          (parseFloat(fine_Rate) * parseFloat(tagTotFine)) / 10 +
            parseFloat(item.other_amt) +
            parseFloat(tagHmCharge)
        ).toFixed(3);

        let tagCgstPer =
          igstPer === null
            ? cgstPer //getting gst from packet data for packing slip
            : "";

        let tagCgstVal =
          igstPer === null
            ? parseFloat(
                (parseFloat(tagTotalAmount) * parseFloat(tagCgstPer)) / 100
              ).toFixed(3)
            : 0;

        let tagSgstPer =
          igstPer === null
            ? sgstPer //getting gst from packet data for packing slip
            : "";

        let tagSgstVal =
          igstPer === null
            ? parseFloat(
                (parseFloat(tagTotalAmount) * parseFloat(tagSgstPer)) / 100
              ).toFixed(3)
            : 0;

        let tagIgstPer = igstPer !== null ? igstPer : "";

        let tagIgstVal =
          igstPer !== null
            ? parseFloat(
                (parseFloat(tagTotalAmount) * parseFloat(tagIgstPer)) / 100
              ).toFixed(3)
            : 0;

        let tagTotAmt =
          igstPer === null
            ? parseFloat(
                parseFloat(tagTotalAmount) +
                  parseFloat(tagCgstVal) +
                  parseFloat(tagSgstVal)
              ).toFixed(3)
            : parseFloat(
                parseFloat(tagTotalAmount) + parseFloat(tagIgstVal)
              ).toFixed(3);

        return {
          ...item,
          wastage: tempPackingSlip.wastage,
          wastageFine: tagWasFine,
          totalFine: tagTotFine,
          hallmark_charges: tagHmCharge,
          cgstPer: tagCgstPer,
          sGstPer: tagSgstPer,
          IGSTper: tagIgstPer,
          fineRate: parseFloat(fine_Rate).toFixed(3),
          amount: parseFloat(
            (parseFloat(fine_Rate) * parseFloat(tagTotFine)) / 10 +
              parseFloat(item.other_amt)
          ).toFixed(3),
          totalAmount: parseFloat(tagTotalAmount).toFixed(3),
          catRate: parseFloat(
            (((parseFloat(fine_Rate) * parseFloat(tagTotFine)) / 10 +
              parseFloat(item.other_amt)) /
              parseFloat(item.net_wgt)) *
              10
          ).toFixed(3),
          IGSTVal: tagIgstVal,
          cgstVal: tagCgstVal,
          sGstVal: tagSgstVal,
          total: tagTotAmt,
        };
      });

      tagWiseDataArr.push(...tempTagWise);

      const tempBillMaterial = tempProductData.map((item) => {
        let bomMetWgt = parseFloat(
          parseFloat(item.gross_wgt) -
            (parseFloat(item.stone_wgt) +
              parseFloat(item.beads_wgt) +
              parseFloat(item.silver_wgt) +
              parseFloat(item.sol_wgt) +
              parseFloat(item.other_wgt))
        ).toFixed(3);

        let bomWastFine = parseFloat(
          (parseFloat(item.net_wgt) * parseFloat(tempPackingSlip.wastage)) / 100
        ).toFixed(3);

        let bomTotFine = parseFloat(
          (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100 +
            (parseFloat(item.net_wgt) * parseFloat(tempPackingSlip.wastage)) /
              100
        ).toFixed(3);

        let bomHmCharge = parseFloat(item.hallmarkChargesFrontEnd).toFixed(3);

        let totAmtBillMat = parseFloat(
          ((parseFloat(bomMetWgt) * parseFloat(item.purity)) / 100 +
            parseFloat(bomWastFine)) *
            (parseFloat(fine_Rate) / 10) +
            (parseFloat(item.stone_amt) +
              parseFloat(item.beads_amt) +
              parseFloat(item.silver_amt) +
              parseFloat(item.sol_amt) +
              parseFloat(item.other_amt) +
              parseFloat(bomHmCharge))
        ).toFixed(3);

        let bomCgstPer =
          igstPer === null
            ? cgstPer //getting gst from packet data for packing slip
            : "";

        let bomCgstVal =
          igstPer === null
            ? parseFloat(
                (parseFloat(totAmtBillMat) * parseFloat(bomCgstPer)) / 100
              ).toFixed(3)
            : 0;

        let bomSgstPer =
          igstPer === null
            ? sgstPer //getting gst from packet data for packing slip
            : "";

        let bomSgstVal =
          igstPer === null
            ? parseFloat(
                (parseFloat(totAmtBillMat) * parseFloat(bomSgstPer)) / 100
              ).toFixed(3)
            : 0;

        let bomIgstPer = igstPer !== null ? igstPer : "";

        let bomIgstVal =
          igstPer !== null
            ? parseFloat(
                (parseFloat(totAmtBillMat) * parseFloat(bomIgstPer)) / 100
              ).toFixed(3)
            : 0;

        let bomTotAmt =
          igstPer === null
            ? parseFloat(
                parseFloat(totAmtBillMat) +
                  parseFloat(bomCgstVal) +
                  parseFloat(bomSgstVal)
              ).toFixed(3)
            : parseFloat(
                parseFloat(totAmtBillMat) + parseFloat(bomIgstVal)
              ).toFixed(3);

        return {
          ...item,
          metal_wgt: bomMetWgt,
          // metal_amt: "",
          stone_wgt: parseFloat(item.stone_wgt).toFixed(3),
          wastage: tempPackingSlip.wastage,
          wastageFine: bomWastFine,
          totalFine: bomTotFine,
          hallmark_charges: bomHmCharge,
          // totalAmount: "",
          cgstPer: bomCgstPer,
          cgstVal: bomCgstVal,
          sGstPer: bomSgstPer,
          sGstVal: bomSgstVal,
          IGSTper: bomIgstPer,
          IGSTVal: bomIgstVal,
          totalAmount: totAmtBillMat,
          metal_amt: parseFloat(
            ((parseFloat(bomMetWgt) * parseFloat(item.purity)) / 100 +
              parseFloat(bomWastFine)) *
              (parseFloat(fine_Rate) / 10)
          ).toFixed(3),
          total: bomTotAmt,
        };
      });

      bomDataArr.push(...tempBillMaterial);
      //   setBillmaterialData((billMaterialData) => [
      //     ...billMaterialData.map((item) => {
      //       return {
      //         ...item,
      //         totalAmount: "",
      //       };
      //     }),
      //     ...tempBillMaterial,
      //   ]);
    }

    return {
      packingSlipArr: packingSlipArr,
      packetDataArr: packetDataArr,
      ProductDataArr: ProductDataArr,
      tagWiseDataArr: tagWiseDataArr,
      bomDataArr: bomDataArr,
    };
  },

  packingSlipViewDataJewelPurcArticianReturn: function (
    data,
    fineRate,
    stateId,
    jobWorkerGst,
    JWHSN,
    igstValue
  ) {
    let packingSlipArr = [];
    let packetDataArr = [];
    let ProductDataArr = [];
    let tagWiseDataArr = [];
    let bomDataArr = [];

    for (let one of data) {
      let tempPackingSlip = one.PackingSlip;
      let tempPacketData = one.packetData;
      let tempProductData = one.productData;
      let temCategoryData = one.categoryData;

      let wastFine = parseFloat(
        (parseFloat(tempPackingSlip.net_wgt) *
          parseFloat(tempPackingSlip.wastage)) /
          100
      ).toFixed(3);

      let totFine = parseFloat(
        (parseFloat(tempPackingSlip.net_wgt) *
          parseFloat(tempPackingSlip.purity)) /
          100 +
          parseFloat(wastFine)
      ).toFixed(3);

      let labFineAmt = parseFloat(
        (parseFloat(wastFine) * parseFloat(fineRate)) / 10
      ).toFixed(3);
      let totAmt = parseFloat(
        parseFloat(labFineAmt) + parseFloat(tempPacketData[0].other_amt)
      ).toFixed(3);

      let cgstPer =
        igstValue === null
          ? parseFloat(parseFloat(jobWorkerGst) / 2).toFixed(3)
          : "";

      let cgstVal =
        igstValue === null
          ? parseFloat(
              (parseFloat(totAmt) * parseFloat(cgstPer)) / 100
            ).toFixed(3)
          : "";

      let sGstPer =
        igstValue === null
          ? parseFloat(parseFloat(jobWorkerGst) / 2).toFixed(3)
          : "";

      let sgstVal =
        igstValue === null
          ? parseFloat(
              (parseFloat(totAmt) * parseFloat(sGstPer)) / 100
            ).toFixed(3)
          : "";

      let IGSTper =
        igstValue !== null ? parseFloat(jobWorkerGst).toFixed(3) : "";

      let igstVal =
        igstValue !== null
          ? parseFloat(
              (parseFloat(totAmt) * parseFloat(IGSTper)) / 100
            ).toFixed(3)
          : "";

      let tot =
        igstValue === null
          ? parseFloat(
              parseFloat(totAmt) + parseFloat(cgstVal) + parseFloat(sgstVal)
            ).toFixed(3)
          : parseFloat(parseFloat(totAmt) + parseFloat(igstVal)).toFixed(3);

      let newTemp = {
        ...tempPackingSlip,
        hallmark_charges_pcs: parseFloat(
          parseFloat(tempPackingSlip.hallmark_charges) *
            parseFloat(tempPackingSlip.phy_pcs)
        ).toFixed(3),
        NoOfPacket: tempPacketData.length,
        billingCategory: tempProductData[0].billing_category_name,
        wastageFine: wastFine,
        totalFine: totFine,

        fineRate: parseFloat(fineRate).toFixed(3),
        catRate: parseFloat(
          parseFloat(totAmt) / parseFloat(tempPackingSlip.net_wgt)
        ).toFixed(3),
        // amount: parseFloat(parseFloat(labFineAmt) + parseFloat(item.other_amt)).toFixed(3),
        jobworkFineUtilize: parseFloat(
          (parseFloat(tempPackingSlip.net_wgt) *
            parseFloat(tempPackingSlip.purity)) /
            100
        ).toFixed(3),
        labourFineAmount: labFineAmt,
        // hallmark_charges: parseFloat(
        //   parseFloat(tempPackingSlip.hallmark_charges) *
        //     parseFloat(item.pcs)
        // ).toFixed(3),
        totalAmount: totAmt,
        cgstPer: cgstPer,
        cgstVal: cgstVal,
        sGstPer: sGstPer,
        sGstVal: sgstVal,
        IGSTper: IGSTper,
        IGSTVal: igstVal,
        total: tot,
      };

      packingSlipArr.push(newTemp);

      const newTempPacketData = tempPacketData.map((item) => {
        let wastageFine = parseFloat(
          (parseFloat(item.net_wgt) * parseFloat(tempPackingSlip.wastage)) / 100
        ).toFixed(3);

        let totFine = parseFloat(
          (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100 +
            parseFloat(wastageFine)
        ).toFixed(3);

        let labFineAmt = parseFloat(
          (parseFloat(wastageFine) * parseFloat(fineRate)) / 10
        ).toFixed(3);
        let totAmt = parseFloat(
          parseFloat(labFineAmt) + parseFloat(item.other_amt)
        ).toFixed(3);

        let cgstPer =
          igstValue === null
            ? parseFloat(parseFloat(jobWorkerGst) / 2).toFixed(3)
            : 0;

        let cgstVal =
          igstValue === null
            ? parseFloat(
                (parseFloat(totAmt) * parseFloat(cgstPer)) / 100
              ).toFixed(3)
            : 0;

        let sGstPer =
          igstValue === null
            ? parseFloat(parseFloat(jobWorkerGst) / 2).toFixed(3)
            : 0;

        let sgstVal =
          igstValue === null
            ? parseFloat(
                (parseFloat(totAmt) * parseFloat(sGstPer)) / 100
              ).toFixed(3)
            : 0;

        let IGSTper =
          igstValue !== null ? parseFloat(jobWorkerGst).toFixed(3) : 0;

        let igstVal =
          igstValue !== null
            ? parseFloat(
                (parseFloat(totAmt) * parseFloat(IGSTper)) / 100
              ).toFixed(3)
            : 0;

        let tot =
          igstValue === null
            ? parseFloat(
                parseFloat(totAmt) + parseFloat(cgstVal) + parseFloat(sgstVal)
              ).toFixed(3)
            : parseFloat(parseFloat(totAmt) + parseFloat(igstVal)).toFixed(3);

        return {
          ...item,
          hsn_number: JWHSN,
          billingCategory: tempProductData[0].billing_category_name,
          wastage: tempPackingSlip.wastage,
          wastageFine: wastageFine,
          totalFine: totFine,
          fineRate: parseFloat(fineRate).toFixed(3),
          catRate: parseFloat(
            parseFloat(totAmt) / parseFloat(item.net_wgt)
          ).toFixed(3),
          // amount: parseFloat(parseFloat(labFineAmt) + parseFloat(item.other_amt)).toFixed(3),
          jobworkFineUtilize: parseFloat(
            (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100
          ).toFixed(3),
          labourFineAmount: labFineAmt,
          hallmark_charges: parseFloat(
            parseFloat(tempPackingSlip.hallmark_charges) * parseFloat(item.pcs)
          ).toFixed(3),
          totalAmount: totAmt,
          cgstPer: cgstPer,
          cgstVal: cgstVal,
          sGstPer: sGstPer,
          sGstVal: sgstVal,
          IGSTper: IGSTper,
          IGSTVal: igstVal,
          total: tot,
          // wastageFine: parseFloat(
          //   (parseFloat(item.net_wgt) * parseFloat(newTemp.wastage)) / 100
          // ).toFixed(3),
          // totalFine: parseFloat(
          //   (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100 +
          //     (parseFloat(item.net_wgt) * parseFloat(newTemp.wastage)) / 100
          // ).toFixed(3),
          // fineRate: "",
          // amount: "",
          // hallmark_charges: parseFloat(
          //   parseFloat(tempPackingSlip.hallmark_charges) *
          //     parseFloat(item.pcs)
          // ).toFixed(3), // newTemp.hallmark_charges,
          // totalAmount: "",
        };
      });

      packetDataArr.push(...newTempPacketData);
      // setPacketData((packetData) => [...packetData, ...newTempPacketData]);

      const newTempProductData = temCategoryData.map((item) => {
        let wastageFine = parseFloat(
          (parseFloat(item.net_wgt) * parseFloat(tempPackingSlip.wastage)) / 100
        ).toFixed(3);

        let totFine = parseFloat(
          (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100 +
            parseFloat(wastageFine)
        ).toFixed(3);

        let labFineAmt = parseFloat(
          (parseFloat(wastageFine) * parseFloat(fineRate)) / 10
        ).toFixed(3);
        let totAmt = parseFloat(
          parseFloat(labFineAmt) + parseFloat(item.other_amt)
        ).toFixed(3);

        let cgstPer =
          igstValue === null
            ? parseFloat(parseFloat(jobWorkerGst) / 2).toFixed(3)
            : 0;

        let cgstVal =
          igstValue === null
            ? parseFloat(
                (parseFloat(totAmt) * parseFloat(cgstPer)) / 100
              ).toFixed(3)
            : 0;

        let sGstPer =
          igstValue === null
            ? parseFloat(parseFloat(jobWorkerGst) / 2).toFixed(3)
            : 0;

        let sgstVal =
          igstValue === null
            ? parseFloat(
                (parseFloat(totAmt) * parseFloat(sGstPer)) / 100
              ).toFixed(3)
            : 0;

        let IGSTper =
          igstValue !== null ? parseFloat(jobWorkerGst).toFixed(3) : 0;

        let igstVal =
          igstValue !== null
            ? parseFloat(
                (parseFloat(totAmt) * parseFloat(IGSTper)) / 100
              ).toFixed(3)
            : 0;

        let tot =
          igstValue === null
            ? parseFloat(
                parseFloat(totAmt) + parseFloat(cgstVal) + parseFloat(sgstVal)
              ).toFixed(3)
            : parseFloat(parseFloat(totAmt) + parseFloat(igstVal)).toFixed(3);

        return {
          ...item,
          hsn_number: JWHSN,
          wastage: tempPackingSlip.wastage,
          wastageFine: wastageFine,
          totalFine: totFine,
          fineRate: parseFloat(fineRate).toFixed(3),
          catRate: parseFloat(
            parseFloat(totAmt) / parseFloat(item.net_wgt)
          ).toFixed(3),
          // amount: parseFloat(parseFloat(labFineAmt) + parseFloat(item.other_amt)).toFixed(3),
          jobworkFineUtilize: parseFloat(
            (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100
          ).toFixed(3),
          labourFineAmount: labFineAmt,
          hallmark_charges: parseFloat(
            parseFloat(tempPackingSlip.hallmark_charges) * parseFloat(item.pcs)
          ).toFixed(3),
          totalAmount: totAmt,
          cgstPer: cgstPer,
          cgstVal: cgstVal,
          sGstPer: sGstPer,
          sGstVal: sgstVal,
          IGSTper: IGSTper,
          IGSTVal: igstVal,
          total: tot,
        };
      });

      ProductDataArr.push(...newTempProductData);
      // setProductData((productData) => [
      //     ...productData,
      //     ...newTempProductData,
      // ]);

      const tempTagWise = tempProductData.map((item) => {
        let wastageFine = parseFloat(
          (parseFloat(item.net_wgt) * parseFloat(tempPackingSlip.wastage)) / 100
        ).toFixed(3);

        let totFine = parseFloat(
          (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100 +
            parseFloat(wastageFine)
        ).toFixed(3);

        let labFineAmt = parseFloat(
          (parseFloat(wastageFine) * parseFloat(fineRate)) / 10
        ).toFixed(3);
        let totAmt = parseFloat(
          parseFloat(labFineAmt) + parseFloat(item.other_amt)
        ).toFixed(3);

        let cgstPer =
          igstValue === null
            ? parseFloat(parseFloat(jobWorkerGst) / 2).toFixed(3)
            : 0;

        let cgstVal =
          igstValue === null
            ? parseFloat(
                (parseFloat(totAmt) * parseFloat(cgstPer)) / 100
              ).toFixed(3)
            : 0;

        let sGstPer =
          igstValue === null
            ? parseFloat(parseFloat(jobWorkerGst) / 2).toFixed(3)
            : 0;

        let sgstVal =
          igstValue === null
            ? parseFloat(
                (parseFloat(totAmt) * parseFloat(sGstPer)) / 100
              ).toFixed(3)
            : 0;

        let IGSTper =
          igstValue !== null ? parseFloat(jobWorkerGst).toFixed(3) : 0;

        let igstVal =
          igstValue !== null
            ? parseFloat(
                (parseFloat(totAmt) * parseFloat(IGSTper)) / 100
              ).toFixed(3)
            : 0;

        let tot =
          igstValue === null
            ? parseFloat(
                parseFloat(totAmt) + parseFloat(cgstVal) + parseFloat(sgstVal)
              ).toFixed(3)
            : parseFloat(parseFloat(totAmt) + parseFloat(igstVal)).toFixed(3);

        return {
          ...item,
          hsn_number: JWHSN,
          wastage: tempPackingSlip.wastage,
          wastageFine: wastageFine,
          totalFine: totFine,
          fineRate: parseFloat(fineRate).toFixed(3),
          catRate: parseFloat(
            parseFloat(totAmt) / parseFloat(item.net_wgt)
          ).toFixed(3),
          // amount: parseFloat(parseFloat(labFineAmt) + parseFloat(item.other_amt)).toFixed(3),
          jobworkFineUtilize: parseFloat(
            (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100
          ).toFixed(3),
          labourFineAmount: labFineAmt,
          hallmark_charges: parseFloat(
            parseFloat(tempPackingSlip.hallmark_charges) * parseFloat(item.pcs)
          ).toFixed(3),
          totalAmount: totAmt,
          cgstPer: cgstPer,
          cgstVal: cgstVal,
          sGstPer: sGstPer,
          sGstVal: sgstVal,
          IGSTper: IGSTper,
          IGSTVal: igstVal,
          total: tot,
        };
      });

      tagWiseDataArr.push(...tempTagWise);

      const tempBillMaterial = tempProductData.map((item) => {
        let wastageFine = parseFloat(
          (parseFloat(item.net_wgt) * parseFloat(tempPackingSlip.wastage)) / 100
        ).toFixed(3);

        let totFine = parseFloat(
          (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100 +
            parseFloat(wastageFine)
        ).toFixed(3);

        let labFineAmt = parseFloat(
          (parseFloat(wastageFine) * parseFloat(fineRate)) / 10
        ).toFixed(3);
        let totAmt = parseFloat(
          parseFloat(labFineAmt) + parseFloat(item.other_amt)
        ).toFixed(3);

        let cgstPer =
          igstValue === null
            ? parseFloat(parseFloat(jobWorkerGst) / 2).toFixed(3)
            : 0;

        let cgstVal =
          igstValue === null
            ? parseFloat(
                (parseFloat(totAmt) * parseFloat(cgstPer)) / 100
              ).toFixed(3)
            : 0;

        let sGstPer =
          igstValue === null
            ? parseFloat(parseFloat(jobWorkerGst) / 2).toFixed(3)
            : 0;

        let sgstVal =
          igstValue === null
            ? parseFloat(
                (parseFloat(totAmt) * parseFloat(sGstPer)) / 100
              ).toFixed(3)
            : 0;

        let IGSTper =
          igstValue !== null ? parseFloat(jobWorkerGst).toFixed(3) : 0;

        let igstVal =
          igstValue !== null
            ? parseFloat(
                (parseFloat(totAmt) * parseFloat(IGSTper)) / 100
              ).toFixed(3)
            : 0;

        let tot =
          igstValue === null
            ? parseFloat(
                parseFloat(totAmt) + parseFloat(cgstVal) + parseFloat(sgstVal)
              ).toFixed(3)
            : parseFloat(parseFloat(totAmt) + parseFloat(igstVal)).toFixed(3);

        return {
          ...item,
          metal_wgt: parseFloat(
            parseFloat(item.gross_wgt) -
              (parseFloat(item.stone_wgt) +
                parseFloat(item.beads_wgt) +
                parseFloat(item.silver_wgt) +
                parseFloat(item.sol_wgt) +
                parseFloat(item.other_wgt))
          ).toFixed(3),
          // metal_amt: "",
          stone_wgt: parseFloat(item.stone_wgt).toFixed(3),
          wastage: tempPackingSlip.wastage,
          wastageFine: parseFloat(
            (parseFloat(item.net_wgt) * parseFloat(tempPackingSlip.wastage)) /
              100
          ).toFixed(3),
          totalFine: parseFloat(
            (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100 +
              (parseFloat(item.net_wgt) * parseFloat(tempPackingSlip.wastage)) /
                100
          ).toFixed(3),
          totalAmount: totAmt,
          cgstPer: cgstPer,
          cgstVal: cgstVal,
          sGstPer: sGstPer,
          sGstVal: sgstVal,
          IGSTper: IGSTper,
          IGSTVal: igstVal,
          total: tot,
        };
      });

      // setBillmaterialData((billMaterialData) => [
      //     ...billMaterialData,
      //     ...tempBillMaterial,
      // ]);
      bomDataArr.push(...tempBillMaterial);
    }

    return {
      packingSlipArr: packingSlipArr,
      packetDataArr: packetDataArr,
      ProductDataArr: ProductDataArr,
      tagWiseDataArr: tagWiseDataArr,
      bomDataArr: bomDataArr,
    };
  },

  packingSipViewRepairedIssueToJobWorker: function (data, fineRate) {
    let packingSlipArr = [];
    let packetDataArr = [];
    let ProductDataArr = [];
    let tagWiseDataArr = [];
    let bomDataArr = [];

    for (let one of data) {
      let tempPackingSlip = one.PackingSlip;
      let tempPacketData = one.packetData;
      let tempProductData = one.productData;
      let temCategoryData = one.categoryData;

      const newTempProductData = temCategoryData.map((item) => {
        return {
          ...item,
          jobWorkFineinPure: parseFloat(
            (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100
          ).toFixed(3),
          rate: parseFloat(fineRate).toFixed(3),
          valuation: (
            (parseFloat(fineRate) * parseFloat(item.net_wgt)) /
            10
          ).toFixed(3),
        };
      });

      // let temp = [...productData, ...newTempProductData];
      ProductDataArr.push(...newTempProductData);
      // setProductData((productData) => [
      //     ...productData,
      //     ...newTempProductData,
      // ]);

      const tempTagWise = tempProductData.map((item) => {
        return {
          ...item,
          jobWorkFineinPure: parseFloat(
            (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100
          ).toFixed(3),
          rate: parseFloat(fineRate).toFixed(3),
          valuation: (
            (parseFloat(fineRate) * parseFloat(item.net_wgt)) /
            10
          ).toFixed(3),
        };
      });

      tagWiseDataArr.push(...tempTagWise);
      // setTagWiseData((tagWiseData) => [...tagWiseData, ...tempTagWise]);

      const newTempPacketData = tempPacketData.map((item) => {
        return {
          ...item,
          jobWorkFineinPure: parseFloat(
            (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100
          ).toFixed(3),
          rate: parseFloat(fineRate).toFixed(3),
          valuation: (
            (parseFloat(fineRate) * parseFloat(item.net_wgt)) /
            10
          ).toFixed(3),
        };
      });

      packetDataArr.push(...newTempPacketData);
      // setPacketData((packetData) => [...packetData, ...newTempPacketData]);

      let newTemp = {
        ...tempPackingSlip,
        NoOfPacket: tempPacketData.length,
        billingCategory: tempProductData[0].billing_category_name,
        jobWorkFineinPure: parseFloat(
          (parseFloat(tempPackingSlip.net_wgt) *
            parseFloat(tempPackingSlip.purity)) /
            100
        ).toFixed(3),
        rate: parseFloat(fineRate).toFixed(3),
        valuation: (
          (parseFloat(fineRate) * parseFloat(tempPackingSlip.net_wgt)) /
          10
        ).toFixed(3),
      };

      packingSlipArr.push(newTemp);
      // setPackingSlipData([...packingSlipData, newTemp]); //packing slip wise

      const tempBillMaterial = tempProductData.map((item) => {
        return {
          ...item,
          jobWorkFineinPure: parseFloat(
            (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100
          ).toFixed(3),
          rate: parseFloat(fineRate).toFixed(3),
          valuation: (
            (parseFloat(fineRate) * parseFloat(item.net_wgt)) /
            10
          ).toFixed(3),
        };
      });

      // setBillmaterialData((billMaterialData) => [
      //     ...billMaterialData,
      //     ...tempBillMaterial,
      // ]);
      bomDataArr.push(...tempBillMaterial);
    }

    return {
      packingSlipArr: packingSlipArr,
      packetDataArr: packetDataArr,
      ProductDataArr: ProductDataArr,
      tagWiseDataArr: tagWiseDataArr,
      bomDataArr: bomDataArr,
    };
  },
};

export default HelperFunc;
