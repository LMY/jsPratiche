
module.exports = function(config, dirpath) {

	var router = config.deps.express.Router();

	const files = [ 'sedi', 'consttipopratiche', 'praticheinfo', 'pratiche', 'integrazioni', 'statopratiche', 'strumenti', 'catene', 'strumentiregistro', 'strumenticalibrazioni' ];
	files.forEach(f => { router.use('/' + f, require('./' + f)); });

	return router;
}
