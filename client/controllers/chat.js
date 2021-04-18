angular.module('app')
	.factory('ChatPM', ['$resource', function($resource){
		return $resource('/chat/pm/:id', null, {
			'update': { method:'PUT' }
		});
	}])
	.factory('PMcount', ['$resource', function($resource){
		return $resource('/chat/pm/count', null);
	}])
	.factory('ChatBoard', ['$resource', function($resource){
		return $resource('/chat/board/:id', null, {
			'update': { method:'PUT' }
		});
	}])
	.factory('SharedNotes', ['$resource', function($resource){
		return $resource('/chat/sharednotes/:id', null, {
			'update': { method:'PUT' }
		});
	}])
	
	.controller('ChatPMCtrl', ['$scope', 'Me', 'PMcount', 'ChatPM', 'Utenti', '$route', function($scope, Me, PMcount, ChatPM, Utenti, $route) {
		$scope.me = Me.get(function() { 
			$scope.newmsg = new ChatPM({ msg: "", userto: $scope.me.id });
		});
		$scope.pmcount = PMcount.get();

		$scope.orderByField = 'timePoint';
		$scope.reverseSort = true;
		$scope.messages = ChatPM.query(function() {
			$scope.messages.forEach( x => {
				x.rowClass = x.readen==0 ? "time-green" : "time-normal";
				x.line = x.timePoint+" <"+x.username+"> "+x.msg;
			});
		});
		$scope.utenti = Utenti.query();

		$scope.send = function() {
			$scope.newmsg.$save(function(){
				$scope.newmsg = new ChatPM({ msg: "", userto: $scope.me.id });
				$route.reload();
			});
		}
	}])
	.controller('ChatBoardCtrl', ['$scope', 'Me', 'PMcount', 'ChatBoard', '$route', function($scope, Me, PMcount, ChatBoard, $route) {
		$scope.me = Me.get();
		$scope.pmcount = PMcount.get();

		$scope.orderByField = 'timePoint';
		$scope.reverseSort = true;
		$scope.messages = ChatBoard.query(function() {
			$scope.messages.forEach( x => {
				x.line = x.timePoint+" <"+x.username+"> "+x.msg;
			});
		});
		$scope.newmsg = new ChatBoard({ msg: ""});

		$scope.send = function() {
			$scope.newmsg.$save(function(){
				$scope.newmsg = new ChatBoard({ msg: ""});
				$route.reload();
			});
		}
	}])
;