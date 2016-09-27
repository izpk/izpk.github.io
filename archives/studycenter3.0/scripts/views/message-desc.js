;define([
	'jquery',
	'underscore',
	'backbone'
	],function($, _, Backbone){
		'use strict';
		var Studycenter = Backbone.View.extend({
			tagName : 'div',
			className : 'message-right-box',
			template : _.template($('#template-message-desc').html()),
			events : {
				
			},
			type : '',
			render : function(data){
				this.$el.html(this.template({
					'element' : data
				}));
				return this;
			}
		});
		return Studycenter;
	});