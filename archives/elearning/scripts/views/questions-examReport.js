;define([
	'jquery',
	'underscore',
	'backbone',
	'circle'
	],function($, _, Backbone){
		'use strict';
		var Studycenter = Backbone.View.extend({
			el : 'body #right',
			template : _.template($('#template-examReport').html()),
			events : {
				'click .tuichu' : 'backRight',
				'click .examReport-back-left' : 'backLeft',
				'click .examReport-back-right' : 'backRight'
			},
			render : function(knowledgePointId, examenNum){
				CAICUI.render.knowledgePointId = knowledgePointId;
				CAICUI.render.examenNum = examenNum;
				var that = this;
				this.randerExamReport(function(examReportData){
					var examReport = examReportData.examReport;
					CAICUI.render.courseId = examReport.courseId;
					CAICUI.render.chapterId = examReport.chapterId;
					CAICUI.render.taskId = examReport.taskId;

					

					var addHtml = CAICUI.iGlobal.getTemplate($('#template-examReport').html(),{
						"examReportData" : examReport
					});
					that.$el.html(addHtml);
					window.CAICUI.myScroll = CAICUI.iGlobal.iScroll('body #wrapper');
					$('.circle').circleProgress({
					    size:156,
					    startAngle: Math.PI/2,
					    value: examReport.exercise.score/100,
					    lineCap: 'round',
					    emptyFill: 'rgba(0, 0, 0, 0)',
					}).on('circle-animation-progress', function(event, progress,stepValue) {
					    $(this).find('strong').html(parseInt(100 * stepValue));
					});
				})
				
			},
			randerExamReport : function(callback){
				CAICUI.Request.ajax({
	      	'server' : 'node-examReport',
	      	'data' : {
	      		'memberId' : CAICUI.User.memberId,
	      		'knowledgePointId': CAICUI.render.knowledgePointId,
	      		'examenNum' : CAICUI.render.examenNum
	      	},
	        done : function(data) {
	          if(callback){
							callback(data);
						}
	        },
	        fail : function(data){
          	console.log(data)
          }
        });
			},
			closePage : function(){
				window.history.go(-1); 
			},
			backLeft : function(){ // 查看解析
				if(CAICUI.render.courseId && CAICUI.render.courseId && CAICUI.render.courseId){
					var link = '#video/'+CAICUI.render.courseId+'/'+CAICUI.render.chapterId+'/'+CAICUI.render.taskId+'?return_link=classCourseStudy/'+ CAICUI.render.courseId+'&return_hash=on';
					CAICUI.render.viewResolution = true;
					window.location.hash = link;

				}
			},
			backRight : function(){ // 返回学习
				if(CAICUI.render.courseId){
					var link = '#classCourseStudy/'+CAICUI.render.courseId
					window.location.hash = link;
				}
			}
		});
		return Studycenter;
	});