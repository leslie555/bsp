/**
 * Created by cherry on 2018/7/20.
 */
import React, { Children } from 'react';
import PropTypes from 'prop-types';
import { Form, Select, Row, Col, Button, AutoComplete, Input, DatePicker, TreeSelect, Cascader, Icon } from 'antd';
import moment from 'moment';
import { ENUM_ILLEGAL, CARCOLOR, CARTYPE } from '../../config/enums';
import 'antd/dist/antd.css';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const FormItem = Form.Item;
const endTime = moment();

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
class BreakOriginalSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: false,
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

  getFields() {
    const { dataSource, handleSearch, treeData } = this.props;
    const { expand, luduanValue } = this.state;
    const children = [];
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
    const { form, codeList } = this.props;
    const { getFieldDecorator } = form;
    const noMatch = '';
    const authorizedProps = {
      codeList,
      noMatch,
    };
    const reg = new RegExp('^[0-9]*$');
    children.push(
      <Col span={6}>
        <FormItem {...formItemLayout} label="开始时间">
          {getFieldDecorator('starttime', {
            initialValue: startTime,
            rules: [{
              required: true,
              message: '请输入开始时间！',
            }],
          })(<DatePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            onChange={onChange}
            style={{ width: '100%' }}
            onOk={onOk}
            disabledDate={disabledDate}
          />
          )}
        </FormItem>
      </Col>
    );
    children.push(
      <Col span={6}>
        <FormItem {...formItemLayout} label="结束时间">
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
            style={{ width: '100%' }}
            disabledDate={disabledDate}
          />
          )}
        </FormItem>
      </Col>
    );
    children.push(
      <Col span={6}>
        <FormItem {...formItemLayout} label="所属路段">
          {getFieldDecorator('forroad', {
            initialValue: luduanValue,
          })(
            <TreeSelect
              // style={{ width: 200 }}
              // value={}
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
        <FormItem {...formItemLayout} label="设备编号">
          {getFieldDecorator('deviceid', {
            initialValue: '',
          })(
            <Input placeholder="请输入设备编号" />
          )}
        </FormItem>
      </Col>
    );
    if (expand) {
      children.push(
        <Col span={6}>
          <FormItem {...formItemLayout} label="车道编号">
            {getFieldDecorator('laneno', {
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
      );
      children.push(
        <Col span={6}>
          <FormItem {...formItemLayout} label="车牌号码">
            {getFieldDecorator('plateNo', {
              initialValue: '',
              // rules: [{
              //   pattern: reg,
              //   message: '请输入数字！',
              // }],
            })(<Input style={{ width: '100%' }} />)}
          </FormItem>
        </Col>
      );
      // children.push(
      //   <Col span={6}>
      //     <FormItem {...formItemLayout} label="车辆颜色">
      //       {getFieldDecorator('vehicleColor', {
      //         initialValue: '',
      //       })(<Select style={{ width: '100%' }}>{this.handleEnumOption(CARCOLOR)}</Select>)}
      //     </FormItem>
      //   </Col>
      // );
      // children.push(
      //   <Col span={6}>
      //     <FormItem {...formItemLayout} label="车辆种类">
      //       {getFieldDecorator('vehicleType', {
      //         initialValue: '',
      //       })(<Select style={{ width: '100%' }}>{this.handleEnumOption(CARTYPE)}</Select>)}
      //     </FormItem>
      //   </Col>
      // );
      children.push(
        <Col span={6}>
          <FormItem {...formItemLayout} label="违法类型">
            {getFieldDecorator('illegalType', {
              initialValue: '',
            })(<Select>{this.handleEnumOption(ENUM_ILLEGAL)}</Select>)}
          </FormItem>
        </Col>
      );
      children.push(
        <Col span={6}>
          <FormItem {...formItemLayout} label="设备位置">
            {getFieldDecorator('installaddress', {
              initialValue: '',
            })(<Input style={{ width: '100%' }} />)}
          </FormItem>
        </Col>
      );
    }
    return children;
  }

  // 更多查询条件
  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
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

  // 重置搜索框setFieldsValue
  handleReload() {
    const { form } = this.props;
    form.setFieldsValue({
      starttime: moment(`${moment().add(-15, 'minutes').format('YYYY/MM/DD HH:mm:ss')}`),
      endtime: moment(),
    });
  }

  render() {
    const h3Layout = {
      style: { padding: '1rem 0 0 1rem' },
    };
    const { expand } = this.state;
    return (
      <div className="outline-out outline-out-top">
        <div className="outline-inner">
          <h3 {...h3Layout}>涉嫌违法数据查询</h3>
          <Form className="form-outline-inner-padding">
            <Row gutter={24}>{this.getFields()}</Row>
            <Row>
              <Col span={24}>
                <FormItem style={{ textAlign: 'right' }}>
                  <Button type="primary" htmlType="submit" style={{ margin: '0 5px' }} onClick={() => this.handleSubmit()}>
                    查询
                  </Button>
                  <Button type="primary" style={{ margin: '0 3px' }} onClick={() => this.handleReload()}>重置</Button>
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
BreakOriginalSearch.prototypes = {
  loading: PropTypes.bool,
  enumList: PropTypes.array.isRequired,
  codeList: PropTypes.array.isRequired,
  queryobj: PropTypes.object,
  onSearch: PropTypes.func,
};
export default Form.create()(BreakOriginalSearch);
