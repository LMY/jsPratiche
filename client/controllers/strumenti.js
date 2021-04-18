angular.module('app')
	.factory('Strumenti', ['$resource', function($resource){
		return $resource('/pratiche/strumenti/:id', null, {
			'update': { method:'PUT' }
		});
	}])
	.factory('StrumentiFree', ['$resource', function($resource){
		return $resource('/pratiche/strumenti/free/:id', null, {
			'update': { method:'PUT' }
		});
	}])
	.factory('StrumentiCatena', ['$resource', function($resource){
		return $resource('/pratiche/strumenti/:id', null, {
			'get' : { method:'GET', url:'/pratiche/strumenti/catena/:id', isArray:true },
			'update': { method:'PUT' }
		});
	}])
	.factory('Catene', ['$resource', function($resource){
		return $resource('/pratiche/catene/:id', null, {
			'update': { method:'PUT' }
		});
	}])
	.factory('RegistroStrumenti', ['$resource', function($resource){
		return $resource('/pratiche/strumentiregistro/:id', null, {
			'update': { method:'PUT' }
		});
	}])
	.factory('RegistroStrumentiLatest', ['$resource', function($resource){
		return $resource('/pratiche/strumentiregistro/latest/:id', null, {
			'update': { method:'PUT' }
		});
	}])
	.factory('Calibrazioni', ['$resource', function($resource){
		return $resource('/pratiche/strumenticalibrazioni/:id', null, {
			'update': { method:'PUT' }
		});
	}])
	.factory('CalibrazioniCatena', ['$resource', function($resource){
		return $resource('/pratiche/strumenticalibrazioni/:id', null, {
			'get' : { method:'GET', url:'/pratiche/strumenticalibrazioni/catena/:id', isArray:true },
			'update': { method:'PUT' }
		});
	}])
	.factory('Sedi', ['$resource', function($resource){
		return $resource('/pratiche/sedi/:id', null, {
			'update': { method:'PUT' }
		});
	}])

	.controller('StrumentiController', ['$scope', 'Me', 'PMcount','Strumenti', '$location', function($scope, Me, PMcount, Strumenti, $location) {
		$scope.me = Me.get();
		$scope.pmcount = PMcount.get();

		$scope.orderByField = 'id';
		$scope.reverseSort = false;
		$scope.strumenti = Strumenti.query();

		$scope.new = function() {
			$location.url('strumenti/new');
		}
		$scope.show = function(id) {
			$location.url('strumenti/'+id);
		}
	}])

	.controller('StrumentoDetailCtrl', ['$scope', '$routeParams', 'Me', 'PMcount','Strumenti', '$location', 'ModalService', function($scope, $routeParams, Me, PMcount, Strumenti, $location, ModalService) {
		$scope.me = Me.get();
		$scope.pmcount = PMcount.get();

		$scope.isnew = ($routeParams.id === "new");
		$scope.estrumento = $scope.isnew ? {} : Strumenti.get({id: $routeParams.id });
		$scope.title = $scope.isnew ? "Nuovo Strumento" : "Strumento "+$routeParams.id;

		$scope.update = function() {
			if ($scope.isnew) {
				if (!$scope.estrumento || $scope.estrumento.length < 1) return;

				var strumento = new Strumenti({ name: $scope.estrumento.name, PMcount, marca: $scope.estrumento.marca, modello: $scope.estrumento.modello, serial: $scope.estrumento.serial, inventario: $scope.estrumento.inventario, tipo: $scope.estrumento.tipo, taratura: $scope.estrumento.taratura, caratteristiche: $scope.estrumento.caratteristiche, note: $scope.estrumento.note });
				strumento.$save(function(){
					$location.url('strumenti-strumenti');
				});
			}
			else
				Strumenti.update({id: $scope.estrumento.id}, $scope.estrumento, function() {
					$location.url('strumenti-strumenti');
				});
		}

		$scope.remove = function() {
			askconfirm(ModalService, function() {
				Strumenti.remove({id: $scope.estrumento.id}, function() {
					$location.url('strumenti-strumenti');
				})
			}, "Sei sicuro di voler rimovere "+$scope.estrumento.serial+"?");
		}

		$scope.cancel = function() {
			$location.url('strumenti-strumenti');
		}
	}])

	.controller('CateneController', ['$scope', 'Me', 'PMcount','Catene', '$location', function($scope, Me, PMcount, Catene, $location) {
		$scope.me = Me.get();
		$scope.pmcount = PMcount.get();

		$scope.orderByField = 'id';
		$scope.reverseSort = false;

		$scope.catene = Catene.query(function() {
			var today = moment();

			$scope.catene.forEach(function(x) {
				if (!x.scadenza) {
					x.scadenzaType = "time-danger";
					return;
				}

				var diff = (moment.duration(moment(x.scadenza).diff(today)).asDays())|0;

				if (diff < 0)
					x.scadenzaType = "time-danger";
				else if (diff < 7)
					x.scadenzaType = "time-red";
				else if (diff < 30)
					x.scadenzaType = "time-orange";
				else
					x.scadenzaType = "time-green";
			});
		});

		$scope.new = function() {
			$location.url('catene/new');
		}
		$scope.show = function(id) {
			$location.url('catene/'+id);
		}
	}])
	.controller('CatenaDetailCtrl', ['$scope', '$routeParams', 'Me', 'PMcount','Catene', 'StrumentiCatena', 'StrumentiFree', 'CalibrazioniCatena', '$location', '$route', 'ModalService', function($scope, $routeParams, Me, PMcount, Catene, StrumentiCatena, StrumentiFree, CalibrazioniCatena, $location, $route, ModalService) {
		$scope.me = Me.get();
		$scope.pmcount = PMcount.get();

		$scope.isnew = ($routeParams.id === "new");
		$scope.ecatena = $scope.isnew ? {} : Catene.get({ id: $routeParams.id });
		$scope.title = $scope.isnew ? "Nuova Catena" : "Catena "+$routeParams.id;
		$scope.strumenticatena = StrumentiCatena.get({ id: $routeParams.id });
		$scope.strumenti = StrumentiFree.query();
		$scope.calibrazioni = CalibrazioniCatena.get({ id: $routeParams.id });

		$scope.addstrum = false;
		$scope.orderByField1 = "id";
		$scope.reverseSort1 = false;
		$scope.orderByField2 = "id";
		$scope.reverseSort2 = false;
		$scope.orderByField3 = "id";
		$scope.reverseSort3 = false;

		$scope.update = function() {
			if ($scope.isnew) {
				if (!$scope.ecatena || $scope.ecatena.length < 1) return;

				var catena = new Catene({ name: $scope.ecatena.name, PMcount, note: $scope.ecatena.note });
				catena.$save(function(){
					$location.url('strumenti-catene');
				});
			}
			else
				Catene.update({id: $scope.ecatena.id}, $scope.ecatena, function() {
					$location.url('strumenti-catene');
				});
		}

		$scope.remove = function() {
			askconfirm(ModalService, function() {
				Catene.remove({id: $scope.ecatena.id}, function() {
					$location.url('strumenti-catene');
				})
			}, "Sei sicuro di voler rimovere "+$scope.ecatena.name+"?");
		}

		$scope.cancel = function() {
			$location.url('strumenti-catene');
		}

		$scope.add = function(id) {
			if ($scope.isnew) { alert("Prima crea la catena, poi aggiungi/rimuovi gli strumenti"); return; }

			StrumentiFree.update({id: $scope.ecatena.id}, new StrumentiFree({verb: "add", idStrumento: id}), function() {
				$route.reload();
			});
		}

		$scope.remove = function(id) {
			if ($scope.isnew) { alert("Prima crea la catena, poi aggiungi/rimuovi gli strumenti"); return; }

			StrumentiFree.update({id: $scope.ecatena.id}, new StrumentiFree({verb: "remove", idStrumento: id}), function() {
				$route.reload();
			});
		}

		$scope.addcalib = function() {
			$location.url('calibrazione/new');
		}

		$scope.showcalib = function(id) {
			$location.url('calibrazione/'+id);
		}
	}])
	.controller('CalibrazioneDetailCtrl', ['$scope', '$routeParams', 'Me', 'PMcount','Catene', 'Calibrazioni', '$window', 'ModalService', function($scope, $routeParams, Me, PMcount, Catene, Calibrazioni, $window, ModalService) {
		$scope.me = Me.get();
		$scope.pmcount = PMcount.get();

		$scope.isnew = ($routeParams.id === "new");
		$scope.ecalibrazione = $scope.isnew ? {} : Calibrazioni.get({id: $routeParams.id });
		$scope.title = $scope.isnew ? "Nuova Calibrazione" : "Calibrazione "+$routeParams.id;
		$scope.catene = Catene.query();

		$scope.update = function() {
			if ($scope.isnew) {
				if (!$scope.ecalibrazione || $scope.ecalibrazione.length < 1) return;

				var calibrazione = new Calibrazioni({ idCatena: $scope.ecalibrazione.idCatena, lab: $scope.ecalibrazione.lab, certn: $scope.ecalibrazione.certn, dateCal: $scope.ecalibrazione.dateCal, note: $scope.ecalibrazione.note, scadenza: $scope.ecalibrazione.scadenza });
				calibrazione.$save(function(){
					$window.history.back();
				});
			}
			else
				Calibrazioni.update({id: $scope.ecalibrazione.id}, $scope.ecalibrazione, function() {
					$window.history.back();
				});
		}

		$scope.remove = function() {
			askconfirm(ModalService, function() {
				Calibrazioni.remove({id: $scope.ecalibrazione.id}, function() {
					$window.history.back();
				})
			}, "Sei sicuro di voler rimovere questa calibrazione?");
		}

		$scope.cancel = function() {
			$window.history.back();
		}
	}])
	.controller('StrumentiStoricoCtrl', ['$scope', 'Me', 'PMcount','RegistroStrumenti', '$location', function($scope, Me, PMcount, RegistroStrumenti, $location) {
		$scope.me = Me.get();
		$scope.pmcount = PMcount.get();

		$scope.orderByField = 'id';
		$scope.reverseSort = false;
		$scope.registro = RegistroStrumenti.query();

		$scope.show = function(id) {
			$location.url('catene/'+id);
		}
	}])
	.controller('StrumentiRegistroCtrl', ['$scope', 'Me', 'PMcount','RegistroStrumentiLatest', 'Sedi', '$location', '$route', function($scope, Me, PMcount, RegistroStrumentiLatest, Sedi, $location, $route) {
		$scope.me = Me.get();
		$scope.pmcount = PMcount.get();

		$scope.orderByField = 'id';
		$scope.reverseSort = false;
		$scope.sedi = Sedi.query();
		$scope.registro = RegistroStrumentiLatest.query(function(data) {

			$scope.registro.forEach(function(x) {
				var dateFrom = moment(x.timePointFrom);
				var dateTo = moment(x.timePointTo);

				if (!dateFrom.isValid()) x.timePointFrom = "";
				if (!dateTo.isValid()) x.timePointTo = "";

				if (!dateTo.isValid() && !dateFrom.isValid()) {			// never taken
					x.isopen = false;
					x.sede = "Mai Preso!";
				}
				else if (!dateTo.isValid() && dateFrom.isValid()) {		// open
					x.isopen = true;
				}
				else if (dateTo.isValid() && dateFrom.isValid()) {		// closed
					x.isopen = false;
				}

				x.catena = x.name;
			});
		});

		$scope.open = function(id) {
			var entry = new RegistroStrumentiLatest({ verb: 'open', idUtente:$scope.me.id, timePointFrom: moment().format() });

			RegistroStrumentiLatest.update({id: id}, entry, function(){
				$route.reload();
			});
		}

		$scope.close = function(id, idSede) {
			if (!idSede || idSede == 0) {
				alert("Specificare sede!");
				return;
			}

			var entry = new RegistroStrumentiLatest({ verb: 'close', idUtente:$scope.me.id, timePointTo: moment().format(), idSedeTo:idSede });

			RegistroStrumentiLatest.update({id: id}, entry, function(){
				$route.reload();
			});
		}
	}])

;
