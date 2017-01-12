angular.module('app')
	.factory('Pratiche', ['$resource', function($resource){
		return $resource('/pratiche/pratiche/:id', null, {
			'update': { method:'PUT' }
		});
	}])

	.factory('PraticheProtoOUT', ['$resource', function($resource){
		return $resource('/pratiche/pratiche/protoout/:id', null, {
			'update': { method:'PUT' }
		});
	}])
	.factory('PraticheCorreggere', ['$resource', function($resource){
		return $resource('/pratiche/pratiche/:id', null, {
			'query': { isArray: true, method:'GET', url:'/pratiche/pratiche/correggere' },
			'update': { method:'PUT' }
		});
	}])
	.factory('PraticheProtocollare', ['$resource', function($resource){
		return $resource('/pratiche/pratiche/:id', null, {
			'query': { isArray: true, method:'GET', url:'/pratiche/pratiche/protocollare' },
			'update': { method:'PUT' }
		});
	}])
	.factory('PraticheAll', ['$resource', function($resource){
		return $resource('/pratiche/pratiche/:id', null, {
			'query': { isArray: true, method:'GET', url:'/pratiche/pratiche/all' },
			'update': { method:'PUT' }
		});
	}])
	.factory('Integrazioni', ['$resource', function($resource){
		return $resource('/pratiche/integrazioni/:id', null, {
			'update': { method:'PUT' }
		});
	}])

	.factory('ConstStatiPratiche', ['$resource', function($resource){
		return $resource('/pratiche/statopratiche/stati', null);
	}])
	.factory('ConstTipiPratiche', ['$resource', function($resource){
		return $resource('/pratiche/statopratiche/tipi', null);
	}])
	.factory('StoricoStatoPratiche', ['$resource', function($resource){
		return $resource('/pratiche/statopratiche/:id', null, {
			'get' : { method:'GET', url:'/pratiche/statopratiche/history/:id', isArray:true },
			'update': { method:'PUT' }
		});
	}])
	.factory('IntegrazioniPratica', ['$resource', function($resource){
		return $resource('/pratiche/integrazioni/:id', null, {
			'get' : { method:'GET', url:'/pratiche/integrazioni/:id', isArray:true },
			'update': { method:'PUT' }
		});
	}])


	.controller('IntegrazioneCtrl', ['$scope', '$routeParams', 'Me', 'PMcount','Integrazioni', '$window', function($scope, $routeParams, Me, PMcount, Integrazioni, $window) {
		$scope.me = Me.get();
		$scope.pmcount = PMcount.query();

		$scope.eintegrazione = Integrazioni.get({id: $routeParams.id }, function(x) {
			x.dateIN = x.dateIN ? moment(x.dateIN.substring(0, 10)).format("YYYY-MM-DD") : null;
			x.dateOUT = x.dateOUT ? moment(x.dateOUT.substring(0, 10)).format("YYYY-MM-DD") : null;
		});
		$scope.title = "Integrazione "+$routeParams.id;

		$scope.update = function( ){
			Integrazioni.update({id: $scope.eintegrazione.id}, $scope.eintegrazione, function() {
				$window.history.back();
			});
		}

		$scope.cancel = function() {
			$window.history.back();
		}
	}])

	.controller('PraticheController', ['$scope', 'Me', 'PMcount','Pratiche', '$location', function($scope, Me, PMcount, Pratiche, $location) {
		$scope.me = Me.get();
		$scope.pmcount = PMcount.query();

		$scope.orderByField = 'dateIN';
		$scope.reverseSort = false;

		$scope.pratiche = Pratiche.query(function() {

			var today = moment();

			$scope.pratiche.forEach(function(x) {
				x.rowClass = getTableRowClass(x.idStato);

				if (x.stringStato == "Arrivata") x.stringUser = "";	// fix: pratiche arrivate non sono in carico di nessuno

				var arrivo = moment(x.dateIN);
				var diff = moment.duration(today.diff(arrivo)).asDays();
				var integDiff = (x.diff?x.diff/2:0);				// /2 = fix alla query che conta doppie le integrazioni!

				if (x.stringStato == "Attesa Integrazione") {
					x.scadenza = "";
					x.scadenzaData = "";
				}
				else {
					x.scadenza = ((30-diff + integDiff )|0);
					x.scadenzaData = arrivo.add(30 + integDiff, 'd').format('YYYY-MM-DD');

					if (x.scadenza < 0)
						x.scadenzaType = "time-danger";
					else if (x.scadenza < 7)
						x.scadenzaType = "time-red";
					else if (x.scadenza < 15)
						x.scadenzaType = "time-orange";
					else //if (x.scadenza < 30)
						x.scadenzaType = "time-green";
				}
			});
		});

		$scope.new = function() {
			$location.url('pratiche/detail/new');
		}
		$scope.show = function(id) {
			$location.url('pratiche/'+id);
		}
	}])
	.controller('PraticheAllController', ['$scope', 'Me', 'PMcount','PraticheAll', '$location', function($scope, Me, PMcount, PraticheAll, $location) {
		$scope.me = Me.get();
		$scope.pmcount = PMcount.query();

		$scope.dateFrom = moment().subtract(30, 'day').format("YYYY-MM-DD");
		$scope.dateTo = moment().format("YYYY-MM-DD");

		$scope.orderByField = 'dateIN';
		$scope.reverseSort = false;
		$scope.pratiche = PraticheAll.query(function() {
			$scope.pratiche.forEach(function(x) {
				x.rowClass = getTableRowClass(x.idStato);
				if (x.stringStato == "Arrivata") x.stringUser = "";	// fix: pratiche arrivate non sono in carico di nessuno
			});
		});
		$scope.show = function(id) {
			$location.url('pratiche/'+id);
		}

		$scope.startDate = new Date();
		$scope.endDate = new Date();
	}])
	.controller('PraticheCorreggereController', ['$scope', 'Me', 'PMcount','PraticheCorreggere', '$location', function($scope, Me, PMcount, PraticheCorreggere, $location) {
		$scope.me = Me.get();
		$scope.pmcount = PMcount.query();

		$scope.orderByField = 'dateIN';
		$scope.reverseSort = false;
		$scope.pratiche = PraticheCorreggere.query(function() {
			$scope.pratiche.forEach(function(x) {
				x.rowClass = getTableRowClass(x.idStato);
			});
		});
		$scope.show = function(id) {
			$location.url('pratiche/'+id);
		}
	}])
	.controller('PraticheProtocollareController', ['$scope', 'Me', 'PMcount','PraticheProtocollare', 'PraticheProtoOUT', '$route', "ModalService", function($scope, Me, PMcount, PraticheProtocollare, PraticheProtoOUT, $route, ModalService) {
		$scope.me = Me.get();
		$scope.pmcount = PMcount.query();

		$scope.orderByField = 'dateIN';
		$scope.reverseSort = false;

		$scope.pratiche = PraticheProtocollare.query(function() {
			$scope.pratiche.forEach(function(x) {
				x.rowClass = getTableRowClass(x.idStato);
			});
		});
		$scope.show = function(id) {
			ModalService.showModal({
				templateUrl: "client/templates/protoout.html",
				controller: "ProtoOUTController",
				inputs: {
					title: "ProtoOUT per pratica "+id
				}
			}).then(function(modal) {
				modal.element.modal();
				modal.close.then(function(result) {
					if (!result.approved)	// user switched to another /resource
						return;

					if (!result.protoout || result.protoout == "") {
						alert("Protocollo di uscita non valido!");
						return;
					}
					if (!result.date || result.date == "") {
						alert("Data di uscita non valida!");
						return;
					}

					var protoOUT = new PraticheProtoOUT({ id: id, protoOUT: result.protoout, dateOUT: result.date });

					PraticheProtoOUT.update({id: id}, protoOUT, function() {
						$route.reload();
					});
				});
			});
		}
	}])
	.controller('PraticaDetailController', ['$scope', '$routeParams', 'Pratiche', 'Me', 'PMcount','Comuni', 'Gestori', 'ConstStatiPratiche', 'ConstTipiPratiche', '$location', 'ModalService', function($scope, $routeParams, Pratiche, Me, PMcount, Comuni, Gestori, ConstStatiPratiche, ConstTipiPratiche, $location, ModalService) {

		$scope.me = Me.get();
		$scope.pmcount = PMcount.query();

		$scope.isnew = ($routeParams.id === "new");
		$scope.epratica = $scope.isnew ? {} : Pratiche.get({id: $routeParams.id }, function(x) {
			x.dateIN = x.dateIN ? moment(x.dateIN.substring(0, 10)).format("YYYY-MM-DD") : null;
			x.dateOUT = x.dateOUT ? moment(x.dateOUT.substring(0, 10)).format("YYYY-MM-DD") : null;
		});

		$scope.comuni = Comuni.query();
		$scope.gestori = Gestori.query();

		$scope.title = $scope.isnew ? "Nuova Pratica" : "Pratica "+$routeParams.id;

		$scope.conststatipratiche = ConstStatiPratiche.query();
		$scope.consttipipratiche = ConstTipiPratiche.query();

		$scope.update = function( ){
			if ($scope.isnew) {
				if (!$scope.epratica) return;
				if (!$scope.epratica.idGestore) { alert('Specificare il gestore!'); return; }
				if (!$scope.epratica.idComune) { alert('Specificare il Comune!'); return; }
				if (!$scope.epratica.tipopratica) { alert('Specificare il tipo di pratica!'); return; }

				var pratica = new Pratiche({ idGestore: $scope.epratica.idGestore, idComune: $scope.epratica.idComune, address: $scope.epratica.address, sitecode: $scope.epratica.sitecode, tipopratica: $scope.epratica.tipopratica, protoIN: $scope.epratica.protoIN, dateIN: $scope.epratica.dateIN,
					protoOUT: $scope.epratica.protoOUT, dateOUT: $scope.epratica.dateOUT, note: $scope.epratica.note, flag87bis: $scope.epratica.flag87bis,flagCongiunto: $scope.epratica.flagCongiunto, flagSupTerra: $scope.epratica.flagSupTerra, flagA24: $scope.epratica.flagA24 });

				pratica.$save(function(){
					$location.url('pratiche');
				});
			}
			else {
				Pratiche.update({id: $scope.epratica.id}, $scope.epratica, function() {
					$location.url('pratiche');
				});
			}
		}

		$scope.cancel = function() {
			$location.url('pratiche');
		}

		$scope.remove = function() {
			askconfirm(ModalService, function() {
				Pratiche.remove({id: $scope.epratica.id}, function() {
					$location.url('pratiche');
				});
			}, "Sei sicuro di voler rimovere la pratica?");
		}
	}])
	.controller('PraticaStatoDetailController', ['$window', '$scope', '$routeParams', 'Pratiche', 'Me', 'PMcount','Utenti', 'StoricoStatoPratiche', '$location', 'ModalService', function($window, $scope, $routeParams, Pratiche, Me, PMcount, Utenti, StoricoStatoPratiche, $location, ModalService) {
		$scope.me = Me.get(function(x) {
			$scope.selectedUser = $scope.me.id
		});
		$scope.pmcount = PMcount.query();

		$scope.utenti = Utenti.query();
		$scope.orderByField = "timePoint";
		$scope.reverseSort = true;

		$scope.epratica = Pratiche.get({id: $routeParams.id }, function(x) {
			if (x.dateIN) x.dateIN = x.dateIN.substring(0, 10);
			if (x.dateOUT) x.dateOUT = x.dateOUT.substring(0, 10);

			$scope.title = x.stringGestore + '-' +x.sitecode + ' / ' + x.stringComune + ' - ' + x.address;
		});

		$scope.history = StoricoStatoPratiche.get({id: $routeParams.id}, function() {
			for (var i=0; i<$scope.history.length; i++) {
				if ($scope.history[i].idStato ==  2) {
					if ($scope.history[i].usernameAss)
						$scope.history[i].descStato +=  " ("+$scope.history[i].usernameAss+")";
					else	// arrivata integrazione
						$scope.history[i].descStato +=  " - " + $scope.history[i].protoIN + " - "+ $scope.history[i].dateIN;
				}
				else if ($scope.history[i].idStato ==  7) {
					$scope.history[i].descStato +=  " - " + $scope.history[i].protoOUT + " - "+ $scope.history[i].dateOUT;
				}

				$scope.history[i].timePoint += " - "+$scope.history[i].usernameMod;
			}
		});

		$scope.showinteg = function(idInteg) {
			if (idInteg)
				$location.url('integrazione/'+idInteg);
		}

		$scope.cancel = function() {
			$window.history.back();
		}

		$scope.show = function() {
			$location.url('pratiche/detail/'+$scope.epratica.id);
		}

		$scope.integDate = moment(new Date()).format("YYYY-MM-DD");
		$scope.integProto = '';

		$scope.integric = function() {
			var newstate = new StoricoStatoPratiche({ idPratica: $scope.epratica.id, idStato: 7, integProto: $scope.integProto, integData: $scope.integDate, integNote: '' });

			newstate.$save(function(){
				$window.history.back();
			});
		}

		$scope.integarr = function() {

			var newstate = new StoricoStatoPratiche({ idPratica: $scope.epratica.id, idStato: 2, integProto: $scope.integProto, integData: $scope.integDate, integNote: '' });

			newstate.$save(function(){
				$window.history.back();
			});
		}

		$scope.stato = function(state, user) {
			if (state == 1) {
				askconfirm(ModalService, function() {
					var newstate = new StoricoStatoPratiche({ idPratica: $scope.epratica.id, idUtente: user, idStato: state });

					newstate.$save(function(){
						$window.history.back();
					});
				}, "Sei sicuro di voler rilasciare la pratica?");
			}
			else {
				var newstate = new StoricoStatoPratiche({ idPratica: $scope.epratica.id, idUtente: user, idStato: state });

				newstate.$save(function(){
					$window.history.back();
				});
			}
		}
	}])
;