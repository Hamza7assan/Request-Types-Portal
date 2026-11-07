import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { confirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import { RequestTypesService } from '../../api/request-types/request-types.service';
import { RequestType } from '../../api/request-types/request-types-dto';
import { RequestCategory, RequestState } from '../../api/request-types/request-types-enums';

import { RequestTypesFiltersComponent } from './components/request-types-filters/request-types-filters.component';
import { RequestTypesGridComponent } from './components/request-types-grid/request-types-grid.component';
import { HeaderAction, PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-request-types',
  standalone: true,
  imports: [
    RequestTypesFiltersComponent,
    RequestTypesGridComponent,
    PageHeaderComponent
  ],
  templateUrl: './request-types.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestTypesComponent implements OnInit {
  
  private readonly requestTypesService = inject(RequestTypesService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  readonly requests = signal<RequestType[]>([]);
  readonly isLoading = signal<boolean>(false);

  // filter signals
  readonly searchQuery = signal<string>('');
  readonly selectedCategory = signal<RequestCategory | null>(null);
  readonly showInactive = signal<boolean>(false);

  readonly filteredRequests = computed(() => {
    const list = this.requests();
    const query = this.searchQuery().trim().toLowerCase();
    const category = this.selectedCategory();
    const includeInactive = this.showInactive();

    return list.filter(item => {
      const matchesSearch = !query || 
        item.name.toLowerCase().includes(query) || 
        item.alternateName.toLowerCase().includes(query);

      const matchesCategory = category === null || item.category === category;

      const matchesState = includeInactive ? true : item.state === RequestState.Active;

      return matchesSearch && matchesCategory && matchesState;
    });
  });

  ngOnInit(): void {
    this.loadRequests();
  }

  
  loadRequests(): void {
    this.isLoading.set(true);
    this.requestTypesService.getAllRequestTypes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.requests.set(data);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false)
      });
  }

  toggleRequestState(request: RequestType): void {
    const newState = request.state === RequestState.Active ? RequestState.Inactive : RequestState.Active;
    this.requestTypesService.toggleRequestState(request.id, newState)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.requests.update(items =>
          items.map(r => r.id === request.id ? { ...r, state: newState } : r)
        );
        notify({
          message: `Request status changed to ${newState === RequestState.Active ? 'Active' : 'Inactive'}`,
          type: 'info',
          displayTime: 2000
        });
      });
  }

  deleteRequest(id: string): void {
    confirm('Are you sure you want to delete this request type?', 'Delete Confirmation').then((agreed) => {
      if (agreed) {
        this.requestTypesService.deleteRequestType(id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.requests.update(items => items.filter(r => r.id !== id));
            notify({
              message: 'Request type deleted successfully',
              type: 'success',
              displayTime: 2500
            });
          });
      }
    });
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
  }
  


  // for header actions and buttons
  readonly headerActions: HeaderAction[] = [
    { id: 'add', label: 'Add', class: 'btn-primary px-4' },
    { id: 'import', label: 'Import', class: 'btn-light px-3' },
    { id: 'export', label: 'Export', class: 'btn-light px-3' }
  ];

  onHeaderAction(actionId: string): void {
    if (actionId === 'add') {
      this.onAdd();
    } else if (actionId === 'import' || actionId === 'export') {
      notify({ message: `${actionId} feature coming soon`, type: 'info', displayTime: 2000 });
    }
  }

  onAdd(): void {
    this.router.navigate(['/request-types/details'], {
      queryParams: { mode: 'add' } 
    });
  }

  onEdit(id: string): void {
    this.router.navigate(['/request-types/details', id], { 
      queryParams: { mode: 'edit' } 
    });
  }

  onView(id: string): void {
    this.router.navigate(['/request-types/details', id], { 
      queryParams: { mode: 'view' } 
    });
  }
}