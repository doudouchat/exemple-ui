import { AbstractControl, ValidatorFn } from '@angular/forms';

export function notBlank(): ValidatorFn {

  const NOT_BLANK_REGEXP = /^(?!\s*$)./i;

  /* eslint-disable @typescript-eslint/no-explicit-any */
  /* eslint-disable @typescript-eslint/consistent-indexed-object-style */
  return (control: AbstractControl): { [key: string]: any } | null =>
    !NOT_BLANK_REGEXP.test(control.value) ? { notBlank: { value: control.value } } : null;
}
