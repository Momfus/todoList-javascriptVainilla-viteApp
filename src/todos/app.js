import html from './app.html?raw'; // Forma de importaar usando vite (el raw lo "importa en crudo")
import todoStore, { Filters } from '../store/todo.store';
import { renderPending, renderTodos } from './use-cases';

const ElementIds = {

   ClearCompleted: '.clear-completed', // clase css
   TodoList: '.todo-list', // clase css
   NewTodoInput: '#new-todo-input', // por id
   TodoFilters: '.filtro',
   PendingCountLabel: '#pending-count'

};

/**
 * 
 * @param {String} elementId 
 */
export const App = (elementId) => {

   
   const updatePendingCount = () => {
      renderPending(ElementIds.PendingCountLabel);
   };
   
   // Renderizar los elementos de la lista
   const displayTodos = () => {
      const todos = todoStore.getTodos( todoStore.getCurrentFilter() );
      renderTodos( ElementIds.TodoList, todos ); // Se manda el elemento que queres añadirle
      updatePendingCount();
   };


   // sucede cuando la función App() se llama
   ( () => { // Función anónima auto invocada --> esto es necesario hacer para hacer referencias a otras funciones desde la app

      const app = document.createElement('div');
      app.innerHTML = html;
      document.querySelector( elementId ).append(app);
      
      displayTodos();

      // Se espera un tiempo para que renderice primero y usar las variables de referencia marcadas mas abajo
      setTimeout(() => {
         filterSelectedAddClassByCurrentFilter();
      }, 100);

   })();

   // Referencia HTML
   const newDescriptionInput = document.querySelector( ElementIds.NewTodoInput);
   const todoListUL = document.querySelector( ElementIds.TodoList);
   const clearCompletedButton = document.querySelector( ElementIds.ClearCompleted);
   const filtersLIs = document.querySelectorAll(ElementIds.TodoFilters);

   // Listeners

   // Crear nuevo elemento
   newDescriptionInput.addEventListener('keyup', ( event ) => { // Cuando se presiona y suelta la tecla

      // console.log(event.target.value); // Target es el elemento html y value el último que se tuvo al escribir
      if( event.keyCode !== 13 ) { // al presionar enter se sale
         return;
      }
      if( event.target.value.trim().length === 0) { // Trim quita los espacios continuos de un string
         return;
      }

      todoStore.addTodo( event.target.value );
      displayTodos(); // renderizar de nuevo

      // Despues de insertar, reiniciar el campo para que no repita
      event.target.value = '';

   });


   // añadir element
   todoListUL.addEventListener('click', (event) => {
      const element = event.target.closest('[data-id]'); // El elemento html padre que tenga primero que tenga la propiedad data-id
      // console.log(element.getAttribute('data-id'));

      todoStore.toggleTodo( element.getAttribute('data-id'));
      displayTodos(); // Rentederizar de nuevo

   });

   // Eliminar elemento
   todoListUL.addEventListener('click', (event) => {
   
      const isDestroyElement = !event.target.classList.contains('destroy'); // Sino con event.targetClassName === 'destroy'
      
      if( isDestroyElement ) {
         return;
      }
      
      const element = event.target.closest('[data-id]'); // Esto consigue el elemento padre y su atributo id mas cercano que definimos
      todoStore.deleteTodo(element.getAttribute('data-id'));

      // console.log(element.getAttribute('data-id'));

      displayTodos();
   
   });

   // Borrtar todos los elementos completados.
   clearCompletedButton.addEventListener('click', () => {

      todoStore.deleteCompleted();
      displayTodos();

   });

   
   // Se agrega un listener a cada elemento de los filtros
   filtersLIs.forEach( element => {

      element.addEventListener('click', (element ) => {

         filtersLIs.forEach( el => el.classList.remove('selected')); // Se borra primero en todos
         element.target.classList.add('selected'); // Se agrega al que se le hizo click

         setFilterSelected(element.target.text);

         displayTodos();


      });

   });


   /**
    * Se obtienen los datos según el seleccionado (en la práctica es mejor usando el href o por id por si el idioma cambia)
    * @param {String} filterType 
    */
   const setFilterSelected = ( filterType = Filters.All ) => {

      switch(filterType) {

         case 'Todos': {
            todoStore.setFilter( Filters.All );
            break;
         }

         case 'Pendientes': {
            todoStore.setFilter( Filters.Pending );
            break;
         }

         case 'Completados': {
            todoStore.setFilter( Filters.Completed );
            break;
         }

      }

   };

   // Se agrega la clase 'selected ' segun el filtro actual
   const filterSelectedAddClassByCurrentFilter = () => {

      const filterCurrent = todoStore.getCurrentFilter();
      filtersLIs.forEach( element => {

         if( element.getAttribute('id')  === filterCurrent ) {
            element.classList.add('selected');
         }

      });

   };

};