import { getWeek } from "../HelperFunction";
import bom from "../../BoardData/bomStringfy.json";
import cad from "../../BoardData/boarddatas.json";
import { Level2,Level3 } from "../../BoardData/EnSupport";

const sortMo = (a, b) => {
  if (a < b) {
    return 1;
  } else {
    return -1;
  }
};



function sortByWeek(a, b) {
  if (a.Week > b.Week) {
    return 1;
  } else {
    return -1;
  }
}



const getType = (failStation) => {
  switch (failStation) {
    case "AOI INSPECT21":
      return "AOI2";

    case "AOI INSPECT41":
    case "AOI INSPECT4":
      return "AOI4";

    case "AOIOUT_WS1":
      return "AOI6";

    case "X-RAY":
    case "X-RAY1":
    case "X-RAY2":
    case "X-RAY3":
      return "X-Ray";

    case "ICT":
    case "ICT03101":
    case "ICT03102":
    case "ICT03103":
    case "ICT03106":
    case "ICT03107":
    case "ICT03112":
    case "ICT08":
    case "ICT09":
    case "ICT1":
      return "ICT";

    case "MECH LOADING1":
    case "MECH LOADING":
      return "MECH LOADING";

    case "OBE":
      return "OBE";

    case "PRESS INSPECT1":
    case "PRESS INSPECT":
    case "PRF INSPECT11":
      return "PRESS-FIT";

    case "PTH INPUT1":
      return "PTH INPUT";
    case "TOUCH UP1":
    case "TOUCH UP":
      return "TOUCH UP";

    case "SMT INPUT21":
      return "SMT INPUT2";

    default:
      return "NA";
  }
};
const replaceDashToUnderline = (string) => {
  if (string) {
    return string.replaceAll("-", "_");
  } else {
    return "";
  }
};
//const type = getType(obj["FAIL_STATION"]);

// parsing errorlist json to specfic format for each station failure symptom
export function parsingErrorList(errorList) {
  let n = { batchs: ["ALL"] };

  errorList.forEach((obj) => {
    const item = replaceDashToUnderline(obj["LOCATION"]);

    const batchNo = obj["FAIL_SN"].split("-")[0] || "";

    let cadLoc = "";
    let pn = "";
    let level = 1

    if (obj["MODEL_NAME"] === "IPU-M MB MK2" && !n.batchs.includes(batchNo)) {
      n.batchs.push(batchNo);
    }

    if (obj["MODEL_NAME"] === "IPU-M MB MK2") {
      const locs = cad.filter((obj) => obj.CompName === item);
      if (locs.length) {
        cadLoc = locs[0].CompType;
             if(Level2.includes(cadLoc)){
        level = 2
      }else if(Level3.includes(cadLoc)){
        level = 3
      }
      }
    }

    // if (obj["MODEL_NAME"] === "IPU-M MB MK2") {

    //   if(Level2.includes(item)){
    //     level = 2
    //   }else if(Level3.includes(item)){
    //     level = 3
    //   }
    // }

    if (obj["MODEL_NAME"] === "IPU-M MB MK2") {
      const pns = bom.filter((obj) => obj.ref === item);
      if (pns.length) {
        pn = pns[0].partNumber;
      }
    }

    obj["Type"] = getType(obj["FAIL_STATION"]);
    if (n[obj["MODEL_NAME"]] === undefined || n[obj["MODEL_NAME"]] === null) {
      n[obj["MODEL_NAME"]] = {};
      n[obj["MODEL_NAME"]]["AOI2"] = { ErorrDescriptions: [] };
      n[obj["MODEL_NAME"]]["AOI4"] = { ErorrDescriptions: [] };
      n[obj["MODEL_NAME"]]["X-Ray"] = { ErorrDescriptions: [] };
      n[obj["MODEL_NAME"]]["ICT"] = { ErorrDescriptions: [] };
      n[obj["MODEL_NAME"]]["AOI6"] = { ErorrDescriptions: [] };
      n[obj["MODEL_NAME"]]["MECH LOADING"] = { ErorrDescriptions: [] };
      n[obj["MODEL_NAME"]]["OBE"] = { ErorrDescriptions: [] };
      n[obj["MODEL_NAME"]]["PRESS-FIT"] = { ErorrDescriptions: [] };
      n[obj["MODEL_NAME"]]["PTH INPUT"] = { ErorrDescriptions: [] };
      n[obj["MODEL_NAME"]]["TOUCH UP"] = { ErorrDescriptions: [] };
      n[obj["MODEL_NAME"]]["SMT INPUT2"] = { ErorrDescriptions: [] };
      if (obj.Type !== "NA") {
        n[obj["MODEL_NAME"]][obj.Type].ErorrDescriptions = [
          {
            batchNo,
            reason: obj["ROOT_CAUSE"],
            rDate: obj["REPAIR_TIME"],
            item,
            cadLoc,
            pn,
            level,
            sDate: obj["SMT_INPUT_TIME"],
            tDate: obj["TEST_TIME"],
            tat: obj["TAT"],
            final: obj["FINAL_STATUS"],
            station: obj.Type,
            sn: obj["FAIL_SN"],
          },
        ];
      }
    } else {
      if (obj.Type !== "NA") {
        n[obj["MODEL_NAME"]][obj.Type].ErorrDescriptions.push({
          batchNo,
          reason: obj["ROOT_CAUSE"],
          rDate: obj["REPAIR_TIME"],
          item,
          cadLoc,
          pn,
          level,
          sDate: obj["SMT_INPUT_TIME"],
          tDate: obj["TEST_TIME"],
          tat: obj["TAT"],
          final: obj["FINAL_STATUS"],
          station: obj.Type,
          sn: obj["FAIL_SN"],
        });
      }
    }
  });

  return n;
}

export function concatAllStations(errorList) {
  return errorList["AOI2"].ErorrDescriptions.concat(
    errorList["AOI4"].ErorrDescriptions,
    errorList["ICT"].ErorrDescriptions,
    errorList["X-Ray"].ErorrDescriptions,
    errorList["AOI6"].ErorrDescriptions,
    errorList["MECH LOADING"].ErorrDescriptions,
    errorList["OBE"].ErorrDescriptions,
    errorList["PRESS-FIT"].ErorrDescriptions,
    errorList["PTH INPUT"].ErorrDescriptions,
    errorList["TOUCH UP"].ErorrDescriptions,
    errorList["SMT INPUT2"].ErorrDescriptions
  );
}

export function parsingByComponentType(allDefectData) {
  const outputData = {};
  allDefectData.forEach((item) => {
    if (item.cadLoc !== "") {
      if (
        outputData[item.cadLoc] === null ||
        outputData[item.cadLoc] === undefined
      ) {
        outputData[item.cadLoc] = [item];
      } else {
        outputData[item.cadLoc].push(item);
      }
    }
  });

  return outputData;
}

export function getBatch(errorList, cadType, batches) {
  const result = {};
  batches.forEach((batch) => (result[batch] = 0));
  errorList[cadType].forEach((defect) => (result[defect.batchNo] += 1));
  const data = [];
  for (let item in result) {
    data.push({ batch: item, numbers: result[item] });
  }
  return data;
}

export function allDefectsStationPareto(allErrorList) {
  let sortable = [];
  for (let defect in allErrorList) {
    sortable.push([defect, allErrorList[defect].ErorrDescriptions.length]);
  }

  sortable.sort(function (a, b) {
    return b[1] - a[1];
  });

  const totalDefects = sortable.reduce((acc, elem) => acc + elem[1], 0);
  const result = [];
  let accumulate = 0;
  sortable.forEach((d) => {
    const indiv = parseInt((d[1] / totalDefects) * 100);
    accumulate += d[1];
    result.push({
      defectName: d[0],
      qty: d[1],
      indiv: indiv === 0 ? 1 : indiv,
      accu: parseInt((accumulate / totalDefects) * 100),
    });
  });

  return result;
}

export function sortResult(errorList) {
  let sortable = [];
  for (let defect in errorList) {
    sortable.push([defect, errorList[defect].length]);
  }

  sortable.sort(function (a, b) {
    return b[1] - a[1];
  });

  return sortable;
}

export function parsingByFailSN(allDefectData) {
  const outputData = {};
  allDefectData.forEach((item) => {
    if (item.cadLoc !== "" && item.reason !== "NDF") {
      if (outputData[item.sn] === null || outputData[item.sn] === undefined) {
        outputData[item.sn] = [item];
      } else {
        outputData[item.sn].push(item);
      }
    }
  });

  return outputData;
}

export function parsingReasionQty(cadType, errorList) {
  if (errorList === undefined || errorList === null) {
    return [];
  }
  const allDefects = {};
  errorList[cadType].forEach((defect) => {
    if (
      allDefects[defect.reason] === null ||
      allDefects[defect.reason] === undefined
    ) {
      allDefects[defect.reason] = 1;
    } else {
      allDefects[defect.reason] += 1;
    }
  });

  return getParetoData(allDefects);
}

export function parsingStationQty(cadType, errorList) {
  if (errorList === undefined || errorList === null) {
    return [];
  }
  const allDefects = {};
  errorList[cadType].forEach((defect) => {
    if (
      allDefects[defect.station] === null ||
      allDefects[defect.station] === undefined
    ) {
      allDefects[defect.station] = 1;
    } else {
      allDefects[defect.station] += 1;
    }
  });

  return getParetoData(allDefects);
}

function getParetoData(allDefects) {
  let sortable = [];
  for (let defect in allDefects) {
    sortable.push([defect, allDefects[defect]]);
  }

  sortable.sort(function (a, b) {
    return b[1] - a[1];
  });
  const totalDefects = sortable.reduce((acc, elem) => acc + elem[1], 0);
  const result = [];
  let accumulate = 0;
  sortable.forEach((d) => {
    const indiv = parseInt((d[1] / totalDefects) * 100);
    accumulate += d[1];
    result.push({
      defectName: d[0],
      qty: d[1],
      indiv: indiv === 0 ? 1 : indiv,
      accu: parseInt((accumulate / totalDefects) * 100),
    });
  });

  return result;
}

