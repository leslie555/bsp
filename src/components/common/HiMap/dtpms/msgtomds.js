/* eslint-disable   prefer-destructuring  */
/* eslint-disable   no-unused-expressions  */
/* eslint-disable   no-param-reassign */
/* eslint-disable   no-new-func */
/* eslint-disable   no-undef */

import { position, offset, parseHTML, getWindowsHeightWidth, removeDom } from 'utils/domOper';
import * as policeDeployService from 'services/policeDeploy';

/**
 * gps警员用 改写自王凤磊js
 */

/**
 * 初始化调度控件，且初始化登陆参数
 */
function initMDSParam() {
  const voiceVideo = document.getElementById('IPDispatcherCtrl');
  if (voiceVideo == null || voiceVideo == 'undefined') {
    document.body.appendChild(
      parseHTML(
        "<OBJECT ID='IPDispatcherCtrl' CLASSID='CLSID:A1347CC2-E5A5-4717-A8DA-CD0AA97A68D9' CODEBASE='IPDispatcherCOM.cab#version=1,0,0,1' width='0' height='0'></OBJECT>"
      )
    );
    // 注册事件回调函数
    registerVideoEvent();
  }
  // 如果已登录注销调度台控件
  closeIPDispatcher();
  // 初始化调度台
  initVideoCtrl();
}

function initVideoCtrlCallback(data) {
  if (data.result == false) {
    alert('初始化单警调度台失败！');
  } else {
    const result = data.params;
    if (result == null || typeof result === 'undefined') {
      alert('初始化单警调度台失败！');
      return;
    }

    IPDispatcherCtrl.strName = result.username;
    IPDispatcherCtrl.strPassword = result.password;
    IPDispatcherCtrl.strServer = result.serverip;
    IPDispatcherCtrl.strLocal = result.localip;
    IPDispatcherCtrl.strLicense = result.license;
    let bresult = IPDispatcherCtrl.IsInitialize();
    IPDispatcherCtrl.Initialize();
    bresult = IPDispatcherCtrl.IsInitialize();
    if (bresult == 0) {
      alert('单警调度台没有初始化！');
      return;
    }
    IPDispatcherCtrl.Logout();
    IPDispatcherCtrl.Login(10);

    setCtrlUsed();
  }
}

/**
 * 初始化单警调度台
 */
function initVideoCtrl() {
  policeDeployService
    .initVideoCtrlRequest({ mdsid, messageContent: msg })
    .then(initVideoCtrlCallback)
    .catch(e => {
      console.log(`  错误${e}`);
    });
}

function setCtrlUsed() {
  policeDeployService
    .setCtrlUsedRequest({})
    .then(data => {
      if (data.result == false) {
        alert('设置调度台已被使用失败！');
      }
    })
    .catch(e => {
      console.log(`  错误${e}`);
    });
}
/**
 * 注册单警调度台事件
 */
function registerVideoEvent() {
  // 注册回调
  attachISTVideoEvent('OnPhoneLineStateEvent', (nLine, nState, nMediaType) => {
    const VideoWindow = document.getElementById(`VideoWindow${nLine}`);
    if (VideoWindow != null) {
      IPDispatcherCtrl.SetVideoWindow(nLine, VideoWindow.GetWindow());
    }

    // 如果通话空闲或者挂断，删除div显示
    let status = '';
    if (nState == 0) {
      if (document.getElementById(`#videodiv-${nLine}`) != null) {
        const videoDiv = document.getElementById(`videodiv-${nLine}`);
        const mdsid = videoDiv.querySelector("div[id^='mdsid']").getAttribute('id');
        if (typeof mdsid !== 'undefined') {
          window.policeDeployMap.removeConnectLine(mdsid.split('-')[1]);
        }

        removeDom(videoDiv);
      }

      if (document.getElementById(`#${nLine}-audiodiv`) != null) {
        const audioDiv = document.getElementById(`${nLine}-audiodiv`);
        const mdsid = audioDiv.querySelector("div[id^='mdsid']").getAttribute('id');
        if (typeof mdsid !== 'undefined') {
          window.policeDeployMap.removeConnectLine(mdsid.split('-')[1]);
        }

        removeDom(audioDiv);
      }

      status = '通话结束';
    } else if (nState == 1) {
      frontCall(nLine);
      return;
    } else if (nState == 3) {
      status = '等待接听';
    } else if (nState == 4) {
      status = '通话中';
    }

    if (document.getElementById(`status${nLine}`) != null) {
      document.getElementById(`status${nLine}`).innerHTML = status;
    }
  });
}

/**
 * 登出
 */
function logout() {
  const bresult = IPDispatcherCtrl.IsInitialize();

  if (bresult == 0) {
    alert('没有初始化！');
    return;
  }

  const a = IPDispatcherCtrl.Logout();
  if (a == 0) {
    alert('成功登出！');
  }
}

/**
 * 浏览器异常退出情况时候，必须调用此方法,否则注册信息还是停留在服务器端，下次登陆会提示已在其他地点登陆，刷新界面或者关闭界面的时候用此
 */
function closeIPDispatcher() {
  const voiceCtrl = document.getElementById('IPDispatcherCtrl');
  if (voiceCtrl == null || voiceCtrl == 'undefined') {
    return;
  }

  let isInit = IPDispatcherCtrl.IsInitialize();
  const isLog = IPDispatcherCtrl.IsLogin();
  if (isInit == 1 && isLog == 1) {
    // 登录
    IPDispatcherCtrl.Logout();
  }
  IPDispatcherCtrl.OnCloseIPDispatcher();
  IPDispatcherCtrl.DestroyInstance();

  isInit = IPDispatcherCtrl.IsInitialize();
  if (isInit == 1) {
    IPDispatcherCtrl.OnCloseIPDispatcher();
  }
  setCtrlUnUsed();
}

function setCtrlUnUsed() {
  policeDeployService
    .setCtrlUnUsedRequest({})
    .then(data => {
      if (data.result == false) {
        alert('设置调度台下线已被使用失败！');
      }
    })
    .catch(e => {
      console.log(`  错误${e}`);
    });
}
/** *************************************临时对讲组喊话（公共引用不要随便动）  begin************* */
/**
 * 发起临时对讲
 * mdsid  发起临时对讲的警员号
 * bstrGrpName  临时对讲组名称
 * bstrMembersList  临时对讲组增加的成员，格式为个数：成员号码，成员号码，。多个成员用逗号隔开。最后需要携带逗号。
 */
function tempPttCall(mdsid, bstrGrpName, bstrMembersList) {
  if (!isMdsLogin()) {
    alert('请加载语音并初始化通话控件！');
    return;
  }
  const nLine = getLineNum(mdsid);

  IPDispatcherCtrl.TempPttCall(nLine, bstrGrpName, bstrMembersList);
}
/**
 * 临时对讲申请话权
 * mdsid  发起临时对讲的警员号
 * bstrGrpName  临时对讲组名称
 */
function tempPttRequestSpeak(mdsid, bstrGrpName) {
  if (!isMdsLogin()) {
    alert('请加载语音并初始化通话控件！');
    return;
  }
  const nLine = getLineNum(mdsid);

  IPDispatcherCtrl.TempPttRequestSpeak(nLine, bstrGrpName);
}
/**
 * 临时对讲释放话权
 * mdsid  发起临时对讲的警员号
 * bstrGrpName  临时对讲组名称
 */
function tempPttReleaseSpeak(mdsid, bstrGrpName) {
  if (!isMdsLogin()) {
    alert('请加载语音并初始化通话控件！');
    return;
  }
  const nLine = getLineNum(mdsid);

  IPDispatcherCtrl.TempPttReleaseSpeak(nLine, bstrGrpName);
}
/**
 * 临时对讲添加成员
 * mdsid  发起临时对讲的警员号
 * bstrGrpName  临时对讲组名称
 * bstrMembersList  临时对讲组增加的成员，格式为个数：成员号码，成员号码，。多个成员用逗号隔开。最后需要携带逗号。
 */
function tempPttAddmembers(mdsid, bstrGrpName, bstrMembersList) {
  if (!isMdsLogin()) {
    alert('请加载语音并初始化通话控件！');
    return;
  }
  const nLine = getLineNum(mdsid);

  IPDispatcherCtrl.TempPttAddmembers(nLine, bstrGrpName, bstrMembersList);
}
/** ******* *******临时对讲组喊话（公共引用不要随便动）  end******************** ** */

/** ****** ***群组喊话（公共引用不要随便动）  begin************* * */
/**
 * 群组喊话
 */
function voicePlay(groupid) {
  if (!isMdsLogin()) {
    alert('请加载语音并初始化通话控件！');
    return;
  }
  const nLine = getLineNum('');

  const Number = groupid;
  if (!Number && typeof Number !== 'undefined' && Number != 0) {
    return;
  }

  IPDispatcherCtrl.MakeCall(nLine, Number, 1);
}
/**
 * 释放话权（当释放按钮时候触发）
 */
function PttFree() {
  const nLine = IPDispatcherCtrl.GetPhoneCurrentLine();
  IPDispatcherCtrl.PttFree(nLine);
}
/**
 * 抢话权(当点击按钮时候触发)
 */
function PttSnatch() {
  const nLine = IPDispatcherCtrl.GetPhoneCurrentLine();
  IPDispatcherCtrl.PttSnatch(nLine);
}
/** ** ******群组喊话（公共引用不要随便动）  end** **************** */

/** *** **弹出短信发送div（公共引用不要随便动）  begin*** ********** */
/**
 * 初始化短信参数，向引用页面加载div
 */
function initMsgParam() {
  const msgHtml =
    "<div id='msgDiv' style='width:350px; height:200px;z-index:100; position:absolute;background:white;font-size:12px;font-family:Microsoft YaHei'>" +
    "<div style='width:95%;height:75%;margin-top:10px;margin-left:5px;'>" +
    "<table style='width:100%;height:100%'>" +
    "<tr style='height:22%'><td style='width:20%;text-align:right'>收件人&nbsp;&nbsp;</td><td><div style='border:1px solid gray;width:250px'><label id='receiveMsgPerson'/></div></td></tr>" +
    "<tr heigth='height:77%'><td style='width:20%;text-align:right;vertical-align:top;'><div style='margin-top:10px;'>短信内容&nbsp;&nbsp;</div></td><td><textarea id='msg' rows='6' style='width:250px;'></textarea></td></tr>" +
    '</table>' +
    '</div>' +
    " <div style='width:100%;height:25%;text-align:right;margin-top:10px;padding-right:28px;'>" +
    "<input type='button' id='sendSmsId' value='发送' onclick='sendMsgToMds()' style='background:#428bca;color:white'/>&nbsp;&nbsp;" +
    "<input type='button' value='关闭' onclick='closeMsgDiv();' style='background:#428bca;color:white;'/>" +
    '</div></div>';

  const msgDiv = document.getElementById('msgDiv');

  if (msgDiv == null || msgDiv == 'undefined') {
    document.body.appendChild(parseHTML(msgHtml));
  }
}

/**
 * 弹出信息发送div
 * @param mdsid 设备唯一标识
 * @param policeName 警员名字
 * @parame isShowOnParentFlag 是否在父页面加载短信div
 */
export function showSendMsgDiv(mdsid, policeName, isShowOnParentFlag, content = '') {
  // 显示发送短信图层
  showMsgDiv(isShowOnParentFlag, content);

  let opWindow = window;
  // 如果在父窗口显示div
  if (isShowOnParentFlag) {
    opWindow = window.parent;
  }

  // $('#msg', opWindow.document).attr('name', mdsid);
  // $('#receiveMsgPerson', opWindow.document).html(policeName);
  opWindow.document.getElementById('msg').setAttribute('name', mdsid);
  opWindow.document.getElementById('receiveMsgPerson').innerHTML = policeName;
}

/**
 * 弹出发送消息DIV层
 * @param isShowOnParentFlag 是否在父页面加载短信div
 */
function showMsgDiv(isShowOnParentFlag, content = '') {
  let opWindow = window;
  // 如果在父窗口显示div
  if (isShowOnParentFlag) {
    opWindow = window.parent;
  }

  const msgDiv = opWindow.document.getElementById('msgDiv');
  if (msgDiv == null || typeof msgDiv === 'undefined') {
    return;
  }

  msgDiv.style.display = 'block';

  if (content != '') {
    opWindow.document.getElementById('msg').value = content;
  }

  // 以下部分要将弹出层居中显示
  msgDiv.style.left = `${(opWindow.document.body.clientWidth - msgDiv.clientWidth) / 2 +
    opWindow.document.body.scrollLeft}px`;
  msgDiv.style.top = `${(opWindow.document.body.clientHeight - msgDiv.clientHeight) / 2 +
    opWindow.document.body.scrollTop -
    50}px`;

  // 以下部分实现弹出层的拖拽效果
  let posX = 0;
  let posY = 0;

  // 鼠标按下响应方法
  msgDiv.onmousedown = function(e = opWindow.event) {
    posX = e.clientX - parseInt(msgDiv.style.left, 10);
    posY = e.clientY - parseInt(msgDiv.style.top, 10);
    opWindow.document.onmousemove = mousemove;
  };

  // 鼠标弹起响应方法
  opWindow.document.onmouseup = function() {
    opWindow.document.onmousemove = null;
    if (msgDiv.releaseCapture) {
      msgDiv.releaseCapture();
    } else if (window.captureEvents) {
      window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
    }
  };

  // 鼠标移动响应方法
  function mousemove(ev = opWindow.event) {
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
export function closeMsgDiv() {
  let msgDiv = window.document.getElementById('msgDiv');

  if (msgDiv == null || msgDiv == 'undefined') {
    msgDiv = window.parent.document.getElementById('msgDiv');
  }

  msgDiv.style.display = 'none';
}

/**
 * 发送短信
 */
export function sendMsgToMds() {
  const dommsg = document.getElementById('msg');
  const msg = dommsg.value;
  const mdsid = dommsg.getAttribute('name');

  // alert("发送短信进行中"+mdsid+"@"+msg);
  policeDeployService
    .sendMsgToMdsRequest({ mdsid, messageContent: msg })
    .then(data => {
      if (data.result == false) {
        alert('发送失败！');
      } else {
        alert('发送成功！');
      }
    })
    .catch(e => {
      console.log(`  错误${e}`);
    });
}
/** *************************************弹出短信发送div  end************* */

/** *************************************视频请求div（公共引用，不要随便修改）  begin********** */

// 线路状态
const linesInfo = [];
for (let i = 0; i < 16; i += 1) {
  linesInfo[i] = { mdsid: '' };
}

/**
 * 获取线路号
 * @returns {Number}
 */

function getLineNum(mdsid) {
  // 如果当前警员正在占用一条线路，返回该线路
  for (let i = 0; i < 16; i += 1) {
    if (linesInfo[i].mdsid == mdsid) {
      return i;
    }
  }
  // 否则返回一条空线路
  for (let i = 0; i < 16; i += 1) {
    const a = IPDispatcherCtrl.GetLineState(i);
    if (a == 0 && linesInfo[i].mdsid == '') {
      linesInfo[i].mdsid = mdsid;
      return i;
    }
  }
  return -1;
}

/**
 * 视频呼叫
 * @param {String} mdsid 前端app设备唯一标识
 * @param {String} policeName 警员名称
 * @param {Object} [options] 配置参数
 * 配置参数 options 列表:
 *{Number} width 窗口宽度，默认250px
 *{Number} height 窗口高度，默认250px
 *{Function} onSucess 播放成功的回调函数,返回视频窗口对象videoWidow
 *{Function} onMove 视频窗口拖动事件,返回视频窗口对象videoWidow
 *{Function} onClose 视频窗口关闭事件
 */
export function videoCall(mdsid, policeName, options = {}) {
  // 判断是否初始化
  const voiceVideo = document.getElementById('IPDispatcherCtrl');
  let timeout = 0;
  if (voiceVideo == null || voiceVideo == 'undefined' || voiceVideo.IsLogin() !== 1) {
    initMDSParam();
    timeout = 1000;
  }
  setTimeout(() => {
    // 生成可拖动窗口
    options.linenum = getLineNum(mdsid);
    if (options.linenum < 0) {
      return;
    }
    options.mdsid = mdsid;
    options.policeName = policeName;
    const videoDiv = getVideoDiv(options);

    // 视频播放
    IPDispatcherCtrl.ResumeCall(options.linenum);
    IPDispatcherCtrl.SetPhoneCurrentLine(options.linenum);
    IPDispatcherCtrl.VideoCall(options.linenum, mdsid);

    options.onSuccess && options.onSuccess(videoDiv);
  }, timeout);
}

export function closeVideoDiv(linenum) {
  const videoDiv = document.getElementById(`videodiv-${linenum}`);
  if (videoDiv != null) {
    videoDiv.style.display = 'none';
  }
  const bresult = IPDispatcherCtrl.IsInitialize();
  if (bresult == 1) {
    IPDispatcherCtrl.HangupCall(linenum);
  }

  linesInfo[linenum].mdsid = '';
  videoDiv.onClose && videoDiv.onClose();
  removeDom(videoDiv);
}

const videoPosObj = {};

export function maxOrReduceVideoDiv(lineNum) {
  const labelContent = document.getElementById(`maxVideoId${lineNum}`).textContent;
  if (labelContent == '最大化') {
    maxVideoDiv(lineNum);
  }

  if (labelContent == '还原') {
    reduceVideoDiv(lineNum);
  }
}
/**
 * 最大化视频播放
 * @param lineNum 线路号
 */
function maxVideoDiv(lineNum) {
  isHaveMaxVideo = true;

  const { left, top } = position(document.getElementById(`videodiv-${lineNum}`));
  videoPosObj[lineNum] = `${left}px@${top}px`;
  const { height: screenHeight, width: screenWidth } = getWindowsHeightWidth();

  document.getElementById(`videodiv-${lineNum}`).style.width = `${screenWidth - 200}px`;
  document.getElementById(`videodiv-${lineNum}`).style.height = `${screenHeight}px`;
  document.getElementById(`videodiv-${lineNum}`).style.left = '200px';
  document.getElementById(`videodiv-${lineNum}`).style.top = 0;
  document.getElementById(`maxVideoId${lineNum}`).innerHTML = '还原';
}

/**
 * 还原视频播放
 * @param lineNum 线路号
 */
function reduceVideoDiv(lineNum) {
  isHaveMaxVideo = false;
  const posArr = videoPosObj[lineNum].split('@');
  document.getElementById(`videodiv-${lineNum}`).style.width = '250px';
  document.getElementById(`videodiv-${lineNum}`).style.height = '275px';
  document.getElementById(`videodiv-${lineNum}`).style.left = posArr[0];
  document.getElementById(`videodiv-${lineNum}`).style.top = posArr[1];

  delete videoPosObj[lineNum];
  document.getElementById(`maxVideoId${lineNum}`).innerHTML = '最大化';
}

function getVideoDiv(options) {
  let videoDiv = document.getElementById(`videodiv-${options.linenum}`);
  if (videoDiv != null) {
    closeVideoDiv(options.linenum);
  }
  const basePath = typeof _basePath === 'undefined' ? 'HiatmpPro' : _basePath;
  options.width = options.width || 250;
  options.height = options.height || 250;
  let innerhtml = `<div id ='videodiv-${options.linenum}' style='width:${
    options.width
  }px;height:${options.height + 25}px;background-color:#428BCA;'>`;
  innerhtml += `<div id='mdsid-${options.mdsid}' style='height:24px;width:100%;'>`;
  innerhtml += ` <div style='font-size:14px;font-family:Microsoft YaHei;color:white;display:inline-block;float:left;padding-top:2px;padding-left:6px;'>${
    options.policeName
  }</div>`;
  innerhtml += `<div style='font-size:14px;font-family:Microsoft YaHei;color:white;cursor:pointer;float:right;padding-top:2px;padding-right:6px;'><label id='maxVideoId${
    options.linenum
  }' onclick='maxOrReduceVideoDiv(${
    options.linenum
  })'>最大化</label>&nbsp;&nbsp;&nbsp;<label onClick='javascript:closeVideoDiv(${
    options.linenum
  })'>关闭</label></div></div>`;
  innerhtml += `<object id="VideoWindow${
    options.linenum
  }" classid="CLSID:FD968A91-02A5-4596-AA56-4368ED02DDD2" width="100%" height="100%"></object>`;
  innerhtml += '</div>';

  document.body.appendChild(parseHTML(innerhtml));
  videoDiv = document.getElementById(`videodiv-${options.linenum}`);
  videoDiv.style.position = 'absolute';
  // 以下部分要将弹出层居中显示
  if (typeof options.screenX !== 'undefined') {
    videoDiv.style.left = options.screenX;
  } else {
    videoDiv.style.left = `${(document.body.clientWidth - videoDiv.clientWidth) / 2 +
      document.body.scrollLeft}px`;
  }

  if (typeof options.screenY !== 'undefined') {
    videoDiv.style.top = options.screenY;
  } else {
    videoDiv.style.top = `${(document.body.clientHeight - videoDiv.clientHeight) / 2 +
      document.body.scrollTop -
      50}px`;
  }

  videoDiv.onMove = options.onMove;
  videoDiv.onClose = options.onClose;

  // 以下部分实现弹出层的拖拽效果
  videoDiv.addEventListener('mousemove', () => {
    moveObj(`videodiv-${options.linenum}`);
  });
  return videoDiv;
}

// 绑定事件
function attachISTVideoEvent(etype, func) {
  document.getElementById('IPDispatcherCtrl').attachEvent(etype, func);
}

// 移动
let dragFlag = false;
let isHaveMaxVideo = false;
const D = new Function('obj', 'return document.getElementById(obj);');
const oevent = new Function('e', 'if (!e) e = window.event;return e');

// 是否有最大化视频窗口

function moveObj(obj) {
  let x;
  let y;
  const domobj1 = D(obj);
  domobj1.onmousedown = function(ee) {
    dragFlag = true;

    domobj1.style.position = 'absolute';

    const temp1 = domobj1.offsetLeft;
    const temp2 = domobj1.offsetTop; // 高度
    x = oevent(ee).clientX;
    y = oevent(ee).clientY;
    const Height = window.policeDeployMap.mapdiv.clientHeight;
    const Width = window.policeDeployMap.mapdiv.clientWidth;

    document.onmousemove = function(e) {
      if (!dragFlag || isHaveMaxVideo) return false;
      const domobj = D(obj);
      domobj.style.left = `${temp1 + oevent(e).clientX - x}px`;

      if (temp1 + oevent(e).clientX - x > Width - domobj.clientWidth) {
        domobj.style.left = `${Width - domobj.clientWidth - 20}px`;
      }

      if (temp1 + oevent(e).clientX - x < 10) domobj.style.left = `${10}px`;

      domobj.style.top = `${temp2 + oevent(e).clientY - y}px`;

      if (temp2 + oevent(e).clientY - y < 10) domobj.style.top = `${10}px`;

      if (temp2 + oevent(e).clientY - y > Height - domobj.clientWidth) {
        domobj.style.top = `${Height - domobj.clientHeight - 15}px`;
      }
      domobj.onMove && domobj.onMove(domobj);
    };

    document.onmouseup = function() {
      dragFlag = false;
    };
  };
}
/** *************************************视频请求div（公共引用，不要随便修改）  end********** */

/** *************************************语音请求div（公共引用，不要随便修改）  begin********** */
/**
 * 调用语音通话
 * @param 警员id
 * @param policeName 警员名称
 * @param option 选项
 */
export function audioCall(mdsid, policeName, options = {}) {
  // 判断是否初始化
  if (!isMdsLogin()) {
    alert('未登录呼叫平台！');
    return;
  }
  // 生成可拖动窗口

  const tmpOptions = { ...options, linenum: getLineNum(mdsid), mdsid, policeName };

  if (tmpOptions.linenum < 0) {
    return;
  }
  const AudioDiv = getAudioDiv(tmpOptions);

  // 视频播放
  IPDispatcherCtrl.ResumeCall(tmpOptions.linenum);
  IPDispatcherCtrl.SetPhoneCurrentLine(tmpOptions.linenum);
  const bresult = IPDispatcherCtrl.MakeCall(tmpOptions.linenum, mdsid, 1);
  if (bresult != 0) {
    alert('呼叫失败');
  }
  tmpOptions.onSuccess && tmpOptions.onSuccess(AudioDiv);
}
/**
 * 获取通话div
 */
function getAudioDiv(options = {}) {
  let audioDiv = document.getElementById(`${options.linenum}-audiodiv`);
  if (audioDiv != null) {
    closeAudioDiv(options.linenum);
  }
  const basePath = typeof _basePath === 'undefined' ? 'HiatmpPro' : _basePath;
  options.width = options.width || 250;
  options.height = options.height || 45;
  let innerhtml = `<div id ='${options.linenum}-audiodiv' style='width:${
    options.width
  }px;height:${options.height + 25}px;background-color:#428BCA;'>`;
  innerhtml += `<div id='mdsid-${options.mdsid}' style='height:7px;width:100%;'>`;
  innerhtml += ` <div style='font-size:14px;font-family:Microsoft YaHei;color:white;display:inline-block;float:left;padding-top:2px;padding-left:6px;'>${
    options.policeName
  }</div>`;
  innerhtml += `<div style='cursor:pointer;float:right;padding-top:6px;padding-right:6px;'><img src='/${basePath}/assets/image/ist/frameclose.png?_g=ist' width=14 height=14 onClick='javascript:closeAudioDiv(${
    options.linenum
  })'/></div></div>`;
  innerhtml += '<br/><div style="width:100%;height:100%;padding-top:10px;background-color:black;">';
  innerhtml += "<div style='width:100%;text-align: center;'>";
  innerhtml += `<input type='button' id='btnAnswerCall${
    options.linenum
  }'  style='font-size:14px;font-family:Microsoft YaHei;font-weight: bold;width:80px;height:30px;background-color:green;color:white;display:none;' onClick='javascript:AudioOrVideoAnswerCall("${
    options.mdsid
  }","${options.policeName}",${options.linenum},"${
    options.mediaType
  }")' value='接&nbsp;&nbsp;听' />`;
  innerhtml += `<input type='button'  style='font-size:14px;font-family:Microsoft YaHei;font-weight: bold;width:80px;height:30px;background-color:red;color:white;' onClick='javascript:closeAudioDiv(${
    options.linenum
  })' value='挂&nbsp;&nbsp;断' />`;
  innerhtml += '</div>';
  innerhtml += `<div style="font-size:12px;font-family:Microsoft YaHei;color:white;padding-top:10px;padding-left: 10px;"><span style="font-weight: bold;">状态:</span><span  id="status${
    options.linenum
  }"></span></div>`;
  innerhtml += '</div>';
  innerhtml += '</div>';
  document.body.appendChild(parseHTML(innerhtml));
  audioDiv = document.getElementById(`${options.linenum}-audiodiv`);
  audioDiv.style.position = 'absolute';
  // 以下部分要将弹出层居中显示
  if (typeof options.screenX !== 'undefined') {
    audioDiv.style.left = options.screenX;
  } else {
    audioDiv.style.left = `${(document.body.clientWidth - audioDiv.clientWidth) / 2 +
      document.body.scrollLeft}px`;
  }

  if (typeof options.screenY !== 'undefined') {
    audioDiv.style.top = options.screenY;
  } else {
    audioDiv.style.top = `${(document.body.clientHeight - audioDiv.clientHeight) / 2 +
      document.body.scrollTop -
      50}px`;
  }

  audioDiv.onMove = options.onMove;
  audioDiv.onClose = options.onClose;

  // 以下部分实现弹出层的拖拽效果

  audioDiv.addEventListener('mousemove', () => {
    moveObj(`${options.linenum}-audiodiv`);
  });

  return audioDiv;
}

/**
 * 关闭通话请求div
 * @param 线路
 */
function closeAudioDiv(linenum) {
  const audioDiv = document.getElementById(`${linenum}-audiodiv`);
  if (audioDiv != null) {
    audioDiv.style.display = 'none';
  }
  if (isMdsLogin()) {
    IPDispatcherCtrl.HangupCall(linenum);
  }

  linesInfo[linenum].mdsid = '';
  audioDiv.onClose && audioDiv.onClose();
  removeDom(audioDiv);
}

/**
 *
 * @param nLine 线路
 * @param mediaType 媒体类型1语音2视频3语音视频
 */
function AudioOrVideoAnswerCall(policeNo, policeName, nLine, mediaType) {
  const nMediaType = IPDispatcherCtrl.GetMediaTypeJS(nLine);
  IPDispatcherCtrl.AnswerCall(nLine, nMediaType);

  // 如果音频直接通话
  if (mediaType == 1) {
    document.getElementById('btnAnswerCall').style.display = 'none';
  }

  // 如果视频，关闭通话div，弹出视频窗口
  if (mediaType == 2 || mediaType == 3) {
    const audioDiv = document.getElementById(`${nLine}-audiodiv`);
    removeDom(audioDiv);
    const options = {};
    options.mdsid = policeNo;
    options.policeName = policeName;
    options.linenum = nLine;
    options.mediaType = mediaType;
    getVideoDiv(options);
  }
}

function createHttpRequest() {
  let request = null;
  if (window.ActiveXObject) {
    request = new ActiveXObject('Microsoft.XMLHTTP');
  } else if (window.XMLHttpRequest) {
    request = new XMLHttpRequest();
  }
  return request;
}

/**
 * 中断主动请求调用函数
 * @param nLine 线路
 */
function frontCall(nLine) {
  const policeNo = IPDispatcherCtrl.GetRemoteNumberjs(nLine);
  const mediaType = IPDispatcherCtrl.GetMediaTypeJS(nLine);
  const request = createHttpRequest();
  try {
    request.onreadystatechange = function() {
      if (request.readyState == 4) {
        let result = '';
        if (request.status == 200 || request.status == 0) {
          if (typeof JSON === 'undefined') {
            // result = eval(`(${request.responseText})`);
          } else {
            result = JSON.parse(request.responseText);
          }
          const police = result.police;
          const options = [];
          options.linenum = nLine;
          options.mdsid = policeNo;
          options.policeName = police;
          options.mediaType = mediaType;
          getAudioDiv(options);
          document.getElementById(`btnAnswerCall${nLine}`).style.display = '';
          document.getElementById(`status${nLine}`).innerHTML = '前端呼叫';
        }
      }
    };
    if (typeof _basePath !== 'undefined') {
      request.open(
        'POST',
        `/${_basePath}/assets/request/ist/mds/getPoliceInfo?pid=${policeNo}`,
        false
      );
    } else {
      request.open(
        'POST',
        `/HiatmpPro/assets/request/ist/mds/getPoliceInfo?pid=${policeNo}`,
        false
      );
    }
    request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    request.send('');
  } catch (e) {
    console.log(e);
  }
}

/**
 * 判断是否已经初始化捷思瑞登陆
 * @returns 是否登陆
 */
function isMdsLogin() {
  let bresult = null;
  const voiceCtrl = document.getElementById('IPDispatcherCtrl');

  if (voiceCtrl == null || voiceCtrl == 'undefined') {
    return false;
  }
  bresult = IPDispatcherCtrl.IsInitialize();

  if (bresult != 1) {
    return false;
  }
  bresult = IPDispatcherCtrl.IsLogin();

  if (bresult != 1) {
    return false;
  }

  return true;
}

/** *************************************语音请求div（公共引用，不要随便修改）  end********** */
