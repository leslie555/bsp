/**
 * Created by cherry on 2018/7/20.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Select, Row, Col, Button, InputNumber, Input, DatePicker } from 'antd';
import moment from 'moment';
import { QUERYDEPT, RESETDEPT } from '../../config/authconstant';

const FormItem = Form.Item;
const endTime = moment();
class QueryTraOutsideSearch extends React.Component {
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
    const { MonthPicker, RangePicker } = DatePicker;
    const dateFormat = 'YYYY/MM/DD';
    const datetime = 'YYYY/MM/DD';
    const startTime = moment(`${moment().format('YYYY-MM-DD')}`);
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
          <h3 {...h3Layout}>机动车省外出行量统计查询</h3>
          <Form className="form-outline-inner-padding">
            <Row>
              <Col span={6}>
                <FormItem {...formItemLayout} label="开始时间">
                  {getFieldDecorator('starttime', {
                    initialValue: '',
                    rules: [{
                      required: true,
                      message: '请输入开始时间！',
                    }],
                  })(<DatePicker
                    format={datetime}
                    style={{ width: '100%' }}
                    placeholder="开始时间"
                  />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label="结束时间">
                  {getFieldDecorator('endtime', {
                    initialValue: '',
                    rules: [{
                      required: true,
                      message: '请输入结束时间！',
                    }],
                  })(<DatePicker
                    format={datetime}
                    style={{ width: '100%' }}
                  />
                  )}
                </FormItem>
              </Col>
              <Col span={7} offset={5}>
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
QueryTraOutsideSearch.prototypes = {
  loading: PropTypes.bool,
  enumList: PropTypes.array.isRequired,
  codeList: PropTypes.array.isRequired,
  queryobj: PropTypes.object,
  onSearch: PropTypes.func,
};
export default Form.create()(QueryTraOutsideSearch);
