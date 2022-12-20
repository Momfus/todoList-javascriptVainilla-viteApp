
// Documento para ir almacenando los datos (De forma poca segura)

import { Todo } from '../todos/models/todo.model';

// Lista de filtros
export const Filters = {

   All: 'all',
   Completed: 'Completed',
   Pending: 'Pending'

};


// Lista de tareas
const state = {

   todos: [],
   filter: Filters.All

};

// Funciones
const initStore = () => {
   
   // console.log(state);
   loadStore();
   
};

const loadStore = () => {

   // console.log( localStorage.getItem('state'));
   if( !localStorage.getItem('state') ) { // Si no existe algo en el local storage salir.
      return;
   }

   const {todos = [], filter = Filters.All } = JSON.parse( localStorage.getItem('state'));
   state.todos = todos;
   state.filter = filter;

};

const saveStateToLocalStorage = () => {

   localStorage.setItem('state', JSON.stringify(state));

};


/**
 * 
 * @param {String} description 
 */
const addTodo = (description) => {

   if ( !description ) { throw new Error('Description is required'); }

   state.todos.push( new Todo(description));
   saveStateToLocalStorage();
   
};

/**
 * Cammbiar estado done a pending y viceversa del elemento de la tarea.
 * @param {String} todoId 
 */
const toggleTodo = ( todoId ) => {

   state.todos = state.todos.map( todo => {

      if( todo.id === todoId) {
         todo.done = !todo.done;
      }

      return todo;

   });

   saveStateToLocalStorage();

};

/**
 * 
 * @param {String} todoId 
 */
const deleteTodo = ( todoId ) => {

   state.todos = state.todos.filter( todo => todo.id !== todoId ); // Obtener todos los elementos menos el que tenga el id marcado (lo elimina de la lista)
   saveStateToLocalStorage();
};

const deleteCompleted = () => {

   state.todos = state.todos.filter( todo => !todo.done  ); // Obtener todos los elementos que  estenm completados
   saveStateToLocalStorage();
};

/**
 * 
 * @param {Filters} newFilter 
 */
const setFilter = ( newFilter = Filters.All ) => {

   state.filter = newFilter;
   saveStateToLocalStorage();
};

/**
 * 
 * @returns {String}
 */
const getCurrentFilter = () => {
   return state.filter;

};

/**
 * 
 * @param {Filters} filter 
 * @returns {Array<String>}
 */
const getTodos = ( filter = Filters.All ) => {

   switch( filter ) {

      case Filters.All: {
         return [...state.todos]; // Devuelve todos de la lista
      }

      case Filters.Completed: { // los que estan completados
         return state.todos.filter( todo =>  todo.done ); 
      }

      case Filters.Pending:  {
         return state.todos.filter( todo => !todo.done ); 
      }

      default: {
         throw new Error(`Option ${ filter } is not valid`);
      }
   }

};

// Exportar
export default {
   addTodo,
   deleteCompleted,
   deleteTodo,
   getCurrentFilter,
   getTodos,
   initStore,
   loadStore,
   setFilter,
   toggleTodo,
};