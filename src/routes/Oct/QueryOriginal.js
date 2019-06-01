import React from 'react';
import { connect } from 'dva';
import { Modal, message, Row, Col } from 'antd';
import Search from '../../components/oct/QueryOriginalSearch';
import List from '../../components/oct/QueryOriginalList';

const { confirm } = Modal;

class QueryOriginal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: [],
      currentId: '', // 当前选中行的设备Id
      dataSource: [],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'octQueryOriginal/queryMenuList',
      payload: {},
    });
  }

  render() {
    const { octQueryOriginal, common, dispatch, loading } = this.props;
    const { dataSource } = this.state;
    const {
      queryobj,
      pagination,
      resultlist,
      treeData,
    } = octQueryOriginal;
    // eslint-disable-next-line
    (resultlist || []).map(item => { item.vehicle_flow1 = item.vehicle_flow1 + item.vehicle_flow2; });
    console.log('55555', resultlist);
    const { enumList, codeList } = common;
    const { selectedKeys, currentId } = this.state;
    const myThis = this;
    const searchprops = {
      queryobj,
      enumList,
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
          type: 'octQueryOriginal/query',
          payload: { queryobj: { ...queryobj, ...objQuery }, pagination: page },
        });
      },
    };
    const listprops = {
      pagination,
      currentId,
      resultlist,
      enumList,
      loading,
      onPageChange: (page) => {
        dispatch({
          type: 'octQueryOriginal/query',
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
        const formElement = document.createElement('form');
        formElement.style.display = 'display:none;';
        formElement.method = 'post';
        formElement.action = '/HiatmpPro/bsp/flow/downloadFile';
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
        } else if (pagination.total < 100000) {
          confirm({
            title: '导出确认',
            content: '由于数据量较大导出需要一定时间，确认导出？',
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
          // console.log(pagination);
          message.warning('数据大于100000条,禁止导出');
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
function mapStateToProps({ octQueryOriginal, common, loading }) {
  return { octQueryOriginal, common, loading: loading.models.octQueryOriginal };
}
export default connect(mapStateToProps)(QueryOriginal);
