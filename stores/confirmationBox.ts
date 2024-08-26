interface confirmationBoxOptions {
  title?: string,
  description?: string,
  submitLabel?: string,
  cancelLabel?: string,
  submitCallback?: Function,
  cancelCallback?: Function
}

const defaultOptions: confirmationBoxOptions = {
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

  public open(options: confirmationBoxOptions = defaultOptions) {
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


/* defineStore('confirmationBox', {
  state: () => ({
    _isOpen: ref<boolean>(false),
    _title: ref<string>(''),
    _description: ref<string>(''),
    _submitLabel: ref<string>(''),
    _cancelLabel: ref<string>(''),
    _submitCallback: ref<Function>(() => {}),
    _cancelCallback: ref<Function>(() => {}),
  }),
  actions: {
    open(
      title: string = 'Are you sure?', 
      description: string = '',
      submitLabel: string = 'Ok',
      submitCallback: Function = () => {},
      cancelLabel: string = 'Cancel',
      cancelCallback: Function = () => {}
    ) {
      this._title = title;
      this._description = description;
      this._submitLabel = submitLabel;
      this._submitCallback = submitCallback;
      this._cancelLabel = cancelLabel;
      this._cancelCallback = cancelCallback;

      this._isOpen = true;
    },

    _submit(): void {
      this._isOpen = false;
      this._submitCallback();
    },

    _cancel(): void {
      this._isOpen = false;
      this._cancelCallback();
    }
  }
})
 */