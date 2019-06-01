/**
 * Created by Administrator on 2018/7/11.
 */
import { Row, Col, Form, Button, Input, Select, Alert } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { QUERYUSER, RESETUSERSEARCH } from '../../config/authconstant';

const FormItem = Form.Item;

class StaSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSubmit = (e) => {
    const { form, dispatch, selDeptInfo } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'accountmanage/getOperatorList',
          payload: { ...selDeptInfo, userid: values.userid, username: values.username },
        });
      }
    });
  }

  handleReset = (e) => {
    const { form, dispatch } = this.props;
    form.setFieldsValue({
      userid: '',
      username: '',
    });
    dispatch({
      type: 'accountmanage/handleReset',
      payload: {},
    });
  }

  render() {
    const { form, codeList } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };
    // 权限判断
    let queryPerssion = false;
    let resetQueryPerssion = false;
    if (Array.isArray(codeList)) {
      if (codeList.indexOf(QUERYUSER) >= 0) {
        queryPerssion = true;
      }
      if (codeList.indexOf(RESETUSERSEARCH) >= 0) {
        resetQueryPerssion = true;
      }
    }
    return (
      <Row>
        <div className="outline-out">
          <div className="outline-inner">
            <Row type="flex" justify="space-around" align="middle" className="outline-inner-padding">
              <Form layout="inline">
                <Row>
                  <Col span={4}>
                    <FormItem {...formItemLayout} label="用户名：">
                      {getFieldDecorator('userid', {
                        rules: [{
                          message: '用户名格式错误',
                          pattern: /^[a-zA-Z0-9_]{0,6}$/g,
                        }] })(
                          <Input maxLength="6" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={4}>
                    <FormItem {...formItemLayout} label="人员名称：">
                      {getFieldDecorator('username', {
                        rules: [{
                          validator: (rule, value, callback) => {
                            if (value && value.match("(?:')|(?:\\s)|(?:%)|(?:--)|(/\\*(?:.|[\\n\\r])*?\\*/)|(\\b(select|update|union|and|or|delete|insert|trancate|char|into|substr|ascii|declare|exec|count|master|into|drop|execute)\\b)")) {
                              callback('请不要包含特殊字符及命令');
                            }
                            callback();
                          },
                        },
                        ],
                      })(
                        <Input maxLength="20" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={14} />
                  <Col span={1}>
                    <FormItem>
                      <Button
                        type="primary"
                        onClick={this.handleSubmit}
                        style={{ display: queryPerssion ? '' : 'none' }}
                      >
                        查询
                      </Button>
                    </FormItem>
                  </Col>
                  <Col span={1}>
                    <FormItem>
                      <Button
                        style={{ display: resetQueryPerssion ? '' : 'none' }}
                        onClick={this.handleReset}
                      >
                        重置
                      </Button>
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </Row>
          </div>
        </div>
      </Row>
    );
  }
}
function onValuesChange(props, changedValues, allValues) {
  const { dispatch } = props;
  dispatch({
    type: 'accountmanage/setQueryParams',
    payload: { queryParams: { ...allValues } },
  });
}
StaSearch.prototypes = {
  codeList: PropTypes.array.isRequired,
};

export default Form.create({ onValuesChange })(StaSearch);
