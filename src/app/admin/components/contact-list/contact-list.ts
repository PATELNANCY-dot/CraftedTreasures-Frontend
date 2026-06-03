import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.css',
})
export class ContactList implements OnInit {

  contacts: any[] = [];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts() {
    this.http.get<any[]>('https://localhost:7107/api/Treasure/GetContacts')
      .subscribe({
        next: (res) => {
          this.contacts = res;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
        }
      });
  }
}
