
import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import classNames from 'classnames';
import styles from './Card.less';

export class A5 extends React.Component {
  render() {
    const { bigStyle, illegalCount } = this.props;
    let num = '';
    const number = illegalCount?.statusCounts?.filter(x => x.status == '20') || [];
    if (number.length == '1') {
      num = number[0].count;
    }
    const cardleftClass = classNames({
      [styles.cardStyle]: bigStyle === 'big',
      [styles.aSmallCardStyle]: bigStyle != 'big',
    });


    return (
      <div>
        <Card className={cardleftClass}>
          <div className={styles.aContentImg}>
            <img alt="未找到" src={require('../../assets/重点企业.png')} />
            <div>重点企业</div>
          </div>
          <div className={styles.aContentRight}>
            <span style={{ color: '#f66' }}>{num || '0'}</span>
            <span style={{ fontSize: 16 }}>&nbsp;项</span>
          </div>
        </Card>
      </div>
    );
  }
}
export default connect(({ user }) => ({
  illegalCount: user.illegalCount,
}))(A5);
