/**
 * Created by cherry on 2018/7/20.
 */
import React from 'react';
import { connect } from 'dva';
import { Modal, message, Row, Col, Icom } from 'antd';
import Detail from '../../components/oct/DeviceGroupDetail';
import List from '../../components/oct/DeviceGroupList';
import Add from '../../components/oct/DeviceGroupAdd';

const { confirm } = Modal;

class DeviceGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: '2', // 1：叶子，2：非叶子
      selectedKeys: [],
      currentId: '', // 当前选中行的部门Id
      dataSource: [],
      leftQuery: null, // 左边查询的变量
      leftid: '', // 左边id
      zhongid: [], // 分组对应查询的值,默认为空
      isAll: true,
      idarr: [],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'octDeviceGroup/queryMenuList',
      payload: {},
    });
    dispatch({
      type: 'octDeviceGroup/queryDeviceByGroupsum',
      payload: { id: '1' },
    });
    dispatch({
      type: 'octDeviceGroup/getResourceTree',
      payload: {},
    });
  }

  refreshLeftNode = () => {
    const { leftQuery } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'octDeviceGroup/queryDeviceByGroup',
      payload: leftQuery,
    });
  }

  render() {
    const { dataSource, flag, selectedKeys, currentId, zhongid, leftid,
      isAll, idarr } = this.state;
    const { octDeviceGroup, common, dispatch, loading } = this.props;
    const {
      expandedKeys,
      groupinfo,
      menuList,
      queryobj,
      pagination,
      devicelist,
      roadtree,
      devicelistsum,
      isLeaf,
      nodeInfo,
      arr,
    } = octDeviceGroup;
    const { queryvalue } = nodeInfo;
    const { codeList, enumList } = common;
    const listprops = {
      menuList,
      dispatch,
      expandedKeys,
      loading,
      // onNodeSelect是点击树形结构调用的函数
      onNodeSelect: (selectedKeysNode, e) => {
        this.setState({
          leftid: selectedKeysNode,
          isAll: true,
          selectedKeys: [],
        });
        const data = e.node.props.dataRef;
        if (!data.lstSubGroup) {
          data.lstSubGroup = null;
        }
        if (data.queryvalue == 'NULL') {
          data.queryvalue = null;
        }
        const bLeaf = ((data.lstSubGroup && data.lstSubGroup.length) == null);
        const paginationNew = {
          current: 1,
          pageSize: 10,
          total: 0,
        };
        dispatch({
          type: 'octDeviceGroup/updateState',
          payload: { nodeInfo: e.node.props.dataRef, isLeaf: bLeaf },
        });
        if (bLeaf) {
          const page = { ...pagination, current: 1 };
          const query = {
            id: data.id,
          };
          dispatch({
            type: 'octDeviceGroup/queryDeviceByGroup',
            payload: {
              queryobj: { ...queryobj, ...query },
              pagination: page,
            },
          });
          this.setState({
            flag: '1',
            leftQuery: {
              queryobj: { ...queryobj, ...query },
              pagination: page,
            },
          });
        } else {
          dispatch({
            type: 'octDeviceGroup/initState',
            payload: {
              pagination: paginationNew,
              devicelist: [],
            },
          });
          this.setState({
            flag: '2',
          });
        }
      },
    };
    const addprops = {
      // selectMenuLevel,
      dispatch,
      nodeInfo,
      isLeaf,
      queryvalue,
      flag,
      enumList,
      menuList,
      handleChange(value) {
        myThis.setState({
          zhongid: value,
        });
      },
      // 保存“设备分组和统计查询的对应关系”
      onSave: (value) => {
        const str = leftid.join();
        dispatch({
          type: 'octDeviceGroup/SaveStatisticQuery',
          payload: {
            queryvalue: value,
            treeid: str,
          },
        });
      },
      onNeedRefresh: () => {
        dispatch({ type: 'octDeviceGroup/queryMenuList', payload: {} });
      },
    };
    const myThis = this;
    const detailprops = {
      leftid: leftid.toString(),
      loading,
      flag,
      pagination,
      devicelist,
      roadtree,
      devicelistsum,
      enumList,
      codeList,
      selectedKeys,
      dispatch,
      currentId,
      dataSource,
      nodeInfo,
      isAll,
      idarr,
      selectAll: () => {
        const str = selectedKeys.join(',');
        if (isAll) {
          if (devicelist) {
            devicelist.forEach(e => {
              if (str.indexOf(e.deviceid) == -1) {
                selectedKeys.push(e.deviceid);
              }
            });
          }
          console.log('selectedKeys', selectedKeys);
          this.setState({ isAll: false });
        } else {
          this.setState({ selectedKeys: [], isAll: true });
        }
      },
      refreshData: () => {
        this.refreshLeftNode();
      },
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
      onPageChange: (page) => {
        dispatch({
          type: 'octDeviceGroup/queryDeviceByGroup',
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
      // 增加设备
      onAdd: () => {
        confirm({
          title: '还没做',
        });
      },
      // 删除设备信息+2018.12.10
      onDelete: (deviceId) => {
        if (deviceId === null || deviceId === '') {
          message.warn('请选择一条数据进行删除');
          return;
        }
        const curthis = this;
        confirm({
          title: '删除确认',
          content: '确定要将该设备从当前分组中删除吗？',
          okText: '确定',
          cancelText: '取消',
          onOk() {
            dispatch({ type: 'octDeviceGroup/deleteDevice', payload: { deviceid: deviceId, id: nodeInfo.id } }).then((data) => {
              if (data && data.result) {
                message.info(data.info);
                if (flag == 1) {
                  const page = { ...pagination, current: 1 };
                  dispatch({
                    type: 'octDeviceGroup/queryDeviceByGroup',
                    payload: { queryobj, pagination: page },
                  });
                  curthis.setState({
                    // flag: '2',
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
    };
    return (
      <div>
        <Row>
          <Col span={6}>
            {/* 左边的路段数listprops就包含menulist，通过HierarchyGetall()接口获取到 */}
            <List {...listprops} />
          </Col>
          <Col span={18} style={{ width: '74%', marginRight: '1%' }}>
            <Row>
              <Add {...addprops} />
              {/* 设备表格 */}
              <Detail {...detailprops} />
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}
function mapStateToProps({ octDeviceGroup, common, loading }) {
  return { octDeviceGroup, common, loading: loading.models.octDeviceGroup };
}
export default connect(mapStateToProps)(DeviceGroup);
