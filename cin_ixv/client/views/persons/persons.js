var pageSession = new ReactiveDict();

Template.Persons.created = function() {
	pageSession.set("viewMode", "list");		
}

Template.Persons.events({

});

Template.Persons.helpers({
	"listMode": function() {
		return pageSession.get("viewMode") == "list";
	},
	"insertMode": function() {
		return pageSession.get("viewMode") == "insert";
	}
});

Template.PersonsView.events({
	"submit #dataview-controls": function(e, t) {
		return false;
	},

	"click #dataview-search-button": function(e, t) {
		var form = $(e.currentTarget).parent();
		if(form) {
			var searchInput = form.find("#dataview-search-input");
			if(searchInput) {
				searchInput.focus();
				var searchString = searchInput.val();
				pageSession.set("PersonsViewSearchString", searchString);
			}

		}
		return false;
	},

	"keydown #dataview-search-input": function(e, t) {
		if(e.which === 13)
		{
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					var searchString = searchInput.val();
					pageSession.set("PersonsViewSearchString", searchString);
				}

			}
			return false;
		}

		if(e.which === 27)
		{
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					searchInput.val("");
					pageSession.set("PersonsViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		pageSession.set("viewMode", "insert");
	}
});

Template.PersonsView.helpers({
});


Template.PersonsViewData.events({

});

Template.PersonsViewData.helpers({
	'persons': function() {
		searchString = pageSession.get("PersonsViewSearchString");
		if(!searchString || searchString == "") {
			return Persons.find({});
		}

		searchString = searchString.replace(".", "\\.");
		if(searchString == "") searchString = ".";

		return Persons.find({ 
			$or: [
				{"name": { $regex: new RegExp(searchString, "i") }},
				{"birthDate": { $regex: new RegExp(searchString, "i") }},
				{"address": { $regex: new RegExp(searchString, "i") }},
				{"status": { $regex: new RegExp(searchString, "i") }}
			]
		});
	}
});


Template.PersonsViewDataHeader.events({

});

Template.PersonsViewDataHeader.helpers({

});


Template.PersonsViewDataItems.events({
	"click #dataview-data-items-row td": function(e, t) {
		Router.go("person", {_id: this._id});
	},

	"click .delete-button": function(e, t) {
		var personId = this._id;
		Meteor.call("removePerson", personId);
		return false;
	}
});

Template.PersonsViewDataItems.helpers({

});


Template.PersonsInsertForm.rendered = function() {
	$('.datepicker').datepicker({ format: "dd.mm.yyyy", language: "de-DE", autoclose: true, forceParse: false });
	if(!$('.datepicker').val() && $(".datepicker").attr("required")) {
		$('.datepicker').datepicker('update', new Date());    	
	}

	$(".datepicker-button").click(function() {
		$(this).closest(".input-group").find(".datepicker").datepicker("show");
		return false;
	});
}

Template.PersonsInsertForm.events({
	"submit": function(e, t) {


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
				Persons.insert(values);
				pageSession.set("viewMode", "list");
			}
		);
		return false;
	},

	"click #form-button-cancel": function(e, t) {
		pageSession.set("viewMode", "list");
		return false;
	}
});

Template.PersonsInsertForm.helpers({

});
