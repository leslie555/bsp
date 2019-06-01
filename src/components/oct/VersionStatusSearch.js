/**
 * Created by cherry on 2018/7/20.
 */
import React, { Children } from 'react';
import PropTypes from 'prop-types';
import { Form, Select, Row, Col, Button, AutoComplete, Input, DatePicker, Cascader, Radio } from 'antd';
import moment from 'moment';
import 'antd/dist/antd.css';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

// 不可选择未来日期
function disabledDate(current) {
  console.log(current);
  return current > moment().endOf('day');
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
class VersionStatusSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: moment().startOf('day').add('-1'),
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
    this.setState({
      startTime: moment(dateString),
    });
  }

  pickEndDate = (value, dateString) => {
    this.setState({ endTime: moment(dateString) });
  }

  // 查询设备列表
  handleSubmit() {
    console.log('handleSubmit');
    const { form, onSearch, oldip } = this.props;
    const { type, startTime, endTime } = this.state;
    let payload;
    form.validateFieldsAndScroll((err, values) => {
      console.log('form.validateFieldsAndScroll');
      payload = { starttime: startTime, endtime: endTime, interfaceId: oldip };
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
    console.log(startTime);
    const { title, treeData, form } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      style: { height: '20px' },
    };

    return (
      <div className="outline-out outline-out-top">
        <div className="outline-inner">
          <Form className="form-outline-inner-padding">
            <Row>
              <Col span={8}>
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
              <Col span={8}>
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
              <Col span={8}>
                <FormItem style={{ textAlign: 'right' }}>
                  <Button type="primary" htmlType="submit" style={{ margin: '0 5px' }} onClick={() => this.handleSubmit()}>查询</Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}
VersionStatusSearch.prototypes = {
  loading: PropTypes.bool,
  enumList: PropTypes.array.isRequired,
  codeList: PropTypes.array.isRequired,
  queryobj: PropTypes.object,
  onSearch: PropTypes.func,
};
export default Form.create()(VersionStatusSearch);
