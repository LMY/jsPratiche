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
		$scope.data = $scope.isnew ? {} : Gestori.get({id: $routeParams.id });
		$scope.title = $scope.isnew ? "Nuovo Gestore" : "Gestore "+$routeParams.id;

		$scope.update = function( ){
			if ($scope.isnew) {
				if (!$scope.data || $scope.data.length < 1) return;
				if (!$scope.data.name || $scope.data.name.length < 1) { alert('Specificare nome!'); return; }
				if (!$scope.data.pec || $scope.data.pec.length < 1) { alert('Specificare PEC!'); return; }

				var gestore = new Gestori({ name: $scope.data.name, PMcount, pec: $scope.data.pec });
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
;