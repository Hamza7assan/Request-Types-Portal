import { ChangeDetectionStrategy, Component, computed, input, linkedSignal, output, signal } from '@angular/core';
import {  DxTextBoxModule,DxNumberBoxModule,DxSelectBoxModule,DxCheckBoxModule, DxFormModule,DxButtonModule, DxValidatorModule,DxValidationSummaryModule,DxPopupModule} from 'devextreme-angular';
import  validationEngine from 'devextreme/ui/validation_engine';
import  notify from 'devextreme/ui/notify';
import { CustomAttribute } from '../../../../api/request-types/request-types-dto';
import { AttributeType } from '../../../../api/request-types/request-types-enums';
import { ActionFooterComponent, FooterAction } from '../../../../shared/components/footer/action-footer.component';
import { ATTRIBUTE_TYPE_OPTIONS } from '../../../../api/request-types/request-types.constants';

export interface AttributeDialogModel {
  name: string;
  type: AttributeType;
  isRequired: boolean;
  maxLength: number | null;
  dropdownItems: string[];
}

@Component({
  selector: 'app-attribute-details-dialog',
  standalone: true,
  imports: [
    DxPopupModule,
    DxFormModule,
    DxTextBoxModule,
    DxNumberBoxModule,
    DxSelectBoxModule,
    DxCheckBoxModule,
    DxButtonModule,
    DxValidatorModule,
    DxValidationSummaryModule,
    ActionFooterComponent
  ],
  templateUrl: './attribute-details-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AttributeDetailsDialogComponent {
  readonly isOpen = input.required<boolean>();
  readonly attributeData = input<CustomAttribute | null>(null);

  readonly closeDialog = output<void>();
  readonly saveAttribute = output<{ data: AttributeDialogModel; keepOpen: boolean }>();

  protected readonly AttributeType = AttributeType;

  readonly editingItemIndex = signal<number | null>(null);
  readonly submitted = signal<boolean>(false);
  readonly nameTouched = signal<boolean>(false);

  readonly newDropdownItemText = signal<string>('');
  readonly inlineEditText = signal<string>('');

  readonly typeOptions = ATTRIBUTE_TYPE_OPTIONS;

  

  
  readonly model = linkedSignal<AttributeDialogModel>(() => {
    const data = this.attributeData();
    if (data) {
      return {
        name: data.name || '',
        type: data.type ?? AttributeType.Text,
        isRequired: data.isRequired ?? false,
        maxLength: data.maxLength ?? null,
        dropdownItems: Array.isArray(data.dropdownItems) ? [...data.dropdownItems] : []
      };
    }
    return {
      name: '',
      type: AttributeType.Text,
      isRequired: false,
      maxLength: null,
      dropdownItems: []
    };
  });

  readonly isNameInvalid = computed(() => (this.submitted() || this.nameTouched()) && !this.model().name?.trim());

  onNameChange(val: string): void {
    this.model.update(m => ({ ...m, name: val ?? '' }));
  }

  onNameBlur(): void {
    this.nameTouched.set(true);
  }

  onTypeChange(val: AttributeType): void {
    this.model.update(m => ({ ...m, type: val }));
  }

  onRequiredChange(val: boolean): void {
    this.model.update(m => ({ ...m, isRequired: !!val }));
  }

  onMaxLengthChange(val: number | null): void {
    this.model.update(m => ({ ...m, maxLength: val ?? null }));
  }

  onShowing(): void {
    this.editingItemIndex.set(null);
    this.newDropdownItemText.set('');
    this.inlineEditText.set('');
    this.submitted.set(false);
    this.nameTouched.set(false);
    this.safeResetGroup();
  }

  private safeResetGroup(): void {
    try {
      validationEngine.resetGroup('attrDialogGroup');
    } catch {
      console.warn('Validation group reset failed. It may not have been initialized yet.');
    }
  }

  private resetForm(): void {
    this.model.set({
      name: '',
      type: AttributeType.Text,
      isRequired: false,
      maxLength: null,
      dropdownItems: []
    });
    this.newDropdownItemText.set('');
    this.inlineEditText.set('');
    this.editingItemIndex.set(null);
    this.submitted.set(false);
    this.nameTouched.set(false);
    this.safeResetGroup();
  }

  addDropdownItem(): void {
    const value = this.newDropdownItemText().trim();
    if (!value) return;

    if (this.model().dropdownItems.some(i => i.toLowerCase() === value.toLowerCase())) {
      notify({ message: 'Item already exists.', type: 'warning', displayTime: 2000 });
      return;
    }

    this.model.update(m => ({
      ...m,
      dropdownItems: [...m.dropdownItems, value]
    }));
    this.newDropdownItemText.set('');
  }

  readonly onAddDropdownItemClick = () => {
    this.addDropdownItem();
  };

  removeDropdownItem(index: number): void {
    this.model.update(m => ({
      ...m,
      dropdownItems: m.dropdownItems.filter((_, i) => i !== index)
    }));
    if (this.editingItemIndex() === index) {
      this.editingItemIndex.set(null);
    }
  }

  startInlineEdit(index: number): void {
    this.inlineEditText.set(this.model().dropdownItems[index] || '');
    this.editingItemIndex.set(index);
  }

  saveInlineEdit(index: number): void {
    const value = this.inlineEditText().trim();
    if (value) {
      this.model.update(m => {
        const items = [...m.dropdownItems];
        items[index] = value;
        return { ...m, dropdownItems: items };
      });
    }
    this.editingItemIndex.set(null);
    this.inlineEditText.set('');
  }

  cancelInlineEdit(): void {
    this.editingItemIndex.set(null);
    this.inlineEditText.set('');
  }

  onSave(keepOpen: boolean): void {
    this.submitted.set(true);

    const valResult = validationEngine.validateGroup('attrDialogGroup');
    if (!valResult.isValid || !this.model().name?.trim()) {
      return;
    }

    const current = this.model();

    if (current.type === AttributeType.Dropdown && current.dropdownItems.length === 0) {
      notify({
        message: 'Please add at least one item for the dropdown list.',
        type: 'warning',
        displayTime: 3000
      });
      return;
    }

    const cleanData: AttributeDialogModel = {
      name: current.name.trim(),
      type: current.type,
      isRequired: current.isRequired,
      maxLength: current.type === AttributeType.Text ? current.maxLength : null,
      dropdownItems: current.type === AttributeType.Dropdown ? [...current.dropdownItems] : []
    };

    this.saveAttribute.emit({ data: cleanData, keepOpen });

    notify({
      message: keepOpen ? 'Attribute added. Ready to add another.' : 'Attribute saved successfully',
      type: 'success',
      displayTime: 2000
    });

    if (keepOpen) {
      this.resetForm();
    }
  }

  readonly dialogActions = computed<FooterAction[]>(() => [
    {
      id: 'save',
      label: this.attributeData() ? 'Save Changes' : 'Add',
      class: 'btn-primary px-4'
    },
    {
      id: 'saveAndNew',
      label: 'Add and new',
      class: 'btn-light px-3',
      hidden: !!this.attributeData()
    },
    {
      id: 'cancel',
      label: 'Cancel',
      class: 'btn-light px-4'
    }
  ]);

  onFooterAction(actionId: string): void {
    if (actionId === 'save') this.onSave(false);
    if (actionId === 'saveAndNew') this.onSave(true);
    if (actionId === 'cancel') this.closeDialog.emit();
  }
}