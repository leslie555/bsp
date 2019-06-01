/**
 * Created by cherry on 2018/7/2.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Button, Table, Icon, Modal, Tooltip } from 'antd';
import HiatmpAuthorized from '../Authorized/HiatmpAuthorized';
import { ADDILLEGAL, UPDATEILLEGAL, DELETEILLEGAL } from '../../config/authconstant';
import styles from './IllegalList.less';

const { confirm } = Modal;
class IllegalList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.showDeleteConfirm = this.showDeleteConfirm.bind(this);
  }

  showDeleteConfirm(data) {
    const curthis = this;
    confirm({
      title: '违法行为代码删除确认',
      content: '确定要删除该条记录么？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        curthis.props.onDelete(data);
      },
      onCancel() {

      },
    });
  }

  render() {
    const noMatch = '';
    const { onView, onEdit, pagination, onAdd, loading,
      illegallist, onPageChange, codeList } = this.props;
    const authorizedProps = {
      codeList,
      noMatch,
    };
    // 列表
    const columns = [
      {
        title: '违法代码',
        width: '10%',
        dataIndex: 'wfxw',
        key: 'wfxw',
        align: 'center',
      }, {
        title: '违法内容简称',
        width: '40%',
        dataIndex: 'wfms',
        key: 'wfms',
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
        title: '违法内容',
        width: '40%',
        dataIndex: 'wfnr',
        key: 'wfnr',
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
        title: '操作',
        width: '10%',
        align: 'center',
        key: 'action',
        render: (text, record) => {
          const data = { ...record };
          return (
            <span>
              <Icon
                type="file"
                style={{ fontSize: '18px', marginLeft: '4px', cursor: 'pointer' }}
                onClick={() => {
                  onView(data);
                }}
                title="查看"
              />
              <HiatmpAuthorized {...authorizedProps} code={UPDATEILLEGAL}>
                <Icon
                  type="edit"
                  style={{ fontSize: '18px', marginLeft: '4px', cursor: 'pointer' }}
                  onClick={() => {
                    onEdit(data);
                  }}
                  title="修改"
                />
              </HiatmpAuthorized>
              <HiatmpAuthorized {...authorizedProps} code={DELETEILLEGAL}>
                <Icon
                  type="delete"
                  style={{ fontSize: '18px', marginLeft: '4px', cursor: 'pointer' }}
                  onClick={() => {
                    this.showDeleteConfirm(data);
                  }}
                  title="删除"
                />
              </HiatmpAuthorized>
            </span>
          );
        },
      }];
    return (
      <div className="outline-out">
        <div className="outline-inner">
          <div className="outline-inner-padding">
            <Row>
              <Col span={12}>
                <div>搜索结果 共<span className="allNumLight">{pagination.total}</span> 条</div>
              </Col>
              <Col span={6} offset={6} style={{ textAlign: 'right' }}>
                <HiatmpAuthorized {...authorizedProps} code={ADDILLEGAL}>
                  <Button type="primary" style={{ margin: '0 5px' }} onClick={() => onAdd()}><i className="table-right icon iconfont icon-tianjia" />添加</Button>
                </HiatmpAuthorized>
              </Col>
            </Row>
          </div>
          <Table
            columns={columns}
            rowClassName={
              (record, index) => { return index % 2 === 0 ? 'tableoddRow' : 'tableevenRow'; }}
            loading={loading}
            dataSource={illegallist}
            pagination={pagination}
            onChange={onPageChange}
            locale={{ emptyText: '暂无数据' }}
            scroll={{ y: 550 }}
            rowKey="nid"
            size="big"
          />
        </div>
      </div>
    );
  }
}
IllegalList.prototypes = {
  loading: PropTypes.bool,
  IllegalList: PropTypes.array,
  pagination: PropTypes.object,
};
export default Form.create()(IllegalList);
