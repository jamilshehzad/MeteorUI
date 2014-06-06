Users = Meteor.users;

Users.isAdmin = function (userId) {
	if(!userId) {
		return false;
	}

	var user = Users.findOne({ _id: userId });
	if(!user || !user.role) {
		return false;
	}

	return user.role == "admin";
};
