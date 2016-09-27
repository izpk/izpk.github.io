;define([
	'jquery',
	'underscore',
	'backbone'
	],function($, _, Backbone){
		'use strict';
		var Studycenter = Backbone.View.extend({
			tagName : 'div',
			className : 'message-box',
			template : _.template($('#template-message').html()),
			events : {
				
			},
			type : '',
			render : function(type){
				this.$el.html(this.template({
					type : type
				}));
				return this;
			}
		});
		return Studycenter;
	});