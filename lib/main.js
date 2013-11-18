//Mozilla sdk modules:
var data = require("sdk/self").data;		
var Request = require("sdk/request").Request;
var tabs = require("sdk/tabs");
//var windows = require("sdk/windows").browserWindows;


/* GOOGLE DRIVE OAUTH CONSTANTS */
var CLIENT_ID = 
var CLIENT_SECRET = 
var REDIRECT_URI_URN = 
var REDIRECT_URI_LOCAL = 'http://localhost';
var SCOPE = 'https://www.googleapis.com/auth/drive+';
var URL = 'https://accounts.google.com/o/oauth2/auth?'+'scope='+SCOPE+'https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&'+'redirect_uri=' + REDIRECT_URI_URN + '&'+ 'client_id=' + CLIENT_ID+'&'+'response_type=code';


/*Google drive necessary var.*/
var access_token;
var token_type;
var expires_in;
var id_token;
var refresh_token;
var resumable_sesion_uri;
var theCode;




var myPanel = require("sdk/panel").Panel({
	width:500,
	height:500,
	position: {
   		right: 0
  	},
	//contentScriptFile: data.url("drive-test.js"),
	contentURL: data.url("simple.html")
});

var myWidget = require("sdk/widget").Widget({
	id: "my-widget",
	label: "My Widget",
	content: "GT!",
	width: 50,
	panel: myPanel,
	onClick: auth
});

var tabWorker;
var theCode;
function auth(){
	tabs.open({
		url: URL
	
	});
	
	tabs.on('ready', function(tab) {
		myPanel.hide();
		console.log('READY!!!');
  		tabWorker = tab.attach({
		      contentScriptFile: data.url('google-drive-handler.js')
	 	});
	 	tabWorker.port.on('takeCode',function(myCode){
			console.log('TAKE CODE');
			theCode = myCode;
			var getAccess = Request({		
				url: 'https://accounts.google.com/o/oauth2/token',
				contentType: 'application/x-www-form-urlencoded',
				content: {'code': myCode,'client_id':CLIENT_ID,'client_secret':CLIENT_SECRET,'redirect_uri':REDIRECT_URI_URN,'grant_type':'authorization_code'},
				onComplete: function(response){
					console.log('STATUS ' + response.statusText);
					if(response.statusText =='OK'){
						/*
						The response format will be:
						 {
						  "access_token" : string,
						  "token_type" : string,
						  "expires_in" : 3600,
						  "id_token" : string,
						  "refresh_token" : string
						}
						To access this; response.json.access_token, etc
						*/
						tabWorker.port.emit('signedIn','Signed in correctly!');
				
						access_token = response.json.access_token;
						token_type = response.json.token_type;
						expires_in = response.json.expires_in;
						id_token = response.json.id_token;
						refresh_token = response.json.refresh_token;
						
						console.log('Access completed!');
				
					}		
				}
			});
			getAccess.post();
			console.log('Posted!');
		});
		tabWorker.port.on('closeTab',function(msg){
			tab.close();
			myPanel.show();
		
		});
	});
	
};













