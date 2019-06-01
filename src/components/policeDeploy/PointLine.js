/**
 * 地图指示线
 * Created by jingzy on 2018-7-13 base on 李超.
 */
/* eslint-disable */
import { Button, Row, Col } from 'antd';
import styles from './PointLine.less';
import { handleImg, getCarNumStyle } from './PointLineUtils';

/* 画线主方法 */
function main(x, y, a, b, c, d, canvas, radius, w) {
  const LineChart = function(options) {
    let { data } = options;
    const context = canvas.getContext('2d');

    let rendering = false;

    let progress = 0;

    const paddingX = radius;

    const paddingY = 0;

    const width = w;

    const height = w * 2;

    const color = 'rgba(255,255,255,0.8)';

    const borderWidth = 1.5;

    canvas.width = width;
    canvas.height = height;
    let maxValue;

    let minValue;
    render();
    function format(force) {
      maxValue = 0;
      minValue = Number.MAX_VALUE;

      data.forEach((point, i) => {
        maxValue = Math.max(maxValue, point.value);
        minValue = Math.min(minValue, point.value);
      });
      data.forEach((point, i) => {
        if (!point.targetX) {
          point.targetX = paddingX + (i / (data.length - 1)) * (width - paddingX * 2);
        }
        if (!point.targetY) {
          point.targetY =
            paddingY + ((point.value - minValue) / (maxValue - minValue)) * (height - paddingY * 2);
          point.targetY = height - point.targetY;
        }
        if (force || (!point.x && !point.y)) {
          point.x = point.targetX + 30;
          point.y = point.targetY;
          point.speed = 1; // 0.09 + ( 1 - ( i / data.length ) ) * 0.05;
        }
      });
    }

    function render() {
      if (!rendering) {
        requestAnimationFrame(render);
        return;
      }

      context.clearRect(0, 0, width, height);
      const progressDots = Math.floor(progress * data.length);
      const progressFragment = progress * data.length - Math.floor(progress * data.length);
      data.forEach((point, i) => {
        if (i <= progressDots) {
          point.x += (point.targetX - point.x) * point.speed;
          point.y += (point.targetY - point.y) * point.speed;
          context.save();
          const wordWidth = context.measureText(point.label).width;
          context.globalAlpha = i === progressDots ? progressFragment : 1;
          context.fillStyle = point.future ? '#aaa' : '#fff';

          if (i == 0 && i < progressDots && !point.future) {
            // 画点。
            context.beginPath();
            context.arc(point.x, point.y, radius, 0, Math.PI * 2);
            context.fillStyle = color;
            context.fill();
          }

          context.restore();
        }
      });

      context.save();
      context.beginPath();
      context.strokeStyle = color;
      context.lineWidth = borderWidth;

      let futureStarted = false;

      data.forEach((point, i) => {
        if (i <= progressDots) {
          const px = i === 0 ? data[0].x : data[i - 1].x;

          const py = i === 0 ? data[0].y : data[i - 1].y;

          let x = point.x;

          let y = point.y;

          if (i === progressDots) {
            x = px + (x - px) * progressFragment;
            y = py + (y - py) * progressFragment;
          }

          if (point.future && !futureStarted) {
            futureStarted = true;

            context.stroke();
            context.beginPath();
            context.moveTo(px, py);
            context.strokeStyle = '#aaa';

            if (typeof context.setLineDash === 'function') {
              context.setLineDash([2, 3]);
            }
          }

          if (i === 0) {
            context.moveTo(x, y);
          } else {
            context.lineTo(x, y);
          }
        }
      });

      context.stroke();
      context.restore();

      progress += 0.03; // ( 1 - progress ) * 0.02; //加载进度快慢控制
      requestAnimationFrame(render);
    }

    this.start = function() {
      rendering = true;
    };

    this.populate = function(points) {
      progress = 0;
      data = points;
      format();
    };
  };
  // 长宽控制折线出现的位置
  const chart = new LineChart({
    data: [],
    width: 800,
    height: 200,
  });

  reset(x, y, a, b, c, d);

  chart.start();

  function reset(x, y, a, b, c, d) {
    // targetX,targetY:控制节点位置
    chart.populate([
      {
        value: 0,
        targetX: x,
        targetY: y,
      },
      {
        value: 300,
        targetX: a,
        targetY: b,
      },
      {
        value: 300,
        targetX: c,
        targetY: d,
      },
    ]);
  }
}
/**
 * 划线方法
 * var a=new Line();
 * 开始调用
 * a.show(x,y,{
 *    picpath:xx //图片路径
 *    carnum:xx //车牌号
 *    cartype:xx //车牌种类
 *    alerttype:xx //汽车种类（例如假套牌）
 * })
 *
 * 清空画布
 * a.clear()
 */
export class Line {
  constructor() {
    this.canvas = window.document.getElementById('myCanvas'); // 画布
    this.parent = this.canvas.parentNode; // 整个功能dom节点
    this.div = this.canvas.nextElementSibling; // 靠近画布的div（包裹，img,carnum等）
    this.img = window.document.getElementById('img');
    this.carNumDom = window.document.getElementById('carNum');
    this.type = window.document.getElementById('type');
    this.Timer1 = null;
    this.Timer2 = null;
    this.Timer3 = null;
    this.radius = 5; // 下边圆的半径
    this.width = 100; // 画布的宽
  }

  move(x, y) {
    const outHeight = this.canvas.offsetHeight;
    this.parent.style.cssText = `top:${y - outHeight + this.radius}px;left:${x -
      this.radius}px;z-index:10`;
  }

  show(x, y, params) {
    this.canvas.style.cssText = `width:${this.width}px;height:${this.width * 2}px;display:block`;
    const { picpath = '', carnum = '---', cartype = '02', alerttype = '---' } = params;
    //this.img.src = picpath;
    this.type.innerHTML = alerttype;
    /* react dom 转html dom */
    const car = getCarNumStyle(carnum, cartype);
    const carStyle = car.props.style;
    const style = `background:${carStyle.background};
      color:${carStyle.color};
      font-size:${carStyle.fontSize};
      height:${carStyle.height}px;
      line-height:${carStyle.lineHeight};
      padding:${carStyle.padding};
      width:${carStyle.width}px;`;
    this.carNumDom.innerHTML = `<div class='${car.props.className}' style='${style}'>${
      car.props.children
    }</div>`;

    /* 只能在这里等上面结束后取宽高 */
    const outHeight = this.parent.offsetHeight;
    // 确定外框的位置
    this.parent.style.cssText = `top:${y - outHeight + this.radius}px;left:${x -
      this.radius}px;z-index:10`;
    // 600ms画完canvas
    this.Timer1 = setTimeout(() => {
      this.div.style.cssText = 'display:block';
    }, 600);
    // 3000ms之后消失
    /*this.Timer2 = setTimeout(() => {
      this.parent.className += ' CommonOpacity';
    }, 3400);
    this.Timer3 = setTimeout(() => {
      this.canvas.style.cssText = 'display:none';
      this.div.style.cssText = 'display:none';
      this.parent.style.cssText = 'z-index:-1';
      this.parent.className = this.parent.className.replace(
        new RegExp('(\\s|^)CommonOpacity(\\s|$)'),
        ''
      );
    }, 3800);*/

    main(
      0,
      this.width * 2 - this.radius,
      0.8 * this.width,
      10,
      this.width,
      10,
      this.canvas,
      this.radius,
      this.width
    );
  }

  clear() {
    clearTimeout(this.Timer1);
    this.Timer1 = null;
    /*  clearTimeout(this.Timer2);
    this.Timer2 = null;
    clearTimeout(this.Timer3)
    this.Timer3 = null;;*/
    this.parent.style.cssText = 'z-index:-1';
    this.div.style.cssText = 'display:none';
    this.canvas.style.cssText = 'display:none';
    this.parent.className = this.parent.className.replace(
      new RegExp('(\\s|^)CommonOpacity(\\s|$)'),
      ''
    );
  }
}

/* 纯函数 */
export default () => {
  return (
    <div className={styles.canvasRight}>
      <canvas id="myCanvas" />
      <div className={styles.wrapTopRight}>
        <div className={styles.top}>
          <p id="carNum">鲁B12345</p>
          <p id="type">逃逸车</p>
        </div>
        <div className={styles.bottom}>
          <Row style={{ zIndex: 2 }}>
            <Col span={8}>
              <Button type="primary" onClick={() => {}}>
                视频
              </Button>
            </Col>
            <Col span={8}>
              <Button type="primary" onClick={() => {}}>
                xxxx
              </Button>
            </Col>
            <Col span={8}>
              <Button type="primary" onClick={() => {}}>
                xxxx
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};
