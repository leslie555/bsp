/**
 * Created by Administrator on 2017/12/19 0019.
 */
/**
 * Created by Administrator on 2017/12/15 0015.
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import ReactEcharts from 'echarts-for-react';
import { Row, Col, Icon, Card, Tabs, Table, Radio, DatePicker, Menu, Dropdown } from 'antd';
import { isArray, isNotEmpty, isNotNil } from '../../utils/utils';
import { getBarOption } from '../Echarts/Options';
/* eslint-disable   */
export class B2 extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { bigStyle, width } = this.props;
    const arr1 = this.props.illegalCount.sourceCounts || [];
    const arr = isNotEmpty(this.props.illegalCount.sourceCounts) && isArray(arr1) ? arr1 : [];
    let num1 = '0';
    let num2 = '0';
    let num3 = '0';
    let num4 = '0';
    let num5 = '0';
    let num6 = '0';
    let num7 = '0';
    let num8 = '0';
    let num9 = '0';
    let num10 = '0';
    let num11 = '0';
    let num12 = '0';
    const number1 = arr.filter(x => x.source == '1');
    const number2 = arr.filter(x => x.source == '10');
    const number3 = arr.filter(x => x.source == '11');
    const number4 = arr.filter(x => x.source == '18');
    const number5 = arr.filter(x => x.source == '2');
    const number6 = arr.filter(x => x.source == '3');
    const number7 = arr.filter(x => x.source == '4');
    const number8 = arr.filter(x => x.source == '5');
    const number9 = arr.filter(x => x.source == '6');
    const number10 = arr.filter(x => x.source == '7');
    const number11 = arr.filter(x => x.source == '8');
    const number12 = arr.filter(x => x.source == '9');
    if (number1.length == '1') {
      num1 = number1[0].count;
    }
    if (number2.length == '1') {
      num2 = number2[0].count;
    }
    if (number3.length == '1') {
      num3 = number3[0].count;
    }
    if (number4.length == '1') {
      num4 = number4[0].count;
    }
    if (number5.length == '1') {
      num5 = number5[0].count;
    }
    if (number6.length == '1') {
      num6 = number6[0].count;
    }
    if (number7.length == '1') {
      num7 = number7[0].count;
    }
    if (number8.length == '1') {
      num8 = number8[0].count;
    }
    if (number9.length == '1') {
      num9 = number9[0].count;
    }
    if (number10.length == '1') {
      num10 = number10[0].count;
    }
    if (number11.length == '1') {
      num11 = number11[0].count;
    }
    if (number12.length == '1') {
      num12 = number12[0].count;
    }
    return (
      <div>
        <Card
          title="违章数据源"
          bordered={false}
          bodyStyle={
            bigStyle === 'big'
              ? { padding: '0 6px', height: '19rem', fontSize: '12px' }
              : { padding: '0 6px', height: '100%', fontSize: '9px' }
          }
        >
          <table style={{ width: '100%' }}>
            <tbody>
              <tr
                style={
                  bigStyle === 'big'
                    ? { lineHeight: '30px', textAlign: 'left' }
                    : { lineHeight: '15px' }
                }
              >
                <td style={{ width: '3%' }} />
                <td style={{ width: '8%' }}>
                  <span>{num1}</span>
                </td>
                <td style={{ width: '5%' }}>
                  <img
                    alt="example"
                    src={require('../../assets/手动录入.png')}
                    style={{ width: '18px' }}
                  />
                </td>
                <td style={{ width: '20%' }}>手动录入</td>
                <td style={{ width: '7%' }} />
                <td style={{ width: '8%' }}>
                  <span>{num2}</span>
                </td>
                <td style={{ width: '8%' }}>
                  <img
                    alt="example"
                    src={require('../../assets/警务APP.png')}
                    style={{ width: '18px' }}
                  />
                </td>
                <td style={{ width: '21%' }}>警务APP</td>
                <td style={{ width: '4%' }} />
              </tr>
              <tr
                style={
                  bigStyle === 'big'
                    ? { lineHeight: '30px', textAlign: 'left' }
                    : { lineHeight: '15px' }
                }
              >
                <td style={{ width: '3%' }} />
                <td style={{ width: '8%' }}>
                  <span>{num3}</span>
                </td>
                <td style={{ width: '5%' }}>
                  <img
                    alt="example"
                    src={require('../../assets/黑烟车.png')}
                    style={{ width: '18px' }}
                  />
                </td>
                <td style={{ width: '20%' }}>黑烟车</td>
                <td style={{ width: '7%' }} />
                <td style={{ width: '8%' }}>
                  <span>{num4}</span>
                </td>
                <td style={{ width: '8%' }}>
                  <img
                    alt="example"
                    src={require('../../assets/视频监控.png')}
                    style={{ width: '18px' }}
                  />
                </td>
                <td style={{ width: '21%' }}>视频监控</td>
                <td style={{ width: '4%' }} />
              </tr>
              <tr
                style={
                  bigStyle === 'big'
                    ? { lineHeight: '30px', textAlign: 'left' }
                    : { lineHeight: '15px' }
                }
              >
                <td style={{ width: '3%' }} />
                <td style={{ width: '8%' }}>
                  <span>{num5}</span>
                </td>
                <td style={{ width: '5%' }}>
                  <img
                    alt="example"
                    src={require('../../assets/电子警察.png')}
                    style={{ width: '18px' }}
                  />
                </td>
                <td style={{ width: '20%' }}>电子警察</td>
                <td style={{ width: '7%' }} />
                <td style={{ width: '8%' }}>
                  <span>{num6}</span>
                </td>
                <td style={{ width: '8%' }}>
                  <img
                    alt="example"
                    src={require('../../assets/警务终端.png')}
                    style={{ width: '18px' }}
                  />
                </td>
                <td style={{ width: '21%' }}>警务终端</td>
                <td style={{ width: '4%' }} />
              </tr>
              <tr
                style={
                  bigStyle === 'big'
                    ? { lineHeight: '30px', textAlign: 'left' }
                    : { lineHeight: '15px' }
                }
              >
                <td style={{ width: '3%' }} />
                <td style={{ width: '8%' }}>
                  <span>{num7}</span>
                </td>
                <td style={{ width: '5%' }}>
                  <img
                    alt="example"
                    src={require('../../assets/隐形战车.png')}
                    style={{ width: '18px' }}
                  />
                </td>
                <td style={{ width: '20%' }}>隐形战车</td>
                <td style={{ width: '7%' }} />
                <td style={{ width: '8%' }}>
                  <span>{num8}</span>
                </td>
                <td style={{ width: '8%' }}>
                  <img
                    alt="example"
                    src={require('../../assets/外地黄标车.png')}
                    style={{ width: '18px' }}
                  />
                </td>
                <td style={{ width: '21%' }}>外地黄标车</td>
                <td style={{ width: '4%' }} />
              </tr>
              <tr
                style={
                  bigStyle === 'big'
                    ? { lineHeight: '30px', textAlign: 'left' }
                    : { lineHeight: '15px' }
                }
              >
                <td style={{ width: '3%' }} />
                <td style={{ width: '8%' }}>
                  <span>{num9}</span>
                </td>
                <td style={{ width: '5%' }}>
                  <img
                    alt="example"
                    src={require('../../assets/本地黄标车.png')}
                    style={{ width: '18px' }}
                  />
                </td>
                <td style={{ width: '20%' }}>本地黄标车</td>
                <td style={{ width: '7%' }} />
                <td style={{ width: '8%' }}>
                  <span>{num10}</span>
                </td>
                <td style={{ width: '8%' }}>
                  <img
                    alt="example"
                    src={require('../../assets/未年检.png')}
                    style={{ width: '18px' }}
                  />
                </td>
                <td style={{ width: '21%' }}>未年检上路机动车</td>
                <td style={{ width: '4%' }} />
              </tr>
              <tr
                style={
                  bigStyle === 'big'
                    ? { lineHeight: '30px', textAlign: 'left' }
                    : { lineHeight: '15px' }
                }
              >
                <td style={{ width: '3%' }} />
                <td style={{ width: '8%' }}>
                  <span>{num11}</span>
                </td>
                <td style={{ width: '5%' }}>
                  <img
                    alt="example"
                    src={require('../../assets/闯禁行.png')}
                    style={{ width: '18px' }}
                  />
                </td>
                <td style={{ width: '20%' }}>货车闯禁行</td>
                <td style={{ width: '7%' }} />
                <td style={{ width: '8%' }}>
                  <span>{num12}</span>
                </td>
                <td style={{ width: '8%' }}>
                  <img
                    alt="example"
                    src={require('../../assets/其他来源.png')}
                    style={{ width: '18px' }}
                  />
                </td>
                <td style={{ width: '21%' }}>其他来源</td>
                <td style={{ width: '4%' }} />
              </tr>
            </tbody>
          </table>
        </Card>
      </div>
    );
  }
}
export default connect(state => ({
  illegalCount: state.user.illegalCount,
}))(B2);
