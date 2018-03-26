;define([
	'jquery',
	'underscore',
	'backbone',
	'layer'
	],function($, _, Backbone, Layer){
		'use strict';
		var Studycenter = Backbone.View.extend({
			el : 'body',
			template : _.template($('#template-live').html()),
			events : {
				'click .js-live-gift' : 'liveGift',
				'click .js-live-close' : 'liveClose'
			},
			type : '',
			render : function(opencourseid, roomid, userid, viewertoken){
				CAICUI.render.this = this;
				
				CAICUI.render.openCourseId = opencourseid;
				CAICUI.render.roomid = roomid;
				CAICUI.render.userid = userid;
				CAICUI.render.viewertoken = viewertoken;

				CAICUI.render.isToday = false;
				CAICUI.render.isLiveTime = false;
				CAICUI.render.isLiveTimeBefore = false;
				CAICUI.render.isLiveTimeAfter = false;

				CAICUI.render.isBuyLive = false;
				CAICUI.render.freeWatchTotalTime = 900;
				CAICUI.render.freeWatchTime = 0;
				CAICUI.render.freeTotalTime = 0;
				CAICUI.render.freeWatchInterval = '';
				CAICUI.render.freeWatchTimingInterval = '';
				CAICUI.render.endTimeInterval = '';

				CAICUI.render.giftId = 0;

				CAICUI.render.liveGiftNumber = 1;
				CAICUI.render.liveGiftPosition = [105,205,305,405]
				CAICUI.render.liveGiftAnimaterTime = 5;
				CAICUI.render.liveGiftAnimaterTimer = '';

				CAICUI.render.ajaxCount = 0;
				CAICUI.render.ajaxTotalNum = 3;
				CAICUI.render.ajaxInterval = '';

				CAICUI.render.isLiveGiftClick = true;
				CAICUI.render.giftTotal = $.cookie('liveGift'+'-'+CAICUI.User.memberId+'-'+CAICUI.render.openCourseId) ? $.cookie('liveGift'+'-'+CAICUI.User.memberId+'-'+CAICUI.render.openCourseId) : 20;
				this.$el.html(this.template({
					title : '直播',
					giftTotal : CAICUI.render.giftTotal
				}));
				CAICUI.render.this.init();
				
			},
			init : function(){
				CAICUI.render.this.getappointmentlist(function(data){
					// if(CAICUI.render.isToday && CAICUI.render.isLiveTime){
					if(CAICUI.render.isLiveTime){
						CAICUI.render.this.includeopencoursegroup();
						CAICUI.render.this.memberbuycategorylist();
						CAICUI.render.this.memberbuylist();

						CAICUI.render.ajaxTimeout = setInterval(function(){
							if(CAICUI.render.ajaxCount === CAICUI.render.ajaxTotalNum){
								clearInterval(CAICUI.render.ajaxTimeout);
								CAICUI.render.isBuyLive = CAICUI.render.this.isBuyLiveAjax();
								if(CAICUI.render.isBuyLive){
									CAICUI.render.this.playLive();
								}else{
									CAICUI.render.this.getTotalTime(function(data){
										var isFreeTimePlayLive = true;
										
										var getTotalTime = 0;
										if(CAICUI.render.getTotalTime && CAICUI.render.getTotalTime.totalTime){
											getTotalTime = CAICUI.render.getTotalTime.totalTime
										}
										var localFreeWatchTime = $.cookie('freeWatchTime'+'-'+CAICUI.User.memberId+'-'+CAICUI.render.openCourseId) ? $.cookie('freeWatchTime'+'-'+CAICUI.User.memberId+'-'+CAICUI.render.openCourseId) : 0;

										if(getTotalTime < localFreeWatchTime){
											getTotalTime = localFreeWatchTime
										}
										if(getTotalTime >= CAICUI.render.freeWatchTotalTime){
											isFreeTimePlayLive = false;
										}
										CAICUI.render.freeWatchTime = getTotalTime;
										if(isFreeTimePlayLive){
											CAICUI.render.this.playLive();
										}else{
											// 免费时间用完
											CAICUI.render.this.stopLive();
										}
									});
								}
							}
						},500);
					}else{
						
						// '暂无直播'
						if(CAICUI.render.isLiveTimeBefore){
							$('body .studycenter-video-main').html('<p class="no-live-title">直播未开始</p>');
							$('body .js-live-close').show();
						}else if(CAICUI.render.isLiveTimeAfter){
							$('body .studycenter-video-main').html('<p class="no-live-title">直播已结束</p>');
							$('body .js-live-close').show();
						}else{
							CAICUI.render.this.getopencoursedetailAjax(function(data){
								CAICUI.render.this.isLiveTime(data.startTime,data.endTime);
								// CAICUI.render.isLiveTimeState = 0;
								if(CAICUI.render.isLiveTimeState < 1){
									CAICUI.render.this.appointmentAjax(function(data){
										// data.state = 'success'
										if(data.state == "success"){
											// CAICUI.render.this.openCourseTest = true;
											CAICUI.render.this.init();
											// $('body .studycenter-video-main').html('<p class="no-live-title">直播未开始</p>');
										}else{
											$('body .studycenter-video-main').html('<p class="no-live-title">'+data.msg+'</p>');
										}
										
									});
									
								}else{
									if(data.ccid){
										CAICUI.render.helpVideoCcid = data.ccid;
										$('body #studycenter-video-main').html('<div class="studycenter-video-main-iframebox"><iframe allowtransparency="true" width="100%" height="100%" scrolling="no" frameborder="0" src="player.html?ccid='+data.ccid+'"></iframe></div>')
									}else{
										$('body .studycenter-video-main').html('<p class="no-live-title">直播已结束</p>');
									}
								}
								$('body .js-live-close').show();
							});
						}
						
					}
				});
			},
			getopencoursedetailAjax : function(callback){
				CAICUI.Request.ajax({
					'server' : 'getopencoursedetail',
					'data' : {
						'openCourseId' : CAICUI.render.openCourseId
					},
					done : function(data){
						if(callback){callback(data.data[0])};
					},
					fail : function(data){
						$('body .studycenter-video-main').html('<p class="no-live-title">'+data.msg+'</p>');
						$('body .js-live-close').show();
					}
				})
			},
			appointmentAjax : function(callback){
				CAICUI.Request.ajax({
					'server' : 'appointment',
					'data' : {
						'memberId' : CAICUI.User.memberId,
						'openCourseId' : CAICUI.render.openCourseId
					},
					done : function(data){

						if(callback){callback(data)};
					},
					fail : function(data){
						if(callback){callback(data)};
					}
				})
			},
			getappointmentlist : function(callback){
				if(CAICUI.render.indexOpenCourse){
						var thisData = CAICUI.render.indexOpenCourse;
						CAICUI.render.isToday = CAICUI.render.this.isToday(thisData.startTime,thisData.endTime);
						if(CAICUI.render.isToday && CAICUI.render.openCourseId == thisData.id){
							CAICUI.render.indexOpenCourse = thisData;
							CAICUI.render.isLiveTime = CAICUI.render.this.isLiveTime(thisData.startTime,thisData.endTime);
						}
					if(callback){callback(CAICUI.render.indexOpenCourse)};
				}else{
					CAICUI.Request.ajax({
						'server' : 'getappointmentlist',
						'data' : {
							'memberId' : CAICUI.User.memberId
						},
						done : function(data){
							if(CAICUI.render.this.openCourseTest){
							}
							CAICUI.render.appointmentlist = data.data;
							if(data.data && data.data.length){

								for(var i=0;i<data.data.length;i++){
									var thisData = data.data[i];
									
									if(CAICUI.render.openCourseId == thisData.id){
										CAICUI.render.isToday = CAICUI.render.this.isToday(thisData.startTime,thisData.endTime);
										CAICUI.render.indexOpenCourse = thisData;

										CAICUI.render.isLiveTime = CAICUI.render.this.isLiveTime(thisData.startTime,thisData.endTime);
										
									}
								}
							}else{

							}
							if(callback){callback(CAICUI.render.indexOpenCourse)};
						},
						fail : function(data){
							CAICUI.render.indexOpenCourse = {};
						}
					})
				}
			},
			isToday : function(startTime, endTime){
				var nowYear = new Date().getFullYear();
				var nowMonth = new Date().getMonth();
				var nowDate = new Date().getDate();
				var startTimeYear = new Date(startTime).getFullYear();
				var startTimeMonth = new Date(startTime).getMonth();
				var startTimeDate = new Date(startTime).getDate();
				var endTimeYear = new Date(endTime).getFullYear();
				var endTimeMonth = new Date(endTime).getMonth();
				var endTimeDate = new Date(endTime).getDate();
				var isToday = false;

				console.log(nowYear+'-'+nowMonth+'-'+nowDate);
				console.log(startTimeYear+'-'+startTimeMonth+'-'+startTimeDate);
				console.log(endTimeYear+'-'+endTimeMonth+'-'+endTimeDate);

				if(nowYear === startTimeYear){
					if(nowMonth === startTimeMonth){
						if(nowDate === startTimeDate){
							isToday = true;
						}
					}
				}
				if(nowYear === endTimeYear){
					if(nowMonth === endTimeMonth){
						if(nowDate === endTimeDate){
							isToday = true;
						}
					}
				}
				return isToday;
			},
			isLiveTime : function(startTime, endTime){
				var isLiveTime = false;
				// if(CAICUI.render.indexOpenCourse){
					var time = new Date().getTime();
					if(startTime < time && time < endTime){
						isLiveTime = true;
						CAICUI.render.isLiveTimeState = 0;
					}
					
					if(time < startTime){
						CAICUI.render.isLiveTimeBefore = true;
						CAICUI.render.isLiveTimeState = -1;
					}
					if(endTime < time){
						CAICUI.render.isLiveTimeAfter = true;
						CAICUI.render.isLiveTimeState = 1;
					}
				// }
				return isLiveTime;
			},
			includeopencoursegroup : function(callback){
				CAICUI.Request.ajax({
					'server' : 'includeopencoursegroup',
					'data' : {
						'openCourseId' : CAICUI.render.openCourseId
					},
					done : function(data){
						CAICUI.render.ajaxCount++;
						if(data.data && data.data.length){
							if(parseInt(data.data[0].price) != 0){
								CAICUI.render.includeopencoursegroup = data.data[0];
							}else{
								CAICUI.render.isFreePlayLive = true;
							}
						}else{
							CAICUI.render.isFreePlayLive = true;
						}
						if(callback){callback()};
					},
					fail : function(data){

					}
				})
			},
			memberbuycategorylist : function(callback){
				CAICUI.Request.ajax({
					'server' : 'memberbuycategorylist',
					'data' : {
						'memberId' : CAICUI.User.memberId
					},
					done : function(data){
						CAICUI.render.ajaxCount++;
						CAICUI.render.memberbuycategorylist = data.data;
						if(callback){callback()};
					},
					fail : function(data){

					}
				})
			},
			memberbuylist : function(callback){
				CAICUI.Request.ajax({
					'server' : 'memberbuylist',
					'data' : {
						'memberId' : CAICUI.User.memberId
					},
					done : function(data){
						CAICUI.render.ajaxCount++;
						CAICUI.render.memberbuylist = data.data;
						if(callback){callback()};
					},
					fail : function(data){

					}
				})
			},
			settotaltime : function(callback){
				CAICUI.Request.ajax({
					'server' : 'settotaltime',
					'data' : {
						'openCourseId' : CAICUI.render.openCourseId,
						'memberId' : CAICUI.User.memberId,
						'totalTime' : CAICUI.render.freeWatchTime
					},
					done : function(data){
						CAICUI.render.settotaltime = data.data;
						if(callback){callback()};
					},
					fail : function(data){

					}
				})
			},
			getTotalTime : function(callback){
				CAICUI.Request.ajax({
					'server' : 'getTotalTime',
					'data' : {
						'openCourseId' : CAICUI.render.openCourseId,
						'memberId' : CAICUI.User.memberId
					},
					done : function(data){
						CAICUI.render.getTotalTime = data.data;
						if(callback){callback()};
					},
					fail : function(data){

					}
				})
			},
			setgift : function(callback){
				CAICUI.Request.ajax({
					'server' : 'setgift',
					'data' : {
						'openCourseId' : CAICUI.render.openCourseId,
						'memberId' : CAICUI.User.memberId,
						'giftId' : CAICUI.render.gift,
						'name' : CAICUI.render.member.nickName,
						'mobile' : CAICUI.render.member.mobile,
						'email' : CAICUI.render.member.email
					},
					done : function(data){
						if(callback){callback()};
					},
					fail : function(data){

					}
				})
			},
			payment : function(callback){
				CAICUI.Request.ajax({
					'server' : 'payment',
					'data' : {
						'token': CAICUI.User.token,
						'couponId': '', // 优惠券ID
						'courseGroupIds': CAICUI.render.includeopencoursegroup.id, // 商品ID
						'returnUrl': window.location.origin+'/studycenter/payCallback.html' // 回调地址
					},
					done : function(data){
						if(callback){callback(data.data)};
					},
					fail : function(data){

					}
				})
			},
			isBuyLiveAjax : function(){
				var isBuyLive = false;
				if(CAICUI.render.isFreePlayLive){
					isBuyLive = true;
				}else{
					for(var i=0;i<CAICUI.render.memberbuycategorylist.length;i++){
						var thisMemberbuycategorylist = CAICUI.render.memberbuycategorylist[i];
						console.log(thisMemberbuycategorylist.id+';'+CAICUI.render.indexOpenCourse.subjectId)
						if(thisMemberbuycategorylist.id == CAICUI.render.indexOpenCourse.subjectId){
							isBuyLive = true;
						}
					}
					for(var i=0;i<CAICUI.render.memberbuylist.length;i++){
						var thisMemberbuylist = CAICUI.render.memberbuylist[i];
						if(thisMemberbuylist.id === CAICUI.render.includeopencoursegroup.id){
							isBuyLive = true;
						}
					}
				}
				return isBuyLive;
			},
			playLive : function(){
				var iframeSrc = '';
				
				var liveRoomId = CAICUI.render.indexOpenCourse.liveRoomId;
				var liveManageId = CAICUI.render.indexOpenCourse.liveManageId;
				var viewername = '';
				var viewertoken = CAICUI.render.indexOpenCourse.liveRoomPassword;

				
				if(viewertoken){
					iframeSrc = 'https://view.csslcloud.net/api/view/login?';
					iframeSrc += 'roomid=' + CAICUI.render.indexOpenCourse.liveRoomId;
					iframeSrc += '&userid=' + CAICUI.render.indexOpenCourse.liveManageId;
					iframeSrc += '&autoLogin=' + 'true';
					if(CAICUI.User.nickname && CAICUI.User.nickname != ''){
						viewername = CAICUI.User.nickname;
						iframeSrc += '&viewername=' + CAICUI.User.nickname;
					}else{
						viewername = CAICUI.User.memberId;
						iframeSrc += '&viewername=' + CAICUI.User.memberId;
					}
					iframeSrc += '&viewertoken=' + viewertoken
					// if(CAICUI.render.indexOpenCourse.liveRoomPassword){
					// 	iframeSrc += '&viewertoken=' + CAICUI.render.indexOpenCourse.liveRoomPassword;
					// }else{
					// 	iframeSrc += '&viewertoken=0';
					// }
				}else{
					if ($.cookie('isDemo') && $.cookie('isDemo') == 'false'){
						iframeSrc = window.zbgedu.origin+'/liveIframe.html?';
					}else{
						iframeSrc = 'http://demo.caicui.com/studycenter/liveIframe.html?';
					}
					
					
					iframeSrc += 'roomid=' + CAICUI.render.indexOpenCourse.liveRoomId;
					iframeSrc += '&userid=' + CAICUI.render.indexOpenCourse.liveManageId;
				}
				

				console.log(iframeSrc)
				// iframeSrc = 'https://view.csslcloud.net/api/view/login?roomid=5F53B9A5D33EAEB19C33DC5901307461&userid=CB735BE8334BC857&autoLogin=true&viewername=ceshi&viewertoken=cmapass18';
				
				$('body #studycenter-video-main').html('<iframe id="live-iframe" class="live-iframe" allowtransparency="true" width="100%" height="100%" scrolling="no" frameborder="0" src="'+iframeSrc+'" ></iframe>');
				// $('body #studycenter-video-main').html('<iframe id="live-iframe" class="live-iframe" allowtransparency="true" width="100%" height="100%" scrolling="no" frameborder="0" src="'+iframeSrc+'" ></iframe>');
				document.getElementById('live-iframe').onload=function(){
					if(CAICUI.render.isLiveTime){
						$('body .live-gift-giving').show();
						CAICUI.render.liveGiftAnimaterTimer = setInterval(function(){
							var liveGiftShow = $('body #live-gift-show-content .live-gift-show');
							if(liveGiftShow && liveGiftShow.length){
								var removeLiveGiftIndex = [];
								for (var i = 0; i < liveGiftShow.length; i++) {
									var thatLiveGiftShow = liveGiftShow.eq(i);
									var thatTime = parseInt(thatLiveGiftShow.attr('data-time'));
									thatTime--;
									if(thatTime){
										thatLiveGiftShow.attr('data-time',thatTime);
									}else{
										removeLiveGiftIndex.push(i);
									}
								}
								for(var i=0; i<removeLiveGiftIndex.length;i++){
									var thatIndex = removeLiveGiftIndex[i]
									liveGiftShow.eq(thatIndex).animate({
										"opacity" : "0"
									},500,function(){
										liveGiftShow.eq(thatIndex).remove();
										var newLiveGiftShow = $('body #live-gift-show-content .live-gift-show');
										for (var j = 0; j < newLiveGiftShow.length; j++) {
											var index = newLiveGiftShow.length- 1 - j;
											var thatNewLiveGiftShow = newLiveGiftShow.eq(j);
											thatNewLiveGiftShow.animate({'bottom': CAICUI.render.liveGiftPosition[index]},500);
										}
										
									});
								}
							}
						},1000);
					}
					$('body .js-live-close').show();
					CAICUI.render.this.timerLive();
					
				};
			},
			stopLive : function(){
				$('body #live-iframe').remove();
				$('body .live-gift-giving').hide();
				clearInterval(CAICUI.render.liveGiftAnimaterTimer);
				$('body .js-live-close').show();
				this.payLivePop();
			},
			payLivePop : function(){
				var templateHtml = $('#template-live-pay').html();
				var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
					openCourse : CAICUI.render.indexOpenCourse,
					price : CAICUI.render.includeopencoursegroup.price
				});
				$('body #studycenter-video-main').html(addHtml);
				this.payment(function(data){
					// var alipayurl = new Image();
					// alipayurl.src = data.alipayurl;
					// document.getElementById('live-pay-QRcode').appendChild(alipayurl);

					//http://localhost:3000/payCallback.html

					$('body .live-pay-QRcode').html('<iframe id="live-pay-QRcode-iframe" class="live-pay-QRcode-iframe" src="'+data.alipayurl+'" width="100%" height="100%" frameborder="0"></iframe>');
					// $('body .live-pay-QRcode').html('<iframe id="live-pay-QRcode-iframe" class="live-pay-QRcode-iframe" src="http://localhost:3000/payCallback.html" width="100%" height="100%" frameborder="0"></iframe>');

					document.getElementById('live-pay-QRcode-iframe').onload = function(){
						if(document.getElementById('live-pay-QRcode-iframe').contentWindow.document.getElementById('payCallback').innerHTML){
							console.log(document.getElementById('live-pay-QRcode-iframe').contentWindow.document.getElementById('payCallback').innerHTML);
							CAICUI.render.this.render(CAICUI.render.openCourseId);
						}
					}

				});
			},

			timerLive : function(){
				if(CAICUI.render.isLiveTime){
					if(CAICUI.render.isBuyLive){
						CAICUI.render.endTimeInterval = setInterval(function(){
							var newDate = new Date().getTime();
							if(CAICUI.render.indexOpenCourse.endTime < newDate){
								CAICUI.Request.ajax({
									'server' : 'getappointmentlist',
									'data' : {
										'memberId' : CAICUI.User.memberId
									},
									done : function(data){
										var thisData = '';
										if(data.data && data.data.length){
											var hasData = '';
											for(var i=0;i<data.data.length;i++){
												thisData = data.data[i];
												if(CAICUI.render.openCourseId == thisData.id){
													hasData = thisData;
												}
											}
											if(hasData){
												var newDate = new Date().getTime();
												if(hasData.endTime < newDate){
													clearInterval(CAICUI.render.endTimeInterval);
													$('body .studycenter-video-main').html('<p class="no-live-title">直播已结束</p>');
													$('body .live-gift-giving').hide();
													clearInterval(CAICUI.render.liveGiftAnimaterTimer);
												}else{
													CAICUI.render.indexOpenCourse = thisData;
												}
											}else{
												clearInterval(CAICUI.render.endTimeInterval);
												$('body .studycenter-video-main').html('<p class="no-live-title">直播已结束</p>');
												$('body .live-gift-giving').hide();
												clearInterval(CAICUI.render.liveGiftAnimaterTimer);
											}
										}else{
											clearInterval(CAICUI.render.endTimeInterval);
											$('body .studycenter-video-main').html('<p class="no-live-title">直播已结束</p>');
											$('body .live-gift-giving').hide();
											clearInterval(CAICUI.render.liveGiftAnimaterTimer);
										}
									},
									fail : function(data){

										CAICUI.render.indexOpenCourse = {};
									}
								});


								
							}
						},120000);
					}else{
						CAICUI.render.freeWatchTimingInterval = setInterval(function(){
							CAICUI.render.freeWatchTime++;
							
							if(CAICUI.render.freeWatchTime <= CAICUI.render.freeWatchTotalTime){
								$.cookie('freeWatchTime'+'-'+CAICUI.User.memberId+'-'+CAICUI.render.openCourseId, CAICUI.render.freeWatchTime, {
									path: '/',
									expires: 36500
								});
							}else{
								// 免费时间已用完
								clearInterval(CAICUI.render.freeWatchInterval);
								CAICUI.render.this.settotaltime();

								clearInterval(CAICUI.render.freeWatchTimingInterval);
								CAICUI.render.this.stopLive();
							}
						},1000);

						CAICUI.render.freeWatchInterval = setInterval(function(){
							// console.log(CAICUI.render.freeWatchTime)
							CAICUI.render.this.settotaltime();
						},120000);
					}
				}
				


			},

			liveGift : function(e){
				if(CAICUI.render.isLiveGiftClick){
					CAICUI.render.isLiveGiftClick = false;
					var that = CAICUI.iGlobal.getThat(e);
					CAICUI.render.liveGiftIndex = that.attr('data-index');


					CAICUI.render.gift = that.attr('data-gift');
					CAICUI.render.giftTotal = parseInt($.cookie('liveGift'+'-'+CAICUI.User.memberId+'-'+CAICUI.render.openCourseId) ? $.cookie('liveGift'+'-'+CAICUI.User.memberId+'-'+CAICUI.render.openCourseId) : 20);
					if(CAICUI.render.giftTotal === 0){
						CAICUI.render.isLiveGiftClick = true;
						layer.msg('Sorry~您没有金币了！', function() {});
					}else if(CAICUI.render.giftTotal < CAICUI.render.gift){
						CAICUI.render.isLiveGiftClick = true;
						layer.msg('Sorry~您的金币不足！', function() {});
					}else{

						CAICUI.Request.ajax({
							'server' : 'member',
							'data' : {
								'token' : CAICUI.User.token
							},
							done : function(data){
								if (data.state == 'success') {
									CAICUI.render.member = data.data;

									CAICUI.render.this.setgift(function(){
										CAICUI.render.isLiveGiftClick = true;
										CAICUI.render.giftLave = parseInt(CAICUI.render.giftTotal)-parseInt(CAICUI.render.gift);
										$('body .live-gift-Total-span').text('X '+CAICUI.render.giftLave);
										$.cookie('liveGift'+'-'+CAICUI.User.memberId+'-'+CAICUI.render.openCourseId,CAICUI.render.giftLave);

										CAICUI.render.this.addLiveGiftAnimater();
									});
								} else {
									console.log('member:'+data);
								}
							},
							fail : function(data){
								console.log('member:'+data);
							}
						});
						
					}
				}else{
					layer.msg('Sorry~请稍候再赠送！', function() {});
				}
			},
			addLiveGiftAnimater : function(){
				var liveGiftShowContent = $('body #live-gift-show-content');
				var liveGiftShow = liveGiftShowContent.find('.live-gift-show');

				var isAddLiveGiftAnimater = true;
				if(liveGiftShow && liveGiftShow.length){
					for (var i = 0; i < liveGiftShow.length; i++) {
						var thatLiveGiftShow = liveGiftShow.eq(i);
						var thatLiveGiftShowId = thatLiveGiftShow.attr('data-id');
						if(thatLiveGiftShowId == CAICUI.render.liveGiftIndex){
							isAddLiveGiftAnimater = false;
							CAICUI.render.liveGiftNumber = parseInt(thatLiveGiftShow.attr('data-number'));

							var number = CAICUI.render.liveGiftNumber+1;
							thatLiveGiftShow.attr('data-number', number);
							thatLiveGiftShow.attr('data-time', CAICUI.render.liveGiftAnimaterTime);
							thatLiveGiftShow.find('.live-gift-show-span').text('X '+number);
						}
					}
				}
				if(isAddLiveGiftAnimater){
					
					CAICUI.render.liveGiftNumber = 1;
					var templateHtml = $('#template-live-gift').html();
					var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
						liveGiftTime : CAICUI.render.liveGiftAnimaterTime,
						liveGiftIndex : CAICUI.render.liveGiftIndex,
						liveGiftNumber : CAICUI.render.liveGiftNumber
					});
					liveGiftShowContent.append(addHtml);
					liveGiftShow.each(function(index){
						var thatLiveGiftShow = liveGiftShow.eq(index);
						var thatBottom = parseInt(thatLiveGiftShow.css('bottom'));
						thatLiveGiftShow.css({
							"bottom" : thatBottom + 100
						},500);
					});
					// for (var j = 0; j < liveGiftShow.length; j++) {
					// 	var thatLiveGiftShow = liveGiftShow.eq(j);
					// 	var thatBottom = parseInt(thatLiveGiftShow.css('bottom'));
					// 	thatLiveGiftShow.css({
					// 		"bottom" : thatBottom + 100
					// 	},500)

					// }
					$('body #live-gift-show-'+CAICUI.render.liveGiftIndex).animate({
						"opacity" : "1",
						"bottom" : CAICUI.render.liveGiftPosition[0]
					},500);
				}
				
					// CAICUI.render.liveGiftAnimaterTimer = setInterval(function(){
					// 	var liveGiftShow = liveGiftShowContent.find('.live-gift-show');
					// 	if(liveGiftShow && liveGiftShow.length){
					// 		for (var i = 0; i < liveGiftShow.length; i++) {
					// 			var thatLiveGiftShow = liveGiftShow.eq(i);
					// 			var thatTime = parseInt(thatLiveGiftShow.attr('data-time'));
					// 			thatTime--;
					// 			if(thatTime){
					// 				thatLiveGiftShow.attr('data-time',thatTime)
					// 			}else{
					// 				thatLiveGiftShow.animate({
					// 					"opacity" : "0"
					// 				},500,function(){
					// 					thatLiveGiftShow.remove();
					// 					var newLiveGiftShow = liveGiftShowContent.find('.live-gift-show');
					// 					for (var j = 0; j < newLiveGiftShow.length; j++) {
					// 						var thatNewLiveGiftShow = newLiveGiftShow.eq(j);
					// 						thatNewLiveGiftShow.css('bottom', CAICUI.render.liveGiftPosition[j])
					// 					}
										
					// 				})
					// 			}
					// 		}
					// 	}else{
					// 		clearInterval(CAICUI.render.liveGiftAnimaterTimer);
					// 	}
						
					// },1000)
				// $('#animate').animate({
				//   'height' : windowHeight,
				//   'top' : '0'
				// },300,function(){
				//   if(callback){callback();};
				// })
			},
			liveClose : function(){
				var returnLink = CAICUI.iGlobal.getUrlPara('return_link');
				if(returnLink){
					var substr = returnLink.substr(0,1);
					if(substr == "#"){
						window.location.hash = returnLink;
					}else{
						window.location.href = returnLink;
					}
				}else{
					window.location.hash = '#studycenterIndex';
				}
				
				// var from = CAICUI.iGlobal.getUrlPara('from');
				// if(returnLink){
				// 	if(from == "0"){
				// 		window.location.hash = '#'+returnLink;
				// 	}else{
				// 		window.location.href = returnLink;
				// 	}
				// }else{
				// 	window.location.hash = '#studycenterIndex';
				// }
				
				
			}
		});
		return Studycenter;
	});