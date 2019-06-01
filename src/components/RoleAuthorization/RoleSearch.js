/**
 * Created by cherry on 2018/7/26.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Button, Input } from 'antd';
import HiatmpAuthorized from '../Authorized/HiatmpAuthorized';
import { QUERYROLE } from '../../config/authconstant';

const FormItem = Form.Item;
class RoleSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.handleSubmit();
  }

  // 查询角色列表
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
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      style: { height: '20px' },
    };
    const { form, codeList } = this.props;
    const { getFieldDecorator } = form;
    const authorizedProps = {
      codeList,
      noMatch,
    };
    return (
      <div className="outline-out outline-out-top">
        <div className="outline-inner">
          <Form className="form-outline-inner-padding">
            <Row>
              <Col span={6}>
                <FormItem {...formItemLayout} label="角色名称">
                  {getFieldDecorator('rolename', { initialValue: '' })(<Input maxLength="32" />)}
                </FormItem>
              </Col>
              <Col span={6} offset={12}>
                <FormItem style={{ textAlign: 'right' }}>
                  <HiatmpAuthorized {...authorizedProps} code={QUERYROLE}>
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
RoleSearch.prototypes = {
  loading: PropTypes.bool,
  queryobj: PropTypes.object,
  codeList: PropTypes.array,
  onSearch: PropTypes.func,
};
export default Form.create()(RoleSearch);
