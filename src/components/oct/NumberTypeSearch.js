/**
 * Created by cherry on 2018/7/20.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Select, Row, Col, Button, Input, DatePicker, Cascader, TreeSelect, AutoComplete } from 'antd';
import moment from 'moment';
import HiatmpAuthorized from '../Authorized/HiatmpAuthorized';
import { QUERYDEPT, RESETDEPT } from '../../config/authconstant';
import { NUMBERTYPE } from '../../config/enums';

const FormItem = Form.Item;
// 不可选择未来日期
function disabledDate(current) {
  return current > moment();
}
const options = [{
  value: '天府新区',
  label: '天府新区',
  children: [{
    value: '天府一街',
    label: '天府一街',
  }, {
    value: '天府二街',
    label: '天府二街',
  }, {
    value: '天府三街',
    label: '天府三街',
  }],
}, {
  value: '人民南路',
  label: '人民南路',
  children: [{
    value: '人民路南一段',
    label: '人民路南二段',
  }],
}];

function onChange(value, dateString) {
  console.log('Selected Time: ', value);
  console.log('Formatted Selected Time: ', dateString);
}

function onOk(value) {
  console.log('onOk: ', value);
}
const endTime = moment();
const { Option } = Select;
const { RangePicker } = DatePicker;

function renderOption(item) {
  return (
    <AutoComplete.Option key={item.deviceid} text={item.deviceid}>
      {item.deviceid}
      <br />
      <span style={{ fontWeight: 'bold' }}> {item.devicename}</span>
    </AutoComplete.Option>
  );
}

class NumberTypeSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      luduanValue: undefined,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.handleSubmit();
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

  // 获取枚举值
  handleEnumOption(enumsid) {
    // const options = [];
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
    const startTime = moment(`${moment().add(-1, 'hour').format('YYYY/MM/DD HH:00:00')}`);
    // const startTime = moment(`${moment().format('YYYY-MM-DD')} 00:00:00`);
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
    const { form, codeList, treeData, dataSource, handleSearch } = this.props;
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
          <h3 {...h3Layout}>号牌分类查询</h3>
          <Form className="form-outline-inner-padding">
            <Row>
              <Col span={6}>
                <FormItem {...formItemLayout} label="所属路段">
                  {getFieldDecorator('forroad', {
                    initialValue: '',
                  })(
                    <TreeSelect
                      // style={{ width: 200 }}
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
                  })(<AutoComplete
                    dataSource={dataSource.map(renderOption)}
                    // style={{ width: 160 }}
                    // onSelect={onSelect}
                    onSearch={handleSearch}
                    placeholder="请输入设备编号"
                    optionLabelProp="text"
                  />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label="开始时间">
                  {getFieldDecorator('starttime', {
                    initialValue: startTime,
                    rules: [{
                      required: true,
                      message: '请输入开始时间！',
                    }],
                  })(<DatePicker
                    style={{ width: '100%' }}
                    showTime
                    format="YYYY-MM-DD HH:00:00"
                    placeholder="Select Time"
                    onChange={onChange}
                    onOk={onOk}
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
                      message: '请输入结束时间',
                    }],
                  })(<DatePicker
                    style={{ width: '100%' }}
                    showTime
                    format="YYYY-MM-DD HH:00:00"
                    onChange={onChange}
                    onOk={onOk}
                    disabledDate={disabledDate}
                  />
                  )}
                </FormItem>
              </Col>
              <Col span={24} offset={0}>
                <FormItem style={{ textAlign: 'right' }}>
                  <HiatmpAuthorized {...authorizedProps} code={QUERYDEPT}>
                    <Button type="primary" htmlType="submit" style={{ margin: '0 5px' }} onClick={() => this.handleSubmit()}>查询</Button>
                    <Button type="primary" style={{ margin: '0 3px' }} onClick={() => this.handleReload()}>重置</Button>
                  </HiatmpAuthorized>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}
NumberTypeSearch.prototypes = {
  loading: PropTypes.bool,
  enumList: PropTypes.array.isRequired,
  codeList: PropTypes.array.isRequired,
  queryobj: PropTypes.object,
  onSearch: PropTypes.func,
};
export default Form.create()(NumberTypeSearch);
