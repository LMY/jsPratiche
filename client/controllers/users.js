angular.module('app')
	.factory('Me', ['$resource', function($resource){
		return $resource('/utenti/me', null);
	}])
	.factory('Utenti', ['$resource', function($resource){
		return $resource('/utenti/:id', null, {
			'update': { method:'PUT' }
		});
	}])

	.controller('UtentiController', ['$scope', 'Me', 'PMcount','Utenti', '$location', function($scope, Me, PMcount, Utenti, $location) {
		$scope.me = Me.get();
		$scope.pmcount = PMcount.query();

		$scope.orderByField = 'id';
		$scope.reverseSort = false;
		$scope.utenti = Utenti.query();

		$scope.new = function() {
			$location.url('utenti/new');
		}
		$scope.show = function(id) {
			if ($scope.me.userlevel == 0 || $scope.me.id == id)
				$location.url('utenti/'+id);
		}
	}])
	.controller('UtenteDetailCtrl', ['$scope', '$routeParams', 'Me', 'PMcount','Utenti', '$location', 'ModalService', function($scope, $routeParams, Me, PMcount, Utenti, $location, ModalService) {
		$scope.me = Me.get();
		$scope.pmcount = PMcount.query();

		$scope.isnew = ($routeParams.id === "new");
		$scope.eutente = $scope.isnew ? {} : Utenti.get({id: $routeParams.id });
		$scope.title = $scope.isnew ? "Nuovo Utente" : "Utente "+$routeParams.id;

		$scope.update = function() {
			if ($scope.isnew) {
				if (!$scope.eutente || $scope.eutente.length < 1) return;
				if (!$scope.eutente.username || $scope.eutente.username.length < 1) { alert('Specificare username!'); return; }

				var utente = new Utenti({ username: $scope.eutente.username, PMcount, name: $scope.eutente.name, PMcount, surname: $scope.eutente.surname, PMcount, email: $scope.eutente.email, phone: $scope.eutente.phone });
				utente.$save(function(){
					$location.url('utenti');
				});
			}
			else
				Utenti.update({id: $scope.eutente.id}, $scope.eutente, function() {
					$location.url('utenti');
				});
		}

		$scope.remove = function() {
			askconfirm(ModalService, function() {
				Utenti.remove({id: $scope.eutente.id}, function() {
					$location.url('utenti');
				})
			}, "Sei sicuro di voler rimovere "+$scope.eutente.name+"?");
		}

		$scope.cancel = function() {
			$location.url('utenti');
		}

		$scope.changepw = function() {
			$location.url('utenti/pass/'+$scope.eutente.id);
		}
	}])
	.controller('UtentePassCtrl', ['$scope', '$http', '$routeParams', 'Me', 'PMcount','Utenti', '$location', function($scope, $http, $routeParams, Me, PMcount, Utenti, $location) {
		$scope.me = Me.get();
		$scope.pmcount = PMcount.query();

		$scope.eutente = Utenti.get({id: $routeParams.id });
		$scope.title = "Utente "+$routeParams.id;

		$scope.update = function(){
			if (!$scope.eutente.password1 || $scope.eutente.password1.length < 1) {
				alert("Devi specificare una password con almeno 2 maiuscole, 3 minuscole, 6 numeri, 4 animali, 2 colori e una tortiera.");
				return;
			}

			if ($scope.eutente.password1 != $scope.eutente.password2) {
				alert("Le password non corrispondono");
				return;
			}

			var data = $.param({
                oldpassword: $scope.eutente.oldpassword,
                password: $scope.eutente.password1
            });

			$http({ method: 'PUT', url: '/utenti/password/'+$routeParams.id,
				data: data,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}).then(
				function(res) { $location.url('utenti'); },
				function(err) { alert("Error: "+err); }
			);
		}

		$scope.cancel = function() {
			$location.url('utenti');
		}
	}])
;