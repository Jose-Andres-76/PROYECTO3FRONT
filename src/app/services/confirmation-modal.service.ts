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

  confirm(config: ConfirmationConfig = {}): Promise<boolean> {
    return new Promise((resolve) => {
      const modalRef = this.modalService.open(ConfirmationModalComponent, {
        size: 'sm',
        centered: true,
        backdrop: 'static',
        keyboard: false
      });

      const instance = modalRef.componentInstance as ConfirmationModalComponent;
      
      instance.title = config.title || '¿Estás seguro?';
      instance.message = config.message || '¿Estás seguro de que deseas realizar esta acción?';
      instance.confirmText = config.confirmText || 'Confirmar';
      instance.cancelText = config.cancelText || 'Cancelar';
      instance.confirmButtonClass = config.confirmButtonClass || 'btn-danger';

      instance.confirmed.subscribe(() => {
        modalRef.close();
        resolve(true);
      });

      instance.cancelled.subscribe(() => {
        modalRef.dismiss();
        resolve(false);
      });

      modalRef.result.catch(() => {
        resolve(false);
      });
    });
  }

  confirmDelete(itemName: string): Promise<boolean> {
    return this.confirm({
      title: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar "${itemName}"? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      confirmButtonClass: 'btn-danger'
    });
  }

  confirmDeleteFamilyMember(memberName: string): Promise<boolean> {
    return this.confirm({
      title: 'Eliminar miembro de familia',
      message: `¿Estás seguro de que deseas eliminar a "${memberName}" de tu familia? No se eliminará si está ligado a un reto o recompensa`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      confirmButtonClass: 'btn-danger'
    });
  }
}