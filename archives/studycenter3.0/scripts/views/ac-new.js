;define([
	'jquery',
	'underscore',
	'backbone'
	],function($, _, Backbone){
		'use strict';
		var Studycenter = Backbone.View.extend({
			tagName : 'div',
			className : 'ac-right',
			template : _.template($('#template-ac-new').html()),
			events : {
				
			},
			type : '',
			render : function(){
				this.$el.html(this.template());
				return this;
			}
		});
		return Studycenter;
	});