import React from 'react';
import { connect } from 'dva';
import { Modal, message, Row, Col } from 'antd';
import Search from '../../components/oct/TrafficIncidentSearch';
import List from '../../components/oct/TrafficIncidentList';

const { confirm } = Modal;

class TrafficIncident extends React.Component {
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
      type: 'octTrafficIncident/queryMenuList',
      payload: {},
    });
  }

  render() {
    const { octTrafficIncident, common, dispatch, loading } = this.props;
    const { dataSource } = this.state;
    const {
      queryobj,
      pagination,
      resultlist,
      treeData,
      imgvideo,
      img,
    } = octTrafficIncident;
    const { enumList, codeList } = common;
    const { selectedKeys, currentId } = this.state;
    const myThis = this;
    const searchprops = {
      queryobj,
      enumList,
      treeData,
      dataSource,
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
        dispatch({
          type: 'octTrafficIncident/queryDevice',
          payload: { queryobj: { ...queryobj, ...query }, pagination: page },
        });
      },
    };
    const listprops = {
      pagination,
      currentId,
      imgvideo,
      resultlist,
      enumList,
      loading,
      getImgVideo: (id) => {
        console.log(id);
        dispatch({
          type: 'octTrafficIncident/queryTrafficimgvideo',
          payload: { eventid: id },
        });
      },
      onPageChange: (page) => {
        dispatch({
          type: 'octTrafficIncident/queryDevice',
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
      onDetail: (query) => {
        // const page = { ...pagination, current: 1 };
        dispatch({
          type: 'octTrafficIncident/queryDetail',
          payload: { queryobj: { ...queryobj, ...query } },
        });
      },
      onDownload: (record) => {
        console.log(searchprops.queryobj);
        const formElement = document.createElement('form');
        formElement.style.display = 'display:none;';
        formElement.method = 'post';
        formElement.action = '/HiatmpPro/bsp/trafficevent/downloadFile';
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
          message.warning('数据大于100000条,禁止导出');
        }
      },
      onSearch: (query) => {
        const page = { ...pagination, current: 1 };
        dispatch({
          type: 'octTrafficIncident/queryDevice',
          payload: { queryobj: { ...queryobj, ...query }, pagination: page },
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
function mapStateToProps({ octTrafficIncident, common, loading }) {
  return { octTrafficIncident, common, loading: loading.models.octTrafficIncident };
}
export default connect(mapStateToProps)(TrafficIncident);
