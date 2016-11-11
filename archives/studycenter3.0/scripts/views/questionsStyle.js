;define([
	'jquery',
	'underscore',
	'backbone'
	],function($, _, Backbone){
		'use strict';
		var Studycenter = Backbone.View.extend({
			el : 'body',
			template : _.template($('#template-questionsStyle').html()),
			events : {
				'click .questions-card-button' : 'toggleCards',
				'click .questions-exit' : 'exit'
			},
			render : function(courseId){
				this.$el.append(this.template());
				
				
			}
		});
		return Studycenter;
	});