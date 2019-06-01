import React from 'react';
import { connect } from 'dva';
import { Modal, message, Row, Col } from 'antd';
import Search from '../../components/oct/common/historysearch';
import List from '../../components/oct/common/historylist';

const { confirm } = Modal;

class HistorVehicletype extends React.Component {
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
      type: 'octHistorVehicletype/queryMenuList',
      payload: {},
    });
  }

  render() {
    const { octHistorVehicletype, common, dispatch, loading } = this.props;
    const { dataSource } = this.state;
    const {
      queryobj,
      pagination,
      resultlist,
      treeData,
      imglist,
    } = octHistorVehicletype;
    const { enumList, codeList } = common;
    const { selectedKeys, currentId } = this.state;
    const myThis = this;
    const columns = [
      {
        title: '设备分组',
        width: '20%',
        dataIndex: 'groupname',
        key: 'groupname',
        align: 'center',
      },
      {
        title: '小型车辆',
        width: '20%',
        dataIndex: 'countsmall',
        key: 'countsmall',
        align: 'center',
      },
      {
        title: '大型车辆',
        width: '20%',
        align: 'center',
        dataIndex: 'countbig',
        key: 'countbig',
      },
      {
        title: '汇总',
        width: '20%',
        dataIndex: 'countall',
        key: 'countall',
        align: 'center',
      },
      {
        title: '时间',
        width: '20%',
        dataIndex: 'rec_time',
        key: 'rec_time',
        align: 'center',
      },
    ];
    const searchprops = {
      title: '车辆类型历史记录',
      queryobj,
      enumList,
      dataSource,
      visible: true,
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
        dispatch({
          type: 'octHistorVehicletype/queryHistorVehicletype',
          payload: { queryobj: { ...queryobj, ...query }, pagination: page },
        });
      },
    };
    const listprops = {
      columns,
      imglist,
      pagination,
      currentId,
      resultlist,
      enumList,
      loading,
      showV: true,
      getImageList: (id) => {
        dispatch({
          type: 'octHistorVehicletype/queryDeviceImage',
          payload: { eventid: id },
        });
      },
      onPageChange: (page) => {
        dispatch({
          type: 'octHistorVehicletype/updateState',
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
        formElement.action = '/HiatmpPro/bsp/chartList/download_vehicleType';
        formElement.target = 'callBackTarget';
        const inputElement = document.createElement('input');
        inputElement.type = 'hidden';
        inputElement.name = 'params';
        inputElement.value = JSON.stringify(searchprops.queryobj);
        formElement.appendChild(inputElement);
        document.body.appendChild(formElement);
        console.log(inputElement.value);
        if (resultlist.length < 1000) {
          formElement.submit();
          document.body.removeChild(formElement);
        } else if (resultlist.length < 100000) {
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

function mapStateToProps({ octHistorVehicletype, common, loading }) {
  return ({
    octHistorVehicletype,
    common,
    loading: loading.models.octHistorVehicletype,
  });
}
export default connect(mapStateToProps)(HistorVehicletype);
