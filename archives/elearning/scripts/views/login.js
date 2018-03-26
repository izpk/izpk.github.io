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
				// window.location.href = CAICUI.Common.loginLink;
				$('body #layout').append(this.template());
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
						console.log(data)
						// CAICUI.render.$this.getToken(callback);
					}
				})
			},
			login : function(){
				var name = $('body #name').val();
				var password = $('body #password').val();
				if(!name){
					layer.msg('Sorry~ 请输入用户名', {time: 1500}, function() {
						
					});
					return;
				}
				if(!password){
					layer.msg('Sorry~ 请输入密码', {time: 1500}, function() {
						
					});
					return;
				}
				CAICUI.Request.ajax({
					'server' : 'node-login',
					'data' : {
						'type' : 'pcWeb',
						'username' : name,
						'password' : password,
					},
					done : function(data) {

						window.localStorage.clear();
						var user = '{"login_time":"'+new Date().getTime()+'","memberId":"' + data.data.memberId + '","nickname":"' + data.data.nickName + '","nickName":"' + data.data.nickName + '","token":"' + data.data.token + '","avatar":"' + data.data.avatar + '"}';
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
						// window.location.hash = '#studycenterIndex';
						
						window.location.reload();

					},
					fail : function(data) {
						layer.msg('Sorry~ 登录失败', function() {});
					}
				});
				
			}
		});
		return Studycenter;
	});