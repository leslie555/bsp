/**
 *   6楼演示
 *   分布柱状图
 */
import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import classNames from 'classnames';
import { connect } from 'dva';
import { Card } from 'antd';
import moment from 'moment';

import { getLine } from '../Echarts/Options';
import styles from './Card.less';

export class B6 extends React.Component {
  componentWillMount() {
    const { dispatch, bigStyle } = this.props;
    // 拖拽时候不要更新数据
  }

  render() {
    const { bigStyle, unitDistribution = {}, themeId } = this.props;
    const bsytle = classNames({
      [styles.bcardStyle]: bigStyle == 'big',
      [styles.bSmallcardStyle]: bigStyle != 'big',
    });
    return (
      <Card
        bordered={false}
        title={<span className={styles.title}>巡检员工作量</span>}
        className={bsytle}
      >
        <span>
          <ReactEcharts
            option={getLine(unitDistribution, themeId)}
            notMerge
            lazyUpdate
            style={bigStyle === 'big' ? { height: '240px' } : { height: '100px' }}
          />
        </span>
      </Card>
    );
  }
}
export default connect(({ chart, user }) => ({
  unitDistribution: {
    red: [
      { deptno: '440604220800', total: 1 },
      { deptno: '440604220900', total: 10 },
      { deptno: '440604221000', total: 21 },
      { deptno: '440604221100', total: 12 },
    ],
    yellow: [
      { deptno: '440604220800', total: 12 },
      { deptno: '440604220900', total: 22 },
      { deptno: '440604221000', total: 3 },
      { deptno: '440604221100', total: 8 },
    ],
    green: [
      { deptno: '440604220800', total: 12 },
      { deptno: '440604220900', total: 22 },
      { deptno: '440604221000', total: 3 },
      { deptno: '440604221100', total: 8 },
    ],
  },
  themeId: user?.userTheme?.themeId,
}))(B6);
