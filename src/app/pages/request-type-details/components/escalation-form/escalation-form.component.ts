import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { EscalationSettings } from '../../../../api/request-types/request-types-dto';
import { DaysInputComponent } from '../../../../shared/components/days-input/days-input.component';
import { DropdownComponent, DropdownOption } from '../../../../shared/components/dropdown/dropdown.component';
import { SectionDividerComponent } from '../../../../shared/components/section-divider/section-divider.component';

const ESCALATE_TO_OPTIONS: DropdownOption<string>[] = [
  { label: 'Department Head', value: 'Department Head' },
  { label: 'HR', value: 'HR' }
];
const SIGNALING_ROLE_OPTIONS: DropdownOption<string>[] = [
  { label: 'Admin', value: 'Admin' },
  { label: 'HR', value: 'HR' }
];

@Component({
  selector: 'app-escalation-form',
  standalone: true,
  imports: [DaysInputComponent, DropdownComponent, SectionDividerComponent],
  templateUrl: './escalation-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EscalationFormComponent {
  readonly escalation = input.required<EscalationSettings>();
  readonly isReadOnly = input<boolean>(false);
   
  readonly escalateToOptions = ESCALATE_TO_OPTIONS;
  readonly signalingRoleOptions = SIGNALING_ROLE_OPTIONS;
}
