/* eslint-disable */
/**
 * 封装跨浏览器的2个页面间的通信，IE8版本
 * Created by liuxiaobing on 2017-5-9.
 */

var HiMsg = function (options) {
  this.options = {frequency: 3000};
  if (options && options.frequency) {
    this.options.frequency = options.frequency;
  }
  this.listener = {};
  this.timer = null;
  var basethis = this;

  /**
   * 连接到某个频道
   * @param channel 频道号,平台唯一
   */
  this.connect = function connect(channel) {
    basethis.channel = channel;
    sendAjax('/HiatmpPro/himsg/connect?channel=' + channel, function () {
      // 连接成功事件
      if (typeof (basethis.listener.connect) !== 'undefined') {
        basethis.listener.connect();
      }
    });
  }

  /**
   * 断开连接
   */
  this.disconnect = function disconnect() {
    sendAjax('/HiatmpPro/himsg/disconnect?channel=' + basethis.channel, function () {
      // 断开成功事件
      if (typeof (basethis.listener.disconnect) !== 'undefined') {
        basethis.listener.disconnect();
      }
      // 停止接收消息
      clearInterval(basethis.timer);
      basethis.timer = null;
    });
  }

  /**
   * 发送消息
   * @param msg 消息体
   */
  this.sendMsg = function sendMsg(msg) {
    sendAjax('/HiatmpPro/himsg/sendMsg?msg=' + msg + '&channel=' + basethis.channel, function () {
      console.log(basethis.channel + '  send msg success,msg: ' + msg);
    });
  }

  // ajax 轮询，接收消息
  this.loopMsg = function loopMsg() {
    sendAjax('/HiatmpPro/himsg/getMsg?channel=' + basethis.channel, function (data) {
      if (data.result) {
        if (data.msg === 'disconnect') {
          // 停止接收消息
          window.clearInterval(basethis.timer);
        } else {
          basethis.onMsg(data.msg);
        }
      }
    });
  }

  /**
   * 接收到消息
   * @param msg 消息体
   */
  this.onMsg = function onMsg(msg) {
    if (typeof (basethis.listener.onMsg) !== 'undefined') {
      basethis.listener.onMsg(msg);
    }
  }

  /**
   * 注册事件
   * @param type 事件类型 'connect' 'disconnect' 'onMsg'
   * @param callback 回调函数
   */
  this.on = function on(type, callback) {
    basethis.listener[type] = callback;
    if (type === 'onMsg') {
      // 开始接收消息
      basethis.timer = window.setInterval(basethis.loopMsg, basethis.options.frequency);
    }
  }
}

HiMsg.uuid = function uuid() {
  var s = [];
  var hexDigits = '0123456789abcdef';
  for (var i = 0; i < 36; i += 1) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
  s[8] = s[13] = s[18] = s[23] = '-';

  var uuid = s.join('');
  return uuid;
}

sendAjax = function (url, callback, async, contenttype) {
  async = async || false;
  var request = createHttpRequest();
  try {
    request.onreadystatechange = function () {
      if (request.readyState == 4) {
        var data = "";
        if (request.status == 200 || request.status == 0) {
          if (null == contenttype || contenttype == "json") {
            if (typeof(JSON) == 'undefined') {
              data = eval("(" + request.responseText + ")");
            } else {
              data = JSON.parse(request.responseText);
            }
          } else {
            data = request.responseText;
          }

          callback.call(this, data);

        }
      }
    };
    request.open("POST", url, async);
    request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    //request.withCredentials = true;
    request.send("");
  } catch (exception) {
    //alert("!");
  }
};

function createHttpRequest() {
  var request;
  if (window.ActiveXObject) {
    request = new ActiveXObject("Microsoft.XMLHTTP");
    //request.setRequestHeader("X-Requested-With","XMLHttpRequest");
  } else if (window.XMLHttpRequest) {
    request = new XMLHttpRequest();
  }
  return request;
}

function GetQueryString(name)
{
  var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if(r!=null)return  unescape(r[2]); return null;
}

var hiMsg = new HiMsg();
hiMsg.connect(GetQueryString('crossticket'));
window.onunload = function disconnect() {
  hiMsg.disconnect();
}
