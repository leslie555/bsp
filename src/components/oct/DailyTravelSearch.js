/**
 * Created by cherry on 2018/7/20.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Select, Row, Col, Button, InputNumber, Input, DatePicker, Radio } from 'antd';
import moment from 'moment';
import { ENUM_ILLEGAL } from '../../config/enums';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const FormItem = Form.Item;
const endTime = moment();
const RadioGroup = Radio.Group;
const { Option } = Select;

// 不可选择未来日期
function disabledDate(current) {
  return current > moment();
}

function onChange(value, dateString) {
  console.log('Selected Time: ', value);
  console.log('Formatted Selected Time: ', dateString);
}

function onOk(value) {
  console.log('onOk: ', value);
}
class DailyTravelSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 1,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onChange = (e) => {
    console.log('radio checked', e.target.value);
    const v = e.target.value;
    this.setState({
      value: e.target.value,
    });
    const { onchange } = this.props;
    onchange(v);
  }

  // 查询设备列表
  handleSubmit(type1) {
    const { form, onSearch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      const { starttime, endtime } = values;
      console.log(starttime);
      console.log(endtime);
      console.log(values);
      const value = { starttime1: starttime, endtime1: endtime, type: type1 };
      console.log(value);
      if (!err) {
        onSearch(value);
      }
    });
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

  // 重置搜索框
  handleReload() {
    const { form } = this.props;
    form.resetFields();
  }

  render() {
    const { value } = this.state;
    const startTime = moment(`${moment().add(-1, 'days').format('YYYY/MM/DD')}`);
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      style: { height: '20px' },
    };
    const formItemLayoutSel = {
      labelCol: { span: 12 },
      wrapperCol: { span: 12 },
      style: { height: '20px' },
    };
    const h3Layout = {
      style: { padding: '1rem 0 0 1rem' },
    };
    const { form, codeList, excel, onDownload, dayavg, onchange } = this.props;
    const { getFieldDecorator } = form;
    const noMatch = '';
    const authorizedProps = {
      codeList,
      noMatch,
    };
    const reg = new RegExp('^[0-9]*$');
    return (
      <div className="outline-out outline-out-top">
        <div className="outline-inner">
          <h3 {...h3Layout}>机动车出行量</h3>
          <RadioGroup onChange={this.onChange} value={value}>
            <Radio value={1}>日均</Radio>
            <Radio value={2}>月均</Radio>
          </RadioGroup>
          <Form className="form-outline-inner-padding">
            {dayavg ? (
              <Row>
                <Col span={6}>
                  <FormItem {...formItemLayout} label="开始时间">
                    {getFieldDecorator('starttime', {
                      initialValue: startTime,
                      rules: [{
                        required: true,
                        message: '请输入开始时间！',
                      }],
                    })(
                      <DatePicker
                        format="YYYY-MM-DD"
                        placeholder="Select Time"
                        onChange={onChange}
                        onOk={onOk}
                        disabledDate={disabledDate}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label="结束时间">
                    {getFieldDecorator('endtime', {
                      initialValue: endTime,
                      rules: [{
                        required: true,
                        message: '请输入结束时间！',
                      }],
                    })(
                      <DatePicker
                        format="YYYY-MM-DD"
                        placeholder="Select Time"
                        onChange={onChange}
                        onOk={onOk}
                        disabledDate={disabledDate}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8} offset={2}>
                  <FormItem style={{ textAlign: 'right' }}>
                    <Button type="primary" htmlType="submit" style={{ margin: '0 5px' }} onClick={() => this.handleSubmit('day')}>查询</Button>
                    <Button type="primary" style={{ margin: '0 3px' }} onClick={() => this.handleReload()}>重置</Button>
                  </FormItem>
                </Col>
                <Col span={1} style={{ textAlign: 'right' }}>
                  <Button type="primary" style={{ margin: '0 5px', marginTop: '8%' }} disabled={(excel == null) || (!excel)} onClick={onDownload}><i className="table-right icon iconfont icon-export" />
                    批量导出
                  </Button>
                </Col>
              </Row>
            ) : (
              <Row>
                <Col span={6}>
                  <FormItem {...formItemLayout} label="开始时间">
                    {getFieldDecorator('starttime', {
                      initialValue: startTime,
                      rules: [{
                        required: true,
                        message: '请输入开始时间！',
                      }],
                    })(
                      <MonthPicker
                        format="YYYY-MM"
                        style={{ width: '100%' }}
                        disabledDate={disabledDate}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem {...formItemLayout} label="结束时间">
                    {getFieldDecorator('endtime', {
                      initialValue: endTime,
                      rules: [{
                        required: true,
                        message: '请输入结束时间！',
                      }],
                    })(
                      <MonthPicker
                        format="YYYY-MM"
                        style={{ width: '100%' }}
                        disabledDate={disabledDate}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8} offset={2}>
                  <FormItem style={{ textAlign: 'right' }}>
                    <Button type="primary" htmlType="submit" style={{ margin: '0 5px' }} onClick={() => this.handleSubmit('month')}>查询</Button>
                    <Button type="primary" style={{ margin: '0 3px' }} onClick={() => this.handleReload()}>重置</Button>
                  </FormItem>
                </Col>
                <Col span={1} style={{ textAlign: 'right' }}>
                  <Button type="primary" style={{ margin: '0 5px', marginTop: '8%' }} disabled={(excel == null) || (!excel)} onClick={onDownload}><i className="table-right icon iconfont icon-export" />
                    批量导出
                  </Button>
                </Col>
              </Row>
            )}
          </Form>
        </div>
      </div>
    );
  }
}
DailyTravelSearch.prototypes = {
  loading: PropTypes.bool,
  enumList: PropTypes.array.isRequired,
  codeList: PropTypes.array.isRequired,
  queryobj: PropTypes.object,
  onSearch: PropTypes.func,
};
export default Form.create()(DailyTravelSearch);
