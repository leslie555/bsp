import React from 'react';
import { connect } from 'dva';
import { Modal, message, Row, Col } from 'antd';
import Search from '../../components/oct/DeviceMonitorSearch';
import List from '../../components/oct/DeviceMonitorList';
import Info from '../../components/oct/MonitorInfo';

const { confirm } = Modal;

class DeviceMonitor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: '2', // 1：添加，2：详情，3：编辑
      selectedKeys: [],
      currentId: '', // 当前选中行的设备Id
    };
  }

  render() {
    const { octDeviceMonitor, common, dispatch } = this.props;
    const {
      list,
      departmentlist,
      departmentinfo,
      queryobj,
      pagination,
    } = octDeviceMonitor;
    const { enumList, codeList } = common;
    const { flag, selectedKeys, currentId } = this.state;
    const searchprops = {
      queryobj,
      enumList,
      codeList,
      onSearch: (query) => {
        const page = { ...pagination, current: 1 };
        dispatch({
          type: 'octDeviceMonitor/queryDevice',
          payload: { queryobj: { ...queryobj, ...query }, pagination: page },
        });
        dispatch({ type: 'octDeviceMonitor/updateState', payload: { departmentinfo: {} } });
        this.setState({
          flag: '2',
          currentId: '',
          selectedKeys: [],
        });
      },
    };
    const listprops = {
      pagination,
      departmentlist,
      enumList,
      codeList,
      selectedKeys,
      currentId,
      // 分页
      onPageChange: (page) => {
        dispatch({
          type: 'octDeviceMonitor/queryDevice',
          payload: {
            queryobj,
            pagination: { ...pagination, current: page.current, pageSize: page.pageSize },
          },
        });
        this.setState({
          selectedKeys: [],
        });
      },
      // 查看详情
      onView: (record) => {
        dispatch({ type: 'octDeviceMonitor/updateState', payload: { departmentinfo: record } });
        this.setState({
          flag: '2',
          currentId: record.deviceid,
        });
      },
      // 编辑设备信息
      onEdit: (record) => {
        dispatch({ type: 'octDeviceMonitor/updateState', payload: { departmentinfo: record } });
        this.setState({
          flag: '3',
          currentId: record.deviceid,
          selectedKeys: [],
        });
      },
      // 添加设备信息
      onAdd: () => {
        dispatch({ type: 'octDeviceMonitor/updateState', payload: { deviceinfo: {} } });
        this.setState({
          flag: '1',
          currentId: '',
          selectedKeys: [],
        });
      },
      // 删除设备信息
      onDelete: (deviceId) => {
        if (deviceId === null || deviceId === '') {
          message.warn('请选择一条数据进行删除');
          return;
        }
        const curthis = this;
        confirm({
          title: '删除确认',
          content: '确定要删除该设备吗？',
          okText: '确定',
          cancelText: '取消',
          onOk() {
            console.log(deviceId);
            dispatch({ type: 'octDeviceMonitor/deleteDevice', payload: { deviceid: deviceId } }).then((data) => {
              if (data && data.result) {
                message.info(data.info);
                if (data.flag == 1) {
                  const page = { ...pagination, current: 1 };
                  dispatch({
                    type: 'octDeviceMonitor/queryDevice',
                    payload: { queryobj, pagination: page },
                  });
                  dispatch({ type: 'octDeviceMonitor/updateState', payload: { departmentinfo: {} } });
                  curthis.setState({
                    flag: '2',
                    selectedKeys: [],
                  });
                }
              }
            });
          },
          onCancel() {
            curthis.setState({
              selectedKeys: [],
            });
          },
        });
      },
      changeSelected: (keys) => {
        this.setState({
          selectedKeys: keys,
        });
      },
    };
    const infoprops = {
      list,
      flag,
      departmentinfo,
      enumList,
      // 取消按钮
      onCancel: () => {
        dispatch({ type: 'octDeviceMonitor/updateState', payload: { departmentinfo: {} } });
        this.setState({
          flag: '2',
        });
      },
      // 修改设备级别
      onSelectChange: (nlevel, formValues) => {
        dispatch({ type: 'octDeviceMonitor/updateState', payload: { departmentinfo: { ...departmentinfo, ...formValues, nlevel, parentdepartment: '' } } });
      },
      // 添加或编辑设备确认按钮
      handleAddOrEdit: (department) => {
        let dispatchType = '';
        if (flag === '1') {
          dispatchType = 'octDeviceMonitor/addDevice';
        } else if (flag === '3') {
          dispatchType = 'octDeviceMonitor/updateDevice';
        }
        dispatch({ type: dispatchType, payload: { department } }).then((data) => {
          if (data && data.result) {
            message.info(data.info);
            if (data.flag == 1) {
              const page = { ...pagination, current: 1 };
              dispatch({
                type: 'octDeviceMonitor/queryDevice',
                payload: { queryobj, pagination: page },
              });
              dispatch({
                type: 'octDeviceMonitor/getAllDeviceList',
              });
              dispatch({ type: 'octDeviceMonitor/updateState', payload: { departmentinfo: {} } });
              this.setState({
                flag: '2',
              });
            }
          } else {
            Modal.error({
              title: '操作失败',
              content: '操作失败，请联系管理员。',
            });
          }
        });
      },
    };
    return (
      <div>
        <Search {...searchprops} />
        <Row>
          <Col span={12} style={{ width: '50%', paddingRight: '1%' }}>
            <List {...listprops} />
          </Col>
          <Col span={12}>
            <Info {...infoprops} />
          </Col>
        </Row>
      </div>
    );
  }
}
function mapStateToProps({ octDeviceMonitor, common }) {
  return { octDeviceMonitor, common };
}
export default connect(mapStateToProps)(DeviceMonitor);
