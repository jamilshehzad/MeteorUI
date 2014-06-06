Accounts.onCreateUser(function (options, user) {
	if(Users.find().count())
		user.role = "user";
	else
		user.role = "admin"; // only first registered user is admin

	return user;
});