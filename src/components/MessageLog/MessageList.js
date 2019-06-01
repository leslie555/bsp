/**
 * Created by cherry on 2018/7/13.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Table, Tooltip } from 'antd';
import styles from './MessageList.less';

class MessageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // 列表
    const columns = [
      {
        title: '电话号码',
        width: '20%',
        dataIndex: 'telnumber',
        key: 'telnumber',
        align: 'center',
      }, {
        title: '短信内容',
        width: '50%',
        dataIndex: 'strmessage',
        key: 'strmessage',
        align: 'center',
        render: (text) => {
          return (
            <div className={styles.textOverflow} style={{ width: '45em', textAlign: 'left' }}>
              <Tooltip title={text} placement="topLeft">
                <span>{text}</span>
              </Tooltip>
            </div>
          );
        },
      }, {
        title: '时间',
        width: '20%',
        dataIndex: 'sendtime',
        key: 'sendtime',
        align: 'center',
      }, {
        title: '发送状态',
        width: '10%',
        dataIndex: 'submitstate',
        key: 'submitstate',
        align: 'center',
        render: (text) => {
          let textStr = '无';
          if (text === '0') {
            textStr = '发送失败';
          } else if (text === '1') {
            textStr = '发送成功';
          }
          return (
            <span>{textStr}</span>
          );
        },
      }];
    const { pagination, loading, messagelist, onPageChange } = this.props;
    return (
      <div className="outline-out">
        <div className="outline-inner">
          <div className="outline-inner-padding">
            <Row>
              <Col span={18}>
                <div>搜索结果 共<span className="allNumLight">{pagination.total}</span> 条</div>
              </Col>
            </Row>
          </div>
          <Table
            columns={columns}
            rowClassName={
              (record, index) => { return index % 2 === 0 ? 'tableoddRow' : 'tableevenRow'; }}
            loading={loading}
            dataSource={messagelist}
            pagination={pagination}
            onChange={onPageChange}
            scroll={{ y: 515 }}
            locale={{ emptyText: '暂无数据' }}
            rowKey="nid"
            size="big"
          />
        </div>
      </div>
    );
  }
}
MessageList.prototypes = {
  loading: PropTypes.bool,
  messagelist: PropTypes.array,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
};
export default Form.create()(MessageList);
