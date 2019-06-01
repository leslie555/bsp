import moment from 'moment';
import ItemTypes from '../layouts/ItemTypes';
import { isNotEmpty, isNotEmptyMenuObj } from './utils';

const R = require('ramda');
/**
 *
 * @param initArray 初始化的数组
 * @param initObj 不足补充的数据样式
 * @param count 数组对象个数
 * @constructor
 */
export function initMenus(initArray = [], initObj = {}, count = 10) {
  if (R.isEmpty(initArray)) {
    return [
      { id: '1', accepts: [ItemTypes.MENU], lastDroppedItem: null },
      { id: '2', accepts: [ItemTypes.MENU], lastDroppedItem: null },
      { id: '3', accepts: [ItemTypes.MENU], lastDroppedItem: null },
      { id: '4', accepts: [ItemTypes.MENU], lastDroppedItem: null },
      { id: '5', accepts: [ItemTypes.MENU], lastDroppedItem: null },
      { id: '6', accepts: [ItemTypes.MENU], lastDroppedItem: null },
      { id: '7', accepts: [ItemTypes.MENU], lastDroppedItem: null },
      { id: '8', accepts: [ItemTypes.MENU], lastDroppedItem: null },
      { id: '9', accepts: [ItemTypes.MENU], lastDroppedItem: null },
      { id: '10', accepts: [ItemTypes.MENU], lastDroppedItem: null },
    ];
  } else {
    const result = [];
    const j = initArray.length > count ? count : initArray.length;
    for (let i = 1; i <= count; i += 1) {
      const item = JSON.parse(JSON.stringify(initObj));
      item.id = i;
      if (i <= initArray.length) {
        item.accepts = ['no'];
        item.lastDroppedItem = { name: initArray[i - 1].menuName };
      }
      result.push(item);
    }
    return result;
  }
}

function merges(arr1) {
  return R.merge(arr1, {
    id: arr1.menuId,
    type: ItemTypes.MENU,
    menuId: arr1.value,
    menuName: arr1.label,
  });
}
/**
 *初始化第二个silder 数据 ，附加一些信息
 */
export function initMenuBoxes(initArray = []) {
  return R.compose(
    R.map(merges),
    R.filter(isNotEmptyMenuObj)
  )(initArray); // 后台可能传一些空值
  //  return R.map(merges)(initArray);
}
/**
 *处理右侧菜单的点击事件
 */
export function initmenu4Use(initArray = []) {
  const dynamicMenus = [
    { name: '首页', icon: 'home', path: 'embedPage', key: 'home', search: 'home' },
  ];
  const dynamicArr = initArray.map(x => {
    return {
      key: x.menuId,
      icon: 'paper-clip',
      path: 'embedPage',
      name: x.menuName,
      url: x.url,
      onClick: x.onClick,

      search: x.url,
    };
  });

  return [...dynamicMenus, ...dynamicArr];
}

export function initDroppedMenuBoxNames(arr = []) {
  return arr;
}

/**
 *
 * @param initArray
 * @param initObj
 * @param count 初始化的数组大小
 * @returns {*}
 */
export function initAcomponent(initArray = [], initObj = {}, count = 5) {
  if (R.isEmpty(initArray)) {
    // return  R.repeat( initObj,count);
    return [
      {
        id: '1',
        accepts: [ItemTypes.AWORKBENCH],
        lastDroppedItem: null,
        nsize: '1',
        position: '1',
      },
      {
        id: '2',
        accepts: [ItemTypes.AWORKBENCH],
        lastDroppedItem: null,
        nsize: '1',
        position: '2',
      },
      {
        id: '3',
        accepts: [ItemTypes.AWORKBENCH],
        lastDroppedItem: null,
        nsize: '1',
        position: '3',
      },
      {
        id: '4',
        accepts: [ItemTypes.AWORKBENCH],
        lastDroppedItem: null,
        nsize: '1',
        position: '4',
      },
    ];
  } else {
    const result = [];
    const j = initArray.length > count ? count : initArray.length;
    for (let i = 1; i <= count; i += 1) {
      const item = JSON.parse(JSON.stringify(initObj));
      item.id = i;
      if (i <= initArray.length) {
        item.accepts = ['no'];
        item.nsize = 1;
        item.position = initArray[i - 1].position;
        item.lastDroppedItem = initArray[i - 1].component_id;
      }
      result.push(item);
    }
    return result;
  }
}
/**
 *  获得回显中的chartId数据
 * @param initArray
 * @param initObj
 * @param count
 * @returns {*}
 */
/* eslint-disable camelcase */
export function initChartId(initArray = []) {
  if (R.isEmpty(initArray)) {
    return [];
  } else {
    return initArray.map(x => `${x?.component_id}`);
  }
}
export function initBcomponent(initArray = [], initObj = {}, count = 10) {
  if (R.isEmpty(initArray)) {
    return [
      {
        id: '1',
        accepts: [ItemTypes.BWORKBENCH],
        lastDroppedItem: null,
        nsize: '1',
        position: '1',
      },
      {
        id: '2',
        accepts: [ItemTypes.BWORKBENCH],
        lastDroppedItem: null,
        nsize: '1',
        position: '2',
      },
      {
        id: '3',
        accepts: [ItemTypes.BWORKBENCH],
        lastDroppedItem: null,
        nsize: '1',
        position: '3',
      },
      {
        id: '4',
        accepts: [ItemTypes.BWORKBENCH],
        lastDroppedItem: null,
        nsize: '1',
        position: '4',
      },
      {
        id: '5',
        accepts: [ItemTypes.BWORKBENCH],
        lastDroppedItem: null,
        nsize: '1',
        position: '5',
      },
      {
        id: '6',
        accepts: [ItemTypes.BWORKBENCH],
        lastDroppedItem: null,
        nsize: '1',
        position: '6',
      },
      {
        id: '7',
        accepts: [ItemTypes.BWORKBENCH],
        lastDroppedItem: null,
        nsize: '1',
        position: '7',
      },
      {
        id: '8',
        accepts: [ItemTypes.BWORKBENCH],
        lastDroppedItem: null,
        nsize: '1',
        position: '8',
      },
      {
        id: '9',
        accepts: [ItemTypes.BWORKBENCH],
        lastDroppedItem: null,
        nsize: '1',
        position: '9',
      },
      {
        id: '10',
        accepts: [ItemTypes.BWORKBENCH],
        lastDroppedItem: null,
        nsize: '1',
        position: '10',
      },
    ];
  } else {
    const result = [];
    // TODO 如果initArray超过count 处理，需求是说不会超过6个
    const j = initArray.length > count ? count : initArray.length;
    for (let i = 1; i <= count; i += 1) {
      const item = JSON.parse(JSON.stringify(initObj));
      item.id = i;
      if (i <= initArray.length) {
        item.accepts = ['no'];
        item.lastDroppedItem = initArray[i - 1].component_id;
        item.nsize = initArray[i - 1].nsize;
        item.position = i;
      }
      result.push(item);
    }
    return result;
  }
}

/* eslint-disable  no-unused-expressions */

export function getContainerTip(isOver, canDrop, isUsed, positionTip) {
  const tip = do {
    if (canDrop) {
      if (isOver) {
        ('可以拖动到该区域');
      } else {
        positionTip;
      }
    } else if (isUsed) {
      (' ');
    } else {
      positionTip;
    }
  };
  return tip;
}
/* eslint-disable  no-unused-expressions */
export function getBackgroundColor(isOver, canDrop) {
  const backgroundColor = do {
    if (isOver && canDrop) {
      ('#40C4FF');
    } else if (isOver && !canDrop) {
      ('#F44336');
    } else {
      ('transparent');
    }
  };
  return backgroundColor;
}
