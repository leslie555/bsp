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

import { getRadar } from '../Echarts/Options';
import styles from './Card.less';

export class B7 extends React.Component {
  componentWillMount() {
    const { dispatch, bigStyle } = this.props;
    // 拖拽时候不要更新数据
  }

  render() {
    const today = moment().format('MM月DD日');
    const yestoday = moment()
      .subtract(1, 'day')
      .format('MM月DD日');
    const twodaysago = moment()
      .subtract(2, 'day')
      .format('MM月DD日');

    const { bigStyle, unitDistribution = {}, themeId } = this.props;
    const data = {
      legenddata: [today, yestoday],
    };
    const bsytle = classNames({
      [styles.bcardStyle]: bigStyle == 'big',
      [styles.bSmallcardStyle]: bigStyle != 'big',
    });
    return (
      <Card
        bordered={false}
        title={<span className={styles.title}>警情类型分析</span>}
        className={bsytle}
      >
        <span>
          <ReactEcharts
            option={getRadar(data, themeId)}
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
  unitDistribution: {},
  themeId: user?.userTheme?.themeId,
}))(B7);
