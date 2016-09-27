;define([
	'jquery',
	'underscore',
	'backbone'
	],function($, _, Backbone){
		'use strict';
		var Studycenter = Backbone.View.extend({
			tagName : 'ul',
			className : 'ac-list-ul',
			template : _.template($('#template-ac-list').html()),
			events : {
				
			},
			type : '',
			render : function(data){
				console.log(data)
				this.$el.html(this.template(data));
				return this;
			}
		});
		return Studycenter;
	});