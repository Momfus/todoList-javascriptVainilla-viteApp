
/**
 * 
 * @param {Todo} todo 
 */
export const createTodoHTML = ( todo ) => {

   if( !todo ) {
      throw new Error('A TODO object is required');
   }

   const { done, description, id } = todo;
   
   //List items should get the class "editing" when editing and "completed" when marked as completed 
   const html = `    
       <div class="view">
           <input class="toggle" type="checkbox" ${ todo.done ? 'checked' : ''}>
           <label>${ todo.description }</label>
           <button class="destroy"></button>
       </div>
       <input class="edit" value="Create a TodoMVC template">

   `;

   const liElement = document.createElement('li');

   liElement.innerHTML = html;

   // Se agrega el atributo aparte porque si en el html colocaba el "li", se colocaban dos veces con el createElement
   liElement.setAttribute('data-id', todo.id);

   if( todo.done ){
      liElement.classList.add('completed');
   }

   return liElement;

};