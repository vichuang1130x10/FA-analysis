import React, { useEffect } from "react";
import { Row } from "react-bootstrap";
import { navigate } from "@reach/router";

import ParetoChart from "../../Visualization/Plato";
import SingleRunChart from "../../Visualization/SingleRunChart";
import Histogram from "../../Visualization/Histogram";

import {
  parsingReasionQty,
  parsingStationQty,
  getBatch,
} from "../../Utils/ShopFloorDataParsing";

export default function App(props) {
  useEffect(() => {
    // console.log(props.location.state);
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

  const histogramData = errorListComponentType[componentType];
  // console.log("histogramData", histogramData);

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

            <div className="details-card1">
              <h4>Repair Turn Around Time:</h4>
              <Histogram data={histogramData} />
            </div>
          </Row>
        </div>
      </div>
    </div>
  );
}
