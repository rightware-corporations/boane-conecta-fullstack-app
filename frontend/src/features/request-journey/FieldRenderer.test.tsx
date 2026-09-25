import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FieldRenderer } from './FieldRenderer';
import { parseSteps } from './schema';

const types = ['SHORT_TEXT','LONG_TEXT','EMAIL','PHONE','DATE','SINGLE_SELECT','INTEGER','DECIMAL','MULTI_SELECT','BOOLEAN','ADDRESS'];
describe('S03 accessible field renderer',()=>{
  it.each(types)('renders backend field type %s with a published label or a clear block',type=>{
    const raw={key:'test',label:'Dado publicado',type,options:['A','B']};
    const field=parseSteps({steps:[{key:'first',title:'Primeiro',fields:[raw]}]})[0].fields[0];
    render(<FieldRenderer field={field} value={null} disabled={false} onChange={vi.fn()} />);
    expect(screen.getAllByText('Dado publicado').length).toBeGreaterThan(0);
    if(type==='ADDRESS') expect(screen.getByRole('alert')).toHaveTextContent('não tem estrutura publicada');
    else if(type==='MULTI_SELECT') expect(screen.getByRole('group',{name:'Dado publicado'})).toBeInTheDocument();
    else expect(screen.getByLabelText('Dado publicado')).toBeInTheDocument();
  });
  it('binds help and error to the field without relying on placeholder text',()=>{
    const field=parseSteps({steps:[{key:'first',title:'Primeiro',fields:[{key:'name',type:'SHORT_TEXT',label:'Nome',helpText:'Ajuda publicada'}]}]})[0].fields[0];
    render(<FieldRenderer field={field} value="" error="Preencha este campo." disabled={false} onChange={vi.fn()} />);
    expect(screen.getByLabelText('Nome')).toHaveAttribute('aria-describedby','field-name-help field-name-error');
    expect(screen.getByRole('alert')).toHaveTextContent('Preencha este campo.');
  });
});
