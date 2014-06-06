Template.PersonChart.rendered = function() {
	var personId = this.data._id;

	VLXVisualizer(function(visualizer) {
		visualizer.loadData("Person", personId);
	});
}

Template.PersonChart.events({
	"hide.bs.modal": function() {
		$("#VLVChart").removeClass("shrink");
	}
});
