import { Component, OnInit, ViewChild } from '@angular/core';
import { User, UserService } from './user.service';
import { UserListComponent } from './user-list/user-list.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  @ViewChild('templatePopup', { static: true }) templatePopup!: UserListComponent;
  private users: User[] = [];
  public filteredUsers: User[] = [];
  public searchQuery: string = '';
  public currentPage: number = 1;
  public itemsPerPage: number = 10;
  public totalPages: number = 0; 
  public sortColumn: string = '';
  public sortOrder: 'asc' | 'desc' = 'asc';
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.users = this.userService.getUsers();
    this.applyFilters();
  }

  applyFilters(): void {
    const query = this.searchQuery.trim().toLowerCase();
    let filteredUsers = this.users.filter( (user) => user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query) );
    if (this.sortColumn) {
      filteredUsers = this.sortUsers(filteredUsers, this.sortColumn, this.sortOrder);
    }
    this.totalPages = Math.ceil(filteredUsers.length / this.itemsPerPage);
    this.updateDisplayedUsers(filteredUsers);
  }


 updateDisplayedUsers(filteredUsers: User[]): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.filteredUsers = filteredUsers.slice(start, end);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.applyFilters();
  }
  
  addUser(user?: User) {
    this.templatePopup.showPopup(user);
    this.templatePopup.closeEvent.subscribe(data => {
      this.loadUsers();
    });
  }

  deleteUser(user: any) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(user.id);
      this.loadUsers();
    }
  }

sortUsers(users: User[], column: string, order: 'asc' | 'desc'): User[] {
  return users.sort((a, b) => {
    const valA = a[column as keyof User]!.toString().toLowerCase();
    const valB = b[column as keyof User]!.toString().toLowerCase();
    if (valA < valB) return order === 'asc' ? -1 : 1;
    if (valA > valB) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

onSort(column: string): void {
  if (this.sortColumn === column) {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    this.sortColumn = column;
    this.sortOrder = 'asc';
  }
  this.applyFilters();
}

}
