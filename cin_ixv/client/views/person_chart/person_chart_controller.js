PersonChartController = RouteController.extend({
	template: "PersonChart",
	yieldTemplates: {
		/*YIELD_TEMPLATES*/
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
