
module.exports = {
	json: function(res, data) {
		res.json(data);
	},
	
	json1: function(res, data) {
		res.json(data && data.length == 1 ? data[0] : []);
	},
	
	error400: function(res, err) {
		//res.status(400).send("HTTP/1.1 400 Bad Request\nContent-Type: application/json\n"+JSON.stringify({"error": err}));
		console.log("ERROR 400: "+JSON.stringify(err));
		res.status(400).json(err);
	},
	
	error403: function(res) {
		console.log("ERROR 403");
		res.status(403).send();
	},
	
	error500: function(res, err) {
		console.log("ERROR 500: "+JSON.stringify(err));
		res.status(500).json(err);
	},
	
	
	created: function(res, data) {
		res.status(201).json({});
	},
	
	updated: function(res, data) {
		res.status(202).json({});
	},
	
	deleted: function(res, data) {
		res.status(202).json({});
	},	
}