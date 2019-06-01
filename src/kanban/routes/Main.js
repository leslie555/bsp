import React from 'react';
import { connect } from 'dva';
import { message, Modal } from 'antd';
import styles from './Main.css';
/* eslint-disable   */
class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = { warnVisible: false };
    this.experTime = 10; // 超时时间，单位分钟
    this.resetTimer = this.resetTimer.bind(this);
    this.checkLogin = this.checkLogin.bind(this);
    this.clearSth = this.clearSth.bind(this);
  }

  componentDidMount() {
    if (window.location.href.indexOf('/HiatmpPro?logoutfromlocal=CAS') > 0) {
      return;
    }
    this.loginTimer = setInterval(this.checkLogin, 1000000);
    window.addEventListener('mousemove', this.resetTimer);
    window.addEventListener('beforeunload', (e) => {
      this.clearSth();
    });
  }

  componentWillUnmount() {
    this.clearSth();
  }

  checkLogin() {
    const timer = window.localStorage.getItem('timer');
    if (timer) {
      const passtime = new Date().getTime() - timer;
      const countDown = parseInt(((this.experTime * 60000) - passtime) / 1000, 10); // 倒计时
      // console.log(countDown);
      if (countDown <= 0) { // 注销
        window.location.href = '/HiatmpPro?logoutfromlocal=CAS';
        this.clearSth();
      } else if (countDown <= 5) { // 倒计时
        message.destroy();
        message.warning(<span>您长时间未操作，系统将在 <span
          style={{ fontSize: '14px', color: 'red' }}
        >{countDown}
        </span> 秒后自动注销
        </span>, 5);
      } else {
        message.destroy();
      }
    } else {
      this.resetTimer();
    }
  }

  clearSth() {
    clearInterval(this.loginTimer);
    window.localStorage.removeItem('timer');
  }


  resetTimer() {
    window.localStorage.setItem('timer', new Date().getTime());
    if (message) {
      message.destroy();
    }
  }

  render() {
    return (
      <div className={styles.normal}>
        {this.props.children}
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Main);
