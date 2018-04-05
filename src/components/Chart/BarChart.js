import React from 'react';
import PropTypes from 'prop-types';
import ReactHighcharts from 'react-highcharts';
import NumberHelper from '../../helpers/NumberHelper.js';

class BarChart extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired
  };

  getChartConfig() {
    return {
        chart: {
            type: 'column'
        },
        title: {
            text: ''
        },
        credits: {
            enabled: false
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            type: 'category',
            labels: {
                rotation: -45,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            },
            tickInterval: 7
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            formatter: function() {
                return 'Rows Loaded (' + this.point.name + '): <b>' + NumberHelper.formatNumber(this.y) + '</b><br/>';
            }
        },
        series: [{
            name: 'Rows Loaded',
            data: this.props.data
        }]
      };
  }

  render() {
    return (
      <ReactHighcharts config={this.getChartConfig()}></ReactHighcharts>
    );
  }
}

export default BarChart;
