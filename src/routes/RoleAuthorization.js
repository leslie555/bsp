/**
 * Created by cherry on 2018/7/26.
 */
import React from 'react';
import { connect } from 'dva';
import { Modal, message, Row, Col } from 'antd';
import Search from '../components/RoleAuthorization/RoleSearch';
import List from '../components/RoleAuthorization/RoleList';
import Info from '../components/RoleAuthorization/RoleInfo';

const { confirm } = Modal;
class RoleAuthorization extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: '2', // 1：添加，2：详情，3：编辑
      selectedKeys: [],
      currentId: '', // 当前选中行的角色Id
      nodeSelected: false, // 是否选中了node
      saveLoadingDevice: false, // 保存按钮状态
    };
  }

  componentWillMount() {
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'octRoadSection/queryMenuList',
      payload: {},
    });
    // 拿到所有设备
    dispatch({
      type: 'octRoadSection/queryDevice',
      payload: { id: '1' },
    });
  }

  onRef = (ref) => {
    this.child = ref;
  }

  childFunction() {
    this.child.clearTreeSelect();
  }

  render() {
    const { roleauthorization, octRoadSection, dispatch, common, loadingInfo } = this.props;
    const {
      rolelist,
      roleinfo,
      queryobj,
      pagination,
      authtree,
      authChecked,
      resourcetree,
      resourceChecked,
      userlist,
    } = roleauthorization;
    const {
      expandedKeys,
      menuList,
      nodeInfo,
      devicelist,
      devicelistOld,
    } = octRoadSection;
    const { enumList, codeList, curUser } = common;
    const { flag, selectedKeys, currentId, nodeSelected, saveLoadingDevice } = this.state;
    const searchprops = {
      queryobj,
      codeList,
      onSearch: (query) => {
        const page = { ...pagination, current: 1 };
        dispatch({
          type: 'roleauthorization/queryRole',
          payload: { queryobj: { ...queryobj, ...query }, pagination: page },
        });
        dispatch({
          type: 'roleauthorization/updateState',
          payload: {
            roleinfo: {},
            authChecked: [],
            resourceChecked: [],
            userlist: [],
          },
        });
        this.setState({
          flag: '2',
          currentId: '',
          selectedKeys: [],
        });
      },
    };
    const listprops = {
      pagination,
      rolelist,
      codeList,
      curUser,
      selectedKeys,
      currentId,
      // 分页
      onPageChange: (page) => {
        dispatch({
          type: 'roleauthorization/updateState',
          payload: {
            roleinfo: {},
            authChecked: [],
            resourceChecked: [],
            userlist: [],
            authtree: [],
            resourcetree: [],
          },
        });
        dispatch({
          type: 'octRoadSection/updateState',
          payload: {
            devicelist: [],
          },
        });
        dispatch({
          type: 'roleauthorization/queryRole',
          payload: {
            queryobj,
            pagination: { ...pagination, current: page.current, pageSize: page.pageSize },
          },
        });
        this.setState({
          selectedKeys: [],
        });
        this.childFunction();
      },
      // 查看详情
      onView: (record) => {
        // 清空devicelist
        dispatch({
          type: 'octRoadSection/updateState',
          payload: {
            devicelist: [],
          },
        });
        dispatch({ type: 'roleauthorization/getAuthorityTree', payload: { roleinfo: record } });
        dispatch({ type: 'roleauthorization/getResourceTree', payload: { roleinfo: record } });
        dispatch({ type: 'roleauthorization/getUserRoleList', payload: { roleinfo: record } });
        this.setState({
          flag: '2',
          currentId: record.roleid,
        });
        this.childFunction();
      },
      // 编辑角色
      onEdit: (record) => {
        dispatch({
          type: 'octRoadSection/updateState',
          payload: {
            devicelist: [],
          },
        });
        dispatch({ type: 'roleauthorization/getAuthorityTree', payload: { roleinfo: record } });
        dispatch({ type: 'roleauthorization/getResourceTree', payload: { roleinfo: record } });
        dispatch({ type: 'roleauthorization/getUserRoleList', payload: { roleinfo: record } });
        this.setState({
          flag: '3',
          currentId: record.roleid,
          selectedKeys: [],
        });
        this.childFunction();
      },
      // 添加角色
      onAdd: () => {
        const record = { roleid: null };
        dispatch({ type: 'roleauthorization/getAuthorityTree', payload: { roleinfo: record } });
        dispatch({ type: 'roleauthorization/getResourceTree', payload: { roleinfo: record } });
        dispatch({
          type: 'roleauthorization/updateState',
          payload: {
            roleinfo: {},
            authChecked: [],
            resourceChecked: [],
            userlist: [],
          },
        });
        this.setState({
          flag: '1',
          currentId: '',
          selectedKeys: [],
        });
      },
      // 删除角色
      onDelete: (roleIdStr, names, cannotDelete) => {
        if (roleIdStr === null || roleIdStr === '') {
          message.warn('请选择一条数据进行删除');
          return;
        }
        if (cannotDelete) {
          message.warn('只能删除当前账号创建的角色，请重新勾选');
          return;
        }
        const curthis = this;
        confirm({
          title: '删除确认',
          content: `确定要删除${names}吗？`,
          okText: '确定',
          cancelText: '取消',
          onOk() {
            dispatch({ type: 'roleauthorization/deleteRole', payload: { roleIdStr } }).then((data) => {
              if (data && data.result) {
                message.info(data.info);
                if (data.flag == 1) {
                  const page = { ...pagination, current: 1 };
                  dispatch({
                    type: 'roleauthorization/queryRole',
                    payload: { queryobj, pagination: page },
                  });
                  dispatch({ type: 'roleauthorization/updateState', payload: { roleinfo: {} } });
                  curthis.setState({
                    flag: '2',
                    selectedKeys: [],
                  });
                  dispatch({
                    type: 'octRoadSection/updateState',
                    payload: {
                      devicelist: [],
                    },
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
      flag,
      roleinfo,
      authtree,
      authChecked,
      resourcetree,
      resourceChecked,
      userlist,
      menuList,
      enumList,
      devicelist,
      devicelistOld,
      loadingInfo,
      saveLoadingDevice,
      dosearch: (searchvalue) => {
        dispatch({
          type: 'octRoadSection/searchLocal',
          payload: { searchValue: searchvalue },
        });
      },
      devicelistChange: (selKeys) => {
        dispatch({
          type: 'roleauthorization/changeDevice',
          payload: { resourceChecked: selKeys },
        });
      },
      // 节点选择事件
      onNodeSelect: (areaid) => {
        const devicearr = [];
        if (areaid == 1) {
          dispatch({
            type: 'octRoadSection/updateState',
            payload: { devicelist: devicelistOld },
          });
        } else {
          for (let i = 0; i < devicelistOld.length; i += 1) {
            const obj = `${devicelistOld[i].sectionid}`;
            if (obj.startsWith(areaid)) {
              devicearr.push(devicelistOld[i]);
            }
          }
          dispatch({
            type: 'octRoadSection/updateState',
            payload: { devicelist: devicearr },
          });
        }
      },
      // 取消按钮
      onCancel: () => {
        dispatch({
          type: 'roleauthorization/updateState',
          payload: {
            roleinfo: {},
            authChecked: [],
            resourceChecked: [],
            userlist: [],
            authtree: [],
            resourcetree: [],
          },
        });
        this.setState({
          flag: '2',
        });
      },
      // 功能授权树节点选中事件
      changeAuthCheck: (checked) => {
        dispatch({ type: 'roleauthorization/updateState', payload: { authChecked: checked } });
      },
      // 资源授权树节点选中事件
      changeResourceCheck: (checked) => {
        dispatch({ type: 'roleauthorization/updateState', payload: { resourceChecked: checked } });
      },
      // 添加或编辑角色
      handleAddOrEdit: (params) => {
        this.setState({ saveLoadingDevice: true });
        dispatch({ type: 'roleauthorization/saveRole', payload: params }).then((data) => {
          if (data && data.result) {
            message.info(data.info);
            if (data.flag == 1) {
              const page = { ...pagination, current: 1 };
              dispatch({
                type: 'roleauthorization/queryRole',
                payload: { queryobj, pagination: page },
              });
              dispatch({
                type: 'roleauthorization/updateState',
                payload: {
                  roleinfo: {},
                  authChecked: [],
                  resourceChecked: [],
                  userlist: [],
                  authtree: [],
                  resourcetree: [],
                },
              });
              dispatch({
                type: 'octRoadSection/updateState',
                payload: {
                  devicelist: [],
                },
              });
              this.setState({
                flag: '2',
                saveLoadingDevice: false,
              });
              this.childFunction();
            }
          }
        });
      },
    };
    return (
      <div>
        <Row>
          <Col span={12}>
            <Search {...searchprops} />
            <List {...listprops} />
          </Col>
          <Col span={12}>
            <Info {...infoprops} onRef={this.onRef} />
          </Col>
        </Row>
      </div>
    );
  }
}
function mapStateToProps({ octRoadSection, roleauthorization, common, loading }) {
  return {
    octRoadSection,
    roleauthorization,
    common,
    loadingInfo: loading.models.octRoadSection,
  };
}
export default connect(mapStateToProps)(RoleAuthorization);
