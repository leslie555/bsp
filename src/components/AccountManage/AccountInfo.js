/**
 * Created by Administrator on 2018/7/11.
 */
import { Row, Col, message, Form, Select, Input, Switch,
  Checkbox, Table, Button, Modal, Spin, notification, Tooltip, Tabs, Icon } from 'antd';
import React from 'react';
import { connect } from 'dva/index';
import styles from './AccountInfo.less';
import { ENUM_USERTYPE, ENUM_USERTYPE_POLICE } from '../../config/enums';
import { genEnumOption } from '../../utils/util';
import RoleSelect from './RoleSelect';
import PoliceSelect from './PoliceSelect';
import IPEdit from './IPEditModal';
import { IPDelete, resetPwd, queryPoliceListService } from '../../services/accmservice';
import Ellipsis from '../Ellipsis';
import { UPDATEUSER, RESETPWD, LOGINIPSET, LOGINTIMESET } from '../../config/authconstant';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const { Option } = Select;
const Confirm = Modal.confirm;
const RoleInput = Input.Search;
const Tabpane = Tabs.TabPane;

const gCuserpwd = 'admin123';// 初始密码
const sha512 = require('js-sha512');

const plainOptions = [
  { label: '网页登录', value: '1' },
  { label: 'PKI登录', value: '3' },
];

class AccountInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roleSelectVisible: false,
      roleList: [], // 当前用户的角色集
      roleids: [],
      ifMsg: false,
      IPInfoVisible: false, // IP编辑窗口
      IPSel: {}, // 当前选中的IP网段
      ipEditMode: 0, // 0查看 1新增 2编辑
      nuseridForIP: '', // 传给IP设置用的userid
      policeSelectVisible: false, // 警员信息选择窗口
    };
  }

  componentWillReceiveProps(nextProps) {
    const { userEditFlag, selectedUser } = this.props;
    if (nextProps.userEditFlag === 3 && userEditFlag !== nextProps.userEditFlag) {
      this.setState({
        roleList: nextProps.selectedUser.rolelist,
        roleids: nextProps.selectedUser.roleids,
        ifMsg: nextProps.selectedUser.msg_prompt,
      });
    }
    if (((nextProps.userEditFlag === 1 || nextProps.userEditFlag === 3)
          && userEditFlag !== nextProps.userEditFlag)
          || (selectedUser && nextProps.selectedUser
        && selectedUser.nuserid !== nextProps.selectedUser.nuserid)
    ) {
      this.setState({
        roleList: nextProps.selectedUser.rolelist,
        roleids: nextProps.selectedUser.roleids,
        ifMsg: nextProps.selectedUser.msg_prompt,
      });
    }
  }

  onRoleSelect = (selectRows) => {
    let roleStr = '';
    const roleids = [];
    for (let i = 0; i < selectRows.length; i += 1) {
      roleStr += `${selectRows[i].rolename}/`;
      roleids.push(selectRows[i].roleid);
    }
    if (roleStr.length > 0) roleStr = roleStr.substring(0, roleStr.length - 1);
    this.setState({ roleids, roleList: selectRows });
  }

  onRoleSelectClose = () => {
    this.setState({ roleSelectVisible: false });
  }

  onIPEdit = (record) => {
    this.setState({
      IPInfoVisible: true,
      IPSel: record,
      nuseridForIP: record.user_id,
      ipEditMode: 2,
    });
  }

  onPoliceInfoSelect = (police) => {
    const { form } = this.props;
    this.setState({ policeSelectVisible: false });
    form.setFieldsValue({
      phone: police.phone,
      cdepartmentid: police.depid,
      cdescription: police.idcard,
      cusername: police.policename,
    });
  }

  getDeptOptions = (depts) => {
    const options = [];
    for (let i = 0; i < depts.length; i += 1) {
      options.push(
        <Option
          key={`enuma-${depts[i].cdepartmentid}`}
          value={depts[i].cdepartmentid}
        >
          <Tooltip title={depts[i].deptshortname}>
            {depts[i].deptshortname}
          </Tooltip>
        </Option>
      );
    }
    return options;
  }

  getInfoFromPolice = (e) => {
    const { form } = this.props;
    if (form.getFieldValue('usertype') == ENUM_USERTYPE_POLICE
      && e.target.value !== ''
      && e.target.value !== ' ') {
      queryPoliceListService({ policename: e.target.value }).then((data) => {
        if (data && data.result) {
          if (data.policeList && data.policeList.length > 0) {
            const info = data.policeList[0];
            form.setFieldsValue({
              phone: info.phone,
              cdepartmentid: info.depid,
              cdescription: info.idcard,
            });
          }
        }
      });
    }
  }

  showPoliceSelect = () => {
    this.setState({ policeSelectVisible: true });
  }

  addIpHandle = () => {
    const { form } = this.props;
    form.validateFields((err, values) => {
      this.setState({ nuseridForIP: values.nuserid, IPInfoVisible: true, ipEditMode: 1 });
    });
  }

  deleteIP = (record) => {
    const { userEditFlag, selectedUser, dispatch } = this.props;
    Confirm({
      title: '提示',
      content: '是否确认删除选中的IP段？',
      cancelType: 'primary',
      onOk() {
        IPDelete({
          loginrestrict: { ...record },
        }).then((data) => {
          if (data) {
            notification.success({ message: '删除成功！' });
            dispatch({
              type: 'accountmanage/selectUserChange',
              payload: { selectedUser, userEditFlag },
            });
          } else {
            notification.error({ message: '删除失败！' });
          }
        }).catch((e) => {
          notification.error({ message: '删除失败！' });
        });
      },
      onCancel() {},
    });
  }

  resetPwd = () => {
    const { selectedUser } = this.props;
    resetPwd({
      nuserid: selectedUser.nuserid,
      cdepartmentid: selectedUser.cdepartmentid,
      cuserpwd: sha512(gCuserpwd + selectedUser.nuserid),
    }).then((data) => {
      if (data && data.result) {
        notification.success({ message: '密码重置成功！' });
      }
    }).catch((e) => {

    });
  }

  saveAccountInfo = () => {
    const { form, dispatch, userEditFlag, deptList, selectedUser } = this.props;
    const { roleids, roleList } = this.state;
    form.validateFields((err, values) => {
      if (!err) {
        if (roleids === '' || roleList === undefined || roleList.length <= 0) {
          Modal.info({ title: '提示', content: '请选择角色' });
          return;
        }
        if (userEditFlag === 2) {
          const cuserpwdSha = sha512(gCuserpwd + values.nuserid);
          const msgPrompt = values.msg_prompt ? 1 : 0;
          let logintype = '';
          if (values.logintype) {
            for (let i = 0; i < values.logintype.length; i += 1) {
              logintype += values.logintype[i];
            }
          }
          let usergrade;
          for (let j = 0; j < deptList.length; j += 1) {
            if (values.cdepartmentid === deptList[j].cdepartmentid) {
              usergrade = deptList[j].nlevel;
              break;
            }
          }
          const userinfo = { ...selectedUser, ...values };
          const addData = {
            ...userinfo,
            cuserpwd: cuserpwdSha,
            roleids,
            rolelist: roleList,
            msg_prompt: msgPrompt,
            logintype,
            nusergrade: usergrade,
          };
          dispatch({
            type: 'accountmanage/addOperator',
            payload: { ...addData },
          });
        }
        if (userEditFlag === 3) {
          const msgPrompt = values.msg_prompt ? 1 : 0;
          let logintype = '';
          if (values.logintype) {
            for (let i = 0; i < values.logintype.length; i += 1) {
              logintype += values.logintype[i];
            }
          }
          let usergrade;
          for (let j = 0; j < deptList.length; j += 1) {
            if (values.cdepartmentid === deptList[j].cdepartmentid) {
              usergrade = deptList[j].nlevel;
              break;
            }
          }
          const userinfo = { ...selectedUser, ...values };
          const addData = {
            ...userinfo,
            roleids,
            rolelist: roleList,
            msg_prompt: msgPrompt,
            logintype,
            nusergrade: usergrade,
            ipList: selectedUser.ipList,
          };
          delete addData.cuserpwd;
          dispatch({
            type: 'accountmanage/updateOperator',
            payload: { ...addData },
          });
        }
      }
    });
  }

  handleCancel = () => {
    const { dispatch, userEditFlag, form, selectedUser } = this.props;

    const acInfo = form.getFieldsValue();
    let noInfo = true;
    for (const key in acInfo) {
      if (acInfo[key] !== selectedUser[key]) {
        noInfo = false;
      }
    }
    if (!acInfo.cdepartmentid
       && !acInfo.cdescription
       && !acInfo.cusername
      && !acInfo.cuserpwd
      && !acInfo.logintype
      && !acInfo.msg_prompt
      && !acInfo.nuserid
      && !acInfo.phone
      && !acInfo.rolenames
      && !acInfo.usertype) {
      noInfo = true;
    }
    if (noInfo || userEditFlag === 1) {
      dispatch({
        type: 'accountmanage/selectUserChange',
        payload: { selectedUser: {}, userEditFlag: 1 },
      });
    } else {
      Confirm({
        title: '提示',
        content: '取消将丢失未保存的数据，是否确认取消？',
        cancelType: 'primary',
        onOk() {
          dispatch({
            type: 'accountmanage/selectUserChange',
            payload: { selectedUser: {}, userEditFlag: 1 },
          });
        },
        onCancel() {},
      });
    }
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
    const { form, deptList, userEditFlag, enumList,
      loading, selectedUser, dispatch, curUser, selectedRoleKeys, codeList } = this.props;
    const { roleList, roleSelectVisible, ifMsg,
      roleids, IPInfoVisible, IPSel, ipEditMode, nuseridForIP, policeSelectVisible } = this.state;

    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      style: { height: '20px' },
    };

    const showPolicLink = form.getFieldValue('usertype') == ENUM_USERTYPE_POLICE;
    const columns = [{
      align: 'center',
      title: '网段名称',
      dataIndex: 'segment_name',
      key: 'segment_name',
      width: '25%',
      render: (text, record, index) => (
        <span>
          <Ellipsis tooltip lines={1}>
            {text}
          </Ellipsis>
        </span>
      ),
    }, {
      align: 'center',
      title: '起始地址',
      dataIndex: 'start_address',
      key: 'start_address',
      width: '28%',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    }, {
      align: 'center',
      title: '结束地址',
      dataIndex: 'end_address',
      key: 'end_address',
      width: '28%',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    }, {
      align: 'center',
      title: '操作',
      className: styles.oprateButton,
      width: '19%',
      render: (text = 0, record, index) => {
        return (
          <Row style={{ display: userEditFlag == 1 ? 'none' : '' }}>
            <Icon
              type="edit"
              onClick={(e) => { this.onIPEdit(record); e.stopPropagation(); }}
              title="编辑"
              style={{
                cursor: 'pointer',
                display: this.checkPerssion(codeList, LOGINIPSET) ? '' : 'none',
              }}
            />
            <Icon
              type="delete"
              onClick={() => { this.deleteIP(record); }}
              title="删除"
              style={{
                cursor: 'pointer',
                display: this.checkPerssion(codeList, LOGINIPSET) ? '' : 'none',
              }}
            />
          </Row>
        );
      },
    }];

    // 登录IP设定用到的props
    const infoprops = {
      visible: IPInfoVisible,
      nuserid: nuseridForIP,
      record: IPSel,
      editMode: ipEditMode,
      // 关闭详情Modal`
      resetCallback: () => {
        this.setState({ IPInfoVisible: false });
      },
      onRefreshData: () => {
        dispatch({
          type: 'accountmanage/selectUserChange',
          payload: { selectedUser, userEditFlag },
        });
      },
    };

    return (
      <div className={styles.accountinfo}>
        <Row type="flex" justify="space-between" align="middle">
          <Col className={styles.infotitle}>
            {userEditFlag === 1 ? '信息详情' : '信息编辑'}
          </Col>
          <Col style={{ display: userEditFlag === 1 ? 'none' : '' }}>
            <Row type="flex">
              <Col>
                <Button
                  className={styles.buttonleft}
                  onClick={this.saveAccountInfo}
                  style={{ display: this.checkPerssion(codeList, UPDATEUSER) ? '' : 'none' }}
                >保存
                </Button>
              </Col>
              <Col>
                <Button
                  className={styles.buttonleft}
                  onClick={this.handleCancel}
                  style={{ display: this.checkPerssion(codeList, UPDATEUSER) ? '' : 'none' }}
                >取消
                </Button>
              </Col>
              <Col>
                <Button
                  style={{ display: this.checkPerssion(codeList, RESETPWD) && userEditFlag === 3 ? '' : 'none' }}
                  onClick={this.resetPwd}
                  size="small"
                >
                  重置密码
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className={styles.infocontent}>
          <FormItem {...formItemLayout} label="用户名">
            {getFieldDecorator('nuserid', {
              initialValue: '',
              rules: [
                { required: true,
                  max: 6,
                  pattern: /^[a-zA-Z0-9_]{6,6}$/g,
                  message: '请输入用户名(英文、数字、下划线6位字符)',
                },
              ] })(
                <Input disabled={userEditFlag === 1 || userEditFlag === 3} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="用户类型">
            {getFieldDecorator('usertype', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: '请输入用户类型',
                },
              ] })(
                <Select disabled={userEditFlag === 1}>
                  {genEnumOption(ENUM_USERTYPE, enumList)}
                </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="人员名称">
            <Tooltip placement="topLeft" title={form.getFieldValue('cusername')}>
              {getFieldDecorator('cusername', {
                initialValue: '',
                rules: [
                  { required: true,
                    max: 20,
                    message: '请输入人员名称',
                  }, {
                    validator: (rule, value, callback) => {
                      if (value && value.match("(?:')|(?:\\s)|(?:%)|(?:--)|(/\\*(?:.|[\\n\\r])*?\\*/)|(\\b(select|update|union|and|or|delete|insert|trancate|char|into|substr|ascii|declare|exec|count|master|into|drop|execute)\\b)")) {
                        callback('请不要包含特殊字符及命令');
                      }
                      callback();
                    },
                  },
                ] })(
                  <Input
                    maxLength="20"
                    disabled={userEditFlag === 1}
                    addonAfter={showPolicLink && userEditFlag !== 1
                      ? (
                        <Icon
                          style={{ cursor: 'pointer' }}
                          type="contacts"
                          onClick={this.showPoliceSelect}
                        />
                      )
                      : ''
                    }
                  />
              )}
            </Tooltip>
          </FormItem>
          <FormItem {...formItemLayout} label="角色">
            <Tooltip placement="topLeft" title={form.getFieldValue('rolenames')}>
              {getFieldDecorator('rolenames', {
                initialValue: '',
                rules: [
                  { required: true,
                    message: '请选择角色',
                  },
                ] })(
                  <RoleInput
                    disabled={userEditFlag === 1}
                    placeholder=""
                    enterButton="选择"
                    onSearch={() => {
                      this.setState({ roleSelectVisible: true });
                      const values = form.getFieldsValue();
                      dispatch({
                        type: 'accountmanage/setSelectedRoleKeys',
                        payload: {
                          selectedUser: { ...selectedUser, ...values },
                          selectedRoleKeys: selectedUser.roleids || [],
                        },
                      });
                    }}
                  />
              )}
            </Tooltip>
          </FormItem>
        </Row>
        <Row className={styles.infocontent}>
          <FormItem {...formItemLayout} label="所属部门">
            {getFieldDecorator('cdepartmentid', {
              initialValue: '',
              rules: [
                { required: true,
                  message: '请选择所属部门' },
              ] })(
                <Select
                  showSearch
                  disabled={userEditFlag === 1}
                  filterOption={
                    (input, option) => {
                      return option.props.children.props.children.toLowerCase().indexOf(
                        input.toLowerCase()) >= 0;
                    }
                  }
                >
                  {this.getDeptOptions(deptList)}
                </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="身份证号">
            {getFieldDecorator('cdescription', {
              initialValue: '',
              rules: [
                {
                  pattern: new RegExp(/(^[0-9]{15}$)|(^[0-9]{17}[A-Z0-9]{1}$)/i),
                  message: '请输入15或18位身份证号',
                },
              ] })(
                <Input maxLength="20" disabled={userEditFlag === 1} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="手机号码">
            {getFieldDecorator('phone', {
              initialValue: '',
              rules: [
                {
                  pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$/g,
                  message: '请输入合法手机号码',
                },
              ] })(
                <Input maxLength="15" disabled={userEditFlag === 1} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="短信提示">
            {getFieldDecorator('msg_prompt', {
              initialValue: '' })(
                <Switch
                  checkedChildren="开"
                  unCheckedChildren="关"
                  checked={ifMsg}
                  onChange={bool => this.setState({ ifMsg: bool })}
                  disabled={userEditFlag === 1}
                />
            )}
          </FormItem>
        </Row>
        <Row className={styles.infocontent}>
          <FormItem {...formItemLayout} label="登录方式">
            {getFieldDecorator('logintype', {
              initialValue: '1' })(
                <CheckboxGroup
                  disabled={userEditFlag === 1}
                  options={plainOptions}
                />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="初始密码">
            {getFieldDecorator('cuserpwd', {
              initialValue: '' })(
                <span>{gCuserpwd}</span>
            )}
          </FormItem>
          <Row type="flex" align="middle" className={styles.iprow}>
            <Col span={6}>
              <Row type="flex" justify="end">
                <span>登录IP设定：</span>
              </Row>
            </Col>
            <Col span={18}>
              <Row type="flex" justify="end" align="middle">
                <Button
                  icon="plus"
                  size="small"
                  style={{ display: this.checkPerssion(codeList, LOGINIPSET) && userEditFlag === 3 ? '' : 'none' }}
                  onClick={this.addIpHandle}
                >
                    新增
                </Button>
              </Row>
            </Col>
          </Row>
          <Table
            rowKey={record => record.lrpkid}
            columns={columns}
            dataSource={selectedUser && selectedUser.ipList ? selectedUser.ipList : []}
            rowClassName={(record, index) => {
              if (selectedUser
                && selectedUser.ipList
                && record.lrpkid === selectedUser.ipList.lrpkid) {
                return 'selectedRow';
              } else {
                return index % 2 === 0 ? 'tableoddRow' : 'tableevenRow';
              }
            }}
            className="acListTable"
            pagination={{ pageSize: 4 }}
          />
        </Row>
        <RoleSelect
          selectedKeys={selectedRoleKeys}
          selectedRows={roleList}
          onRoleSelect={this.onRoleSelect}
          onClose={this.onRoleSelectClose}
          visible={roleSelectVisible}
          curUser={curUser}
          selectedUser={selectedUser}
          dispatch={dispatch}
        />
        <IPEdit {...infoprops} />
        <PoliceSelect
          visible={policeSelectVisible}
          onClose={() => { this.setState({ policeSelectVisible: false }); }}
          onOk={this.onPoliceInfoSelect}
        />
        <div style={{ display: loading ? '' : 'none' }} className={styles.loadingDiv}>
          <Spin style={{ display: loading ? '' : 'none' }} tip="请稍候..." />
        </div>
      </div>
    );
  }
}

function mapPropsToFields(props) {
  const { selectedUser, userEditFlag } = props;
  return {
    nuserid: Form.createFormField({
      value: selectedUser ? selectedUser.nuserid : '',
    }),
    usertype: Form.createFormField({
      value: selectedUser ? selectedUser.usertype : '',
    }),
    cusername: Form.createFormField({
      value: selectedUser ? selectedUser.cusername : '',
    }),
    rolenames: Form.createFormField({
      value: selectedUser ? selectedUser.role : '',
    }),
    cdepartmentid: Form.createFormField({
      value: selectedUser ? selectedUser.cdepartmentid : '',
    }),
    cdescription: Form.createFormField({
      value: selectedUser ? selectedUser.cdescription : '',
    }),
    phone: Form.createFormField({
      value: selectedUser ? selectedUser.phone : '',
    }),
    msg_prompt: Form.createFormField({
      value: selectedUser ? selectedUser.msg_prompt : '',
    }),
    logintype: Form.createFormField({
      value: userEditFlag === 2 ? ['1'] : selectedUser ? selectedUser.logintype : '',
    }),
    cuserpwd: Form.createFormField({
      value: selectedUser ? selectedUser.cuserpwd : '',
    }),
  };
}


export default Form.create({ mapPropsToFields })(AccountInfo);
