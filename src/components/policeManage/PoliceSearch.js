/**
 * Created by Administrator on 2018/7/25.
 */

import React from 'react';
import { Form, Row, Col, Button, Checkbox, Select, Icon, Input } from 'antd';
import { POLICESTATUS, POLICETYPE, AUDITSTATE } from '../../config/enums';
import RenderAuthorized from '../Authorized';
import { QUERYPOLICE } from '../../config/authconstant';

const { Option } = Select;
const FormItem = Form.Item;

class PoliceSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rankType: '-1',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReload = this.handleReload.bind(this);
    this.handleGenEnumOption = this.handleGenEnumOption.bind(this);
    this.rankSelectOnChange = this.rankSelectOnChange.bind(this);
  }

  handleSubmit = () => {
    const { form, onSearch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      const query = values;
      onSearch(query);
    });
  };

  // 重置搜索框
  handleReload() {
    const { form } = this.props;
    form.resetFields();
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

  rankSelectOnChange(value) {
    const { form } = this.props;
    form.resetFields(['positionname']);
    this.setState({ rankType: value });
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      style: { height: '20px' },
    };
    const { form, codeList } = this.props;
    const { getFieldDecorator } = form;
    const { rankType } = this.state;
    const QueryAuthorized = RenderAuthorized(QUERYPOLICE);
    const noMatch = '';
    return (
      <div className="outline-out outline-out-top">
        <div className="outline-inner">
          <Form className="form-outline-inner-padding">
            <Row>
              <Col span={6}>
                <FormItem {...formItemLayout} label="警员姓名">
                  {getFieldDecorator('policename', { initialValue: '' })(
                    <Input maxLength={7} />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label="警员警号">
                  {getFieldDecorator('policeid', { initialValue: '' })(
                    <Input maxLength={7} />)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label="警员类型">
                  {getFieldDecorator('policetype', {
                    initialValue: '-1',
                  })(<Select>{this.handleGenEnumOption(POLICETYPE)}</Select>)}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem {...formItemLayout} label="警员状态">
                  {getFieldDecorator('isEffective', {
                    initialValue: '-1',
                  })(<Select>{this.handleGenEnumOption(POLICESTATUS)}</Select>)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <FormItem {...formItemLayout} label="审核状态">
                  {getFieldDecorator('auditstate', {
                    initialValue: '-1',
                  })(<Select>{this.handleGenEnumOption(AUDITSTATE)}</Select>)}
                </FormItem>
              </Col>
              <Col span={6} offset={12}>
                <FormItem style={{ textAlign: 'right' }}>
                  <QueryAuthorized authority={codeList} noMatch={noMatch}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ margin: '0 5px' }}
                      onClick={() => this.handleSubmit()}
                    >
                      查询
                    </Button>
                  </QueryAuthorized>
                  <Button
                    type="primary"
                    style={{ margin: '0 3px' }}
                    onClick={() => this.handleReload()}
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
PoliceSearch.propTypes = {
};
PoliceSearch.defaultProps = {
};
export default Form.create()(PoliceSearch);
