import { Component, effect, EventEmitter, inject, Input, Output } from "@angular/core";
import { IFamily } from "../../../interfaces";
import { FamilyService } from "../../../services/family.service";
import { AuthService } from "../../../services/auth.service";
import { ConfirmationModalService } from "../../../services/confirmation-modal.service";
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
    private confirmationModalService = inject(ConfirmationModalService);
    public user = this.authService.getUser();
    @Output() callModalAction: EventEmitter<IFamily> = new EventEmitter<IFamily>();
    @Output() callDeleteAction: EventEmitter<IFamily> = new EventEmitter<IFamily>();

    async confirmDelete(family: IFamily): Promise<void> {
        const memberName = family.son?.name || 'este miembro';
        
        const confirmed = await this.confirmationModalService.confirmDeleteFamilyMember(memberName);
        
        if (confirmed) {
            this.callDeleteAction.emit(family);
        }
    }
}