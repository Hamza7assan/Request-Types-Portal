import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-section-divider',
  standalone: true,
  templateUrl: './section-divider.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionDividerComponent {
  readonly label = input<string>('');
  readonly containerClass = input<string>('mb-3');
}
