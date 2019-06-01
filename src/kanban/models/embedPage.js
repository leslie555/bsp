/* eslint-disable camelcase */
import { message } from 'antd';

export default {
  namespace: 'embedPage',
  state: {
    list: [],
    activeKey: 'home',
  },
  effects: {},
  reducers: {
    updateState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },

    add(state, action) {
      const { selectedObj } = action.payload;
      let { list } = state;
      if (list.length >= 15) {
        message.error('最多打开15个页面');
        return {
          ...state,
        };
      } else {
        const { key, menuId, menuName, url, onClick } = selectedObj;
        if (list.find(item => item.menuId === key) || key === 'home') {
          // 如果菜单已存在
          return { ...state, list, activeKey: key };
        } else {
          list = [...list, { menuId, menuName, url, key, onClick }];
          return {
            ...state,
            activeKey: key,
            list,
          };
        }
      }
    },

    showMessageTip(state, action) {
      const { msgFrom } = action.payload;
      const { list, activeKey } = state;
      const { menuId, haveMessage } = msgFrom;

      const index = list.findIndex(item => item.menuId === menuId);
      const mitem = list[index];
      list.splice(index, 1, { ...mitem, haveMessage });
      if (index >= 0) {
        return {
          list,
          activeKey,
        };
      } else {
        return { list, activeKey };
      }
    },
  },
};
