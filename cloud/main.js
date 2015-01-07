
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  	response.success("Hello world!");
});

Parse.Cloud.define("fetchTodo", function(request, response) {
	var query = new Parse.Query("Todo");
	query.find({
    	success: function(results) {
      		response.success(results);
    	},
    	error: function() {
      		response.error("Failed");
    	}
  	});
});

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
	    	response.error();
	  	}
	});
});

Parse.Cloud.define("deleteTodo", function(request, response) {
	var query = new Parse.Query("Todo");
	query.get(request.params.todoId, {
		success: function(todo) {
			console.log("Deleted object : " + todo);
			todo.destroy();
			response.success();
		},
		error: function(error) {
			response.error();
		}
	});
});
