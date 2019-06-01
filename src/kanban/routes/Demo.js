import React from 'react';
import { connect } from 'dva';
import { message, Modal } from 'antd';
import SectionPills from './SectionPills';
import styles from './Main.css';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  componentDidMount() {

  }


  render() {
    return (
      <div className={styles.normal}>
        <SectionPills />
      </div>


    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Main);
