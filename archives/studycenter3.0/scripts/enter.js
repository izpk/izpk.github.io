'use strict';
var libsOrigin = 'libjs/';
if(window.location.origin!='http://localhost:3000'){
	libsOrigin = 'http://libjs.caicui.com/libjs/';
}
require.config({
	waitSeconds: 0,
	paths : {
		jquery: libsOrigin + 'jquery/2.0.3/jquery.min',
		jqueryMD5: libsOrigin + 'jquery.md5/jquery.md5',
		jqueryUI: libsOrigin + 'jquery-ui/jquery-ui',
		slimscroll: libsOrigin + 'jquery.slimscroll/1.3.6/jquery.slimscroll',

		backbone: libsOrigin + 'backbone/1.1.2/backbone-min',
		layer: libsOrigin + 'layer/1.9/layer',
		layerExt : libsOrigin + 'layer/1.9/extend/layer.ext',
		swiper : libsOrigin + 'swiper/3.1.7/swiper.min',
		underscore: libsOrigin + 'underscore/1.8.3/underscore-min',
		iScroll : libsOrigin + 'iscroll/5.1.3/iscroll-probe',
		cookie: libsOrigin + 'jquery.cookie/1.4.1/jquery.cookie',
		director : libsOrigin + 'director/1.2.6/director.min',

		iMobile : 'base/iMobile',
		router : 'routers/router',
		request : 'models/request',
		iGlobal : 'base/iGlobal',
		storage: "base/storage",
		ajax : 'base/ajax',
		location: "base/location",
		common : 'base/common',
		
	},
	shim : {
		underscore : {
			exports : '_'
		},
		backbone : {
			deps : ['jquery','underscore'],
			exports : 'Backbone'
		}
	}
});
require(['jquery', 'cookie', 'backbone', 'underscore', 'router', 'iScroll', 'iGlobal', 'request', 'common','storage'],
	function($, Cookie, Backbone, underscore, Router, iScroll, iGlobal, Request, Common, Storage){
		var cookieUser = '';
		if($.cookie('User')){
			cookieUser = JSON.parse($.cookie('User'));
			cookieUser.nickName = cookieUser.username || cookieUser.nickName;
		}else if($.cookie('loginInfo')){
			cookieUser = JSON.parse($.cookie('loginInfo'));
			cookieUser.username = cookieUser.nickName;
		}
		window.clientType = "pc";
		window.CAICUI = {
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
			'domRender' : true
		}
		var studycenterUrl = '';
		if(window.location.origin=='http://localhost:3000'){
			CAICUI.Common.loginLink = CAICUI.Common.loginLinkTest;
			studycenterUrl = 'scripts/html/studycenter.min.html';
		}else{
			studycenterUrl = 'script/html/studycenter.min.html';
		}
		$.ajax({
		    url : studycenterUrl,
		    // async: false,
		    dataType: 'html',
		    type: 'get',
		    success : function(data){
		        $('#studycenter-template').append(data)
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
		    }
		});
		Router.init();
		var hash = window.location.hash;
		if(!hash){
			window.location.hash = '#studycenterIndex';
		}
	}
);