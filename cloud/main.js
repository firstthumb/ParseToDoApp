// Fetch all Todo
Parse.Cloud.define("fetchTodo", function(request, response) {
	var query = new Parse.Query("Todo");
	query.find({
    	success: function(results) {
      		response.success(results);
    	},
    	error: function(error) {
      		response.error(error);
    	}
  	});
});

// Save Todo
Parse.Cloud.define("saveTodo", function(request, response) {
	var Todo = Parse.Object.extend("Todo");
	var todo = new Todo();
	todo.set("title", request.params.todo.title);
	todo.set("completed", request.params.todo.completed);

	todo.save(null, {
		success: function(todo) {
			console.log('New object created with objectId: ' + todo.id);
			response.success(todo.id);
	  	},
	  	error: function(gameScore, error) {
	    	alert('Failed to create new object, with error code: ' + error.message);
	    	response.error(error);
	  	}
	});
});

// Delete Todo - todoId request parameter
Parse.Cloud.define("deleteTodo", function(request, response) {
	var query = new Parse.Query("Todo");
	query.get(request.params.todoId, {
		success: function(todo) {
			console.log("Deleted object : " + todo);
			todo.destroy();
			response.success();
		},
		error: function(error) {
			response.error(error);
		}
	});
});

// Clear all Todo
Parse.Cloud.define("clearTodo", function(request, response) {
	var query = new Parse.Query("Todo");
	query.find({
		success: function(results) {
			var promise = Parse.Promise.as();
  			_.each(results, function(result) {
    			promise = promise.then(function() {
    				console.log("Deleted object : " + result);
      				return result.destroy();
    			});
  			});

  			return promise;
		},
		error: function(error) {
			response.error(error);
		}
	});
});

// Update Todo - Todo Object as request parameter
Parse.Cloud.define("updateTodo", function(request, response) {
	var query = new Parse.Query("Todo");
	var title = request.params.todo.title;
	var completed = request.params.todo.completed;
	query.get(request.params.todo.id, {
		success: function(todo) {
			console.log("Updating object : " + todo);
			todo.set("title", title);
			todo.set("completed", completed);
			todo.save();
			response.success();
		},
		error: function(error) {
			response.error(error);
		}
	});
});

