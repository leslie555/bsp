/* eslint-disable */
import React, { Component } from 'react';
import { Form, Button, Input, Row, Col } from 'antd';
import PropTypes from 'prop-types';

import styles from './Search.less';

const FormItem = Form.Item;

class Search extends Component {
  constructor(props) {
    super(props);
    this.tagSelect = null;
    this.timeId = -1;
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {}

  onSubmit(e = {}) {
    e.preventDefault();
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 19 },
    };
    return (
      <div style={{ width: '100%' }}>
        <Form className={styles.form} onSubmit={this.onSubmit}>
          <Row gutter={0}>
            <Col span={16}>
              {' '}
              <FormItem {...formItemLayout} label="搜索">
                {getFieldDecorator('name')(
                  <Input style={{ width: '125%' }} placeholder="检查站" />
                )}
              </FormItem>
            </Col>

            <Col
              xl={{ span: 8, offset: 0 }}
              xxl={{ span: 8, offset: 0 }}
              style={{ textAlign: 'right' }}
            >
              <FormItem>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>&nbsp;&nbsp;
              </FormItem>
            </Col>
          </Row>

          <Row gutter={0}>
            <FormItem />
          </Row>
        </Form>
      </div>
    );
  }
}
Search.propTypes = {
  queryObj: PropTypes.object,
};
Search.defaultProps = {
  queryObj: {},
};

export default Form.create()(Search);
