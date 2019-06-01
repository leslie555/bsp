import { container, title } from '../../../material-kit-react.jsx';

const pillsStyle = {
  section: {
    padding: '0',
    background: "url('/HiatmpPro/kanban/apingpuBackground.png') no-repeat #0E132B",
    backgroundSize: 'cover',
    minHeight: '100vh',
    overflow: 'auto',
  },
  container,
  title: {
    ...title,
    margin: '0.1rem 0 0rem',
    minHeight: '32px',
    paddingTop: '42px',
    textDecoration: 'none',
    fontSize: '30px',
  },
};

export default pillsStyle;
