/**
 * Created by cherry on 2018/7/13.
 */
import React from 'react';
import { connect } from 'dva';
import { Modal, message } from 'antd';
import Search from '../components/MessageLog/MessageSearch';
import List from '../components/MessageLog/MessageList';

class MessageLog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    const { messagelog, dispatch, common } = this.props;
    const {
      messagelist,
      queryobj,
      pagination,
    } = messagelog;
    const { codeList } = common;
    const searchprops = {
      queryobj,
      codeList,
      onSearch: (query) => {
        const page = { ...pagination, current: 1 };
        dispatch({
          type: 'messagelog/queryMessage',
          payload: { queryobj: { ...queryobj, ...query }, pagination: page },
        });
      },
    };
    const listprops = {
      pagination,
      messagelist,
      // 分页
      onPageChange(page) {
        dispatch({
          type: 'messagelog/queryMessage',
          payload: {
            queryobj,
            pagination: { ...pagination, current: page.current, pageSize: page.pageSize },
          },
        });
      },
    };
    return (
      <div>
        <Search {...searchprops} />
        <List {...listprops} />
      </div>
    );
  }
}
function mapStateToProps({ messagelog, common }) {
  return { messagelog, common };
}
export default connect(mapStateToProps)(MessageLog);
