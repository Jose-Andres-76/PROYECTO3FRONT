import { Component, effect, EventEmitter, inject, Input, Output } from "@angular/core";
import { IFamily } from "../../../interfaces";
import { FamilyService } from "../../../services/family.service";
import { AuthService } from "../../../services/auth.service";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../modal/modal.component';



@Component({
  selector: 'app-family-list',
    standalone: true,
    imports: [
    CommonModule
    ],
    templateUrl: './family-list.component.html',
    styleUrls: ['./family-list.component.scss']
})
export class FamilyListComponent {
    @Input() title: string = '';
    @Input() families: IFamily[] = [];
    public familyService: FamilyService = inject(FamilyService);
    public authService: AuthService = inject(AuthService);
    public user = this.authService.getUser();
    @Output() callModalAction: EventEmitter<IFamily> = new EventEmitter<IFamily>();
    @Output() callDeleteAction: EventEmitter<IFamily> = new EventEmitter<IFamily>();

    confirmDelete(family: IFamily): void {
        const memberName = family.son?.name || 'este miembro';
        const confirmation = confirm(`¿Estás seguro de que deseas eliminar a ${memberName} de tu familia?`);
        
        if (confirmation) {
            this.callDeleteAction.emit(family);
        }
    }
}