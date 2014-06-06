Meteor.methods({
	removeCompany: function(companyId) {
		Companies.remove({ _id: companyId });
		CompanyPersons.remove({ companyId: companyId });
		CompanyShares.remove({ companyId: companyId });
	},

	removePerson: function(personId) {
		Persons.remove({ _id: personId });
		CompanyPersons.remove({ personId: personId });
		CompanyShares.remove({ personId: personId });
	},

	removeCompanyPerson: function(companyId, personId) {
		CompanyPersons.remove({ companyId: companyId, personId: personId });		
	},

	removeCompanyShare: function(companyId, personId) {
		CompanyShares.remove({ companyId: companyId, personId: personId });		
	}
});
