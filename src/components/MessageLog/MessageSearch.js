/**
 * Created by cherry on 2018/7/13.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Button, Input, Select, DatePicker, message } from 'antd';
import moment from 'moment';
import { YEARANDTIME } from '../../config/constant';
import HiatmpAuthorized from '../Authorized/HiatmpAuthorized';
import { QUERYMESSAGE } from '../../config/authconstant';

const FormItem = Form.Item;
const { Option } = Select;
const endTime = moment();
// 不可选择未来日期
function disabledDate(current) {
  return current > moment();
}
class MessageSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // 查询日志信息
  handleSubmit() {
    const { form, onSearch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (values.starttime.isAfter(values.endtime)) {
        message.warn('开始时间不能晚于结束时间');
      }
      const starttime = values.starttime.format(YEARANDTIME);
      const endtime = values.endtime.format(YEARANDTIME);
      const data = { ...values, starttime, endtime };
      onSearch(data);
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
    const { form, codeList } = this.props;
    const noMatch = '';
    const reg = new RegExp('^[0-9]*$');
    const startTime = moment(`${moment().format('YYYY-MM-DD')} 00:00:00`, YEARANDTIME);
    const authorizedProps = {
      codeList,
      noMatch,
    };
    const { getFieldDecorator } = form;
    const options = [];
    options.push(<Option key="-1" value="-1">全部</Option>);
    options.push(<Option key="0" value="0">发送失败</Option>);
    options.push(<Option key="1" value="1">发送成功</Option>);
    return (
      <div className="outline-out outline-out-top">
        <div className="outline-inner">
          <Form className="form-outline-inner-padding">
            <Row>
              <Col span={6}>
                <FormItem {...formItemLayout} label="电话号码">
                  {getFieldDecorator('telnumber', {
                    initialValue: '',
                    rules: [{
                      pattern: reg,
                      message: '请输入数字！',
                    }],
                  })(<Input maxLength="11" />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label="短信内容">
                  {getFieldDecorator('strmessage', {
                    initialValue: '',
                  })(<Input maxLength="300" />)}
                </FormItem>
              </Col>
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
            </Row>
            <Row>
              <Col span={6}>
                <FormItem {...formItemLayout} label="发送状态">
                  {getFieldDecorator('submitstate', { initialValue: '-1' })(<Select>{options}</Select>)}
                </FormItem>
              </Col>
              <Col span={6} offset={12}>
                <FormItem style={{ textAlign: 'right' }}>
                  <HiatmpAuthorized {...authorizedProps} code={QUERYMESSAGE}>
                    <Button type="primary" htmlType="submit" style={{ margin: '0 5px' }} onClick={() => this.handleSubmit()}>
                      查询
                    </Button>
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
MessageSearch.prototypes = {
  loading: PropTypes.bool,
  enumList: PropTypes.array.isRequired,
  codeList: PropTypes.array.isRequired,
  messagelist: PropTypes.array,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
};
export default Form.create()(MessageSearch);
