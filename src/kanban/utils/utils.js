import { defferenceWith } from './ramdaUtils';

const R = require('ramda');

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  // 整理子节点路径
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
 * 提取出数组第三层的信息 例如第三次children 的数据即有跳转路径的，放在一起
 * [
 *  {
 *      "value": "01",
 *      "imageUrl": " ",
 *      "children": [
 *      {
 *          "handler": "",
 *          "value": "0101",
 *          "imageUrl": "images/3.jpg",
 *          "children": [
 *          {
 *              "handler": "",
 *              "value": "010101",
 *              "imageUrl": "images/3.jpg",
 *              "label": "支队综合监控"
 *          }],
 *          "label": "综合监控"
 *      }],
 *      "label": "态势监控"
 *  },
 *  ]
 */

function merges(arr1 = []) {
  // console.log(`菜单：  ${JSON.stringify(arr1.label) }  url:${JSON.stringify(arr1.handler) }`);
  return R.merge(arr1, {
    key: arr1.value,
    menuId: arr1.value,
    menuName: arr1.label,
    url: arr1.handler,
    onClick: arr1.onClick,
  });
}
export function isNotEmptyMenuObj(obj) {
  return !R.isEmpty(obj) && !R.isNil(obj) && !!obj.menuId;
}
/**
 *初始化第二个silder 数据 ，附加一些信息
 */
export function initMenuBoxes(initArray = []) {
  return R.compose(
    R.map(merges),
    R.filter(isNotEmptyMenuObj)
  )(initArray); // 后台可能传一些空值
}
export function extraArrayThirdInfo(array = []) {
  if (array[0]?.children[0]) {
    const aa = array.reduce((x, y) => x.concat(y.children), []);
    const layer2Info = aa.filter(x => x.handler); // 如果就到第二层

    const bb = aa.reduce((x, y) => x.concat(y.children), []);

    return R.map(merges)([...bb, ...layer2Info]);
  } else {
    return [];
  }
}

/**
 * 获取左下角全局菜单的跳转页面信息
 */
export function getPageInfo(val, menus) {
  const selectedDetail = R.find(R.propEq('value', val))(menus);
  if (!R.isEmpty(selectedDetail)) {
    return {
      key: selectedDetail.value,
      menuId: selectedDetail.value,
      menuName: selectedDetail.label,
      url: selectedDetail.handler,
      onClick: selectedDetail.onClick,
      activeKey: selectedDetail.value,
    };
  }
  return {};
}

export function isNotEmpty(obj) {
  return !R.isNil(obj) && !R.isEmpty(obj);
}

export function isNotNil(obj) {
  return !R.isNil(obj);
}

export function setDefaultTo(defaultv = [], obj) {
  return R.defaultTo(defaultv, obj);
}

export function findfromArray(val, array = []) {
  let selectedDetail = {};
  selectedDetail = R.find(R.propEq('menuId', val))(array);
  if (!isNotNil(selectedDetail)) {
    selectedDetail = R.find(R.propEq('menuId', Number(val)))(array);
  }
  if (isNotNil(selectedDetail)) {
    selectedDetail.key = selectedDetail.menuId;
  }

  return R.defaultTo([], selectedDetail);
}

/**
 * 根据菜单menu_name 去重 合并
 * @param arr1
 * @param arr2
 * @returns {*}
 */
export function unionMenus(arr1, arr2) {
  const bb = R.unionWith(R.eqBy(R.prop('menuName')), arr1, arr2);
  const result = [...arr1, ...R.difference(bb, arr1)];

  return result;
}
export function deleteMenus(arr1, arr2) {
  return arr1.filter(x => arr2.some(y => y.menuId === x.menuId));
}
/**
 * 值数组是否包含 某特定值

 * arr ['']
 */
export function isArrayHave(x, arr) {
  return R.contains(x, arr);
}

/**
 * 对象数组是否包含 某特定对象属性值
 * @param arr
 * @param x
 * @returns {boolean}
 */
export function isArrayObjHave(arr, x, field = 'menuName') {
  const selectedDetail = R.find(R.propEq(field, x))(arr);
  return !!isNotNil(selectedDetail);
}
export function announceTypes(key) {
  const arr = new Map([['0', '阅读'], ['1', '签收'], ['2', '通知']]);
  const value = arr.get(key) || '';
  return value;
}
export function isArray(val) {
  return R.type(val) == 'Array';
}

/* eslint-disable  no-new-func */
export function evil(str) {
  if (Array.isArray(str)) return str;
  return new Function(`return  ${str}`)();
}

/**
 * 根据 用户已选组件,所有可选组件过滤用户可拖拽组件
 * @param ABOXES
 * 例子: [
 {
   id: '1',
   componentName: 'A1',
   name: '待初审',
   ChartId: '1',
   type: 1,
   nsize: 1,
   parameterconfig: null,
 },
 {
   id: '2',
   componentName: 'A2',
   name: '待复审',
   ChartId: '2',
   type: 2,
   nsize: 1,
   parameterconfig: null,
 },
 ];
 * @param allCharts  所有可选组件 allCharts = [
 { component_id: 'A1', component_name: '重点企业分布柱状图', type: 'BWORKBENCH' },
 { component_id: 'A9', component_name: '本日任务完成数', type: 'AWORKBENCH' },
 ];


 * @param selected  用户已选
 * ['2', '20', '14', '10'];
 * @returns {*}
 */
/* eslint-disable  no-underscore-dangle */
export function getCanChooseAbox(ABOXES = [], allCharts = [], selected = []) {
  return R.compose(
    R.innerJoin((a, b) => a.componentName == b.component_id, R.__, allCharts),
    R.filter(x => selected.indexOf(x.ChartId) < 0)
  )(ABOXES);
}

export function getCanChooseBbox(BBOXES, allCharts, selected) {
  return R.compose(
    R.innerJoin((a, b) => a.componentName == b.component_id, R.__, allCharts),
    R.filter(x => selected.indexOf(x.ChartId) < 0)
  )(BBOXES);
}
export function deepClone(obj) {
  return R.clone(obj);
}
export function isIe() {
  const uaAutoScroll = navigator.userAgent.toLowerCase();
  return (uaAutoScroll.indexOf('msie') > -1 || uaAutoScroll.indexOf('rv:11') > -1);
}
