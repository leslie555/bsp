/* eslint-disable   no-underscore-dangle */
import $ from 'jquery';
import * as policeDeployService from 'services/policeDeploy';
import { position, offset } from 'utils/domOper';
import { getSurroundInfo, getRootQuestion } from './expertControl';

import {
  ROUND_DECISION_POLICE_CHECKBOX,
  ROUND_CHECK_POLICE_CHECKBOX,
  NEAREST_POLICE_MAP,
  DECISION_POLICE_MAP,
  CHECK_POLICE_MAP,
} from '../../../../config/constant';
import { audioCall, showSendMsgDiv, videoCall } from './msgtomds';

// 发送短信方式phone：向手机发 app:向终端应用程序发
let sendMsgFlag = '';
let isActiveObject = false;
/** **************变量开始********************** */
const istFlag = '0';
let isMsgEdit = false;
// 推荐的具体事故距离最近的警察
const nearestpoliceArr = [];
// 辅助决策地图圈选的警察
const circlePoliceArr = [];
// 地图圈选视频
const circleVideoArr = [];
// 辅助判断地图圈选警察
const circleCheckPoliceArr = [];
// 发送短信的手机号
const sendMsgPhones = '';
// 警情x坐标
let caseLon;
// 警察y坐标
let caseLat;
// 警情描述
let caseDes;
// 警情所在路段id
let sectionId;
// 警情类型
let caseType;
// 存储地图上显示图标
const monitorMap = {};
// 地图上一个图标
let monitor;
// 警情id
let caseid;
// 警情方向
let casedirection;
// 警情时间
let casetime;
/** **************变量结束********************** */
/**
 * 获取url传递参数
 * @param name 参数key值
 * @returns 参数value值
 */
function GetQueryString(name) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}
/**
 * 获取警情信息
 */
function getCaseDetail() {
  policeDeployService.getCaseDetailRequest({ caseid }).then(data => {
    if (data.result == false) {
      alert('获取警情信息失败！');
    } else {
      const { caseinfo } = data;

      let caseStr = '';

      if (caseinfo.caseDes != null) {
        caseStr += `警情描述：${caseinfo.caseDes}<br>`;
      }

      if (caseinfo.caseType != null) {
        caseStr += `警情类型：${caseinfo.caseType}<br>`;
      }

      if (caseinfo.caseTime != null) {
        caseStr += `报警时间：${caseinfo.caseTime}<br>`;
      }

      if (caseinfo.caseLevel != null) {
        caseStr += `警情级别：${caseinfo.caseLevel}<br>`;
      }

      document.getElementById('questionDesId').innerHTML = caseStr;
    }
  });
}

/**
 * 参数初始化
 */
export function policeDeployMapinit() {
  const police = GetQueryString('policeCase');
  // caseArr[0]:主键,caseArr[1]:警情内容,caseArr[2]:警情类型,caseArr[3]:报警时间,
  // caseArr[4]:警情地点x坐标,caseArr[5]:警情地点y坐标
  // caseArr[6]:路段ID
  // const caseArr = police.split(',');
  const caseArr = [11, '$1212', 33, 44, 55, 66, 77, 88, 99]; // test
  caseid = caseArr[0];
  caseType = caseArr[2];
  caseDes = caseArr[1].replace('$', ',');
  casetime = caseArr[3];
  caseLon = caseArr[4];
  caseLat = caseArr[5];
  sectionId = caseArr[6];
  casedirection = caseArr[7];

  // getCaseDetail();//test
  // getRootQuestion(caseType, sectionId);
  // getSurroundInfo(sectionId);
}

/**
 * 显示视频请求图层
 * @param msdid 警员id
 * @param policename 警员名称
 * @param pos 警员坐标
 */
export function openVideo(msdid, policename, pos, leftWidth = 0, policeDeployMap) {
  console.log(`++++++++++sectionId ${sectionId} `);
  if (!isActiveObject) {
    if (!(!!window.ActiveXObject || 'ActiveXObject' in window)) {
      alert('请用IE浏览器打开，并确认已经安装视频控件');
      // return ;
    }
    isActiveObject = true;
  }

  // 视频拉起成功的回调
  let line;
  function onSuccess(videoWindow) {
    const { left, top } = position(videoWindow);
    line = policeDeployMap.createConnectLine(pos, left - leftWidth, top, msdid);
  }
  // 移动事件
  function onMove(videoWindow) {
    const { left, top } = position(videoWindow);
    line = policeDeployMap.createConnectLine(pos, left - leftWidth, top, msdid);
  }
  // 关闭事件
  function onClose() {
    policeDeployMap.removeConnectLine(line);
  }

  const options = {};
  options.onSuccess = onSuccess;
  options.onMove = onMove;
  options.onClose = onClose;
  // 视频拉起
  videoCall(msdid, policename, options);
}

/**
 * 显示语音请求图层
 * @param msdid 警员id
 * @param policename 警员名称
 * @param pos 警员坐标
 */
export function openAudio(msdid, policename, pos, leftWidth = 0, policeDeployMap) {
  // 视频拉起成功的回调
  let line;
  function onSuccess(videoWindow) {
    const { left, top } = position(videoWindow);
    line = policeDeployMap.createConnectLine(pos, left - leftWidth, top, msdid);
  }
  // 移动事件
  function onMove(videoWindow) {
    const { left, top } = position(videoWindow);
    line = policeDeployMap.createConnectLine(pos, left - leftWidth, top, msdid);
  }
  // 关闭事件
  function onClose() {
    policeDeployMap.removeConnectLine(line);
  }

  const options = {};
  options.onSuccess = onSuccess;
  options.onMove = onMove;
  options.onClose = onClose;
  // 视频拉起
  audioCall(msdid, policename, options);
}

/**
 * 下发警情
 * @param policeId 警员id
 */
export function sendCaseToApp(policeId, policeName) {
  policeDeployService.saveCaseProcessRequest({ policeid: policeId, caseid }).then(data => {
    if (data.result == false) {
      alert('保存记录失败！');
    }
  });
}

/**
 * 弹出信息发送div
 * @param mdsid 设备唯一标识
 * @param policeName 警员名字
 * @parame isShowOnParentFlag 是否在父页面加载短信div
 */
export function showSendMsgAppDiv(mdsid, policeName, isShowOnParentFlag, content) {
  sendMsgFlag = 'app';
  // document.getElementById('msg').innerHTML =
  // document.getElementById('questionDesId').textContent;
  document.getElementById('msg').innerHTML = 'xxxx';
  showSendMsgDiv(mdsid, policeName, isShowOnParentFlag, content);
}

/** *******************************************短信发送开始************************** */
/**
 * 编辑短信内容响应函数
 */
export function msgFocus() {
  isMsgEdit = true;
}

/**
 * 不编辑短信内容响应函数
 */
export function msgBlur() {
  isMsgEdit = false;
}
/**
 * 弹出发送消息DIV层
 * @param isShowOnParentFlag 是否在父页面加载短信div
 */
function showSendMsgPhoneDiv() {
  sendMsgFlag = 'phone';
  const msgDiv = window.document.getElementById('msgDiv');
  msgDiv.style.display = 'block';
  // 以下部分要将弹出层居中显示
  msgDiv.style.left = `${(window.document.body.clientWidth - msgDiv.clientWidth) / 2 +
    window.document.body.scrollLeft}px`;
  msgDiv.style.top = `${(window.document.body.clientHeight - msgDiv.clientHeight) / 2 +
    window.document.body.scrollTop -
    50}px`;

  // 以下部分实现弹出层的拖拽效果
  let posX = 0;
  let posY = 0;

  // 鼠标按下响应方法
  msgDiv.onmousedown = function(e = window.event) {
    if (isMsgEdit) {
      return;
    }
    posX = e.clientX - parseInt(msgDiv.style.left, 10);
    posY = e.clientY - parseInt(msgDiv.style.top, 10);
    window.document.onmousemove = mousemove;
  };

  // 鼠标弹起响应方法
  window.document.onmouseup = function() {
    window.document.onmousemove = null;
    if (msgDiv.releaseCapture) {
      msgDiv.releaseCapture();
    } else if (window.captureEvents) {
      window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
    }
  };

  // 鼠标移动响应方法
  function mousemove(ev = window.event) {
    msgDiv.style.left = `${ev.clientX - posX}px`;
    msgDiv.style.top = `${ev.clientY - posY}px`;

    if (msgDiv.setCapture) {
      msgDiv.setCapture();
    } else if (window.captureEvents) {
      window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
    }
  }
}

/**
 * 隐藏发送短信div
 */
function closeMsgDiv() {
  const msgDiv = window.document.getElementById('msgDiv');
  msgDiv.style.display = 'none';
}

export function sendMsg() {
  const msg = document.getElementById('msg').value;
  // 发送短信到移动app
  if (sendMsgFlag == 'app') {
    const mdsid = document.getElementById('msg').getAttribute('name');
    // alert("发送短信进行中"+mdsid+"@"+msg);
    $.ajax({
      url: '/HiatmpPro/assets/request/ist/mds/sendMessage?_g=ist',
      type: 'get',
      data: { mdsid, messageContent: msg },
      dataType: 'json',
      cache: false,
      success(data) {
        if (data.result == false) {
          alert('发送短信到终端app失败！');
        } else {
          alert('发送短信到终端app成功！');
          closeMsgDiv();
        }
      },
    });
  } else {
    // 发送短信到手机
    $.ajax({
      url: '/HiatmpPro/dtpms/expert/sendMsgToPolice',
      type: 'post',
      data: { phones: sendMsgPhones, msg },
      dataType: 'json',
      cache: false,
      success(data) {
        if (data.result == false) {
          alert('发送短信到手机失败！');
        } else {
          alert('发送短信到手机成功！');
          closeMsgDiv();
        }
      },
    });
  }
}

/**
 * 验证短信内容不能超过100，超过截取100个字符
 */
function validateMsg() {
  const content = $('#msg').val();
  if (content.length > 100) {
    $('#msg').val(content.substring(0, 100));
  }
}
/** *******************************************短信发送结束************************** */
