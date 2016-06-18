var myApp = angular.module('appTareas', ['ngRoute']);
myApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/',	{
			controller: 'alta',
			templateUrl: '/views/alta.html'
		})
		.when('/editar', {
			controller: 'editWork',
			templateUrl: '/views/editar.html'
		})
		.otherwise('/');
}]);
myApp.factory('comun', function($http){
	var comun = {}

	comun.tareas = []

	comun.tarea = {}

	/***Seccion de metodos remotos***/
	comun.getAll = function(){
		return $http.get('/tareas')
		.success(function(data){
			angular.copy(data, comun.tareas)
			//comun.tareas = data
			return comun.tareas
		})
	}

	comun.add = function(tarea){
		return $http.post('/tarea', tarea)
		.success(function(tarea){
			comun.tareas.push(tarea);
		})
	}

	comun.update = function(tarea){
		return $http.put('/tarea/'+tarea._id, tarea)
		.success(function(data){
			var indice = comun.tareas.indexOf(tarea)
			comun.tareas[indice] = data
		})
	}

	comun.delete = function(tarea){
		return $http.delete("/tarea/"+tarea._id)
		.success(function(){
			var indice = comun.tareas.indexOf(tarea)
			comun.tareas.splice(indice, 1)
		})
	}

	return comun;
});
myApp.controller('alta', ['$scope', '$location', 'comun', function($scope, $location, comun){
	$scope.tarea = {}
	//$scope.tareas = [];

	comun.getAll();

	$scope.tareas = comun.tareas

	$scope.prioridades = ['Baja', 'Normal', 'Alta'];

	$scope.agregar = function(){
		comun.add({
			nombre: $scope.tarea.nombre,
			prioridad: parseInt($scope.tarea.prioridad)
		})

		$scope.tarea = ''
	}

	$scope.masPrioridad = function(tarea){
		tarea.prioridad +=1;
	}

	$scope.menosPrioridad = function(tarea){
		tarea.prioridad -=1;
	}

	$scope.eliminar = function(tarea){
		comun.delete(tarea)
	}

	$scope.editarTarea = function(tarea){
		comun.tarea = tarea;
		$location.url('editar')
	}

}])
myApp.controller('editWork', ['$scope', '$location', 'comun', function($scope, $location, comun){
	$scope.tarea = comun.tarea;

	$scope.actualizar = function(){
		comun.update($scope.tarea)
		$location.url('/')
	}

	$scope.eliminar = function(){
		comun.delete($scope.tarea)
		$location.url('/')
	}
}])