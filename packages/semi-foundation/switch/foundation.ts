import BaseFoundation, { DefaultAdapter } from '../base/foundation';

export interface SwitchAdapter<P = Record<string, any>, S = Record<string, any>> extends DefaultAdapter<P, S> {
    setNativeControlChecked: (nativeControlChecked: boolean | undefined) => void;
    setNativeControlDisabled: (nativeControlDisabled: boolean | undefined) => void;
    setFocusVisible: (focusVisible: boolean) => void;
    notifyChange: (checked: boolean, e: any) => void;
}

export default class SwitchFoundation<P = Record<string, any>, S = Record<string, any>> extends BaseFoundation<SwitchAdapter<P, S>, P, S> {

    constructor(adapter: SwitchAdapter<P, S>) {
        super({ ...adapter });
    }

    init(): void {
        const { defaultChecked, checked, disabled } = this.getProps();
        this.setChecked(defaultChecked || checked);
        this.setDisabled(disabled);
    }

    setChecked(checked: boolean | undefined): void {
        this._adapter.setNativeControlChecked(checked);
    }

    setDisabled(disabled: boolean | undefined): void {
        this._adapter.setNativeControlDisabled(disabled);
    }

    handleChange(checked: boolean, e: any): void {
        const propChecked = this.getProps().checked;
        const isControledComponent = typeof propChecked !== 'undefined';
        if (isControledComponent) {
            this._adapter.notifyChange(checked, e);
        } else {
            this._adapter.setNativeControlChecked(checked);
            this._adapter.notifyChange(checked, e);
        }
    }

    handleFocusVisible = (event: any) => {
        const { target } = event;
        try {
            if (target.matches(':focus-visible')) {
                this._adapter.setFocusVisible(true);
            }
        } catch (error){
            console.warn('The current browser does not support the focus-visible');
        }
    }

    handleBlur = () => {
        this._adapter.setFocusVisible(false);
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    destroy(): void {}
}
