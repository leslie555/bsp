import React from 'react';
import { connect } from 'dva';
import { Modal, message, Row, Col } from 'antd';
import Search from '../../components/oct/QueryEquipmentSearch';
import List from '../../components/oct/QueryEquipmentList';

const { confirm } = Modal;

class QueryEquipment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { octQueryEquipment, common, dispatch } = this.props;
    const {
      queryobj,
      excel,
      resultlist,
    } = octQueryEquipment;
    const { enumList, codeList } = common;
    const { selectedKeys, currentId } = this.state;
    const searchprops = {
      excel,
      queryobj,
      enumList,
      onSearch: (query) => {
        dispatch({
          type: 'octQueryEquipment/query',
          payload: { queryobj: { ...queryobj, ...query } },
        });
      },
      onDownload: (record) => {
        console.log(searchprops.queryobj);
        const formElement = document.createElement('form');
        formElement.style.display = 'display:none;';
        formElement.method = 'post';
        formElement.action = '/HiatmpPro/bsp/queryex/collectEquipmentDLF';
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
      onPageChange: (page) => {
        dispatch({
          type: 'octQueryEquipment/query',
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
function mapStateToProps({ octQueryEquipment, common }) {
  return { octQueryEquipment, common };
}
export default connect(mapStateToProps)(QueryEquipment);
