angular.module('app')

  	.controller('MainController', ['$scope', 'Me', 'PMcount', 'SharedNotes', '$location', '$route', function($scope, Me, PMcount, SharedNotes, $location, $route) {
		$scope.me = Me.get(function() {
//			if ($scope.me.pareri == 1)				// se l'utente è esecutore
//				$location.path("/pratiche");		// ridirigi a pratiche da fare
//			else if ($scope.me.correzioni == 1)		// se è un correttore
//				$location.path("/pratiche-all");	// ridirigi a da correggere
		});

		$scope.notes = SharedNotes.query();
		$scope.editing = -1;

		$scope.add = function() {
			if ($scope.editing == 'new') return;	// either commit or discard new one
			
			$scope.notes.push(new SharedNotes({ id:'new', text:'' }));
			$scope.editing = 'new';
		}

		$scope.edit = function(id) {
			$scope.editing = id;
		}

		$scope.commit = function(id) {
			var index = -1;

			for (var i=0; i<$scope.notes.length; i++)
				if ($scope.notes[i].id == id) {
					index = i;
					break;
				}
			if (index < 0) {
				console.log("ERROR MainController::commit(id): index not found!");
				return;
			}
				
			$scope.editing = -1;
			if (id != 'new')	// update an existing note
				SharedNotes.update({id: id}, $scope.notes[index], function() {
					$route.reload();
				});
			else				// create a new note
				$scope.notes[index].$save(function(){
					$route.reload();
				});
		}

		$scope.remove = function(id) {
			$scope.editing = -1;
			if ($scope.editing == 'new') return;	// do not try to delete on db
			
			SharedNotes.remove({id: id}, function() {
				$route.reload();
			});
		}
	}])
;