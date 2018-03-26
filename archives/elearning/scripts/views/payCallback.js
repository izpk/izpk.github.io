;define([
	'jquery',
	'underscore',
	'backbone'
	],function($, _, Backbone){
		'use strict';
		var Studycenter = Backbone.View.extend({
			el : 'body',
			template : _.template($('#template-payCallback').html()),
			events : {
				
			},
			type : '',
			render : function(data){
				this.$el.html(this.template());
			}
		});
		return Studycenter;
	});