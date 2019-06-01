/**
 * Created by caoyu on 2018/4/80015.
 * 重点企业-本日任务完成数
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import classNames from 'classnames';
import styles from './Card.less';

export class A9 extends React.Component {
  render() {
    const { bigStyle, taskCount } = this.props;
    const num = taskCount === null ? 0 : taskCount;
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
  taskCount: state.chart.taskCount,
}))(A9);
