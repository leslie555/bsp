/* eslint-disable */
export function getCarNumStyle(num, type, style = {}) {
  let carNumStyle;
  const w = '#fff';
  const black = '#000';
  const y = '#FFBE00';
  const r = '#FE0000';
  const blue = '#25A0ED';
  const s = {
    width: style.width || 80,
    height: style.height || 25,
    lineHeight: `${style.height}px`,
  };
  switch (type) {
    case '01':
      // 大型车型号牌
      carNumStyle = (
        <span
          className="car-num-style"
          style={{
            fontSize: '12px',
            padding: '4px',
            ...s,
            ...style,
            color: black,
            background: y,
          }}
        >
          {num}
        </span>
      );
      break;
    case '15':
      // 大型-挂车
      carNumStyle = (
        <span
          className="car-num-style"
          style={{
            fontSize: '12px',
            padding: '4px',
            ...s,
            ...style,
            color: black,
            background: y,
          }}
        >
          {num}
        </span>
      );
      break;
    case '02':
      // 小型车
      carNumStyle = (
        <span
          className="car-num-style"
          style={{
            fontSize: '12px',
            padding: '4px',
            ...s,
            ...style,
            color: w,
            background: blue,
          }}
        >
          {num}
        </span>
      );
      break;
    case '12':
      // 使馆汽车号牌
      carNumStyle = (
        <span
          className="car-num-style"
          style={{ fontSize: '12px', padding: '4px', ...s, ...style, color: w, background: black }}
        >
          <span style={{ color: r }}>{num.slice(0, 1)}</span>
          <span>{num.slice(1)}</span>
        </span>
      );
      break;
    case '09':
      // 使馆摩托车
      carNumStyle = (
        <span
          className="car-num-style"
          style={{
            fontSize: '12px',
            padding: '4px',
            ...s,
            ...style,
            color: w,
            background: black,
          }}
        >
          {num}
        </span>
      );
      break;
    case '04':
      // 领馆汽车号牌
      carNumStyle = (
        <span
          className="car-num-style"
          style={{
            fontSize: '12px',
            padding: '4px',
            ...s,
            ...style,
            color: w,
            background: black,
          }}
        >
          <span style={{ color: r }}>{num.slice(0, 1)}</span>
          <span>{num.slice(1)}</span>
        </span>
      );
      break;
    case '26':
      // 香港入出境车牌号
      carNumStyle = (
        <span
          className="car-num-style"
          style={{
            fontSize: '12px',
            padding: '4px',
            ...s,
            ...style,
            color: w,
            background: black,
          }}
        >
          {num}
        </span>
      );
      break;
    case '27':
      // 澳门入出境车牌号
      carNumStyle = (
        <span
          className="car-num-style"
          style={{
            fontSize: '12px',
            padding: '4px',
            ...s,
            ...style,
            color: w,
            background: black,
          }}
        >
          {num}
        </span>
      );
      break;
    case '16':
      // 教练汽车号牌
      carNumStyle = (
        <span
          className="car-num-style"
          style={{
            fontSize: '12px',
            padding: '4px',
            ...s,
            ...style,
            color: black,
            background: y,
          }}
        >
          {num}
        </span>
      );
      break;
    case '17':
      // 教练摩托车号牌
      carNumStyle = (
        <span
          className="car-num-style"
          style={{
            fontSize: '12px',
            padding: '4px',
            ...s,
            ...style,
            color: black,
            background: y,
          }}
        >
          {num}
        </span>
      );
      break;
    case '23':
      // 警用汽车号牌
      carNumStyle = (
        <span
          className="car-num-style"
          style={{
            fontSize: '12px',
            padding: '4px',
            ...s,
            ...style,
            color: black,
            background: w,
          }}
        >
          <span>{num.slice(0, 1)}</span>
          <span style={{ color: r }}>{num.slice(1)}</span>
        </span>
      );
      break;
    case '24':
      // 警用摩托车号牌
      carNumStyle = (
        <span
          className="car-num-style"
          style={{
            fontSize: '12px',
            padding: '4px',
            ...s,
            ...style,
            color: black,
            background: w,
          }}
        >
          <span>{num.slice(0, 1)}</span>
          <span style={{ color: r }}>{num.slice(1)}</span>
        </span>
      );
      break;
    case '30':
      // 特殊处理
      carNumStyle = (
        <span
          className="car-num-style"
          style={{ fontSize: '12px', padding: '4px', ...s, ...style, color: black, background: w }}
        >
          <span style={{ color: num.length === 8 ? r : black }}>{num.slice(0, 3)}</span>
          <span>{num.slice(3)}</span>
        </span>
      );
      break;
    case '31':
      // 特殊处理
      carNumStyle = (
        <span
          className="car-num-style"
          style={{ fontSize: '12px', padding: '4px', ...s, ...style, color: black, background: w }}
        >
          <span style={{ color: num.length === 8 ? r : black }}>{num.slice(0, 3)}</span>
          <span>{num.slice(3)}</span>
        </span>
      );
      break;
    case '51':
      // 大型新能源汽车
      carNumStyle = (
        <span
          className="car-num-style"
          style={{ fontSize: '12px', padding: '4px', ...s, ...style, color: black }}
        >
          <span style={{ background: y }}>{num.slice(0, 2)}</span>
          <span style={{ background: '#30E451' }}>{num.slice(2)}</span>
        </span>
      );
      break;
    case '52':
      // 小型新能源汽车
      carNumStyle = (
        <span
          className="car-num-style"
          style={{
            fontSize: '12px',
            padding: '4px',
            ...s,
            ...style,
            color: black,
            background: 'linear-gradient(#E5DCE4, #30E451)',
          }}
        >
          {num}
        </span>
      );
      break;
    default:
      carNumStyle = (
        <span
          className="car-num-style"
          style={{ fontSize: '12px', padding: '4px', ...s, ...style, color: w, background: blue }}
        >
          {num}
        </span>
      );
  }
  return carNumStyle;
}

/* img加载失败方法 */
export function handleImg(e) {
  e.target.src = require('../../assets/gpspolice/police.png');
}

/**
 * 生成警力弹窗html内容
 * @param currRecord
 * @returns {string} html代码片段
 */
export function genPoliceInfoHTML(currRecord) {
  let str = `<div id='mainbox' style='margin:10px 0px 0px -5px;width:250px;height: 170px;border:0px solid black; font-size: 12px;line-height:160%'>
  <div id='fluxtitle' style='margin:4px 0px 0px 0px;width:250px;height: 120px;font-family:Microsoft YaHei;'>
    <table id='fluxtable' style='width:100%;font-size:12;font-family:Microsoft YaHei;color:white'>
    <tr><td align="right">警员姓名：</td><td align="left"><label id='policename' title='${
      currRecord.policename
    }'>${currRecord.policename}</label></td></tr>
    <tr><td align="right">警员警号：</td><td align="left"><label id='policeid'  title='${
      currRecord.policeid
    }'>${currRecord.policeid}</label></td></tr>
    <tr><td align="right">电话号码：</td><td align="left"><label id='phone'>${
      currRecord.phone
    }</label></td></tr>
    </table>
    </div>`;
  if (1) {
    str += `<div id='content' style='width:250px;height:15px;font-family:Microsoft YaHei;'>
      <input type='button' style='align:left;margin:1px 5px 0px 40px;' value='语音'
             onclick="javascript:window.parent.handleSound( ${currRecord.policeid},${
      currRecord.policename
    },${currRecord.strcoords}  )"/>
      <input type='button' style='align:left;margin:1px 5px 0px 80px;' value='视频'
             onclick="javascript:window.parent.openVideo( '${currRecord.policeid}','${
      currRecord.policename
    }','${currRecord.strcoords}' )"/>
    </div>`;
  }
  return str;
}
/**
 * 获取警员显示图层
 * @param police 警员信息
 * @returns 警员显示图层
 */
export function getPoliceInfoHtml(police, map, leftWidth = 200) {
  police.jingyuan = 1;
  police.deptshortname = police.deptshortname;

  // 如果部署单警，则显示视频请求和发送消息按钮
  // if(gpspolice.gpstype == "4")
  if (true) {
    const position = `${police.decarlong},${police.decarlat}`;
    const policeNo = police.policeid;
    police.istbuttons = [
      {
        istbuttonvalue: '视频',
        istbuttoncall: `javascript:parent.openVideo(\"${policeNo}\",\"${
          police.policename
        }\",\"${position}\",\"${leftWidth}\")`,
      },
      {
        istbuttonvalue: '语音',
        istbuttoncall: `javascript:parent.openAudio(\"${policeNo}\",\"${
          police.policename
        }\",\"${position}\,\\"${leftWidth}\\"")`,
      },
      {
        istbuttonvalue: '短信',
        istbuttoncall: `javascript:parent.showSendMsgAppDiv(\"${police.policeid}\",\"${
          police.policename
        }\",true)`,
      },
      {
        istbuttonvalue: '警情下发',
        istbuttoncall: `javascript:parent.sendCaseToApp(\"${policeNo}\",\"${police.policename}\")`,
      },
    ];
  }

  const btnHtml = map.genHtmlByTemplate('tpl_ist', police);

  return btnHtml;
}
