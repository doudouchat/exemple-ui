import { AbstractControl, ValidatorFn } from '@angular/forms';

export function notBlank(): ValidatorFn {

  const NOT_BLANK_REGEXP = /^(?!\s*$)./i;

  return (control: AbstractControl): { [key: string]: any } | null =>
    !NOT_BLANK_REGEXP.test(control.value) ? { notBlank: { value: control.value } } : null;
}
