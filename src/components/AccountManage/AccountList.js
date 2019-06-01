/**
 * Created by Administrator on 2018/7/11.
 */
import { Row, Col, Button, Table, Modal, notification, Tooltip, Icon } from 'antd';
import React from 'react';
import styles from './AccountList.less';
import { deleteOperator, deleteOperators } from '../../services/accmservice';
import Ellipsis from '../Ellipsis';
import { ADDUSER, DELETEUSER, UPDATEUSER } from '../../config/authconstant';
import RenderAuthorized from '../Authorized';

const Confirm = Modal.confirm;

class AccountList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onUserSelect = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'accountmanage/selectUserChange',
      payload: { selectedUser: record, userEditFlag: 1 },
    });
  }

  onUserEdit = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'accountmanage/selectUserChange',
      payload: { selectedUser: record, userEditFlag: 3 },
    });
  }

  deleteUser = (record) => {
    const { dispatch, queryParams, selDeptInfo } = this.props;
    Confirm({
      title: '提示',
      content: '是否确认删除用户？',
      cancelType: 'primary',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        deleteOperator({ ...record }).then((result) => {
          if (result) {
            notification.success({ message: '删除成功！' });
            dispatch({
              type: 'accountmanage/getOperatorList',
              payload: { ...queryParams, ...selDeptInfo },
            });
            dispatch({
              type: 'accountmanage/handleReset',
              payload: {},
            });
            dispatch({
              type: 'accountmanage/setSelectedUserKeys',
              payload: { selectedUserKeys: [] },
            });
          } else {
            notification.error({ message: '删除失败！' });
          }
        });
      },
      onCancel() {},
    });
  }

  addUser = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'accountmanage/selectUserChange',
      payload: { selectedUser: {}, userEditFlag: 2 },
    });
  }

  deleteUsers = () => {
    const { dispatch, queryParams, selDeptInfo, selectedUserRows } = this.props;
    if (!selectedUserRows.length > 0) {
      Modal.info({ title: '提示', content: '请先选择想要删除的数据！' });
      return;
    }
    Confirm({
      title: '提示',
      content: '是否确认删除选中的所有用户？',
      cancelType: 'primary',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        deleteOperators({ userlist: selectedUserRows }).then((result) => {
          if (result) {
            let defautUsers = '';
            let successUsers = '';
            for (let i = 0; i < result.length; i += 1) {
              if (!result[i].delresult) {
                defautUsers += `${result[i].userid},`;
              } else {
                // selectedUserKeys.delete(result[i].userid);
                successUsers += `${result[i].userid},`;
              }
            }
            if (defautUsers.length > 0 && successUsers.length > 0) {
              defautUsers = defautUsers.substring(0, defautUsers.length - 1);
              successUsers = defautUsers.substring(0, defautUsers.length - 1);
              notification.message({ message: `${successUsers}用户删除成功！\n${defautUsers}用户删除失败！` });
            } else if (defautUsers.length > 0 && successUsers.length <= 0) {
              notification.error({ message: '删除失败！' });
            } else if (defautUsers.length <= 0 && successUsers.length > 0) {
              notification.success({ message: '删除成功！' });
            }
            dispatch({
              type: 'accountmanage/getOperatorList',
              payload: { ...queryParams, ...selDeptInfo },
            });
            dispatch({
              type: 'accountmanage/handleReset',
              payload: {},
            });
            dispatch({
              type: 'accountmanage/setSelectedUserKeys',
              payload: { selectedUserKeys: [] },
            });
          } else {
            notification.error({ message: '删除异常！' });
          }
        });
      },
      onCancel() {},
    });
  }

  checkPerssion = (codeList, current) => {
    if (Array.isArray(codeList)) {
      if (codeList.indexOf(current) >= 0) {
        return true;
      }
    }
    return false;
  }

  render() {
    const { userList, loading, userTotalCount,
      selectedUserKeys, dispatch, codeList,
      userListPagenation, onPageChange, selectedUser } = this.props;

    const columns = [{
      align: 'center',
      title: '用户名',
      dataIndex: 'nuserid',
      // render: text => (
      // <Ellipsis tooltip lines={1}>
      // { text }
      // </Ellipsis>
      // ),
    }, {
      align: 'center',
      title: '人员名称',
      dataIndex: 'cusername',
      width: '330px',
      // render: text => (
      //   // <Ellipsis tooltip lines={1}>
      //   { text }
      //   // </Ellipsis>
      // ),
    }, {
      align: 'center',
      title: '所属部门',
      dataIndex: 'deptshortname',
      width: '272px',
      // render: text => (
      //   // <Ellipsis tooltip lines={1}>
      //   { text }
      //   // </Ellipsis>
      // ),
    }, {
      align: 'center',
      title: '操作',
      dataIndex: 'operate',
      className: styles.oprateButton,
      width: '100px',
      render: (text = 0, record, index) => {
        return (
          <Row>
            <Icon
              type="edit"
              onClick={(e) => { this.onUserEdit(record); e.stopPropagation(); }}
              title="编辑"
              style={{
                fontSize: '18px',
                cursor: 'pointer',
                marginLeft: '4px',
                display: this.checkPerssion(codeList, UPDATEUSER) ? '' : 'none',
              }}
            />
            <Icon
              type="delete"
              onClick={() => { this.deleteUser(record); }}
              title="删除"
              style={{
                fontSize: '18px',
                cursor: 'pointer',
                marginLeft: '4px',
                display: this.checkPerssion(codeList, DELETEUSER) ? '' : 'none',
              }}
            />
          </Row>
        );
      },
    }];

    const rowSelection = {
      selectedRowKeys: selectedUserKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        dispatch({
          type: 'accountmanage/setSelectedUserKeys',
          payload: {
            selectedUserKeys: selectedRowKeys,
            selectedUserRows: selectedRows,
          },
        });
      },
    };

    return (
      <div className={styles.accountlist}>
        <Row type="flex" justify="end">
          <span className={styles.listtitle}>{`搜索结果    共${userTotalCount}条`}</span>
          <Button
            icon="plus"
            onClick={this.addUser}
            style={{ visibility: this.checkPerssion(codeList, ADDUSER) ? 'visible' : 'hidden' }}
          >新增
          </Button>
          <Button
            icon="delete"
            className={styles.buttonstyle}
            onClick={this.deleteUsers}
            style={{ visibility: this.checkPerssion(codeList, DELETEUSER) ? 'visible' : 'hidden' }}
          >批量删除
          </Button>
        </Row>
        <Row>
          <Table
            /* loading={loading} */
            className={styles.listTable}
            columns={columns}
            dataSource={userList}
            rowSelection={rowSelection}
            rowClassName={(record, index) => {
              if (selectedUser && record.nuserid === selectedUser.nuserid) {
                return 'selectedRow';
              } else {
                return index % 2 === 0 ? 'tableoddRow' : 'tableevenRow';
              }
            }}
            rowKey={record => record.nuserid}
            scroll={{ y: 645 }}
            pagination={userListPagenation}
            onChange={onPageChange}
            onRow={(record) => {
              return {
                onClick: () => {
                  this.onUserSelect(record);
                },
              };
            }}
          />
        </Row>
      </div>
    );
  }
}


export default AccountList;
