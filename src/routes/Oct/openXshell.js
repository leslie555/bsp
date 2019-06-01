import React from 'react';
import { connect } from 'dva';
import { Modal, message, Row, Col, Button, Input } from 'antd';

const { confirm } = Modal;

class openXshell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: 'root',
      ip: '20.0.0.1',
    };
  }

  componentDidMount() {
  }

  openExe(strPath) {
    // console.log(strPath, this);
    const { user, ip } = this.state;
    // try {
    //   // 新建一个ActiveXObject对象
    //   const a = new window.ActiveXObject('wscript.shell');
    //   const param = `${strPath} -url ssh://${user}@${ip}`;
    //   a.run(param);
    // } catch (e) {
    //   Modal.error({
    //     title: '错误',
    //     content: `找不到文件：${strPath}，请检查路径是否正确！`,
    //   });
    // }
    // aa
  }

  render() {
    return (
      <div style={{ height: '300px', width: '600px', position: 'absolute', left: 'calc(50% - 300px)', top: '50px', padding: '20px', border: '1px solid rgba(0,0,0,0.2)' }}>
        <Row>
          <Col span={1} />
          <Col style={{ fontSize: '22px' }} span={15}>如果不能打开请检查</Col>
        </Row>
        <Row>
          <Col span={24} style={{ width: '100%', paddingTop: '0', fontSize: '18px' }}>
            <p><span style={{ color: 'red' }}>d:\xshell\XshellXftpPortable.exe</span>，请确保本地磁盘地址正确。</p>
            <div align="center">
              <Button onClick={() => this.openExe('file:///D:/xshell/XshellPortable.exe')} style={{ textAlign: 'center' }}>打开Xshell</Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
function mapStateToProps({ octopenXshell, common, loading }) {
  return { octopenXshell, common, loading: loading.models.octopenXshell };
}
export default connect(mapStateToProps)(openXshell);
