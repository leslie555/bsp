/**
 * Created by cherry on 2018/7/20.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Select, Row, Col, Button, AutoComplete, DatePicker, Cascader, TreeSelect, Input } from 'antd';
import moment from 'moment';
import { QUERYDEPT, RESETDEPT } from '../../config/authconstant';

const FormItem = Form.Item;
const { Option } = Select;
const endTime = moment();

// 不可选择未来日期
function disabledDate(current) {
  return current > moment();
}

function onSelect(value) {
  // console.log('onSelect', value);
  // 3050-285016  元华高架路GAK3+950
  // const realValue = value.split('  ')[0];
  // console.log(realValue);
}
function onChange(value, dateString) {
  console.log('Selected Time: ', value);
  console.log('Formatted Selected Time: ', dateString);
}

function onOk(value) {
  console.log('onOk: ', value);
}

function renderOption(item) {
  return (
    <AutoComplete.Option key={item.deviceid} text={item.deviceid}>
      {item.deviceid}
      <br />
      <span style={{ fontWeight: 'bold', whiteSpace: 'pre-line', wordBreak: 'break-all' }}> {item.devicename}</span>
    </AutoComplete.Option>
  );
}

class QueryOriginalSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      luduanValue: undefined,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onChange = (value) => {
    console.log(value);
    this.setState({ luduanValue: value });
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

  // 重置搜索框
  handleReload() {
    const { form } = this.props;
    form.resetFields();
  }

  render() {
    const { dataSource, handleSearch } = this.props;
    const { MonthPicker, RangePicker } = DatePicker;
    const dateFormat = 'YYYY/MM/DD';
    const datetime = 'YYYY/MM/DD';
    const startTimea = moment(`${moment().add(-15, 'minutes').format('YYYY/MM/DD HH:mm:00')}`);
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      style: { height: '20px' },
    };
    const formItemroad = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      style: { height: '20px' },
    };
    const formItemLayoutSel = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      style: { height: '20px' },
    };
    const h3Layout = {
      style: { padding: '1rem 0 0 1rem' },
    };
    const { form, codeList, treeData } = this.props;
    const { luduanValue } = this.state;
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
          <h3 {...h3Layout}>交通原始数据查询</h3>
          <Form className="form-outline-inner-padding">
            <Row>
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
              <Col span={6}>
                <FormItem {...formItemLayout} label="设备编号">
                  {getFieldDecorator('deviceid', {
                    initialValue: '',
                    // rules: [{
                    //   pattern: reg,
                    //   message: '请输入数字！',
                    // }],
                  })(
                  // <AutoComplete
                  //   dataSource={dataSource.map(renderOption)}
                  //   // style={{ width: 160 }}
                  //   onSelect={onSelect}
                  //   onSearch={handleSearch}
                  //   placeholder="请输入设备编号"
                  //   optionLabelProp="text"
                  // />
                    <Input placeholder="请输入设备编号" />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label="车道分组">
                  {getFieldDecorator('laneNo', {
                    initialValue: '',
                  })(
                    <Select>
                      <Option value="">全部</Option>
                      <Option value="0">0车道</Option>
                      <Option value="1">1车道</Option>
                      <Option value="2">2车道</Option>
                      <Option value="3">3车道</Option>
                      <Option value="4">4车道</Option>
                      <Option value="5">5车道</Option>
                      <Option value="6">6车道</Option>
                      <Option value="7">7车道</Option>
                      <Option value="8">8车道</Option>
                      <Option value="9">9车道</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label="开始时间">
                  {getFieldDecorator('starttime', {
                    initialValue: startTimea,
                    rules: [{
                      required: true,
                      message: '请输入开始时间！',
                    }],
                  })(<DatePicker
                    showTime
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="Select Time"
                    onChange={onChange}
                    onOk={onOk}
                  />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <FormItem {...formItemLayout} label="结束时间">
                  {getFieldDecorator('endtime', {
                    initialValue: endTime,
                    rules: [{
                      required: true,
                      message: '请输入结束时间！',
                    }],
                  })(<DatePicker
                    style={{ width: '100%' }}
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    onChange={onChange}
                    onOk={onOk}
                    disabledDate={disabledDate}
                  />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label="采集周期">
                  {getFieldDecorator('range', {
                    initialValue: '1',
                  })(
                    <Select>
                      <Option value="1">1分钟</Option>
                      <Option value="5">5分钟</Option>
                      <Option value="30">30分钟</Option>
                      <Option value="60">60分钟</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem style={{ textAlign: 'right' }}>
                  <Button type="primary" htmlType="submit" style={{ margin: '0 5px' }} onClick={() => this.handleSubmit()}>查询</Button>
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
QueryOriginalSearch.prototypes = {
  loading: PropTypes.bool,
  enumList: PropTypes.array.isRequired,
  codeList: PropTypes.array.isRequired,
  queryobj: PropTypes.object,
  onSearch: PropTypes.func,
};
export default Form.create()(QueryOriginalSearch);
