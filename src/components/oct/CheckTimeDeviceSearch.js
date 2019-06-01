/**
 * Created by cherry on 2018/7/20.
 */
import React from 'react';
import PropTypes from 'prop-types';
// import DatePicker, { registerLocale } from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import zhCN from 'date-fns/locale/zh-CN';
import moment from 'moment';
import { Form, Row, Col, Button, Input, Select, Icon, TreeSelect, AutoComplete, DatePicker } from 'antd';
import HiatmpAuthorized from '../Authorized/HiatmpAuthorized';
import { OCT_DEVICE_MANAGEMENT } from '../../config/authconstant';
import { TRAFFIC, SSXM, MAINTENAN_UNIT, SGDW } from '../../config/enums';

const FormItem = Form.Item;
const { Option } = Select;
const endtime = moment();
const starttime = moment().subtract(1, 'days');
// registerLocale('zh-CN', zhCN);
// 不可选择未来日期
function disabledDate(current) {
  return current > moment();
}

class DepartmentSearch extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      // this.handleEnumOption = this.handleEnumOption.bind(this);
    };
  }

  componentDidMount() {
    this.handleSubmit();
  }

  cleardeviceid = () => {
    const { form } = this.props;
    form.setFieldsValue({ deviceid: '' });
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

  // 重置搜索框
  handleReload() {
    const { form } = this.props;
    form.resetFields();
  }

  // 查询设备列表
  handleSubmit() {
    const { form, onSearch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        onSearch(values);
        // console.log('values', values);
      }
    });
  }

  render() {
    const { form, codeList, handleStartChange, handleEndChange } = this.props;
    const noMatch = '';
    const authorizedProps = {
      codeList,
      noMatch,
    };
    const { getFieldDecorator } = form;
    const suffixdeviceid = <Icon type="close-circle" onClick={this.cleardeviceid} />;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      style: { height: '20px' },
    };
    const h3Layout = {
      style: { padding: '1rem 0 0 1rem' },
    };
    const formItemLayoutSel = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      style: { height: '20px' },
    };
    const reg = new RegExp('^[0-9]*$');
    return (
      <div className="outline-out outline-out-top">
        <div className="outline-inner">
          <h3 {...h3Layout}>设备校时</h3>
          <Form className="form-outline-inner-padding">
            <Row gutter={24}>
              <Col span={8}>
                <FormItem {...formItemLayout} label="开始时间">
                  {getFieldDecorator('startTime', {
                    initialValue: '',
                  })(
                    <DatePicker
                      format="YYYY-MM-DD HH:mm:ss"
                      showTime
                      style={{ width: '100%' }}
                      placeholder="请选择开始时间"
                      // onChange={onChange}
                      // onOk={onOk}
                      disabledDate={disabledDate}
                    />
                    // <DatePicker
                    //   selected={starttime}
                    //   onChange={handleStartChange}
                    //   showTimeSelect
                    //   isClearable
                    //   timeCaption="Time"
                    //   locale="zh-CN"
                    //   placeholderText="请选择时间"
                    //   timeFormat="HH:mm"
                    //   timeIntervals={15}
                    //   dateFormat="yyyy-MM-dd HH:mm"
                    //   className="antdInput"
                    // />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout} label="结束时间">
                  {getFieldDecorator('endTime', {
                    initialValue: '',
                  })(
                    <DatePicker
                      format="YYYY-MM-DD HH:mm:ss"
                      style={{ width: '100%' }}
                      showTime
                      placeholder="请选择结束时间"
                      // onChange={onChange}
                      // onOk={onOk}
                      disabledDate={disabledDate}
                    />
                    // <DatePicker
                    //   selected={endtime}
                    //   onChange={handleEndChange}
                    //   showTimeSelect
                    //   isClearable
                    //   timeCaption="Time"
                    //   locale="zh-CN"
                    //   placeholderText="请选择时间"
                    //   timeFormat="HH:mm"
                    //   timeIntervals={15}
                    //   dateFormat="yyyy-MM-dd HH:mm"
                    //   className="antdInput"
                    // />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout} label="项目名称">
                  {getFieldDecorator('projectid', {
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
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                <FormItem {...formItemLayout} label="设备编号">
                  {getFieldDecorator('deviceid', {
                    initialValue: '',
                    // rules: [{
                    //   pattern: reg,
                    //   message: '请输入数字！',
                    // }],
                  })(<Input maxLength="12" suffix={suffixdeviceid} />)
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout} label="校时状态">
                  {getFieldDecorator('type', {
                    initialValue: '',
                  })(
                    <Select style={{ width: '100%' }}>
                      <Option value="无需校时">无需校时</Option>
                      <Option value="需要校时">需要校时</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem style={{ textAlign: 'right' }}>
                  <HiatmpAuthorized {...authorizedProps} code={OCT_DEVICE_MANAGEMENT}>
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
DepartmentSearch.prototypes = {
  loading: PropTypes.bool,
  enumList: PropTypes.array.isRequired,
  codeList: PropTypes.array.isRequired,
  queryobj: PropTypes.object,
  onSearch: PropTypes.func,
};
export default Form.create()(DepartmentSearch);
