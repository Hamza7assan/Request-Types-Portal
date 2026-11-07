import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { DxButtonModule } from 'devextreme-angular';
import { RequestCategory } from '../../../../api/request-types/request-types-enums';
import { CheckboxComponent } from '../../../../shared/components/checkbox/checkbox.component';
import { CATEGORY_OPTIONS } from '../../../../api/request-types/request-types.constants';

@Component({
  selector: 'app-request-types-filters',
  standalone: true,
  imports: [DxButtonModule, CheckboxComponent],
  templateUrl: './request-types-filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestTypesFiltersComponent {

  readonly categories = [
  { label: 'All', value: null },
  ...CATEGORY_OPTIONS
];

  readonly selectedCategory = model<RequestCategory | null>(null);
  readonly showInactive = model<boolean>(false);

  onCategorySelect(category: RequestCategory | null): void {
    this.selectedCategory.set(category);
  }
}