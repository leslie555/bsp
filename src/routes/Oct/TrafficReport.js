import React from 'react';
import { connect } from 'dva';
import { Form, Layout, Row, Col, Button, Input, Menu, Breadcrumb, Icon, Table } from 'antd';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

const FormItem = Form.Item;
class TrafficReportManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(document.getElementById('main'));
    // 绘制图表
    myChart.setOption({
      title: { text: '交通事件统计报表' },
      tooltip: {},
      xAxis: {
        data: ['交通拥堵', '车辆停驶', '遗弃物', '车辆逆行', '烟雾事件', '车辆慢行'],
      },
      yAxis: {},
      series: [{
        name: '事件数量',
        type: 'bar',
        data: [15, 8, 10, 41, 5, 16],
      }],
    });

    this.timer = setInterval(
      () => this.xtick(),
      60 * 1000
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
    const { form, onSearch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        onSearch(values);
      }
    });
  }

  // 重置搜索框
  handleReload() {
    const { form } = this.props;
    form.resetFields();
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      style: { height: '20px' },
    };
    const { form, codeList } = this.props;
    const noMatch = '';
    const reg = new RegExp('^[0-9]*$');
    const columns = [
      {
        title: '交通事件',
        width: '40%',
        dataIndex: 'hp',
        key: 'hp,',
        align: 'center',
        render: (text) => {
          return (
            <span>
              {this.getPicture(text)}
            </span>
          );
        },
      }, {
        title: '事件数量统计',
        width: '30%',
        dataIndex: 'sj',
        key: 'sj,',
        align: 'center',
      }, {
        title: '时间',
        width: '30%',
        dataIndex: 'sj',
        key: 'sj',
        align: 'center',
        // render: (text) => {
        //   return (
        //     <span>
        //       {this.getPicture(text)}
        //     </span>
        //   );
        // },
      }];
    return (
      <div style={{ height: '100%', width: '100%' }}>
        <div className="outline-out outline-out-top">
          <div className="outline-inner">
            <Form className="form-outline-inner-padding">
              <Row>
                <Col span={6}>
                  <FormItem {...formItemLayout} label="设备编码">
                    <Input maxLength="12" />
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label="设备名称">
                    <Input maxLength="50" />
                  </FormItem>
                </Col>
                <Col span={6} offset={6}>
                  <FormItem style={{ textAlign: 'right' }}>
                    <Button type="primary" htmlType="submit" style={{ margin: '0 5px' }} onClick={() => this.handleSubmit()}>查询</Button>
                    <Button type="primary" style={{ margin: '0 3px' }} onClick={() => this.handleReload()}>重置</Button>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
        <div className="outline-out outline-out-top" style={{ height: '500px', marginTop: '1rem' }}>
          <div className="outline-inner" style={{ height: '100%' }}>
            <Col span={24} style={{ height: '100%' }} id="main" />
          </div>
        </div>
        { /* 列表 */ }
        <div className="outline-out ">
          <div className="outline-inner">
            <div className="outline-inner-padding">
              <Row>
                <Col span={14}>
                  <div>搜索结果 共<span className="allNumLight">{}</span> 条</div>
                </Col>
              </Row>
              <Table
                columns={columns}
                locale={{ emptyText: '暂无数据' }}
                scroll={{ y: 550 }}
                rowKey="deviceid"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect()(TrafficReportManage);
