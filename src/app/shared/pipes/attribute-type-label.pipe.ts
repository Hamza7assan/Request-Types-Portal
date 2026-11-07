import { Pipe, PipeTransform } from '@angular/core';
import { AttributeType } from '../../api/request-types/request-types-enums';

const ATTRIBUTE_TYPE_LABELS: Record<AttributeType, string> = {
  [AttributeType.Text]: 'Text',
  [AttributeType.Dropdown]: 'Drop down',
  [AttributeType.Checkbox]: 'Check box',
  [AttributeType.Date]: 'Date'
};

@Pipe({
  name: 'attributeTypeLabel',
  standalone: true,
  pure: true
})
export class AttributeTypeLabelPipe implements PipeTransform {
  transform(type: AttributeType | null | undefined): string {
    if (type == null) return '';
    return ATTRIBUTE_TYPE_LABELS[type] ?? 'Unknown';
  }
}
