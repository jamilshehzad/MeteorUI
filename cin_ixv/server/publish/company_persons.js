Meteor.publish('company_persons', function () {
	return CompanyPersons.find({});
});
