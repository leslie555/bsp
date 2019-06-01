import React, { Component } from 'react';
import { Input, Tag } from 'antd';
import PropTypes from 'prop-types';
import styles from './CommCarNumberInput.less';
import { searchInFront } from '../../utils/util';

/**
 * 号牌号码通用组件
 */
const allProvince = [
  '京',
  '津',
  '冀',
  '晋',
  '蒙',
  '辽',
  '吉',
  '黑',
  '沪',
  '苏',
  '浙',
  '皖',
  '闽',
  '赣',
  '鲁',
  '豫',
  '鄂',
  '湘',
  '粤',
  '桂',
  '琼',
  '川',
  '贵',
  '云',
  '渝',
  '藏',
  '陕',
  '甘',
  '青',
  '宁',
  '新',
  '港',
  '澳',
  '台',
  '空',
];
class CommCarNumberInput extends Component {
  constructor(props) {
    super(props);
    let { value } = props;
    if (!value) {
      value = '';
    }
    let province = value.slice(0, 1);
    let numValue = '';
    if (allProvince.indexOf(province) === -1) {
      province = '';
      numValue = value.slice(0);
    } else {
      numValue = value.slice(1);
    }
    this.state = {
      provBlockVisible: false,
      provinceValue: province,
      provinceInputValue: '',
      numValue,
    };
  }

  componentDidMount() {
    // 点击别处消失
    window.document.addEventListener('click', this.documentClick);
  }

  componentWillReceiveProps(nextProps) {
    let { value } = nextProps;
    if (!value) {
      value = '';
    }
    const province = value.slice(0, 1);

    if (allProvince.indexOf(province) === -1) {
      this.setState({
        provinceValue: '',
        numValue: value.slice(0),
      });
    } else {
      this.setState({
        provinceValue: province,
        numValue: value.slice(1),
      });
    }
  }

  componentWillUnmount() {
    window.document.removeEventListener('click', this.documentClick);
  }

  documentClick = () => {
    this.setState({
      provinceInputValue: '',
      provBlockVisible: false,
    });
  };

  /* 输入查询 */
  handleChange = e => {
    this.setState({
      provinceInputValue: e.target.value,
    });
  };

  /* 下面弹框点击事件 */
  handleProvinceClick = e => {
    const { numValue } = this.state;
    const { onChange } = this.props;
    e.nativeEvent.stopImmediatePropagation();
    // 显示到页面上
    let value = e.target.innerText;
    value = value === '空' ? '' : value;
    this.setState({
      provinceValue: value,
      provinceInputValue: '',
      provBlockVisible: false,
    });
    // 聚焦到第二个框
    this.numInputValue.input.focus();
    // 调用父组件的change事件，antd规定的
    onChange(value + numValue);
  };

  handleBlockShow = e => {
    // 组织和document的冒泡
    e.nativeEvent.stopImmediatePropagation();
    this.provinceInputValue.focus();
    this.setState({
      provBlockVisible: true,
    });
  };

  /* 第二个框的change事件 */
  handleNumChange = e => {
    const { value } = e.target;
    // if (/^\s*[0-9A-Za-z挂学警港澳]+$/.test(value)) {
    //   //value = value.slice(0, 7);
    //
    // }
    this.setState({
      numValue: value,
    });
  };

  handleBlur = e => {
    const { provinceValue } = this.state;
    const { onChange } = this.props;

    const value = e.target.value.toUpperCase();
    this.setState({
      numValue: value,
    });
    onChange(provinceValue + value);
  };

  render() {
    const { provBlockVisible, provinceValue, provinceInputValue, numValue } = this.state;
    const { disabled, maxLength } = this.props;
    const chch = [];
    allProvince.map((x, i) => chch.push({ id: i, name: x }));

    /* 做查询匹配 */
    const hh = searchInFront(chch, provinceInputValue);
    const provinceItem = [];
    for (const i in hh) {
      if (Object.prototype.hasOwnProperty.call(hh, i)) {
        const { name } = hh[i];
        provinceItem.push(
          <Tag
            key={i}
            style={{ backgroundColor: provinceValue === name ? '#3EACFA' : '#1A3165' }}
            onClick={this.handleProvinceClick}
          >
            {name}
          </Tag>
        );
      }
    }

    return (
      <div className={styles.normal}>
        <div className={styles.topBlock}>
          <div className={styles.input} onClick={disabled ? null : this.handleBlockShow}>
            <Input
              ref={input => {
                this.provinceInputValue = input;
              }}
              value={provinceInputValue}
              onChange={this.handleChange}
            />
            <span
              style={{
                display: provinceInputValue.length > 0 ? 'none' : 'block',
                opacity: provBlockVisible ? '0.4' : '1',
              }}
            >
              {provinceValue}
            </span>
          </div>
          <div className={styles.num}>
            <Input
              ref={input => {
                this.numInputValue = input;
              }}
              disabled={disabled}
              maxLength={maxLength - 1}
              onChange={this.handleNumChange}
              onBlur={this.handleBlur}
              value={numValue}
            />
          </div>
        </div>
        {provBlockVisible ? (
          <div className={styles.bottomBlock}>
            {provinceItem.length > 0 ? (
              provinceItem
            ) : (
              <p style={{ textAlign: 'center' }}>无匹配项</p>
            )}
          </div>
        ) : null}
      </div>
    );
  }
}
CommCarNumberInput.propTypes = {
  maxLength: PropTypes.number,
  disabled: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

CommCarNumberInput.defaultProps = {
  maxLength: 20,
  disabled: false,
};
export default CommCarNumberInput;
