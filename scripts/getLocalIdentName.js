const pathxxx = require('path');
module.exports = path => {
  const antdProPath = path.match(/src(.*)/)[1].replace('.less', '');
  const arr = antdProPath
    .split(`${pathxxx.sep}`)
    .map(a => a.replace(/([A-Z])/g, '-$1'))
    .map(a => a.toLowerCase());
  return `himap${arr.join('-')}-`.replace(/--/g, '-');
};
