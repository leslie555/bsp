/**
 * Created by ljf on 2018/10/05.
 */
import React from 'react';
import { connect } from 'dva';
import { Modal, message, Row, Col } from 'antd';
import Search from '../../components/oct/NumberTypeSearch';
import List from '../../components/oct/NumerTypeList';

const { confirm } = Modal;

class NUmberTyep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: '2', // 1：添加，2：详情，3：编辑
      selectedKeys: [],
      currentId: '', // 当前选中行的设备Id
      dataSource: [],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'octNumberType/queryMenuList',
      payload: {},
    });
  }

  render() {
    const { octNumberType, common, dispatch, loading } = this.props;
    const {
      queryobj,
      pagination,
      resultlist,
      treeData,
    } = octNumberType;
    const { enumList, codeList } = common;
    const myThis = this;
    const { flag, selectedKeys, currentId, dataSource } = this.state;
    const searchprops = {
      queryobj,
      enumList,
      codeList,
      dataSource,
      treeData,
      handleSearch: (value) => {
        if (value.length >= 3) {
          const queryBody = { deviceid: value };
          dispatch({ type: 'octCarRecord/getDeviceID', payload: { queryobj: { ...queryobj, ...queryBody } } }).then((data) => {
            if (data && data.result) {
              myThis.setState({
                dataSource: data.list,
              });
            } else {
              // aaa
            }
          });
        }
      },
      onSearch: (query) => {
        console.log(query);
        const page = { ...pagination, current: 1 };
        dispatch({
          type: 'octNumberType/queryAllByParam',
          payload: { queryobj: { ...queryobj, ...query }, pagination: page },
        });
      },
    };
    const listprops = {
      pagination,
      resultlist,
      enumList,
      codeList,
      selectedKeys,
      currentId,
      loading,
      // 分页
      onPageChange: (page) => {
        dispatch({
          type: 'octNumberType/queryDevice',
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
        formElement.action = '/HiatmpPro/bsp/platetype/downloadFile';
        formElement.target = 'callBackTarget';
        const inputElement = document.createElement('input');
        inputElement.type = 'hidden';
        inputElement.name = 'params';
        inputElement.value = JSON.stringify(searchprops.queryobj);
        formElement.appendChild(inputElement);
        document.body.appendChild(formElement);
        if (pagination.total < 1000) {
          formElement.submit();
          document.body.removeChild(formElement);
        } else if ((pagination.total > 1000) && (pagination.total < 100000)) {
          confirm({
            title: '导出确认',
            content: '由于数据量很大导出需要一定时间，确认导出？',
            okText: '确定',
            cancelText: '取消',
            onOk() {
              formElement.submit();
              document.body.removeChild(formElement);
            },
            onCancel() {
              // alert('操作取消');
            },
          });
        } else {
          // alert('操作取消');
        }
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
function mapStateToProps({ octNumberType, common, loading }) {
  return { octNumberType, common, loading: loading.models.octNumberType };
}
export default connect(mapStateToProps)(NUmberTyep);
