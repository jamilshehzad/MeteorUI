var pageSession = new ReactiveDict();

Template.CompanyPersons.created = function() {
	pageSession.set("viewMode", "list");		
}

Template.CompanyPersons.events({
});

Template.CompanyPersons.helpers({
	"listMode": function() {
		return pageSession.get("viewMode") == "list";
	},
	"insertMode": function() {
		return pageSession.get("viewMode") == "insert";
	}
});


Template.CompanyPersonsView.events({
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
				pageSession.set("CompanyPersonsViewSearchString", searchString);
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
					pageSession.set("CompanyPersonsViewSearchString", searchString);
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
					pageSession.set("CompanyPersonsViewSearchString", "");
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

Template.CompanyPersonsView.helpers({
});


Template.CompanyPersonsViewData.events({

});

Template.CompanyPersonsViewData.helpers({
	'companyPersons': function() {
		var companyId = this._id;
		if(!companyId) {
			return;
		}

		searchString = pageSession.get("CompanyPersonsViewSearchString");

		var list = CompanyPersons.find({companyId: companyId}).fetch();
		_.each(list, function(item) {
			var person = Persons.findOne({_id: item.personId});
			if(person) {
				item.name = person.name;
				item.address = person.address;
			}
		});

		if(!searchString || searchString == "") {
			return list;
		}

		searchString = searchString.replace(".", "\\.");
		if(searchString == "") searchString = ".";

		var rex = new RegExp(searchString, "i");
		return _.filter(list, function(item) { return rex.test(item.name) || rex.test(item.address) || rex.test(item.function); });
	}
});


Template.CompanyPersonsViewDataHeader.events({

});

Template.CompanyPersonsViewDataHeader.helpers({

});


Template.CompanyPersonsViewDataItems.events({
	"click .delete-button": function(e, t) {
		CompanyPersons.remove({ _id: this._id });
		return false;
	}
});

Template.CompanyPersonsViewDataItems.helpers({
});

Template.CompanyPersonsForm.rendered = function() {
	$('.datepicker').datepicker({ format: "dd.mm.yyyy", language: "de-DE", autoclose: true, forceParse: false });
	$(".datepicker").each(function() {
		if(!$(this).val() && $(this).attr("required")) {
			$(this).datepicker('update', new Date());    	
		}
	});

	$(".datepicker-button").click(function() {
		$(this).closest(".input-group").find(".datepicker").datepicker("show");
		return false;
	});
}

Template.CompanyPersonsForm.events({
	"submit": function(e, t) {

		var companyId = this._id;

		validateForm(
			$(e.target), 
			function(fieldName, fieldValue) {
				if(fieldName == "personId" && fieldValue == "") {
					return "Please choose person.";
				}
				if(fieldName == "function" && fieldValue == "") {
					return "Please enter function that person has in company.";
				}
				if(fieldName == "since" && !moment(fieldValue, "DD.MM.YYYY", true).isValid()) {
					return "Please date since person is working for company.";
				}
				if(fieldName == "left_company" && fieldValue != "" && !moment(fieldValue, "DD.MM.YYYY", true).isValid()) {
					return "Please enter valid date (or leave it blank).";
				}
			},
			function(msg) {

			},
			function(values) {
				values.companyId = companyId;
				values.status = values.left_company ? "inactive" : "active";
				CompanyPersons.insert(values);
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

Template.CompanyPersonsForm.helpers({
	"personList": function() {
		return Persons.find();
	}
});
