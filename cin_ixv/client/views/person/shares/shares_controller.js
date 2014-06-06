PersonSharesController = RouteController.extend({
	template: "Person",
	yieldTemplates: {
		'PersonShares': {to: 'PersonSubcontent'}
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