import * as policeDeployService from 'services/policeDeploy';
import { position, offset, removeDom } from 'utils/domOper';

// 问题数组
let questionArr = [];
// 第几页问题，第一页默认为0页，当前页初始问题在questionArr下标为3*currentQuePage
const currentQuePage = 0;
// 每页显示问题个数
const pageQueNum = 3;
// 存储已经选择问题答案key：问题id，value:选项id@,id
const answerMap = {};
// 存储已选问题的答案选项序号key:问题id，value:选项序号@选项序号
const answerOrderMap = {};
// 辅助决策信息，包含描述、派警、信号控制、发诱导等信息
let adviceAction;
const advicePoliceNum = 0;
// 路段信息
let sectionInfo;
// 占路施工信息
let digroadInfo;

/**
 * 获取周边信息
 */
export function getSurroundInfo(sectionId) {
  policeDeployService.getSurroundInfoRequest({ sectionId }).then(data => {
    if (data.result == false) {
      alert('获取初始化问题失败！');
    } else {
      sectionInfo = data.sectionInfoVo;
      digroadInfo = data.digroadVo;
      showSurroundInfo();
    }
  });
}

/**
 * 获取根问题
 */
export function getRootQuestion(caseType, sectionId) {
  policeDeployService.getRootQuestionRequest({ caseType, sectionId }).then(data => {
    if (data.result == false) {
      alert('获取初始化问题失败！');
    } else {
      questionArr = [];
      questionArr.push(data.questionVO);
      showQuestion();
      showHistoryQuestion();
    }
  });
}
/**
 * 显示周边信息
 */
function showSurroundInfo() {
  let surroundInfo = '';
  let count = 1;

  if (sectionInfo != null) {
    const {
      sectionName,
      sectionLevel,
      laneNums,
      approachdirect,
      congestionLevel,
      isOneway,
      speed,
      volume,
      downLkmc,
      upLkmc,
    } = sectionInfo;

    if (sectionName != null && sectionName != '') {
      surroundInfo += `${(count += 1)}. 路段名称：${sectionName}<br>`;
    }

    if (sectionLevel != null && sectionLevel != '') {
      surroundInfo += `${(count += 1)}. 道路等级: ${sectionLevel}<br>`;
    }

    if (congestionLevel != null && congestionLevel != '') {
      surroundInfo += `${(count += 1)}. 拥堵等级: ${congestionLevel}<br>`;
    }

    if (isOneway != null && isOneway != '') {
      surroundInfo += `${(count += 1)}. 是否单行道: ${isOneway == '0' ? '否' : '是'}<br>`;
    }

    if (approachdirect != null && approachdirect != '') {
      surroundInfo += `${(count += 1)}. 进口方向: ${approachdirect}<br>`;
    }

    if (upLkmc != null && upLkmc != '') {
      surroundInfo += `${(count += 1)}. 上游路口: ${upLkmc}<br>`;
    }

    if (downLkmc != null && downLkmc != '') {
      surroundInfo += `${(count += 1)}. 下游路口: ${downLkmc}<br>`;
    }

    if (laneNums != null && laneNums != '') {
      surroundInfo += `${(count += 1)}. 车道数: ${laneNums}<br>`;
    }
  }

  if (digroadInfo != null) {
    const { currentDigroad, downDigroad, upDigroad } = digroadInfo;

    if (currentDigroad != null) {
      for (let i = 0; i < currentDigroad.length; i += 1) {
        surroundInfo += `${(count += 1)}. 当前路段施工信息：${currentDigroad[i].PROJECTNAME}<br>`;
      }
    }

    if (downDigroad != null) {
      for (let i = 0; i < downDigroad.length; i += 1) {
        surroundInfo += `${(count += 1)}. 下游路口施工信息：${downDigroad[i].PROJECTNAME}<br>`;
      }
    }

    if (upDigroad != null) {
      for (let i = 0; i < upDigroad.length; i += 1) {
        surroundInfo += `${(count += 1)}. 上游路口施工信息：${upDigroad[i].PROJECTNAME}<br>`;
      }
    }
  }

  document.getElementById('roundInfo').innerHTML = surroundInfo;
}
/**
 * 显示问题及选项
 */
function showQuestion() {
  clearQuestionShow();
  let index = 1;
  // 显示问题所在数组中开始下标
  const beginArrIndex = pageQueNum * currentQuePage;
  const queOrder = beginArrIndex;
  const isHasDefaultChecked = false;
  // 同时显示三个问题
  for (let i = beginArrIndex; i < beginArrIndex + pageQueNum; i += 1) {
    if (i >= questionArr.length) {
      break;
    }

    /*  if (showSingleQuestion(index, questionArr[i], ++queOrder)) {
      isHasDefaultChecked = true;
    } */

    index += 1;
  }

  // 如果有系统默认推荐的答案，自动获取处置建议
  if (isHasDefaultChecked) {
    // getAdvice();
  }

  return isHasDefaultChecked;
}
/**
 * 获取历史记录显示列表
 * @returns 历史记录显示列表
 */
function showHistoryQuestion() {
  let html = '';
  let index = 1;

  if (questionArr != null) {
    for (let i = 0; i < questionArr.length; i += 1) {
      html +=
        ` <tr><td><div style='max-width:50px'>问题${index}</div></td><td style='text-align:left;'><div style='word-wrap:break-word;max-width:190px;'>${
          questionArr[i].questionDes
        }</div></td>` +
        `<td style='text-align:left;'><div style='word-wrap:break-word;max-width:100px;'> getItemDes(
          questionArr[i]
        )</div></td></tr>`;
      index += 1;
    }
  }
  removeDom(document.querySelector('#historyQuestion tr:gt(0)'));
  document.querySelector('#historyQuestion tr:last').insertAdjacentHTML('afterend', html);
}
/**
 * 清空问题显示
 */
function clearQuestionShow() {
  for (let i = 1; i <= pageQueNum; i += 1) {
    document.getElementById(`questionIndex${i}`).innerHTML = '';
    document.getElementById(`questionDes${i}`).innerHTML = '';
    document.getElementById(`itemList${i}`).innerHTML = '';
    document.getElementById(`checkHelp${i}`).classList.add('hidden');
  }
}
