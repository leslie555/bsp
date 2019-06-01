import React from 'react';
import PropTypes from 'prop-types';
import { Form, Select, Row, Col, Button, AutoComplete, Input, DatePicker, TreeSelect } from 'antd';
import moment from 'moment';
import { TRAFFIC, SSXM, MAINTENAN_UNIT, SGDW } from '../../config/enums';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
// 不可选择未来日期
function disabledDate(current) {
  return current > moment();
}
const { Option } = Select;
const endtime = moment();
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
class CollectionReportSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deviceValue: undefined,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.handleSubmit();
  }

  onChange = (value) => {
    console.log(value);
    this.setState({ deviceValue: value });
  }

  // 获取枚举值
  handleEnumOption(enumsid, Company, istrue) {
    const options = [];
    const { enumList } = this.props;
    if (enumsid) {
      if (Company != '维护单位') {
        options.push(<Option value="">全部类型</Option>);
      }
      if (Company == '施工单位') {
        for (let i = 0; i < enumList.length; i += 1) {
          if (enumList[i].enumtypeid === (enumsid || '')) {
            options.push(<Option key={`enuma-${enumList[i].enumvalue}`} value={enumList[i].enumvalue}>{enumList[i].enumname}(施工)</Option>);
          }
        }
        return options;
      } else if (Company == '维护单位') {
        for (let i = 0; i < enumList.length; i += 1) {
          if (enumList[i].enumtypeid === (enumsid || '')) {
            options.push(<Option key={`enuma-${enumList[i].enumvalue}`} value={enumList[i].enumvalue}>{enumList[i].enumname}(维护)</Option>);
          }
        }
        return options;
      } else {
        for (let i = 0; i < enumList.length; i += 1) {
          if (enumList[i].enumtypeid === (enumsid || '')) {
            options.push(<Option key={`enuma-${enumList[i].enumvalue}`} value={enumList[i].enumvalue}>{enumList[i].enumname}</Option>);
          }
        }
        return options;
      }
    }
  }

  // 查询
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
    const { dataSource, handleSearch, excel, onDownload, Data } = this.props;
    const { deviceValue } = this.state;
    const dateFormat = 'YYYY/MM/DD';
    const starttime = moment(`${moment().add(-1, 'days').format('YYYY/MM/DD')}`);
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
          <h3 {...h3Layout}>采集设备质量检测报告</h3>
          <Form className="form-outline-inner-padding">
            <Row>
              <Col span={6}>
                <FormItem {...formItemLayout} label="项目名称">
                  {getFieldDecorator('project_id', {
                    initialValue: '',
                  })(
                    <Select
                      value={1}
                    >
                      {this.handleEnumOption(SSXM)}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label="单位名称">
                  {getFieldDecorator('company_id', {
                    initialValue: '',
                  })(
                    <Select
                      value={1}
                    >
                      {this.handleEnumOption(SGDW, '施工单位', true)}
                      {this.handleEnumOption(MAINTENAN_UNIT, '维护单位', true)}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label="检测开始日期">
                  {getFieldDecorator('startTime', {
                    initialValue: starttime,
                    // rules: [{
                    //   required: true,
                    //   message: '请输入开始时间！',
                    // }],
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
            </Row>
            <Row>
              <Col span={6}>
                <FormItem {...formItemLayout} label="设备编号">
                  {getFieldDecorator('deviceId', {
                    initialValue: '',
                  })(
                    <Input placeholder="请输入设备编号" />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label="设备分组">
                  {getFieldDecorator('deviceGroupId', {
                    initialValue: '',
                  })(
                    <Select
                      value={1}
                    >
                      {Data}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label="检测结束日期">
                  {getFieldDecorator('endTime', {
                    initialValue: endtime,
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
              <Col span={5}>
                <FormItem style={{ textAlign: 'center' }}>
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
CollectionReportSearch.prototypes = {
  loading: PropTypes.bool,
  enumList: PropTypes.array.isRequired,
  codeList: PropTypes.array.isRequired,
  queryobj: PropTypes.object,
  onSearch: PropTypes.func,
};
export default Form.create()(CollectionReportSearch);
