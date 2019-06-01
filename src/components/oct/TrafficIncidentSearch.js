/**
 * Created by cherry on 2018/7/20.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Select, Row, Col, Button, AutoComplete, Input, DatePicker, TreeSelect } from 'antd';
import moment from 'moment';
import { TRAFFIC } from '../../config/enums';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
// 不可选择未来日期
function disabledDate(current) {
  return current > moment();
}
const { Option } = Select;
const endTime = moment();
function renderOption(item) {
  return (
    <AutoComplete.Option key={item.deviceid} text={item.deviceid}>
      {item.deviceid}
      <br />
      <span style={{ fontWeight: 'bold' }}> {item.devicename}</span>
    </AutoComplete.Option>
  );
}

function onChange(value, dateString) {
  console.log('Selected Time: ', value);
  console.log('Formatted Selected Time: ', dateString);
}

function onOk(value) {
  console.log('onOk: ', value);
}
class TrafficIncidentSearch extends React.Component {
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

  // 重置搜索框
  handleReload() {
    const { form } = this.props;
    form.resetFields();
  }

  render() {
    const { dataSource, handleSearch, excel, onDownload, treeData } = this.props;
    const { luduanValue } = this.state;
    const dateFormat = 'YYYY/MM/DD';
    const startTime = moment(`${moment().add(-15, 'minutes').format('YYYY/MM/DD HH:mm:ss')}`);
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
          <h3 {...h3Layout}>交通事件查询</h3>
          <Form className="form-outline-inner-padding">
            <Row>
              <Col span={6}>
                <FormItem {...formItemLayout} label="所属路段">
                  {getFieldDecorator('forroad', {
                    initialValue: '',
                    // rules: [{
                    //   pattern: reg,
                    //   message: '请输入数字！',
                    // }],
                  })(
                    <TreeSelect
                      // style={{ width: 300 }}
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
                  {getFieldDecorator('deviceID', {
                    initialValue: '',
                    // rules: [{
                    //   pattern: reg,
                    //   message: '请输入数字！',
                    // }],
                  })(
                  // <AutoComplete
                  //   dataSource={dataSource.map(renderOption)}
                  //   // style={{ width: 160 }}
                  //   // onSelect={onSelect}
                  //   onSearch={handleSearch}
                  //   placeholder="请输入设备编号"
                  //   optionLabelProp="text"
                  // />
                    <Input placeholder="请输入设备编号" />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label="车道编号">
                  {getFieldDecorator('laneno', {
                    initialValue: '',
                  })(
                    <Select
                      value={1}
                      // size="small"
                      // onSelect={value => this.changeSetting('grid', value)}
                      // style={{ width: 140 }}
                    >
                      <Select.Option value="">全部</Select.Option>
                      <Select.Option value="0">0车道</Select.Option>
                      <Select.Option value="1">1车道</Select.Option>
                      <Select.Option value="2">2车道</Select.Option>
                      <Select.Option value="3">3车道</Select.Option>
                      <Select.Option value="4">4车道</Select.Option>
                      <Select.Option value="5">5车道</Select.Option>
                      <Select.Option value="6">6车道</Select.Option>
                      <Select.Option value="7">7车道</Select.Option>
                      <Select.Option value="8">8车道</Select.Option>
                      <Select.Option value="9">9车道</Select.Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <FormItem {...formItemLayout} label="开始时间">
                  {getFieldDecorator('starttime', {
                    initialValue: startTime,
                    rules: [{
                      required: true,
                      message: '请输入结束时间！',
                    }],
                  })(<DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="Select Time"
                    style={{ width: '100%' }}
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
                <FormItem {...formItemLayout} label="事件类型">
                  {getFieldDecorator('eventType', {
                    initialValue: '',
                  })(<Select>{this.handleEnumOption(TRAFFIC)}</Select>)}
                </FormItem>
              </Col>
              <Col span={6}>
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
TrafficIncidentSearch.prototypes = {
  loading: PropTypes.bool,
  enumList: PropTypes.array.isRequired,
  codeList: PropTypes.array.isRequired,
  queryobj: PropTypes.object,
  onSearch: PropTypes.func,
};
export default Form.create()(TrafficIncidentSearch);
