import { ChangeDetectionStrategy, Component, input, model, output, ViewChild } from '@angular/core';
import { DxSelectBoxModule, DxValidatorComponent, DxValidatorModule } from 'devextreme-angular';

export interface DropdownOption<T = any> {
  label: string;
  value: T;
}

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [DxSelectBoxModule, DxValidatorModule],
  templateUrl: './dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownComponent<T = any> {
  @ViewChild(DxValidatorComponent, { static: false }) validator?: DxValidatorComponent;

  readonly label = input.required<string>();
  readonly value = model<T | null>(null);
  readonly options = input.required<DropdownOption<T>[]>();

  readonly allowEmpty = input<boolean>(true);
  readonly emptyDisabled = input<boolean>(false);
  readonly isRequired = input<boolean>(false);
  readonly errorMessage = input<string>('');
  readonly containerClass = input<string>('mb-3');
  readonly readOnly = input<boolean>(false);
  readonly validationGroup = input<string>('requestDetailsGroup');

  readonly touch = output<void>();

  onBlur(): void {
    this.touch.emit();
    if (this.isRequired()) {
      this.validator?.instance?.validate();
    }
  }
}
