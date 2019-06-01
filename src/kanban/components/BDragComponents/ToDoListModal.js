/**
 * Created by Administrator on 2017/12/26 0026.
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Form, Table } from 'antd';
import moment from 'moment';
import { announceTypes, setDefaultTo } from '../../utils/utils';
import Ellipsis from '../Ellipsis';
import styles from './Card.less';
/* eslint-disable   */

class ToDoListModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  showModelHandler = e => {
    if (e) e.stopPropagation();

    this.setState({
      visible: true,
    });
  };

  hideModelHandler = () => {
    this.setState({
      visible: false,
    });
  };
  onPageChange = page => {
    const { dispatch } = this.props;
    dispatch({ type: 'user/getToDoList', payload: { pagination: page } });
  };
  render() {
    const { children, bigStyle, topage } = this.props;
    const dataSource = setDefaultTo([], this.props.record || []);
    const columns = [
      {
        title: '类型',
        dataIndex: 'name',
        key: 'name',
        className: 'tablefield',
        width: '20%',
        render: (text, record, index) => {
          return (
            <label style={{ fontWeight: record.status != '0' ? 'normal' : 'bold' }}>{text}</label>
          );
        },
      },
      {
        title: '标题',
        dataIndex: 'task_title',
        key: 'title',
        className: 'tablefield',
        width: '45%',
        render: (text, record, index) => (
          <span
            style={{
              cursor: 'pointer',
              fontWeight: record.status != '0' ? 'normal' : 'bold',
              fontSize: bigStyle == 'big' ? '14px' : '12px',
            }}
            onClick={topage.bind(null, record)}
          >
            <Ellipsis tooltip lines={1}>
              {text}
            </Ellipsis>
          </span>
        ),
      },
      {
        title: '时间',
        dataIndex: 'create_time',
        key: 'time',
        className: 'tablefield',
        width: '30%',
        render: (text, record, index) => (
          <span style={{ fontWeight: record.status != '0' ? 'normal' : 'bold' }}>
            {moment(text).format('YYYY-MM-DD')}
          </span>
        ),
      },
    ];
    return (
      <span>
        <span onClick={this.showModelHandler}>{children}</span>
        <Modal
          title="待办事项列表"
          visible={this.state.visible}
          onCancel={this.hideModelHandler}
          record={this.props.record}
          width="700px"
          footer={null}
          className={styles.modalbodyxx}
        >
          <div style={{margin:'6px'}}>


          <Table
            columns={columns}
            dataSource={dataSource}
            size="small"
            className="listTable"
            pagination={false}
            rowClassName={(record, index) => styles.tableSelectedRowStyle}
          />
             </div>
        </Modal>
      </span>
    );
  }
}

export default connect(state => ({
  toDoList: state.user.toDoList,
  toDoPagination: state.user.toDoPagination,
}))(ToDoListModal);
