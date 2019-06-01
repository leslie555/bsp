/**
 *   by 曹禹 on 2018/4/10 0015.
 *   占路施工-占路施工申请趋势
 */
import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import { connect } from 'dva';
import classNames from 'classnames';
import { Card } from 'antd';
import { getDigroadChartDataOption } from '../Echarts/Options';
import styles from './Card.less';

/* eslint-disable   */
export class B10 extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.digroadChartData === null) {
    }
  }

  render() {
    const { bigStyle } = this.props;
    const bsytle = classNames({
      [styles.bcardStyle]: bigStyle == 'big',
      [styles.bSmallcardStyle]: bigStyle != 'big',
    });
    return (
      <div>
        <Card
          bordered={false}
          title={<span className={styles.title}>占路施工申请趋势</span>}
          bodyStyle={bigStyle === 'big' ? { height: '19rem' } : { height: '11rem' }}
          className={bsytle}
        >
          <span>
            <ReactEcharts
              option={getDigroadChartDataOption(this.props.digroadChartData)}
              notMerge
              lazyUpdate
              style={bigStyle === 'big' ? { height: '250px' } : { height: '130px' }}
            />
          </span>
        </Card>
      </div>
    );
  }
}
export default connect(state => ({
  digroadChartData: state.chart.digroadChartData,
}))(B10);
