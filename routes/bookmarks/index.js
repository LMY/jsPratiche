
module.exports = function(config, dirpath) {
	
	var router = config.deps.express.Router();
	
	const files = [ 'bookmarks' ];
	files.forEach(f => { router.use('/' + f, require('./' + f)); });

	return router;
}
