/**
 * Created by lichao on 2018-5-24.
 * 这是个自定义input处理组件
 */
import React from 'react';
import { Input } from 'antd';

const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
export default function CustomInput(props) {
  const { id, value, onChange, maxLength, disabled } = props;
  // 报警手机，只能输入数字，没到11为自动加','
  function pushphone(e) {
    const oldValue = e.target.value;
    const currentValue = oldValue.slice(-1);
    let InputValue;
    let setVaule;

    if (arr.indexOf(currentValue.toString()) === -1 || oldValue.length > 59) {
      InputValue = oldValue.slice(0, -1);
      setVaule = InputValue;
    } else {
      InputValue = [].slice.call(oldValue);
      InputValue = InputValue.filter((item) => {
        return item !== ',';
      });
      if (InputValue.length > 11) {
        InputValue.splice(11, 0, ',');
        if (InputValue.length > 23) {
          InputValue.splice(23, 0, ',');
          if (InputValue.length > 35) {
            InputValue.splice(35, 0, ',');
            if (InputValue.length > 47) {
              InputValue.splice(47, 0, ',');
            }
          }
        }
      }
      setVaule = InputValue.join('');
    }


    onChange(setVaule);
  }
  // 转换大写 最多输入15位
  function coercivecode(e) {
    const setValue = e.target.value.toUpperCase().slice(0, 15);
    onChange(setValue);
  }
  // 转换大写 最多输入20位
  function penaltycode(e) {
    const setValue = e.target.value.toUpperCase().slice(0, 20);
    onChange(setValue);
  }
  let callBack;
  if (id === 'pushphone') {
    callBack = pushphone;
  } else if (id === 'coercivecode') {
    callBack = coercivecode;
  } else if (id === 'penaltycode') {
    callBack = penaltycode;
  }
  return (
    <Input maxLength={maxLength} disabled={disabled} onChange={callBack} value={value} type="text" />
  );
}
