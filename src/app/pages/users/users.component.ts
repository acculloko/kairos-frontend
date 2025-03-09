import { RegisterRequest } from './../../models/user/registerRequest.type';
import { CommonModule, JsonPipe } from '@angular/common';
import { Component, inject, NgZone, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { User } from '../../models/user/user.type';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { UserCreationFormComponent } from '../../components/user-creation-form/user-creation-form.component';
import { UserEditingFormComponent } from '../../components/user-editing-form/user-editing-form.component';
import { UserDeleteConfirmationComponent } from '../../components/user-delete-confirmation/user-delete-confirmation.component';
import { DateService } from '../../services/date.service';

@Component({
  selector: 'app-users',
  imports: [MatTableModule, MatButtonModule, CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  dialog = inject(MatDialog);
  userService = inject(UserService);
  dateService = inject(DateService);
  ngZone = inject(NgZone);
  // MatTable
  displayedColumns: string[] = [
    'id',
    'name',
    'email',
    'creation_date',
    'last_login',
    'role',
    'actions',
  ];
  userList: Array<User> = [];

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() {
    this.userService.getUsers().subscribe((res: any) => {
      this.userList = res.map((user: User) => ({
        ...user,
        creation_date: this.dateService.parseDate(
          user.creation_date,
          'dd/MM/yyyy HH:mm:ss'
        ),
        last_login: user.last_login
          ? this.dateService.parseDate(user.last_login, 'dd/MM/yyyy HH:mm:ss')
          : null,
      }));
    });
  }

  createUser() {
    const dialogRef = this.dialog.open(UserCreationFormComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const formattedResult: RegisterRequest = {
          name: result.name,
          email: result.email,
          role: result.role,
          password: result.password,
        };
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

  editUser(id: number) {
    const dialogRef = this.dialog.open(UserEditingFormComponent, {
      width: '600px',
      data: { id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const formattedResult: RegisterRequest = {
          name: result.name,
          email: result.email,
          role: result.role,
          password: result.password,
        };
        this.userService.editUser(formattedResult, id).subscribe({
          next: (response) => {
            console.log('user edited successfully:', response);
            // Forces component to reload in order to show changes in the list.
            this.ngZone.run(() => {
              this.ngOnInit();
            });
          },
          error: (error) => {
            console.error('error editing user:', error);
            // Forces component to reload in order to show changes in the list.
            this.ngZone.run(() => {
              this.ngOnInit();
            });
          },
        });
      }
    });
  }

  deleteUser(id: number) {
    const dialogRef = this.dialog.open(UserDeleteConfirmationComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.deleteUser(id).subscribe({
          next: (response) => {
            console.log('user deleted successfully:', response);
            // Forces component to reload in order to show changes in the list.
            this.ngZone.run(() => {
              this.ngOnInit();
            });
          },
          error: (error) => {
            console.error('error deleting user:', error);
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
