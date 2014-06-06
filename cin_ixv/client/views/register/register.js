var page_session = new ReactiveDict();

page_session.set("errorMessage", "");

Template.Register.created = function() {
	page_session.set("errorMessage", "");	
}

Template.Register.events({
	'submit #register_form' : function(e, t) {
		e.preventDefault();

		var submit_button = $(t.find(":submit"));

		var register_name = t.find('#register_name').value.trim();
		var register_email = t.find('#register_email').value.trim();
		var register_password = t.find('#register_password').value;

		// check name
		if(register_name == "")
		{
			page_session.set("errorMessage", "Please enter your name.");
			t.find('#register_name').focus();
			return false;			
		}

		// check email
		if(!isValidEmail(register_email))
		{
			page_session.set("errorMessage", "Please enter valid e-mail address.");
			t.find('#register_email').focus();
			return false;			
		}

		// check password
		var min_password_len = 6;
		if(!isValidPassword(register_password, min_password_len))
		{
			page_session.set("errorMessage", "Your password must be at least " + min_password_len + " characters long.");
			t.find('#register_password').focus();
			return false;						
		}

		Accounts.createUser({email: register_email, password : register_password, profile: { name: register_name }}, function(err) {
			if(err)
				page_session.set("errorMessage", err.message);
			else
				page_session.set("errorMessage", "");
		});
		return false;
	}
});

Template.Register.helpers({
	errorMessage: function() {
		return page_session.get("errorMessage");
	}
});