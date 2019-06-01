/**
 * Created by cherry on 2018/7/20.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Select, Row, Col, Button, AutoComplete, Icon, Input, DatePicker, TreeSelect } from 'antd';
import moment from 'moment';
import { CARTYPE, NUMCOLOR, CARCOLOR, CARMARK, CAR_C } from '../../config/enums';
import { QUERYDEPT, RESETDEPT } from '../../config/authconstant';
import { TIME } from '../../config/constant';

const FormItem = Form.Item;
const endTime = moment();
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
class CarRecordSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: false,
      luduanValue: undefined,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onChange = (value) => {
    console.log(value);
    this.setState({ luduanValue: value });
  }

  getFields() {
    const children = [];
    const { luduanValue, expand } = this.state;
    const { dataSource, handleSearch, excel, onDownload, treeData } = this.props;
    const { MontstartTimehPicker, RangePicker } = DatePicker;
    // const startTime = moment(`${moment().format('YYYY-MM-DD')} `);
    const startTime = moment(`${moment().add(-5, 'minutes')}`);
    // const startTime = moment().subtract(10, 'minutes');
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
      labelCol: { span: 12 },
      wrapperCol: { span: 12 },
      style: { height: '20px' },
    };
    const { form, codeList, devicelist, groupinfo } = this.props;
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
          {getFieldDecorator('startTime', {
            initialValue: startTime,
            rules: [{
              required: true,
              message: '请输入开始时间！',
            }],
          })(<DatePicker
            showTime
            style={{ width: '100%' }}
            maxLength="12"
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="Select Time"
            onChange={onChange}
            onOk={onOk}
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
            style={{ width: '100%' }}
            maxLength="12"
            format="YYYY-MM-DD HH:mm:ss"
            onChange={onChange}
            onOk={onOk}
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
    );
    children.push(
      <Col span={6}>
        <FormItem {...formItemLayout} label="设备编号">
          {getFieldDecorator('deviceID', {
            initialValue: '',
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
    );
    if (expand) {
      children.push(
        <Col span={6}>
          <FormItem {...formItemLayout} label="车道编号">
            {getFieldDecorator('lane_no', {
              initialValue: '',
            })(
              <Select value={1}>
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
      );
      children.push(
        <Col span={6}>
          <FormItem {...formItemLayout} label="车牌号码">
            {getFieldDecorator('plate', {
              initialValue: '',
            })(<Input maxLength="12" />)}
          </FormItem>
        </Col>
      );
      children.push(
        <Col span={6}>
          <FormItem {...formItemLayout} label="车辆类型">
            {getFieldDecorator('carType', {
              initialValue: '',
            })(<Select>{this.handleEnumOption(CARTYPE)}</Select>)}
          </FormItem>
        </Col>
      );
      // children.push(
      //   <Col span={6}>
      //     <FormItem {...formItemLayout} label="车辆种类">
      //       {getFieldDecorator('carClass', {
      //         initialValue: '',
      //       })(<Select>{this.handleEnumOption(CAR_C)}</Select>)}
      //     </FormItem>
      //   </Col>
      // );
      children.push(
        <Col span={6}>
          <FormItem {...formItemLayout} label="车辆颜色">
            {getFieldDecorator('carcolor', {
              initialValue: '',
            })(<Select>{this.handleEnumOption(CARCOLOR)}</Select>)}
          </FormItem>
        </Col>
      );
      children.push(
        <Col span={6}>
          <FormItem {...formItemLayout} label="车牌颜色">
            {getFieldDecorator('ori_plate_color', {
              initialValue: '',
            })(<Select>{this.handleEnumOption(NUMCOLOR)}</Select>)}
          </FormItem>
        </Col>
      );
      // children.push(
      //   <Col span={6}>
      //     <FormItem {...formItemLayout} label="车辆标志">
      //       {getFieldDecorator('carmark', {
      //         initialValue: '',
      //       })(<Select>{this.handleEnumOption(CARMARK)}</Select>)}
      //     </FormItem>
      //   </Col>
      // );
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

  // 重置搜索框
  handleReload() {
    const { form } = this.props;
    form.resetFields();
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

  render() {
    const { expand } = this.state;
    const h3Layout = {
      style: { padding: '1rem 0 0 1rem' },
    };
    return (
      <div className="outline-out outline-out-top">
        <div className="outline-inner">
          <h3 {...h3Layout}>过车记录查询</h3>
          <Form className="form-outline-inner-padding">
            <Row gutter={24}>{this.getFields()}</Row>
            <Row>
              <Col span={22}>
                <FormItem style={{ textAlign: 'right' }}>
                  <Button type="primary" htmlType="submit" style={{ margin: '0 5px' }} onClick={() => this.handleSubmit()}>查询</Button>
                  <Button type="primary" style={{ margin: '0 3px' }} onClick={() => this.handleReload()}>重置</Button>
                  <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>{expand ? '更少' : '更多'} <Icon type={expand ? 'up' : 'down'} />
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
CarRecordSearch.prototypes = {
  loading: PropTypes.bool,
  enumList: PropTypes.array.isRequired,
  codeList: PropTypes.array.isRequired,
  queryobj: PropTypes.object,
  onSearch: PropTypes.func,
  devicelist: PropTypes.array,
  groupinfo: PropTypes.object,
};
export default Form.create()(CarRecordSearch);
