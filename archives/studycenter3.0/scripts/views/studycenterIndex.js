;define([
	'jquery',
	'underscore',
	'backbone'
	],function($, _, Backbone){
		'use strict';
		var Studycenter = Backbone.View.extend({
			el : 'body #right',
			template : _.template($('#template-studycenterIndex').html()),
			events : {
				"mouseenter .studyin-content-subjects" : "subjectEnter",
				"mouseleave .studyin-content-subjects" : "subjectLeave",
				'click .contarner-start' : 'list',
				'click .index-course-a' : 'changeNav'
			},
			render : function(){
				CAICUI.render.$this = this;
				this.mycount();
				this.capabilityAssessment();
				this.learningcourse();
				this.slideList();
				this.loginloglist();
				this.getExamDate();
				CAICUI.render.$this.$el.html(CAICUI.render.$this.template({
					'data' : {
						'mycount' : '',
						'capabilityAssessment' : '',
						'RecentCourse' : '',
						'slideList' : '',
						'loginloglist' : '',
						'getExamDate' : '',
						'experience' : ''
					}
				}));
				window.CAICUI.myScroll = CAICUI.iGlobal.iScroll('body #wrapper');
			},
			mycount : function(){
				console.log(111)
				CAICUI.Request.ajax({
					'server' : 'mycount',
					'data' : {
						'token' : CAICUI.User.token
					},
					done : function(data){
						console.log(1)
						CAICUI.render.$this.$mycount = data.data;
						$('body .nodeNum').html(data.data.nodeNum);
						$('body .acNum').html(data.data.questionNum + data.data.discuss);
					},
					fail : function(data){
						CAICUI.render.$this.$mycount = {};
					}
				})
			},
			capabilityAssessment : function(){
				CAICUI.Request.ajax({
					'server' : 'capabilityAssessment',
					'data' : {
						'token' : CAICUI.User.token,
						'id' : CAICUI.User.memberId
					},
					done : function(data){
						CAICUI.render.serverNum ++;
						CAICUI.render.$this.$capabilityAssessment = data.data[0];
						var examNum = data.data[0] ? data.data[0].total : '0';
						$('body .examNum').html(examNum);
					},
					fail : function(data){
						CAICUI.render.$this.$capabilityAssessment = {};
					}
				})
			},
			learningcourse : function(){
				CAICUI.Request.ajax({
					'server' : 'learningcourse',
					'data' : {
						'token' : CAICUI.User.token,
						'pageNo' : 1,
						'pageSize' : CAICUI.defaultPageSize
					},
					done : function(data){
						CAICUI.CACHE.Learningcourse = data.data.courselist;
						CAICUI.CACHE.RecentCourse = CAICUI.render.$this.courselistFilter(data.data.courselist);
						var templateHtml = $('#template-studycenterIndex-courseList').html();
						var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,CAICUI.CACHE.RecentCourse);
						$('body .index-course-ul').html(addHtml);
						$('body .index-course-li').each(function(index){
							CAICUI.iGlobal.canvasRound('progress-round-' + index);
						})
						window.CAICUI.myScroll = CAICUI.iGlobal.iScroll('body #wrapper');
					},
					fail : function(data){
						CAICUI.CACHE.Learningcourse = {};
						CAICUI.CACHE.RecentCourse = {};
					}
				})
			},
			slideList : function(){
				CAICUI.Request.ajax({
					'server' : 'slide-list',
					'data' : {
						'tag' : '0',
						'valid' : 'true',
						'count' : '4'
					},
					done : function(data){
						CAICUI.render.$this.$slideList = data.data;
						var templateHtml = $('#template-studycenterIndex-activityList').html();
						var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
							"slideList" : data.data
						});
						$('body .index-activity-ul').html(addHtml);
						window.CAICUI.myScroll = CAICUI.iGlobal.iScroll('body #wrapper');
					},
					fail : function(data){
						CAICUI.render.$this.$slideList = {};
					}
				})
			},
			loginloglist : function(){ 
				CAICUI.Request.ajax({
					'server' : 'loginloglist',
					'data' : {
						'memberid' : CAICUI.User.memberId,
						'pageNo' : 1,
						'pageSize' : 1
					},
					done : function(data){
						CAICUI.render.$this.$loginloglist = data.data[0];
						var loginloglist = data.data[0] ? CAICUI.iGlobal.stringData(data.data[0].login_time/1000) : "第一次登陆";

						$('body .loginloglist').html(loginloglist);
					},
					fail : function(data){
						CAICUI.render.$this.$loginloglist = {};
					}
				})
			},
			getExamDate : function(){
				CAICUI.Request.ajax({
					'server' : 'getExamDate',
					'data' : {
						'memberId' : CAICUI.User.memberId
					},
					done : function(data){
						CAICUI.render.$this.$getExamDate = data.data[0];
						var data = data.data[0];
						var getExamDate = data ? data.categorySign +' '+ CAICUI.iGlobal.getDate(data.examinationDate) : "暂无考试";
						$('body .getExamDate').html(getExamDate);
					},
					fail : function(data){
						CAICUI.render.$this.$getExamDate = {};
					}
				})
			},
			changeNav : function(){
				CAICUI.isNav = true;
			},
			courselistFilter : function(stooges){
				var newCourseList = [];
				if(stooges && stooges.length){
					var courselistFilter = _.chain(stooges)
						.uniq('courseId')
						.pick(function(stooges){return stooges.lastTaskdate})
					 	.sortBy('lastTaskdate')
					 	.reverse()
					  .value();
					for(var i = 0; i< courselistFilter.length; i++){
						if(i>2){
							break;
						}
						if(courselistFilter[i] && courselistFilter[i].lastTaskdate){
							newCourseList.push(courselistFilter[i]);
						}
					}
				}
				console.log(newCourseList)
				return {
					"RecentCourse" : newCourseList
				};
			},
			subjectEnter : function(e) {
				var current = e.currentTarget;
				var oSubject = $(current);
				var oIndex = oSubject.index();
				var	oMask = oSubject.find(".subject-lf").find(".subject-mask");
				var oSubjectRt = oSubject.find(".subject-rt");
				oMask.stop(true,false).animate({
					"left" : "0"
				});
				var oCurrentSubject= {
					"mask" : oMask,
					"rt" : oSubjectRt
				};
				return oCurrentSubject;
			},
			subjectLeave : function(e) {
				var oMaskLeave = this.subjectEnter(e)["mask"];
				oMaskLeave.stop(true,false).animate({
					"left" : "-160px"
				});
			},
		});
		return Studycenter;
	});