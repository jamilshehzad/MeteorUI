PersonCompaniesController = RouteController.extend({
	template: "Person",
	yieldTemplates: {
		'PersonCompanies': {to: 'PersonSubcontent'}
	},
	action: function() {
		this.render();
	},
	waitOn: function(){
		this.subscribe("persons").wait();
	}, 

	data: function() {
		return Persons.findOne({ _id: this.params._id });
	}

});