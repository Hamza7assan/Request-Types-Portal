import { ChangeDetectionStrategy, Component, computed, input, model, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { confirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import { CustomAttribute, CustomSection } from '../../../../api/request-types/request-types-dto';
import { DxButtonModule, DxTemplateModule } from 'devextreme-angular';
import { AttributeDetailsDialogComponent, AttributeDialogModel } from '../attribute-details-dialog/attribute-details-dialog.component';
import { SectionCardComponent } from '../section-card/section-card.component';
import { SectionDividerComponent } from '../../../../shared/components/section-divider/section-divider.component';

@Component({
  selector: 'app-custom-section',
  standalone: true,
  imports: [
    DxButtonModule,
    DxTemplateModule,
    AttributeDetailsDialogComponent,
    SectionCardComponent,
    NgTemplateOutlet,
    SectionDividerComponent
  ],
  templateUrl: './custom-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomSectionComponent {
  readonly sections = model.required<CustomSection[]>();
  readonly isReadOnly = input<boolean>(false);

  readonly activeSectionIndex = signal<number>(0);
  readonly isDialogOpen = signal<boolean>(false);
  readonly editingAttribute = signal<{ data: CustomAttribute; index: number } | null>(null);

  readonly activeSection = computed(() => this.sections()[this.activeSectionIndex()] ?? null);

  selectSection(index: number): void {
    this.activeSectionIndex.set(index);
  }

  addSection(): void {
    if (this.isReadOnly()) return;

    const newSection: CustomSection = {
      id: crypto.randomUUID?.() || Date.now().toString(),
      name: '',
      order: this.sections().length + 1,
      attributes: []
    };

    this.sections.update(list => [...list, newSection]);
    this.activeSectionIndex.set(this.sections().length - 1);
  }

  deleteSection(index: number): void {
    if (this.isReadOnly()) return;

    confirm('Are you sure you want to delete this section and all its attributes?', 'Delete Section').then((agreed) => {
      if (agreed) {
        this.sections.update(list => 
          list
            .filter((_, i) => i !== index)
            .map((sec, i) => ({ ...sec, order: i + 1 }))
        );
        if (this.activeSectionIndex() >= this.sections().length) {
          this.activeSectionIndex.set(Math.max(0, this.sections().length - 1));
        }
        notify({
          message: 'Section deleted successfully',
          type: 'info',
          displayTime: 2000
        });
      }
    });
  }

  deleteAttribute(attrIndex: number, sectionIndex: number = this.activeSectionIndex()): void {
    if (this.isReadOnly()) return;

    confirm('Are you sure you want to delete this attribute?', 'Delete Attribute').then((agreed) => {
      if (agreed) {
        this.sections.update(list => {
          const copy = [...list];
          const targetSec = { ...copy[sectionIndex] };
          targetSec.attributes = (targetSec.attributes || [])
            .filter((_, i) => i !== attrIndex)
            .map((attr, idx) => ({ ...attr, order: idx + 1 }));
          copy[sectionIndex] = targetSec;
          return copy;
        });
        notify({
          message: 'Attribute deleted',
          type: 'info',
          displayTime: 2000
        });
      }
    });
  }

  openAddAttributeDialog(): void {
    if (this.isReadOnly()) return;
    this.editingAttribute.set(null);
    this.isDialogOpen.set(true);
  }

  openEditAttributeDialog(index: number, attrValue: CustomAttribute): void {
    if (this.isReadOnly()) return;
    this.editingAttribute.set({ data: attrValue, index });
    this.isDialogOpen.set(true);
  }

  closeAttributeDialog(): void {
    this.isDialogOpen.set(false);
    this.editingAttribute.set(null);
  }

  onSaveAttribute(event: { data: AttributeDialogModel; keepOpen: boolean }): void {
    const editing = this.editingAttribute();
    const currentSecIdx = this.activeSectionIndex();

    this.sections.update(list => {
      const copy = [...list];
      const targetSec = { ...copy[currentSecIdx] };
      const currentAttrs = [...(targetSec.attributes || [])];
      const safeDropdownItems = event.data.dropdownItems ? [...event.data.dropdownItems] : [];

      if (editing !== null) {
        currentAttrs[editing.index] = {
          ...currentAttrs[editing.index],
          name: event.data.name,
          type: event.data.type,
          isRequired: event.data.isRequired,
          maxLength: event.data.maxLength,
          dropdownItems: safeDropdownItems
        };
      } else {
        const newAttr: CustomAttribute = {
          id: crypto.randomUUID?.() || Date.now().toString(),
          name: event.data.name,
          type: event.data.type,
          isRequired: event.data.isRequired,
          maxLength: event.data.maxLength,
          dropdownItems: safeDropdownItems,
          order: currentAttrs.length + 1
        };
        currentAttrs.push(newAttr);
      }

      targetSec.attributes = currentAttrs;
      copy[currentSecIdx] = targetSec;
      return copy;
    });

    if (!event.keepOpen) {
      this.closeAttributeDialog();
    }
  }
}