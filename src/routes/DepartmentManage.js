/**
 * Created by cherry on 2018/7/20.
 */
import React from 'react';
import { connect } from 'dva';
import { Modal, message, Row, Col } from 'antd';
import Search from '../components/DepartmentManage/DepartmentSearch';
import List from '../components/DepartmentManage/DepartmentList';
import Info from '../components/DepartmentManage/DepartmentInfo';

const { confirm } = Modal;

class DepartmentManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: '2', // 1：添加，2：详情，3：编辑
      selectedKeys: [],
      currentId: '', // 当前选中行的部门Id
    };
  }

  render() {
    const { departmentmanage, common, dispatch } = this.props;
    const {
      list,
      departmentlist,
      departmentinfo,
      queryobj,
      pagination,
    } = departmentmanage;
    const { enumList, codeList } = common;
    const { flag, selectedKeys, currentId } = this.state;
    const searchprops = {
      queryobj,
      enumList,
      codeList,
      onSearch: (query) => {
        console.log(query);
        const page = { ...pagination, current: 1 };
        dispatch({
          type: 'departmentmanage/queryDepartment',
          payload: { queryobj: { ...queryobj, ...query }, pagination: page },
        });
        dispatch({ type: 'departmentmanage/updateState', payload: { departmentinfo: {} } });
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
          type: 'departmentmanage/queryDepartment',
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
        dispatch({ type: 'departmentmanage/updateState', payload: { departmentinfo: record } });
        this.setState({
          flag: '2',
          currentId: record.cdepartmentid,
        });
      },
      // 编辑部门信息
      onEdit: (record) => {
        dispatch({ type: 'departmentmanage/updateState', payload: { departmentinfo: record } });
        this.setState({
          flag: '3',
          currentId: record.cdepartmentid,
          selectedKeys: [],
        });
      },
      // 添加部门信息
      onAdd: () => {
        dispatch({ type: 'departmentmanage/updateState', payload: { departmentinfo: {} } });
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
            dispatch({ type: 'departmentmanage/deleteDepartment', payload: { dptCode: cdepartmentid } }).then((data) => {
              if (data && data.result) {
                message.info(data.info);
                if (data.flag == 1) {
                  const page = { ...pagination, current: 1 };
                  dispatch({
                    type: 'departmentmanage/queryDepartment',
                    payload: { queryobj, pagination: page },
                  });
                  dispatch({ type: 'departmentmanage/updateState', payload: { departmentinfo: {} } });
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
        dispatch({ type: 'departmentmanage/updateState', payload: { departmentinfo: {} } });
        this.setState({
          flag: '2',
        });
      },
      // 修改部门级别
      onSelectChange: (nlevel, formValues) => {
        dispatch({ type: 'departmentmanage/updateState', payload: { departmentinfo: { ...departmentinfo, ...formValues, nlevel, parentdepartment: '' } } });
      },
      // 添加或编辑部门确认按钮
      handleAddOrEdit: (department) => {
        let dispatchType = '';
        if (flag === '1') {
          dispatchType = 'departmentmanage/addDepartment';
        } else if (flag === '3') {
          dispatchType = 'departmentmanage/updateDepartment';
        }
        dispatch({ type: dispatchType, payload: { department } }).then((data) => {
          if (data && data.result) {
            message.info(data.info);
            if (data.flag == 1) {
              const page = { ...pagination, current: 1 };
              dispatch({
                type: 'departmentmanage/queryDepartment',
                payload: { queryobj, pagination: page },
              });
              dispatch({
                type: 'departmentmanage/getAllDepartmentsList',
              });
              dispatch({ type: 'departmentmanage/updateState', payload: { departmentinfo: {} } });
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
          <Col span={18} style={{ width: '74%', marginRight: '1%' }}>
            <List {...listprops} />
          </Col>
          <Col span={6}>
            <Info {...infoprops} />
          </Col>
        </Row>
      </div>
    );
  }
}
function mapStateToProps({ departmentmanage, common }) {
  return { departmentmanage, common };
}
export default connect(mapStateToProps)(DepartmentManage);
