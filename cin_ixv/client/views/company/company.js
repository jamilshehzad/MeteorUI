Template.Company.events({
	"click #edit-button": function(e, t) {
		Router.go("company_edit", {_id: this._id});
	},
	"click #visualize-button": function(e, t) {
		Router.go("company_chart", {_id: this._id});
	}
});

Template.Company.helpers({
});



Template.CompanySubMenu.events({

});

Template.CompanySubMenu.helpers({

});
