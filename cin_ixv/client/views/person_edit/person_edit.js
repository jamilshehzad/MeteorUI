Template.PersonEdit.rendered = function() {
	$('.datepicker').datepicker({ format: "dd.mm.yyyy", language: "de-DE", autoclose: true, forceParse: false });
	if(!$('.datepicker').val() && $(".datepicker").attr("required")) {
		$('.datepicker').datepicker('update', new Date());    	
	}

	$(".datepicker-button").click(function() {
		$(this).closest(".input-group").find(".datepicker").datepicker("show");
		return false;
	});
}

Template.PersonEdit.events({
	"submit": function(e, t) {
		var personId = this._id;

		validateForm(
			$(e.target), 
			function(fieldName, fieldValue) {
				if(fieldName == "name" && fieldValue == "") {
					return "Please enter name.";
				}
				if(fieldName == "birthDate" && fieldValue != "" && !moment(fieldValue, "DD.MM.YYYY", true).isValid()) {
					return "Please enter valid date (or leave it empty).";
				}
			},
			function(msg) {

			},
			function(values) {
				values.status = "active";
				Persons.update({_id: personId}, {$set: values});
				Router.go("person", {_id: personId});
			}
		);
		return false;
	},

	"click #form-button-cancel": function(e, t) {
		Router.go("person", {_id: this._id});
		return false;
	}
});

Template.PersonEdit.helpers({

});
