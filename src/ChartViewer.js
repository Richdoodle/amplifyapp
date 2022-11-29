import React, { useState } from "react";
import Chart from "react-apexcharts";

export default function ApexChart(props) {
    const minArray = [];
    const maxArray = [];
    var min;
    var max;
    const series = [
        {
        name: "bars",
        data: props.bars
        }
    ];

    series[0].data.forEach(v => {
        minArray.push((v.y[2]))
    });
    series[0].data.forEach(v => {
        maxArray.push((v.y[1]))
    });

    min = Math.min(... minArray)
    max = Math.max(... maxArray)
    var diff = max - min

    const y = []
    const stepUps = [1, 0.5, 0.25, 0.1]
    stepUps.forEach(s => {
        y.push(Math.round((s - (diff % s)) * 1000) / 1000 )
    })
    var minStepUp = stepUps.at(y.indexOf(Math.min(... y)))
    // min = Math.floor(min / minStepUp) * minStepUp
    // max = Math.ceil(max / minStepUp) * minStepUp


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
                    var date = new Date(val).setHours((new Date(val).getHours()) + 8)
                    return (new Date(date).toLocaleTimeString());
                }
            }
        },
        yaxis: {
            show: true,
            min: function(min){
                return Math.floor(min / 0.1) * 0.1
            },
            max: function(max){
                return Math.ceil(max / 0.1) * 0.1
            },
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
        },
        grid: {
            padding: {
                right: 20
            },
            xaxis: {
                lines:{
                    show: true
                }
            }
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
