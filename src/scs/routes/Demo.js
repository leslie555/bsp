import React from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Modal, message } from 'antd';
import List from '../components/demos/List';
import Search from '../components/demos/Search';
import Info from '../components/demos/ADDUpdateModal';
import * as ENUMS from '../config/enums';
import * as SYSPARMS from '../config/sysparms';

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      editMode: '', // 'add'：添加，2：详情，'edit'：编辑
      begindate: moment(), // 添加界面初始时间
    };
  }

  componentWillMount() {
    const { dispatch } = this.props;
    const enumsArr = [];
    for (const enuma in ENUMS) {
      if (typeof ENUMS[enuma] === 'number') {
        enumsArr.push(ENUMS[enuma]);
      }
    }

    const sysParamsArr = [];
    for (const sys in SYSPARMS) {
      if (typeof SYSPARMS[sys] === 'string') {
        sysParamsArr.push(SYSPARMS[sys]);
      }
    }
    dispatch({
      type: 'common/getEnumList',
      payload: {},
    });
    dispatch({
      type: 'common/getSysParamsList',
      payload: { paramcode: sysParamsArr.join(',') },
    });
    dispatch({
      type: 'common/getOperatorInfo',
      payload: {},
    });
  }

  render() {
    const { demo, common } = this.props;
    const { editMode, visible, begindate } = this.state;
    const {
      enums,
      queryobj,
      list,
      info,
      record,
      pagination,
      checkedarr,
      selectedRowKeys,
      selectedrows,
    } = demo;
    const { enumList, operatorInfo, userlist, departmentList, carnoprofix } = common;
    const { dispatch, loading } = this.props;
    // 搜索框组件用到的props
    const searchprops = {
      carnoprofix,
      enums,
      queryobj,
      selectedrows,
      selectedRowKeys,
      checkedarr,
      enumList,
      onSearch: (query) => {
        const page = { ...pagination, current: 1 };
        dispatch({
          type: 'demos/query',
          payload: { queryobj: { ...queryobj, ...query }, pagination: page },
        });
      },
    };
    // 列表组件用到的props
    const listprops = {
      enums,
      pagination,
      list,
      info,
      operatorInfo,
      enumList,
      checkedarr,
      selectedrows,
      selectedRowKeys,
      loading,
      // 分页
      onPageChange(page) {
        const { current, pageSize: pagesize } = page;
        dispatch({
          type: 'demos/query',
          payload: { queryobj, pagination: { ...pagination, current, pagesize } },
        });
      },
      returnSelectedKeys(selectedrowkeys) {
        dispatch({ type: 'demos/returnSelectedKeys', payload: { selectedrowkeys } });
      },
      // 添加
      onAdd: () => {
        dispatch({ type: 'demos/getBlackInfoDetailSuccess', payload: { info: {} } });
        this.setState({
          visible: true,
          editMode: 'add',
          begindate: moment(),
        });
      },

      // 打开修改
      onEdit: (recordinfo) => {
        dispatch({ type: 'demos/getBlackInfoDetail', payload: { id: recordinfo.id } });
        this.setState({
          visible: true,
          editMode: 'edit',
        });
      },
      // 查询详情获取撤控信息
      onDelCheck: (recordinfo) => {
        dispatch({ type: 'demos/getBlackInfoDetail', payload: { id: recordinfo.id } });
      },
      // 保存撤控
      onCancel: (recordinfo) => {
        const { ids } = recordinfo;
        if (ids) {
          dispatch({ type: 'demos/cancelBlackInfo', payload: recordinfo }).then((result) => {
            if (result) {
              message.success('撤控成功');
              const page = { ...pagination, current: 1 };
              dispatch({ type: 'demos/query', payload: { queryobj, pagination: page } });
            } else {
              Modal.error({
                title: '撤控失败',
                content: '撤控失败，请联系管理员。',
              });
            }
          });
        }
      },
      // 导出
      onExport: () => {
        dispatch({ type: 'demos/exportBlackInfo', payload: { ...queryobj, pagination } }).then(
          (data) => {
            if (data && data.length > 0) {
              if (data.data.result) {
                window.open(data.data.file.url);
              } else {
                Modal.error({
                  title: '导出失败',
                  content: '导出失败，请联系管理员。',
                });
              }
            } else {
              message.error('列表栏无数据，无法导出！');
            }
          }
        );
      },
    };
    // 详情、添加、修改用到的props
    const infoprops = {
      carnoprofix,
      visible,
      enumList,
      userlist,
      info,
      record,
      operatorInfo,
      departmentList,
      editMode,
      begindate,
      // 添加详情
      onAddRecord: (recordinfo) => {
        dispatch({ type: 'demos/saveBlackInfo', payload: { ...recordinfo } }).then((result) => {
          if (result) {
            message.success('添加成功');
            const page = { ...pagination, current: 1 };
            dispatch({ type: 'demos/query', payload: { queryobj, pagination: page } });
          } else {
            Modal.error({
              title: '添加失败',
              content: '添加失败，请联系管理员。',
            });
          }
        });
      },
      // 修改详情
      onUpdateRecord: (recordinfo) => {
        dispatch({ type: 'demos/updateBlackInfo', payload: { ...recordinfo } }).then((result) => {
          if (result) {
            message.success('修改成功');
            const page = { ...pagination, current: 1 };
            dispatch({ type: 'demos/query', payload: { queryobj, pagination: page } });
          } else {
            Modal.error({
              title: '修改失败',
              content: '修改失败，请联系管理员。',
            });
          }
        });
      },
      // 关闭详情Modal`
      resetCallback: () => {
        this.setState({ visible: false });
      },
    };

    return (
      <div className="routerOut" style={{ padding: '10px' }}>
        <Search {...searchprops} />
        <List {...listprops} />
        <Info {...infoprops} />
      </div>
    );
  }
}

function mapStateToProps({ demo, common, loading }) {
  return { demo, common, loading: loading.models.demo };
}

export default connect(mapStateToProps)(Demo);
