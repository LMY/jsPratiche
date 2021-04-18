angular.module('app')
	.factory('Comuni', ['$resource', function($resource){
		return $resource('/comuni/:id', null, {
			'update': { method:'PUT' }
		});
	}])
	.factory('AAS', ['$resource', function($resource){
		return $resource('/aas/:id', null, {
			'update': { method:'PUT' }
		});
	}])
	.factory('Province', ['$resource', function($resource){
		return $resource('/province/:id', null, {
			'update': { method:'PUT' }
		});
	}])
	.factory('Gestori', ['$resource', function($resource){
		return $resource('/gestori/:id', null, {
			'update': { method:'PUT' }
		});
	}])
	.factory('StudiTecnici', ['$resource', function($resource){
		return $resource('/studitecnici/:id', null, {
			'update': { method:'PUT' }
		});
	}])

	.controller('ComuneController', ['$scope', 'Me', 'PMcount','Comuni', '$location', function($scope, Me, PMcount, Comuni, $location) {
		$scope.me = Me.get();
		$scope.pmcount = PMcount.query();

		$scope.orderByField = 'id';
		$scope.reverseSort = false;
		$scope.anagrafiche = Comuni.query();

		$scope.new = function() {
			$location.url('comuni/new');
		}
		$scope.show = function(id) {
			$location.url('comuni/'+id);
		}
	}])
	.controller('ComuneDetailCtrl', ['$scope', '$routeParams', 'Me', 'PMcount', 'Comuni', 'AAS', 'Province', '$location', 'ModalService', function($scope, $routeParams, Me, PMcount, Comuni, AAS, Province, $location, ModalService) {
		$scope.me = Me.get();
		$scope.pmcount = PMcount.query();

		$scope.isnew = ($routeParams.id === "new");
		$scope.data = $scope.isnew ? {} : Comuni.get({id: $routeParams.id });
		$scope.aas = AAS.query();
		$scope.province = Province.query();
		$scope.title = $scope.isnew ? "Nuovo Comune" : "Comune "+$routeParams.id;

		$scope.update = function( ){
			if ($scope.isnew) {
				if (!$scope.data || $scope.data.length < 1) return;
				if (!$scope.data.name || $scope.data.name.length < 1) { alert('Specificare nome!'); return; }
				if (!$scope.data.pec || $scope.data.pec.length < 1) { alert('Specificare PEC!'); return; }
				if (!$scope.data.province || $scope.data.province.length < 1) { alert('Specificare Provincia!'); return; }

				var comune = new Comuni({ name: $scope.data.name, pec: $scope.data.pec, idaas: $scope.data.idaas, province: $scope.data.province });
				comune.$save(function(){
					$location.url('comuni');
				});
			}
			else
				Comuni.update({id: $scope.data.id}, $scope.data, function() {
					$location.url('comuni');
				});
		}

		$scope.remove = function() {
			askconfirm(ModalService, function() {
				Comuni.remove({id: $scope.data.id}, function() {
					$location.url('comuni');
				});
			}, "Sei sicuro di voler rimovere "+$scope.data.name+"?");
		}

		$scope.cancel = function() {
			$location.url('comuni');
		}
	}])

	.controller('ProvinceController', ['$scope', 'Me', 'PMcount','Province', '$location', function($scope, Me, PMcount, Province, $location) {
		$scope.me = Me.get();
		$scope.pmcount = PMcount.query();

		$scope.orderByField = 'id';
		$scope.reverseSort = false;
		$scope.anagrafiche = Province.query();

		$scope.new = function() {
			$location.url('province/new');
		}
		$scope.show = function(id) {
			$location.url('province/'+id);
		}
	}])
	.controller('ProvinceDetailCtrl', ['$scope', '$routeParams', 'Me', 'PMcount', 'Province', '$location', 'ModalService', function($scope, $routeParams, Me, PMcount, Province, $location, ModalService) {
		$scope.me = Me.get();
		$scope.pmcount = PMcount.query();

		$scope.isnew = ($routeParams.id === "new");
		$scope.data = $scope.isnew ? {} : Province.get({id: $routeParams.id });
		$scope.title = $scope.isnew ? "Nuova Provincia" : "Provincia "+$routeParams.id;

		$scope.update = function( ){
			if ($scope.isnew) {
				if (!$scope.data) return;
				if (!$scope.data.id || $scope.data.id.length < 1) { alert('Specificare sigla!'); return; }
				if (!$scope.data.name || $scope.data.name.length < 1) { alert('Specificare nome!'); return; }

				var newdata = new Province({ id: $scope.data.id, name: $scope.data.name });
				newdata.$save(function(){
					$location.url('province');
				});
			}
			else
				Province.update({id: $scope.data.id}, $scope.data, function() {
					$location.url('province');
				});
		}

		$scope.remove = function() {
			askconfirm(ModalService, function() {
				Province.remove({id: $scope.data.id}, function() {
					$location.url('province');
				});
			}, "Sei sicuro di voler rimovere "+$scope.data.name+"?");
		}

		$scope.cancel = function() {
			$location.url('province');
		}
	}])
	.controller('AASController', ['$scope', 'Me', 'PMcount','AAS', '$location', function($scope, Me, PMcount, AAS, $location) {
		$scope.me = Me.get();
		$scope.pmcount = PMcount.query();

		$scope.orderByField = 'id';
		$scope.reverseSort = false;
		$scope.anagrafiche = AAS.query();

		$scope.new = function() {
			$location.url('aas/new');
		}
		$scope.show = function(id) {
			$location.url('aas/'+id);
		}
	}])
	.controller('AASDetailCtrl', ['$scope', '$routeParams', 'Me', 'PMcount', 'AAS', '$location', 'ModalService', function($scope, $routeParams, Me, PMcount, AAS, $location, ModalService) {
		$scope.me = Me.get();
		$scope.pmcount = PMcount.query();

		$scope.isnew = ($routeParams.id === "new");
		$scope.data = $scope.isnew ? {} : AAS.get({id: $routeParams.id });
		$scope.title = $scope.isnew ? "Nuova AAS" : "AAS "+$routeParams.id;

		$scope.update = function( ){
			if ($scope.isnew) {
				if (!$scope.data) return;
				if (!$scope.data.name || $scope.data.name.length < 1) { alert('Specificare nome!'); return; }
				if (!$scope.data.pec || $scope.data.pec.length < 1) { alert('Specificare PEC!'); return; }

				var newdata = new AAS({ id: $scope.data.id, name: $scope.data.name, pec: $scope.data.pec });
				newdata.$save(function(){
					$location.url('aas');
				});
			}
			else
				AAS.update({id: $scope.data.id}, $scope.data, function() {
					$location.url('aas');
				});
		}

		$scope.remove = function() {
			askconfirm(ModalService, function() {
				AAS.remove({id: $scope.data.id}, function() {
					$location.url('aas');
				});
			}, "Sei sicuro di voler rimovere "+$scope.data.name+"?");
		}

		$scope.cancel = function() {
			$location.url('aas');
		}
	}])

	.controller('GestoriController', ['$scope', 'Me', 'PMcount', 'Gestori', '$location', function($scope, Me, PMcount, Gestori, $location) {
		$scope.me = Me.get();
		$scope.pmcount = PMcount.query();

		$scope.orderByField = 'id';
		$scope.reverseSort = false;
		$scope.anagrafiche = Gestori.query();

		$scope.new = function() {
			$location.url('gestori/new');
		}

		$scope.show = function(id) {
			$location.url('gestori/'+id);
		}
	}])
	.controller('GestoreDetailCtrl', ['$scope', '$routeParams', 'Me', 'PMcount', 'Gestori', 'ConstTipoPratiche', '$location', 'ModalService', function($scope, $routeParams, Me, PMcount, Gestori, ConstTipoPratiche, $location, ModalService) {
		$scope.me = Me.get();
		$scope.pmcount = PMcount.query();

		$scope.isnew = ($routeParams.id === "new");
		$scope.data = $scope.isnew ? {} : Gestori.get({id: $routeParams.id });
		$scope.title = $scope.isnew ? "Nuovo Gestore" : "Gestore "+$routeParams.id;

		$scope.consttipopratiche = ConstTipoPratiche.query();

		$scope.update = function( ){
			if ($scope.isnew) {
				if (!$scope.data || $scope.data.length < 1) return;
				if (!$scope.data.name || $scope.data.name.length < 1) { alert('Specificare nome!'); return; }
				if (!$scope.data.pec || $scope.data.pec.length < 1) { alert('Specificare PEC!'); return; }
				if (!$scope.data.tipopratica) { alert('Specificare il tipo!'); return; }

				var gestore = new Gestori({ name: $scope.data.name, tipopratica: $scope.epratica.tipopratica, pec: $scope.data.pec, piva: $scope.data.piva, address: $scope.data.address });
				gestore.$save(function(){
					$location.url('gestori');
				});
			}
			else
				Gestori.update({id: $scope.data.id}, $scope.data, function() {
					$location.url('gestori');
				});
		}

		$scope.remove = function() {
			askconfirm(ModalService, function() {
				Gestori.remove({id: $scope.data.id}, function() {
					$location.url('gestori');
				});
			}, "Sei sicuro di voler rimovere "+$scope.data.name+"?");
		}

		$scope.cancel = function() {
			$location.url('gestori');
		}
	}])
	
	.controller('StudiTecniciController', ['$scope', 'Me', 'PMcount', 'StudiTecnici', '$location', function($scope, Me, PMcount, StudiTecnici, $location) {
		$scope.me = Me.get();
		$scope.pmcount = PMcount.query();

		$scope.orderByField = 'id';
		$scope.reverseSort = false;
		$scope.anagrafiche = StudiTecnici.query();

		$scope.new = function() {
			$location.url('studitecnici/new');
		}

		$scope.show = function(id) {
			$location.url('studitecnici/'+id);
		}
	}])
	.controller('StudiTecniciDetailCtrl', ['$scope', '$routeParams', 'Me', 'PMcount', 'StudiTecnici', '$location', 'ModalService', function($scope, $routeParams, Me, PMcount, StudiTecnici, $location, ModalService) {
		$scope.me = Me.get();
		$scope.pmcount = PMcount.query();

		$scope.isnew = ($routeParams.id === "new");
		$scope.data = $scope.isnew ? {} : StudiTecnici.get({id: $routeParams.id });
		$scope.title = $scope.isnew ? "Nuovo Studio Tecnico" : "Studio Tecnico "+$routeParams.id;

		$scope.update = function( ){
			if ($scope.isnew) {
				if (!$scope.data || $scope.data.length < 1) return;
				if (!$scope.data.name || $scope.data.name.length < 1) { alert('Specificare nome!'); return; }
				if (!$scope.data.pec || $scope.data.pec.length < 1) { alert('Specificare PEC!'); return; }

				var gestore = new StudiTecnici({ name: $scope.data.name, pec: $scope.data.pec });
				gestore.$save(function(){
					$location.url('studitecnici');
				});
			}
			else
				StudiTecnici.update({id: $scope.data.id}, $scope.data, function() {
					$location.url('studitecnici');
				});
		}

		$scope.remove = function() {
			askconfirm(ModalService, function() {
				StudiTecnici.remove({id: $scope.data.id}, function() {
					$location.url('studitecnici');
				});
			}, "Sei sicuro di voler rimovere "+$scope.data.name+"?");
		}

		$scope.cancel = function() {
			$location.url('studitecnici');
		}
	}])	
;