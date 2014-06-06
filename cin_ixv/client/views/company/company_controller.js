CompanyController = RouteController.extend({
	template: "Company",
	yieldTemplates: {
		/*YIELD_TEMPLATES*/
	},
	action: function() {
		this.redirect('company.persons', {_id: this.params._id});
	},

	waitOn: function(){
		this.subscribe("companies").wait();
	}, 

	data: function() {
		return Companies.findOne({ _id: this.params._id });
	}

});