var pageSession = new ReactiveDict();

Template.PersonShares.created = function() {
	pageSession.set("viewMode", "list");		
}

Template.PersonShares.events({

});

Template.PersonShares.helpers({
	"listMode": function() {
		return pageSession.get("viewMode") == "list";
	},
	"insertMode": function() {
		return pageSession.get("viewMode") == "insert";
	}
});


Template.PersonSharesView.events({
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
				pageSession.set("PersonSharesViewSearchString", searchString);
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
					pageSession.set("PersonSharesViewSearchString", searchString);
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
					pageSession.set("PersonSharesViewSearchString", "");
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

Template.PersonSharesView.helpers({
});


Template.PersonSharesViewData.events({

});

Template.PersonSharesViewData.helpers({
	'personShares': function() {
		var personId = this._id;
		if(!personId) {
			return;
		}

		searchString = pageSession.get("PersonSharesViewSearchString");

		var list = CompanyShares.find({personId: personId}).fetch();
		_.each(list, function(item) {
			var company = Companies.findOne({_id: item.companyId});
			if(company) {
				item.name = company.name;
				item.address = company.address;
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


Template.PersonSharesViewDataHeader.events({

});

Template.PersonSharesViewDataHeader.helpers({

});


Template.PersonSharesViewDataItems.events({
	"click .delete-button": function(e, t) {
		CompanyShares.remove({ _id: this._id });
		return false;
	}
});

Template.PersonSharesViewDataItems.helpers({

});


Template.PersonSharesForm.rendered = function() {
	$('.datepicker').datepicker({ format: "dd.mm.yyyy", language: "de-DE", autoclose: true, forceParse: false });
	if(!$('.datepicker').val() && $(".datepicker").attr("required")) {
		$('.datepicker').datepicker('update', new Date());    	
	}

	$(".datepicker-button").click(function() {
		$(this).closest(".input-group").find(".datepicker").datepicker("show");
		return false;
	});
}

Template.PersonSharesForm.events({
	"submit": function(e, t) {
		var personId = this._id;
		validateForm(
			$(e.target), 
			function(fieldName, fieldValue) {
				if(fieldName == "companyId" && fieldValue == "") {
					return "Please choose company.";
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
				values.personId = personId;
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

Template.PersonSharesForm.helpers({
	"companyList": function() {
		return Companies.find();
	}
});
