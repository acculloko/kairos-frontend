import { RegisterRequest } from './../../models/user/registerRequest.type';
import { CommonModule, JsonPipe } from '@angular/common';
import { Component, inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { User } from '../../models/user/user.type';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { UserCreationFormComponent } from '../../components/user/user-creation-form/user-creation-form.component';
import { UserDeleteConfirmationComponent } from '../../components/user/user-delete-confirmation/user-delete-confirmation.component';
import { DateService } from '../../services/date.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { UserEditingFormComponent } from '../../components/user/user-editing-form/user-editing-form.component';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-users',
  imports: [
    MatTableModule,
    MatButtonModule,
    CommonModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatIconModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  dialog = inject(MatDialog);
  userService = inject(UserService);
  dateService = inject(DateService);
  authService = inject(AuthService);
  ngZone = inject(NgZone);

  role: string = '';

  // MatTable
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'id',
    'name',
    'email',
    'creation_date',
    'last_login',
    'role',
    'actions',
  ];
  // Total length of the displayedColumns array
  displayTotalLength: number = 7;

  selectedFilterField: string = 'name';
  filterableFields = [
    { label: 'Id', value: 'id' },
    { label: 'Name', value: 'name' },
    { label: 'Email', value: 'email' },
    { label: 'Role', value: 'role' },
    { label: 'Creation Date', value: 'creation_date' },
    { label: 'Last Login', value: 'last_login' },
  ];

  userList: Array<User> = [];
  userDataSource = new MatTableDataSource<User>();

  ngOnInit(): void {
    this.getAllUsers();
    this.role = this.authService.getUserInfo()?.role ?? '';

    // Logic for displaying or not the edit and delete buttons.
    if (
      this.role != 'ADMIN' &&
      this.displayedColumns.length >= this.displayTotalLength
    ) {
      this.displayedColumns.pop();
    }
  }

  getAllUsers() {
    this.userService.getUsers().subscribe({
      next: (response: any) => {
        this.userList = response.map((user: User) => ({
          ...user,
          creation_date: this.dateService.parseDate(
            user.creation_date,
            'dd/MM/yyyy HH:mm:ss'
          ),
          last_login: user.last_login
            ? this.dateService.parseDate(user.last_login, 'dd/MM/yyyy HH:mm:ss')
            : null,
        }));

        this.userDataSource = new MatTableDataSource<User>(this.userList);
        console.log(this.userDataSource);
      },
      error: (err) => {
        console.error(err);
        throw err;
      },
      complete: () => {
        this.userDataSource.paginator = this.paginator;
        this.userDataSource.sort = this.sort;
        this.setupFilterPredicate();
        this.setupSorting();
      },
    });
  }

  onSearch(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value;
    this.userDataSource.filter = searchValue.trim().toLowerCase();
  }

  setupFilterPredicate() {
    this.userDataSource.filterPredicate = (data: any, filter: string) => {
      if (!this.selectedFilterField || !filter) return true;

      let fieldValue: string;

      if (this.selectedFilterField === 'id') {
        fieldValue = data.id.toString();
      } else if (this.selectedFilterField === 'creation_date') {
        fieldValue = this.dateService.formatDate(
          data.creation_date,
          'dd/MM/yyyy HH:mm:ss'
        );
      } else if (this.selectedFilterField === 'last_login') {
        fieldValue = this.dateService.formatDate(
          data.last_login,
          'dd/MM/yyyy HH:mm:ss'
        );
      } else {
        fieldValue = (data[this.selectedFilterField] as string) || '';
      }

      return fieldValue.toLowerCase().includes(filter);
    };
  }

  setupSorting() {
    this.userDataSource.sortingDataAccessor = (
      item: User,
      property: string
    ): string | number => {
      if (property === 'creation_date' || property === 'last_login') {
        return item[property as keyof User]
          ? new Date(item[property as keyof User] as string).getTime()
          : 0;
      }

      const value = item[property as keyof User];

      if (typeof value === 'string') {
        return value.toLowerCase(); // Normalize all strings to lowercase for sorting
      }

      return typeof value === 'number' || typeof value === 'string'
        ? value
        : '';
    };
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
