import React from 'react';
import { connect } from 'dva';
import { Modal, message, Row, Col } from 'antd';
import Search from '../../components/oct/QueryTravelSearch';
import List from '../../components/oct/QueryTravelList';

const { confirm } = Modal;

class QueryTravel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: [],
      currentId: '', // 当前选中行的设备Id
    };
  }

  render() {
    const { octQueryTravel, common, dispatch, loading } = this.props;
    const {
      queryobj,
      resultlist,
      excel,
      onDownload,
    } = octQueryTravel;
    const { enumList, codeList } = common;
    const { selectedKeys, currentId } = this.state;
    const searchprops = {
      queryobj,
      enumList,
      excel,
      onSearch: (query) => {
        dispatch({
          type: 'octQueryTravel/query',
          payload: { queryobj: { ...queryobj, ...query } },
        });
      },
      onDownload: (record) => {
        console.log(searchprops.queryobj);
        const formElement = document.createElement('form');
        formElement.style.display = 'display:none;';
        formElement.method = 'post';
        formElement.action = '/HiatmpPro/bsp/queryex/downloadFile_0';
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
          type: 'octQueryTravel/query',
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
function mapStateToProps({ octQueryTravel, common, loading }) {
  return { octQueryTravel, common, loading: loading.models.octQueryTravel };
}
export default connect(mapStateToProps)(QueryTravel);
