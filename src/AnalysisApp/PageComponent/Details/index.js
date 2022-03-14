import React, { useState, useEffect } from "react";
import { Row } from "react-bootstrap";
import { navigate } from "@reach/router";
import styled from "styled-components";

import ParetoChart from "../../Visualization/Plato";
import SingleRunChart from "../../Visualization/SingleRunChart";

import {
  parsingErrorList,
  concatAllStations,
  parsingByComponentType,
  parsingReasionQty,
  parsingStationQty,
  parsingByFailSN,
  sortResult,
  getBatch,
  allDefectsStationPareto,
} from "../../Utils/ShopFloorDataParsing";

// const errorListStations = parsedErrorList[modelName];
// const allErrorList = concatAllStations(errorListStations);
// const errorListComponentType = parsingByComponentType(allErrorList);
// const errorListSn = parsingByFailSN(allErrorList);
// console.log(errorListComponentType);
// // console.log(errorListSn);
// // console.log(parsingReasionQty("cap0201", errorListComponentType));
// // console.log(parsingStationQty("cap0201", errorListComponentType));
// const cadRank = sortResult(errorListComponentType);
// // console.log(sortResult(errorListSn));
// console.log(getBatch(errorListComponentType, "cap0201", batchs));

export default function App(props) {
  useEffect(() => {
    console.log(props.location.state);
  });
  const componentType = props.location.state.item[0];
  const errorListComponentType = props.location.state.errorListComponentType;
  const batches = props.location.state.batches;

  const defectPareto = parsingReasionQty(componentType, errorListComponentType);
  const stationPareto = parsingStationQty(
    componentType,
    errorListComponentType
  );

  const runChartData = getBatch(errorListComponentType, componentType, batches);

  console.log(runChartData);

  // export function getBatch(errorList, cadType, batches) {
  //   const result = {};
  //   batches.forEach((batch) => (result[batch] = 0));
  //   errorList[cadType].forEach((defect) => (result[defect.batchNo] += 1));
  //   const data = [];
  //   for (let item in result) {
  //     data.push({ batch: item, numbers: result[item] });
  //   }
  //   return data;
  // }

  return (
    <div className="page-vh">
      <div className="container">
        <br />
        <h4>{componentType}</h4>
        <div className="details-page">
          <Row>
            <div className="details-card1">
              <h4>Root Cause Pareto Chart:</h4>
              <ParetoChart data={defectPareto} />
            </div>

            <div className="details-card1">
              <h4>Test Station Pareto Chart:</h4>
              <ParetoChart data={stationPareto} />
            </div>
          </Row>
          <Row>
            <div className="details-card1">
              <h4>Failure Run Chart:</h4>
              <SingleRunChart data={runChartData} />
            </div>

            <div className="details-card1"> </div>
          </Row>
        </div>
      </div>
    </div>
  );
}
