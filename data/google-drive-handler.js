var code = document.getElementById('code');
if (code != null){
	self.port.emit('takeCode',code.value);
	console.log(code.value);
}


self.port.on('signedIn',function(msg){
	document.body.innerHTML = msg;
	self.port.emit('closeTab','Signed In Written');
});
