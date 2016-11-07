
module.exports = function(config, dirpath) {
	
	var router = config.deps.express.Router();
	
	const files = [ 'pm', 'board', 'sharednotes' ];
	files.forEach(f => { router.use('/' + f, require('./' + f)); });

	return router;
}
