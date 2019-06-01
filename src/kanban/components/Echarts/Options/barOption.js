/**
 * Created by 曹禹 on 2017/11/29 0029.
 */
export function getIllegalTypeOption() {
  return {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      top: '1%',
    },
    calculable: true,
    xAxis: [
      {
        type: 'value',
        boundaryGap: [0, 0.01],
        show: false,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#40a9ff',
          },
        },
      },
    ],
    yAxis: [
      {
        type: 'category',
        data: ['违规停车', '违章转向', '违规用灯', '违章鸣笛', '违规停车', '违章转向', '违规用灯'],
        axisLine: { // 坐标轴线
          show: false,
        },
        axisTick: { // 坐标轴小标记
          show: false,
        },
      },
    ],
    series: [
      {
        type: 'bar',
        data: [18203, 23489, 29034, 14970, 31744, 20230, 23456],
        itemStyle: {
          normal: {
            color: '#c66',
            barBorderRadius: 20,
          },
          emphasis: {
            color: '#36f',
            barBorderRadius: 20,
          },
        },
      },
    ],
  };
}
