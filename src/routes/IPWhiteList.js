import React from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Modal, message } from 'antd';
import List from '../components/IPWhiteList/List';
import Search from '../components/IPWhiteList/Search';
import Info from '../components/IPWhiteList/ADDUpdateModal';

class IPWhiteList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      editMode: '', // 'add'：添加，2：详情， 'edit'：编辑
      begindate: moment(), // 添加界面初始时间
      record: [], // 每条数据
    };
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'IpWhiteList/queryUser', payload: { } });
  }


  render() {
    console.log(this.props);
    const { IpWhiteList } = this.props;
    const { editMode, visible, begindate, record } = this.state;
    const {
      userList,
      enums,
      queryobj,
      list,
      info,
      pagination,
      checkedarr,
      selectedrows,
      totalCount,
    } = IpWhiteList;
    const { dispatch, loading } = this.props;
    // 搜索框组件用到的props
    const searchprops = {
      enums,
      totalCount,
      queryobj,
      selectedrows,
      checkedarr,
      onSearch: (query) => {
        const page = { ...pagination, current: 1 };
        dispatch({
          type: 'IpWhiteList/queryToLog',
          payload: { queryobj: { ...queryobj, ...query, page } },
        });
      },
    };
    // 列表组件用到的props
    const listprops = {
      userList,
      enums,
      pagination,
      list,
      totalCount,
      info,
      checkedarr,
      selectedrows,
      loading,
      // 分页
      onPageChange(page) {
        console.log(page);
        // const { current, pageSize } = page;
        dispatch({
          type: 'IpWhiteList/query',
          payload: { queryobj, page },
        });
      },
      // 添加
      onAdd: () => {
        dispatch({ type: 'IpWhiteList/getBlackInfoDetailSuccess', payload: { info: {} } });
        this.setState({
          visible: true,
          editMode: 'add',
          begindate: moment(),
        });
      },

      // 打开修改
      onEdit: (recordinfo) => {
        this.setState({
          visible: true,
          editMode: 'edit',
          record: recordinfo,
        });
      },
      // 查询详情获取撤控信息
      onDelCheck: (recordinfo) => {
        dispatch({ type: 'IpWhiteList/getBlackInfoDetail', payload: { id: recordinfo.id } });
      },
      // 保存撤控
      onCancel: (recordinfo) => {
        const { ids } = recordinfo;
        if (ids) {
          dispatch({ type: 'IpWhiteList/cancelBlackInfo', payload: recordinfo }).then((result) => {
            if (result) {
              message.success('撤控成功');
              const page = { ...pagination, current: 1 };
              dispatch({ type: 'IpWhiteList/query', payload: { queryobj, pagination: page } });
            } else {
              message.error('撤控失败，请联系管理员。');
              // Modal.error({
              //   title: '撤控失败',
              //   content: '撤控失败，请联系管理员。',
              // });
            }
          });
        }
      },
      // 导出
      onExport: () => {
        dispatch({ type: 'IpWhiteList/exportBlackInfo', payload: { ...queryobj, pagination } }).then(
          (data) => {
            if (data && data.length > 0) {
              if (data.data.result) {
                window.open(data.data.file.url);
              } else {
                message.error('导出失败，请联系管理员。');
                // Modal.error({
                //   title: '导出失败',
                //   content: '导出失败，请联系管理员。',
                // });
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
      userList,
      visible,
      info,
      record,
      totalCount,
      editMode,
      begindate,
      pagination,
      // 保存或修改后重新查询
      onPageChange() {
        dispatch({
          type: 'IpWhiteList/query',
          payload: { queryobj, page: { ...pagination } },
        });
      },
      // 添加详情
      onAddRecord: (recordinfo) => {
        dispatch({ type: 'IpWhiteList/saveBlackInfo', payload: { ...recordinfo } }).then((result) => {
          if (result) {
            message.success('添加成功');
            const page = { ...pagination, current: 1 };
            dispatch({ type: 'IpWhiteList/query', payload: { queryobj, page } });
          } else {
            message.error('添加失败，请联系管理员。');
            // Modal.error({
            //   title: '添加失败',
            //   content: '添加失败，请联系管理员。',
            // });
          }
        });
      },
      // 修改详情
      onUpdateRecord: (recordinfo) => {
        dispatch({ type: 'IpWhiteList/updateBlackInfo', payload: { ...recordinfo } }).then((result) => {
          if (result) {
            message.success('修改成功');
            const page = { ...pagination, current: 1 };
            dispatch({ type: 'IpWhiteList/query', payload: { queryobj, pagination: page } });
          } else {
            message.error('修改失败，请联系管理员。');
            // Modal.error({
            //   title: '修改失败',
            //   content: '修改失败，请联系管理员。',
            // });
          }
        });
      },
      // 关闭详情Modal`
      resetCallback: () => {
        this.setState({ visible: false });
      },
    };

    return (
      <div className="router_out_size" style={{ padding: '10px' }}>
        <Search {...searchprops} />
        <List {...listprops} />
        <Info {...infoprops} />
      </div>
    );
  }
}

function mapStateToProps({ IpWhiteList, common, loading }) {
  return { IpWhiteList, common, loading: loading.models.IpWhiteList };
}

export default connect(mapStateToProps)(IPWhiteList);
