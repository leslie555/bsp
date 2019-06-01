/**
 * Created by cherry on 2018/7/2.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Button, Table, Tooltip, Icon } from 'antd';
import HiatmpAuthorized from '../Authorized/HiatmpAuthorized';
import { ADDDICTTYPE, UPDATEDICTTYPE, DELETEDICTTYPE } from '../../config/authconstant';
import styles from './DictionaryList.less';

class DictionaryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { onEdit, handleDelete, codeList } = this.props;
    const noMatch = '';
    const authorizedProps = {
      codeList,
      noMatch,
    };
    // 列表
    const columns = [
      {
        title: '类型编号',
        width: '15%',
        dataIndex: 'enumtypeid',
        key: 'enumtypeid',
        align: 'center',
      }, {
        title: '类型名称',
        width: '30%',
        dataIndex: 'enumname',
        key: 'enumname',
        align: 'center',
        render: (text) => {
          return (
            <div className={styles.textOverflow}>
              <Tooltip title={text} placement="topLeft">
                <span>{text}</span>
              </Tooltip>
            </div>
          );
        },
      }, {
        title: '类型描述',
        width: '45%',
        dataIndex: 'enumdescribe',
        key: 'enumdescribe',
        align: 'center',
        render: (text) => {
          return (
            <div className={styles.textOverflow} style={{ textAlign: 'left' }}>
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
              <HiatmpAuthorized {...authorizedProps} code={UPDATEDICTTYPE}>
                <Icon
                  type="edit"
                  style={{ fontSize: '18px', marginLeft: '4px', cursor: 'pointer' }}
                  onClick={(e) => { onEdit(data); e.stopPropagation(); }}
                  title="编辑"
                />
              </HiatmpAuthorized>
              <HiatmpAuthorized {...authorizedProps} code={DELETEDICTTYPE}>
                <Icon
                  type="delete"
                  onClick={() => handleDelete(data)}
                  style={{
                    fontSize: '18px',
                    marginLeft: '4px',
                    cursor: 'pointer',
                  }}
                  title="删除"
                />
              </HiatmpAuthorized>
            </span>
          );
        },
      }];
    const { loading, dictionarylist, pagination, onPageChange, onEnumAdd, onView, currentId }
    = this.props;
    return (
      <div className="outline-out">
        <div className="outline-inner">
          <div className="outline-inner-padding">
            <Row>
              <Col span={18}>
                <div>搜索结果 共<span className="allNumLight">{pagination.total}</span> 条</div>
              </Col>
              <Col span={6} style={{ textAlign: 'right' }}>
                <HiatmpAuthorized {...authorizedProps} code={ADDDICTTYPE}>
                  <Button type="primary" style={{ margin: '0 5px' }} onClick={() => onEnumAdd()}><i className="table-right icon iconfont icon-tianjia" />新增</Button>
                </HiatmpAuthorized>
              </Col>
            </Row>
          </div>
          <Table
            columns={columns}
            rowClassName={
              (record, index) => {
                if (record.enumtypeid === currentId) {
                  return 'selectedRow';
                } else {
                  return index % 2 === 0 ? 'tableoddRow' : 'tableevenRow';
                }
              }}
            loading={loading}
            dataSource={dictionarylist}
            pagination={pagination}
            onChange={onPageChange}
            onRow={(record) => {
              return {
                onClick: () => onView(record),
              };
            }}
            locale={{ emptyText: '暂无数据' }}
            scroll={{ y: 550 }}
            rowKey="enumtypeid"
            size="big"
          />
        </div>
      </div>
    );
  }
}
DictionaryList.prototypes = {
  loading: PropTypes.bool,
  dictionarylist: PropTypes.array,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
  currentId: PropTypes.string,
};
export default Form.create()(DictionaryList);
