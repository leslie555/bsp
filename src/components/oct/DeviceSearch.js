/**
 * Created by cherry on 2018/7/20.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Button, Input, Select, Icon, TreeSelect, AutoComplete } from 'antd';
import HiatmpAuthorized from '../Authorized/HiatmpAuthorized';
import { MAINTENAN_UNIT, ANNULAR_REGION, SSXM, SGDW, DEV_TYPE, ENUM_STATUS, STATE, JKIP } from '../../config/enums';
import { OCT_DEVICE_MANAGEMENT, RESETDEPT } from '../../config/authconstant';

const FormItem = Form.Item;
const { Option } = Select;

function onSelect(value) {
}

function renderOption(item) {
  return (
    <AutoComplete.Option key={item.deviceid} text={item.deviceid}>
      {item.deviceid}
      <br />
      <span style={{ fontWeight: 'bold' }}> {item.devicename}</span>
    </AutoComplete.Option>
  );
}

class DepartmentSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      luduanValue: undefined,
      expand: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEnumOption = this.handleEnumOption.bind(this);
  }

  componentDidMount() {
    this.handleSubmit();
  }

  onChange = (value) => {
    console.log(value);
    this.setState({ luduanValue: value });
  }

  getFields() {
    const { expand, luduanValue } = this.state;
    const { dataSource, handleSearch } = this.props;
    const { form, treeData } = this.props;
    const { getFieldDecorator } = form;
    const children = [];
    const suffixDeviceid = <Icon type="close-circle" onClick={this.clearDeviceid} />;
    const suffixDeviceName = <Icon type="close-circle" onClick={this.clearDeviceName} />;
    const suffixDeviceIP = <Icon type="close-circle" onClick={this.clearDeviceIP} />;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      style: { height: '20px' },
    };
    const formItemLayoutSel = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      style: { height: '20px' },
    };
    const reg = new RegExp('^[0-9]*$');
    children.push(
      <Col span={6}>
        <FormItem {...formItemLayout} label="所属路段">
          {getFieldDecorator('sectionid', {
            initialValue: '',
          })(
            <TreeSelect
              value={luduanValue}
              dropdownStyle={{ maxHeight: 500, overflow: 'auto' }}
              treeData={treeData}
              placeholder="请选择路段"
              treeDefaultExpandAll
              onChange={this.onChange}
            />,
          )}
        </FormItem>
      </Col>
    );
    children.push(
      <Col span={6}>
        <FormItem {...formItemLayout} label="环形区域">
          {getFieldDecorator('annularid', {
            initialValue: '',
          })(<Select style={{ width: '100%' }}>{this.handleEnumOption(ANNULAR_REGION)}</Select>)}
        </FormItem>
      </Col>
    );
    children.push(
      <Col span={6}>
        <FormItem {...formItemLayout} label="设备编号">
          {getFieldDecorator('deviceid', {
            initialValue: '',
            // rules: [{
            //   pattern: reg,
            //   message: '请输入数字！',
            // }],
          })(<Input maxLength="12" suffix={suffixDeviceid} />)
        }
        </FormItem>
      </Col>
    );
    children.push(
      <Col span={6}>
        <FormItem {...formItemLayout} label="设备IP">
          {getFieldDecorator('deviceip', {
            initialValue: '',
            // rules: [{
            //   pattern: reg,
            //   message: '请输入数字！',
            // }],
          })(<Input maxLength="12" suffix={suffixDeviceIP} />)}
        </FormItem>
      </Col>
    );
    if (expand) {
      children.push(
        <Col span={6}>
          <FormItem {...formItemLayout} label="接口IP">
            {getFieldDecorator('interfaceip', {
              initialValue: '',
              // rules: [{
              //   pattern: reg,
              //   message: '请输入数字！',
              // }],
            })(<Select style={{ width: '100%' }}>{this.handleEnumOption(JKIP)}</Select>)}
          </FormItem>
        </Col>
      );
      children.push(
        <Col span={6}>
          <FormItem {...formItemLayout} label="设备名称">
            {getFieldDecorator('devicename', {
              initialValue: '',
            })(<Input maxLength="50" suffix={suffixDeviceName} />)}
          </FormItem>
        </Col>
      );
      children.push(
        <Col span={6}>
          <FormItem {...formItemLayout} label="所属项目">
            {getFieldDecorator('belongtoproj', {
              initialValue: '',
            })(<Select>{this.handleEnumOption(SSXM)}</Select>)}
          </FormItem>
        </Col>
      );
      children.push(
        <Col span={6}>
          <FormItem {...formItemLayout} label="维护单位">
            {getFieldDecorator('maintaindepart', {
              initialValue: '',
            })(<Select>{this.handleEnumOption(MAINTENAN_UNIT)}</Select>)}
          </FormItem>
        </Col>
      );
      children.push(
        <Col span={6}>
          <FormItem {...formItemLayout} label="施工单位">
            {getFieldDecorator('developer', {
              initialValue: '',
            })(<Select>{this.handleEnumOption(SGDW)}</Select>)}
          </FormItem>
        </Col>
      );
      children.push(
        <Col span={6}>
          <FormItem {...formItemLayout} label="设备类型">
            {getFieldDecorator('devicetype', {
              initialValue: '',
            })(<Select>{this.handleEnumOption(DEV_TYPE)}</Select>)}
          </FormItem>
        </Col>
      );
      children.push(
        <Col span={6}>
          <FormItem {...formItemLayout} label="设备状态">
            {getFieldDecorator('devicestatus', {
              initialValue: '',
            })(<Select>{this.handleEnumOption(ENUM_STATUS)}</Select>)}
          </FormItem>
        </Col>
      );
      children.push(
        <Col span={6}>
          <FormItem {...formItemLayout} label="使用状态">
            {getFieldDecorator('servicestatus', {
              initialValue: '',
            })(<Select>{this.handleEnumOption(STATE)}</Select>)}
          </FormItem>
        </Col>
      );
    }
    return children;
  }

  clearDeviceid = () => {
    const { form } = this.props;
    form.setFieldsValue({ deviceid: '' });
  }

  clearDeviceName = () => {
    const { form } = this.props;
    form.setFieldsValue({ devicename: '' });
  }

  clearDeviceIP = () => {
    const { form } = this.props;
    form.setFieldsValue({ deviceip: '' });
  }

  // 更多查询条件
  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  }

  // 重置搜索框
  handleReload() {
    const { form } = this.props;
    form.resetFields();
  }


  // 获取枚举值
  handleEnumOption(enumsid) {
    const options = [];
    const { enumList } = this.props;
    if (enumList.length > 0) {
      options.push(<Option value="">全部类型</Option>);
    }
    for (let i = 0; i < enumList.length; i += 1) {
      if (enumList[i].enumtypeid === (enumsid || '')) {
        options.push(<Option key={`enuma-${enumList[i].enumvalue}`} value={enumList[i].enumvalue}>{enumList[i].enumname}</Option>);
      }
    }
    return options;
  }

  // 查询设备列表
  handleSubmit() {
    const { form, onSearch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        onSearch(values);
      }
    });
  }

  render() {
    const { form, codeList } = this.props;
    const { expand } = this.state;
    const { getFieldDecorator } = form;
    const noMatch = '';
    const authorizedProps = {
      codeList,
      noMatch,
    };
    return (
      <div className="outline-out outline-out-top">
        <div className="outline-inner">
          <Form className="form-outline-inner-padding">
            <Row gutter={24}>{this.getFields()}</Row>
            <Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                <FormItem style={{ textAlign: 'right' }}>
                  <HiatmpAuthorized {...authorizedProps} code={OCT_DEVICE_MANAGEMENT}>
                    <Button type="primary" htmlType="submit" style={{ margin: '0 5px' }} onClick={() => this.handleSubmit()}>查询</Button>
                    <Button type="primary" style={{ margin: '0 3px' }} onClick={() => this.handleReload()}>重置</Button>
                  </HiatmpAuthorized>
                  <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>{expand ? '更少' : '更多'} <Icon type={expand ? 'up' : 'down'} /></a>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}
DepartmentSearch.prototypes = {
  loading: PropTypes.bool,
  enumList: PropTypes.array.isRequired,
  codeList: PropTypes.array.isRequired,
  queryobj: PropTypes.object,
  onSearch: PropTypes.func,
};
export default Form.create()(DepartmentSearch);
