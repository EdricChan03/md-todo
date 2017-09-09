angular.module('MdTodoDocsApp', ['ngMaterial', 'app.config', 'app.directives'])
	.controller('MainController', ($scope, $log) => {
		$log.info('md-todo works!');
	})