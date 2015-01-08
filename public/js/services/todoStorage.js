/*global angular */

/**
 * Services that persists and retrieves todos from localStorage or a backend API
 * if available.
 *
 * They both follow the same API, returning promises for all changes to the
 * model.
 */
angular.module('todomvc')
	.factory('todoStorage', function ($http, $injector) {
		'use strict';
		
		return Parse.Cloud.run('fetchTodo', {}).then(
			function() {
				var todoStorage = $injector.get('api');
				todoStorage.get();
		    	return todoStorage;
		  	},
		  	function() {
		  		return $injector.get('localStorage');
		  	}
		);

		// Detect if an API backend is present. If so, return the API module, else
		// hand off the localStorage adapter
		//return $http.get('http://todo-app.parseapp.com/#//api')
		//	.then(function () {
		//		return $injector.get('api');
		//	}, function () {
		//		return $injector.get('localStorage');
		//	});
	})

	.factory('api', function ($http) {
		'use strict';

		var store = {
			todos: [],

			clearCompleted: function () {
				var originalTodos = store.todos.slice(0);

				var completeTodos = [];
				var incompleteTodos = [];
				store.todos.forEach(function (todo) {
					if (todo.completed) {
						completeTodos.push(todo);
					} else {
						incompleteTodos.push(todo);
					}
				});

				angular.copy(incompleteTodos, store.todos);

				return Parse.Cloud.run('clearTodo', {}).then(
					function(resp) {
						return store.todos;
				  	}
				);

				//return $http.delete('/api/todos')
				//	.then(function success() {
				//		return store.todos;
				//	}, function error() {
				//		angular.copy(originalTodos, store.todos);
				//		return originalTodos;
				//	});
			},

			delete: function (todo) {
				var originalTodos = store.todos.slice(0);
				alert(JSON.stringify(todo));
				var todoId = todo.id;
				alert(todoId);

				store.todos.splice(store.todos.indexOf(todo), 1);

				return Parse.Cloud.run('deleteTodo', {'todoId':todoId}).then(
					function(resp) {
						return store.todos;
				  	}
				);

				//return $http.delete('/api/todos/' + todo.id)
				//	.then(function success() {
				//		return store.todos;
				//	}, function error() {
				//		angular.copy(originalTodos, store.todos);
				//		return originalTodos;
				//	});
			},

			get: function () {
				return Parse.Cloud.run('fetchTodo', {}).then(
					function(resp) {
						for (var i = resp.length - 1; i >= 0; i--) {
							store.todos.push({'id': resp[i].id, 'title': resp[i].get('title'), 'completed': resp[i].get('completed')});
						};
				    	//angular.copy(resp, store.todos);
						return store.todos;
				  	}
				);

				//return $http.get('/api/todos')
				//	.then(function (resp) {
				//		angular.copy(resp.data, store.todos);
				//		return store.todos;
				//	});
			},

			insert: function (todo) {
				var originalTodos = store.todos.slice(0);

				return Parse.Cloud.run('saveTodo', {'todo': todo}).then(
					function(resp) {
						todo.id = resp;
						store.todos.push(todo);
						return store.todos;
				  	}
				);

				//return $http.post('/api/todos', todo)
				//	.then(function success(resp) {
				//		todo.id = resp.data.id;
				//		store.todos.push(todo);
				//		return store.todos;
				//	}, function error() {
				//		angular.copy(originalTodos, store.todos);
				//		return store.todos;
				//	});
			},

			put: function (todo) {
				var originalTodos = store.todos.slice(0);

				return Parse.Cloud.run('updateTodo', {'todo': todo}).then(
					function(resp) {
						return store.todos;
				  	}
				);

				//return $http.put('/api/todos/' + todo.id, todo)
				//	.then(function success() {
				//		return store.todos;
				//	}, function error() {
				//		angular.copy(originalTodos, store.todos);
				//		return originalTodos;
				//	});
			}
		};

		return store;
	})

	.factory('localStorage', function ($q) {
		'use strict';

		var STORAGE_ID = 'todos-angularjs';

		var store = {
			todos: [],

			_getFromLocalStorage: function () {
				return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
			},

			_saveToLocalStorage: function (todos) {
				localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
			},

			clearCompleted: function () {
				var deferred = $q.defer();

				var completeTodos = [];
				var incompleteTodos = [];
				store.todos.forEach(function (todo) {
					if (todo.completed) {
						completeTodos.push(todo);
					} else {
						incompleteTodos.push(todo);
					}
				});

				angular.copy(incompleteTodos, store.todos);

				store._saveToLocalStorage(store.todos);
				deferred.resolve(store.todos);

				return deferred.promise;
			},

			delete: function (todo) {
				var deferred = $q.defer();

				store.todos.splice(store.todos.indexOf(todo), 1);

				store._saveToLocalStorage(store.todos);
				deferred.resolve(store.todos);

				return deferred.promise;
			},

			get: function () {
				var deferred = $q.defer();

				angular.copy(store._getFromLocalStorage(), store.todos);
				deferred.resolve(store.todos);

				return deferred.promise;
			},

			insert: function (todo) {
				var deferred = $q.defer();

				store.todos.push(todo);

				store._saveToLocalStorage(store.todos);
				deferred.resolve(store.todos);

				return deferred.promise;
			},

			put: function (todo, index) {
				var deferred = $q.defer();

				store.todos[index] = todo;

				store._saveToLocalStorage(store.todos);
				deferred.resolve(store.todos);

				return deferred.promise;
			}
		};

		return store;
	});
