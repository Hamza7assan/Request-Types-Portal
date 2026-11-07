import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { DxNumberBoxModule, DxValidatorModule } from 'devextreme-angular';

@Component({
  selector: 'app-days-input',
  standalone: true,
  imports: [DxNumberBoxModule, DxValidatorModule],
  templateUrl: './days-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DaysInputComponent {
  readonly label = input.required<string>();
  readonly value = model<any>(null);
  readonly unit = input<string>('Days');
  readonly containerClass = input<string>('mb-3');
  readonly min = input<number>(0);
  readonly readOnly = input<boolean>(false);
  readonly isRequired = input<boolean>(false);
  readonly validationGroup = input<string>('');
}
