var askconfirm = function(ModalService, next, textmessage) {
	ModalService.showModal({
		templateUrl: "templates/confirm.html",
		controller: "YesNoController",
		inputs: {
			message: textmessage
		}
	}).then(function(modal) {
		modal.element.modal();
		modal.close.then(function(result) {
			if (result) {
				next();
			}
		});
	});
}

angular.module('app', ['ngRoute', 'ngResource', 'angularModalService', 'datetimepicker'])

	// helper controllers
	.controller('YesNoController', ['$scope', 'message', 'close', function($scope, message, close) {
		$scope.message = message;
		$scope.close = function(result) {
			close(result, 500); // close, but give 500ms for bootstrap to animate
		};
	}])

	.config([
		'datetimepickerProvider',
		function (datetimepickerProvider) {
			datetimepickerProvider.setOptions({
				format: 'YYYY-MM-DD'
			});
		}
	])
;
