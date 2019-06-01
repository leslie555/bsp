/**
 * Created by DELL on 2018-7-4.
 */

import React from 'react';
import { message } from 'antd';
import { connect } from 'dva';
import Search from '../components/SysParamManage/SysParamSearch';
import List from '../components/SysParamManage/SysParamList';
import Info from '../components/SysParamManage/SysParamInfo';

class SysParamManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sysparaminfovisible: false,
    };
  }

  render() {
    const { sysparammanage, dispatch, common } = this.props;
    const {
      sysparamlist,
      recordInfo,
      pagination,
      queryobj,
    } = sysparammanage;
    const { codeList } = common;
    const { sysparaminfovisible } = this.state;
    // 搜索框组件用到的props
    const sysparamsearchprops = {
      codeList,
      onSearch: (query) => {
        const page = { ...pagination, current: 1 };
        dispatch({ type: 'sysparammanage/query', payload: { queryobj: { ...queryobj, ...query }, pagination: page, queryflag: 0 } });
      },
    };
    // 列表组件用到的props
    const sysparamlistprops = {
      pagination,
      sysparamlist,
      codeList,
      // sysparaminfo,
      onPageChange(page) {
        const { current, pageSize: pagesize } = page;
        dispatch({
          type: 'sysparammanage/query',
          payload: {
            queryobj,
            pagination: { ...pagination, current, pagesize },
            queryflag: 1, // 点击查询和点击翻页标志位 0--查询 1--翻页
          },
        });
      },
      onEdit: (recordinfo) => {
        this.setState({
          sysparaminfovisible: true,
        });
        dispatch({ type: 'sysparammanage/updateState', payload: { recordInfo: recordinfo } });
      },
    };
    // 修改用到的props
    const sysparaminfoprops = {
      sysparaminfovisible,
      recordInfo,
      key: Math.random(),
      onCloseModal: () => {
        this.setState({ sysparaminfovisible: false });
      },
      onUpdateRecord: (record, beforeRecord) => {
        dispatch({ type: 'sysparammanage/update', payload: { record, beforeRecord } }).then((data) => {
          if (data && data.result) {
            message.success('操作成功！');
            this.setState({
              sysparaminfovisible: false,
            });
            dispatch({ type: 'sysparammanage/updateState', payload: { recordInfo: {} } });
            const page = { ...pagination, current: 1 };
            dispatch({ type: 'sysparammanage/query', payload: { queryobj, pagination: page } });
          }
        });
      },

    };
    return (
      <div>
        <Search {...sysparamsearchprops} />
        <List {...sysparamlistprops} />
        <Info {...sysparaminfoprops} />
      </div>
    );
  }
}
function mapStateToProps({ sysparammanage, common }) {
  return { sysparammanage, common };
}

export default connect(mapStateToProps)(SysParamManage);
