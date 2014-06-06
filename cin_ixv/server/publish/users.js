Meteor.publish("user_data", function () {
	return Meteor.users.find(
		{ 
			_id: this.userId 
		},
		{ 
			fields: { 'profile': 1, 'role': 1 } 
		}
	);
});
