CompanyPersonsController = RouteController.extend({
	template: "Company",
	yieldTemplates: {
		'CompanyPersons': {to: 'CompanySubcontent'}
	},
	action: function() {
		this.render();
	},
	waitOn: function(){
		this.subscribe("companies").wait();
	}, 

	data: function() {
		return Companies.findOne({ _id: this.params._id });
	}
});