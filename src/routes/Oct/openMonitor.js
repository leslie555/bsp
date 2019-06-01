import React from 'react';
import { connect } from 'dva';
import { Modal, message, Row, Col, Button } from 'antd';

const { confirm } = Modal;

class openMonitor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
    };
  }

  componentDidMount() {
  }

  openExe(strPath) {
    const { visible } = this.state;
    // console.log(strPath, this);
    try {
      // 新建一个ActiveXObject对象
      const a = new window.ActiveXObject('wscript.shell');
      a.run(strPath);
    } catch (e) {
      Modal.error({
        title: '错误',
        content: `找不到文件：${strPath}，请检查路径是否正确！`,
      });
      // message.error(`找不到文件：${strPath}，请检查路径是否正确！`);
    }
  }

  render() {
    return (
      <div style={{ height: '300px', width: '600px', position: 'absolute', left: 'calc(50% - 300px)', top: '50px', padding: '20px', border: '1px solid rgba(0,0,0,0.2)' }}>
        <Row>
          <Col span={1} />
          <Col style={{ fontSize: '22px' }} span={15}>如果不能打开请检查</Col>
          <Col span={24} style={{ width: '100%', paddingTop: '0', fontSize: '18px' }}>
            <p>1、ie设置:<br />降低安全级别如 Intenet选项——安全——自定义级别——对未标记的ActiveX控...————<span style={{ color: 'green' }}>启用</span></p>
            <p>2、monitor的地址为：<span style={{ color: 'red' }}>D:\monitor\bin\Monitor.exe</span>，请确保本地磁盘地址正确。</p>
            <div align="center">
              <Button onClick={() => this.openExe('file:///D:/monitor/bin/Monitor.exe')} style={{ textAlign: 'center' }}>打开monitor</Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
function mapStateToProps({ octopenMonitor, common, loading }) {
  return { octopenMonitor, common, loading: loading.models.octopenMonitor };
}
export default connect(mapStateToProps)(openMonitor);
