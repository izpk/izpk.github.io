;define([
	'jquery',
	'underscore',
	'backbone',
	'views/message',
	'views/message-list',
	'views/message-desc'
	],function($, _, Backbone, Message, MessageList, MessageDesc){
		'use strict';
		var Studycenter = Backbone.View.extend({
			el : 'body',
			template : _.template($('#template-layout').html()),
			events : {
				'mouseenter .nav' : 'navEnter',
				'mouseleave .nav' : 'navLeave',
				'click .nav-li' : 'addActive',
				'click .exit' : 'exitOptionShow',
				'click .message' : 'messageShow',
				'click .message-list-li' : 'messageListLi',
				'click .message-close' : 'messageClose',
				'click .sign-out' : 'signOut',
				'click .js-pagination-li' : 'paginationChange',
				'click .js-pagination-prev' : 'paginationPrev',
				'click .js-pagination-next' : 'paginationNext',
			},
			render : function(nav){
				if(this.$el.find('#layout').length){
					this.$el.find('#layout').remove();
				}
				this.$el.html(this.template({
					"nav" : nav
				}));
				CAICUI.render.navAnimateTime = 250;
				CAICUI.render.$this = this;
				CAICUI.render.pageNo = 1;
				CAICUI.render.pageSize = 20;
				CAICUI.render.$layout = this.$('#layout');
				this.$messageMain = this.$('.message-main');
				this.$exitOption = this.$('.exit-option');
			},
			signOut : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				var $this = this;
				CAICUI.Request.ajax({
					server : 'logout',
					data : {
						'token' : CAICUI.User.token
					},
					done : function(data){
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
					},
					fail : function(data){
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
					}
				});
			},
			messageList : function(callback){
				CAICUI.Request.ajax({
					'server' : 'message-list',
					'data' : {
						'token' : CAICUI.User.token,
						'type' : 1,
						'pageNo' : CAICUI.render.pageNo,
						'pageSize' : CAICUI.render.pageSize
					},
					done : function(data){
						callback(data);
					},
					fail : function(data){
						callback({});
					}
				})
			},
			messageRender : function(){
				var view = new Message();
				this.$('.message-content').html(view.render().el);
				this.$messageLeftContent = this.$('.message-left-content');
				this.$messageListContent = this.$('#scroller-message-list');
				this.$messageRight = this.$('.message-right');
			},
			messageListRender : function(){
				var $that = this;
				this.messageList(function(data){
					var view = new MessageList();
					$that.$messageLeftContent.html(view.render({
						"data" : {
							'messageList' : data.data,
							'pageNo': data.pageNo,
							'pageSize': data.pageSize,
							'totalCount': data.totalCount
						}
					}).el);
					window.CAICUI.scrollMessageList = CAICUI.iGlobal.iScroll('body #wrapper-message-list');
				});
			},
			messageListLi : function(e){
				var that = this.getThat(e);
				that.siblings().removeClass('active');
				that.addClass('active');
				var thatData = JSON.parse(that.children().attr('data-content'));
				var view = new MessageDesc();
				this.$messageRight.html(view.render(thatData).el);
				console.log(view.render(thatData).el)
				window.CAICUI.messageDesc = new IScroll('body #wrapper-message-desc', { 
					probeType: 3,
					mouseWheel: true,
					scrollbars: 'custom',
				});
				function updatePosition () {
					console.log(this.y)
				}
				window.CAICUI.messageDesc.on('scroll', updatePosition);
				document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
			},
			getThat : function(e){
				return $(e.currentTarget);
			},
			addActive : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				that.siblings().removeClass('active').end().addClass('active');
			},
			navEnter : function(){
				this.$('.main').stop(true,false).animate({
					'padding-left' : '180px'
				},CAICUI.render.navAnimateTime);
				this.$('.left').stop(true,false).animate({
					'width' : '180px'
				},CAICUI.render.navAnimateTime,function(){
					//CAICUI.render.$layout.removeClass('mini-nav');
				})
				//this.$('#layout').removeClass('mini-nav');
			},
			navLeave : function(){
				this.$('.main').stop(true,false).animate({
					'padding-left' : '60px'
				},CAICUI.render.navAnimateTime);
				this.$('.left').stop(true,false).animate({
					'width' : '60px'
				},CAICUI.render.navAnimateTime,function(){
					//CAICUI.render.$layout.addClass('mini-nav');
				})
				//this.$('#layout').addClass('mini-nav');
			},
			exitOptionShow : function(e){
				var that = this.getThat(e);
				this.$exitOption.toggleClass('active');
			},
			messageShow : function(e){
				var that = this;
				if(this.$messageMain.hasClass('active')){
					this.$messageMain.addClass('active');
				}else{
					this.$messageMain.addClass('active');
					this.messageRender();
					that.messageListRender();
				}
			},
			messageClose : function(e){
				var that = this.getThat(e);
				that.parents('.message-main').removeClass('active')
			},
			paginationChange : function(e){
				CAICUI.iGlobal.loading('body #scroller-message-list',{'height':$('#wrapper').height()+'px'});
				window.CAICUI.myScroll.refresh();
				var that = CAICUI.iGlobal.getThat(e);
				CAICUI.render.pageNo =that.attr('data-pageno');
				this.messageListRender();
				// this.examList(function(data){
				// 	var acList = new MessageList();
				// 	$('body #scroller').html(acList.render({
				// 		'data' : {
				// 			'examList' : data.data,
				// 			'pageNo': data.pageNo,
				// 			'pageSize': data.pageSize,
				// 			'totalCount': data.totalCount
				// 		}
				// 	}).el);
				// 	window.CAICUI.myScroll.refresh();
				// });
			},
			paginationPrev : function(e){

				if(this.pageNo>1){
					CAICUI.iGlobal.loading('body #scroller-message-list',{'height':$('#wrapper').height()+'px'});
					window.CAICUI.myScroll.refresh();
					CAICUI.render.pageNo = CAICUI.render.pageNo--;
					this.messageListRender();
					// this.examList(function(data){
					// 	var acList = new MessageList();
					// 	$('body #scroller').html(acList.render({
					// 		'data' : {
					// 			'examList' : data.data,
					// 			'pageNo': data.pageNo,
					// 			'pageSize': data.pageSize,
					// 			'totalCount': data.totalCount
					// 		}
					// 	}).el);
					// 	window.CAICUI.myScroll.refresh();
					// });
				}
			},
			paginationNext : function(e){
				if(this.pageNo<this.pageTotal-1){
					CAICUI.iGlobal.loading('body #scroller-message-list',{'height':$('#wrapper').height()+'px'});
					window.CAICUI.myScroll.refresh();
					CAICUI.render.pageNo = CAICUI.render.pageNo++;
					this.messageListRender();
					// this.examList(function(data){
					// 	var acList = new MessageList();
					// 	$('body #scroller').html(acList.render({
					// 		'data' : {
					// 			'examList' : data.data,
					// 			'pageNo': data.pageNo,
					// 			'pageSize': data.pageSize,
					// 			'totalCount': data.totalCount
					// 		}
					// 	}).el);
					// 	window.CAICUI.myScroll.refresh();
					// });
				}
			},
		});
		return Studycenter;
	});