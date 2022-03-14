import React, { Component } from "react";
import * as d3 from "d3";
import styled from "styled-components";

const ColorBox = styled.div`
  float: left;
  height: 20px;
  width: 20px;
  margin-bottom: 10px;
  margin-right: 10px;
  clear: both;
  background-color: ${(props) => props.boxColor}; ;
`;

const width = 500;
const height = 300;

const pieColors = [
  "#5485f5",
  "#bae5fe",
  "#8988d0",
  "#6dfdfb",
  "#dfd680",
  "#53666f",
  "#309d6d",
  "#cc5bcd",
  "#c893d9",
  "#988eb7",
  "#0d47f5",
  "#f01647",
  "#f7486e",
  "#1d8dda",
  "#a16451",
  "#d92608",
  "#cd9a92",
  "#d10f07",
  "#72aff1",
  "#01b7d0",
  "#55554c",
];

class DashboardPieChart extends Component {
  state = {
    slices: [], // array of svg path commands, each representing a day
    labelData: [],
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { data } = nextProps;
    if (!data) return {};

    const total = data.reduce((acc, ele) => acc + ele[1], 0);
    const labelData = [];
    data.forEach((item) => {
      const percentage = parseFloat(((item[1] / total) * 100).toFixed(1)) || 0;
      labelData.push(`${item[0]} (${percentage}%)`);
    });

    // console.log(labelData);

    const colors = d3.scaleOrdinal(pieColors);

    const arcGenerator = d3.arc();
    const pieGenerator = d3.pie();

    const pie = pieGenerator(data.map((item) => item[1]));
    const slices = pie.map((d, i) => {
      const path = arcGenerator({
        startAngle: d.startAngle,
        endAngle: d.endAngle,
        innerRadius: 80,
        outerRadius: height / 2,
      });
      return { path, fill: colors(i) };
    });
    return { slices, labelData };
  }

  render() {
    return (
      <div>
        <svg width={width} height={height}>
          <g transform={`translate(${width / 2}, ${height / 2})`}>
            {this.state.slices.map((d, i) => (
              <path key={i} d={d.path} fill={d.fill} />
            ))}
          </g>
        </svg>
        <div className="pie-container">
          {this.state.labelData.slice(0, 10).map((item, index) => (
            <div style={{ marginRight: "10px" }} key={item}>
              <ColorBox boxColor={pieColors[index]} />
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default DashboardPieChart;
