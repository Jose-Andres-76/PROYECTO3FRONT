import { Component, effect, EventEmitter, inject, Input, Output } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { IUser } from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../modal/modal.component';
import { UserFormComponent } from '../user-form/user-form.component';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { ConfirmationModalService } from '../../../services/confirmation-modal.service';


@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  @Input() title: string  = '';
  @Input() users: IUser[] = [];
  @Output() callModalAction: EventEmitter<IUser> = new EventEmitter<IUser>();
  @Output() callDeleteAction: EventEmitter<IUser> = new EventEmitter<IUser>();
  
  private confirmationModalService = inject(ConfirmationModalService);

  async confirmDelete(user: IUser): Promise<void> {
    const userName = `${user.name || ''} ${user.lastname || ''}`.trim() || 'este usuario';
    
    const firstConfirmed = await this.confirmationModalService.confirmDelete(userName);
    
    if (firstConfirmed) {
      const secondConfirmed = await this.confirmationModalService.confirmDelete(`, completa y absolutamente a ${userName}`);
      
      if (secondConfirmed) {
        this.callDeleteAction.emit(user);
      }
    }
  }
}
