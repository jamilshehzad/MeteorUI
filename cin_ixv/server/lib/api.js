// accept GET and POST
receiveApiRequest = function(requestObject) {
	var requestData = {};
	if(requestObject.method == "GET") requestData = requestObject.query;
	if(requestObject.method == "POST") requestData = requestObject.body;
	return requestData;
}

queryTomcat = function(params) {
	var URL = "http://127.0.0.1:8080/CIN_IXV/load_data.jsp";
	var counter = 0;
	for(var v in params) {
		if(counter == 0) {
			URL += "?";
		} else {
			URL += "&";
		}
		URL += v + "=" + params[v];
		counter++;
	}

	var response = HTTP.call("GET", URL);
	if(response.content) {
		return response.content;
	}
	return "";
}

sendApiResponse = function(responseObject, responseData) {
	responseObject.writeHead(200, {'Content-Type': 'text/html', 'Cache-control': 'no-cache'});
	responseObject.end(responseData);
}

ApiController = RouteController.extend({

	action: function() {
		// read request
		var requestData = receiveApiRequest(this.request);
		// check params
		if(!requestData.action) {
			// parameter missing
			sendApiResponse(this.response, "Required parameter missing");
			return;
		}

		// user is found
		sendApiResponse(this.response, queryTomcat(requestData));
	}
});
