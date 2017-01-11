angular.module('app')
	.factory('Comuni', ['$resource', function($resource){
		return $resource('/comuni/:id', null, {
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
	.controller('ComuneDetailCtrl', ['$scope', '$routeParams', 'Me', 'PMcount','Comuni', '$location', 'ModalService', function($scope, $routeParams, Me, PMcount, Comuni, $location, ModalService) {
		$scope.me = Me.get();
		$scope.pmcount = PMcount.query();

		$scope.isnew = ($routeParams.id === "new");
		$scope.ecomune = $scope.isnew ? {} : Comuni.get({id: $routeParams.id });
		$scope.title = $scope.isnew ? "Nuovo Comune" : "Comune "+$routeParams.id;

		$scope.update = function( ){
			if ($scope.isnew) {
				if (!$scope.ecomune || $scope.ecomune.length < 1) return;
				if (!$scope.ecomune.name || $scope.ecomune.name.length < 1) { alert('Specificare nome!'); return; }
				if (!$scope.ecomune.pec || $scope.ecomune.pec.length < 1) { alert('Specificare PEC!'); return; }

				var comune = new Comuni({ name: $scope.ecomune.naMe, PMcount, pec: $scope.ecomune.pec });
				comune.$save(function(){
					$location.url('comuni');
				});
			}
			else
				Comuni.update({id: $scope.ecomune.id}, $scope.ecomune, function() {
					$location.url('comuni');
				});
		}

		$scope.remove = function() {
			askconfirm(ModalService, function() {
				Comuni.remove({id: $scope.ecomune.id}, function() {
					$location.url('comuni');
				});
			}, "Sei sicuro di voler rimovere "+$scope.ecomune.name+"?");
		}

		$scope.cancel = function() {
			$location.url('comuni');
		}
	}])
;