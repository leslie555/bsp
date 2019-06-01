/**
 * Created by caoyu on 2018/4/80015.
 * 占路施工管理-施工延期数
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Icon, Card, Tabs, Table, Radio, DatePicker, Menu, Dropdown } from 'antd';
import { isNotEmpty, isArray } from '../../utils/utils';
import styles from './Card.less';
/* eslint-disable   */
export class A21 extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.delayDigroadNum === null) {

    }
  }

  render() {
    const { bigStyle } = this.props;
    const num = this.props.delayDigroadNum === null ? 0 : this.props.delayDigroadNum;
    return (
      <div>
        <Card className={styles.cardStyle} style={bigStyle === 'big' ? { height: '142px' } : { height: '124px' }}>
          <div style={{ display: 'inline-block', textAlign: 'center', lineHeight: '40px', width: bigStyle === 'big' ? '34%' : '40%', marginTop: '6%', zIndex: '2', position: 'relative' }}>
            <img alt="example" src={require('../../assets/施工延期.png')} style={{ width: '40%' }} />
            <div style={{ position: 'relative', color: '#fff' }}>施工延期数</div>
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
  delayDigroadNum: state.chart.delayDigroadNum,
}))(A21);
