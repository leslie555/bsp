// 当前页面名称
let currentPage;
// 当前页面标题栏名称
let cpTitleName;
// 当前页面高度
let cpHeight;
// 当前页面宽度
let cpWidth;
// 向要打开的页面传递参数（menu中打开的页面向bottom的页面传参）,逗号分隔
let agrs;
// if need to catch close event
const needCatchClose = false;
// 对通过showHtmlApp方法打开的页面的引用
let openObject;
let openObjectF;
/**
 * 居中弹出页面
 * @param url 页面地址,可以?后加参数
 * @param title 标题
 * @param subsys 子系统
 * @param module 模块名, application填写application名称
 * @param height 不传默认全屏
 * @param width 不传默认全屏
 */
export function openPage(subsys, module, title, url, ...args) {
  let iTop = 0;
  let iLeft = 0;

  if (typeof args[0] !== 'object' && args.length > 1) {
    // 高度和宽度指定
    cpWidth = args[0] || 900;
    cpHeight = args[1] || 605;
    iTop = (window.screen.availHeight - 30 - cpHeight) / 2;
    iLeft = (window.screen.availWidth - 10 - cpWidth) / 2;
  } else {
    // 未传高度和宽度
    if (screen.height >= 1000) {
      cpHeight = screen.height - 115;
    } else {
      cpHeight = screen.height - 85;
    }
    cpWidth = screen.width - 20;
    iTop = 0;
    iLeft = 0;
  }

  const param = [];
  param.push(`_g=${encodeURIComponent(subsys)}`);
  param.push(`_m=${encodeURIComponent(module)}`);
  param.push(`_t=${encodeURIComponent(title)}`);
  param.push(`_w=${encodeURIComponent(cpWidth)}`);
  param.push(`_h=${encodeURIComponent(cpHeight)}`);
  const handler = (subsys + module).replace(/[\]|[/]|[%]/g, '');
  const urlArr = url.split('?');
  let tmpurl = url;
  if (urlArr.length < 2) {
    tmpurl += '?';
  }

  const win = window.open(
    tmpurl + param.join('&'),
    handler,
    `height=${cpHeight},width=${cpWidth},toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no,left=${iLeft},top=${iTop}`
  );
}
/**
 *
 * 居中弹出页面
 * http://10.16.1.55:867/HiatmpPro/index.html?_g=tgs&_m=home&_t=%E8%AF%B1%E5%AF%BC&_w=1900&_h=965#/home?_k=1g2g2q
 * @param url 页面地址,可以?后加参数
 * @param title 标题
 * @param subsys 子系统
 * @param route 路由
 * @param height 不传默认全屏
 * @param width 不传默认全屏
 */
export function openReactPage(subsys, route, title, url, ...args) {
  let iTop = 0;
  let iLeft = 0;

  if (typeof args[0] !== 'object' && args.length > 1) {
    // 高度和宽度指定
    cpWidth = args[0] || 900;
    cpHeight = args[1] || 605;
    iTop = (window.screen.availHeight - 30 - cpHeight) / 2;
    iLeft = (window.screen.availWidth - 10 - cpWidth) / 2;
  } else {
    // 未传高度和宽度
    if (screen.height >= 1000) {
      cpHeight = screen.height - 115;
    } else {
      cpHeight = screen.height - 85;
    }
    cpWidth = screen.width - 20;
    iTop = 0;
    iLeft = 0;
  }

  const param = [];
  param.push(`_g=${encodeURIComponent(subsys)}`);
  param.push(`_m=${encodeURIComponent(route)}`);
  param.push(`_t=${encodeURIComponent(title)}`);
  param.push(`_w=${encodeURIComponent(cpWidth)}`);
  param.push(`_h=${encodeURIComponent(cpHeight)}`);
  const handler = (subsys + module).replace(/[\]|[/]|[%]/g, '');

  const urlArr = url.split('?');
  let tmpurl = url;
  if (urlArr.length < 2) {
    tmpurl += '?';
  }

  const win = window.open(
    `${tmpurl + param.join('&')}#/${route}`,
    handler,
    `height=${cpHeight},width=${cpWidth},toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no,left=${iLeft},top=${iTop}`
  );
}
// 打开一个新页面,加载一个指定名称的Flex Module
export function showHtmlApp(str, titleName) {
  currentPage = str;
  cpHeight = 605;
  cpWidth = 900;
  const iTop = (window.screen.availHeight - 30 - cpHeight) / 2;
  const iLeft = (window.screen.availWidth - 10 - cpWidth) / 2;
  openObject = window.open(
    '/HiatmpPro/FlexAppFrame.html',
    str,
    `height=605, width=900, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no,left=${iLeft},top=${iTop}`
  );
  cpTitleName = titleName;
}

// 车辆轨迹分析
export function showVehiclePathAnalysis() {
  cpHeight = 700;
  cpWidth = 1300;
  const iTop = (window.screen.availHeight - 30 - cpHeight) / 2;
  const iLeft = (window.screen.availWidth - 10 - cpWidth) / 2;
  openObject = window.open(
    '/HiatmpPro/jsp/scs/VehiclePathAnalysisFrame.jsp?_g=scs',
    '',
    `height=${cpHeight}, width=${cpWidth}, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no,left=${iLeft},top=${iTop}`
  );
  cpTitleName = '车辆轨迹分析';
}
