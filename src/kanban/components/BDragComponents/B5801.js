/**
 *   by jzy on 2018/8/10.
 *   5.8需求
 *   获取当天到当前时刻警情审核总数以及有效警情数、无效警情数、相关警情数、误报警情数、无法确认警情数
 */
import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import classNames from 'classnames';
import { connect } from 'dva';
import { Card } from 'antd';
import { getEventCountsAuditedOption } from '../Echarts/Options';
import styles from './Card.less';

export class B5801 extends React.Component {
  componentWillMount() {
    const { dispatch, bigStyle } = this.props;
    // 拖拽时候不要更新数据
    if (bigStyle == 'small') {
      return;
    }
    dispatch({
      type: 'chart/getEventCountsAudited',
      payload: {},
    });
  }

  render() {
    const { bigStyle, eventCountAudited = {}, themeId } = this.props;
    const bsytle = classNames({
      [styles.bcardStyle]: bigStyle == 'big',
      [styles.bSmallcardStyle]: bigStyle != 'big',
    });

    return (
      <Card
        bordered={false}
        title={<span className={styles.title}>事故警情数组成</span>}
        className={bsytle}
      >
        <span>
          <ReactEcharts
            option={getEventCountsAuditedOption(eventCountAudited, themeId)}
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
  eventCountAudited: chart.eventCountAudited,
  themeId: user?.userTheme?.themeId,
}))(B5801);
