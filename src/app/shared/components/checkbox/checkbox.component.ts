import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { DxCheckBoxModule } from 'devextreme-angular';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [DxCheckBoxModule],
  templateUrl: './checkbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxComponent {
  readonly label = input<string>('');
  readonly checked = model<boolean>(false);
}
