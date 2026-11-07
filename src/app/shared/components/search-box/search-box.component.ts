import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DxTextBoxModule } from 'devextreme-angular';

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [DxTextBoxModule],
  templateUrl: './search-box.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchBoxComponent {

  readonly placeholder = input<string>('Search...');
  
  readonly searchChange = output<string>();


  onSearch(value: string): void {
   this.searchChange.emit(value);
}
}
