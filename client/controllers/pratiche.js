var getTableRowClass = function(id) {
	if (!id|| id == 1)						// arrivata
		return "danger";
	else if (id == 2 || id == 3)			// in carico
		return "active";
	else if (id == 4 || id == 5)			// da correggere
		return "info";
	else if (id == 7)						// attesa integ
		return "warning";
	else if (id==8 || id==9 || id==6 || id==12)		// uscita/parere-condizionato
		return "success";
	else if (id==10 || id==11)				// cancellata/non-si-fa
		return "danger";

	return "";
}

var adjustPratica = function(pratiche) {

	var today = moment();

	pratiche.forEach(function(x) {
		x.rowClass = getTableRowClass(x.idStato);

		if (x.stringStato == "Arrivata") x.stringUser = "";	// fix: pratiche arrivate non sono in carico di nessuno
		if (x.dateOUT)
			x.days = moment.duration(moment(x.dateOUT).diff(moment(x.dateIN))).subtract(x.diff/2, "days").asDays()|0;
					
		var arrivo = moment(x.dateIN);
		var diff = moment.duration(today.diff(arrivo)).asDays();
		var integDiff = (x.diff?x.diff/2:0);				// /2 = fix alla query che conta doppie le integrazioni!

		if (x.stringStato == "Attesa Integrazione") {
			x.scadenza = "";
			x.scadenzaData = "";
		}
		else if (x.stringStato == "Com. Motivi Ostativi") {
			x.scadenza = 10-moment.duration(today.diff(moment(x.dateCommOst))).asDays()|0;
			x.scadenzaData = moment(x.dateCommOst).add(10, "d").format('YYYY-MM-DD');
			
			if (x.scadenza <= 0 || x.scadenza > 10) x.scadenzaType = "time-danger";
			else if (x.scadenza <= 3) x.scadenzaType = "time-red";
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
}

angular.module('app')
	.factory('Pratiche', ['$resource', function($resource){
		return $resource('/pratiche/pratiche/:id', null, {
			'update': { method:'PUT' }
		});
	}])
	.factory('PraticheInfo', ['$resource', function($resource){
		return $resource('/pratiche/praticheinfo/:id', null, {
			'update': { method:'PUT' },
			'get' : { isArray:true, method:'GET', url:'/pratiche/praticheinfo/:id' }
		});
	}])
	.factory('PraticheCount', ['$resource', function($resource){
		return $resource('/pratiche/pratiche/count');
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
	.factory('PraticheFatturazione', ['$resource', function($resource){
		return $resource('/dbemittenti/fatturazione/:id', null);
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


	.controller('ProtoOUTController', ['$scope', '$element', 'title', 'close',  function($scope, $element, title, close) {
		$scope.protoout = null;
		$scope.date = new Date();
		$scope.title = title;

		$scope.close = function() {
			close({ protoout: $scope.protoout, date: $scope.date, approved: true }, 500);
		};

		$scope.cancel = function() {
			$element.modal('hide');
		};
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
			adjustPratica($scope.pratiche);
		});

		$scope.new = function() {
			$location.url('pratiche/detail/new');
		}
		$scope.show = function(id) {
			$location.url('pratiche/'+id);
		}
	}])
	.controller('PraticheAllController', ['$scope', 'Me', 'PMcount', 'PraticheAll', '$location', function($scope, Me, PMcount, PraticheAll, $location) {
		$scope.me = Me.get();
		$scope.pmcount = PMcount.query();

		$scope.dateFrom = moment().subtract(30, 'day').set('date', 1).format("YYYY-MM-DD");
		$scope.dateTo = moment().format("YYYY-MM-DD");
		$scope.dateTypes = [ "dateIN", "dateOUT" ];
		$scope.dateType = "dateIN";

		$scope.orderByField = 'dateIN';
		$scope.reverseSort = false;

		$scope.show = function(id) {
			$location.url('pratiche/'+id);
		}

		$scope.requery = function(from, to, type) {
			$scope.pratiche = PraticheAll.query({ dateFrom: from, dateTo: to, dateType: type }, function() {
				adjustPratica($scope.pratiche);
			});
		}
		$scope.requery($scope.dateFrom, $scope.dateTo, $scope.dateType);	// GET $scope.pratiche
	}])
	.controller('PraticheCorreggereController', ['$scope', 'Me', 'PMcount','PraticheCorreggere', '$location', function($scope, Me, PMcount, PraticheCorreggere, $location) {
		$scope.me = Me.get();
		$scope.pmcount = PMcount.query();

		$scope.orderByField = 'dateIN';
		$scope.reverseSort = false;
		$scope.pratiche = PraticheCorreggere.query(function() {
			adjustPratica($scope.pratiche);
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
			adjustPratica($scope.pratiche);
		});
		$scope.show = function(id) {
			ModalService.showModal({
				templateUrl: "templates/protoout.html",
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
					protoOUT: $scope.epratica.protoOUT, dateOUT: $scope.epratica.dateOUT, note: $scope.epratica.note });

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
	.controller('PraticaStatoDetailController', ['$window', '$scope', '$routeParams', 'Pratiche', 'PraticheInfo', 'Me', 'PMcount','Utenti', 'StoricoStatoPratiche', '$location', 'ModalService', function($window, $scope, $routeParams, Pratiche, PraticheInfo, Me, PMcount, Utenti, StoricoStatoPratiche, $location, ModalService) {
		$scope.me = Me.get(function(x) {
			$scope.selectedUser = $scope.me.id
		});
		$scope.pmcount = PMcount.query();

		$scope.info = PraticheInfo.get({id: $routeParams.id }, function(x) {
			for (var i=0; i<x.length; i++) {
				x[i].isupdated = true;
				x[i].isnew = false;
			}
		});

		$scope.utenti = Utenti.query();
		$scope.orderByField = "timePoint";
		$scope.reverseSort = true;

		$scope.epratica = Pratiche.get({id: $routeParams.id }, function(x) {
			if (x.dateIN) x.dateIN = x.dateIN.substring(0, 10);
			if (x.dateOUT) x.dateOUT = x.dateOUT.substring(0, 10);

			$scope.title = x.stringGestore + '-' +x.sitecode + ' / ' + x.stringComune + ' - ' + x.address;
		});

		$scope.history = StoricoStatoPratiche.get({id: $routeParams.id}, function() {
			for (var i=0, len=$scope.history.length; i<len; i++) {
				if ($scope.history[i].idStato ==  2) {
					if ($scope.history[i].usernameAss)
						$scope.history[i].descStato +=  " ("+$scope.history[i].usernameAss+")";
					else {	// arrivata integrazione
						if ($scope.history[i].protoIN && $scope.history[i].dateIN)
							$scope.history[i].descStato +=  " - " + $scope.history[i].protoIN + " - "+ $scope.history[i].dateIN;
						else // proto not specified
							$scope.history[i].descStato +=  " - " + "PROTO NON SPECIFICATO";
					}
				}
				else if ($scope.history[i].idStato ==  7 || $scope.history[i].idStato ==  13) {					
					if ($scope.history[i].protoOUT && $scope.history[i].dateOUT)					
						$scope.history[i].descStato +=  " - " + $scope.history[i].protoOUT + " - "+ $scope.history[i].dateOUT;
					else // if proto is not specified, hide date (is required NOT NULL in db)
						$scope.history[i].descStato +=  " - " + "PROTO NON SPECIFICATO";
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

		$scope.integDate = ""; //moment(new Date()).format("YYYY-MM-DD");
		$scope.integProto = "";

		/* Change state.
			state=2 lavorazione
			state=7 request integ.
			state=13 com. motivi ostativi.
		*/
		$scope.stato = function(state, user, proto, date) {
			var newstate = new StoricoStatoPratiche({ idPratica: $scope.epratica.id, idUtente: user, idStato: state, integProto: proto, integData: date, integNote: '' });

			if (state == 1) {
				askconfirm(ModalService, function() {

					newstate.$save(function(){
						$window.history.back();
					});
				}, "Sei sicuro di voler rilasciare la pratica?");
			}
			else {
				newstate.$save(function(){
					$window.history.back();
				});
			}
		}

		$scope.newsiteinfo = function() {
			var newinfo = new PraticheInfo({ idsite: 0, idpratica: $routeParams.id, flag87bis: 0, flagSupTerra: 0, flagA24: 0, idriconf: 0, isnew:true, isupdated:false });
			$scope.info.push(newinfo);
		}

		$scope.sitesave = function(siteinfo) {
			var theinfo = new PraticheInfo({ idsite: siteinfo.idsite, idpratica: siteinfo.idpratica, flag87bis: siteinfo.flag87bis, flagSupTerra: siteinfo.flagSupTerra, flagA24: siteinfo.flagA24, idriconf: siteinfo.idriconf, isnew: siteinfo.isnew, isupdated: false });

			if (theinfo.isnew)
				theinfo.$save(function() { siteinfo.isupdated = true; siteinfo.isnew=false; });
			else
				PraticheInfo.update({id: theinfo.idsite}, theinfo, function() { siteinfo.isupdated = true; });
		}

		$scope.sitedelete = function(siteinfo) {
			PraticheInfo.remove({id: siteinfo.idsite}, function() {
				var index = $scope.info.indexOf(siteinfo);
				$scope.info.splice(index, 1);
			});
		}

		$scope.setupdated = function(siteinfo) {
			siteinfo.isupdated = false;
		}
	}])
	.controller('PraticheFatturazione', ['$scope', 'Me', 'PMcount','PraticheFatturazione', 'PraticheInfo', 'PraticheCount', 'Utenti', '$location', function($scope, Me, PMcount, PraticheFatturazione, PraticheInfo, PraticheCount, Utenti, $location) {
		$scope.me = Me.get();
		$scope.pmcount = PMcount.query();

		$scope.dateFrom = moment().subtract(1, 'month').set('date', 1).format("YYYY-MM-DD");	// day 1 of prev month
		$scope.dateTo = moment().set('date', 1).subtract(1, 'day').format("YYYY-MM-DD");		// day LAST of prev month

		$scope.orderByField = 'dateIN';
		$scope.reverseSort = false;

		$scope.show = function(id) {
			if (id)	// if defined
				$location.url('pratiche/'+id);
		}

		$scope.users = Utenti.query(function() {
			$scope.requery($scope.dateFrom, $scope.dateTo);	// GET $scope.pratiche after Users, or extractOperatore could fail at 1st execution
		});

		$scope.requery = function(from, to) {
			$scope.countpratiche = PraticheCount.query(function() {
				$scope.jspratiche = PraticheInfo.query({ dateFrom: from, dateTo: to }, function() {

					function getLink(id) {
						for (var i=0, len=$scope.jspratiche.length; i<len; i++)
							if ($scope.jspratiche[i].idsite == id)
								return $scope.jspratiche[i];

						return null;
					}

					function isCongiunto(linkinfo) {
						if (!linkinfo) return false;		// no info? can't say.

						// count #pratiche with that id
						var count = 0;

						for (var i=0, len=$scope.jspratiche.length; i<len; i++)
							if ($scope.jspratiche[i].idpratica == linkinfo.idpratica)
								++count;

						return count>1;
					}

					$scope.pratiche = PraticheFatturazione.query({ dateFrom: from, dateTo: to }, function() {
						var seq = 1;

						function extractOperatore(input) {
							const parts = input.split(/[\s-]+/);			// whitespaces and '-'

							for (var i=0, len=parts.length; i<len; i++) {
								const a = parts[i].trim().toLowerCase();
								if (a.length == 0 || a == '-')
									continue;

								for (var u=0, lenu=$scope.users.length; u<lenu; u++)
									if (a == $scope.users[u].username.toLowerCase())
										return $scope.users[u].username;
							}

							return "?!";
						}
						function extractData(input) {
							return moment(input).format('YYYY-MM-DD');
						}
						function extractRif(input) {
							const parts = input.split('/');

							for (var i=0, len=parts.length; i<len; i++)
								if (parts[i].includes('-') && !parts[i].includes('P'))
									return parts[i];

							return "";
						}
						function extractProto(input) {
							const parts = input.split(' ');
							var mmm = 999999;
							var already12 = false;

							for (var i=0, len=parts.length; i<len; i++) {
								var n = parseInt(parts[i]);
								if (n == NaN) continue;

								if (n == 12 && !already12) {	// ignore first 12
									already12 = true;
									continue;
								}

								if (n < mmm)
									mmm = n;
							}

							return mmm == 999999 ? "" : ""+mmm;
						}
						function extractSiteCode(input) {
							const parts = input.split(' ');
							for (var i=0, len=parts.length; i<len; i++) {
								const la = parts[i].trim().toUpperCase();

								if (la.includes("UD") || la.includes("GO")  || la.includes("TS") || la.includes("PN") ||
									la.includes("UX") || la.includes("GX")  || la.includes("TX") || la.includes("PX"))
									return la;
							}

							return "";
						}

						$scope.pratiche.forEach(function(x) {

							function calcImporto(p1, p2, p3) {
								if (p1 == '?' || p2 == '?' || p3 == '?') return "?";

								const q1 = (p1=='1');	// stesso palo?
								const q2 = (p2=='S');	// singolo?
								const q3 = (p3=='S');	// sup terra?

								if (q1 && q2 && q3) return 370;
								else if (q1 && q2 && !q3) return 300;
								else if (q1 && !q2 && q3) return 300;
								else if (q1 && !q2 && !q3) return 150;
								else if (!q1 && q2 && q3) return 315;
								else if (!q1 && q2 && !q3) return 300;
								else if (!q1 && !q2 && q3) return 270;
								else /*if (!q1 && !q2 && !q3)*/ return 150;
							}

							const linksite = getLink(x.ID_SITO);
							const congiunto = isCongiunto(linksite);

							x.seq = seq++;
							x.FatturareA = '\u2190';

							x.Punto2Tariffario = linksite ? (linksite.flag87bis ? "2" : "1") : "?";
							x.SingoloCongiunto = linksite ? (congiunto ? "C" : "S") : "?";
							x.Punto3Tariffario =  linksite ? (linksite.flagSupTerra ? "S" : "N") : "?";
							x.Importo = calcImporto(x.Punto2Tariffario, x.SingoloCongiunto, x.Punto3Tariffario);

							x.operatore = extractOperatore(x.NoteSito);
							x.proto = extractProto(x.Pt_RilPar);
							x.riferimento = extractRif(x.Pt_RilPar);
							x.data = extractData(x.Dt_RilPar);
							x.sitecode = extractSiteCode(x.NoteSito);
							x.id = linksite ? linksite.idpratica : null;
							x.idsite = x.ID_SITO;
						});
					});
				});
			});
		}
	}])
	.controller('PraticheStatistiche', ['$scope', 'Me', 'PMcount','PraticheAll', 'Utenti', '$location', function($scope, Me, PMcount, PraticheAll, Utenti, $location) {
		$scope.me = Me.get();
		$scope.pmcount = PMcount.query();
		$scope.users = Utenti.query();

		$scope.dateFrom = moment().subtract(1, 'month').set('date', 1).format("YYYY-MM-DD");	// day 1 of prev month
		$scope.dateTo = moment().set('date', 1).subtract(1, 'day').format("YYYY-MM-DD");		// day LAST of prev month
		$scope.dateTypes = [ "dateIN", "dateOUT" ];
		$scope.dateType = "dateIN";

		$scope.orderByField = 'dateIN';
		$scope.reverseSort = false;

		$scope.requery = function(from, to, type) {

			$scope.countL10 = 0;
			$scope.countL20 = 0;
			$scope.countL30 = 0;
			$scope.countO30 = 0;

			$scope.totUnknown = 0;

			$scope.percL10 = 0;
			$scope.percL20 = 0;
			$scope.percL30 = 0;
			$scope.percO30 = 0;

			$scope.totDays = 0;
			$scope.meanDays = 0;

			$scope.pratiche = PraticheAll.query({ dateFrom: from, dateTo: to, dateType: type }, function() {
				$scope.pratiche.forEach(function(x) {
					x.rowClass = getTableRowClass(x.idStato);
					if (x.stringStato == "Arrivata") x.stringUser = "";	// fix: pratiche arrivate non sono in carico di nessuno

					if (x.dateOUT) {
						x.days = moment.duration(moment(x.dateOUT).diff(moment(x.dateIN))).subtract(x.diff/2, "days").asDays();

						$scope.totDays += x.days;

						if (x.days <= 10)
							$scope.countL10++;
						else if  (x.days <= 20)
							$scope.countL20++;
						else if  (x.days <= 30)
							$scope.countL30++;
						else
							$scope.countO30++;
					}
					else
						$scope.totUnknown++;

					$scope.totPratiche = $scope.countL10 + $scope.countL20 + $scope.countL30 + $scope.countO30;

					$scope.percL10 = (100*$scope.countL10/$scope.totPratiche).toFixed(0);
					$scope.percL20 = (100*$scope.countL20/$scope.totPratiche).toFixed(0);
					$scope.percL30 = (100*$scope.countL30/$scope.totPratiche).toFixed(0);
					$scope.percO30 = (100*$scope.countO30/$scope.totPratiche).toFixed(0);
					$scope.meanDays = ($scope.totDays/$scope.totPratiche).toFixed(1);
				});
			});
		}
		$scope.requery($scope.dateFrom, $scope.dateTo, $scope.dateType);	// GET $scope.pratiche
	}])
;