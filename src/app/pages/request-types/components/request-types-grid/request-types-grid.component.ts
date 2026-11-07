import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DxDataGridModule, DxDropDownButtonModule } from 'devextreme-angular';
import type { CellClickEvent } from 'devextreme/ui/data_grid';
import type { ItemClickEvent } from 'devextreme/ui/drop_down_button';
import { RequestType } from '../../../../api/request-types/request-types-dto';
import { RequestState } from '../../../../api/request-types/request-types-enums';
import { CategoryLabelPipe } from '../../../../shared/pipes/category-label.pipe';

@Component({
  selector: 'app-request-types-grid',
  standalone: true,
  imports: [
    DxDataGridModule,
    DxDropDownButtonModule,
    CategoryLabelPipe
  ],
  templateUrl: './request-types-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestTypesGridComponent {
  readonly requests = input.required<RequestType[]>();
  readonly searchQuery = input<string>('');

  readonly view = output<string>();
  readonly edit = output<string>();
  readonly toggleState = output<RequestType>();
  readonly delete = output<string>();

  protected readonly RequestState = RequestState;

  getRowActions(request: RequestType) {
    return [
      { id: 'view', text: 'View' },
      { id: 'edit', text: 'Edit' },
      { id: 'toggle', text: request.state === RequestState.Active ? 'Deactivate' : 'Activate' },
      { id: 'delete', text: 'Delete' }
    ];
  }

  onCellClick(event: CellClickEvent): void {
    if (event.column?.dataField === 'name' && event.data?.id) {
      this.view.emit(event.data.id);
    }
  }

  onRowActionClick(event: ItemClickEvent, request: RequestType): void {
    const actionId = event.itemData?.id;
    if (actionId === 'view') this.view.emit(request.id);
    if (actionId === 'edit') this.edit.emit(request.id);
    if (actionId === 'toggle') this.toggleState.emit(request);
    if (actionId === 'delete') this.delete.emit(request.id);
  }
}
