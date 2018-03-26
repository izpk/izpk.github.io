;define([
	'jquery',
	'underscore',
	'backbone',
	'views/courseStudyIn',
	'views/courseNotActivated',
	'views/courseActivated'
	],function($, _, Backbone, StudyIn, NotActivated, Activated){
		'use strict';
		var Studycenter = Backbone.View.extend({
			el : 'body #right',
			template : _.template($('#template-myCourse').html()),
			events : {
				
			},
			render : function(courseStatus){
				var templateHtml = $('#template-course').html();
				var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,{
					"courseType" : 0,
					"courseStatus" : courseStatus
				});
				this.$el.html(addHtml);
				var courseRender = '';
				switch(courseStatus){
					case 'notActivated':
						courseRender = new NotActivated();
						break;
					case 'activated':
						courseRender = new Activated();
						break;
					case 'studyIn':
					default:
						courseRender = new StudyIn();
						break;
				}
				$('body #courses').append(courseRender.render().el)
				// this.$el.html(this.template());
				
			}
		});
		return Studycenter;
	});