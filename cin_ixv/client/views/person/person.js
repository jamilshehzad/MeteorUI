Template.Person.events({
	"click #edit-button": function(e, t) {
		Router.go("person_edit", {_id: this._id});
	},
	"click #visualize-button": function(e, t) {
		Router.go("person_chart", {_id: this._id});
	}
});

Template.Person.helpers({

});

Template.PersonSubMenu.events({

});

Template.PersonSubMenu.helpers({

});
