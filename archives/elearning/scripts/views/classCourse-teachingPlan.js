;define([
	'jquery',
	'underscore',
	'backbone'
	],function($, _, Backbone){
		'use strict';
		var Studycenter = Backbone.View.extend({
			el : 'body #layout',
			template : _.template($('#template-teachingPlan-overview').html()),
			events : {
				'click .teachingPlan-overview-return' : 'return'
			},
			render : function(){
				CAICUI.render.this = this;
				CAICUI.render.this.teachingPlanAjax(function(data){
					CAICUI.render.this.$el.append(CAICUI.render.this.template({
						"teachingPlan" : data.data[0].chapters
						// "teachingPlan" : data.teachingProgram
					}));
					window.CAICUI.myScroller = CAICUI.iGlobal.iScroll('body #wrapper');
				});
			},
			teachingPlanAjax : function(callback){
				CAICUI.Request.ajax({
					'server' : 'node-teachingProgram',
					'data' : {
						'courseId' : 'courseId'
					},
					done : function(data){
						if(callback){
							callback(data);
						}
					}
				});
			},
			return : function(e){
				this.$el.find('.teachingPlan-overview').remove();
				window.location.hash = "#classCourseStudy/8a2a5fa451c0c3ad0151c2950ccf0080"
			}
		});
		return Studycenter;
	});