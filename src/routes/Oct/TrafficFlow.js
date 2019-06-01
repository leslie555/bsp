import React from 'react';
import { connect } from 'dva';
import { Modal, message, Row, Col } from 'antd';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import Search from '../../components/oct/Report/TrafficFlowSearch';
import List from '../../components/oct/Report/TrafficFlowList';

const { confirm } = Modal;

class TrafficFlow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: [],
      currentId: '', // 当前选中行的设备Id
    };
  }

  componentDidMount() {
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(document.getElementById('main'));
    // 绘制图表
    myChart.setOption({
      title: { text: '  过车数量统计' },
      tooltip: {},
      xAxis: {
        data: ['大车数量', '中车数量', '小车数量', '过车总量'],
      },
      yAxis: {},
      series: [{
        name: '车数量',
        type: 'bar',
        data: [120, 220, 345, 500],
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

  render() {
    const { octTrafficFlow, common, dispatch } = this.props;
    const {
      queryobj,
      pagination,
      resultlist,
    } = octTrafficFlow;
    const { enumList, codeList } = common;
    const { selectedKeys, currentId } = this.state;
    const searchprops = {
      queryobj,
      enumList,
      onSearch: (query) => {
        const page = { ...pagination, current: 1 };
        dispatch({
          type: 'octTrafficFlow/queryDevice',
          payload: { queryobj: { ...queryobj, ...query }, pagination: page },
        });
      },
    };
    const listprops = {
      pagination,
      currentId,
      resultlist,
      enumList,
      onPageChange: (page) => {
        dispatch({
          type: 'octTrafficFlow/queryDevice',
          payload: {
            queryobj,
            pagination: { ...pagination, current: page.current, pageSize: page.pageSize },
          },
        });
        this.setState({
          selectedKeys: [],
        });
      },
      changeSelected: (keys) => {
        this.setState({
          selectedKeys: keys,
        });
      },
      // onDownload: (record) => {
      //   console.log(searchprops.queryobj);
      //   const formElement = document.createElement('form');
      //   formElement.style.display = 'display:none;';
      //   formElement.method = 'post';
      //   formElement.action = '/HiatmpPro/bsp/illegalevent/downloadFile';
      //   formElement.target = 'callBackTarget';
      //   const inputElement = document.createElement('input');
      //   inputElement.type = 'hidden';
      //   inputElement.name = 'params';
      //   inputElement.value = JSON.stringify(searchprops.queryobj);
      //   formElement.appendChild(inputElement);
      //   document.body.appendChild(formElement);
      //   formElement.submit();
      //   document.body.removeChild(formElement);
      // },
    };
    return (
      <div>
        <Row>
          <Col span={24} style={{ width: '100%', padding: '1%' }}>
            <Search {...searchprops} />
          </Col>
          <Col span={24} style={{ height: '500px', width: '100%' }} id="main" />
          <Col span={24} style={{ width: '100%', padding: '1%' }}>
            <List {...listprops} />
          </Col>
        </Row>
      </div>
    );
  }
}
function mapStateToProps({ octTrafficFlow, common }) {
  return { octTrafficFlow, common };
}
export default connect(mapStateToProps)(TrafficFlow);
