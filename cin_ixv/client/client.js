App = {};
Helpers = {};

App.subscriptions = {
	user_data: Meteor.subscribe("user_data"),
	persons: Meteor.subscribe("persons"),
	companies: Meteor.subscribe("companies"),
	company_persons: Meteor.subscribe("company_persons"),
	company_shares: Meteor.subscribe("company_shares")/*SUBSCRIPTIONS*/
}

App.logout = function() {
	Meteor.logout(function(err) {
		if(err)
		{

		}
	});
}

Helpers.menuItemClass = function(routeName) {
	if(!Router.current(true)) return "";
	if(!Router.routes[routeName]) return "";
	var currentPath = Router.current(true).path;
	var routePath = Router.routes[routeName].originalPath;

	var params = Router.current(true).params;
	for(var key in params) {
		if(key != "hash")
			routePath = routePath.replace(":" + key, params[key]);
	}

	if(routePath === "/")
		return currentPath == routePath ? "active" : "";
	return currentPath.indexOf(routePath) == 0 ? "active" : "";
};

Helpers.isAdmin = function() { 
	return Users.isAdmin(Meteor.userId());
};

_.each(Helpers, function (helper, key) {
	Handlebars.registerHelper(key, helper)
});

