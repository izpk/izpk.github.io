;define([
	'jquery',
	'underscore',
	'backbone',
	'layer'
	],function($, _, Backbone, layer){
		'use strict';
		var Studycenter = Backbone.View.extend({
			el : 'body',
			template : _.template($('#template-login').html()),
			events : {
				'click #login' : 'loginClick'
			},
			render : function(prePage){
				window.location.href = CAICUI.Common.loginLink;
				this.$el.html(this.template());
				CAICUI.render.$this = this;
				CAICUI.render.$prePage = prePage;
			},
			loginClick : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				this.login();
			},
			getToken : function(callback){
				CAICUI.Request.ajax({
					'server' : 'token',
					done : function(data){
						callback(data);
					},
					fail : function(data){
						CAICUI.render.$this.getToken(callback);
					}
				})
			},
			login : function(){

				this.getToken(function(data){
					CAICUI.Request.ajax({
						'server' : 'login',
						'data' : {
							// 'account' : '18801163758',
							// 'password' : '123456789',
							'account' : $('#name').val(),
							'password' : $('#password').val(),
							'token' : data.data.token
						},
						done : function(data) {
							window.localStorage.clear();
							var user = '{"memberId":"' + data.data.memberId + '","nickname":"' + data.data.nickName + '","nickName":"' + data.data.nickName + '","token":"' + data.data.token + '","avatar":"' + data.data.avatar + '"}';
							$.cookie('User', user, {
								path: '/',
								expires: 36500
							});
							$.cookie('loginInfo', user, {
								path: '/',
								expires: 36500
							});
							CAICUI.CACHE = {};
							CAICUI.render.$this.undelegateEvents();
							window.CAICUI.User = JSON.parse(user);
							//console.log(CAICUI.render.$prePage)
							//window.location.hash = CAICUI.render.$prePage;
							//CAICUI.Workspace.openPage(CAICUI.location.hash);
							window.location.hash = '#studycenterIndex'
						},
						fail : function(data) {
							layer.msg('Sorry~ 登陆失败', function() {});
						}
					})
				});
			}
		});
		return Studycenter;
	});