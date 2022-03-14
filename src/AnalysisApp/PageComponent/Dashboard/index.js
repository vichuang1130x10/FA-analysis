import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { navigate } from "@reach/router";
import styled from "styled-components";
import PieChart from "../../Visualization/PieChart";
import ParetoChart from "../../Visualization/Plato";
import RunChart from "../../Visualization/RunChart";

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

const InfoCard = styled.div`
  border: 1px solid #333;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  padding: 8px;
`;

export default function App(props) {
  useEffect(() => {
    console.log(props.location.state);
  });

  const handleTdOnClick = (item) => {
    navigate(`/details`, {
      state: {
        item,
        errorListComponentType,
        batches,
      },
    });
  };

  const tableData = props.location.state.cadRank;
  const paretoData = props.location.state.paretoStation;
  const errorListComponentType = props.location.state.errorListComponentType;
  const allErrorList = props.location.state.allErrorList;
  const batches = props.location.state.batchs;
  const repairMoreThanThree = props.location.state.repairMoreThanThree;
  const top10 = tableData.slice(0, 10).map((item) => item[0]);
  const top10Batches = top10.map((item) =>
    getBatch(errorListComponentType, item, batches)
  );

  // console.log(top10Batches);

  // console.log(getBatch(errorListComponentType, "cap0201", batchs));
  // const paretoStation = allDefectsStationPareto(errorListStations);
  // navigate(`/dashboard`, {
  //   state: {
  //     allErrorList,
  //     errorListComponentType,
  //     errorListSn,
  //     cadRank,
  //     paretoStation,
  //   },
  // });
  return (
    <div className="page-vh">
      <div className="container">
        <div className="dashboard-page">
          <div className="dashboard-card1">
            <h4>IPU-M MB MK2</h4>
            <InfoCard>
              <h4>FA Count</h4>
              <h4>{allErrorList.length}</h4>
            </InfoCard>
            <InfoCard>
              <h4>{`Rework Count > 3`}</h4>
              <h4>{repairMoreThanThree.length}</h4>
            </InfoCard>
          </div>
          <div className="dashboard-card2">
            <h4>Failure Rank</h4>
            <Table
              striped
              bordered
              hover
              size="sm"
              style={{
                width: "80%",
                fontSize: "12px",
                margin: "0 auto",
                marginTop: "20px",
              }}
              id="table"
            >
              <thead>
                <tr>
                  <th>index</th>
                  <th>Component Type</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td onClick={() => handleTdOnClick(item)}>{item[0]}</td>
                      <td>{item[1]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
          <div className="dashboard-card3">
            <h4>Failure Component Pie Chart</h4>
            <br />
            <div style={{ textAlign: "center" }}>
              <PieChart data={tableData} />
            </div>
            <br />
            <h4>Failure by Test Station Pareto Chart</h4>
            <br />
            <div style={{ textAlign: "center" }}>
              <ParetoChart data={paretoData} />
            </div>
            <br />
            <h4>Top 10 Failures Run Chart</h4>
            <br />
            <div style={{ textAlign: "center" }}>
              <RunChart data={top10Batches} tableData={tableData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
