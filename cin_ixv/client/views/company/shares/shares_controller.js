CompanySharesController = RouteController.extend({
	template: "Company",
	yieldTemplates: {
		'CompanyShares': {to: 'CompanySubcontent'}
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