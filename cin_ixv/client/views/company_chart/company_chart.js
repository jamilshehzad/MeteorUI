Template.CompanyChart.rendered = function() {
	var companyId = this.data._id;
	VLXVisualizer(function(visualizer) {
		visualizer.loadData("Company", companyId);
	});
}

Template.CompanyChart.events({
	"hide.bs.modal": function() {
		$("#VLVChart").removeClass("shrink");
	}
});
