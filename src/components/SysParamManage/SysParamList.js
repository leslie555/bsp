/**
 * Created by cherry on 2018/7/2.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Tooltip, Table, Icon } from 'antd';
import HiatmpAuthorized from '../Authorized/HiatmpAuthorized';
import { UPDATESYSPARAM } from '../../config/authconstant';
import styles from './SysParamList.less';

class SysParamList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const noMatch = '';
    const { onEdit, pagination, onAdd, loading, sysparamlist, onPageChange, codeList } = this.props;
    const authorizedProps = {
      codeList,
      noMatch,
    };
    // 列表
    const columns = [
      {
        title: '参数代码',
        width: '25%',
        dataIndex: 'paramcode',
        key: 'paramcode',
        align: 'center',
        render: (text) => {
          return (
            <div className={styles.textOverflow} style={{ width: '30em' }}>
              <Tooltip title={text} placement="topLeft">
                <span>{text}</span>
              </Tooltip>
            </div>
          );
        },
      }, {
        title: '参数名称',
        width: '25%',
        dataIndex: 'paramname',
        key: 'paramname',
        align: 'center',
        render: (text) => {
          return (
            <div className={styles.textOverflow} style={{ width: '30em', textAlign: 'left' }}>
              <Tooltip title={text} placement="topLeft">
                <span>{text}</span>
              </Tooltip>
            </div>
          );
        },
      }, {
        title: '参数值',
        width: '15%',
        dataIndex: 'paramvalue',
        key: 'paramvalue',
        align: 'center',
        render: (text) => {
          return (
            <div className={styles.textOverflow} style={{ width: '17em' }}>
              <Tooltip title={text} placement="topLeft">
                <span>{text}</span>
              </Tooltip>
            </div>
          );
        },
      }, {
        title: '参数描述',
        width: '25%',
        dataIndex: 'paramcontent',
        key: 'paramcontent',
        align: 'center',
        render: (text) => {
          return (
            <div className={styles.textOverflow} style={{ width: '28em', textAlign: 'left' }}>
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
              <HiatmpAuthorized {...authorizedProps} code={UPDATESYSPARAM}>
                <Icon
                  type="edit"
                  style={{ fontSize: '18px', marginLeft: '4px', cursor: 'pointer' }}
                  onClick={() => {
                    onEdit(data);
                  }}
                  title="编辑"
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
            dataSource={sysparamlist}
            pagination={pagination}
            onChange={onPageChange}
            scroll={{ y: 550 }}
            locale={{ emptyText: '暂无数据' }}
            rowKey="nid"
            size="big"
          />
        </div>
      </div>
    );
  }
}
SysParamList.prototypes = {
  loading: PropTypes.bool,
  sysparamList: PropTypes.array,
  pagination: PropTypes.object,
};
export default Form.create()(SysParamList);
