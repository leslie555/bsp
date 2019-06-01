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
let myChart = null;
let dataX = [];
let dataArr = [];
function xtick () {
  console.log('xxx');
}
function reloadData() {
  // if (myChart == null) {
  //   myChart = echarts.init(document.getElementById('main'));
  // }
  // myChart.setOption({
  //   xAxis: {
  //     data: dataX,
  //   },
  //   series: [{
  //     data: dataArr,
  //   }],
  // });
}
class StaOriginManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillMount() {
  }

  componentDidMount() {
    const { data, dispatch } = this.props;
    dispatch({
      type: 'octStaOriginModel/getStaOrigin',
      payload: { },
    });
    if (myChart == null) {
      myChart = echarts.init(document.getElementById('main'));
    }
    // 绘制图表
    myChart.setOption({
      title: { text: '车籍分类趋势' },
      tooltip: {},
      xAxis: {
        data: ['川A', '省内异地', '省外异地', '川A出租', '其他'],
      },
      yAxis: {},
      series: [{
        name: '车籍分类',
        type: 'bar',
        data: [5, 20, 36, 10, 20],
      }],
    });

    this.timer = setInterval(
      () => xtick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timer);
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
    const { form, codeList, octStaOriginModel } = this.props;
    const { list } = octStaOriginModel;
    const { series, xAxis } = list;
    console.log('--------------------------------');
    console.log(xAxis);
    dataX = xAxis;
    dataArr = series;
    reloadData();

    const noMatch = '';
    const reg = new RegExp('^[0-9]*$');
    const columns = [{
      title: '川A',
      width: '20%',
      dataIndex: 'chuanA',
      key: 'chuanA',
      align: 'center',
    }, {
      title: '省内异地',
      width: '20%',
      dataIndex: 'shengnei',
      key: 'shengnei',
      align: 'center',
    }, {
      title: '省外异地',
      width: '20%',
      dataIndex: 'shengwai',
      key: 'shengwai',
      align: 'center',
    }, {
      title: '川A出租',
      width: '20%',
      dataIndex: 'chuzu',
      key: 'chuzu',
      align: 'center',
    }, {
      title: '其他',
      width: '20%',
      dataIndex: 'qita',
      key: 'qita',
      align: 'center',
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
function mapStateToProps(state) {
  const { octStaOriginModel } = state;
  return { octStaOriginModel };
}

export default connect(mapStateToProps)(StaOriginManage);
