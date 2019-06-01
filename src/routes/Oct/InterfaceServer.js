import React from 'react';
import { connect } from 'dva';
import { Modal, message, Row, Col } from 'antd';
import Search from '../../components/oct/InterfaceServerSearch';
import List from '../../components/oct/InterfaceServerList';

// const { confirm } = Modal;

class InterfaceServer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: [],
      currentId: '', // 当前选中行的设备Id
    };
  }

  render() {
    const { octInterfaceServer, common, dispatch, loading } = this.props;
    const {
      queryobj,
      pagination,
      resultlist,
    } = octInterfaceServer;
    const { enumList, codeList } = common;
    const { selectedKeys, currentId } = this.state;
    const searchprops = {
      queryobj,
      enumList,
      codeList,
      onSearch: (query) => {
        const page = { ...pagination, current: 1 };
        dispatch({
          type: 'octInterfaceServer/queryDevice',
          payload: { queryobj: { ...queryobj, ...query }, pagination: page },
        });
      },
    };
    const listprops = {
      pagination,
      currentId,
      resultlist,
      enumList,
      codeList,
      selectedKeys,
      loading,
      onPageChange: (page) => {
        dispatch({
          type: 'octInterfaceServer/queryDevice',
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
function mapStateToProps({ octInterfaceServer, common }) {
  return { octInterfaceServer, common };
}
export default connect(mapStateToProps)(InterfaceServer);
