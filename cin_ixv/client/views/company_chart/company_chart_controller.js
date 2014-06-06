CompanyChartController = RouteController.extend({
	template: "CompanyChart",
	yieldTemplates: {
		/*YIELD_TEMPLATES*/
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