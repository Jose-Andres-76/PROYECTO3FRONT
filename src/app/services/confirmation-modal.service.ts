import { Injectable, ComponentRef, ViewContainerRef, inject } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../components/confirmation-modal/confirmation-modal.component';
import { Observable } from 'rxjs';

export interface ConfirmationConfig {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmationModalService {
  private modalService = inject(NgbModal);

  /**
   * Opens a confirmation modal with the specified configuration
   * @param config Configuration options for the modal
   * @returns Promise that resolves to true if confirmed, false if cancelled
   */
  confirm(config: ConfirmationConfig = {}): Promise<boolean> {
    return new Promise((resolve) => {
      const modalRef = this.modalService.open(ConfirmationModalComponent, {
        size: 'sm',
        centered: true,
        backdrop: 'static',
        keyboard: false
      });

      const instance = modalRef.componentInstance as ConfirmationModalComponent;
      
      // Set configuration
      instance.title = config.title || '¿Estás seguro?';
      instance.message = config.message || '¿Estás seguro de que deseas realizar esta acción?';
      instance.confirmText = config.confirmText || 'Confirmar';
      instance.cancelText = config.cancelText || 'Cancelar';
      instance.confirmButtonClass = config.confirmButtonClass || 'btn-danger';

      // Handle confirmation
      instance.confirmed.subscribe(() => {
        modalRef.close();
        resolve(true);
      });

      // Handle cancellation
      instance.cancelled.subscribe(() => {
        modalRef.dismiss();
        resolve(false);
      });

      // Handle modal dismissal (clicking outside, escape key, etc.)
      modalRef.result.catch(() => {
        resolve(false);
      });
    });
  }

  /**
   * Convenience method for delete confirmations
   * @param itemName Name of the item being deleted
   * @returns Promise that resolves to true if confirmed, false if cancelled
   */
  confirmDelete(itemName: string): Promise<boolean> {
    return this.confirm({
      title: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar "${itemName}"? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      confirmButtonClass: 'btn-danger'
    });
  }

  /**
   * Convenience method for family member deletion
   * @param memberName Name of the family member being removed
   * @returns Promise that resolves to true if confirmed, false if cancelled
   */
  confirmDeleteFamilyMember(memberName: string): Promise<boolean> {
    return this.confirm({
      title: 'Eliminar miembro de familia',
      message: `¿Estás seguro de que deseas eliminar a "${memberName}" de tu familia?`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      confirmButtonClass: 'btn-danger'
    });
  }
}