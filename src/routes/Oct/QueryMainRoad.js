import React from 'react';
import { connect } from 'dva';
import { Modal, message, Row, Col } from 'antd';
import Search from '../../components/oct/QueryMainRoadSearch';
import List from '../../components/oct/QueryMainRoadList';

const { confirm } = Modal;

class QueryMainRoad extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: [],
      currentId: '', // 当前选中行的设备Id
    };
  }

  render() {
    const { octQueryMainRoad, common, dispatch } = this.props;
    const {
      queryobj,
      pagination,
      resultlist1,
      resultlist2,
      groupCount,
      excel,
    } = octQueryMainRoad;
    console.log(queryobj);
    const { enumList, codeList } = common;
    const { selectedKeys, currentId } = this.state;
    const searchprops = {
      excel,
      queryobj,
      enumList,
      onSearch: (query) => {
        const page = { ...pagination, current: 1 };
        dispatch({
          type: 'octQueryMainRoad/query',
          payload: { queryobj: { ...queryobj, ...query }, pagination: page },
        });
      },
    };
    const listprops1 = {
      excel,
      typea: '早高峰',
      currentId,
      dataSource: resultlist1,
      enumList,
      groupCount,
      onDownload: (type) => {
        const { endtime, starttime } = searchprops.queryobj;
        const par = { starttime, endtime, type };
        console.log(par);
        const formElement = document.createElement('form');
        formElement.style.display = 'display:none;';
        formElement.method = 'post';
        formElement.action = '/HiatmpPro/bsp/queryex/gaofengDLF';
        formElement.target = 'callBackTarget';
        const inputElement = document.createElement('input');
        inputElement.type = 'hidden';
        inputElement.name = 'params';
        inputElement.value = JSON.stringify(par);
        console.log(inputElement.value);
        formElement.appendChild(inputElement);
        document.body.appendChild(formElement);
        formElement.submit();
        document.body.removeChild(formElement);
      },
    };
    const listprops2 = {
      excel,
      typea: '晚高峰',
      currentId,
      dataSource: resultlist2,
      enumList,
      groupCount,
      onDownload: (type) => {
        const { endtime, starttime } = searchprops.queryobj;
        const par = { starttime, endtime, type };
        console.log(par);
        const formElement = document.createElement('form');
        formElement.style.display = 'display:none;';
        formElement.method = 'post';
        formElement.action = '/HiatmpPro/bsp/queryex/gaofengDLF';
        formElement.target = 'callBackTarget';
        const inputElement = document.createElement('input');
        inputElement.type = 'hidden';
        inputElement.name = 'params';
        inputElement.value = JSON.stringify(par);
        console.log(inputElement.value);
        formElement.appendChild(inputElement);
        document.body.appendChild(formElement);
        formElement.submit();
        document.body.removeChild(formElement);
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
            <List {...listprops1} />
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ width: '100%', paddingTop: '0' }}>
            <List {...listprops2} />
          </Col>
        </Row>
      </div>
    );
  }
}
function mapStateToProps({ octQueryMainRoad, common }) {
  return { octQueryMainRoad, common };
}
export default connect(mapStateToProps)(QueryMainRoad);
