Router.configure({
/*
	notFoundTemplate: 'NotFound'
	, loadingTemplate: 'Loading'
	, templateNameConverter: 'upperCamelCase'
	, routeControllerNameConverter: 'upperCamelCase'
*/
});

RouteController.prototype.layoutTemplate = 'layout';

Router.ensureLogged = function() {
	if(!Meteor.user())
		this.redirect("home_public");
}

Router.ensureNotLogged = function() {
	if(Meteor.user())
		this.redirect("home_private");
}

Router.ensureAdmin = function() {
	if(!Users.isAdmin(Meteor.userId()))
		this.redirect("home_public");
}

if(Meteor.isClient) {
	Router.before(Router.ensureNotLogged, {only: ["home_public", "login", "register", "forgot_password", "reset_password"]});
	Router.before(Router.ensureLogged, {only: ["home_private", "persons", "person", "person.companies", "person.shares", "companies", "company", "company.persons", "company.shares", "logout"]});
	Router.before(Router.ensureAdmin, {only: ["person_edit", "company_edit"]});
}

Router.map(function () {
	this.route('home_public', {path: '/', controller: 'HomePublicController'});
	this.route('login', {path: '/login', controller: 'LoginController'});
	this.route('register', {path: '/register', controller: 'RegisterController'});
	this.route('forgot_password', {path: '/forgot_password', controller: 'ForgotPasswordController'});
	this.route('reset_password', {path: '/reset_password', controller: 'ResetPasswordController'});
	this.route('about', {path: '/about', controller: 'AboutController'});
	this.route('home_private', {path: '/home_private', controller: 'HomePrivateController'});
	this.route('persons', {path: '/persons', controller: 'PersonsController'});
	this.route('person', {path: '/persons/:_id', controller: 'PersonController'});
	this.route('person_edit', {path: '/persons/:_id/edit', controller: 'PersonEditController'});
	this.route('person_chart', {path: '/persons/:_id/chart', controller: 'PersonChartController'});
	this.route('person.companies', {path: '/persons/:_id/companies', controller: 'PersonCompaniesController'});
	this.route('person.shares', {path: '/persons/:_id/shares', controller: 'PersonSharesController'});
	this.route('companies', {path: '/companies', controller: 'CompaniesController'});
	this.route('company', {path: '/companies/:_id', controller: 'CompanyController'});
	this.route('company_chart', {path: '/companies/:_id/chart', controller: 'CompanyChartController'});
	this.route('company_edit', {path: '/companies/:_id/edit', controller: 'CompanyEditController'});
	this.route('company.persons', {path: '/companies/:_id/persons', controller: 'CompanyPersonsController'});
	this.route('company.shares', {path: '/companies/:_id/shares', controller: 'CompanySharesController'});
	this.route('logout', {path: '/logout', controller: 'LogoutController'});

	// server side routes
    this.route('api', { path: '/api', where: 'server', controller: 'ApiController'});
});
