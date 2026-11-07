import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { DxTextBoxModule, DxValidatorModule } from 'devextreme-angular';
import { RequestType } from '../../../../api/request-types/request-types-dto';
import { RequestCategory } from '../../../../api/request-types/request-types-enums';
import { EscalationFormComponent } from '../escalation-form/escalation-form.component';
import { RemindersFormComponent } from '../reminders-form/reminders-form.component';
import { DaysInputComponent } from '../../../../shared/components/days-input/days-input.component';
import { DropdownComponent, DropdownOption } from '../../../../shared/components/dropdown/dropdown.component';
import { SectionDividerComponent } from '../../../../shared/components/section-divider/section-divider.component';
import { CATEGORY_OPTIONS } from '../../../../api/request-types/request-types.constants';



const DEFAULT_REPORT_OPTIONS: DropdownOption[] = [
  { label: 'Standard Form', value: 'Standard Form' },
  { label: 'Vacation Form', value: 'Vacation Form' },
  { label: 'Certificate Template', value: 'Certificate Template' }
];

const POSTING_ROLE_OPTIONS: DropdownOption[] = [
  { label: 'HR Manager', value: 'HR Manager' },
  { label: 'Direct Manager', value: 'Direct Manager' },
  { label: 'Payroll Officer', value: 'Payroll Officer' }
];

@Component({
  selector: 'app-details-static-form',
  standalone: true,
  imports: [
    DxTextBoxModule,
    DxValidatorModule,
    EscalationFormComponent,
    RemindersFormComponent,
    DaysInputComponent,
    DropdownComponent,
    SectionDividerComponent
  ],
  templateUrl: './details-static-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailsStaticFormComponent {
  readonly requestData = input.required<RequestType>();
  readonly isReadOnly = input<boolean>(false);
  readonly submitted = input<boolean>(false);

  readonly categoryOptions = CATEGORY_OPTIONS;
  readonly defaultReportOptions = DEFAULT_REPORT_OPTIONS;
  readonly postingRoleOptions = POSTING_ROLE_OPTIONS;

  readonly nameTouched = signal<boolean>(false);
  readonly categoryTouched = signal<boolean>(false);

  readonly nameValue = signal<string | null>(null);
  readonly categoryValue = signal<RequestCategory | null>(null);

  readonly isNameInvalid = computed(() => {
    if (!this.submitted() && !this.nameTouched()) return false;
    const name = this.nameValue() ?? this.requestData()?.name;
    return !name?.trim();
  });

  readonly isCategoryInvalid = computed(() => {
    if (!this.submitted() && !this.categoryTouched()) return false;
    const cat = this.categoryValue() !== null ? this.categoryValue() : this.requestData()?.category;
    return cat === null || cat === undefined;
  });

  onNameChange(val: string): void {
    const cleanVal = val ?? '';
    this.requestData().name = cleanVal;
    this.nameValue.set(cleanVal);
  }

  onCategoryChange(val: RequestCategory | null): void {
    this.requestData().category = val;
    this.categoryValue.set(val);
  }

  onNameBlur(): void {
    this.nameTouched.set(true);
  }

  onCategoryBlur(): void {
    this.categoryTouched.set(true);
  }
}