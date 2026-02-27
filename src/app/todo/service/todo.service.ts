import { Injectable, inject, signal, computed } from '@angular/core';
import { Todo, TodoStatus } from '../model/todo';
import { LoggerService } from '../../services/logger.service';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private loggerService = inject(LoggerService);
  private nextId = 1;

  private todos = signal<Todo[]>([]);

  waitingTodos = computed(() =>
    this.todos().filter(todo => todo.status === 'waiting')
  );

  inProgressTodos = computed(() =>
    this.todos().filter(todo => todo.status === 'in progress')
  );

  doneTodos = computed(() =>
    this.todos().filter(todo => todo.status === 'done')
  );

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);
  constructor() {}

  /**
   * elle retourne la liste des todos
   *
   * @returns Signal<Todo[]>
   */
  getTodos() {
    return this.todos.asReadonly();
  }

  /**
   *Elle permet d'ajouter un todo
   *
   * @param todo: Todo
   *
   */
  addTodo(todo: Todo): void {
    todo.id = this.nextId++;
    this.todos.update(todos => [...todos, todo]);
  }

  /**
   * Delete le todo s'il existe
   *
   * @param todo: Todo
   * @returns boolean
   */
  deleteTodo(todo: Todo): boolean {
    const currentTodos = this.todos();
    const index = currentTodos.findIndex(t => t.id === todo.id);
    if (index > -1) {
      this.todos.update(todos => todos.filter(t => t.id !== todo.id));
      return true;
    }
    return false;
  }

  updateTodoStatus(todo: Todo, newStatus: TodoStatus): void {
    this.todos.update(todos =>
      todos.map(t => t.id === todo.id ? { ...t, status: newStatus } : t)
    );
  }

  getByStatus(status: TodoStatus): Todo[] {
    switch (status) {
      case 'waiting':
        return this.waitingTodos();
      case 'in progress':
        return this.inProgressTodos();
      case 'done':
        return this.doneTodos();
      default:
        return [];
    }
  }

  /**
   * Logger la liste des todos
   */
  logTodos() {
    this.loggerService.logger(this.todos());
  }
}
