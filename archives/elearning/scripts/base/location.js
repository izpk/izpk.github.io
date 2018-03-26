;
define([], function() {
	var location = {
		args: function() {
			var args = {};
			var match = null;
			var search = decodeURIComponent(location.search.substring(1));
			var reg = /(?:([^&]+)=([^&]+))/g;
			while ((match = reg.exec(search)) !== null) {
				args[match[1]] = match[2];
			}
			return args;
		},
		getHash: function() {
			return window.location.hash
		},
		setHash: function(str) {
			window.location.hash = str
		}
	}
	return {
		"args": location.args,
		"getHash": location.getHash,
		"setHash": location.setHash
	}
});