/**
 * Created by cherry on 2018/7/20.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Select, Radio, Input, Button, message } from 'antd';
import { DEPARTMENTTYPE, DEPARTMENTLEVEL, DATAAUTHORITY, AWARDEDAGENCIES } from '../../config/enums';
import styles from './DepartmentInfo.less';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
class DepartmentInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.handleEnumOption = this.handleEnumOption.bind(this);
    this.getParentOption = this.getParentOption.bind(this);
    this.onSaveHandle = this.onSaveHandle.bind(this);
    this.onCancelHandle = this.onCancelHandle.bind(this);
    this.onNLevelChange = this.onNLevelChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { form, departmentinfo } = this.props;
    if (nextProps.departmentinfo !== departmentinfo) {
      form.resetFields();
    }
  }

  // 确定保存
  onSaveHandle() {
    const { form, handleAddOrEdit, flag, departmentinfo } = this.props;
    const fields = [
      'cdepartmentcode',
      'departmentflag',
      'cdepartmentname',
      'deptshortname',
      'nlevel',
      'innerdeptflag',
      'dataauthority',
      'equipdeptflag',
    ];
    if (form.getFieldValue('cdepartmentcode')) {
      if (form.getFieldValue('nlevel') == '1') {
        form.validateFieldsAndScroll(fields, (err, values) => {
          if (!err) {
            if (flag === '1') {
              handleAddOrEdit({
                ...values,
                cdepartmentid: values.cdepartmentcode,
                parentdepartment: values.cdepartmentcode,
              });
            } else if (flag === '3') {
              handleAddOrEdit({ ...values, cdepartmentid: departmentinfo.cdepartmentid });
            }
          }
        });
      } else {
        form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            if (flag === '1') {
              handleAddOrEdit({ ...values, cdepartmentid: values.cdepartmentcode });
            } else if (flag === '3') {
              handleAddOrEdit({ ...values, cdepartmentid: departmentinfo.cdepartmentid });
            }
          }
        });
      }
    } else {
      message.error('请添加部门信息');
    }
  }

  // 取消按钮
  onCancelHandle() {
    const { form, onCancel } = this.props;
    form.resetFields();
    onCancel();
  }

  // 修改部门级别触发上级部门下拉框数据源变化
  onNLevelChange(value) {
    const { onSelectChange, form } = this.props;
    const formValues = form.getFieldsValue();
    onSelectChange(value, formValues);
    form.resetFields(['parentdepartment']);
  }

  // 获取上级部门
  getParentOption(info) {
    const options = [];
    const { list } = this.props;
    for (let i = 0; i < list.length; i += 1) {
      const dept = list[i];
      if (parseInt(dept.nlevel, 10) === parseInt(info.nlevel, 10) - 1) {
        options.push(
          <Option key={dept.cdepartmentcode} value={dept.cdepartmentcode}>
            {dept.deptshortname}
          </Option>
        );
      }
    }
    return options;
  }

  // 获取枚举值
  handleEnumOption(enumsid) {
    const options = [];
    const { enumList } = this.props;
    for (let i = 0; i < enumList.length; i += 1) {
      if (enumList[i].enumtypeid === (enumsid || '')) {
        options.push(<Option key={`enuma-${enumList[i].enumvalue}`} value={enumList[i].enumvalue}>{enumList[i].enumname}</Option>);
      }
    }
    return options;
  }

  render() {
    console.log(this.props);
    const { form, departmentinfo, flag, list } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      style: { height: '30px' },
    };
    const reg = new RegExp('^\\d{12,}$');
    const telreg = new RegExp('^[0-9]*$');
    const title = flag === '1' ? '新增部门' : (flag === '2' ? '详情信息' : '编辑部门');
    return (
      <div className="outline-out">
        <div className="outline-inner">
          <div className="outline-inner-padding">
            <h3 className={styles.detailInfoTitle}>{title}</h3>
            <div className={styles.detailInfo}>
              <Form>
                <FormItem {...formItemLayout} label="部门编码">
                  {getFieldDecorator('cdepartmentcode', {
                    initialValue: departmentinfo.cdepartmentcode,
                    rules: [{
                      pattern: reg,
                      required: true,
                      message: '请输入12位数字的部门编码！',
                    }],
                  })(
                    <Input placeholder="" maxLength="12" disabled={flag === '2' || flag === '3'} />
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="部门类别">
                  {getFieldDecorator('departmentflag', {
                    initialValue: departmentinfo.departmentflag,
                    rules: [{
                      required: true,
                      message: '请选择部门类别！',
                    }],
                  })(
                    <Select disabled={flag === '2'}>{this.handleEnumOption(DEPARTMENTTYPE)}</Select>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="部门全称">
                  {getFieldDecorator('cdepartmentname', {
                    initialValue: departmentinfo.cdepartmentname,
                    rules: [{
                      required: true,
                      message: '请输入部门全称！',
                    }],
                  })(
                    <Input placeholder="" maxLength="50" disabled={flag === '2'} />
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="部门简称">
                  {getFieldDecorator('deptshortname', {
                    initialValue: departmentinfo.deptshortname,
                    rules: [{
                      required: true,
                      message: '请输入部门简称！',
                    }],
                  })(
                    <Input placeholder="" maxLength="50" disabled={flag === '2'} />
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="部门级别">
                  {getFieldDecorator('nlevel', {
                    initialValue: departmentinfo.nlevel,
                    rules: [{
                      required: true,
                      message: '请选择部门级别！',
                    }],
                  })(
                    <Select disabled={flag === '2'} onChange={this.onNLevelChange}>{this.handleEnumOption(DEPARTMENTLEVEL)}</Select>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="上级部门">
                  {getFieldDecorator('parentdepartment', {
                    initialValue: departmentinfo.nlevel === '1' ? '' : departmentinfo.parentdepartment,
                    rules: [{
                      required: true,
                      message: '请选择上级部门！',
                    }],
                  })(
                    <Select
                      disabled={flag === '2' || departmentinfo.nlevel === '1'}
                      showSearch
                      filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                    >
                      {this.getParentOption(departmentinfo)}
                    </Select>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="负责人">
                  {getFieldDecorator('cprincipal', {
                    initialValue: departmentinfo.cprincipal,
                  })(
                    <Input placeholder="" maxLength="20" disabled={flag === '2'} />
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="联系电话">
                  {getFieldDecorator('ctelephone', {
                    initialValue: departmentinfo.ctelephone,
                    rules: [{
                      pattern: telreg,
                      message: '请输入数字！',
                    }],
                  })(
                    <Input placeholder="" maxLength="40" disabled={flag === '2'} />
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="描述">
                  {getFieldDecorator('cdescription', {
                    initialValue: departmentinfo.cdescription,
                  })(
                    <Input placeholder="" maxLength="250" disabled={flag === '2'} />
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="支队部门">
                  {getFieldDecorator('innerdeptflag', {
                    initialValue: departmentinfo.innerdeptflag,
                    rules: [{
                      required: false,
                      message: '请选择支队部门！',
                    }],
                  })(
                    <RadioGroup disabled={flag === '2'}>
                      <Radio value="1">内部部门</Radio>
                      <Radio value="0">非内部部门</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="数据权限">
                  {getFieldDecorator('dataauthority', {
                    initialValue: departmentinfo.dataauthority,
                    rules: [{
                      required: false,
                      message: '请选择数据权限！',
                    }],
                  })(
                    <Select disabled={flag === '2'}>{this.handleEnumOption(DATAAUTHORITY)}</Select>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="设备管理部门">
                  {getFieldDecorator('equipdeptflag', {
                    initialValue: departmentinfo.equipdeptflag,
                    rules: [{
                      required: true,
                      message: '请选择设备管理部门！',
                    }],
                  })(
                    <RadioGroup disabled={flag === '2'}>
                      <Radio value="0">是</Radio>
                      <Radio value="1">否</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="管辖区域" style={{ display: departmentinfo.nlevel === '3' ? '' : 'none' }}>
                  {getFieldDecorator('awardedagencies', {
                    initialValue: departmentinfo.awardedagencies,
                  })(
                    <Select disabled={flag === '2'}>{this.handleEnumOption(AWARDEDAGENCIES)}</Select>
                  )}
                </FormItem>
                <FormItem style={{ textAlign: 'right', marginBottom: 0 }}>
                  <Button
                    type="primary"
                    style={{ margin: '0 5px', visibility: flag === '2' ? 'hidden' : 'visible' }}
                    onClick={() => { this.onSaveHandle(); }}
                  >保存
                  </Button>
                  <Button
                    type="primary"
                    style={{ margin: '0 3px', visibility: flag === '2' ? 'hidden' : 'visible' }}
                    onClick={() => { this.onCancelHandle(); }}
                  >取消
                  </Button>
                </FormItem>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
DepartmentInfo.prototypes = {
  loading: PropTypes.bool,
  list: PropTypes.array,
  enumList: PropTypes.array,
  flag: PropTypes.string,
  departmentinfo: PropTypes.object,
  onCancel: PropTypes.func,
  onSelectChange: PropTypes.func,
  handleAddOrEdit: PropTypes.func,
};
export default Form.create()(DepartmentInfo);
