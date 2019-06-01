import { Icon } from 'antd';

export const sectionTuiyan = {
  1: { 1: { col: 1, row: 2 } },

  2: {
    1: { col: 1, row: 1 },

    2: { col: 1, row: 1 },
  },

  3: {
    1: { col: 2, row: 1 },

    2: { col: 1, row: 1 },

    3: { col: 1, row: 1 },
  },
  4: {
    1: { col: 2, row: 1 },

    2: { col: 1, row: 2 / 2, tag: true },

    3: { col: 1, row: 1 },
    4: { col: 1, row: 1 },
    oneTwoFlag: true,
    marginRight: '5px',
  },
  5: {
    1: { col: 2, row: 1 },

    2: { col: 1, row: 1 },

    3: { col: 1, row: 1 },
    4: { col: 1, row: 1 },
    5: { col: 1, row: 1 },
  },
  6: {
    1: { col: 2, row: 1 },

    2: { col: 1, row: 1 },

    3: { col: 1, row: 1 },
    4: { col: 1, row: 1 },
    5: { col: 1, row: 1 },
    6: { col: 2, row: 1 },
  },
  7: {
    1: { col: 2, row: 1 },

    2: { col: 1, row: 1 },

    3: { col: 1, row: 1 },
    4: { col: 1, row: 2 / 2, tag: true },
    5: { col: 1, row: 1 },
    6: { col: 1, row: 1 },
    7: { col: 2, row: 1 },
    oneTwoFlag: true,
  },
  8: {
    1: { col: 2, row: 1 },

    2: { col: 1, row: 1 },

    3: { col: 1, row: 1 },
    4: { col: 1, row: 1 },
    5: { col: 1, row: 1 },
    6: { col: 1, row: 1 },
    7: { col: 2, row: 1 },
    8: { col: 1, row: 1 },
  },

  9: {
    1: { col: 2, row: 1 },

    2: { col: 1, row: 1 },

    3: { col: 1, row: 1 },
    4: { col: 2, row: 1 },
    5: { col: 1, row: 1 },
    6: { col: 1, row: 1 },
    7: { col: 2, row: 1 },
    8: { col: 1, row: 1 },
    9: { col: 1, row: 1 },
  },

  10: {
    1: { col: 2, row: 1 },

    2: { col: 1, row: 1 },

    3: { col: 1, row: 1 },
    4: { col: 2, row: 1 },
    5: { col: 1, row: 2 / 2 },
    6: { col: 1, row: 1 },
    7: { col: 1, row: 1 },
    8: { col: 2, row: 1 },
    9: { col: 1, row: 1 },
    10: { col: 1, row: 1 },
  },

  11: {
    1: { col: 2, row: 1 },

    2: { col: 1, row: 1 },

    3: { col: 1, row: 1 },
    4: { col: 2, row: 1 },
    5: { col: 1, row: 1 },
    6: { col: 1, row: 1 },
    7: { col: 1, row: 1 },
    8: { col: 2, row: 1 },
    9: { col: 1, row: 1 },
    10: { col: 1, row: 1 },
    11: { col: 1, row: 1 },
    marginRight: '300px',
  },

  12: {
    1: { col: 2, row: 1 },

    2: { col: 1, row: 1 },

    3: { col: 1, row: 1 },
    4: { col: 2, row: 1 },
    5: { col: 1, row: 1 },
    6: { col: 1, row: 1 },
    7: { col: 1, row: 1 },
    8: { col: 1, row: 1 },
    9: { col: 2, row: 1 },
    10: { col: 1, row: 1 },
    11: { col: 1, row: 1 },
    12: { col: 2, row: 1 },
    marginRight: '300px',
  },
  13: {
    1: { col: 2, row: 1 },

    2: { col: 1, row: 1 },

    3: { col: 1, row: 1 },
    4: { col: 2, row: 1 },
    5: { col: 1, row: 1 },
    6: { col: 1, row: 1 },
    7: { col: 1, row: 2 / 2 },
    8: { col: 1, row: 1 },
    9: { col: 1, row: 1 },
    10: { col: 2, row: 1 },
    11: { col: 1, row: 1 },
    12: { col: 1, row: 1 },
    13: { col: 2, row: 1 },
  },
};
/* eslint-disable import/no-dynamic-require */
const menuIcon = new Map([
  ['缉查布控', 'jibk'],
  ['交通预案', 'jtya'],
  ['警情处置', 'jqcz'],
  ['警卫任务', 'jwrw'],
  ['诱导发布', 'ydfb'],
]);
export function getIcon(label) {
  if (menuIcon.get(label)) {
    return (
      <span>
        <span
          style={{
            color: 'white',
            float: 'left',
            width: '40px',
            height: '40px',
            background: `url('/HiatmpPro/kanban/${menuIcon.get(label)}.png') no-repeat center`,
          }}
        />
        <span style={{ display: 'inline-block', lineHeight: '40px', color: 'white' }}>{label}</span>
      </span>
    );
  }

  return (
    <span
      style={{
        color: 'white',
        display: 'inline-block',
        height: '40px',
      }}
    >
      <Icon type="pushpin-o" />&nbsp;&nbsp;&nbsp;{label}
    </span>
  );
}

/**
 * 左侧拖拽menu tree 获取icon
 * @param label
 * @returns {*}
 */
export function getMenuIcon(label) {
  const menuIcons = new Map([
    ['交管业务', 'paper-clip'],
    ['情报研判', 'tags-o'],
    ['指挥调度', 'share-alt'],
    ['执勤监督', 'user-add'],
    ['日常勤务', 'picture'],
    ['运维管理', 'tag-o'],
  ]);
  if (menuIcons.get(label)) {
    return <Icon type={menuIcons.get(label)} />;
  }
  return <span />;
}
