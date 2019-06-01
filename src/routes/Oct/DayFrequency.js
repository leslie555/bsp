import React from 'react';
import { connect } from 'dva';
import { Modal, message, Row, Col } from 'antd';
import Search from '../../components/oct/DayFrequencySearch';
import List from '../../components/oct/DayFrequencyList';

const { confirm } = Modal;

class DayFrequency extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: [],
      currentId: '', // 当前选中行的设备Id
      dayavg: true, // 默认显示日均
    };
  }

  componentDidMount() {
  }

  render() {
    const { octDayFrequency, common, dispatch, loading } = this.props;
    const {
      queryobj,
      excel,
      pagination,
      resultlist,
    } = octDayFrequency;
    const { enumList, codeList } = common;
    const { selectedKeys, currentId, dayavg } = this.state;
    const searchprops = {
      queryobj,
      dayavg,
      onchange: (value) => {
        console.log(value);
        if (value == 1) {
          this.setState({ dayavg: true });
          console.log(searchprops.queryobj);
        } else {
          this.setState({ dayavg: false });
          console.log(searchprops.queryobj);
        }
        const type1 = dayavg ? 'month' : 'day';
        dispatch({
          type: 'octDayFrequency/query',
          payload: { queryobj: { ...queryobj, type: type1 } },
        });
      },
      excel,
      enumList,
      onSearch: (query) => {
        const page = { ...pagination, current: 1 };
        dispatch({
          type: 'octDayFrequency/query',
          payload: { queryobj: { ...queryobj, ...query }, pagination: page },
        });
      },
      onDownload: () => {
        console.log(searchprops.queryobj);
        const { starttime, endtime } = searchprops.queryobj;
        console.log(starttime);
        console.log(endtime);
        const formElement = document.createElement('form');
        formElement.style.display = 'display:none;';
        formElement.method = 'post';
        formElement.action = '/HiatmpPro/bsp/queryex/dailyTravelFrequencyDLF';
        formElement.target = 'callBackTarget';
        const inputElement = document.createElement('input');
        inputElement.type = 'hidden';
        inputElement.name = 'params';
        inputElement.value = JSON.stringify(searchprops.queryobj);
        // console.log(inputElement.value);
        formElement.appendChild(inputElement);
        document.body.appendChild(formElement);
        formElement.submit();
        document.body.removeChild(formElement);
      },
    };
    const listprops = {
      pagination,
      currentId,
      resultlist,
      loading,
      enumList,
      dayavg,
      onPageChange: (page) => {
        dispatch({
          type: 'octDayFrequency/query',
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
    };
    return (
      <div>
        <Row>
          <Col span={24} style={{ width: '100%', paddingBottom: '0' }}>
            <Search {...searchprops} />
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ width: '100%', paddingTop: '0' }}>
            <List {...listprops} />
          </Col>
        </Row>
      </div>
    );
  }
}
function mapStateToProps({ octDayFrequency, common, loading }) {
  return { octDayFrequency, common, loading: loading.models.octDayFrequency };
}
export default connect(mapStateToProps)(DayFrequency);

// function mapStateToProps({ octDayFrequency, common }) {
//   return { octDayFrequency, common };
// }
// export default connect(mapStateToProps)(DayFrequency);
