import React, { Component } from 'react';
import { Tooltip, Icon } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import style from './index.less';
import { sectionTuiyan, getIcon } from '../../utils/sectionPillUtils.js';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
  },
  gridList: {
    width: 500,
    height: 450,
  },
  subheader: {
    width: '100%',
  },
});

/**
 * 一个占俩个的需要特别处理,现在的思路是变相再做一个,然后减小间距.好像是一个
 * @param count
 * @param index
 * @returns {*}
 */
function getCardColAttributes(count, index) {
  if (sectionTuiyan[count]) {
    return {
      oneTwoFlag: sectionTuiyan[count]?.oneTwoFlag,
      marginRight: sectionTuiyan[count]?.marginRight,
      tag: sectionTuiyan[count][index + 1]?.tag,
    };
  }
  return {
    oneTwoFlag: false,
    tag: false,
  };
}
function calcuCardCols(count, index) {
  if (sectionTuiyan[count]) {
    return sectionTuiyan[count][index + 1].col;
  }
  return 1;
}
function calcuCardRows(count, index) {
  if (sectionTuiyan[count]) {
    return sectionTuiyan[count][index + 1].row;
  }
  return 1;
}
function calcuListCols(count) {
  // 如果是只有一个的话,不这样,with =0
  if (count == 1) { return 1; }
  const mod3Zhengshu = Math.floor(count / 3);
  const mod3Yushu = count % 3;
  const add = mod3Yushu == 2 ? 1 : 0;
  return mod3Zhengshu * 2 + add;
}
function calcuStyle(count) {
  return {
    height: '100%',
  };
}
function calcuGridListStyle(count) {
  return {
    width: 124 * count,
  };
}

function CategoryGridList(props) {
  const { classes, titleData, menuSelectedHandler } = props;

  const cardStyle = {
    height: '100%',
  };
  return (
    <div className={style.main}>
      {titleData.map((thirdtitle) => {
        const count = thirdtitle?.children?.length || 1;

        const cols = calcuListCols(count);
        const { oneTwoFlag = false, marginRight = '30px' } = getCardColAttributes(count, 1);
        const width = cols * 142;
        return [
          <div className={style.secondeMenu} style={{ marginRight }}>
            <h3 className={style.title}>{getIcon(thirdtitle.label)}</h3>
            <GridList cellHeight={74} style={{ width: `${width}px` }} spacing={6} cols={cols}>
              {thirdtitle?.children?.map((tile, index) => {
                if (!getCardColAttributes(count, index).tag) {
                  return (
                    <GridListTile
                      key={tile.value}
                      cols={calcuCardCols(count, index)}
                      rows={calcuCardRows(count, index)}
                    >
                      <div
                        className={style.card}
                        style={{ lineHeight: `${calcuCardRows(count, index) * 74}px` }}
                        onClick={() => menuSelectedHandler(tile.value)}
                      >
                        {tile.label}
                      </div>
                    </GridListTile>
                  );
                }
              })}
            </GridList>
          </div>,

          <div style={{ display: oneTwoFlag ? 'block' : 'none' }} className={style.secondeMenuS}>
            <h3 className={style.title}>&nbsp;&nbsp;&nbsp;</h3>
            <GridList cellHeight={77} style={{ width: `${142}px` }} spacing={6} cols={1}>
              {thirdtitle?.children?.map((tile, index) => {
                if (getCardColAttributes(count, index).tag) {
                  return (
                    <GridListTile key={tile.value} cols={1} rows={2}>
                      <div
                        className={style.card}
                        style={{ lineHeight: '160px', height: '160px' }}
                        onClick={() => menuSelectedHandler(tile.value)}
                      >
                        {tile.label}
                      </div>
                    </GridListTile>
                  );
                }
              })}
            </GridList>
          </div>,
        ];
      })}
    </div>
  );
}

CategoryGridList.propTypes = {
  classes: PropTypes.object.isRequired,
  titleData: PropTypes.array,
};
CategoryGridList.defaultProps = {
  titleData: [],
};
export default withStyles(styles)(CategoryGridList);
