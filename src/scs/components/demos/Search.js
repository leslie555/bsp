import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Button, Checkbox, Select, Icon } from 'antd';
import { HPLX, CONTROLLEVEL, CONTROLTYPE, CARBRAND, SOURCE } from '../../config/enums';
import CommCarNumberInput from '../../../components/common/CommCarNumberInput';

const CheckboxGroup = Checkbox.Group;
const { Option } = Select;
const FormItem = Form.Item;
const infostatusop = [
  { value: '10', label: '已' },
  { value: '20', label: '已撤控' },
  { value: '30', label: '已失效' },
];
const alarmstatusop = [{ value: '10', label: '未报警' }, { value: '20', label: '已报警' }];
const interceptflagop = [{ value: '0', label: '未查扣' }, { value: '1', label: '已查扣' }];
const pushuserop = [{ value: '0', label: '非专项治理车辆' }, { value: '1', label: '专项治理车辆' }];

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ifMoreTerms: false, // 折叠框标志位
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /* 更多查询条件 */
  toggleMoreTerms = () => {
    this.setState(prevState => ({
      ifMoreTerms: !prevState.ifMoreTerms,
    }));
  };

  /* 下拉框搜索--模糊匹配 */
  filterCaseType = (value, option) => {
    if (!value) {
      return true;
    }
    const val = option.props.value;
    if (!val) {
      return false;
    }
    if (val.startsWith(value)) {
      return true;
    }
    const text = option.props.children;
    if (text.indexOf(value) > -1) {
      return true;
    }
    return false;
  };

  // 获取枚举值
  handleGenEnumOption(enumsid = '') {
    const { enumList } = this.props;
    const options = [];
    const enums = enumList;
    options.push(
      <Option key="-1" value="-1">
        全部
      </Option>
    );
    for (const i in enums) {
      if (enums[i].enumtypeid === enumsid) {
        options.push(
          <Option key={`enuma-${enums[i].enumvalue}`} value={enums[i].enumvalue}>
            {enums[i].enumname}
          </Option>
        );
      }
    }
    return options;
  }

  // 查询列表
  handleSubmit() {
    const { form, onSearch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      const query = values;
      onSearch(query);
    });
  }

  // 重置搜索框
  handleReloadData() {
    const { form } = this.props;

    form.resetFields();
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      style: { height: '20px' },
    };
    const { carnoprofix, form } = this.props;
    const { getFieldDecorator } = form;
    const { ifMoreTerms } = this.state;
    return (
      <div className="outline-out outline-out-top">
        <div className="outline-inner">
          <Form className="form-outline-inner-padding">
            <Row gutter={40}>
              <Col span={6}>
                <FormItem {...formItemLayout} label="号牌号码">
                  {getFieldDecorator('carno', { initialValue: carnoprofix })(
                    <CommCarNumberInput maxLength={8} />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label="号牌种类">
                  {getFieldDecorator('cartype', { initialValue: '-1' })(
                    <Select showSearch filterOption={this.filterCaseType}>
                      {this.handleGenEnumOption(HPLX)}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label="类型">
                  {getFieldDecorator('controltype', { initialValue: '-1' })(
                    <Select>{this.handleGenEnumOption(CONTROLTYPE)}</Select>
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label="级别">
                  {getFieldDecorator('controllevel', { initialValue: '-1' })(
                    <Select>{this.handleGenEnumOption(CONTROLLEVEL)}</Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            {ifMoreTerms ? (
              <Row gutter={40}>
                <Col span={6}>
                  <FormItem {...formItemLayout} label="车辆品牌">
                    {getFieldDecorator('carbrand', { initialValue: '-1' })(
                      <Select showSearch filterOption={this.filterCaseType}>
                        {this.handleGenEnumOption(CARBRAND)}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label="信息来源">
                    {getFieldDecorator('source', { initialValue: '-1' })(
                      <Select>{this.handleGenEnumOption(SOURCE)}</Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label="状态">
                    {getFieldDecorator('infostatus', {
                      initialValue: ['10', '20', '30'],
                      rules: [{ required: true, message: '请选择状态！' }],
                    })(<CheckboxGroup options={infostatusop} />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label="报警状态">
                    {getFieldDecorator('alarmstatus', {
                      initialValue: ['10', '20'],
                      rules: [{ required: true, message: '请选择报警状态！' }],
                    })(<CheckboxGroup options={alarmstatusop} />)}
                  </FormItem>
                </Col>
              </Row>
            ) : null}

            <Row gutter={40}>
              {ifMoreTerms ? (
                <Col span={6}>
                  <FormItem {...formItemLayout} label="查扣状态">
                    {getFieldDecorator('interceptflag', {
                      initialValue: ['0', '1'],
                      rules: [{ required: true, message: '请选择查扣状态！' }],
                    })(<CheckboxGroup options={interceptflagop} />)}
                  </FormItem>
                </Col>
              ) : (
                <Col span={6} />
              )}
              {ifMoreTerms ? (
                <Col span={6}>
                  <FormItem {...formItemLayout} label="专项治理">
                    {getFieldDecorator('pushuser', {
                      initialValue: ['0', '1'],
                      rules: [{ required: true, message: '请选择是否为专项治理！' }],
                    })(<CheckboxGroup options={pushuserop} />)}
                  </FormItem>
                </Col>
              ) : (
                <Col span={6} />
              )}
              <Col span={6} />
              <Col span={6}>
                <FormItem style={{ textAlign: 'right' }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ margin: '0 5px' }}
                    onClick={() => this.handleSubmit()}
                  >
                    查询
                  </Button>
                  <Button
                    type="primary"
                    style={{ margin: '0 3px' }}
                    onClick={() => this.handleReloadData()}
                  >
                    重置
                  </Button>
                  <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggleMoreTerms}>
                    {ifMoreTerms ? '收起' : '更多'}
                    <Icon type={ifMoreTerms ? 'up' : 'down'} />
                  </a>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}

Search.propTypes = {
  enumList: PropTypes.array,
  queryobj: PropTypes.object.isRequired,
  checkedarr: PropTypes.array.isRequired,
};
Search.defaultProps = {
  enumList: [],
};
export default Form.create()(Search);
