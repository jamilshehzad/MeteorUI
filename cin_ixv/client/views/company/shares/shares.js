var pageSession = new ReactiveDict();

Template.CompanyShares.created = function() {
	pageSession.set("viewMode", "list");		
}

Template.CompanyShares.events({

});

Template.CompanyShares.helpers({
	"listMode": function() {
		return pageSession.get("viewMode") == "list";
	},
	"insertMode": function() {
		return pageSession.get("viewMode") == "insert";
	}
});

Template.CompanySharesView.events({
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
				pageSession.set("CompanySharesViewSearchString", searchString);
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
					pageSession.set("CompanySharesViewSearchString", searchString);
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
					pageSession.set("CompanySharesViewSearchString", "");
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

Template.CompanySharesView.helpers({
});


Template.CompanySharesViewData.events({

});

Template.CompanySharesViewData.helpers({
	'companyShares': function() {
		var companyId = this._id;
		if(!companyId) {
			return;
		}

		searchString = pageSession.get("CompanySharesViewSearchString");

		var list = CompanyShares.find({companyId: companyId}).fetch();
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
		return _.filter(list, function(item) { return rex.test(item.name) || rex.test(item.address); });
	}
});


Template.CompanySharesViewDataHeader.events({

});

Template.CompanySharesViewDataHeader.helpers({

});


Template.CompanySharesViewDataItems.events({
	"click .delete-button": function(e, t) {
		CompanyShares.remove({ _id: this._id });
		return false;
	}
});

Template.CompanySharesViewDataItems.helpers({

});

Template.CompanySharesForm.rendered = function() {
	$('.datepicker').datepicker({ format: "dd.mm.yyyy", language: "de-DE", autoclose: true, forceParse: false });
	if(!$('.datepicker').val() && $(".datepicker").attr("required")) {
		$('.datepicker').datepicker('update', new Date());    	
	}

	$(".datepicker-button").click(function() {
		$(this).closest(".input-group").find(".datepicker").datepicker("show");
		return false;
	});
}

Template.CompanySharesForm.events({
	"submit": function(e, t) {
		var companyId = this._id;

		validateForm(
			$(e.target), 
			function(fieldName, fieldValue) {
				if(fieldName == "personId" && fieldValue == "") {
					return "Please choose person.";
				}
				if(fieldName == "share") {
					var intValue = parseInt(fieldValue);
					if(isNaN(intValue) || intValue < 0 || intValue > 100) {
						return "Please enter share percent between 0 and 100.";
					}
				}
				if(fieldName == "since" && !moment(fieldValue, "DD.MM.YYYY", true).isValid()) {
					return "Please date since person owns company shares.";
				}
			},
			function(msg) {

			},
			function(values) {
				values.companyId = companyId;
				values.status = "active";
				CompanyShares.insert(values);
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

Template.CompanySharesForm.helpers({
	"personList": function() {
		return Persons.find();
	}
});
