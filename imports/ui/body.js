import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict'
import { Meteor } from 'meteor/meteor'

import { Tasks } from '../api/tasks.js';
 
import './task.js';
import './body.html';

Template.body.onCreated(function bodyOnCreated(){
	this.state = new ReactiveDict();
	Meteor.subscribe('tasks');
});
 
Template.body.helpers({
  tasks() {
	const instance = Template.instance();
	
    if (instance.state.get('hideCompleted')) {
      // If hide completed is checked, filter tasks
      return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
    }else{
    // Otherwise, return all of the tasks
    return Tasks.find({}, { sort: { createdAt: -1 } });
	}
  },
    incompleteCount() {
    return Tasks.find({ checked: { $ne: true } }).count();
	},
});

Template.body.events({
	'submit .new-task'(event){
		event.preventDefault();
		
		const target = event.target;
		const text = target.text.value;
		const cantidad = target.cantidad.value;
		const lugar = target.lugar.value;
		const ciudad = 'barcelona';
		console.log(event);
		/** Antes se insertaba manualmente, ahora automaticamente **/
		/** Tasks.insert({
			text,
			createdAt: new Date(), // current time
			owner: Meteor.userId(),
			username: Meteor.user().username,
		}); **/
		
		Meteor.call('tasks.insert', text, cantidad, lugar);
		
	},

	
	'change .hide-completed input'(event, instance) {
    instance.state.set('hideCompleted', event.target.checked);
  },
});