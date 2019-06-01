/**
 * Created by cherry on 2018/7/20.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Select, Row, Col, Button, InputNumber, Input, DatePicker } from 'antd';
import moment from 'moment';
import { TIME } from '../../config/constant';
import { QUERYDEPT, RESETDEPT } from '../../config/authconstant';

const FormItem = Form.Item;
const monthFormat = 'YYYY/MM';
const Time = moment();

function disabledDate(current) {
  return current > moment();
}
class QueryTravelSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // 查询设备列表
  handleSubmit() {
    const { form, onSearch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const startmonth = values.startmonth.format(TIME);
        // const endmonth = values.endmonth.format(TIME);
        const data = { ...values, startmonth };
        onSearch(data);
      }
    });
  }

  // 重置搜索框
  handleReload() {
    const { form } = this.props;
    form.resetFields();
  }

  render() {
    const { MonthPicker, RangePicker } = DatePicker;
    const dateFormat = 'YYYY-MM-DD';
    const datetime = 'YYYY-MM';
    const startTime = moment(`${moment().format('YYYY/MM')}`);
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
    const h3Layout = {
      style: { padding: '1rem 0 0 1rem' },
    };
    const { form, codeList, excel, onDownload } = this.props;
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
          <h3 {...h3Layout}>机动车省内省外出行量统计查询</h3>
          <Form className="form-outline-inner-padding">
            <Row>
              <Col span={5}>
                <FormItem {...formItemLayout} label="月份时间">
                  {getFieldDecorator('startmonth', {
                    initialValue: startTime,
                    rules: [{
                      required: true,
                      message: '请输入时间！',
                    }],
                  })(<MonthPicker
                    // defaultValue={moment('2015-01', monthFormat)}
                    format="YYYY-MM"
                    style={{ width: '100%' }}
                    disabledDate={disabledDate}
                  />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label="设备分组">
                  {getFieldDecorator('group', {
                    initialValue: '',
                  })(<Input
                    style={{ width: '100%' }}
                  />
                  )}
                </FormItem>
              </Col>
              {/* <Col span={6}>
                <FormItem {...formItemLayout} label="月份结束时间">
                  {getFieldDecorator('endmonth', {
                    initialValue: '',
                    rules: [{
                      required: true,
                      message: '请输入结束时间！',
                    }],
                  })(<MonthPicker
                    format={TIME}
                    style={{ width: '100%' }}
                  />
                  )}
                </FormItem>
              </Col> */}
              <Col span={8} offset={2}>
                <FormItem style={{ textAlign: 'right' }}>
                  <Button type="primary" htmlType="submit" style={{ margin: '0 5px' }} onClick={() => this.handleSubmit()}>查询</Button>
                  <Button type="primary" style={{ margin: '0 3px' }} onClick={() => this.handleReload()}>重置</Button>
                </FormItem>
              </Col>
              <Col span={1} style={{ textAlign: 'right' }}>
                <Button type="primary" style={{ margin: '0 5px', marginTop: '10%' }} disabled={(excel == null) || (!excel)} onClick={onDownload}><i className="table-right icon iconfont icon-export" />
                  批量导出
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}
QueryTravelSearch.prototypes = {
  loading: PropTypes.bool,
  enumList: PropTypes.array.isRequired,
  codeList: PropTypes.array.isRequired,
  queryobj: PropTypes.object,
  onSearch: PropTypes.func,
  onDownload: PropTypes.func,
};
export default Form.create()(QueryTravelSearch);
