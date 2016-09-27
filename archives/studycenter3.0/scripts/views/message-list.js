;define([
	'jquery',
	'underscore',
	'backbone'
	],function($, _, Backbone){
		'use strict';
		var Studycenter = Backbone.View.extend({
			// tagName : 'ul',
			id : 'wrapper-message-list',
			className : 'wrapper',
			template : _.template($('#template-message-list').html()),
			events : {
				
			},
			type : '',
			render : function(data){
				this.$el.html(this.template(data));
				return this;
			}
		});
		return Studycenter;
	});