import { Injectable } from '@angular/core';
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private storageKey = 'users';

  deleteUser(userId: string) {
    const users = this.getUsers().filter((user:any) => user.id !== userId);
    this.saveUsers(users);
  }
  getUsers(): User[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  addUser(user: User) {
    const users = this.getUsers();
    users.push(user);
    this.saveUsers(users);
  }

  saveUsers(users: User[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }

  editUser(updatedUser: User) {
    const users = this.getUsers().map((user) =>user.id === updatedUser.id ? updatedUser : user);
    this.saveUsers(users);
  }
}
