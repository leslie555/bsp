/**
 * Created by cherry on 2018/7/26.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Table, Icon, Button, Tooltip } from 'antd';
import HiatmpAuthorized from '../Authorized/HiatmpAuthorized';
import { ADDROLE, UPDATEROLE, DELETEROLE } from '../../config/authconstant';
import styles from './RoleList.less';
import { SUPERROLEID } from '../../config/constant';

class RoleList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
    };
  }

  render() {
    const { onEdit, onDelete, codeList, curUser } = this.props;
    const noMatch = '';
    const authorizedProps = {
      codeList,
      noMatch,
    };
    const { roleIdList, userid } = curUser;
    // 是否超级管理员
    const isSuper = roleIdList && roleIdList.includes(SUPERROLEID);
    // 列表
    const columns = [
      {
        title: '角色名称',
        width: '45%',
        dataIndex: 'rolename',
        key: 'rolename',
        align: 'center',
        render: (text) => {
          return (
            <div className={styles.textOverflow} style={{ width: '100%' }}>
              <Tooltip title={text} placement="topLeft">
                <span>{text}</span>
              </Tooltip>
            </div>
          );
        },
      }, {
        title: '描述',
        width: '45%',
        dataIndex: 'detail',
        key: 'detail',
        align: 'center',
        render: (text) => {
          return (
            <div className={styles.textOverflow} style={{ width: '100%', textAlign: 'center' }}>
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
          const { creator } = record;
          return (
            <span>
              <HiatmpAuthorized {...authorizedProps} code={UPDATEROLE}>
                <Icon
                  type="edit"
                  style={{
                    fontSize: '18px',
                    marginLeft: '4px',
                    cursor: 'pointer',
                    display: isSuper || userid === creator ? '' : 'none',
                  }}
                  onClick={(e) => { onEdit(record); e.stopPropagation(); }}
                  title="编辑"
                />
              </HiatmpAuthorized>
              <HiatmpAuthorized {...authorizedProps} code={DELETEROLE}>
                <Icon
                  type="delete"
                  onClick={() => onDelete(record.roleid, record.rolename)}
                  style={{
                    fontSize: '18px',
                    marginLeft: '4px',
                    cursor: 'pointer',
                    display: isSuper || userid === creator ? '' : 'none',
                  }}
                  title="删除"
                />
              </HiatmpAuthorized>
            </span>
          );
        },
      }];
    const {
      loading,
      rolelist,
      pagination,
      onPageChange,
      onAdd,
      onView,
      selectedKeys,
      changeSelected,
      currentId,
    } = this.props;
    const rowSelection = {
      selectedRowKeys: selectedKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        changeSelected(selectedRowKeys);
        this.setState({
          selectedRows,
        });
      },
    };
    const ids = selectedKeys.join(',');
    const { selectedRows } = this.state;
    const cannotDelete = selectedRows.some((role) => {
      return role.creator !== userid;
    });
    const deleteRoleNames = selectedRows.map((role) => {
      return role.rolename;
    });
    return (
      <div className="outline-out">
        <div className="outline-inner">
          <div className="outline-inner-padding">
            <Row>
              <Col span={18}>
                <div>搜索结果 共<span className="allNumLight">{pagination.total}</span> 条</div>
              </Col>
              <Col span={6} style={{ textAlign: 'right' }}>
                <HiatmpAuthorized {...authorizedProps} code={ADDROLE}>
                  <Button type="primary" style={{ margin: '0 5px' }} onClick={() => onAdd()}><i className="table-right icon iconfont icon-tianjia" />新增</Button>
                </HiatmpAuthorized>
                <HiatmpAuthorized {...authorizedProps} code={DELETEROLE}>
                  <Button
                    type="primary"
                    style={{ margin: '0 5px' }}
                    onClick={() => onDelete(ids, deleteRoleNames.join('，'), !(isSuper || !cannotDelete))}
                  >
                    <i className="table-right icon iconfont icon-delete-tab" />
                    批量删除
                  </Button>
                </HiatmpAuthorized>
              </Col>
            </Row>
          </div>
          <Table
            columns={columns}
            className={styles.roleTable}
            rowClassName={
              (record, index) => {
                if (record.roleid === currentId) {
                  return 'selectedRow';
                } else {
                  return index % 2 === 0 ? 'tableoddRow' : 'tableevenRow';
                }
              }}
            loading={loading}
            dataSource={rolelist}
            rowSelection={rowSelection}
            pagination={pagination}
            onChange={onPageChange}
            onRow={(record) => {
              return {
                onClick: () => onView(record),
              };
            }}
            scroll={{ y: 550 }}
            locale={{ emptyText: '暂无数据' }}
            rowKey="roleid"
          />
        </div>
      </div>
    );
  }
}
RoleList.prototypes = {
  loading: PropTypes.bool,
  rolelist: PropTypes.array,
  codeList: PropTypes.array,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
  currentId: PropTypes.string,
};
export default Form.create()(RoleList);
