var chokidar = require('chokidar'),
	path = require('path');


function watch(root, dataList, done) {
	var watchList = [];
	watchList = dataList;

	function listener(type) {

		return function (file) {

			var dirPath,
				dirFile,
				dirName;
			dirPath = "/" + path.relative(root, file).replace(/[\\]/g, '/');
			for (var i = 0; i < dataList.length; i++) {
				if (dirPath.indexOf("/" + dataList[i]) === 0) {
					//×îºóÎªindex.xxx
					if (/(index.html)$/.test(dirPath)) {
						dirName = dirPath.replace(/(\/index.html)/, '');
					} else {
						dirName = dirPath.replace(/(\.txt)/, '');
					}
					if (typeof done == "function") {
						done(dirName, file);
					}
				}
			}
		}
	}

	var watcher = chokidar
		.watch(root)
		.on('add', listener('add'))
		.on('change', listener('change'))
		.on('unlink', listener('unlink'))
		.on('unlinkDir', listener('unlinkDir'))
		.on('error', function (err) {
			throw 'Error'
		});


}

module.exports = watch;