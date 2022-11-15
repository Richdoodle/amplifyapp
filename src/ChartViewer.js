import React, { useState } from "react";
import Chart from "react-apexcharts";

export default function ApexChart(props) {
    const series = [
        {
        name: "xx",
        data: props.data
        }
    ];
    const options = {
    chart: {
        type: 'candlestick',
        width: '98%'
    },
    dataLabels: {
        enabled: false
    },
    xaxis: {
        type: 'datetime'
    },
    yaxis: {
        tooltip: {
            enabled: true
        }
    },
    title: {
        text: 'Data Chart',
    },
    noData: {
        text: 'No Data'
    }
    };

  return (
    <div id="chart">
      <Chart 
        options={options} 
        series={series} 
        type="candlestick" 
        height="100%"
      />
    </div>
  );
}
