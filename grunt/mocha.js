module.exports = {
  all: {
    options: {
      run: true,
      urls: ['http://localhost:<%= connect.test.options.port %>/index.html']
    }
  }
};