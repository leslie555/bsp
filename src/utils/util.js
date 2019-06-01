import { Select } from 'antd';
import { makePy } from './pinyin';

const { Option } = Select;

export function isdate(str) {
  if (str == null || str == 'null') return false;
  const result1 = str.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
  const result2 = str.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/);
  const result3 = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (result1 == null && result2 == null && result3 == null) {
    return false;
  } else {
    return true;
  }
}
export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach((node) => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

/**
 * 计算重复字符数公用函数
 * @param str
 * @param c
 * @returns {number}
 */
export function countChars(str, c) {
  let count = 0;
  for (let i = 0; i < str.length; i += 1) {
    if (str.charAt(i) === c) {
      count += 1;
    }
  }
  return count;
}

export function carNumRegExp() {
  return new RegExp(
    /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4,5}[A-Z0-9挂学警港澳]{1}$/i
  );
}

/* 座机号验证规则 */
export function mobileNumRegExp() {
  return new RegExp(/^((0\d{2,3}-\d{7,8})|(1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}))$/);
}

/**
 * 输入查询条件，进行模糊查询和拼音首字母查询
 * sourceList: [id:'',name:'']
 * searchStr 查询条件
 * @returns {list} 查询结果
 */

export function genEnumOption(enumsid, enums = []) {
  const options = [];
  for (let i = 0; i < enums.length; i += 1) {
    if (enums[i].enumtypeid === enumsid) {
      options.push(
        <Option
          key={`enuma-${enums[i].enumvalue}`}
          value={enums[i].enumvalue}
        >
          {enums[i].enumname}
        </Option>
      );
    }
  }
  return options;
}

export function searchInFront(sourceList = [], searchStr) {
  // 通过拼音首字母查询的结果
  let resultList1 = [];
  // 普通模糊查询的结果
  let resultList2 = [];
  // 返回的结果
  let resultList = [];
  if (searchStr != null && searchStr != '') {
    resultList1 = sourceList.filter((element) => {
      const firstPy = makePy(element.name);
      let cc = false;
      for (const i of firstPy) {
        if (i.match(searchStr.toUpperCase())) {
          cc = true;
        }
      }
      return cc;
    });
    resultList = resultList1;
  } else {
    resultList = sourceList;
  }
  // 正常的汉字以及其他的字母匹配，如果resultList1与原数组长度相等，则不用继续查询，直接返回即可
  if (resultList.length != sourceList.length) {
    resultList2 = sourceList.filter((element) => {
      return element.name.match(searchStr);
    });
  }
  if (resultList2.length != '0') {
    for (const { id, name } of resultList2) {
      resultList.push({ id, name });
    }
  }
  return resultList;
}
