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
const margin = { top: 20, right: 5, bottom: 80, left: 35 };

const lineColors = [
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

class DashboardTrendChart extends Component {
  state = {
    bars: [],
  };

  xAxis = React.createRef();
  yAxis = React.createRef();
  yAxisVolume = React.createRef();

  static getDerivedStateFromProps(nextProps, prevState) {
    const { data, tableData } = nextProps;
    if (!data) return {};

    const labelData = [];
    tableData.forEach((item) => {
      labelData.push(`${item[0]}:(${item[1]})`);
    });

    const x = data[0].map((d) => d.batch);
    // console.log(x);

    const xScale = d3
      .scaleBand()
      .domain(x)
      .range([margin.left, width - margin.left]);
    // const [min, max] = d3.extent(updateData, (d) => d.yield);

    const yScale = d3
      .scaleLinear()
      .domain([0, 120])
      .range([height - margin.bottom, margin.top]);

    const trend = d3
      .line()
      .x((d) => xScale(d.batch) + 10)
      .y((d) => yScale(d.numbers));

    // console.log(trend(data[0]));

    const lines = [];
    data.forEach((d) => {
      // console.log(d);
      const line = trend(d);
      lines.push(line);
    });
    // console.log(lines);
    return { xScale, yScale, lines, labelData };
  }

  componentDidMount() {
    this.createAxis();
  }

  componentDidUpdate() {
    this.createAxis();
  }

  createAxis = () => {
    let xAxisD3 = d3.axisBottom();
    let yAxisD3 = d3.axisLeft().tickFormat((d) => d);

    let yAxisRight = d3.axisRight().tickFormat((d) => d);
    xAxisD3.scale(this.state.xScale);

    if (this.xAxis.current) {
      d3.select(this.xAxis.current).call(xAxisD3);
    }
    yAxisD3.scale(this.state.yScale);
    if (this.yAxis.current) {
      d3.select(this.yAxis.current).call(yAxisD3);
    }

    yAxisRight.scale(this.state.yScaleRight);
    if (this.yAxisVolume.current) {
      d3.select(this.yAxisVolume.current).call(yAxisRight);
    }
  };

  render() {
    return this.state.lines.length ? (
      <div>
        <svg width={width} height={height}>
          {this.state.lines.map((line, index) => (
            <path
              d={line}
              fill={"none"}
              stroke={lineColors[index]}
              strokeWidth={"3px"}
              key={line}
            />
          ))}
          {/* <path
          d={this.state.line}
          fill={"none"}
          stroke={"#e58582"}
          strokeWidth={"3px"}
        /> */}

          <g
            className="plato-axis_bottom"
            ref={this.xAxis}
            transform={`translate(0, ${height - margin.bottom})`}
          />
          <g ref={this.yAxis} transform={`translate(${margin.left}, 0)`} />
        </svg>
        <div className="pie-container">
          {this.state.labelData.slice(0, 10).map((item, index) => (
            <div style={{ marginRight: "10px" }} key={item}>
              <ColorBox boxColor={lineColors[index]} />
              {item}
            </div>
          ))}
        </div>
      </div>
    ) : null;
  }
}

export default DashboardTrendChart;
