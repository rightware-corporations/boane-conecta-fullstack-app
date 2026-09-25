// Only shapes that the current backend accepts and that contain enough published
// information for accessible controls may pass this runtime boundary.
export type Scalar = string | number | boolean;
export type FieldType = 'SHORT_TEXT' | 'LONG_TEXT' | 'EMAIL' | 'PHONE' | 'DATE' |
  'SINGLE_SELECT' | 'INTEGER' | 'DECIMAL' | 'MULTI_SELECT' | 'BOOLEAN' | 'ADDRESS';
export type Field = { key: string; label: string; type: FieldType; required: boolean; helpText?: string;
  options?: { value: string; label: string }[]; visibleWhen?: { field: string; equals: Scalar };
  addressFields?: { key: string; label: string; required: boolean; minLength?: number; maxLength?: number }[];
  hiddenValuePolicy: 'CLEAR_ON_HIDE' | 'PRESERVE_ON_HIDE'; minLength?: number; maxLength?: number };
export type Step = { key: string; title: string; fields: Field[] };
export type EligibilityRule = { key: string; label: string; required: boolean; operator: 'TRUTHY' | 'EQUALS' | 'NOT_EQUALS' | 'IN'; expected?: Scalar | Scalar[];
  options: { value: string; label: string }[]; failureMessage: string; blocking: boolean };
const obj = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
const scalar = (value: unknown): value is Scalar => ['string', 'number', 'boolean'].includes(typeof value);
const nonEmpty = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;
const types: FieldType[] = ['SHORT_TEXT','LONG_TEXT','EMAIL','PHONE','DATE','SINGLE_SELECT','INTEGER','DECIMAL','MULTI_SELECT','BOOLEAN','ADDRESS'];
export class UnsupportedDefinition extends Error { constructor(reason: string) { super(reason); } }
function optionsOf(value: unknown): { value: string; label: string }[] {
  if (!Array.isArray(value) || !value.length) throw new UnsupportedDefinition('As opções publicadas não têm formato acessível.');
  const options = value.map(option => {
    if (typeof option === 'string' && option.trim()) return { value: option, label: option };
    if (obj(option) && nonEmpty(option.value) && nonEmpty(option.label)) return { value: option.value, label: option.label };
    throw new UnsupportedDefinition('Uma opção publicada não possui valor e rótulo textual.');
  });
  if (new Set(options.map(option => option.value)).size !== options.length) throw new UnsupportedDefinition('As opções publicadas repetem valores.');
  return options;
}
export function parseSteps(raw: unknown): Step[] {
  if (!obj(raw) || !Array.isArray(raw.steps) || !raw.steps.length) throw new UnsupportedDefinition('O formulário não contém etapas válidas.');
  const fieldKeys = new Set<string>();
  const steps = raw.steps.map((step: unknown): Step => {
    if (!obj(step) || !nonEmpty(step.key) || !nonEmpty(step.title) || !Array.isArray(step.fields) || !step.fields.length)
      throw new UnsupportedDefinition('Uma etapa não contém identificação, título ou campos.');
    const fields = step.fields.map((rawField: unknown): Field => {
      if (!obj(rawField) || !nonEmpty(rawField.key) || !nonEmpty(rawField.label) || !types.includes(rawField.type as FieldType))
        throw new UnsupportedDefinition('Um campo não possui tipo, chave ou rótulo válido.');
      if (fieldKeys.has(rawField.key)) throw new UnsupportedDefinition('O formulário repete a chave de um campo.');
      fieldKeys.add(rawField.key);
      const type = rawField.type as FieldType;
      const condition = rawField.visibleWhen;
      if (condition !== undefined && condition !== null && (!obj(condition) || !nonEmpty(condition.field) || !scalar(condition.equals)))
        throw new UnsupportedDefinition('Uma regra de visibilidade tem formato não suportado.');
      const policy = rawField.hiddenValuePolicy ?? 'CLEAR_ON_HIDE';
      if (policy !== 'CLEAR_ON_HIDE' && policy !== 'PRESERVE_ON_HIDE') throw new UnsupportedDefinition('Uma política de campo oculto é inválida.');
      const select = type === 'SINGLE_SELECT' || type === 'MULTI_SELECT';
      let addressFields: Field['addressFields'];
      if (type === 'ADDRESS') {
        if (!Array.isArray(rawField.addressFields) || !rawField.addressFields.length) throw new UnsupportedDefinition('Um endereço não possui componentes publicados.');
        addressFields = rawField.addressFields.map(part => {
          if (!obj(part) || !nonEmpty(part.key) || !nonEmpty(part.label)) throw new UnsupportedDefinition('Componente de endereço sem chave ou rótulo.');
          return { key: part.key, label: part.label, required: part.required === true,
            minLength: Number.isInteger(part.minLength) ? part.minLength as number : undefined,
            maxLength: Number.isInteger(part.maxLength) ? part.maxLength as number : undefined };
        });
        if (new Set(addressFields.map(part => part.key)).size !== addressFields.length) throw new UnsupportedDefinition('O endereço repete um componente.');
      }
      return { key: rawField.key, label: rawField.label, type, required: rawField.required === true,
        addressFields,
        helpText: typeof rawField.helpText === 'string' ? rawField.helpText : undefined,
        options: select ? optionsOf(rawField.options) : undefined,
        visibleWhen: condition ? { field: (condition as Record<string, unknown>).field as string, equals: (condition as Record<string, unknown>).equals as Scalar } : undefined,
        hiddenValuePolicy: policy,
        minLength: Number.isInteger(rawField.minLength) ? rawField.minLength as number : undefined,
        maxLength: Number.isInteger(rawField.maxLength) ? rawField.maxLength as number : undefined };
    });
    return { key: step.key, title: step.title, fields };
  });
  if (new Set(steps.map(s => s.key)).size !== steps.length) throw new UnsupportedDefinition('O formulário repete uma etapa.');
  for (const step of steps) for (const field of step.fields) {
    if (field.visibleWhen && !fieldKeys.has(field.visibleWhen.field)) throw new UnsupportedDefinition('Uma condição referencia campo desconhecido.');
  }
  return steps;
}
export function parseEligibility(raw: unknown): EligibilityRule[] {
  if (!Array.isArray(raw)) throw new UnsupportedDefinition('Os critérios de elegibilidade não têm formato válido.');
  return raw.map((rule: unknown): EligibilityRule => {
    if (!obj(rule) || !nonEmpty(rule.key) || !nonEmpty(rule.label)) throw new UnsupportedDefinition('Uma pergunta de elegibilidade não possui rótulo publicado.');
    const operator = (rule.operator ?? 'EQUALS') as EligibilityRule['operator'];
    if (!['TRUTHY','EQUALS','NOT_EQUALS','IN'].includes(operator)) throw new UnsupportedDefinition('Operador de elegibilidade não suportado.');
    const choices = rule.options === undefined && operator === 'TRUTHY' ? [{value:'true', label:'Sim'}, {value:'false', label:'Não'}] : optionsOf(rule.options);
    if (operator === 'TRUTHY' && choices.some(o => !['true','false'].includes(o.value))) throw new UnsupportedDefinition('As opções de elegibilidade não correspondem a valores booleanos.');
    const expected = rule.expected;
    if (operator !== 'TRUTHY' && !(operator === 'IN' ? Array.isArray(expected) && expected.every(scalar) : scalar(expected)))
      throw new UnsupportedDefinition('A comparação de elegibilidade não tem valor suportado.');
    return { key: rule.key, label: rule.label, required: rule.required !== false, operator, expected: expected as Scalar | Scalar[] | undefined,
      options: choices, failureMessage: typeof rule.failureMessage === 'string' ? rule.failureMessage : '', blocking: rule.blocking !== false };
  });
}
export function isVisible(field: Field, answers: Record<string, unknown>): boolean {
  return !field.visibleWhen || Object.is(answers[field.visibleWhen.field], field.visibleWhen.equals);
}
export function validateStep(step: Step, answers: Record<string, unknown>): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const field of step.fields.filter(f => isVisible(f, answers))) {
    const value = answers[field.key];
    const empty = value == null || value === '' || (Array.isArray(value) && value.length === 0) || (field.type === 'ADDRESS' && typeof value === 'object' && Object.values(value).every(part => part === ''));
    if (field.required && empty) { errors[field.key] = 'Preencha este campo.'; continue; }
    if (empty) continue;
    if (field.type === 'ADDRESS') {
      if (!obj(value) || !field.addressFields || Object.keys(value).some(key => !field.addressFields?.some(part => part.key === key) || typeof value[key] !== 'string')) {
        errors[field.key] = 'O endereço contém elementos inválidos.'; continue;
      }
      for (const part of field.addressFields) {
        const text = value[part.key] as string | undefined;
        if ((part.required && !text?.trim()) || (text && ((part.minLength !== undefined && text.length < part.minLength) || (part.maxLength !== undefined && text.length > part.maxLength))))
          errors[field.key] = 'Verifique os elementos obrigatórios e o comprimento do endereço.';
      }
    }
    if (typeof value === 'string' && field.minLength !== undefined && value.length < field.minLength) errors[field.key] = 'O valor é demasiado curto.';
    if (typeof value === 'string' && field.maxLength !== undefined && value.length > field.maxLength) errors[field.key] = 'O valor excede o limite permitido.';
    if (field.type === 'EMAIL' && typeof value === 'string' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) errors[field.key] = 'Introduza um endereço de email válido.';
    if (field.type === 'MULTI_SELECT' && (!Array.isArray(value) || value.some(item => typeof item !== 'string' || !field.options?.some(o => o.value === item)))) errors[field.key] = 'Seleccione opções publicadas.';
    if (field.type === 'SINGLE_SELECT' && !field.options?.some(o => o.value === value)) errors[field.key] = 'Seleccione uma opção publicada.';
  }
  return errors;
}
export function stepPatch(step: Step, answers: Record<string, unknown>, edited: Set<string>): Record<string, unknown> {
  return Object.fromEntries(step.fields.filter(field => edited.has(field.key) && isVisible(field, answers)).map(field => [field.key, answers[field.key] ?? null]));
}
