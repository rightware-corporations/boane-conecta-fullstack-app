import { describe, expect, it } from 'vitest';
import { isVisible, parseEligibility, parseSteps, stepPatch, validateStep } from './schema';

const types = ['SHORT_TEXT','LONG_TEXT','EMAIL','PHONE','DATE','SINGLE_SELECT','INTEGER','DECIMAL','MULTI_SELECT','BOOLEAN','ADDRESS'];
const field = (type: string, key = type) => ({ key, label: key, type, ...(type.includes('SELECT') ? { options: ['A','B'] } : {}), ...(type === 'ADDRESS' ? { addressFields: [{key:'part',label:'Componente',required:true}] } : {}) });
const schema = (fields: unknown[]) => ({ steps: [{ key: 'main', title: 'Publicado', fields }] });

describe('C2 runtime contract', () => {
  it.each(types)('recognizes backend type %s with the published field contract', type => {
    const parsed = parseSteps(schema([field(type)]));
    expect(parsed[0].fields[0].type).toBe(type);
    if (type === 'ADDRESS') expect(parsed[0].fields[0].options).toBeUndefined();
  });
  it('rejects a select without published labels or values', () => {
    expect(() => parseSteps(schema([{key:'selection',type:'SINGLE_SELECT',label:'Escolha',options:[{value:'x'}]}]))).toThrow('opção');
  });
  it('applies equality visibility, CLEAR_ON_HIDE in the active step, and preserves other fields', () => {
    const step = parseSteps(schema([
      { ...field('BOOLEAN','hasDetails') },
      { ...field('SHORT_TEXT','details'), visibleWhen: {field:'hasDetails',equals:true}, hiddenValuePolicy:'CLEAR_ON_HIDE' },
      { ...field('SHORT_TEXT','retained'), visibleWhen:{field:'hasDetails',equals:true}, hiddenValuePolicy:'PRESERVE_ON_HIDE' },
    ]))[0];
    const answers = {hasDetails:false,details:'old',retained:'old',otherStep:'must remain'};
    expect(isVisible(step.fields[1],answers)).toBe(false);
    expect(stepPatch(step, answers,new Set(['hasDetails','details','retained','otherStep']))).toEqual({hasDetails:false});
  });
  it('enforces required and email constraints on visible fields only', () => {
    const step = parseSteps(schema([{...field('EMAIL','email'),required:true,minLength:5}]))[0];
    expect(validateStep(step,{email:'x'})).toMatchObject({email:expect.any(String)});
    expect(validateStep(step,{email:'valid@example.test'})).toEqual({});
  });
  it('validates address components and preserves sibling fields', () => {
    const step = parseSteps(schema([{...field('ADDRESS','location'),required:true},field('SHORT_TEXT','note')]))[0];
    expect(validateStep(step,{note:'updated'})).toHaveProperty('location');
    expect(validateStep(step,{location:{part:'valor'},note:'updated'})).toEqual({});
    expect(stepPatch(step,{location:{opaque:'unchanged'},note:'updated'},new Set(['note']))).toEqual({note:'updated'});
  });
  it('blocks eligibility rules without a published label and accepts explicit supported rules', () => {
    expect(() => parseEligibility([{key:'resident',operator:'TRUTHY'}])).toThrow('rótulo');
    expect(parseEligibility([{key:'resident',label:'É residente?',operator:'TRUTHY'}])[0].options).toHaveLength(2);
  });
});
