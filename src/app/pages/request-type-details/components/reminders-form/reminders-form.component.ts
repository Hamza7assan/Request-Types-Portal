import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReminderSettings } from '../../../../api/request-types/request-types-dto';
import { DaysInputComponent } from '../../../../shared/components/days-input/days-input.component';
import { SectionDividerComponent } from '../../../../shared/components/section-divider/section-divider.component';

@Component({
  selector: 'app-reminders-form',
  standalone: true,
  imports: [DaysInputComponent, SectionDividerComponent],
  templateUrl: './reminders-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemindersFormComponent {
  readonly reminders = input.required<ReminderSettings>();
  readonly isReadOnly = input<boolean>(false);
}
