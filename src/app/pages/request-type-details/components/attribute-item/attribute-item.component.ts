import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CustomAttribute } from '../../../../api/request-types/request-types-dto';
import { AttributeTypeLabelPipe } from '../../../../shared/pipes/attribute-type-label.pipe';

@Component({
  selector: 'app-attribute-item',
  standalone: true,
  imports: [AttributeTypeLabelPipe],
  templateUrl: './attribute-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttributeItemComponent {
  readonly attribute = input.required<CustomAttribute>();
  readonly index = input.required<number>();
  readonly isReadOnly = input<boolean>(false);

  readonly edit = output<void>();
  readonly delete = output<void>();

  readonly formattedIndex = computed(() => (this.index() + 1).toString().padStart(2, '0'));
}
