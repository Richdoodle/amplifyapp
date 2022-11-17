import React, { useState } from "react";
import Chart from "react-apexcharts";

export default function ApexChart(props) {
    const series = [
        {
        name: "bars",
        data: props.bars
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
            type: 'datetime',
            labels: {
                format: 'HH:mm'
            },
            tooltip: {
                enabled: true,
                formatter: function(val, opts) {
                    var date = new Date(val).toISOString();
                    return ((String(date).split('T')).at(1).replace(':00.000Z', ''));
                }
            }
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
        },
        annotations: {
            xaxis: props.xaxis
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
