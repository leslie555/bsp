/**
 * Created by cherry on 2018/7/20.
 */
import React from 'react';
import { connect } from 'dva';
import { Modal, message, Row, Col } from 'antd';
import Detail from '../../../components/oct/DeviceGroupDetail';
import List from '../../../components/oct/DeviceGroupList';

const { confirm } = Modal;

class DeviceGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: '2', // 1：添加，2：详情，3：编辑
      selectedKeys: [],
      currentId: '', // 当前选中行的部门Id
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'octDeviceGroup/queryAllGroup',
      payload: {},
    });
    dispatch({ type: 'octDeviceGroup/updateState', payload: { groupinfo: {} } });
  }

  render() {
    const { devicegroup, common, dispatch } = this.props;
    const {
      queryobj,
      pagination,
      resultlist,
    } = devicegroup;
    const { codeList, enumList } = common;
    const { flag, selectedKeys, currentId } = this.state;

    const listprops = {
      flag,
      enumList,
      resultlist,
      // 查看详情
      onView: (record) => {
        dispatch({ type: 'octDeviceGroup/updateState', payload: { info: record } });
        this.setState({
          flag: '2',
          currentId: record.id,
        });
      },
      // 编辑部门信息
      onEdit: (record) => {
        dispatch({ type: 'octDeviceGroup/updateState', payload: { departmentinfo: record } });
        this.setState({
          flag: '3',
          currentId: record.cdepartmentid,
          selectedKeys: [],
        });
      },
      // 添加部门信息
      onAdd: () => {
        dispatch({ type: 'octDeviceGroup/updateState', payload: { departmentinfo: {} } });
        this.setState({
          flag: '1',
          currentId: '',
          selectedKeys: [],
        });
      },
      // 删除部门信息
      onDelete: (xid) => {
        if (xid === null || xid === '') {
          message.warn('请选择一条数据进行删除');
          return;
        }
        const curthis = this;
        confirm({
          title: '删除确认',
          content: '确定要删除该部门吗？',
          okText: '确定',
          cancelText: '取消',
          onOk() {
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
    const detailprops = {
      pagination,
      enumList,
      codeList,
      selectedKeys,
      currentId,
      resultlist,
      // 分页
      onPageChange: (page) => {
        dispatch({
          type: 'octDeviceGroup/queryDepartment',
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
        dispatch({ type: 'octDeviceGroup/updateState', payload: { departmentinfo: record } });
        this.setState({
          flag: '2',
          currentId: record.cdepartmentid,
        });
      },
      // 编辑部门信息
      onEdit: (record) => {
        dispatch({ type: 'octDeviceGroup/updateState', payload: { departmentinfo: record } });
        this.setState({
          flag: '3',
          currentId: record.cdepartmentid,
          selectedKeys: [],
        });
      },
      // 添加部门信息
      onAdd: () => {
        dispatch({ type: 'octDeviceGroup/updateState', payload: { departmentinfo: {} } });
        this.setState({
          flag: '1',
          currentId: '',
          selectedKeys: [],
        });
      },
      // 删除部门信息
      onDelete: (cdepartmentid) => {
        if (cdepartmentid === null || cdepartmentid === '') {
          message.warn('请选择一条数据进行删除');
          return;
        }
        const curthis = this;
        confirm({
          title: '删除确认',
          content: '确定要删除该部门吗？',
          okText: '确定',
          cancelText: '取消',
          onOk() {
            dispatch({ type: 'octDeviceGroup/deleteDepartment', payload: { dptCode: cdepartmentid } }).then((data) => {
              if (data && data.result) {
                message.info(data.info);
                if (data.flag == 1) {
                  const page = { ...pagination, current: 1 };
                  dispatch({
                    type: 'octDeviceGroup/queryDepartment',
                    payload: { queryobj, pagination: page },
                  });
                  dispatch({ type: 'octDeviceGroup/updateState', payload: { departmentinfo: {} } });
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
    return (
      <div>
        <Row>
          <Col span={6}>
            <List {...listprops} />
          </Col>
          <Col span={18} style={{ width: '74%', marginRight: '1%' }}>
            <Detail {...detailprops} />
          </Col>
        </Row>
      </div>
    );
  }
}
function mapStateToProps({ devicegroup, common }) {
  return { devicegroup, common };
}
export default connect(mapStateToProps)(DeviceGroup);
