;define([
	'jquery',
	'underscore',
	'backbone',
	'views/classCourse-studyIn',
	'views/classCourse-notStart',
	'views/classCourse-activated'
	],function($, _, Backbone, ClassCourseStudyIn, ClassCourseNotStart, ClassCourseActivated){
		'use strict';
		var Studycenter = Backbone.View.extend({
			el : 'body #right',
			template : _.template($('#template-myCourse').html()),
			events : {
				
			},
			render : function(courseStatus){
				var templateHtml = $('#template-course').html();
				var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
					"courseType" : 1,
					"courseStatus" : courseStatus
				});
				this.$el.html(addHtml);
				var courseRender = '';
				switch(courseStatus){
					case 'activated':
						courseRender = new ClassCourseActivated();
						break;
					case 'notStart':
						courseRender = new ClassCourseNotStart();
						break;
					case 'studyIn':
					default:
						courseRender = new ClassCourseStudyIn();
						break;
				}
				$('body #courses').append(courseRender.render(courseStatus).el)
				// this.$el.html(this.template());
				
			}
		});
		return Studycenter;
	});