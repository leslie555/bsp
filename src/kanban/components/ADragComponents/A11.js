/**
 *   6楼演示
 * Created by jzy on 2018/8/9 .
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, notification } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import styles from './Card.less';
import ExtractedCard from './ExtractedCard';
import { THEMES } from '../../config/constant';

export class A11 extends Component {
  componentWillMount() {
    const { dispatch } = this.props;
  }

  render() {
    const {
      bigStyle,
      test: { name, count },
      themeId,
    } = this.props;
    const num = count || 0;

    const cardleftClass = classNames({
      [styles.cardStyle2]: bigStyle === 'big',
      [styles.aSmallcardStyle2]: bigStyle != 'big',
    });
    const bg = `url('/HiatmpPro/kanban/acomponent${
      themeId == THEMES.dark ? '' : '1'
    }1.png') no-repeat center`;

    return (
      <div className={styles.normal}>
        {ExtractedCard(
          cardleftClass,
          name || '自动研判警情数',
          num,
          {
            background: bg,
          },
          themeId
        )}
      </div>
    );
  }
}
A11.propTypes = {};
A11.defaultProps = {};
export default connect(({ user }) => ({
  test: { count: 16 },
  themeId: user?.userTheme?.themeId,
}))(A11);
