var pageSession = new ReactiveDict();

Template.Companies.created = function() {
	pageSession.set("viewMode", "list");		
}

Template.Companies.events({

});

Template.Companies.helpers({
	"listMode": function() {
		return pageSession.get("viewMode") == "list";
	},
	"insertMode": function() {
		return pageSession.get("viewMode") == "insert";
	}
});


Template.CompaniesView.events({
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
				pageSession.set("CompaniesViewSearchString", searchString);
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
					pageSession.set("CompaniesViewSearchString", searchString);
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
					pageSession.set("CompaniesViewSearchString", "");
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

Template.CompaniesView.helpers({
});


Template.CompaniesViewData.events({

});

Template.CompaniesViewData.helpers({
	'companies': function() {
		searchString = pageSession.get("CompaniesViewSearchString");
		if(!searchString || searchString == "") {
			return Companies.find({});
		}

		searchString = searchString.replace(".", "\\.");
		if(searchString == "") searchString = ".";

		return Companies.find({ 
			$or: [
				{"name": { $regex: new RegExp(searchString, "i") }},
				{"creationDate": { $regex: new RegExp(searchString, "i") }},
				{"address": { $regex: new RegExp(searchString, "i") }},
				{"status": { $regex: new RegExp(searchString, "i") }}
			]
		});
	}
});


Template.CompaniesViewDataHeader.events({

});

Template.CompaniesViewDataHeader.helpers({

});


Template.CompaniesViewDataItems.events({
	"click #dataview-data-items-row td": function(e, t) {
		Router.go("company", {_id: this._id});
	},

	"click .delete-button": function(e, t) {
		var companyId = this._id;
		Meteor.call("removeCompany", companyId);
		return false;
	}
});

Template.CompaniesViewDataItems.helpers({
});


Template.CompaniesInsertForm.rendered = function() {
	$('.datepicker').datepicker({ format: "dd.mm.yyyy", language: "de-DE", autoclose: true, forceParse: false });
	if(!$('.datepicker').val() && $(".datepicker").attr("required")) {
		$('.datepicker').datepicker('update', new Date());    	
	}

	$(".datepicker-button").click(function() {
		$(this).closest(".input-group").find(".datepicker").datepicker("show");
		return false;
	});
}

Template.CompaniesInsertForm.events({
	"submit": function(e, t) {
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
				Companies.insert(values);
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

Template.CompaniesInsertForm.helpers({

});
