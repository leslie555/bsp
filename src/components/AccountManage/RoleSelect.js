/**
 * Created by Administrator on 2018/7/19.
 */
import { Row, Col, Modal, Form, Input, Button, Table, Checkbox, Tooltip, message } from 'antd';
import React from 'react';
import styles from './RoleSelect.less';
import { getRoleList, getDistributAbleRoles, getRoleListLikeRolenameToJson } from '../../services/accmservice';
import Ellipsis from '../Ellipsis';
import { ADMINROLEID } from '../../config/sysparms';

const FormItem = Form.Item;

class RoleSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roleList: [], // 可支配角色数组
      selectedRows: [], // 选中的角色数组
      isAdmin: false, // 超级管理员
    };
  }

  componentWillReceiveProps(nextProps) {
    const { curUser, visible } = this.props;
    const { roleList } = this.state;
    if (!visible && nextProps.visible && nextProps.curUser.userid) {
      const roleids = nextProps.curUser.roleIdList;
      let isAdmin = false;
      for (let r = 0; r < roleids.length; r += 1) {
        if (roleids[r] === ADMINROLEID) {
          isAdmin = true;
        }
      }
      this.setState({ isAdmin });
      if (isAdmin) {
        getRoleList().then((result) => {
          if (result && result.roleList) {
            const roless = result.roleList;
            for (let ii = 0; ii < roless.length; ii += 1) {
              roless[ii].authorizable = '1';
              roless[ii].childauthorizable = '0';
              if (nextProps.selectedUser && nextProps.selectedUser.rolelist) {
                for (let jj = 0; jj < nextProps.selectedUser.rolelist.length; jj += 1) {
                  const sur = nextProps.selectedUser.rolelist[jj];
                  if (sur.roleid === roless[ii].roleid) {
                    roless[ii].childauthorizable = sur.authorizable;
                  }
                }
              }
            }
            const selrows = [];
            for (let mm = 0; mm < roless.length; mm += 1) {
              for (let nn = 0; nn < nextProps.selectedKeys.length; nn += 1) {
                if (roless[mm].roleid === nextProps.selectedKeys[nn]) {
                  selrows.push(roless[mm]);
                }
              }
            }
            this.setState({ roleList: roless, selectedRows: selrows });
          }
        }).catch((e) => {
          console.error(JSON.stringify(e));
        });
      } else {
        getDistributAbleRoles({
          userid: nextProps.curUser.userid,
          edituserid: nextProps.selectedUser.nuserid,
        }).then((result) => {
          if (result && result.roles) {
            const newRoles = result.roles;
            for (let i = 0; i < newRoles.length; i += 1) {
              const role = newRoles[i];
              if (role.authorizable === undefined) {
                role.authorizable = '1';
              }
              role.childauthorizable = '0';
              if (nextProps.selectedUser && nextProps.selectedUser.rolelist) {
                for (let jj = 0; jj < nextProps.selectedUser.rolelist.length; jj += 1) {
                  const sur = nextProps.selectedUser.rolelist[jj];
                  if (sur.roleid === role.roleid) {
                    role.childauthorizable = sur.authorizable;
                  }
                }
              }
            }
            const selrows = [];
            for (let mm = 0; mm < newRoles.length; mm += 1) {
              for (let nn = 0; nn < nextProps.selectedKeys.length; nn += 1) {
                if (newRoles[mm].roleid === nextProps.selectedKeys[nn]) {
                  selrows.push(newRoles[mm]);
                }
              }
            }
            this.setState({ roleList: newRoles, selectedRows: selrows });
          }
        }).catch((e) => {
          console.error(JSON.stringify(e));
        });
      }
    }
  }

  handleSubmit = (e) => {
    const { curUser, form, selectedUser, selectedKeys } = this.props;
    const { isAdmin } = this.state;
    const pthis = this;
    const rolename = form.getFieldValue('rolename');
    if (isAdmin) {
      getRoleListLikeRolenameToJson({ rolename }).then((result) => {
        if (result && result.roleList) {
          const roless = result.roleList;
          for (let ii = 0; ii < result.roleList.length; ii += 1) {
            roless[ii].authorizable = '1';
            roless[ii].childauthorizable = '0';
            if (selectedUser && selectedUser.rolelist) {
              for (let jj = 0; jj < selectedUser.rolelist.length; jj += 1) {
                const sur = selectedUser.rolelist[jj];
                if (sur.roleid === roless[ii].roleid) {
                  roless[ii].childauthorizable = sur.authorizable;
                }
              }
            }
          }
          const selrows = [];
          for (let mm = 0; mm < roless.length; mm += 1) {
            for (let nn = 0; nn < selectedKeys.length; nn += 1) {
              if (roless[mm].roleid === selectedKeys[nn]) {
                selrows.push(roless[mm]);
              }
            }
          }
          this.setState({ roleList: roless, selectedRows: selrows });
        }
      }).catch((err) => {
        console.error(JSON.stringify(err));
      });
    } else {
      getDistributAbleRoles({
        userid: curUser.userid,
        edituserid: selectedUser.nuserid,
        rolename,
      }).then((result) => {
        if (result && result.roles) {
          const newRoles = result.roles;
          for (let i = 0; i < newRoles.length; i += 1) {
            const role = newRoles[i];
            if (role.authorizable === undefined) {
              role.authorizable = '1';
            }
            role.childauthorizable = '0';
            if (selectedUser && selectedUser.rolelist) {
              for (let jj = 0; jj < selectedUser.rolelist.length; jj += 1) {
                const sur = selectedUser.rolelist[jj];
                if (sur.roleid === role.roleid) {
                  role.childauthorizable = sur.authorizable;
                }
              }
            }
          }
          const selrows = [];
          for (let mm = 0; mm < newRoles.length; mm += 1) {
            for (let nn = 0; nn < selectedKeys.length; nn += 1) {
              if (newRoles[mm].roleid === selectedKeys[nn]) {
                selrows.push(newRoles[mm]);
              }
            }
          }
          this.setState({ roleList: newRoles, selectedRows: selrows });
        }
      }).catch((err) => {
        console.error(JSON.stringify(err));
      });
    }
  }

  handleOK = () => {
    const { selectedRows } = this.state;
    const { onRoleSelect, onClose, selectedUser, dispatch, selectedKeys } = this.props;
    let roleStr = '';
    for (let i = 0; i < selectedRows.length; i += 1) {
      roleStr += `${selectedRows[i].rolename}/`;
    }
    if (roleStr.length > 0) roleStr = roleStr.substring(0, roleStr.length - 1);
    dispatch({
      type: 'accountmanage/setSelectedRoleKeys',
      payload: {
        selectedUser: { ...selectedUser, roleids: selectedKeys, role: roleStr },
        selectedRoleKeys: selectedKeys,
      },
    });
    for (let j = 0; j < selectedRows.length; j += 1) {
      const role = selectedRows[j];
      if (!role.authorizable) {
        role.authorizable = '0';
      }
    }
    onRoleSelect(selectedRows);
    onClose();
  }

  handleCancel = () => {
    const { onClose, form, dispatch, selectedUser } = this.props;
    form.setFieldsValue({ rolename: '' });
    onClose();
  }

  render() {
    const { visible, form, selectedKeys, dispatch, selectedUser, curUser } = this.props;
    const { getFieldDecorator } = form;
    const { roleList, isAdmin } = this.state;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      style: { height: '20px' },
    };
    const columns = [{
      align: 'center',
      title: '角色名称',
      dataIndex: 'rolename',
      width: '20%',
      // render: (text) => {
      //   return (
      //     <span style={{ width: 180 }}>
      //       <Ellipsis tooltip lines={1}>
      //         {text}
      //       </Ellipsis>
      //     </span>
      //   );
      // },
    }, {
      align: 'center',
      title: '描述',
      dataIndex: 'detail',
      width: '60%',
      // render: text => (
      //   <span style={{ width: 500 }}>
      //     <Ellipsis tooltip lines={1}>
      //       {text}
      //     </Ellipsis>
      //   </span>
      // ),
    }, {
      title: '授权',
      dataIndex: 'authorizable',
      align: 'center',
      width: '10%',
      render: (text = 0, record, index) => {
        return (
          <Checkbox
            checked={record.childauthorizable && record.childauthorizable === '1'}
            disabled={record.roleid == ADMINROLEID}
            onChange={(e) => {
              for (let i = 0; i < roleList.length; i += 1) {
                if (record.roleid === roleList[i].roleid) {
                  roleList[i].childauthorizable = e.target.checked ? '1' : '0';
                  this.setState({ roleList });
                }
              }
            }}
          />
        );
      },
    }];

    const rowSelection = {
      selectedRowKeys: selectedKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRows });
        dispatch({
          type: 'accountmanage/setSelectedRoleKeys',
          payload: {
            selectedUser,
            selectedRoleKeys: selectedRowKeys,
          },
        });
      },
      getCheckboxProps: record => ({
        disabled: record.roleid == ADMINROLEID,
        name: record.authorizable,
        onClick: () => {
          if (record.roleid == ADMINROLEID) message.info('超级管理员无法变更');
        },
      }),
    };

    return (
      <Modal
        width="900px"
        title="选择角色"
        maskClosable="false"
        visible={visible}
        onCancel={this.handleCancel}
        footer={null}
        className={styles.roelSelect}
      >
        <Form className={styles.searchForm} layout="inline">
          <Row>
            <Col span={14}>
              <FormItem {...formItemLayout} label="角色名称:" className={styles.formitem}>
                {getFieldDecorator('rolename', {
                  initialValue: '',
                  rules: [{
                    validator: (rule, value, callback) => {
                      if (value && value.match("(?:')|(?:\\s)|(?:%)|(?:--)|(/\\*(?:.|[\\n\\r])*?\\*/)|(\\b(select|update|union|and|or|delete|insert|trancate|char|into|substr|ascii|declare|exec|count|master|into|drop|execute)\\b)")) {
                        callback('请不要包含特殊字符及命令');
                      }
                      callback();
                    },
                  }] })(
                    <Input />
                )}
              </FormItem>
            </Col>
            <Col span={10}>
              <Row type="flex" justify="end">
                <FormItem>
                  <Button
                    type="primary"
                    onClick={this.handleSubmit}
                  >
                    查询
                  </Button>
                </FormItem>
                <FormItem>
                  <Button onClick={this.handleOK}>
                    确定
                  </Button>
                </FormItem>
                <FormItem>
                  <Button onClick={this.handleCancel}>
                    取消
                  </Button>
                </FormItem>
              </Row>
            </Col>
          </Row>
          <Row className={styles.rowStyle}>
            <Table
              rowKey="roleid"
              columns={columns}
              dataSource={roleList}
              rowSelection={rowSelection}
              rowClassName={(record, index) => {
                return index % 2 === 0 ? 'tableoddRow' : 'tableevenRow';
              }}
              pagination={false}
              scroll={{ y: 500 }}
              onRow={(record) => {
                return {
                  onMouseDown: () => {
                    if (record.roleid == ADMINROLEID) message.info('超级管理员无法变更');
                  },
                };
              }}
            />
          </Row>
        </Form>
      </Modal>
    );
  }
}


export default Form.create()(RoleSelect);
