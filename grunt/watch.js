module.exports = {
  browserify: {
    files: ['src/*.js','Gruntfile.js'],
    tasks: ['browserify', 'notify:browserify']        
  },

  jshint: {
    files: ['src/*.js','Gruntfile.js'],
    tasks: ['newer:jshint', 'notify:jshint']
  },

  test: {
  	files: ['test/*.js', 'test/**/*.js'],
  	tasks: ['connect:test', 'mocha']
  }
};