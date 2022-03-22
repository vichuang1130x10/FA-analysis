import React, { useState } from "react";
import Button from "../../Component/Button";
import { navigate } from "@reach/router";
import DragCard from "../../Component/DragCard";
import {
  parsingErrorList,
  concatAllStations,
  parsingByComponentType,
  parsingByLocation,
  parsingByFailSN,
  sortResult,
  allDefectsStationPareto,
  getNotAllowed,
  parsingByLocationBySpecificSn,
  parsingByLocationBySpecificSnByLevel,
} from "../../Utils/ShopFloorDataParsing";

export default function FileHandling() {
  const [repairList, setRepairList] = useState({});
  const [repairListFlag, setRepairListFlag] = useState(false);

  const receivedRepairList = (obj) => setRepairList(obj);

  const transferData = (e) => {
    const parsedErrorList = parsingErrorList(repairList.RepairList);
    // console.log(parsedErrorList);
    const batchs = parsedErrorList.batchs;
    batchs.shift();
    // console.log(batchs);
    const modelName = "IPU-M MB MK2";
    // console.log(parsedErrorList[modelName]);

    const errorListStations = parsedErrorList[modelName];
    const allErrorList = concatAllStations(errorListStations);
    const errorListComponentType = parsingByComponentType(allErrorList);
    const errorListSn = parsingByFailSN(allErrorList);
    // console.log(errorListComponentType);

    const cadRank = sortResult(errorListComponentType);
    const snResult = sortResult(errorListSn);
    const repairMoreThanFive = snResult.filter((d) => d[1] > 5);

    const reapirMoreThanThree = snResult
      .filter((d) => d[1] > 3)
      .map((d) => d[0]);

    const samePositionMoreThen3 = parsingByLocationBySpecificSn(
      errorListSn,
      reapirMoreThanThree
    );
    const level2SamePositionMoreThen2 = parsingByLocationBySpecificSnByLevel(
      errorListSn,
      reapirMoreThanThree,
      2
    );

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
        samePositionMoreThen3,
        level2SamePositionMoreThen2,
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
