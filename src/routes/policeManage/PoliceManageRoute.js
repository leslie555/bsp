/**
 * Created by Administrator on 2018/7/25.
 */
import React from 'react';
import { connect } from 'dva';
import { Modal, message, Row, Col } from 'antd';
import PoliceSearch from '../../components/policeManage/PoliceSearch';
import PoliceList from '../../components/policeManage/PoliceList';
import PoliceInfo from '../../components/policeManage/PoliceInfo';
import DepartmentTree from '../../components/policeManage/DepartmentTree';

const { confirm } = Modal;
class PoliceManageRoute extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: '2', // 1：添加，2：详情，3：编辑， 4：审批
      currentId: '', // 当前选中行的警员
      selectedKeys: [],
      selectedRows: [],
    };
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'policemanage/queryDepartmentList', payload: { } });
    dispatch({ type: 'policemanage/getGpsList', payload: { } });
  }

  gpsInfoHandler(data) {
    const { dispatch } = this.props;
    if (data.hasgps !== '0') {
      dispatch({ type: 'policemanage/updateState', payload: { gpsSelectList: [] } });
    } else {
      const gpslist = [];
      console.log(data.deviceid2);
      if (data.deviceid) {
        gpslist.push(data.deviceid);
      }
      if (data.deviceid2) {
        gpslist.push(data.deviceid2);
      } if (data.deviceid3) {
        gpslist.push(data.deviceid3);
      } if (data.deviceid4) {
        gpslist.push(data.deviceid4);
      }
      dispatch({ type: 'policemanage/updateState', payload: { gpsSelectList: gpslist } });
    }
  }


  render() {
    const { policemanage, common } = this.props;
    const { enumList, codeList } = common;
    const { queryobj, currentDepartmentId, gpsSelectList, departmentList,
      expandedKeys, policeList, allDepartmentList, recordInfo, gpsList, pagination } = policemanage;
    const { editMode, currentId, selectedKeys, selectedRows } = this.state;
    const { dispatch, loading, location } = this.props;

    const searchProps = {
      enumList,
      departmentList,
      onSearch: (query) => {
        const page = { ...pagination, current: 1 };

        dispatch({ type: 'policemanage/query', payload: { query, currentDepartmentId, page } });

        this.setState({
          editMode: '2',
          currentId: '',
          selectedKeys: [],
          selectedRows: [],
        });
      },
    };
    const listProps = {
      enumList,
      codeList,
      policeList,
      pagination,
      currentId,
      selectedKeys,
      selectedRows,

      updateSelectState: (data) => {
        console.log(data);
        this.setState({
          selectedKeys: data.selectedKeys,
          selectedRows: data.selectedRows,
        });
      },

      onPageChange: (page) => {
        this.setState({
          selectedKeys: [],
          selectedRows: [],
        });
        console.log(page);
        dispatch({
          type: 'policemanage/query',
          payload: {
            query: queryobj,
            currentDepartmentId,
            page: { ...pagination, current: page.current, pageSize: page.pageSize },
          },
        });
      },
      // 查看
      onView: (data) => {
        console.log(data);
        dispatch({ type: 'policemanage/updateState', payload: { recordInfo: data } });
        this.setState({
          editMode: '2',
          currentId: data.uuid,
        });
        this.gpsInfoHandler(data);
      },
      // 修改
      onEdit: (data) => {
        dispatch({ type: 'policemanage/updateState', payload: { recordInfo: data } });
        this.setState({
          editMode: '3',
          currentId: data.uuid,
        });
        this.gpsInfoHandler(data);
      },


      // 新增
      onAdd: () => {
        dispatch({ type: 'policemanage/updateState', payload: { recordInfo: { hasgps: '1' }, gpsSelectList: [] } });
        this.setState({
          editMode: '1',
          currentId: '',
          selectedKeys: [],
          selectedRows: [],
        });
      },

      // 删除
      onDelete: (uuid) => {
        if (uuid === null || uuid === '') {
          message.warn('请选择一条数据进行删除');
          return;
        }
        const curthis = this;
        confirm({
          title: '删除确认',
          content: '确定要删除该警员吗？',
          okText: '确定',
          cancelText: '取消',
          onOk() {
            dispatch({ type: 'policemanage/deletePolice', payload: { uuid } }).then((data) => {
              if (data && data.result) {
                message.info(data.info);
                if (data.flag === 1) {
                  dispatch({
                    type: 'policemanage/query',
                    payload: {
                      query: queryobj,
                      currentDepartmentId,
                      page: { ...pagination, current: 1 },
                    },
                  });
                  dispatch({ type: 'policemanage/updateState', payload: { recordInfo: {} } });
                  curthis.setState({
                    editMode: '2',
                  });
                  dispatch({ type: 'policemanage/getGpsList', payload: { } });
                }
              }
            });
          },
          onCancel() {
            curthis.setState({
              selectedKeys: [],
              selectedRows: [],
            });
          },

        });
      },
      // 审核
      onAuditSubmit: (uuid) => {
        if (uuid === null || uuid === '') {
          message.warn('请选择一条数据提交审核');
          return;
        }
        dispatch({ type: 'policemanage/submitAuditPolice', payload: { uuid, state: '0' } }).then((data) => {
          if (data && data.result) {
            message.info(data.info);

            if (data.flag === 1) {
              dispatch({ type: 'policemanage/query', payload: { query: queryobj, currentDepartmentId, page: { ...pagination } } });
              dispatch({ type: 'policemanage/updateState', payload: { recordInfo: {} } });
              this.setState({
                editMode: '2',
                selectedKeys: [],
                selectedRows: [],
              });
            }
          }
        });
      },
      // 审批
      onAudit: (data) => {
        dispatch({ type: 'policemanage/updateState', payload: { recordInfo: data } });
        this.setState({
          editMode: '4',
          selectedKeys: [],
          selectedRows: [],
        });
      },
    };
    const treeProps = {
      departmentList,
      expandedKeys,
      onTreeSelect: (selectedDeptid) => {
        this.setState({
          selectedKeys: [],
          selectedRows: [],
        });
        dispatch({
          type: 'policemanage/query',
          payload: { query: queryobj,
            currentDepartmentId: selectedDeptid,
            page: { ...pagination, current: 1 },
          },
        });
      },
    };
    const infoProps = {
      gpsList,
      recordInfo,
      enumList,
      editMode,
      allDepartmentList,
      gpsSelectList,
      // 取消按钮
      onCancel: () => {
        dispatch({ type: 'policemanage/updateState', payload: { recordInfo: {}, gpsSelectList: [] } });
        this.setState({
          editMode: '2',
        });
      },
      setGpsListState: (selectList) => {
        dispatch({ type: 'policemanage/updateState', payload: { gpsSelectList: selectList } });
      },
      // 添加或编辑警员信息
      handleAddOrEdit: (policeInfo) => {
        dispatch({ type: 'policemanage/savePolice', payload: { policeInfo } }).then((data) => {
          if (data && data.result) {
            message.info(data.info);
            if (data.flag === 1) {
              dispatch({
                type: 'policemanage/query',
                payload: { query: queryobj, currentDepartmentId, page: { ...pagination } },
              });
              dispatch({ type: 'policemanage/updateState', payload: { recordInfo: {} } });
              this.setState({
                editMode: '2',
              });

              dispatch({ type: 'policemanage/getGpsList', payload: { } });
            }
          } else {
            Modal.error({
              title: '操作失败',
              content: '操作失败，请联系管理员。',
            });
          }
        });
      },
      // 审批
      onAudit: (audit) => {
        dispatch({ type: 'policemanage/auditPolice', payload: { ...audit } }).then((data) => {
          if (data && data.result) {
            message.info(data.info);
            if (data.flag === 1) {
              dispatch({
                type: 'policemanage/query',
                payload: { query: queryobj, currentDepartmentId, page: { ...pagination } },
              });
              dispatch({ type: 'policemanage/updateState', payload: { recordInfo: {} } });
              this.setState({
                editMode: '2',
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
        <Row>
          <PoliceSearch {...searchProps} />
        </Row>
        <Row>
          <Col span={4}>
            <DepartmentTree {...treeProps} />
          </Col>
          <Col span={14} style={{ width: '56%', margin: '0 1%' }}>
            <PoliceList {...listProps} />
          </Col>
          <Col span={6}>
            <PoliceInfo {...infoProps} />
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps({ policemanage, common, loading }) {
  return { policemanage, common, loading: loading.models.policemanage };
}

export default connect(mapStateToProps)(PoliceManageRoute);
