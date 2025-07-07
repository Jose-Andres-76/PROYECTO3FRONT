import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { IFamily, IUser } from '../../../interfaces';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-family-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './family-form.component.html',
  styleUrl: './family-form.component.scss'
})
export class FamilyFormComponent {
  public fb: FormBuilder = inject(FormBuilder);
  public authService: AuthService = inject(AuthService);
  @Input() form!: FormGroup;
  @Output() callSaveMethod: EventEmitter<IFamily> = new EventEmitter<IFamily>();
  @Output() callUpdateMethod: EventEmitter<IFamily> = new EventEmitter<IFamily>();

  callSave() {
    let item: IFamily = {
      son: null, // Add the required 'son' property
      idFather: this.form.controls['idFather'].value,
      idSon: this.form.controls['idSon'].value
    };

    if (this.form.controls['id'].value) {
      item.id = this.form.controls['id'].value;
    } 
    
    if (item.id) {
      this.callUpdateMethod.emit(item);
    } else {
      this.callSaveMethod.emit(item);
    }
  }
}
