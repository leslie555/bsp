
import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import classNames from 'classnames';
import styles from './Card.less';

export class A8 extends React.Component {
  render() {
    const { bigStyle, vehCount } = this.props;
    const num = vehCount === null ? 0 : vehCount;
    const cardleftClass = classNames({
      [styles.cardStyle]: bigStyle === 'big',
      [styles.aSmallCardStyle]: bigStyle != 'big',
    });


    return (
      <div>
        <Card className={cardleftClass}>
          <div className={styles.aContentImg}>
            <img alt="未找到" src={require('../../assets/预警总数.png')} />
            <div>重点车辆总数</div>
          </div>
          <div className={styles.aContentRight}>
            <span style={{ color: '#08c' }}>{num || '0'}</span>
            <span style={{ fontSize: 16 }}>&nbsp;项</span>
          </div>
        </Card>
      </div>
    );
  }
}
export default connect(state => ({
  totalAlarmCount: state.chart.totalAlarmCount,
}))(A8);