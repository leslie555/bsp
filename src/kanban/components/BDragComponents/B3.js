/**
 * Created by Administrator on 2017/12/19 0019.
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import classNames from 'classnames';

import { Card, Table, Tag } from 'antd';
import Ellipsis from '../Ellipsis';
import ToDoListModal from './ToDoListModal';
import styles from './Card.less';

export class B3 extends React.Component {
  componentWillMount() {
    const { dispatch, toDoPagination, bigStyle } = this.props;
    // 拖拽时候不要更新数据
    if (bigStyle == 'small') {
      return;
    }
    dispatch({
      type: 'user/getToDoList',
      payload: { pagination: toDoPagination },
    });
  }

  topage = (obj) => {
    const { dispatch, toDoPagination } = this.props;

    if (obj && !!obj.menu_name && !!obj.menu_id) {
      const tmpobj = {
        ...obj,
        ...{ menuId: obj.menu_id, menuName: obj.menu_name, url: obj.url, key: obj.menu_id },
      };

      dispatch({
        type: 'embedPage/add',
        payload: { selectedObj: tmpobj, activeKey: tmpobj.key },
      });
      if (tmpobj.need_return == '0') {
        const taskId = { ...{ taskId: tmpobj.task_id } };
        dispatch({
          type: 'user/cancelTodo',
          payload: { queryobj: taskId },
        });
      }
      dispatch({
        type: 'user/getToDoList',
        payload: { pagination: toDoPagination },
      });
    }
  };

  render() {
    const { bigStyle, toDoList = [], toDoPagination } = this.props;
    let dataSource = [];
    if (bigStyle == 'big') {
      dataSource = toDoList.filter((element, index) => {
        return index < 5;
      });
    } else {
      dataSource = toDoList.filter((element, index) => {
        return index < 2;
      });
    }
    const columns = [
      {
        title: '类型',
        dataIndex: 'name',
        key: 'type',
        className: 'tablefield',
        width: '20%',
        render: (text, record, index) => {
          return (
            <span
              style={{
                fontWeight: record.status != '0' ? 'normal' : 'bold',
                fontSize: bigStyle == 'big' ? '14px' : '12px',
              }}
            >
              {text}
            </span>
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
            onClick={this.topage.bind(null, record)}
          >
            <Ellipsis tooltip length={20}>
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
          <span
            style={{
              fontWeight: record.status != '0' ? 'normal' : 'bold',
              fontSize: bigStyle == 'big' ? '14px' : '12px',
            }}
          >
            {moment(text).format('YYYY-MM-DD')}
          </span>
        ),
      },
    ];
    const bsytle = classNames({
      [styles.bcardStyle]: bigStyle == 'big',
      [styles.bSmallcardStyle]: bigStyle != 'big',
    });
    return (
      <div>
        <Card
          bordered={false}
          title={
            <div>
              <span className={styles.title}>待办事项</span>
              &nbsp;&nbsp;<Tag color="#f50">&nbsp;&nbsp;{toDoList?.length}&nbsp;&nbsp;</Tag>
            </div>
          }
          extra={
            <ToDoListModal record={toDoList} bigStyle={bigStyle} topage={this.topage}>
              <u
                style={{
                  cursor: 'pointer',
                  fontSize: bigStyle == 'big' ? '14px' : '12px',
                  display: bigStyle == 'big' ? '' : 'none',
                }}
              >
                更多
              </u>
            </ToDoListModal>
          }
          className={bsytle}
        >
          <div className={styles.b3}>
            <Table
              columns={columns}
              dataSource={dataSource}
              size="small"
              className="listTable"
              pagination={false}
            />
          </div>
        </Card>
      </div>
    );
  }
}
export default connect(({ user }) => ({
  toDoList: user.toDoList,
  toDoPagination: user.toDoPagination,
}))(B3);
