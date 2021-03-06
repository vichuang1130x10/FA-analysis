import React, { useEffect } from "react";
import { Table } from "react-bootstrap";
import { navigate } from "@reach/router";
import styled from "styled-components";
import PieChart from "../../Visualization/PieChart";
import ParetoChart from "../../Visualization/Plato";
import RunChart from "../../Visualization/RunChart";

import { getBatch } from "../../Utils/ShopFloorDataParsing";

const InfoCard = styled.div`
  border: 1px solid #333;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  padding: 8px;
  transition: all 0.3s;

  :hover {
    background-color: #eee;
  }
`;

const InfoCardHead = styled.div`
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
    // console.log(props.location.state);
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

  const handleCardOnClick = (data, attr) => {
    navigate(`/monitoring`, {
      state: {
        data,
        attr,
      },
    });
  };

  const {
    cadRank: tableData,
    paretoStation: paretoData,
    errorListComponentType,
    allErrorList,
    batchs: batches,
    repairMoreThanFive,
    notAllowed,
    samePositionMoreThen3,
    level2SamePositionMoreThen2,
  } = props.location.state;

  const top10 = tableData.slice(0, 10).map((item) => item[0]);
  const top10Batches = top10.map((item) =>
    getBatch(errorListComponentType, item, batches)
  );

  return (
    <div className="page-vh">
      <div className="container">
        <div className="dashboard-page">
          <div className="dashboard-card1">
            <h4>IPU-M MB MK2</h4>
            <InfoCardHead>
              <h4>FA Count</h4>
              <h4 style={{ color: "red" }}>{allErrorList.length}</h4>
            </InfoCardHead>
            <InfoCard onClick={() => handleCardOnClick(repairMoreThanFive, 0)}>
              <h4>{`Rework Count > 5`}</h4>
              <h4 style={{ color: "red" }}>{repairMoreThanFive.length}</h4>
            </InfoCard>
            <InfoCard onClick={() => handleCardOnClick(notAllowed, 1)}>
              <h4>{`Not Allowed to Repair`}</h4>
              <h4 style={{ color: "red" }}>{notAllowed.length}</h4>
            </InfoCard>

            <InfoCard
              onClick={() => handleCardOnClick(level2SamePositionMoreThen2, 2)}
            >
              <h5>{`BGA, QFN, Connector(levle 2) Same position repair > 2`}</h5>
              <h4 style={{ color: "red" }}>
                {level2SamePositionMoreThen2.length}
              </h4>
            </InfoCard>

            <InfoCard
              onClick={() => handleCardOnClick(samePositionMoreThen3, 3)}
            >
              <h4>{`Same Position repair > 3`}</h4>
              <h4 style={{ color: "red" }}>{samePositionMoreThen3.length}</h4>
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
            <div style={{ textAlign: "center" }} className="chart-outline">
              <PieChart data={tableData} />
            </div>
            <br />
            <h4>Failure by Test Station Pareto Chart</h4>
            <br />
            <div style={{ textAlign: "center" }} className="chart-outline">
              <ParetoChart data={paretoData} />
            </div>
            <br />
            <h4>Top 10 Failures Run Chart</h4>
            <br />
            <div style={{ textAlign: "center" }} className="chart-outline">
              <RunChart data={top10Batches} tableData={tableData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
