import React from 'react';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';

// @material-ui/icons
import Dashboard from '@material-ui/icons/Dashboard';

// core components
import GridContainer from '../components/materialkit/Grid/GridContainer.jsx';
import GridItem from '../components/materialkit/Grid/GridItem.jsx';
import NavPills from '../components/materialkit/NavPills/NavPills.js';
import CategoryGridList from '../components/CategoryGridList';
import pillsStyle from '../assets/jss/material-kit-react/views/componentsSections/pillsStyle.jsx';

import style from './SectionPills.less';

class SectionPills extends React.Component {
  render() {
    const { classes, leftMenus = [], menuSelectedHandler, ToggleMenuShowType } = this.props;

    const tabs = leftMenus.map(x => ({
      tabButton: x.label,
      tabIcon: Dashboard,
      tabContent: (
        <CategoryGridList titleData={x.children} menuSelectedHandler={menuSelectedHandler} />
      ),
    }));

    return (
      <div className={classes.section}>
        <div className={classes.container}>
          <div id="navigation-pills" className={style.main}>
            <div className={classes.title}>
              <div className={style.title} />
              <div onClick={ToggleMenuShowType} className={style.titleright} />
            </div>
            <GridContainer className={style.container}>
              <GridItem xs={12} sm={12} md={12} lg={12}>
                <NavPills
                  color="info"
                  horizontal={{
                    tabsGrid: { xs: 4, sm: 2, md: 2 },
                    contentGrid: { xs: 12, sm: 10, md: 10 },
                  }}
                  tabs={tabs}
                />
              </GridItem>
            </GridContainer>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(pillsStyle)(SectionPills);
