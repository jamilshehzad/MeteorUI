LogoutController = RouteController.extend({
	template: "Logout",
	yieldTemplates: {
		/*YIELD_TEMPLATES*/
	},
	action: function() {
		App.logout();
	}
});