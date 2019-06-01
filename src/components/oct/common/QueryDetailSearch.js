/**
 * Created by cherry on 2018/7/20.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Select, Row, Col, Button, AutoComplete, DatePicker, Cascader, TreeSelect, Input } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
const endTime = moment();

function disableEnddDate(current) {
  return current > moment().endOf('day').add('1');
}

class QueryDetailSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      luduanValue: undefined,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onChange = (value) => {
    console.log(value);
    this.setState({ luduanValue: value });
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
    const { dataSource, handleSearch } = this.props;
    const dateFormat = 'YYYY/MM/DD';
    const datetime = 'YYYY/MM/DD';
    const startTimea = moment(`${moment().add(-15, 'minutes').format('YYYY/MM/DD HH:mm:00')}`);
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
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      style: { height: '20px' },
    };
    const h3Layout = {
      style: { padding: '1rem 0 0 1rem' },
    };
    const { form, codeList, treeData } = this.props;
    const { luduanValue } = this.state;
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
          <Form className="form-outline-inner-padding">
            <Row>
              <Col span={12}>
                <FormItem {...formItemLayout} label="选择日期">
                  {getFieldDecorator('dt', {
                    initialValue: '',
                  })(
                    <RangePicker
                      disabledDate={disableEnddDate}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
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
QueryDetailSearch.prototypes = {
};
export default Form.create()(QueryDetailSearch);
