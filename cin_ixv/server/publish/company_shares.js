Meteor.publish('company_shares', function () {
	return CompanyShares.find({});
});
