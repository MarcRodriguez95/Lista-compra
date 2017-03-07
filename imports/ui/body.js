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

  if(instance.state.get('frutas')) {
    return Tasks.find({$and: [{ checked:{$ne: true}, lugar:{ $eq:"fruteria"}}]}, {sort: {checked: 1, createdAt: -1}});
  }
  else if(instance.state.get('congelados')) {
    return Tasks.find({$and: [{checked: {$ne: true}, lugar: {$eq:"congelado"}}]}, {sort: {checked:1, createdAt: -1}});
  }
  else if(instance.state.get('supers')){
    return Tasks.find({$and: [{checked: {$ne: true}, lugar: {$eq:"super"}}]}, {sort:{checked:1, createdAt: -1}});
  }
  else if(instance.state.get('general')){
  return Tasks.find({ checked: { $ne: true }}, { sort: { checked: 1 , createdAt: -1} });
  }
  else{
  return Tasks.find({ checked: { $ne: true } }, { sort: { checked:1, createdAt: -1 } });
  }
  
}else {
    if(instance.state.get('frutas')) {
      return Tasks.find({lugar: {$eq:"fruteria"}}, {sort:{checked:1, createdAt: -1}});
    };
    if(instance.state.get('congelados')) {
      return Tasks.find({lugar: {$eq:"congelado"}}, {sort:{checked:1, createdAt: -1}});
    };
    if(instance.state.get('supers')){
      return Tasks.find({lugar: {$eq:"super"}}, {sort: {checked: 1, createdAt: -1}});
    };
    if(instance.state.get('general')){
      return Tasks.find({}, {sort: {checked: 1, createdAt: -1}});
    };


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
  
  
  'change .general input'(event, instance) {
    instance.state.set('general', event.target.checked);
	instance.state.set('frutas', false);
	instance.state.set('supers', false);
	instance.state.set('congelados', false);
  },
  
    'change .frutas input'(event, instance) {
    instance.state.set('frutas', event.target.checked);
	instance.state.set('general', false);
	instance.state.set('supers', false);
	instance.state.set('congelados', false);
  },
  
    'change .supers input'(event, instance) {
    instance.state.set('supers', event.target.checked);
	instance.state.set('general', false);
	instance.state.set('frutas', false);
	instance.state.set('congelados', false);
  },
  
    'change .congelados input'(event, instance) {
    instance.state.set('congelados', event.target.checked);
	instance.state.set('general', false);
	instance.state.set('frutas', false);
	instance.state.set('supers', false);
  },
  
});