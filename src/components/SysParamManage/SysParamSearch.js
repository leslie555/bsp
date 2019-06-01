/**
 * Created by cherry on 2018/7/2.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Input, Button, Select, message, Icon } from 'antd';
import HiatmpAuthorized from '../Authorized/HiatmpAuthorized';
import { QUERYSYSPARAM } from '../../config/authconstant';

const FormItem = Form.Item;
class SysParamSearch extends React.Component {
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
      const query = values;
      onSearch(query);
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
                <FormItem {...formItemLayout} label="参数代码">
                  {getFieldDecorator('sysparamcode', { initialValue: '' })(<Input maxLength={32} />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label="参数名称">
                  {getFieldDecorator('sysparamname', { initialValue: '' })(<Input maxLength={100} />)}
                </FormItem>
              </Col>
              <Col span={6} offset={6}>
                <FormItem style={{ textAlign: 'right' }}>
                  <HiatmpAuthorized {...authorizedProps} code={QUERYSYSPARAM}>
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
SysParamSearch.prototypes = {

};
export default Form.create()(SysParamSearch);
