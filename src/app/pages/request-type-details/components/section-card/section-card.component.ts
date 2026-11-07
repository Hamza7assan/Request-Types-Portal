import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DxButtonModule, DxTemplateModule, DxTextBoxModule } from 'devextreme-angular';
import { CustomAttribute, CustomSection } from '../../../../api/request-types/request-types-dto';
import { AttributeItemComponent } from '../attribute-item/attribute-item.component';

@Component({
  selector: 'app-section-card',
  standalone: true,
  imports: [DxTextBoxModule, DxButtonModule, DxTemplateModule, AttributeItemComponent],
  templateUrl: './section-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionCardComponent {
  readonly section = input.required<CustomSection>();
  readonly isReadOnly = input<boolean>(false);

  readonly addAttribute = output<void>();
  readonly editAttribute = output<{ index: number; data: CustomAttribute }>();
  readonly deleteAttribute = output<number>();
  readonly deleteSection = output<void>();
}
