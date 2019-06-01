/**
 * Created by 曹禹 on 2017/11/23 0023.
 */
import { connect } from 'dva';
import React from 'react';
import moment from 'moment';

import { THEMES } from '../../config/constant';

const R = require('ramda');

const myColor = [
  '#ff7f50',
  '#87cefa',
  '#da70d6',
  '#32cd32',
  '#6495ed',
  '#ff69b4',
  '#ba55d3',
  '#cd5c5c',
  '#ffa500',
  '#40e0d0',
  '#1e90ff',
  '#ff6347',
  '#7b68ee',
  '#00fa9a',
  '#ffd700',
  '#6699FF',
  '#ff6666',
  '#3cb371',
  '#b8860b',
  '#30e0e0',
];
const today = moment().format('MM/DD');
const yestoday = moment()
  .subtract(1, 'day')
  .format('MM月DD日');

export function getBarOption(illegalData = [], date, themeId = THEMES.dark) {
  const statisticsPerson = R.take(6, illegalData);
  // const dateSource =R.compose(R.map(R.prop('police')) ,R.take(10) )(illegalData)
  const dateSource = R.map(R.prop('police'))(statisticsPerson);

  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0,0,0,0.5)', // 提示背景颜色，默认为透明度为0.7的黑色
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    legend: getLegend(
      {
        data: ['待初审', '待复审', '上传成功'],
        left: 'center',
        itemWidth: 15, // 图例图形宽度
        itemHeight: 7, // 图例图形高度
        itemGap: 8,
      },
      themeId
    ),
    grid: {
      left: '3%',
      right: '3%',
      bottom: '0',
      top: '15%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: dateSource,
        axisTick: {
          // 坐标轴小标记
          show: false,
        },
        axisLine: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          color: '#fff',
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        splitNumber: 5, // 分割段数，默认为5
        axisTick: {
          // 坐标轴小标记
          show: false,
        },
        axisLine: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          color: '#fff',
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ['#13214E', '#0F1C46'],
          },
        },
      },
    ],
    series: [
      {
        name: '待初审',
        type: 'bar',
        data: R.map(R.prop('status0'))(statisticsPerson),
        // data: [56, 80, 10],
        barWidth: 15,
        itemStyle: {
          normal: {
            color: '#08c', // 柱状图颜色tongyi
          },
        },
      },
      {
        name: '待复审',
        type: 'bar',
        data: R.map(R.prop('status1'))(statisticsPerson),
        // data: [99, 20, 45],
        barWidth: 15,
        itemStyle: {
          normal: {
            color: '#f90', // 柱状图颜色tongyi
          },
        },
      },
      {
        name: '上传成功',
        type: 'bar',
        data: R.map(R.prop('status4'))(statisticsPerson),
        // data: [16, 20, 80],
        barWidth: 15,
        itemStyle: {
          normal: {
            color: '#0c6', // 柱状图颜色tongyi
          },
        },
      },
    ],
  };
}
/**
 * 首页饼状图事故数据统计
 * @param data
 */
export function getCaseCountOption(data = [], themeId = THEMES.dark) {
  /* const statisticsData = R.take(9, data);
  const title = R.map(R.prop('department_name'))(statisticsData);
  const values = statisticsData.map((x) => {
    return { value: x.count, name: x.department_name };
  });
*/
  const values = [
    {
      value: 12,
      name: 'test1',
    },
    {
      value: 12,
      name: 'test3',
    },
  ];
  return {
    // title: {
    //   text: '事故统计',
    //   x: 'center',
    // },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    // legend: {
    //   orient: 'vertical',
    //   left: 'left',
    //   data: title,
    // },
    series: [
      {
        name: '来源',
        type: 'pie',
        radius: '60%',
        color: myColor,
        center: ['50%', '50%'],
        data: values,
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };
}

function getLegend(data, themeId = THEMES.dark) {
  const color = themeId == THEMES.dark ? '#fffffc' : '#000002';

  return {
    ...data,
    textStyle: {
      color,
      fontSize: 12,
    },
    pageTextStyle: {
      color,
    },
    pageIconColor: color,
    pageIconInactiveColor: color,
  };
}
function getTitle(data, themeId = THEMES.dark, date) {
  const color = themeId == THEMES.dark ? '#fffffc' : '#000002';

  return {
    ...data,
    textStyle: {
      color,
      fontSize: 14,
    },
  };
}
function getLabel(data, themeId = THEMES.dark) {
  const color = themeId == THEMES.dark ? '#fffffc' : '#000002';

  return {
    ...data,
    normal: {
      textStyle: {
        color,
      },
    },
  };
}

function getLabelLine(data, themeId = THEMES.dark) {
  const color = themeId == THEMES.dark ? '#fffffc' : '#000002';

  return {
    ...data,
    normal: {
      lineStyle: {
        color,
      },
      smooth: 0.2,
      length: 10,
      length2: 20,
    },
  };
}
function getLineStyle(themeId = THEMES.dark) {
  const color = themeId == THEMES.dark ? '#fffffc' : '#000002';

  return {
    color,
  };
}

function getSplitLine(themeId = THEMES.dark) {
  const colors = themeId == THEMES.dark ? ['#142250', '#0f1c45'] : ['#fafafa', '#fffffc'];

  return {
    lineStyle: {
      color: colors,
    },
  };
}
function getSplitArea1(themeId = THEMES.dark) {
  const colors = themeId == THEMES.dark ? ['#142250', '#0f1c45'] : ['#fafafa', '#fffffc'];

  return {
    areaStyle: {
      color: colors,
      shadowColor: 'rgba(0, 0, 0, 0.3)',
      shadowBlur: 10,
    },
  };
}
// 柱状图 柱状颜色变化

function getColor(themeId = THEMES.dark) {
  return themeId == THEMES.dark ? ['#215f9d', '#eb7451'] : ['#469cd3', '#da4057'];
}
// 柱状图
export function getUnitDistributionOption(
  unitDistribution = { red: [], yellow: [], green: [] },
  themeId = THEMES.dark
) {
  const red = [0, 0, 0, 0];
  const yellow = [0, 0, 0, 0];
  const green = [0, 0, 0, 0];
  if (
    unitDistribution !== null
    && unitDistribution.red !== undefined
    && unitDistribution.red !== null
  ) {
    for (let i = 0; i < unitDistribution.red.length; i += 1) {
      if (unitDistribution.red[i].deptno == '440604220800') {
        // 一中队
        red[0] = unitDistribution.red[i].total;
      }
      if (unitDistribution.red[i].deptno == '440604220900') {
        // 二中队
        red[1] = unitDistribution.red[i].total;
      }
      if (unitDistribution.red[i].deptno == '440604221000') {
        // 三中队
        red[2] = unitDistribution.red[i].total;
      }
      if (unitDistribution.red[i].deptno == '440604221100') {
        // 四中队
        red[3] = unitDistribution.red[i].total;
      }
    }
  }
  if (
    unitDistribution !== null
    && unitDistribution.yellow !== undefined
    && unitDistribution.yellow !== null
  ) {
    for (let i = 0; i < unitDistribution.yellow.length; i += 1) {
      if (unitDistribution.yellow[i].deptno == '440604220800') {
        yellow[0] = unitDistribution.yellow[i].total;
      }
      if (unitDistribution.yellow[i].deptno == '440604220900') {
        yellow[1] = unitDistribution.yellow[i].total;
      }
      if (unitDistribution.yellow[i].deptno == '440604221000') {
        yellow[2] = unitDistribution.yellow[i].total;
      }
      if (unitDistribution.yellow[i].deptno == '440604221100') {
        yellow[3] = unitDistribution.yellow[i].total;
      }
    }
  }
  if (
    unitDistribution !== null
    && unitDistribution.green !== undefined
    && unitDistribution.green !== null
  ) {
    for (let i = 0; i < unitDistribution.green.length; i += 1) {
      if (unitDistribution.green[i].deptno == '440604220800') {
        green[0] = unitDistribution.green[i].total;
      }
      if (unitDistribution.green[i].deptno == '440604220900') {
        green[1] = unitDistribution.green[i].total;
      }
      if (unitDistribution.green[i].deptno == '440604221000') {
        green[2] = unitDistribution.green[i].total;
      }
      if (unitDistribution.green[i].deptno == '440604221100') {
        green[3] = unitDistribution.green[i].total;
      }
    }
  }
  return {
    color: ['#eb7451', '#30cf9f'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    legend: getLegend({ data: ['巡检数', '警情上报数'], itemGap: 8 }, themeId),
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: ['一中队', '二中队', '三中队', '四中队'],
        axisTick: {
          alignWithLabel: true,
        },
        axisLine: {
          show: true,
          lineStyle: getLineStyle(themeId),
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        axisLine: {
          show: true,
          lineStyle: getLineStyle(themeId),
        },
      },
    ],
    series: [
      {
        name: '巡检数',
        type: 'bar',
        barWidth: '10%',
        data: red,
      },
      {
        name: '警情上报数',
        type: 'bar',
        barWidth: '10%',
        data: yellow,
      },
    ],
  };
}
// 事故警情数组成
export function getCaseNumByStageOption(caseNumByStage = [], themeId = THEMES.dark) {
  const shouli = caseNumByStage !== null ? caseNumByStage.shouli : '';
  const quzheng = caseNumByStage !== null ? caseNumByStage.quzheng : '';
  const rending = caseNumByStage !== null ? caseNumByStage.rending : '';
  const tiaojie = caseNumByStage !== null ? caseNumByStage.tiaojie : '';
  const jiean = caseNumByStage !== null ? caseNumByStage.jiean : '';
  return {
    color: myColor,
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    legend: getLegend(
      {
        orient: 'vertical',
        left: 'left',
        data: ['受理', '取证', '认定', '调节', '结案'],
      },
      themeId
    ),
    series: [
      {
        name: '事故警情数组成',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: [
          { value: shouli, name: '受理' },
          { value: quzheng, name: '取证' },
          { value: rending, name: '认定' },
          { value: tiaojie, name: '调节' },
          { value: jiean, name: '结案' },
        ],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };
}
// 本月事故地点排名
export function getCaseOrderByRoadOption(caseOrderByRoad = [], themeId = THEMES.dark) {
  const x = [];
  const data1 = [];
  const data2 = [];
  if (caseOrderByRoad !== null) {
    for (let i = 0; i < caseOrderByRoad.length && i < 4; i += 1) {
      // x.push(`${caseOrderByRoad[i].lkmc}(${caseOrderByRoad[i].deptshortname})`);
      x.push(`${caseOrderByRoad[i].lkmc}(${caseOrderByRoad[i].deptshortname})`);
      data1.push(caseOrderByRoad[i].total);
      data2.push(caseOrderByRoad[i].deptshortname);
    }
  }
  return {
    color: ['#3398DB', '#0f0'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: x,
        axisTick: {
          alignWithLabel: true,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#40a9ff',
          },
        },
        axisLabel: {
          formatter: (val) => {
            const strs = val.split(''); // 字符串数组
            let str = '';
            for (let i = 0, s; (s = strs[(i += 1)]);) {
              // 遍历字符串数组
              str += s;
              if (!(i % 4)) str += '\n'; // 按需要求余
            }
            return str;
          },
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#40a9ff',
          },
        },
      },
    ],
    series: [
      {
        name: '事故总数',
        type: 'bar',
        barWidth: '10%',
        data: data1,
      },
    ],
  };
}
// 勤务管理-实时警力分布趋势
export function getDutyChartDataOption(dutyChartData = [], themeId = THEMES.dark) {
  const x = [];
  const y = [];
  if (dutyChartData !== null) {
    for (let i = 0; i < dutyChartData.length; i += 1) {
      x.push(`${dutyChartData[i].startpoint}-${dutyChartData[i].endpoint}`);
      y.push(dutyChartData[i].cnt);
    }
  }
  return {
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: x,
      axisLine: {
        show: true,
        lineStyle: getLineStyle(themeId),
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: true,
        lineStyle: getLineStyle(themeId),
      },
    },
    series: [
      {
        name: '警力分布',
        data: y,
        type: 'line',
        smooth: true,
      },
    ],
  };
}
// 占路施工审批趋势
export function getDigroadChartDataOption(digroadChartData = [], themeId = THEMES.dark) {
  const apply = [];
  const did = [];
  if (digroadChartData !== null && digroadChartData.length == 12) {
    for (let i = 0; i < digroadChartData.length; i += 1) {
      apply.push(digroadChartData[i].NUM1);
      did.push(digroadChartData[i].NUM2);
    }
  }
  return {
    color: ['#FF6666', '#0f0'],
    tooltip: {
      trigger: 'axis',
    },
    legend: getLegend(
      {
        data: ['申请', '完工'],
        left: 'right',
      },
      themeId
    ),
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [
        '一月',
        '二月',
        '三月',
        '四月',
        '五月',
        '六月',
        '七月',
        '八月',
        '九月',
        '十月',
        '十一月',
        '十二月',
      ],
      axisLine: {
        show: true,
        lineStyle: getLineStyle(themeId),
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: true,
        lineStyle: getLineStyle(themeId),
      },
    },
    series: [
      {
        name: '申请',
        type: 'line',
        data: apply,
      },
      {
        name: '完工',
        type: 'line',
        data: did,
      },
    ],
  };
}
/**
 * 获取当天到当前时刻警情审核总数以及有效警情数、无效警情数、相关警情数、误报警情数、无法确认警情数
 * @param data
 * @param themeId 主题 设置颜色相关
 * @returns
 */
export function getEventCountsAuditedOption(data = {}, themeId = THEMES.dark) {
  const ineffective = data.ineffective ?? '0';
  const mistake = data.mistake ?? '0';
  const effective = data.effective ?? '0';
  const total = data.total ?? '0';
  const relative = data.relative ?? '0';
  const unconfirm = data.relative ?? '0';
  return {
    color: myColor,
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    legend: getLegend(
      {
        orient: 'vertical',
        right: '15%',
        top: '15%',
        data: ['有效警情数', '无效警情数', '相关警情数', '误报警情数', '无法确认警情数'],
      },
      themeId
    ),
    series: [
      {
        name: '警情审核',
        type: 'pie',
        roseType: 'radius',
        radius: ['35%', '90%'],
        center: ['30%', '60%'],
        data: [
          { value: effective, name: '有效警情数' },
          { value: ineffective, name: '无效警情数' },
          { value: relative, name: '相关警情数' },
          { value: mistake, name: '误报警情数' },
          { value: unconfirm, name: '无法确认警情数' },
        ],
        label: {
          show: false,
        },
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };
}

// 玫瑰图
export function test1(data = {}, themeId = THEMES.dark) {
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },

    visualMap: {
      show: false,
      min: 20,
      max: 50,
      inRange: {
        colorLightness: [0, 1],
      },
    },
    series: [
      {
        name: '访问来源',
        type: 'pie',
        radius: '80%',
        center: ['50%', '50%'],
        data: [
          { value: 33, name: '有效警情数' },
          { value: 31, name: '无效警情数' },
          { value: 27, name: '相关警情数' },
          { value: 23, name: '误报警情数' },
          { value: 40, name: '无法确认警情数' },
        ].sort((a, b) => {
          return a.value - b.value;
        }),
        roseType: 'radius',
        label: getLabel({}, themeId),
        labelLine: getLabelLine({}, themeId),
        itemStyle: {
          normal: {
            color: '#c23531',
            shadowBlur: 200,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },

        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay(idx) {
          return Math.random() * 200;
        },
      },
    ],
  };

  return option;
}

// 雷达图
export function getRadar(data = {}, themeId = THEMES.dark) {
  const option = {
    tooltip: {},
    legend: getLegend(
      {
        orient: 'vertical',
        right: '1%',
        top: '15%',
        data: data?.legenddata,
      },
      themeId
    ),

    radar: {
      // shape: 'circle',
      name: {
        textStyle: {
          borderRadius: 3,
          padding: [3, 5],
        },
      },
      splitArea: getSplitArea1(themeId),

      indicator: [
        { name: '交通拥堵', max: 100 },
        { name: '交通事故', max: 100 },
        { name: '突发事件', max: 100 },
        { name: '恶劣天气', max: 100 },
        { name: '交通管制', max: 100 },
        { name: '其他', max: 100 },
      ],
    },
    series: [
      {
        name: '警情类型分析',
        type: 'radar',
        // areaStyle: {normal: {}},
        data: [
          {
            value: [3, 10, 28, 5, 30, 19],
            name: data.legenddata[0],
          },
          {
            value: [50, 44, 68, 68, 42, 81],
            name: data.legenddata[1],
          },
        ],
      },
    ],
  };

  return option;
}

// 折线图
export function getline(digroadChartData = [], themeId = THEMES.dark) {
  const options = {
    title: getTitle({ text: yestoday }, themeId),
    tooltip: {
      trigger: 'axis',
    },
    legend: getLegend(
      {
        data: ['交通拥堵', '突发事件', '恶劣天气', '交通管制'],
      },
      themeId
    ),
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    toolbox: {},
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['0:00', '4:00', '8:00', '12:00', '16:00', '20:00', '24:00'],
      axisLine: {
        show: true,
        lineStyle: getLineStyle(themeId),
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: true,
        lineStyle: getLineStyle(themeId),
      },
      splitLine: getSplitLine(themeId),
      splitArea: getSplitArea1(themeId),
    },
    series: [
      {
        name: '突发事件',
        type: 'line',
        stack: '总量',
        data: [12, 13, 10, 13, 9, 23, 21],
      },
      {
        name: '恶劣天气',
        type: 'line',
        stack: '总量',
        data: [22, 18, 19, 23, 29, 33, 31],
      },
      {
        name: '交通管制',
        type: 'line',
        stack: '总量',
        data: [15, 23, 20, 15, 19, 33, 41],
      },
      {
        name: '交通拥堵',
        type: 'line',
        stack: '总量',
        data: [32, 33, 30, 33, 39, 33, 32],
      },
    ],
  };
  return options;
}

// 柱状图 6楼演示
export function getLine(
  unitDistribution = { red: [], yellow: [], green: [] },
  themeId = THEMES.dark
) {
  const red = [1, 4, 5, 2, 8, 2];
  const yellow = [10, 2, 5, 6, 12, 2];

  return {
    title: getTitle({ text: today }, themeId),
    color: getColor(themeId),
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    legend: getLegend({ data: ['巡检数', '警情上报数'], itemGap: 8 }, themeId),
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: ['黄强', '杨迪', '张起明', '李天', '荆易', '刘一天'],
        axisTick: {
          alignWithLabel: true,
        },
        axisLine: {
          show: true,
          lineStyle: getLineStyle(themeId),
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        axisLine: {
          show: true,
          lineStyle: getLineStyle(themeId),
        },
        splitLine: getSplitLine(themeId),
      },
    ],
    series: [
      {
        name: '巡检数',
        type: 'bar',
        barWidth: '10%',
        data: red,
      },
      {
        name: '警情上报数',
        type: 'bar',
        barWidth: '10%',
        data: yellow,
      },
    ],
  };
}

// 饼状  多环图
export function getPieDuoHuan(data = {}, themeId = THEMES.dark) {
  const ineffective = data.ineffective ?? '0';
  const mistake = data.mistake ?? '0';
  const effective = data.effective ?? '0';
  const total = data.total ?? '0';
  const relative = data.relative ?? '0';
  const unconfirm = data.relative ?? '0';

  return {
    title: getTitle({ text: today }, themeId),
    tooltip: {
      show: false, // 防止鼠标移到不需要的数据上弹出label
      trigger: 'item',
      formatter: '{a} : {c} ({d}%)',
    },
    color: ['#59c983', '#4d8bde', '#f0cb4b', '#17b5ff', '#f69357'],
    legend: getLegend(
      {
        orient: 'vertical',
        x: '30%',
        top: '19%',
        itemHeight: 10, // 图例的高度
        itemGap: 5, // 图例之间的间距
        data: ['视频巡检:2件', '互联网:6件', '突发拥堵:8件', '事件检测:10件', '其他:12件'],
      },
      themeId
    ),

    series: [
      {
        name: '视频巡检:2件',
        type: 'pie',
        radius: ['14%', '24%'], // 环的位置

        label: {
          normal: {
            position: 'inner',
          },
        },
        labelLine: {
          normal: {
            show: false,
          },
        },
        data: [
          {
            value: 2, // 需要显示的数据
            itemStyle: {
              normal: {
                color: '#59c983',
              },
            },
          },
          {
            value: 9, // 不需要显示的数据，颜色设置成和背景一样
            itemStyle: {
              normal: {
                color: 'transparent',
              },
            },
          },
        ],
      },
      {
        name: '互联网:6件',
        type: 'pie',
        radius: ['30%', '40%'],

        label: {
          normal: {
            position: 'inner',
          },
        },
        labelLine: {
          normal: {
            show: false,
          },
        },
        data: [
          {
            value: 6,
            itemStyle: {
              normal: {
                color: '#4d8bde',
              },
            },
          },
          {
            value: 9,
            itemStyle: {
              normal: {
                color: 'transparent',
              },
            },
          },
        ],
      },
      {
        name: '突发拥堵:8件',
        type: 'pie',
        radius: ['46%', '56%'],

        label: {
          normal: {
            position: 'inner',
          },
        },
        labelLine: {
          normal: {
            show: false,
          },
        },
        data: [
          {
            value: 8,
            itemStyle: {
              normal: {
                color: '#f0cb4b',
              },
            },
          },
          {
            value: 9,
            itemStyle: {
              normal: {
                color: 'transparent',
              },
            },
          },
        ],
      },
      {
        name: '事件检测:10件',
        type: 'pie',
        radius: ['62%', '72%'],

        label: {
          normal: {
            position: 'inner',
          },
        },
        labelLine: {
          normal: {
            show: false,
          },
        },
        data: [
          {
            value: 10,
            itemStyle: {
              normal: {
                color: '#17b5ff',
              },
            },
          },
          {
            value: 9,
            itemStyle: {
              normal: {
                color: 'transparent',
              },
            },
          },
        ],
      },
      {
        name: '其他:12件',
        type: 'pie',
        radius: ['78%', '88%'],

        label: {
          normal: {
            position: 'inner',
          },
        },
        labelLine: {
          normal: {
            show: false,
          },
        },
        data: [
          {
            value: 12,
            itemStyle: {
              normal: {
                color: '#f69357',
              },
            },
          },
          {
            value: 9,
            itemStyle: {
              normal: {
                color: 'transparent',
              },
            },
          },
        ],
      },
    ],
  };
}
