/**
 * Created by cherry on 2018/7/10.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Button, Input, Select, DatePicker, message } from 'antd';
import moment from 'moment';
import { LOGTYPE } from '../../config/enums';
import { YEARANDTIME } from '../../config/constant';
import HiatmpAuthorized from '../Authorized/HiatmpAuthorized';
import { QUERYLOG } from '../../config/authconstant';

const FormItem = Form.Item;
const { Option } = Select;
// 不可选择未来日期
function disabledDate(current) {
  return current > moment();
}
const endTime = moment();
class LogSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleGenEnumOption = this.handleGenEnumOption.bind(this);
  }

  // 获取一级菜单作为功能模块
  getAllFirstMenus() {
    const { menus } = this.props;
    const options = [];
    options.push(<Option key="-1" value="-1">全部</Option>);
    for (let i = 0; i < menus.length; i += 1) {
      const menu = menus[i];
      options.push(<Option key={menu.id} value={menu.id}>{menu.name}</Option>);
    }
    return options;
  }

  // 获取枚举值
  handleGenEnumOption(enumsid) {
    const options = [];
    const { enumList } = this.props;
    options.push(<Option key="-1" value="-1">全部</Option>);
    for (let i = 0; i < enumList.length; i += 1) {
      if (enumList[i].enumtypeid === (enumsid || '')) {
        options.push(<Option key={`enuma-${enumList[i].enumvalue}`} value={enumList[i].enumvalue}>{enumList[i].enumname}</Option>);
      }
    }
    return options;
  }

  // 查询日志信息
  handleSubmit() {
    const { form, onSearch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (values.starttime.isAfter(values.endtime)) {
          message.warn('开始时间不能晚于结束时间');
        }
        const starttime = values.starttime.format(YEARANDTIME);
        const endtime = values.endtime.format(YEARANDTIME);
        const data = { ...values, starttime, endtime };
        onSearch(data);
      }
    });
  }

  // 重置搜索框
  handleReload() {
    const { form } = this.props;
    form.resetFields();
    form.setFieldsValue({ endtime: moment() });
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      style: { height: '20px' },
    };
    const noMatch = '';
    const startTime = moment(`${moment().format('YYYY-MM-DD')} 00:00:00`, YEARANDTIME);
    const { form, codeList } = this.props;
    const { getFieldDecorator } = form;
    const authorizedProps = {
      codeList,
      noMatch,
    };
    const reg = new RegExp('^(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|[1-9])\\.(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)$');
    return (
      <div className="outline-out outline-out-top">
        <div className="outline-inner">
          <Form className="form-outline-inner-padding">
            <Row>
              <Col span={6}>
                <FormItem {...formItemLayout} label="用户名称">
                  {getFieldDecorator('username', { initialValue: '' })(<Input maxLength="30" />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label="IP地址">
                  {getFieldDecorator('clientip', {
                    initialValue: '',
                    rules: [{
                      pattern: reg,
                      message: '请输入合法的IP地址！',
                    }],
                  })(<Input maxLength="15" />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label="日志类型">
                  {getFieldDecorator('logtype', { initialValue: '-1' })(<Select>{this.handleGenEnumOption(LOGTYPE)}</Select>)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label="功能模块">
                  {getFieldDecorator('functionname', { initialValue: '-1' })(<Select>{this.getAllFirstMenus()}</Select>)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <FormItem {...formItemLayout} label="开始时间">
                  {getFieldDecorator('starttime', { initialValue: startTime })(
                    <DatePicker
                      showTime
                      format={YEARANDTIME}
                      disabledDate={disabledDate}
                      style={{ width: '292px' }}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label="结束时间">
                  {getFieldDecorator('endtime', { initialValue: endTime })(
                    <DatePicker
                      showTime
                      format={YEARANDTIME}
                      disabledDate={disabledDate}
                      style={{ width: '292px' }}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label="操作内容">
                  {getFieldDecorator('operatecontent', { initialValue: '' })(<Input maxLength="200" />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem style={{ textAlign: 'right' }}>
                  <HiatmpAuthorized {...authorizedProps} code={QUERYLOG}>
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
LogSearch.prototypes = {
  loading: PropTypes.bool,
  enumList: PropTypes.array.isRequired,
  codeList: PropTypes.array.isRequired,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
};
export default Form.create()(LogSearch);
