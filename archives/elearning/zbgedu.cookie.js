;(function(window){
	window.caicuiCookie = {
		host : 'http://elearning.zbgedu.com',
		interValCookie : '',
		setInterVal : function(){
			if(window.location.href == "http://www.zbgedu.com/index.php?m=shop&c=reception&a=shoporder&type=0"){
				var loginInfoData = JSON.parse(caicuiCookie.getCookie('loginInfo'));
				if(loginInfoData && loginInfoData.token){
					var editinfoData = '';
					var editinfoDataArray = ['token','nickname','mobile','email','address','areaPath'];
					editinfoDataArray.forEach(function(list, index){
						if(loginInfoData[list]){
							if(index){
								editinfoData += '&';
							}
							editinfoData += list+'='+loginInfoData[list];
						}
					})
					this.post('http://api.zbgedu.com/api/zbids/member/editinfo',editinfoData,function(data){
						if(typeof data == "string"){
							data = JSON.parse(data);	
						}
						if(data.state == "error" && data.msg == "nologin"){
							window.location.href = "http://www.zbgedu.com/index.php?m=user&c=index&a=logout"
						}
					});
				}
			}
			var interValCookie = setInterval(function(){
				var cookie = caicuiCookie.getCookie('loginInfo');
				if(cookie){
					clearInterval(interValCookie);
					caicuiCookie.createIframe(JSON.parse(cookie).token);
				}
			},500)
		},
		createIframe : function(token){
			var iframe=document.createElement("iframe");
			iframe.setAttribute("id","cookieIframe");
			iframe.setAttribute("src", caicuiCookie.host+"/zbgedu.cookie.html?token="+token);
			iframe.setAttribute("style", "display: none;");
			iframe.setAttribute("width", "0");
			iframe.setAttribute("height", "0");
			var body = document.getElementsByTagName("body");  
			if(body.length){
			  body[0].appendChild(iframe);
			}else{
			  document.documentElement.appendChild(iframe);
			}
		},
		getCookie : function(name){
			var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
			if(arr=document.cookie.match(reg)){
			  return unescape(arr[2]); 
			}else{
			  return null;
			}
		},
		get: function(url, fn) {
	    var obj = new XMLHttpRequest();     
	    obj.open('GET', url, true);
	    obj.onreadystatechange = function() {
	        if (obj.readyState == 4 && obj.status == 200 || obj.status == 304) {
	            fn.call(this, obj.responseText);
	        }
	    };
	    obj.send();
		},
		post: function (url, data, fn) {
	    var obj = new XMLHttpRequest();
	    obj.open("POST", url, true);
	    obj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	    obj.onreadystatechange = function() {
        if (obj.readyState == 4 && (obj.status == 200 || obj.status == 304)) {
        	fn.call(this, obj.responseText);
        }
	    };
	    obj.send(data);
		}
	};
	caicuiCookie.setInterVal();
})(window);