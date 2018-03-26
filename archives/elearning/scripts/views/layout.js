;define([
	'jquery',
	'underscore',
	'backbone',
	'views/message',
	'views/message-list',
	'views/message-desc',
	'views/ac-desc',
	'layer'
	],function($, _, Backbone, Message, MessageList, MessageDesc, AcDesc, layer){
		'use strict';
		var Studycenter = Backbone.View.extend({
			el : 'body',
			template : _.template($('#template-layout').html()),
			events : {
				// 'mouseenter .nav' : 'navEnter',
				// 'mouseleave .nav' : 'navLeave',
				'click .nav-li' : 'addActive',
				'click .exit' : 'exitOptionShow',
				// 'click .message' : 'messageShow',
				// 'click .message-list-li' : 'messageListLi',
				'click .message-close' : 'messageClose',
				'click .message-unread-close' : 'messageUnreadClose',
				'click .sign-out' : 'signOut',
				'click .js-pagination-li' : 'paginationChange',
				'click .js-pagination-prev' : 'paginationPrev',
				'click .js-pagination-next' : 'paginationNext',
				'click .message-notice-a' : 'allRead',
				'click .message-read-all' : 'allReadPop',
				'click .message-unread-number' : 'messageUnreadNumber',

			},
			render : function(nav){
				if(this.$el.find('#layout').length){
					this.$el.find('#layout').remove();
				}
				this.$el.html(this.template({
					"nav" : nav
				}));
				this.getappdownloadinfoAjax('aPhoneCourse',function(data){
					var codeUrl = window.static + data.appUrl;
					$('body .download-mobile-android').attr('href',codeUrl);
					$('body .download-mobile-android').attr('download','true');
				})
				this.getappdownloadinfoAjax('aPadCourse',function(data){
					var codeUrl = window.static + data.appUrl;
					$('body .download-pad-android').attr('href',codeUrl);
					$('body .download-pad-android').attr('download','true');
				})
				CAICUI.render.navAnimateTime = 250;
				CAICUI.render.this = this;
				CAICUI.render.messageThis = this;
				CAICUI.render.thisLayout = this;
				CAICUI.render.pageNo = 1;
				CAICUI.render.pageSize = 20;
				CAICUI.render.$layout = this.$('#layout');
				CAICUI.render.isRead = false;
				CAICUI.render.isNoReadNum = 0;

				this.$messageMain = this.$('.message-main');
				this.$exitOption = this.$('.exit-option');
				this.messageRender();
				this.messageListRender();
				// this.messageList();
				setTimeout(function(){
					$('.message').on('click',function(e){
						var that = this;
						if($('body .message-main').hasClass('active')){
							$('body .message-main').removeClass('active');
						}else{
							CAICUI.render.isRead = true;
							$('body .message-main').addClass('active');
							CAICUI.render.messageThis.messageRender();
							CAICUI.render.messageThis.messageListRender();
						}
					})
				},30)
			},
			signOut : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				var $this = this;
				// CAICUI.Request.ajax({
				// 	url : 'http://www.zbgedu.com/index.php?m=user&c=index&a=synchro_logout',
				// 	type : 'POST',
				// 	data : {
				// 		'token' : CAICUI.User.token
				// 	},
				// 	done : function(data){
				// 		if(data.msg == "success"){
							CAICUI.Request.ajax({
								server : 'logout',
								data : {
									'token' : CAICUI.User.token
								},
								done : function(data){
									CAICUI.render = {};
									window.localStorage.clear();
									$.removeCookie('User',{ path: '/' });
									$.removeCookie('loginInfo',{ path: '/' });
									$.removeCookie('Token',{ path: '/' });
									$.removeCookie('isDemo',{ path: '/' });

			            $.removeCookie('token', {
			                path: '/',
			                expires: -1
			            });

									CAICUI.isNav = true;
									// window.location.href = CAICUI.Common.loginLink;
									window.location.href = window.zbgedu.login;
								},
								fail : function(data){
									window.localStorage.clear();
									$.removeCookie('User',{ path: '/' });
									$.removeCookie('loginInfo',{ path: '/' });
									$.removeCookie('Token',{ path: '/' });
									$.removeCookie('isDemo',{ path: '/' });
									
									$.removeCookie('token', {
									    path: '/',
									    expires: -1
									});

									CAICUI.isNav = true;
									// window.location.href = CAICUI.Common.loginLink;
									window.location.href = window.zbgedu.login;
								}
							});
				// 		}else{
				// 			layer.msg('Sorry~ 请刷新页面重试。', function() {});
				// 		}
				// 	},
				// 	fail : function(data){
				// 		layer.msg('Sorry~ 请刷新页面重试。', function() {});
				// 	}
				// })

				
			},
			getappdownloadinfoAjax : function(appid, callback){
				CAICUI.Request.ajax({
					'server' : 'getappdownloadinfo',
					'data' : {
						'appId' : appid
					},
					done : function(data){
						if(callback){callback(data)};
					},
					fail : function(data){
						if(callback){callback(data)};
					}
				})
			},
			messageList : function(callback){
				if(CAICUI.render.isRead){
					CAICUI.Request.ajax({
						'server' : 'message-list',
						'data' : {
							'token' : CAICUI.User.token,
							// 'type' : '1',
							'pageNo' : CAICUI.render.pageNo,
							'pageSize' : CAICUI.render.pageSize
						},
						done : function(data){
							CAICUI.render.messageList = data.data;
							if(callback){callback(data)};
						},
						fail : function(data){
							if(callback){callback(data)};
						}
					})
				}else{
					CAICUI.Request.ajax({
						'server' : 'message-list',
						'data' : {
							'token' : CAICUI.User.token,
							'isRead' : '0', // 0 未阅读 1 已阅读
							// 'type' : '1',
							'pageNo' : CAICUI.render.pageNo,
							'pageSize' : CAICUI.render.pageSize
						},
						done : function(data){
							CAICUI.render.isNoReadAjax = true;
							if(data.totalCount){
								CAICUI.render.isNoReadNum = data.totalCount;
							}
							CAICUI.render.thisLayout.messageUnRead(data.data[0]);
							if(callback){callback(data)};
						},
						fail : function(data){
							if(callback){callback(data)};
						}
					})
				}
				
			},
			bbsdetail : function(callback){
				CAICUI.Request.ajax({
					'server' : 'bbsdetail',
					'data' : {
						'token' : CAICUI.User.token,
						'id' : CAICUI.render.replayId,
						'pageNo' : 1,
						'pageSize' : 20
					},
					done : function(data){
						CAICUI.render.messageBbsDetail = data.data;
						if(callback){callback(data.data)};
					},
					fail : function(data){
						layer.msg('Sorry~ 获取信息失败，请刷新页面重试。', function() {});
					}
				})
			},
			updateStatus : function(callback){
				CAICUI.Request.ajax({
					'server' : 'updateStatus',
					'data' : {
						'token' : CAICUI.User.token,
						'messageId' : CAICUI.render.messageId,
						'isall' : CAICUI.render.isAll
					},
					done : function(data){
						if(CAICUI.render.isNoReadNum){
							CAICUI.render.isNoReadNum--;
							if(!CAICUI.render.isNoReadNum){
								$('body .message').removeClass('redRead');
							}
							$('body .message-noRead-number').html(CAICUI.render.isNoReadNum);
							$('body .message-isReadNum').html(CAICUI.render.isNoReadNum);
							$('body #message-list-'+CAICUI.render.messageId).find('.message-unread-tips').remove();
						}
						
						if(callback){callback()};
					},
					fail : function(data){
						console.log(data);
					}
				})
			},
			messageUnRead : function(data){
				if(!data){
					return false;
				}
				var type = 0;
				if(data.msgType == "1" && data.title == "意见反馈"){
					type = 2;
				}else if(data.msgType == "1" && data.title != "意见反馈"){
					type = 1;
				}else if(data.msgType == "0"){
					type = 3;
				}
				CAICUI.render.messageType = type;

				$('body .message-noRead-number').html(CAICUI.render.isNoReadNum);

				$('body .top-right .message').addClass('redRead');
				var templateHtml = $('#template-message-unread').html();
				var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
					"data" : data,
					"messageType" : CAICUI.render.messageType
				});
				$('body .main').append(addHtml);	
			},
			messageRender : function(){
				var view = new Message();
				this.$('.message-content').html(view.render().el);
				this.$messageLeftContent = this.$('.message-left-content');
				this.$messageListContent = this.$('#scroller-message-list');
				this.$messageRight = this.$('.message-right');
				$('body .message-noRead-number').html(CAICUI.render.isNoReadNum);
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
					if(CAICUI.render.isNoReadAjax){
						$('body .message-noRead-number').html(CAICUI.render.isNoReadNum);
					}
					
					

					window.CAICUI.scrollMessageList = CAICUI.iGlobal.iScroll('body #wrapper-message-list');
				});
			},
			messageListLi : function(e){
				CAICUI.iGlobal.loading('body .message-right',{'height':$('.message-right').height()+'px'});

				var that = this.getThat(e);
				that.siblings().removeClass('active');
				that.addClass('active');
				var thatIndex = that.index();
				var thatData = CAICUI.render.messageList[thatIndex]
				CAICUI.render.messageId = thatData.id;
				var status = thatData.status;

				var type = 0;
				if(thatData.msgType == "1" && thatData.title == "意见反馈"){
					type = 2;
				}else if(thatData.msgType == "1" && thatData.title != "意见反馈"){
					type = 1;
				}else if(thatData.msgType == "0"){
					type = 3;
				}
				CAICUI.render.messageType = type;

				if(type == 3){
					var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"','#39':"'"};
					var newContent = '<div>' + thatData.content.replace(/&(lt|gt|nbsp|amp|quot|#39);/ig,function(all,t){return arrEntities[t];}) + '<div>';
					CAICUI.render.replayId = $(newContent).find('.bbsid').val();
					
				}else{
					
				}

				if(status == "0"){
					that.attr('data-status','1');
					thatData.status = '1';
					CAICUI.render.isAll = '0'
					this.updateStatus();
				}

				if(CAICUI.render.replayId){
					this.bbsdetail(function(data){
						var view = new AcDesc();
						$('body .message-right').html(view.render({
							"data" : data
						}).el);

						// if(isnew=='true'){
						// 	that.attr('data-isnew','false');
						// 	that.find('.icon-post-type-2').remove();
						// 	CAICUI.render.$this.addForumlistShowStorage({
						// 		"id" : id,
						// 		"time" : parseInt(new Date().getTime()/1000)
						// 	});
						// }
						setTimeout(function(){
							window.CAICUI.acScroll = CAICUI.iGlobal.iScroll('body #wrapper-ac');
							if(CAICUI.render.messageBbsDetail.imgPath && CAICUI.render.messageBbsDetail.imgPath !== 'imgpath'){
								layer.photos({
						      photos: '.discussQA-imgPath',
						      shift : 0
						    });
							}
						},300)
					});
				}else{
					var view = new MessageDesc();
					$('body .message-right').html(view.render(thatData).el);

					window.CAICUI.messageDesc = new IScroll('body #wrapper-message-desc', { 
						probeType: 3,
						mouseWheel: true,
						scrollbars: 'custom',
					});
					// function updatePosition () {
					// 	console.log(this.y)
					// }
					// window.CAICUI.messageDesc.on('scroll', updatePosition);
					// document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
				}
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
					CAICUI.render.isRead = true;
					this.$messageMain.addClass('active');
					this.messageRender();
					that.messageListRender();
				}
			},
			allRead : function(){
				// CAICUI.render.messageId = $(this).attr('data-id');
				if(CAICUI.render.isNoReadNum){
					CAICUI.render.isNoReadNum = 0;
					CAICUI.render.messageId = '';
					CAICUI.render.isAll = '1';
					CAICUI.render.this.updateStatus();
				}
				
			},
			allReadPop : function(){
				CAICUI.render.isNoReadNum = 0;
				CAICUI.render.messageId = '';
				CAICUI.render.isAll = '1';
				CAICUI.render.this.updateStatus(function(){
					$('body .message-unread').remove();
				});
			},
			messageUnreadNumber : function(){
				$('body .message').trigger('click');
				$('body .message-unread').remove();
			},
			messageClose : function(e){
				var that = this.getThat(e);
				that.parents('.message-main').removeClass('active')
			},
			messageUnreadClose : function(e){
				var that = this.getThat(e);
				CAICUI.render.messageId = that.parent().attr('data-id');
				CAICUI.render.isAll = '0';
				this.updateStatus(function(){
					$('body .message-unread').remove();
				});
				
			},
			paginationChange : function(e){
				CAICUI.iGlobal.loading('body #scroller-message-list',{'height':$('#wrapper').height()+'px'});
				window.CAICUI.myScroll.refresh();
				var that = CAICUI.iGlobal.getThat(e);
				CAICUI.render.pageNo =that.attr('data-pageno');
				this.messageListRender();
			},
			paginationPrev : function(e){

				if(this.pageNo>1){
					CAICUI.iGlobal.loading('body #scroller-message-list',{'height':$('#wrapper').height()+'px'});
					window.CAICUI.myScroll.refresh();
					CAICUI.render.pageNo = CAICUI.render.pageNo--;
					this.messageListRender();
				}
			},
			paginationNext : function(e){
				if(this.pageNo<this.pageTotal-1){
					CAICUI.iGlobal.loading('body #scroller-message-list',{'height':$('#wrapper').height()+'px'});
					window.CAICUI.myScroll.refresh();
					CAICUI.render.pageNo = CAICUI.render.pageNo++;
					this.messageListRender();
				}
			}
		});
		return Studycenter;
	});