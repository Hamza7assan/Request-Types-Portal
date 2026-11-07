import { Pipe, PipeTransform } from '@angular/core';
import { RequestCategory } from '../../api/request-types/request-types-enums';
import { CATEGORY_LABELS } from '../../api/request-types/request-types.constants';


@Pipe({
  name: 'categoryLabel',
  standalone: true,
  pure: true
})

export class CategoryLabelPipe implements PipeTransform {
  transform(category: RequestCategory | null | undefined): string {
    if (category == null) return 'All';
    return CATEGORY_LABELS[category] ?? 'Other';
  }
}
