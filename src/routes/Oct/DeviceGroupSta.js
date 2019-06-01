/**
 * Created by cherry on 2018/7/20.
 */
import React from 'react';
import { connect } from 'dva';
import { Modal, message, Row, Col, Icom } from 'antd';
import QueryList from '../../components/oct/DeviceGroupStaList';
import GroupTree from '../../components/oct/DeviceGroupTree';
import GroupList from '../../components/oct/DeviceGroupStaQuery';
import { save, queryid } from '../../services/octDeviceGroup';

const { confirm } = Modal;

class DeviceGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: '2', // 1：添加，2：详情，3：编辑
      selectedKeys: [],
      currentId: '', // 当前选中行的部门Id
      dataSource: [],
      queryValue1: '', // 左边的值
      deviceGroupValue: [], // 中间的值
      deviceid: [], // 中间的默认选中的id
    };
  }

  // 得到非叶子结点的树形结构
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'octDeviceGroup/queryMenuList',
      payload: {},
    });
  }

  render() {
    const { dataSource } = this.state;
    const { octDeviceGroup, common, dispatch, loading } = this.props;
    const {
      expandedKeys,
      groupinfo,
      menuList,
      queryobj,
      pagination,
      devicelist,
      isLeaf,
      nodeInfo,
    } = octDeviceGroup;
    const { codeList, enumList } = common;
    const { flag, selectedKeys, currentId } = this.state;

    const GroupTreeprops = {
      menuList,
      dispatch,
      expandedKeys,
      loading,
      onChange: (value) => {
        console.log('设备分组查询中间的值', value);
        this.setState({ deviceGroupValue: value });
      },
      onSave: () => {
        const { queryValue1, deviceGroupValue } = this.state;
        const parse = { queryValue: queryValue1, id: deviceGroupValue };
        if (parse.queryValue == '' || parse.id.length == 0) {
          Modal.error({
            title: '提示信息',
            content: '请先选择',
          });
        } else {
          save(parse).then(data => {
            if (data) {
              Modal.success({
                title: '提示信息',
                content: data.info,
              });
            }
          });
        }
      },
      onNodeSelect: (selectedKeysNode, e) => {
        const data = e.node.props.dataRef;
        const bLeaf = ((data.lstSubGroup && data.lstSubGroup.length) == null);
        console.log(bLeaf);
        console.log(data);
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
          });
        } else {
          this.setState({
            flag: '2',
          });
        }
      },
    };
    console.log();
    const myThis = this;
    const QueryListprops = {
      queryobj,
      enumList,
      dataSource,
      onChange: (value) => {
        const { queryValue1, deviceid } = this.state;
        console.log('设备分组查询左边的值', value);
        this.setState({ queryValue1: value });
        queryid({ queryValue: value }).then(data => {
          if (data) {
            console.log(data.idList);
            this.setState({ deviceid: data.idList });
          }
        });
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
    };
    const listprops = {
      loading,
      flag,
      pagination,
      devicelist,
      groupinfo,
      enumList,
      codeList,
      selectedKeys,
      currentId,
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
      onDelete: (deviceid) => {
        if (deviceid === null || deviceid === '') {
          message.warn('请选择一条数据进行删除');
          return;
        }
        const curthis = this;
        let szTitle = '删除确认';
        let szContent = '确定要删除该设备吗？';
        if (selectedKeys != null && selectedKeys.length > 0) {
          szTitle = '批量删除确认';
          szContent = '确定要删除这些设备吗？';
        }
        confirm({
          title: szTitle,
          content: szContent,
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
    };
    return (
      <div>
        <Row>
          <Col span={8}>
            <QueryList {...QueryListprops} />
          </Col>
          <Col span={8}>
            <GroupTree {...GroupTreeprops} />
          </Col>
          <Col span={8}>
            <GroupList {...listprops} />
          </Col>
        </Row>
      </div>
    );
  }
}
function mapStateToProps({ octDeviceGroup, common, loading }) {
  console.log(octDeviceGroup);
  return { octDeviceGroup, common, loading: loading.models.octDeviceGroup };
}
export default connect(mapStateToProps)(DeviceGroup);
