;define([
	'jquery',
	'underscore',
	'backbone'
	],function($, _, Backbone){
		'use strict';
		var Studycenter = Backbone.View.extend({
			tagName : 'ul',
			className : 'exam-list',
			template : _.template($('#template-exam-list').html()),
			events : {
			},
			nav : '',
			render : function(data){
				this.$el.html(this.template(data));
				return this;
			},
			layout : function(){
			}
		});
		return Studycenter;
	});