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
function disableEnddDate(current) {
  return current > moment().endOf('day').add('1');
}
class DeviceLogSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: moment(`${moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')}`),
      endTime: moment(`${moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')}`),
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleGenEnumOption = this.handleGenEnumOption.bind(this);
  }

  componentDidMount() {
    this.handleSubmit();
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

  pickStartDate = (value, dateString) => {
    // console.log('Formatted Selected Time: ', moment(dateString));
    console.log('Formatted Selected Time: ', moment(dateString).format('YYYY-MM-DD HH:mm:ss'));
    this.setState({
      startTime: moment(dateString).format('YYYY-MM-DD HH:mm:ss'),
    });
  }

  pickEndDate = (value, dateString) => {
    this.setState({ endTime: moment(dateString).format('YYYY-MM-DD HH:mm:ss') });
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
        } else {
          const { deviceid, starttime, endtime } = values;
          const pagination = {
            showSizeChanger: true,
            showQuickJumper: true,
            current: 1,
            pageSize: 10,
            total: null,
          };
          const data = {
            starttime: moment(starttime).format('YYYY-MM-DD HH:mm:ss'),
            endtime: moment(endtime).format('YYYY-MM-DD HH:mm:ss'),
            deviceid,
            pagination,
          };
          onSearch(data);
        }
      }
    });
  }

  // 重置搜索框
  handleReload() {
    const { form } = this.props;
    form.resetFields();
    form.setFieldsValue({ endtime: moment().endOf('day'), starttime: moment().startOf('day') });
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      style: { height: '20px' },
    };
    const noMatch = '';
    const { form, codeList } = this.props;
    const { getFieldDecorator } = form;
    const authorizedProps = {
      codeList,
      noMatch,
    };
    const { startTime, endTime } = this.state;
    const reg = new RegExp('^(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|[1-9])\\.(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)$');
    return (
      <div className="outline-out outline-out-top">
        <div className="outline-inner">
          <Form className="form-outline-inner-padding">
            <Row>
              <Col span={6}>
                <FormItem {...formItemLayout} label="设备编号">
                  {getFieldDecorator('deviceid', {
                    initialValue: '',
                  })(<Input maxLength="15" />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label="开始时间">
                  {getFieldDecorator('starttime', { initialValue: startTime })(
                    <DatePicker
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      disabledDate={disabledDate}
                      onChange={this.pickStartDate}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label="结束时间">
                  {getFieldDecorator('endtime', { initialValue: endTime })(
                    <DatePicker
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      disabledDate={disableEnddDate}
                      onChange={this.pickEndDate}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem style={{ textAlign: 'right' }}>
                  {/* <HiatmpAuthorized {...authorizedProps} code={QUERYLOG}> */}
                  <Button type="primary" htmlType="submit" style={{ margin: '0 5px' }} onClick={() => this.handleSubmit()}>查询</Button>
                  <Button type="primary" style={{ margin: '0 3px' }} onClick={() => this.handleReload()}>重置</Button>
                  {/* </HiatmpAuthorized> */}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}
DeviceLogSearch.prototypes = {
  loading: PropTypes.bool,
  enumList: PropTypes.array.isRequired,
  codeList: PropTypes.array.isRequired,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
};
export default Form.create()(DeviceLogSearch);
