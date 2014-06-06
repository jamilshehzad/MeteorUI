var page_session = new ReactiveDict();

page_session.set("errorMessage", "");
page_session.set("resetPasswordSent", "");

Template.ForgotPassword.events({
	// send reset password link
	'submit #forgot_password_form' : function(e, t) {
		e.preventDefault();

		var submit_button = $(t.find(":submit"));
		var reset_email = t.find('#reset_email').value.trim();

		// check email
		if(!isValidEmail(reset_email))
		{
			page_session.set("errorMessage", "Please enter your e-mail address.");
			t.find('#reset_email').focus();
			return false;
		}

		Accounts.forgotPassword({email: reset_email}, function(err) {
			if (err)
				page_session.set("errorMessage", err.message);
			else
			{
				page_session.set("errorMessage", "");
				page_session.set("resetPasswordSent", true);				
			}
		});

		return false; 
	},

	// button "OK" in information box after reset password email is sent
	'click #reset_password_sent' : function(e, t) {
		page_session.set("resetPasswordSent", false);
		return true;
	}

});

Template.ForgotPassword.helpers({
	errorMessage: function() {
		return page_session.get("errorMessage");
	},

	resetPasswordSent: function() {
		return page_session.get("resetPasswordSent");
	}
});
