/**
 * Created by Administrator on 2017/12/15 0015.
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import classNames from 'classnames';
import styles from './Card.less';

export class A1 extends Component {
  render() {
    const { bigStyle, illegalCount } = this.props;
    let num = '';
    const number = illegalCount?.statusCounts?.filter(x => x.status == '0') || [];
    if (number.length == '1') {
      num = number[0].count;
    }
    const cardleftClass = classNames({
      [styles.cardStyle]: bigStyle === 'big',
      [styles.aSmallCardStyle]: bigStyle != 'big',
    });
    const backgroundColor = ['blue', 'yellow', 'green', 'red'];
    /* eslint-disable import/no-dynamic-require */

    return (
      <div>
        <img
          alt="xxx"
          src={require(`../../assets/${backgroundColor[1]}.png`)}
          className={styles.leftbeijing}
        />
        <Card className={cardleftClass}>
          <div className={styles.aContentImg}>
            <img alt="未找到" src={require('../../assets/待初审.png')} />
            <div>待初审</div>
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
export default connect(({ user }) => ({
  illegalCount: user.illegalCount,
}))(A1);
