import React from 'react';
import { Card } from 'antd';
import PropTypes from 'prop-types';
import styles from './Card.less';
import { THEMES } from '../../config/constant';

/**
 * 统一的A区域抽取
 * @param cardleftClass
 * @param name
 * @param num
 * @param background  背景图片
 * @returns {*}
 */

export default function ExtractedCard(cardleftClass, name, num, background, themeId) {
  return (
    <Card
      style={background}
      className={cardleftClass}
      title={<span style={{ color: 'white', marginLeft: '2.5%' }}>&nbsp;&nbsp;{name}</span>}
      bordered={false}
      bodyStyle={{ padding: '2px' }}
    >
      <div className={styles.acontent}>
        <span>{num}</span>
        <span>&nbsp;项</span>
      </div>
    </Card>
  );
}
