Template.CompanyEdit.rendered = function() {
	$('.datepicker').datepicker({ format: "dd.mm.yyyy", language: "de-DE", autoclose: true, forceParse: false });
	if(!$('.datepicker').val() && $(".datepicker").attr("required")) {
		$('.datepicker').datepicker('update', new Date());    	
	}

	$(".datepicker-button").click(function() {
		$(this).closest(".input-group").find(".datepicker").datepicker("show");
		return false;
	});
}

Template.CompanyEdit.events({
	"submit": function(e, t) {
		var companyId = this._id;
		validateForm(
			$(e.target), 
			function(fieldName, fieldValue) {
				if(fieldName == "name" && fieldValue == "") {
					return "Please enter company name.";
				}
				if(fieldName == "creationDate" && !moment(fieldValue, "DD.MM.YYYY", true).isValid()) {
					return "Please enter valid date.";
				}
				if(fieldName == "address" && fieldValue == "") {
					return "Please enter company address.";
				}
			},
			function(msg) {
			},
			function(values) {
				values.status = "active";
				Companies.update({_id: companyId}, { $set: values });
				Router.go("company", {_id: companyId});
			}
		);
		return false;
	},

	"click #form-button-cancel": function(e, t) {
		Router.go("company", {_id: this._id});
		return false;
	}
});

Template.CompanyEdit.helpers({

});
