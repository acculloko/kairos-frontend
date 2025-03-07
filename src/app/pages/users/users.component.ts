import { RegisterRequest } from './../../models/user/registerRequest.type';
import { JsonPipe } from '@angular/common';
import { Component, inject, NgZone, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { User } from '../../models/user/user.type';
import { MatDialog } from '@angular/material/dialog';
import { UserFormComponent } from '../../components/user-form/user-form.component';

@Component({
  selector: 'app-users',
  imports: [JsonPipe],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  dialog = inject(MatDialog);
  userService = inject(UserService);
  ngZone = inject(NgZone);
  userList: Array<User> = [];

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() {
    this.userService.getUsers().subscribe((res: any) => {
      this.userList = res;
    });
  }

  createUser() {
    const dialogRef = this.dialog.open(UserFormComponent, { width: '600px' });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Form Data:', result);
        const formattedResult: RegisterRequest = {
          name: result.name,
          email: result.email,
          role: result.role,
          password: result.password,
        };
        console.log('Formatted Form Data:' + formattedResult.password);
        this.userService.createUser(formattedResult).subscribe({
          next: (response) => {
            console.log('user created successfully:', response);
            // Forces component to reload in order to show changes in the list.
            this.ngZone.run(() => {
              this.ngOnInit();
            });
          },
          error: (error) => {
            console.error('error creating user:', error);
            // Forces component to reload in order to show changes in the list.
            this.ngZone.run(() => {
              this.ngOnInit();
            });
          },
        });
      }
    });
  }
}
