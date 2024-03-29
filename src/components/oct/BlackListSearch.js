/**
 * Created by cherry on 2018/7/20.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Select, Row, Col, Button, InputNumber, Input, DatePicker, Spin } from 'antd';
import moment from 'moment';
import { ENUM_ILLEGAL } from '../../config/enums';
import 'antd/dist/antd.css';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const FormItem = Form.Item;
const endTime = moment();
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

class BlackListSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.handleSubmit = this.handleSubmit.bind(this);
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
    const startTime = moment(`${moment().format('YYYY-MM-DD')} 00:00:00`);
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
    const { form, codeList } = this.props;
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
          <h3 {...h3Layout}>黑名单管理</h3>
          <Form className="form-outline-inner-padding">
            <Row>
              <Col span={4}>
                <FormItem {...formItemLayout} label="车牌号">
                  {getFieldDecorator('devicepos', {
                    initialValue: '',
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col span={5}>
                <FormItem {...formItemLayout} label="黑名单类型">
                  {getFieldDecorator('illegalType', {
                    initialValue: '',
                  })(<Select />)}
                </FormItem>
              </Col>
              <Col span={5}>
                <FormItem {...formItemLayout} label="开始">
                  {getFieldDecorator('starttime', {
                    initialValue: startTime,
                    rules: [{
                      required: true,
                      message: '请输入开始时间！',
                    }],
                  })(<DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="Select Time"
                    onChange={onChange}
                    onOk={onOk}
                  />
                  )}
                </FormItem>
              </Col>
              <Col span={5}>
                <FormItem {...formItemLayout} label="结束">
                  {getFieldDecorator('endtime', {
                    initialValue: endTime,
                    rules: [{
                      required: true,
                      message: '请输入结束时间！',
                    }],
                  })(<DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    onChange={onChange}
                    onOk={onOk}
                    disabledDate={disabledDate}
                  />
                  )}
                </FormItem>
              </Col>
              {/* <Col span={7}>
                <FormItem {...formItemLayout} label="创建时间">
                  {getFieldDecorator('startime', {
                    initialValue: startTime,
                  })(<DatePicker
                    showTime
                    format="YYYY-MM-DD"
                  />
                  )}
                </FormItem>
              </Col> */}
              <Col span={3} offset={0}>
                <FormItem style={{ textAlign: 'right' }}>
                  <Button type="primary" htmlType="submit" style={{ margin: '0 5px' }} onClick={() => this.handleSubmit()}>
                    查询
                  </Button>
                  <Button type="primary" style={{ margin: '0 3px' }} onClick={() => this.handleReload()}>重置</Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}
BlackListSearch.prototypes = {
  loading: PropTypes.bool,
  enumList: PropTypes.array.isRequired,
  codeList: PropTypes.array.isRequired,
  queryobj: PropTypes.object,
  onSearch: PropTypes.func,
};
export default Form.create()(BlackListSearch);
