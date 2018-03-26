;
define([
    'jquery',
	'jqueryMD5',
    'storage',
    'location',
    'common'
], function($, md5, storage, location, config) {
    var request = {
        ajax: function(args) {
            var url = "";
            if (args.pathname) {
                url = args.pathname
            } else if (args.version == '2') {
                url = config.host.name + "/api/v2/" + args.server
            } else if (args.version == '2.1') {
                url = config.host.name + "/api/" + args.server + '/v2.1'
            } else {
                url = config.host.name + "/api/v2.1/" + args.server
            }
            // WINAPI.log(url)
            // WINAPI.log(args.data)
            var importantApi = {
                'http://api.zbgedu.com/api/v2.1/learning/noActivecourse': 1,
                'http://api.zbgedu.com/api/v2/course/active': 1,
                'http://api.zbgedu.com/api/v2.1/learning/learningcourse': 1,
                'http://api.zbgedu.com/api/v2.1/learning/expirationcourse': 1,
                'http://api.zbgedu.com/api/v2.1/study/coursestatus': 1,

                'http://api.zbgedu.com/api/v2.1/course/courseBaseInfoe': 1,
                'http://api.zbgedu.com/api/v2.1/course/chapterandtaskcount': 1,
                'http://api.zbgedu.com/api/v2.1/course/courseDetail': 1,
                'http://api.zbgedu.com/api/v2/logout': 1
            }
			

            jQuery.support.cors = true;
            //WINAPI.log(url);
            //WINAPI.log(args.data);
			
			//读取缓存数据
			var cachekey=($.md5(url+JSON.stringify(args.data))); //url+参数的md5码作为key
			//WINAPI.log("index:-------->"+url+JSON.stringify(args.data));
			/*if(!WINAPI.NetStatus()){ //返回有延迟
					//WINAPI.log("网络失败11:" + cachekey );
					//获取数据失败，优先检测是否有缓存数据
					var cachevalue=storage.get(cachekey); 
					if(cachevalue){
						//WINAPI.log("网络失败111:" + url+ JSON.stringify(cachevalue));
						args.done(cachevalue);
						return;
					}
			}*/
            $.ajax({
            	url: url + "?verTT=" + new Date().getTime(),  //请求加上时间戳，防止IE浏览器对接口数据的缓存
                type: args.type || "get",
                data: args.data || "",
                success: function(data) {
                    if (typeof data == "string") {
                        data = JSON.parse(data);
                    }
                    //if(args.server=="login"||args.server=="exe/getAuthorization"){
                    //    args.done(data)
                    //    
                    //    return;
                    //}
                    //if (importantApi[url] && data.msg == "nologin") {
                    if (data.msg == "nologin") {
                        //storage.remove("user");
                        //window.location.reload();
                        window.localStorage.clear();
                        $.removeCookie('User',{ path: '/' });
                        $.removeCookie('loginInfo',{ path: '/' });
                        $.removeCookie('Token',{ path: '/' });

                        $.removeCookie('token', {
                            path: '/',
                            expires: -1
                        });

                        CAICUI.isNav = true;
                        window.location.href = CAICUI.Common.loginLink;

                        
                    } else if (data.state == "success") {
						//数据成功，保存到缓存
						//WINAPI.log("网络成功:" + cachekey);
						storage.setsingle(cachekey, data);
						
                        args.done(data)
                            /*args.done({
                                "data" : "",
                                "status":0
                            })*/
                    } else if (data.state == "error") {
                        args.fail(data)
                    } else {
                        args.fail(data)
                    }
                },
                error: function(data) {
					//获取数据失败，优先检测是否有缓存数据
					var cachevalue=storage.get(cachekey); 
					if(cachevalue){
						//WINAPI.log("网络失败111:" + url+ JSON.stringify(cachevalue));
						args.done(cachevalue);
						return;
					}
					
                    if (typeof data == "string") {
                        data = JSON.parse(data);
                    }
                    if(args.server=="login"){
                        if (data.state == "success") {
                            args.done(data)
                        }else if (data.state == "error"){
                            args.fail(data)
                        }
                        return;
                    }
                    //if (importantApi[url] && data.msg == "nologin") {
                    if (data.msg == "nologin") {
                        window.localStorage.clear();
                        $.removeCookie('User',{ path: '/' });
                        $.removeCookie('loginInfo',{ path: '/' });
                        $.removeCookie('Token',{ path: '/' });

                        $.removeCookie('token', {
                            path: '/',
                            expires: -1
                        });

                        CAICUI.isNav = true;
                        window.location.href = CAICUI.Common.loginLink;
                    } else if (data.state == "success") {
                        args.done(data)
                            /*args.done({
                                "data" : "",
                                "status":0
                            })*/
                    } else if (data.state == "error") {
                        args.done({
                            data: [],
                            msg: "",
                            pageNo: 1,
                            pageSize: 999,
                            state: "success",
                            totalCount: 0
                        })
                    } else {
                        args.fail(data)
                    }

                }
            })
        }
    }
    return {
        "ajax": request.ajax
    }
})