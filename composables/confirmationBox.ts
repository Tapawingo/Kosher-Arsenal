interface ConfirmationBoxOptions {
  title?: string,
  description?: string,
  submitLabel?: string,
  cancelLabel?: string,
  submitCallback?: Function,
  cancelCallback?: Function
}

const defaultOptions: ConfirmationBoxOptions = {
  title: '',
  description: '',
  submitLabel: '',
  cancelLabel: '',
  submitCallback: () => {},
  cancelCallback: () => {}
}

class ConfirmationBox {
  _isOpen: Ref<boolean> = ref(false)
  _title: Ref<string> = ref('')
  _description: Ref<string> = ref('')
  _submitLabel: Ref<string> = ref('')
  _cancelLabel: Ref<string> = ref('')
  _submitCallback: Ref<Function> = ref(() => {})
  _cancelCallback: Ref<Function> = ref(() => {})

  public open(options: ConfirmationBoxOptions = defaultOptions) {
    this._title.value = options.title!;
    this._description.value = options.description!;
    this._submitLabel.value = options.submitLabel!;
    this._cancelLabel.value = options.cancelLabel!;
    this._submitCallback.value = options.submitCallback!;
    this._cancelCallback.value = options.cancelCallback!;

    this._isOpen.value = true;
  };

  public _submit(): void {
    this._isOpen.value = false;
    this._submitCallback.value();
  }

  public _cancel(): void {
    this._isOpen.value = false;
    this._cancelCallback.value();
  }
};

const _confirmationBox = new ConfirmationBox();

export const useConfirmationBox = () => { return _confirmationBox };