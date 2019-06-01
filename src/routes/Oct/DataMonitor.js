import React from 'react';
import { connect } from 'dva';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/theme/roma';
import 'echarts/theme/macarons';
import 'echarts/theme/shine';

import { Form, Select, Radio, Input, Button, message, Row, Col } from 'antd';

const FormItem = Form.Item;
class MenuManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
    const myChart = echarts.init(document.getElementById('main'));
    const c2 = echarts.init(document.getElementById('c2'), 'roma');
    const c3 = echarts.init(document.getElementById('c3'), 'macarons');
    const c4 = echarts.init(document.getElementById('c4'), 'shine');
    // 绘制图表
    myChart.setOption({
      title: { text: '最近一小时平均车流量' },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['车流量', '车速'],
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '车流量',
          type: 'line',
          stack: '总量',
          data: [120, 132, 101, 134, 90, 230, 210],
        },
        {
          name: '车速',
          type: 'line',
          stack: '总量',
          data: [220, 182, 191, 234, 290, 330, 310],
        },
      ],
    });
    c2.setOption({
      title: { text: '最近一小时车籍分类' },
      tooltip: {},
      xAxis: {
        data: ['合计', '川A车辆', '省内异地', '省外异地', '川A出租'],
      },
      yAxis: {},
      series: [{
        name: '车籍数量',
        type: 'bar',
        data: [76, 20, 36, 10, 10],
        label: {
          normal: {
            show: true,
            position: 'inside',
          },
        },
      }],
    });
    c3.setOption({
      title: { text: '最近一小时号牌颜色' },
      tooltip: {},
      xAxis: {
        data: ['总计', '蓝色', '绿色', '黄色', '黑色', '白色'],
      },
      yAxis: {},
      series: [{
        name: '号牌颜色数量',
        type: 'bar',
        data: [96, 20, 36, 10, 10, 20],
        label: {
          normal: {
            show: true,
            position: 'inside',
          },
        },
      }],
    });
    c4.setOption({
      title: { text: '最近一小时设备状态' },
      tooltip: {},
      xAxis: {
        data: ['合计', '在线设备', '正常设备', '故障设备'],
      },
      yAxis: {},
      series: [{
        name: '设备数量',
        type: 'bar',
        data: [301, 193, 155, 146],
        label: {
          normal: {
            show: true,
            position: 'inside',
          },
        },
      }],
    });

    this.timer = setInterval(
      () => this.xtick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  xtick() {
    this.setState({
    });
    console.log('xxx');
  }

  // 查询设备列表
  handleSubmit() {
    this.setState({
    });
  }

  // 重置搜索框
  handleReload() {
    this.setState({
    });
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      style: { height: '30px' },
    };
    return (
      <div style={{ height: '100%', width: '100%' }}>
        <Form>
          <Row>
            <Col span={6} offset={12}>
              <FormItem {...formItemLayout} label="路段筛选">
                <Input maxLength="24" />
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem style={{ textAlign: 'right' }}>
                <Button type="primary" htmlType="submit" style={{ margin: '0 5px' }} onClick={() => this.handleSubmit()}>查询</Button>
                <Button type="primary" style={{ margin: '0 3px' }} onClick={() => this.handleReload()}>重置</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <div style={{ height: 300 }} className="outline-out">
          <Col span={12} style={{ height: '100%' }} className="outline-inner" id="main" />
          <Col span={12} style={{ height: '100%' }} className="outline-inner" id="c2" />
        </div>
        <div style={{ height: 300 }} className="outline-out">
          <Col span={12} style={{ height: '100%' }} className="outline-inner" id="c3" />
          <Col span={12} style={{ height: '100%' }} className="outline-inner" id="c4" />
        </div>
      </div>
    );
  }
}

export default connect()(MenuManage);
