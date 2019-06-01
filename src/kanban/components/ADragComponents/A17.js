/**
 * Created by caoyu on 2018/4/80015.
 * 勤务管理-本日强制措施数量
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Icon, Card, Tabs, Table, Radio, DatePicker, Menu, Dropdown } from 'antd';
import { isNotEmpty, isArray } from '../../utils/utils';
import styles from './Card.less';

export class A17 extends React.Component {
  componentDidMount() {

  }

  render() {
    const { bigStyle, forceNum } = this.props;
    const num = forceNum === null ? 0 : forceNum;
    return (
      <div>
        <Card className={styles.cardStyle} style={bigStyle === 'big' ? { height: '142px' } : { height: '124px' }}>
          <div style={{ display: 'inline-block', textAlign: 'center', lineHeight: '40px', width: bigStyle === 'big' ? '34%' : '40%', marginTop: '6%', zIndex: '2', position: 'relative' }}>
            <img alt="example" src={require('../../assets/强制措施.png')} style={{ width: '40%' }} />
            <div style={{ position: 'relative', color: '#fff' }}>本日强制措施数</div>
          </div>
          <div style={{ textAlign: 'center', display: 'inline-block', width: bigStyle === 'big' ? '65%' : '68%', position: 'absolute', marginTop: bigStyle === 'big' ? '9%' : '14%' }}>
            <span style={bigStyle === 'big' ? ({ fontSize: 30, color: '#08c' }) : ({ fontSize: 16, color: '#08c', paddingLeft: '0' })}>{num || '0'}</span>
            <span style={{ fontSize: 16 }}>&nbsp;项</span>
          </div>
        </Card>
      </div>
    );
  }
}
export default connect(state => ({
  forceNum: state.chart.forceNum,
}))(A17);
