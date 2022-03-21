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

class DashboardTrendChart extends Component {
  state = {
    bars: [],
  };

  xAxis = React.createRef();
  yAxis = React.createRef();
  yAxisVolume = React.createRef();

  static getDerivedStateFromProps(nextProps, prevState) {
    const { data } = nextProps;
    if (!data) return {};

    const x = data.map((d) => d.batch);
    // console.log(x);

    const xScale = d3
      .scaleBand()
      .domain(x)
      .range([margin.left, width - margin.left]);
    // const [min, max] = d3.extent(updateData, (d) => d.yield);

    const [min, max] = d3.extent(data, (d) => d.numbers);

    const yScale = d3
      .scaleLinear()
      .domain([Math.min(min, 0), max])
      .range([height - margin.bottom, margin.top]);

    const trend = d3
      .line()
      .x((d) => xScale(d.batch) + 10)
      .y((d) => yScale(d.numbers));

    // console.log(trend(data[0]));

    const line = trend(data);

    // console.log(lines);
    return { xScale, yScale, line };
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
    return this.state.line.length ? (
      <div>
        <svg width={width} height={height}>
          <path
            d={this.state.line}
            fill={"none"}
            stroke={"#e58582"}
            strokeWidth={"3px"}
          />

          <g
            className="plato-axis_bottom"
            ref={this.xAxis}
            transform={`translate(0, ${height - margin.bottom})`}
          />
          <g ref={this.yAxis} transform={`translate(${margin.left}, 0)`} />
        </svg>
      </div>
    ) : null;
  }
}

export default DashboardTrendChart;
