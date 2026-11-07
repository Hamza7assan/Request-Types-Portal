import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DxButtonModule, DxToolbarModule } from 'devextreme-angular';
import { SearchBoxComponent } from '../search-box/search-box.component';
import { UiAction } from '../../models/ui-action.model';

export type HeaderAction = UiAction;

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [DxToolbarModule, DxButtonModule, SearchBoxComponent],
  templateUrl: './page-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageHeaderComponent {
  // badge
  readonly title = input.required<string>();
  readonly badgeText = input<string | null>(null);
  readonly badgeClass = input<string>('badge-status-active');

  // search box
  readonly showSearch = input<boolean>(false);
  readonly searchPlaceholder = input<string>('Search...');
  readonly searchChange = output<string>();

  // buttons
  readonly actions = input<HeaderAction[]>([]);
  readonly actionClick = output<string>();
 }