import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import validationEngine from 'devextreme/ui/validation_engine';
import notify from 'devextreme/ui/notify';
import { RequestTypesService } from '../../api/request-types/request-types.service';
import { CustomSection, RequestType } from '../../api/request-types/request-types-dto';
import { PageMode, RequestState } from '../../api/request-types/request-types-enums';
import { DetailsStaticFormComponent } from './components/details-static-form/details-static-form.component';
import {  CustomSectionComponent } from './components/custom-sections/custom-section.component';
import { HeaderAction, PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

const createInitialRequestData = (): RequestType => ({
  id: '',
  name: '',
  alternateName: '',
  category: null,
  state: RequestState.Active,
  isCustom: false,
  defaultReport: null,
  postingRole: null,
  backdatedRequestLimit: 0,
  escalation: {
    singleSignatureTimeout: null,
    escalateTo: null,
    requestTimeoutBeforeSignaling: null,
    signalingRole: null
  },
  reminders: {
    signatureReminderInterval: null,
    requestReminderInterval: null
  },
  customSections: []
});

@Component({
  selector: 'app-request-type-details',
  standalone: true,
  imports: [
    DetailsStaticFormComponent,
    PageHeaderComponent,
    CustomSectionComponent
],
  templateUrl: './request-type-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestTypeDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly requestTypesService = inject(RequestTypesService);
  private readonly destroyRef = inject(DestroyRef);

  readonly pageMode = signal<PageMode>('add');
  readonly requestId = signal<string | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly submitted = signal<boolean>(false);
  readonly originalRequest = signal<RequestType | null>(null);

  readonly requestData = signal<RequestType>(createInitialRequestData());

  readonly pageTitle = computed(() => {
    switch (this.pageMode()) {
      case 'add': return 'New Request Type';
      case 'edit': return 'Edit Request Type';
      default: return 'Request Type Details';
    }
  });

  readonly badgeText = computed(() => {
    if (this.pageMode() === 'add') return null;
    return this.originalRequest()?.state === RequestState.Active ? 'Active' : 'Inactive';
  });

  readonly badgeClass = computed(() =>
    this.originalRequest()?.state === RequestState.Active ? 'badge-status-active' : 'badge-status-inactive'
  );

  readonly headerActions = computed<HeaderAction[]>(() => [
    {
      id: 'save',
      label: 'Save',
      class: 'btn-primary px-4',
      hidden: this.pageMode() === 'view'
    },
    {
      id: 'cancel',
      label: 'Cancel',
      class: 'btn-light px-4'
    }
  ]);

  ngOnInit(): void {
    this.determinePageMode();
  }

  private determinePageMode(): void {
    const mode = (this.route.snapshot.queryParamMap.get('mode') as PageMode) || 'add';
    this.pageMode.set(mode);

    const id = this.route.snapshot.paramMap.get('id');
    if (id && (mode === 'edit' || mode === 'view')) {
      this.requestId.set(id);
      this.loadRequestData(id);
    }
  }

  private loadRequestData(id: string): void {
    this.isLoading.set(true);
    
    this.requestTypesService.getRequestTypeById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.originalRequest.set(data);
          this.requestData.set({
            ...data,
            escalation: data.escalation || {
              singleSignatureTimeout: null,
              escalateTo: null,
              requestTimeoutBeforeSignaling: null,
              signalingRole: null
            },
            reminders: data.reminders || {
              signatureReminderInterval: null,
              requestReminderInterval: null
            },
            customSections: data.customSections ? structuredClone(data.customSections) : []
          });
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Load failed', err);
          this.isLoading.set(false);
          notify({
            message: 'Failed to load request type or it does not exist',
            type: 'error',
            displayTime: 3000
          });
          this.router.navigate(['/request-types']);
        }
      });
  }

  onCustomSectionsChange(sections: CustomSection[]): void {
    this.requestData.update(r => ({
      ...r,
      customSections: sections
    }));
  }

  private isFormValid(): boolean {
    this.submitted.set(true);

    const validationResult = validationEngine.validateGroup('detailsValidationGroup');
    const current = this.requestData();

    const isNameValid = !!current.name?.trim();
    const isCategoryValid = current.category !== null && current.category !== undefined;

    return Boolean(validationResult?.isValid && isNameValid && isCategoryValid);
  }

  private buildPayload(): Partial<RequestType> {
    const current = this.requestData();
    return {
      name: current.name.trim(),
      alternateName: current.alternateName || '',
      category: current.category,
      defaultReport: current.defaultReport || null,
      postingRole: current.postingRole || null,
      backdatedRequestLimit: current.backdatedRequestLimit || 0,
      escalation: current.escalation,
      reminders: current.reminders,
      customSections: current.customSections || [],
      isCustom: !!(current.customSections && current.customSections.length > 0),
      state: this.originalRequest()?.state ?? RequestState.Active
    };
  }

  onSave(): void {
    if (!this.isFormValid()) {
      notify({
        message: 'Please fill in all required fields (Name and Category).',
        type: 'error',
        displayTime: 3000
      });
      return;
    }

    this.isLoading.set(true);
    const payload = this.buildPayload();
    const isEdit = this.pageMode() === 'edit' && !!this.requestId();

    const save$ = isEdit
      ? this.requestTypesService.updateRequestType(this.requestId()!, payload)
      : this.requestTypesService.createRequestType(payload);

    save$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.isLoading.set(false);
        notify({
          message: `Request type ${isEdit ? 'updated' : 'created'} successfully`,
          type: 'success',
          displayTime: 2500
        });
        this.router.navigate(['/request-types']);
      },
      error: (err) => {
        console.error('Save failed', err);
        this.isLoading.set(false);
        notify({
          message: `Failed to ${isEdit ? 'update' : 'create'} request type`,
          type: 'error',
          displayTime: 3000
        });
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/request-types']);
  }

  onHeaderAction(actionId: string): void {
    if (actionId === 'save') this.onSave();
    if (actionId === 'cancel') this.onCancel();
  }
}