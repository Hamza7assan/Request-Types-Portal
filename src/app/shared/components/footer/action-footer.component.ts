import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DxButtonModule } from 'devextreme-angular';
import { UiAction } from '../../models/ui-action.model';

export type FooterAction = UiAction;

@Component({
  selector: 'app-action-footer',
  standalone: true,
  imports: [DxButtonModule],
  templateUrl: './action-footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionFooterComponent {
  readonly actions = input<FooterAction[]>([]);
  readonly justify = input<'end' | 'start' | 'between' | 'center'>('end');
  readonly containerClass = input<string>('');

  readonly actionClick = output<string>();
}
