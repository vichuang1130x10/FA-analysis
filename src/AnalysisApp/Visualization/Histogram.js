import React, { Component } from "react";
import * as d3 from "d3";

const width = 500;
const height = 300;
const margin = { top: 20, right: 5, bottom: 25, left: 35 };

class App extends Component {
  state = {
    data: [],
    text: [],
    bins: [],
    scaleX: null,
    scaleY: null,
    bars: [],
  };

  xAxis = React.createRef();
  yAxis = React.createRef();

  static getDerivedStateFromProps(nextProps, prevState) {
    const { data } = nextProps;
    if (!data) return {};

    const histogramData = data.map((d) => d.tat);

    const scaleX = d3
      .scaleLinear()
      .domain([0, 500])
      .range([margin.left, width - margin.left]);

    const histogram = d3
      .histogram()
      .value((d) => d)
      .domain(scaleX.domain())
      .thresholds(scaleX.ticks(70));

    const bins = histogram(histogramData);

    const scaleY = d3.scaleLinear().range([height - margin.bottom, margin.top]);
    scaleY.domain([0, d3.max(bins, (d) => d.length + 10)]);

    const bars = bins.map((d) => {
      return {
        x: scaleX(d.x0),
        y: scaleY(d.length),
        height: height - scaleY(d.length) - margin.bottom,
        width: scaleX(d.x1) - scaleX(d.x0),
        fill: "#69b3a2",
      };
    });

    return { bars, scaleX, scaleY };
  }

  componentDidMount() {
    this.createAxis();
  }

  componentDidUpdate() {
    this.createAxis();
  }

  createAxis = () => {
    const { scaleX, scaleY } = this.state;
    let xAxisD3 = d3.axisBottom().tickFormat((d) => `${d}`);
    let yAxisD3 = d3.axisLeft().tickFormat((d) => d);

    xAxisD3.scale(scaleX);

    if (this.xAxis.current) {
      d3.select(this.xAxis.current).call(xAxisD3);
    }

    yAxisD3.scale(scaleY);

    if (this.yAxis.current) {
      d3.select(this.yAxis.current).call(yAxisD3);
    }
  };

  render() {
    const { bars } = this.state;
    return (
      <div className="App">
        <svg width={width} height={height}>
          {bars.length
            ? bars.map((d, i) => (
                <rect
                  key={i}
                  x={d.x}
                  y={d.y}
                  width={d.width}
                  height={d.height}
                  fill={d.fill}
                />
              ))
            : null}

          <g
            ref={this.xAxis}
            transform={`translate(0, ${height - margin.bottom})`}
          />
          <g ref={this.yAxis} transform={`translate(${margin.left}, 0)`} />
        </svg>
      </div>
    );
  }
}

export default App;
