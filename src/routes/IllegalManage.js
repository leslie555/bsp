/**
 * Created by DELL on 2018-7-4.
 */
/**
 * Created by cherry on 2018/7/2.
 */
import React from 'react';
import { message } from 'antd';
import { connect } from 'dva';
import Search from '../components/IllegalManage/IllegalSearch';
import List from '../components/IllegalManage/IllegalList';
import Info from '../components/IllegalManage/IllegalInfo';

class IllegalManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      illegalinfovisible: false,
      illegalinfoflag: '1', // 1：查看 2:编辑 3:新增
      recordInfo: {},
    };
  }

  render() {
    const { illegalmanage, dispatch, common } = this.props;
    const {
      illegallist,
      pagination,
      queryobj,
    } = illegalmanage;
    const { codeList } = common;
    const { illegalinfovisible, recordInfo, illegalinfoflag } = this.state;
    // 搜索框组件用到的props
    const illegalsearchprops = {
      codeList,
      onSearch: (query) => {
        const page = { ...pagination, current: 1 };
        dispatch({ type: 'illegalmanage/query', payload: { queryobj: { ...queryobj, ...query }, pagination: page } });
      },
    };
    // 列表组件用到的props
    const illegallistprops = {
      codeList,
      pagination,
      illegallist,
      onPageChange(page) {
        dispatch({
          type: 'illegalmanage/query',
          payload: {
            queryobj,
            pagination: { ...pagination, current: page.current, pageSize: page.pageSize },
          },
        });
      },
      onEdit: (recordinfo) => {
        this.setState({
          illegalinfovisible: true,
          illegalinfoflag: '2',
          recordInfo: recordinfo,
        });
      },
      onView: (recordinfo) => {
        this.setState({
          illegalinfovisible: true,
          illegalinfoflag: '1',
          recordInfo: recordinfo,
        });
      },
      onAdd: () => {
        this.setState({
          recordInfo: {},
          illegalinfovisible: true,
          illegalinfoflag: '3',
        });
      },
      onDelete: (record) => {
        const delRecord = record;
        delRecord.fkjeMin = delRecord.fkje_min;
        delRecord.fkjeMax = delRecord.fkje_max;
        delRecord.qzcsMin = delRecord.qzcs_min;
        delRecord.qzcsMax = delRecord.qzcs_max;
        delRecord.jlsjMin = delRecord.jlsj_min;
        delRecord.jlsjMax = delRecord.jlsj_max;
        dispatch({ type: 'illegalmanage/delete', payload: { delRecord } }).then((data) => {
          if (data && data.result) {
            message.success('操作成功！');
            const page = { ...pagination, current: 1 };
            dispatch({ type: 'illegalmanage/query', payload: { queryobj, pagination: page } });
          }
        });
      },
    };
    // info用到的props
    const illegalinfoprops = {
      key: Math.random(),
      illegalinfovisible,
      illegalinfoflag,
      recordInfo,
      onCloseModal: () => {
        this.setState({ illegalinfovisible: false });
      },
      onUpdateRecord: (record, beforeRecord) => {
        dispatch({ type: 'illegalmanage/update', payload: { record, beforeRecord } }).then((data) => {
          if (data && data.result) {
            message.success('操作成功！');
            this.setState({
              illegalinfovisible: false,
            });
            const page = { ...pagination, current: 1 };
            dispatch({ type: 'illegalmanage/query', payload: { queryobj, pagination: page } });
          }
        });
      },
      onAddRecord: (newRecord) => {
        dispatch({ type: 'illegalmanage/add', payload: { newRecord } }).then((data) => {
          if (data && data.result) {
            message.success('操作成功！');
            this.setState({
              illegalinfovisible: false,
            });
            const page = { ...pagination, current: 1 };
            dispatch({ type: 'illegalmanage/query', payload: { queryobj, pagination: page } });
          } else if (data.flag === 2) {
            message.warn('操作失败，违法行为代码重复！');
          } else {
            message.warn('操作失败，请联系系统管理员！');
          }
        });
      },
    };
    return (
      <div>
        <Search {...illegalsearchprops} />
        <List {...illegallistprops} />
        <Info {...illegalinfoprops} />
      </div>
    );
  }
}
function mapStateToProps({ illegalmanage, common }) {
  return { illegalmanage, common };
}

export default connect(mapStateToProps)(IllegalManage);
