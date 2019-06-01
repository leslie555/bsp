/**
 * Created by Administrator on 2017/12/19 0019.
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import classNames from 'classnames';

import ReactEcharts from 'echarts-for-react';
import { Card, DatePicker, Radio, Form, Row, Col, Input, Button } from 'antd';
import { getCaseCountOption } from '../Echarts/Options';
import styles from './Card.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
/* eslint-disable   */
class B4 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isConfig: this.props.bigStyle != 'big',
      isBig: this.props.bigStyle == 'big',
      timeRange:
        this.props.currentUser.selectedComponents.filter(element => {
          return element.componentName === 'B4';
        }).length != '0'
          ? this.props.currentUser.selectedComponents.filter(element => {
              return element.componentName == 'B4';
            })[0].parameterconfig != null
            ? this.props.currentUser.selectedComponents
                .filter(element => {
                  return element.componentName == 'B4';
                })[0]
                .parameterconfig.toString()
                .replace('{', '')
                .replace('}', '')
                .split(',')[1]
                .split(':')[1]
                .replace(/\"/g, '')
            : ''
          : '',
      summarizeBy: '1',
      chatVamInfo: this.props.chatVamInfo,
    };
  }

  componentWillMount() {
    if (!this.state.isConfig) {
      const time =
        this.props.currentUser.selectedComponents.filter(element => {
          return element.componentName === 'B4';
        }).length != '0'
          ? this.props.currentUser.selectedComponents.filter(element => {
              return element.componentName == 'B4';
            })[0].parameterconfig != null
            ? this.props.currentUser.selectedComponents
                .filter(element => {
                  return element.componentName == 'B4';
                })[0]
                .parameterconfig.toString()
                .replace('{', '')
                .replace('}', '')
                .split(',')[1]
                .split(':')[1]
                .replace(/\"/g, '')
            : ''
          : '';

      this.setState({
        timeRange: time,
        chatVamInfo: this.props.chatVamInfo,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.currentUser &&
      nextProps.currentUser.selectedComponents !== this.props.currentUser.selectedComponents
    ) {
      const time =
        nextProps.currentUser.selectedComponents.filter(element => {
          return element.componentName === 'B4';
        }).length != '0'
          ? nextProps.currentUser.selectedComponents.filter(element => {
              return element.componentName == 'B4';
            })[0].parameterconfig != null
            ? nextProps.currentUser.selectedComponents
                .filter(element => {
                  return element.componentName == 'B4';
                })[0]
                .parameterconfig.toString()
                .replace('{', '')
                .replace('}', '')
                .split(',')[1]
                .split(':')[1]
                .replace(/\"/g, '')
            : this.state.timeRange
          : this.state.timeRange;
      this.setState({
        timeRange: time,
      });
    }
    if (nextProps.chatVamInfo !== this.props.chatVamInfo) {
      this.setState({
        chatVamInfo: nextProps.chatVamInfo,
      });
    }
  }

  onChangeTimeRange = (value = '') => {
    this.setState({
      timeRange: value.target.value,
    });
  };

  onChangeSummarizeBy = (value = '') => {
    this.setState({
      summarizeBy: value.target.value,
    });
  };

  saveConfig = () => {
    // 查看是否已经配置，如果已经配置则删除原有的配置项
    let hadConfig = false;
    for (let i = 0; i < this.props.parameterconfig.length; i++) {
      if (this.props.parameterconfig[i].componentName == 'B4') {
        hadConfig = true;
      }
    }
    if (hadConfig) {
      const parameterconfig = this.props.parameterconfig.filter(i => {
        return i.componentName != 'B4';
      });
      this.props.dispatch({
        type: 'user/saveparameterconfig',
        payload: [
          ...parameterconfig,
          {
            componentName: 'B4',
            timeRange: this.state.timeRange,
            summarizeBy: this.state.summarizeBy,
          },
        ],
      });
    } else {
      this.props.dispatch({
        type: 'user/saveparameterconfig',
        payload: [
          ...this.props.parameterconfig,
          {
            componentName: 'B4',
            timeRange: this.state.timeRange,
            summarizeBy: this.state.summarizeBy,
          },
        ],
      });
    }

    this.setState({
      isConfig: false,
    });
  };

  render() {
    const { bigStyle } = this.props;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    const caseExtra = (
      <div>
        <span>开始日期：</span>
        <DatePicker
          style={{ width: '130px' }}
          format="YYYY-MM-DD"
          size="small"
          onChange={this.onChange}
          getCalendarContainer={trigger => {
            return this.rootNode11;
          }}
        />
      </div>
    );
    const bsytle = classNames({
      [styles.bcardStyle]: bigStyle == 'big',
      [styles.bSmallcardStyle]: bigStyle != 'big',
      [styles.raidostyle]: true,
    });
    return (
      <div>
        <Card title="事故数据统计" className={bsytle} bordered={false}>
          <span>
            <Card
              bordered={false}
              bodyStyle={{
                padding: '0',
                height: '6rem',
                display: this.state.isConfig ? '' : 'none',
              }}
            >
              <div>
                <Form>
                  <Row gutter={30}>
                    <Col span={24} style={{ marginBottom: '10px', textAlign: 'center' }}>
                      <span>日期：</span>
                      <span>
                        <RadioGroup onChange={this.onChangeTimeRange} size="small">
                          <div>
                            <div>
                              <RadioButton value="0">近3天</RadioButton>
                              <RadioButton value="2">近一周</RadioButton>
                              <RadioButton value="3">近一月</RadioButton>
                              <RadioButton value="4">本周</RadioButton>
                              <RadioButton value="5">本月</RadioButton>
                            </div>
                          </div>
                        </RadioGroup>
                      </span>
                    </Col>
                  </Row>
                </Form>
              </div>
              <div style={{ textAlign: 'right', marginBottom: 0 }}>
                <Button type="primary" onClick={this.saveConfig}>
                  保存
                </Button>
              </div>
            </Card>
            <div>
              {!this.state.isConfig ? (
                <ReactEcharts
                  option={getCaseCountOption(this.props.chatVamInfo)}
                  notMerge
                  lazyUpdate
                  style={bigStyle === 'big' ? { height: '200px' } : { height: '150px' }}
                />
              ) : (
                ''
              )}
            </div>
            <div ref={c => (this.rootNode11 = c)} />
          </span>
        </Card>
      </div>
    );
  }
}
export default connect(state => ({
  currentUser: state.user.currentUser,
  chatVamInfo: state.global.chatVamInfo,
  parameterconfig: state.user.parameterconfig,
}))(B4);
