;define([
	'jquery',
	'underscore',
	'backbone',
	'layer'
	],function($, _, Backbone, layer){
		'use strict';
		var Studycenter = Backbone.View.extend({
			el : 'body #right',
			template : _.template($('#template-help').html()),
			events : {
				'click .help-video-a' : 'openVideo',
				'click .studycenter-video-close' : 'studycenterVideoClose',
				'click .help-feedback' : 'openFeedbackPop',
				'click  embed' : 'toolPlayer'
			},
			render : function(){
				CAICUI.render.$this = this;
				CAICUI.render.helpVideoCcid = '';
				CAICUI.render.helpVideoDate = [{
					"videoTitle" : "测试1",
					"ccid" : "1300971499D9639C9C33DC5901307461"
				},{
					"videoTitle" : "测试2",
					"ccid" : "D953D9C8ADF01C6E9C33DC5901307461"
				},{
					"videoTitle" : "移动端-APP操作指南",
					"ccid" : "44FB6895C92F856A9C33DC5901307461"
				},{
					"videoTitle" : "移动端-我的-介绍",
					"ccid" : "FCE3C6B71454EE3A9C33DC5901307461"
				},{
					"videoTitle" : "移动端-课程功能页介绍",
					"ccid" : "7C7512DC3121DD079C33DC5901307461"
				},{
					"videoTitle" : "移动端-登录及中心页课程页",
					"ccid" : "D6B8FA9748A421379C33DC5901307461"
				},{
					"videoTitle" : "网页端-学习中心教程完整版",
					"ccid" : "1F98FB5D622FCADE9C33DC5901307461"
				},{
					"videoTitle" : "网页端-学习中心首页及移动APP",
					"ccid" : "BEEE9DAC920BCAF19C33DC5901307461"
				},{
					"videoTitle" : "网页端-我的课程",
					"ccid" : "DB8FE72BE6A067369C33DC5901307461"
				},{
					"videoTitle" : "网页端-课程学习页",
					"ccid" : "0F7AC0C2DB150F6A9C33DC5901307461"
				},{
					"videoTitle" : "网页端-我的笔记 问答 交流",
					"ccid" : "BDF625852E6385679C33DC5901307461"
				}]
				
				this.$el.html(this.template({
					"helpVideoDate" : CAICUI.render.helpVideoDate
				}));
				window.CAICUI.myScroll = CAICUI.iGlobal.iScroll('body #wrapper');
				//this.on_cc_player_init('313A5C7994F57292','cc_313A5C7994F57292');
			},
			openFeedbackPop : function(){
				CAICUI.render.feedbackType = ["视频课程问题","学习中心问题","试题报错","新版建议","学员服务"]
				var feedbackTemp = _.template($('#template-feedback').html());
				$('body').append(feedbackTemp({
					"feedbackType" : CAICUI.render.feedbackType
				}));
				CAICUI.Request.ajax({
					'server' : 'member',
					'data' : {
						'token' : CAICUI.User.token
					},
					done : function(data){
						if (data.state == 'success') {
							CAICUI.render.member = data.data;
							$('body .pop-input-tel').val(CAICUI.render.member.mobile ? CAICUI.render.member.mobile : CAICUI.render.member.email);
						} else {
							console.log('member:'+data)
						}
					},
					fail : function(data){
						console.log('member:'+data)
					}
				});
				this.feedbackAnimate('.pop-html');
				this.feedbackEvent();
			},
			feedbackAnimate : function(obj){
				$(obj).animate({
					"opacity" : 1
				}, 1000)
			},
			feedbackEvent : function(){
				var feedback = $('#help-feedback-pop');
				if(feedback){
					feedback.on('click','.pop-radio-label',function(){
						var that = $(this);
						that.siblings().removeClass('active');
						that.addClass('active');
					});
					feedback.on('click','.pop-button-confirm',function(){
						var labelIndex = $('.pop-radio-label.active').index();
						var feedbackTitle = CAICUI.render.feedbackType[labelIndex];
						var feedbackContent = $('.pop-textarea').val();
						if(!feedbackContent){
							layer.msg('Sorry~ 请输入内容！', function() {});
							return;
						}
						var feedbackTel = $('.pop-input-tel').val();
						if(!feedbackTel){
							layer.msg('Sorry~ 请输入联系方式！', function() {});
							return;
						}
						var platform = (navigator.platform) == 'MacIntel' ? '苹果' : '';
						var userAgentArr = navigator.userAgent.split(' ');
						var userAgentArrLength = userAgentArr.length;
						var userAgent = userAgentArr[userAgentArr.length-2].split('/')[0]+'-'+userAgentArr[userAgentArr.length-1].split('/')[0];
						CAICUI.render.$this.feedbackAjax({
							"memberId" : CAICUI.User.memberId,
							"memberName" : CAICUI.User.nickname,
							"cmptType" : feedbackTitle,
							"cmptContent" : feedbackContent,
							"contactWay" : feedbackTel,
							"deviceDesc" : platform+" "+userAgent
						})
					});
					feedback.on('click','.pop-button-cancel',function(){
						feedback.remove();
						feedback.off();
					});
				}
			},
			feedbackAjax : function(data){
				CAICUI.Request.ajax({
					'server' : 'addLMG',
					'data' : data,
					done : function(data){
						$('.pop-html').remove();
						layer.msg('提交成功', {
						  icon: 1,
						  time: 1000
						}, function(){
						  $('#help-feedback-pop').remove();
							$('#help-feedback-pop').off();
						});   
					},
					fail : function(data){
						layer.msg('Sorry~ ', function() {});
					}
				})
			},
			openVideo : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				var thatIndex = that.parent().index();
				var thatCCID = that.attr('data-ccid');
				var videoTitle = that.attr('data-videoTitle');
				CAICUI.render.helpVideoCcid = thatCCID;
				this.addAnimate(CAICUI.render.helpVideoDate[thatIndex].videoTitle,'template-help-video',function(){
					//$('#studycenter-video-main').append('<script src="http://union.bokecc.com/player?vid='+CAICUI.render.helpVideoDate[thatIndex].ccid+'&siteid='+CAICUI.render.helpVideoDate[thatIndex].ccid+'&autoStart=true&playerid='+CAICUI.render.helpVideoDate[thatIndex].ccid+'&playertype=1" type="text/javascript"></script>');
					$('body #studycenter-video-main').append('<iframe allowtransparency="true" width="100%" height="100%" scrolling="no" frameborder="0" src="player.html?ccid='+thatCCID+'"></iframe>')
				});
			},
		  addAnimate : function(title,templateName,callback){
	    	var windowWidth = $(window).width();
	    	var windowHeight = $(window).height();
	    	var helpVideoTemp = _.template($('#'+templateName).html());
	    	$('body').append(helpVideoTemp({
	    		"title" : title
	    	}));
	    	$('.studycenter-video-close').on('click',function(){
	    		CAICUI.render.$this.removeAnimate();
	    	})
	    	$('#animate').animate({
	    		'height' : windowHeight,
	    		'top' : '0'
	    	},300,function(){
	    		if(callback){callback();};
	    	})
		  },
		  removeAnimate : function(callback){
				$('#animate').animate({
					'height' : '0',
					'top' : '50%'
				},300,function(){
					$('#animate').remove();
					if(callback){callback();};
				})
			},
			studycenterVideoClose : function(){
				this.removeAnimate();
			}
		});
		return Studycenter;
	});





