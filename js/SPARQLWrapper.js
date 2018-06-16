(function(root, factory) {
	if(typeof define === "function"){
		define("SPARQLWrapper", factory);	// AMD || CMD
	}else{
		root.SPARQLWrapper = factory();	// <script>
	}
}(this, function(){
'use strict'

function SPARQLWrapper(endpoint){
	this.endpoint = endpoint;
	this.queryPart = "";
	this.type = "json";
}
SPARQLWrapper.prototype = {
	constructor: SPARQLWrapper,
	setQuery: function(query){
		this.queryPart = "query=" + encodeURI(query);
	},
	setType: function(type){
		this.type = type.toLowerCase();
	},
	query: function(type, callback){
		callback = callback === undefined ? type : this.setType(type) || callback;
		
		var xhr = new XMLHttpRequest();
		xhr.open('POST', this.endpoint, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		switch(this.type){
			case "json":
				type = "application/sparql-results+json";
				break;
			case "xml":
				type = "text/xml";
				break;
			case "html":
				type = "text/html";
				break;
			default:
				type = "application/sparql-results+json";
				break;
		}
		xhr.setRequestHeader("Accept", type);
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){
				var sta = xhr.status;
				if(sta == 200 || sta == 304){
					callback(xhr.responseText);
				}else{
					console && console.error("Sparql query error: " + xhr.status + " " + xhr.responseText);
				}
		
				window.setTimeout(function(){
					xhr.onreadystatechange= new Function();
					xhr = null;
				},0);
			}
		}
		
		xhr.send(this.queryPart);
	}
}


return SPARQLWrapper;

}));