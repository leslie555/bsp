/**
 * Created by cherry on 2018/7/2.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Input, Button, Select, message, Icon } from 'antd';
import HiatmpAuthorized from '../Authorized/HiatmpAuthorized';
import { QUERYILLEGAL } from '../../config/authconstant';

const FormItem = Form.Item;
class IllegalSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // 查询系统参数
  handleSubmit() {
    const { form, onSearch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      onSearch(values);
    });
  }

  // 重置搜索框
  handleReload() {
    const { form } = this.props;
    form.resetFields();
  }

  render() {
    const noMatch = '';
    const { form, codeList } = this.props;
    const authorizedProps = {
      codeList,
      noMatch,
    };
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      style: { height: '20px' },
    };
    const { getFieldDecorator } = form;
    return (
      <div className="outline-out outline-out-top">
        <div className="outline-inner">
          <Form className="form-outline-inner-padding">
            <Row>
              <Col span={6}>
                <FormItem {...formItemLayout} label="关键字">
                  {getFieldDecorator('illegalkeywork', { initialValue: '' })(<Input maxLength={30} />)}
                </FormItem>
              </Col>
              <Col span={6} offset={12}>
                <FormItem style={{ textAlign: 'right' }}>
                  <HiatmpAuthorized {...authorizedProps} code={QUERYILLEGAL}>
                    <Button type="primary" htmlType="submit" style={{ margin: '0 5px' }} onClick={() => this.handleSubmit()}>查询</Button>
                  </HiatmpAuthorized>
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
IllegalSearch.prototypes = {

};
export default Form.create()(IllegalSearch);
