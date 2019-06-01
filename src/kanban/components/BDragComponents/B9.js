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

import { getline } from '../Echarts/Options';
import styles from './Card.less';

export class B9 extends React.Component {
  componentWillMount() {
    const { dispatch, bigStyle } = this.props;
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
        title={<span className={styles.title}>警情时段分析</span>}
        className={bsytle}
      >
        <span>
          <ReactEcharts
            option={getline(unitDistribution, themeId)}
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
  unitDistribution: chart.eventCountAudited,
  themeId: user?.userTheme?.themeId,
}))(B9);
