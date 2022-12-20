// Se graba la información en src/stores y la app esta en la carpeta src/todos

import './style.css';
import {App} from './src/todos/app';
import todoStore from './src/store/todo.store'; './src/store/todo.store';

todoStore.initStore();
App('#app');