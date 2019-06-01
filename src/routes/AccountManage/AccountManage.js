/**
 * Created by mengfanchao on 2018/6/27.
 */
import { Row, Col, Form, Button, Select, Input, Tree, Table } from 'antd';
import React from 'react';
import { connect } from 'dva/index';
import styles from './AccountManage.less';
import AccountSearch from '../../components/AccountManage/AccountSearch';
import DepartmentTree from '../../components/AccountManage/DepartmentTree';
import AccountInfo from '../../components/AccountManage/AccountInfo';
import AccountList from '../../components/AccountManage/AccountList';

const FormItem = Form.Item;

class AccountManage extends React.Component {
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
      type: 'accountmanage/setSelDeptInfo',
      payload: {
        cdepartmentid: curUser.departmentid,
        nlevel: curUser.nlevel,
      },
    });
  }

  onPageChange = (page) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'accountmanage/onUserListPageChange',
      payload: page,
    });
  }

  render() {
    const { accountmanage, dispatch, common, loading } = this.props;
    const {
      departmentList,
      expandedKeys,
      userList,
      selectedUser,
      userEditFlag,
      deptList,
      queryParams,
      userTotalCount,
      selDeptInfo,
      selectedRoleKeys,
      selectedUserKeys,
      selectedUserRows,
      userListPagenation,
    } = accountmanage;
    const { enumList, curUser, codeList } = common;

    const searchProps = {
      dispatch,
      selDeptInfo,
      codeList,
      curUser,
    };
    const treeProps = {
      dispatch,
      departmentList,
      expandedKeys,
      queryParams,
      codeList,
    };
    const listProps = {
      loading,
      userList,
      dispatch,
      queryParams,
      userTotalCount,
      selectedUserKeys,
      selectedUserRows,
      userEditFlag,
      selectedUser,
      codeList,
      selDeptInfo,
      userListPagenation,
      onPageChange: this.onPageChange,
    };
    const infoProps = {
      loading,
      dispatch,
      selectedUser,
      userEditFlag,
      enumList,
      deptList,
      curUser,
      selectedRoleKeys,
      codeList,
    };

    return (
      <div className={styles.accountManage}>
        <Row className={styles.searchSytle}>
          <AccountSearch {...searchProps} />
        </Row>
        <div className={styles.marginTop}>
          <div className="outline-out">
            <div className="outline-inner">
              <Row className="outline-inner-padding">
                <Col span={4}>
                  <DepartmentTree {...treeProps} />
                </Col>
                <Col span={14}>
                  <AccountList {...listProps} />
                </Col>
                <Col span={6}>
                  <AccountInfo {...infoProps} />
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
function mapStateToProps({ accountmanage, common, loading }) {
  return { accountmanage, common, loading: loading.models.accountmanage };
}

export default connect(mapStateToProps)(AccountManage);
