var libsOrigin = '../assets/lib/';
if(window.location.origin ==='http://www.caicui.com' || window.location.origin===window.origin){
	libsOrigin = window.libjs+'/libjs/';
}
require.config({
	waitSeconds: 0,
	paths : {
		jquery: libsOrigin + 'jquery/2.0.3/jquery.min',
		jqueryMD5: libsOrigin + 'jquery.md5/jquery.md5',
		jqueryUI: libsOrigin + 'jquery-ui/jquery-ui',
		jqueryBase64: libsOrigin + 'jquery.base64/0.1/jquery.base64',
		slimscroll: libsOrigin + 'jquery.slimscroll/1.3.6/jquery.slimscroll',

		backbone: libsOrigin + 'backbone/1.1.2/backbone-min',
		// layer: libsOrigin + 'layer/1.9/layer',
		layer: libsOrigin + 'layer/3.1/layer',
		layerExt : libsOrigin + 'layer/1.9/extend/layer.ext',
		swiper : libsOrigin + 'swiper/3.1.7/swiper.min',
		underscore: libsOrigin + 'underscore/1.8.3/underscore-min',
		iScroll : libsOrigin + 'iscroll/5.1.3/iscroll-probe',
		cookie: libsOrigin + 'jquery.cookie/1.4.1/jquery.cookie',
		director : libsOrigin + 'director/1.2.6/director.min',
		bootstrap : libsOrigin + 'bootstrap/3.0.0/bootstrap.min',
		datetimepicker : libsOrigin + 'datetimepicker/2.0/bootstrap-datetimepicker.min',
		datetimepickerZHCN : libsOrigin + 'datetimepicker/2.0/locales/bootstrap-datetimepicker.zh-CN',
		d3 : libsOrigin + 'd3/v3/d3.v3.min',
		iMobile : 'base/iMobile',
		router : 'routers/index',
		request : 'request/index',
		iGlobal : 'base/iGlobal',
		storage: "base/storage",
		ajax : 'base/ajax',
		location: "base/location",
		common : 'base/common',
		circle : libsOrigin + 'circle/circle-progress',
		
	},
	shim : {
		underscore : {
			exports : '_'
		},
		backbone : {
			deps : ['jquery','underscore'],
			exports : 'Backbone'
		},
		layer : {
			deps : ['jquery']
		},
		datetimepicker : {
			deps : ['bootstrap']
		},
		datetimepickerZHCN : {
			deps : ['datetimepicker']
		}
	},
	urlArgs: 'v=' + version
});
require(['jquery', 'cookie', 'backbone', 'underscore', 'router', 'iScroll', 'iGlobal', 'request', 'common','storage', 'layer'],
	function($, Cookie, Backbone, underscore, Router, iScroll, iGlobal, Request, Common, Storage, Layer){

		var cookieUser = '';
		if($.cookie('loginInfo')){
			cookieUser = JSON.parse($.cookie('loginInfo'));
			cookieUser.username = cookieUser.nickName;
		}else if($.cookie('User')){
			cookieUser = JSON.parse($.cookie('User'));
			cookieUser.nickName = cookieUser.username || cookieUser.nickName;
		}
		window.clientType = "pc";
		window.CAICUI = {
			'nodeToken' : '805e6aeb-c0ac-48e4-8fd2-4f250069ea65',
			'nodeMemberId' : '219bb4041e6211e793b064006a5147e8',
			'defaultPageSize' : 999,
			'isNav' : true,
			'location' : {
				'hash' : '',
				'router' : ''
			},
			'render' : {
				'$this' : '',
				'severTotal' : 0,
				'serverNum' : 0,
				'timer' : '',
				'time' : 500
			},
			'CACHE' : {
				'courseDetail' : []
			},
			'Router' : Router,
			'underscore' : underscore,
			'Common' : Common,
			'Storage' : Storage,
			'iGlobal' : iGlobal,
			'Request' : Request,
			'User' : cookieUser,
			'NavVideo' : true,
			'Loading' : true,
			'domRender' : true,
			'timer' : {}
		};
		// if(window.location.origin == "http://www.caicui.com"){
		// 	CAICUI.www = CAICUI.Common.host.name;
		// }else{
		// 	CAICUI.www = CAICUI.Common.host.demoName;
		// }
		// $.ajax({
		// 	url : CAICUI.www+'/api/v2/member/get',
		// 	data : {
		// 		token : CAICUI.User.token
		// 	},
		// 	success : function(data){
		// 		CAICUI.member = data.data;
		// 	},
		// 	error : function(data){
		// 		console.log(CAICUI.www+'/api/v2/member/get'+data)
		// 	}
		// })

		var studycenterUrl = '';
		if(window.location.origin !== 'http://www.caicui.com' && window.location.origin!=='http://elearning.zbgedu.com'){
			CAICUI.Common.loginLink = CAICUI.Common.loginLinkTest;
			studycenterUrl = '../studycenter.min.html?v='+ version;
		}else{
			studycenterUrl = '../studycenter.min.html?v='+ version;
		}
		$.ajax({
		    url : studycenterUrl,
		    // async: false,
		    dataType: 'html',
		    type: 'get',
		    success : function(data){
		        $('#studycenter-template').append(data);
		        /*
		        setTimeout(function(){
		            if ($.cookie("User") && $.cookie("User") != 'null') {
		              
		                //判断cookie用户是否和缓存的用户是同一用户，如果不是需要清除数据
		                if (storage.get("user")) {
		                    var User = JSON.parse($.cookie("User"));
		                    if ((storage.get("user")).memberId != User.memberId) {
		                        //刷新清除缓存
		                        //alert("系统检测到您使用了不同的账号来登录学习中心，请注意您的账号安全。");
		                        storage.clearall();
		                        storage.set({
		                            "user": User
		                        });
		                    }
		                } else {
		                    //刷新清除缓存
		                    storage.clearall();
		                    storage.set({
		                        "user": $.cookie("User")
		                    });
		                }
		                if (!window.location.hash) {
		                    location.setHash("/index");
		                    //iMobile.constant.nav = window.location.hash.substr(2)
		                } else {
		                    //iMobile.constant.nav = 'index'

		                }
		                require(['view/home'], function(home) {
		                    home.init(function() {
		                        router.init();
		                    });
		                })
		            } else {
		                $.cookie('User', null, {
		                    path: '/',
		                    expires: -1
		                });
		                require(['view/login'], function(login) {
		                    login.init();
		                })
		            }
		        },0)
						*/

					if(window.location.origin !== "http://www.caicui.com" && window.location.origin !== "http://elearning.zbgedu.com"){
							document.onkeyup = function(event){
							  var event = event || window.event;
							  if((event.altKey && event.keyCode == 112) || event.keyCode == 13){
									var layerPop = layer.open({
										title : '请选择开发环境！',
									  btn: ['正式环境','测试环境','模拟环境'],
									  yes : function(index, layero){
									    window.localStorage.clear();
											$.removeCookie('User',{ path: '/' });
											$.removeCookie('loginInfo',{ path: '/' });
											$.removeCookie('Token',{ path: '/' });
											$.removeCookie('envType',{ path: '/' });

					            $.removeCookie('token', {
					                path: '/',
					                expires: -1
					            });

				              $.cookie('envType', 0, {
				            		path: '/',
				            		expires: 36500
				            	});
											// window.location.href = CAICUI.Common.loginLink;
											window.location.reload();
											layer.close(layerPop);
									  },
									  btn2 : function(index, layero){
		  								window.localStorage.clear();
		  								$.removeCookie('User',{ path: '/' });
		  								$.removeCookie('loginInfo',{ path: '/' });
		  								$.removeCookie('Token',{ path: '/' });
		  								$.removeCookie('envType',{ path: '/' });

		  		            $.removeCookie('token', {
		  		                path: '/',
		  		                expires: -1
		  		            });
		  	              $.cookie('envType', 1, {
		  	            		path: '/',
		  	            		expires: 36500
		  	            	});
		  								// window.location.href = CAICUI.Common.loginLink;
		  								window.location.reload();
		  								layer.close(layerPop);
									  },
									  btn3 : function(index, layero){
									  	window.localStorage.clear();
											$.removeCookie('User',{ path: '/' });
											$.removeCookie('loginInfo',{ path: '/' });
											$.removeCookie('Token',{ path: '/' });
											$.removeCookie('envType',{ path: '/' });

					            $.removeCookie('token', {
					                path: '/',
					                expires: -1
					            });
				              $.cookie('envType', 2, {
				            		path: '/',
				            		expires: 36500
				            	});
											// window.location.href = CAICUI.Common.loginLink;
											window.location.reload();
											layer.close(layerPop);
									  }
									});
						  	}
							  
							};
					}else{
						$.cookie('envType', 0, {
							path: '/',
							expires: 36500
						});
					}
					Router.init();
					
					var hash = window.location.hash;
					if(!hash){
						window.location.hash = '#studycenterIndex';
					}
		    }
		});
		
	}
);