var page_session = new ReactiveDict();

page_session.set("errorMessage", "");

Template.Login.created = function() {
	page_session.set("errorMessage", "");	
}

Template.Login.events({
	'submit #login_form' : function(e, t) {
		e.preventDefault();

		var submit_button = $(t.find(":submit"));

		var login_email = t.find('#login_email').value.trim();
		var login_password = t.find('#login_password').value;

		// check email
		if(!isValidEmail(login_email))
		{
			page_session.set("errorMessage", "Please enter your e-mail address.");
			t.find('#login_email').focus();
			return false;
		}

		// check password
		if(login_password == "")
		{
			page_session.set("errorMessage", "Please enter your password.");
			t.find('#login_email').focus();
			return false;
		}

		Meteor.loginWithPassword(login_email, login_password, function(err) {
			if (err)
			{
				page_session.set("errorMessage", err.message);
				return false;
			}
			else
				page_session.set("errorMessage", "");
		});
		return false; 
	}
});

Template.Login.helpers({
	errorMessage: function() {
		return page_session.get("errorMessage");
	}
});
