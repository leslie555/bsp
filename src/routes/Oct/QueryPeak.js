import React from 'react';
import { connect } from 'dva';
import { Modal, message, Row, Col } from 'antd';
import Search from '../../components/oct/QueryPeakSearch';
import List from '../../components/oct/QueryPeakList';

const { confirm } = Modal;

class QueryPeak extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: [],
      currentId: '', // 当前选中行的设备Id
    };
  }

  render() {
    const { octQueryPeak, common, dispatch, loading } = this.props;
    const {
      queryobj,
      resultlist,
      excel,
    } = octQueryPeak;
    const { enumList, codeList } = common;
    const { selectedKeys, currentId } = this.state;
    const searchprops = {
      queryobj,
      excel,
      enumList,
      onSearch: (query) => {
        dispatch({
          type: 'octQueryPeak/query',
          payload: { queryobj: { ...queryobj, ...query } },
        });
      },
      onDownload: (record) => {
        console.log(searchprops.queryobj);
        const formElement = document.createElement('form');
        formElement.style.display = 'display:none;';
        formElement.method = 'post';
        formElement.action = '/HiatmpPro/bsp/queryex/queryProfileFlowDLF';
        formElement.target = 'callBackTarget';
        const inputElement = document.createElement('input');
        inputElement.type = 'hidden';
        inputElement.name = 'params';
        inputElement.value = JSON.stringify(searchprops.queryobj);
        formElement.appendChild(inputElement);
        document.body.appendChild(formElement);
        formElement.submit();
        document.body.removeChild(formElement);
      },
    };
    const listprops = {
      currentId,
      resultlist,
      enumList,
      loading,
      onPageChange: (page) => {
        dispatch({
          type: 'octQueryPeak/query',
          payload: {
            queryobj,
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
function mapStateToProps({ octQueryPeak, common, loading }) {
  return { octQueryPeak, common, loading: loading.models.octQueryPeak };
}
export default connect(mapStateToProps)(QueryPeak);
