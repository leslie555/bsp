/**
 * Created by cherry on 2018/7/20.
 */
import React, { Children } from 'react';
import PropTypes from 'prop-types';
import { Form, Select, Row, Col, Button, AutoComplete, Input, DatePicker, Cascader, Radio } from 'antd';
import moment from 'moment';
import { ENUM_ILLEGAL, CARCOLOR, CARTYPE } from '../../../config/enums';
import 'antd/dist/antd.css';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
// const dayStartTime = moment().startOf('day');

// 不可选择未来日期
function disabledDate(current) {
  return current > moment();
}

function onOk(value) {
  console.log('onOk: ', value);
}
const { Option } = Select;
function renderOption(item) {
  return (
    <AutoComplete.Option key={item.deviceid} text={item.deviceid}>
      {item.deviceid}
      <br />
      <span style={{ fontWeight: 'bold' }}> {item.devicename}</span>
    </AutoComplete.Option>
  );
}
class Historysearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // expand: false,
      type: 'hour',
      startTime: moment().startOf('day'),
      endTime: moment().endOf('day'),
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.handleSubmit();
  }

  handleRadio = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      type: e.target.value,
    }, this.handleSubmit);
  }

  pickStartDate = (value, dateString) => {
    console.log('Formatted Selected Time: ', dateString);
    this.setState({
      startTime: moment(dateString),
    });
  }

  pickEndDate = (value, dateString) => {
    this.setState({ endTime: moment(dateString) });
  }

  // 查询设备列表
  handleSubmit() {
    const { form, onSearch } = this.props;
    const { type, startTime, endTime } = this.state;
    let payload;
    form.validateFieldsAndScroll((err, values) => {
      payload = { starttime: startTime, endtime: endTime, type, groupId: values.groupId };
      if (!err) {
        console.log(values);
        onSearch(payload);
      }
    });
  }

  // 获取枚举值
  handleEnumOption(enumsid) {
    const options = [];
    console.log(this.props);
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
    const { type, startTime, endTime } = this.state;
    const { title, treeData, form } = this.props;
    const { getFieldDecorator } = form;
    const h3Layout = {
      style: { padding: '1rem 0 0 1rem' },
    };
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      style: { height: '20px' },
    };

    return (
      <div className="outline-out outline-out-top">
        <div className="outline-inner">
          <h3 {...h3Layout}>{title}</h3>
          <RadioGroup onChange={this.handleRadio} value={type}>
            <Radio value="hour">小时</Radio>
            <Radio value="day">天</Radio>
          </RadioGroup>
          <Form className="form-outline-inner-padding">
            {type == 'hour' ?
              (
                <Row>
                  <Col span={6}>
                    <FormItem {...formItemLayout} label="开始时间">
                      {getFieldDecorator('startTime', {
                        initialValue: startTime,
                        rules: [{
                          required: true,
                          message: '请输入开始时间！',
                        }],
                      })(
                        <DatePicker
                          showTime={{ format: 'HH' }}
                          format="YYYY-MM-DD HH"
                          placeholder="Select Time"
                          onChange={this.pickStartDate}
                          onOk={onOk}
                          disabledDate={disabledDate}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem {...formItemLayout} label="结束时间">
                      {getFieldDecorator('endTime', {
                        initialValue: endTime,
                        rules: [{
                          required: true,
                          message: '请输入结束时间！',
                        }],
                      })(
                        <DatePicker
                          showTime={{ format: 'HH' }}
                          format="YYYY-MM-DD HH"
                          placeholder="Select Time"
                          onChange={this.pickEndDate}
                          onOk={onOk}
                          disabledDate={disabledDate}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem {...formItemLayout} label="所属分组">
                      {getFieldDecorator('groupId', {
                        initialValue: '',
                      })(
                        <Select
                          value={1}
                        >
                          {treeData}
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem style={{ textAlign: 'right' }}>
                      <Button type="primary" htmlType="submit" style={{ margin: '0 5px' }} onClick={() => this.handleSubmit('day')}>查询</Button>
                      <Button type="primary" style={{ margin: '0 3px' }} onClick={() => this.handleReload()}>重置</Button>
                    </FormItem>
                  </Col>
                </Row>
              )
              :
              (
                <Row>
                  <Col span={6}>
                    <FormItem {...formItemLayout} label="开始时间">
                      {getFieldDecorator('startTime', {
                        initialValue: startTime,
                        rules: [{
                          required: true,
                          message: '请输入开始时间！',
                        }],
                      })(
                        <DatePicker
                          onChange={this.pickStartDate}
                          format="YYYY-MM-DD"
                          style={{ width: '100%' }}
                          disabledDate={disabledDate}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem {...formItemLayout} label="结束时间">
                      {getFieldDecorator('endTime', {
                        initialValue: endTime,
                        rules: [{
                          required: true,
                          message: '请输入结束时间！',
                        }],
                      })(
                        <DatePicker
                          onChange={this.pickEndDate}
                          format="YYYY-MM-DD"
                          style={{ width: '100%' }}
                          disabledDate={disabledDate}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem {...formItemLayout} label="所属分组">
                      {getFieldDecorator('groupId', {
                        initialValue: '',
                      })(
                        <Select
                          value={1}
                        >
                          {treeData}
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem style={{ textAlign: 'right' }}>
                      <Button type="primary" htmlType="submit" style={{ margin: '0 5px' }} onClick={() => this.handleSubmit('month')}>查询</Button>
                      <Button type="primary" style={{ margin: '0 3px' }} onClick={() => this.handleReload()}>重置</Button>
                    </FormItem>
                  </Col>
                </Row>
              )
            }
          </Form>
        </div>
      </div>
    );
  }
}
Historysearch.prototypes = {
  loading: PropTypes.bool,
  enumList: PropTypes.array.isRequired,
  codeList: PropTypes.array.isRequired,
  queryobj: PropTypes.object,
  onSearch: PropTypes.func,
};
export default Form.create()(Historysearch);
