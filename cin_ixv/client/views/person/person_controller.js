PersonController = RouteController.extend({
	template: "Person",
	yieldTemplates: {
		/*YIELD_TEMPLATES*/
	},
	action: function() {
		this.redirect('person.companies', {_id: this.params._id});
	},

	waitOn: function(){
		this.subscribe("persons").wait();
	}, 

	data: function() {
		return Persons.findOne({ _id: this.params._id });
	}

});