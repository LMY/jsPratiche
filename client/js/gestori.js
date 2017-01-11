angular.module('app')
	.factory('Gestori', ['$resource', function($resource){
		return $resource('/gestori/:id', null, {
			'update': { method:'PUT' }
		});
	}])

	.controller('GestoriController', ['$scope', 'Me', 'PMcount','Gestori', '$location', function($scope, Me, PMcount, Gestori, $location) {
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
	.controller('GestoreDetailCtrl', ['$scope', '$routeParams', 'Me', 'PMcount','Gestori', '$location', 'ModalService', function($scope, $routeParams, Me, PMcount, Gestori, $location, ModalService) {
		$scope.me = Me.get();
		$scope.pmcount = PMcount.query();

		$scope.isnew = ($routeParams.id === "new");
		$scope.egestore = $scope.isnew ? {} : Gestori.get({id: $routeParams.id });
		$scope.title = $scope.isnew ? "Nuovo Gestore" : "Gestore "+$routeParams.id;

		$scope.update = function( ){
			if ($scope.isnew) {
				if (!$scope.egestore || $scope.egestore.length < 1) return;
				if (!$scope.egestore.name || $scope.egestore.name.length < 1) { alert('Specificare nome!'); return; }
				if (!$scope.egestore.pec || $scope.egestore.pec.length < 1) { alert('Specificare PEC!'); return; }

				var gestore = new Gestori({ name: $scope.egestore.naMe, PMcount, pec: $scope.egestore.pec });
				gestore.$save(function(){
					$location.url('gestori');
				});
			}
			else
				Gestori.update({id: $scope.egestore.id}, $scope.egestore, function() {
					$location.url('gestori');
				});
		}

		$scope.remove = function() {
			askconfirm(ModalService, function() {
				Gestori.remove({id: $scope.egestore.id}, function() {
					$location.url('gestori');
				});
			}, "Sei sicuro di voler rimovere "+$scope.egestore.name+"?");
		}

		$scope.cancel = function() {
			$location.url('gestori');
		}
	}])	
;