import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Button, Checkbox, Select, Icon, message, Input } from 'antd';

const CheckboxGroup = Checkbox.Group;
const { Option } = Select;
const FormItem = Form.Item;

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  // 查询列表
  handleSubmit() {
    const { form, onSearch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      const query = values;
      console.log(query);
      if (typeof query.userId !== 'undefined' && query.userId !== null) {
        if (query.userId.match("(?:')|(?:%)|(?:\\s)|(?:--)|(/\\*(?:.|[\\n\\r])*?\\*/)|(\\b(select|update|union|and|or|delete|insert|trancate|char|into|substr|ascii|declare|exec|count|master|into|drop|execute)\\b)")) {
          message.error('搜索条件请不要包含特殊字符及命令');
          return;
        }
      }

      onSearch(query);
    });
  }

  // 重置搜索框
  handleReloadData() {
    const { form } = this.props;

    form.resetFields();
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      style: { height: '20px' },
    };
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className="outline-out outline-out-top">
        <div className="outline-inner">
          <Form className="form-outline-inner-padding">
            <Row gutter={40}>
              <Col span={6}>
                <FormItem {...formItemLayout} label="用户名">
                  {getFieldDecorator('userId')(
                    <Input maxLength={50} />
                  )}
                </FormItem>
              </Col>
              <Col span={14} />
              <Col span={4}>
                <FormItem style={{ textAlign: 'right' }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ margin: '0 5px' }}
                    onClick={() => this.handleSubmit()}
                  >
                    查询
                  </Button>
                  <Button
                    type="primary"
                    style={{ margin: '0 3px' }}
                    onClick={() => this.handleReloadData()}
                  >
                    重置
                  </Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}

Search.propTypes = {
  enumList: PropTypes.array,
  queryobj: PropTypes.object.isRequired,
  checkedarr: PropTypes.array.isRequired,
};
Search.defaultProps = {
  enumList: [],
};
export default Form.create()(Search);
