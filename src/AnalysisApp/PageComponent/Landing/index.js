import React, { useState } from "react";
import Button from "../../Component/Button";
import { navigate } from "@reach/router";
import DragCard from "../../Component/DragCard";
import {
  parsingErrorList,
  concatAllStations,
  parsingByComponentType,
  parsingReasionQty,
  parsingStationQty,
  parsingByLocation,
  parsingByFailSN,
  sortResult,
  getBatch,
  allDefectsStationPareto,
  getNotAllowed,
} from "../../Utils/ShopFloorDataParsing";

export default function FileHandling() {
  const [repairList, setRepairList] = useState({});
  const [repairListFlag, setRepairListFlag] = useState(false);

  const receivedRepairList = (obj) => setRepairList(obj);

  const transferData = (e) => {
    const parsedErrorList = parsingErrorList(repairList.RepairList);
    console.log(parsedErrorList);
    const batchs = parsedErrorList.batchs;
    batchs.shift();
    // console.log(batchs);
    const modelName = "IPU-M MB MK2";
    console.log(parsedErrorList[modelName]);

    const errorListStations = parsedErrorList[modelName];
    const allErrorList = concatAllStations(errorListStations);
    const errorListComponentType = parsingByComponentType(allErrorList);
    const errorListSn = parsingByFailSN(allErrorList);
    console.log(errorListComponentType);
    // console.log(errorListSn);
    // console.log(parsingReasionQty("cap0201", errorListComponentType));
    // console.log(parsingStationQty("cap0201", errorListComponentType));
    const cadRank = sortResult(errorListComponentType);
    const snResult = sortResult(errorListSn);
    const repairMoreThanFive = snResult.filter((d) => d[1] > 5);
    const reapirMoreThanTwo = snResult.filter((d) => d[1] > 2);
    const reapirMoreThanThree = snResult.filter((d) => d[1] > 3);
    console.log(getBatch(errorListComponentType, "cap0201", batchs));
    const paretoStation = allDefectsStationPareto(errorListStations);
    const parsingLocation = parsingByLocation(allErrorList);
    const notAllowed = getNotAllowed(parsingLocation);
    navigate(`/dashboard`, {
      state: {
        allErrorList,
        errorListComponentType,
        errorListSn,
        cadRank,
        paretoStation,
        batchs,
        repairMoreThanFive,
        notAllowed,
      },
    });
  };

  return (
    <div className="page-vh">
      <div className="container">
        <div className="landing-page">
          <DragCard
            title="FA_Repair File"
            fileType="RepairList"
            callback={(obj) => receivedRepairList(obj)}
            setFlag={(bool) => setRepairListFlag(bool)}
          />

          <Button disabled={!repairListFlag} onClick={transferData}>
            Generate Report
          </Button>
        </div>
      </div>
    </div>
  );
}
