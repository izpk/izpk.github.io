;define([
	'jquery',
	'underscore',
	'backbone'
	],function($, _, Backbone){
		'use strict';
		var Studycenter = Backbone.View.extend({
			tagName : 'div',
			className : 'node-list',
			template : _.template($('#template-node-list').html()),
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