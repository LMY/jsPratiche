angular.module('app')
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: '/main.html',
				controller: 'MainController'
			})
			.when('/gestori', {
				templateUrl: '/gestori.html',
				controller: 'GestoriController'
			})
			.when('/gestori/:id', {
				templateUrl: '/gestoreDetails.html',
				controller: 'GestoreDetailCtrl'
			})
			.when('/comuni', {
				templateUrl: '/comuni.html',
				controller: 'ComuneController'
			})
			.when('/comuni/:id', {
				templateUrl: '/comuneDetails.html',
				controller: 'ComuneDetailCtrl'
			})

			.when('/province', {
				templateUrl: '/province.html',
				controller: 'ProvinceController'
			})
			.when('/province/:id', {
				templateUrl: '/provinceDetails.html',
				controller: 'ProvinceDetailCtrl'
			})
			.when('/aas', {
				templateUrl: '/aas.html',
				controller: 'AASController'
			})
			.when('/aas/:id', {
				templateUrl: '/aasDetails.html',
				controller: 'AASDetailCtrl'
			})
			.when('/studitecnici', {
				templateUrl: '/studitecnici.html',
				controller: 'StudiTecniciController'
			})			
			.when('/studitecnici/:id', {
				templateUrl: '/studitecniciDetails.html',
				controller: 'StudiTecniciDetailCtrl'
			})
			
			.when('/pratiche', {
				templateUrl: '/pratiche.html',
				controller: 'PraticheController'
			})
			.when('/pratiche-correggere', {
				templateUrl: '/pratiche.html',
				controller: 'PraticheCorreggereController'
			})
			.when('/pratiche-protocollare', {
				templateUrl: '/pratiche-protocollare.html',
				controller: 'PraticheProtocollareController'
			})
			.when('/pratiche-all', {
				templateUrl: '/pratiche-storico.html',
				controller: 'PraticheAllController'
			})
			.when('/pratiche-fatturazione', {
				templateUrl: '/pratiche-fatturazione.html',
				controller: 'PraticheFatturazione'
			})
			.when('/pratiche-statistiche', {
				templateUrl: '/pratiche-statistiche.html',
				controller: 'PraticheStatistiche'
			})

			.when('/pratiche/detail/:id', {
				templateUrl: '/praticaDetails.html',
				controller: 'PraticaDetailController'
			})
			.when('/pratiche/:id', {
				templateUrl: '/praticaStatoDetails.html',
				controller: 'PraticaStatoDetailController'
			})
			.when('/integrazione/:id', {
				templateUrl: '/integrazione.html',
				controller: 'IntegrazioneCtrl'
			})

			.when('/utenti', {
				templateUrl: '/utenti.html',
				controller: 'UtentiController'
			})
			.when('/utenti/:id', {
				templateUrl: '/utenteDetails.html',
				controller: 'UtenteDetailCtrl'
			})
			.when('/utenti/pass/:id', {
				templateUrl: '/utentePass.html',
				controller: 'UtentePassCtrl'
			})

			.when('/strumenti-strumenti', {
				templateUrl: '/strumenti.html',
				controller: 'StrumentiController'
			})
			.when('/strumenti/:id', {
				templateUrl: '/strumentoDetails.html',
				controller: 'StrumentoDetailCtrl'
			})

			.when('/strumenti-catene', {
				templateUrl: '/catene.html',
				controller: 'CateneController'
			})
			.when('/catene/:id', {
				templateUrl: '/catenaDetails.html',
				controller: 'CatenaDetailCtrl'
			})
			.when('/calibrazione/:id', {
				templateUrl: '/calibrazioneDetails.html',
				controller: 'CalibrazioneDetailCtrl'
			})
			.when('/strumenti-storico', {
				templateUrl: '/strumentiStorico.html',
				controller: 'StrumentiStoricoCtrl'
			})
			.when('/strumenti-registro', {
				templateUrl: '/strumentiRegistro.html',
				controller: 'StrumentiRegistroCtrl'
			})
			.when('/messaggi-pm', {
				templateUrl: '/chat-pm.html',
				controller: 'ChatPMCtrl'
			})
			.when('/messaggi-board', {
				templateUrl: '/chat-board.html',
				controller: 'ChatBoardCtrl'
			})
			;
	}])
;
