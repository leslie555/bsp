/**
 * Created by mengfanchao on 2018/6/27.
 */
import { Row, Col, Form, Button, Select, Input, Tree, Table } from 'antd';
import React from 'react';
import { connect } from 'dva/index';

const FormItem = Form.Item;

class LogManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentWillMount() {
    const { dispatch, common } = this.props;
    const { curUser } = common;
    /* dispatch({
      type: 'commonbsp/getEnumList',
      payload: {},
    }); */
    dispatch({

    });
  }

  onPageChange = (page) => {

  }

  render() {
    return (
      <div>
       日志管理
      </div>
    );
  }
}

export default connect(LogManage);
