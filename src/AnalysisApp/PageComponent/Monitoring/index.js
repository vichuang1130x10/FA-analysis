import React, { useEffect } from "react";
import { Row, Table } from "react-bootstrap";
import {
  parsingReasionQty,
  parsingStationQty,
  getBatch,
} from "../../Utils/ShopFloorDataParsing";

const titles = [
  `Rework Count > 5`,
  `Not Allowed to Repair`,
  `BGA, QFN, Connector(levle 2) Same position repair > 2`,
  `Same Position repair > 3`,
];

export default function App(props) {
  useEffect(() => {
    // console.log(props.location.state);
  });

  const { data, attr } = props.location.state;

  return (
    <div className="page-vh">
      <div className="container">
        <br />
        <h4>{`${titles[attr]}`}</h4>
        {attr === 0
          ? data.map((d) => {
              return (
                <div key={d}>
                  <h5>{d[0]}:</h5>

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
                        <th>Batch Number</th>
                        <th>SN</th>
                        <th>Repair Date</th>
                        <th>Location</th>
                        <th>Repair Reason</th>
                        <th>Failed Station</th>
                        <th>Current SFC Status</th>
                        <th>Package Footprint</th>
                      </tr>
                    </thead>
                    <tbody>
                      {d[2].map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>{item.batchNo}</td>
                            <td>{item.sn}</td>
                            <td>{item.rDate}</td>
                            <td>{item.item}</td>
                            <td>{item.reason}</td>
                            <td>{item.station}</td>
                            <td>{item.final}</td>
                            <td>{item.cadLoc}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              );
            })
          : null}
        {attr === 1 ? (
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
                <th>Batch Number</th>
                <th>SN</th>
                <th>Repair Date</th>
                <th>Location</th>
                <th>Repair Reason</th>
                <th>Failed Station</th>
                <th>Current SFC Status</th>
                <th>Package Footprint</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.batchNo}</td>
                    <td>{item.sn}</td>
                    <td>{item.rDate}</td>
                    <td>{item.item}</td>
                    <td>{item.reason}</td>
                    <td>{item.station}</td>
                    <td>{item.final}</td>
                    <td>{item.cadLoc}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        ) : null}
        {attr === 2 || attr === 3
          ? data.map((d, dIndex) => {
              return (
                <div>
                  <h5 key={dIndex}>{d[0][0]}:</h5>

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
                      <tr key={dIndex}>
                        <th>Batch Number</th>
                        <th>SN</th>
                        <th>Repair Date</th>
                        <th>Location</th>
                        <th>Repair Reason</th>
                        <th>Failed Station</th>
                        <th>Current SFC Status</th>
                        <th>Package Footprint</th>
                      </tr>
                    </thead>
                    <tbody>
                      {d[0][2].map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>{item.batchNo}</td>
                            <td>{item.sn}</td>
                            <td>{item.rDate}</td>
                            <td>{item.item}</td>
                            <td>{item.reason}</td>
                            <td>{item.station}</td>
                            <td>{item.final}</td>
                            <td>{item.cadLoc}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              );
            })
          : null}
      </div>
      <div style={{ marginTop: "50px" }}></div>
    </div>
  );
}
