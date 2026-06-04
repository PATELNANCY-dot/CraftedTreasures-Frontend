import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList implements OnInit {

  users: any[] = [];
  searchText: string = '';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {

    const api = 'https://localhost:7107/api/Admin/GetAllUsers';

    this.http.get<any[]>(api).subscribe(data => {

      console.log('Users:', data);

      this.users = data;
      this.cdr.detectChanges();

    });

  }

  searchUser() {

    if (this.searchText.trim() === '') {
      this.getUsers();
      return;
    }

    const api =
      `https://localhost:7107/api/Treasure/searchUser?name=${this.searchText}`;

    this.http.get<any[]>(api).subscribe(data => {

      console.log('Search Result:', data);
      console.log('Count:', data.length);

      this.users = data;
      this.cdr.detectChanges();

    });

  }

  trackByClientId(index: number, user: any) {
    return user.clientID;
  }

}
