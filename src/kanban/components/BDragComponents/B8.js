/**
 *   6楼演示
 *   分布柱状图
 */
import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import classNames from 'classnames';
import moment from 'moment';

import { connect } from 'dva';
import { Card } from 'antd';
import { getPieDuoHuan } from '../Echarts/Options';
import styles from './Card.less';

export class B8 extends React.Component {
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
        title={<span className={styles.title}>警情来源分析</span>}
        className={bsytle}
      >
        <span>
          <ReactEcharts
            option={getPieDuoHuan(unitDistribution, themeId)}
            notMerge
            lazyUpdate
            style={bigStyle === 'big' ? { height: '270px' } : { height: '100px' }}
          />
        </span>
      </Card>
    );
  }
}
export default connect(({ chart, user }) => ({
  unitDistribution: { ineffective: 12, mistake: 7, effective: 6, relative: 10, unconfirm: 5 },
  themeId: user?.userTheme?.themeId,
}))(B8);
