;define([
	'jquery',
	'underscore',
	'backbone',
	'views/ac-desc',
	'views/message-desc',
	'layer'
	],function($, _, Backbone,	AcDesc, MessageDesc, layer){
		'use strict';
		var Studycenter = Backbone.View.extend({
			// tagName : 'ul',
			id : 'wrapper-message-list',
			className : 'wrapper',
			template : _.template($('#template-message-list').html()),
			events : {
				'click .message-list-li' : 'messageListLi'
			},
			type : '',
			render : function(data){
				this.$el.html(this.template(data));
				return this;
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
			messageListLi : function(e){
				CAICUI.iGlobal.loading('body .message-right',{'height':$('.message-right').height()+'px'});

				var that = CAICUI.iGlobal.getThat(e);;
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
							$('body .message-noRead-number').text(CAICUI.render.isNoReadNum);
							$('body .message-isReadNum').text(CAICUI.render.isNoReadNum);
							$('body #message-list-'+CAICUI.render.messageId).find('.message-unread-tips').remove();
						}
						
						if(callback){callback()};
					},
					fail : function(data){
						console.log(data);
					}
				})
			},
		});
		return Studycenter;
	});