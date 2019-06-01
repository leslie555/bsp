import React from 'react';
import { connect } from 'dva';
import { Modal, message, Row, Col } from 'antd';
import Search from '../../components/oct/WhiteListSearch';
import List from '../../components/oct/WhiteListList';

const { confirm } = Modal;

class WhiteList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: [],
      currentId: '', // 当前选中行的设备Id
    };
  }

  render() {
    const { octWhiteList, common, dispatch } = this.props;
    const {
      queryobj,
      pagination,
      resultlist,
    } = octWhiteList;
    const { enumList, codeList } = common;
    const { selectedKeys, currentId } = this.state;
    const searchprops = {
      queryobj,
      enumList,
      onSearch: (query) => {
        const page = { ...pagination, current: 1 };
        const objQuerys = [];
        for (const p in query) {
          if ({}.hasOwnProperty.call(query, p)) {
            let item = { key: p, value: query[p] };
            console.log(`key:${p}, value:${query[p]}`);
            if (p == 'starttime' || p == 'endtime') {
              item = { key: p, value: query[p], type: 'datetime' };
            }
            objQuerys.push(item);
          }
        }
        const objQuery = { query: objQuerys };
        dispatch({
          type: 'octWhiteList/queryDevice',
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
          type: 'octWhiteList/queryDevice',
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
      onDownload: (record) => {
        console.log(searchprops.queryobj);
        const formElement = document.createElement('form');
        formElement.style.display = 'display:none;';
        formElement.method = 'post';
        formElement.action = '/HiatmpPro/bsp/illegalevent/downloadFile';
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
    return (
      <div>
        <Search {...searchprops} />
        <Row>
          <Col span={24} style={{ width: '100%', padding: '1%' }}>
            <List {...listprops} />
          </Col>
        </Row>
      </div>
    );
  }
}
function mapStateToProps({ octWhiteList, common }) {
  return { octWhiteList, common };
}
export default connect(mapStateToProps)(WhiteList);
