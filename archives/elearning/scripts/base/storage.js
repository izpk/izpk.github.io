;
define(function() {
	var storage = {

		set: function(args) {
			for (var i in args) {
				//封装一个时间戳
				var datapack = {
						date: null, //保存时间
						data: null //保存数据
					}
					//数据为空不保存
				if (args[i].data && args[i].data == "" && args[i].data.state && args[i].data.state != "success") {
					console.log("can't  save:" + key);
					console.log(value);
					return;
				}
				datapack.data = JSON.stringify(args[i]);
				datapack.date = Date.parse(new Date()); //当前时间戳
				if(clientType=="exe"){
					//默认缓存时间为24小时
					datacache.module.put(i,JSON.stringify(datapack),86400000);
				}else{
					localStorage.setItem(i, JSON.stringify(datapack));
				}
			}
		},
		setsingle: function(key, value) {
			//数据为空不保存
			if (value.data && value.data == "" && value.state && value.state != "success") {
				console.log("can't  save:" + key);
				console.log(value);
				return;
			}

			var datapack = {
				date: null, //保存时间
				data: null //保存数据
			}
			datapack.data = JSON.stringify(value);
			datapack.date = Date.parse(new Date()); //当前时间戳
			if(clientType=="exe"){
				datacache.module.put(key,JSON.stringify(datapack),86400000);
			}else{
				localStorage.setItem(key, JSON.stringify(datapack));
			}
			
		},
		setStorage : function(args){
      for(var i in args) {
            localStorage.setItem(i, JSON.stringify(args[i]));
        }
		},
		get: function(key) {
			var keyvalue=null;
			if(clientType=="exe"){
				keyvalue=JSON.parse(datacache.module.get(key));
			}else{
				if (localStorage.getItem(key)) {
					try {
						keyvalue = JSON.parse(localStorage.getItem(key));
					} catch (e) {
						return null;
					}
				} else
					return null;
			}

			if(!keyvalue) return null;

			//增加业务处理：超过24小时则认为无效,，用户信息不要求此验证
			if (key != "user") {
				if ((Date.parse(new Date()) - keyvalue.date) > 86400000) {
					this.remove(key);
					return null;
				}
			}
			return JSON.parse(keyvalue.data);
		},
		getStorage : function(key){
			if(localStorage.getItem(key)) {
        try {
            return JSON.parse(localStorage.getItem(key));
        }catch(e) {
            return localStorage.getItem(key);
        }
	    }else{
	    	return null;
	    }
	        
		},
		remove: function(key) {
			if(clientType=="exe"){
				datacache.module.remove(key);
			}else{
				localStorage.removeItem(key);
				sessionStorage.removeItem(key);
			}

			
		},
		clearall:function(key) {
			if(clientType=="exe"){
				//datacache.module.init();
			}else{
				window.localStorage.clear();
			}
			
		}

	};
	return {
		"set": storage.set,
		"setsingle": storage.setsingle,
		"setStorage": storage.setStorage,
		"get": storage.get,
		"getStorage": storage.getStorage,
		"remove": storage.remove,
		"clearall":storage.clearall
	}
});