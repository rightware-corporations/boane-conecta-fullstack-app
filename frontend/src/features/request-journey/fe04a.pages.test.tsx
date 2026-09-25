import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import RequestDocumentsPage from './RequestDocumentsPage';
import RequestReviewPage from './RequestReviewPage';
import { requestJourneyApi } from './request-journey.api';

vi.mock('./RequestJourneyShell', () => ({ RequestJourneyShell: ({ title, children }: { title:string; children:React.ReactNode }) => <main id="main-content" tabIndex={-1}><h1>{title}</h1>{children}</main> }));
vi.mock('./request-journey.api', () => ({ requestJourneyApi: { detail:vi.fn(),pinnedDefinition:vi.fn(),draftDocuments:vi.fn(),citizenDocuments:vi.fn(),upload:vi.fn(),attach:vi.fn(),detach:vi.fn(),validate:vi.fn() } }));
const id='22222222-2222-4222-8222-222222222222';
const draft={ id,serviceId:id,serviceVersionId:id,formVersionId:id,status:'IN_PROGRESS',expiresAt:'2099-01-01T00:00:00Z',answers:{name:'QA'},eligibilityAnswers:{},eligibilityResult:null,version:4 };
const definition={ serviceId:id,serviceVersionId:id,formVersionId:id,serviceTitle:'Serviço QA',schema:{steps:[{key:'intro',title:'Dados',fields:[{key:'name',label:'Nome',type:'SHORT_TEXT'}]}]},eligibility:[],documentRequirements:[{key:'proof',title:'Comprovativo QA',required:true,acceptedMimeTypes:['application/pdf'],maxSizeBytes:10240}],declarationVersion:'1',declarationText:'Declaração QA.' };
const document={id,originalFileName:'qa.pdf',mimeType:'application/pdf',fileSize:1,status:'VALID'};
function at(page:'documentos'|'revisao') { render(<MemoryRouter initialEntries={[`/municipe/pedidos/rascunhos/${id}/${page}`]}><Routes><Route path="/municipe/pedidos/rascunhos/:draftId/documentos" element={<RequestDocumentsPage/>}/><Route path="/municipe/pedidos/rascunhos/:draftId/revisao" element={<RequestReviewPage/>}/></Routes></MemoryRouter>); }
beforeEach(()=>{ vi.clearAllMocks(); vi.mocked(requestJourneyApi.detail).mockResolvedValue({draft,etag:'"4"'} as never); vi.mocked(requestJourneyApi.pinnedDefinition).mockResolvedValue(definition as never); vi.mocked(requestJourneyApi.draftDocuments).mockResolvedValue([]); vi.mocked(requestJourneyApi.citizenDocuments).mockResolvedValue([document] as never); });

describe('FE-04a S04/S05',()=>{
  it('associates only VALID documents using the draft ETag',async()=>{
    vi.mocked(requestJourneyApi.attach).mockResolvedValue({draft:{...draft,version:5},etag:'"5"'} as never);
    at('documentos');
    fireEvent.change(await screen.findByLabelText('Documento validado disponível'),{target:{value:id}});
    await waitFor(()=>expect(requestJourneyApi.attach).toHaveBeenCalledWith(id,'proof',id,'"4"'));
    expect(await screen.findByText(/Associação confirmada/)).toBeInTheDocument();
  });
  it('does not offer scanner pending documents for association',async()=>{
    vi.mocked(requestJourneyApi.citizenDocuments).mockResolvedValue([{...document,status:'PENDING'}] as never);
    at('documentos');
    expect(await screen.findByText(/Ainda não pode ser associado/)).toBeInTheDocument();
    expect(screen.getByLabelText('Documento validado disponível')).toBeDisabled();
  });
  it('holds an uncertain upload without automatically repeating it',async()=>{
    vi.mocked(requestJourneyApi.upload).mockRejectedValue(new TypeError('timeout'));
    at('documentos');
    fireEvent.change(await screen.findByLabelText('Enviar documento para verificação'),{target:{files:[new File(['x'],'qa.pdf',{type:'application/pdf'})]}});
    expect(await screen.findByText(/Resultado do envio desconhecido/)).toBeInTheDocument();
    expect(requestJourneyApi.upload).toHaveBeenCalledTimes(1);
  });
  it('requires backend validation before enabling declaration acceptance',async()=>{
    vi.mocked(requestJourneyApi.validate).mockResolvedValue({validation:{valid:true,fieldErrors:[],documentErrors:[],globalErrors:[],draft},detail:{draft,etag:'"4"'}} as never);
    at('revisao');
    expect(await screen.findByText('Declaração QA.')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeDisabled();
    fireEvent.click(screen.getByRole('button',{name:'Validar rascunho no servidor'}));
    await waitFor(()=>expect(requestJourneyApi.validate).toHaveBeenCalledWith(id,'"4"'));
    fireEvent.click(screen.getByRole('checkbox'));
    expect(screen.getByText(/A submissão ainda não está disponível/)).toBeInTheDocument();
  });
  it('shows backend field and requirement errors without accepting declaration',async()=>{
    vi.mocked(requestJourneyApi.validate).mockResolvedValue({validation:{valid:false,fieldErrors:[{code:'REQUIRED',fieldKey:'name',message:'Campo obrigatório'}],documentErrors:[{code:'DOCUMENT_REQUIRED',requirementKey:'proof',message:'Documento obrigatório'}],globalErrors:[],draft},detail:{draft,etag:'"4"'}} as never);
    at('revisao');
    fireEvent.click(await screen.findByRole('button',{name:'Validar rascunho no servidor'}));
    expect(await screen.findByText(/Campo obrigatório/)).toBeInTheDocument();
    expect(screen.getByText(/Documento obrigatório/)).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });
});
