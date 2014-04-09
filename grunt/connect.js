var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};
module.exports = {
  test: {
    options: {
      keepalive: true,
      port: 9001,
      middleware: function (connect) {
        return [
          mountFolder(connect, 'test')
        ];
      }
    }
  }
};
