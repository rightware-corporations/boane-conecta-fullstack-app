import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ApiError } from '@/lib/api';
import RequestEligibilityPage from './RequestEligibilityPage';
import RequestFormPage from './RequestFormPage';
import { requestJourneyApi } from './request-journey.api';

vi.mock('./RequestJourneyShell', () => ({ RequestJourneyShell: ({ title, children }: {title:string;children:React.ReactNode}) => <main id="main-content" tabIndex={-1}><h1>{title}</h1>{children}</main> }));
vi.mock('./request-journey.api', () => ({ requestJourneyApi: { detail:vi.fn(),pinnedDefinition:vi.fn(),saveEligibility:vi.fn(),saveAnswers:vi.fn() } }));
const id='22222222-2222-4222-8222-222222222222', serviceId='11111111-1111-4111-8111-111111111111';
const draft={ id,serviceId,serviceVersionId:serviceId,formVersionId:id,status:'IN_PROGRESS',expiresAt:'2099-01-01T00:00:00Z',currentStepKey:'intro',answers:{name:'old'},eligibilityAnswers:{},eligibilityResult:{eligible:true,blockingReasons:[],advisories:[]},version:4 };
const definition={serviceId,serviceVersionId:serviceId,formVersionId:id,serviceTitle:'Serviço de QA',schema:{steps:[{key:'intro',title:'Introdução',fields:[{key:'name',type:'SHORT_TEXT',label:'Nome',required:true}]}]},eligibility:[{key:'resident',label:'Residente?',operator:'TRUTHY'}]};
const at=(page:'formulario'|'elegibilidade',path=`/municipe/pedidos/rascunhos/${id}/${page}`)=>render(<MemoryRouter initialEntries={[path]}><Routes><Route path="/municipe/pedidos/rascunhos/:draftId/formulario" element={<RequestFormPage/>}/><Route path="/municipe/pedidos/rascunhos/:draftId/elegibilidade" element={<RequestEligibilityPage/>}/></Routes></MemoryRouter>);
beforeEach(()=>{ vi.clearAllMocks(); vi.mocked(requestJourneyApi.detail).mockResolvedValue({draft,etag:'"4"'} as never); vi.mocked(requestJourneyApi.pinnedDefinition).mockResolvedValue(definition as never); });
describe('FE-03b S02/S03',()=>{
 it('blocks an old pinned definition before rendering answers or mutating',async()=>{
  vi.mocked(requestJourneyApi.pinnedDefinition).mockResolvedValue({...definition,formVersionId:serviceId} as never);
  at('formulario');
  expect(await screen.findByText(/versão fixada deste rascunho não está disponível/)).toBeInTheDocument();
  expect(screen.queryByLabelText('Nome *')).not.toBeInTheDocument();
  expect(requestJourneyApi.saveAnswers).not.toHaveBeenCalled();
 });
 it('PUTs eligibility with exact ETag, blocks progress until confirmed, and presents backend reasons',async()=>{
  vi.mocked(requestJourneyApi.saveEligibility).mockResolvedValue({draft:{...draft,eligibilityAnswers:{resident:false},eligibilityResult:{eligible:false,blockingReasons:['Motivo publicado'],advisories:['Aviso publicado']}},etag:'"5"'} as never);
  at('elegibilidade');
  fireEvent.change(await screen.findByLabelText('Residente? *'),{target:{value:'false'}});
  fireEvent.click(screen.getByRole('button',{name:'Verificar elegibilidade'}));
  await waitFor(()=>expect(requestJourneyApi.saveEligibility).toHaveBeenCalledWith(id,'"4"',{resident:false}));
  expect(await screen.findByText('Motivo publicado')).toBeInTheDocument();
  expect(screen.getByText('Aviso publicado')).toBeInTheDocument();
  expect(screen.queryByRole('link',{name:'Continuar para o formulário'})).not.toBeInTheDocument();
 });
 it('PATCHes only edited field and moves saved state on confirmed 200 with ETag',async()=>{
  vi.mocked(requestJourneyApi.saveAnswers).mockResolvedValue({draft:{...draft,answers:{name:'new'},version:5},etag:'"5"'} as never);
  at('formulario');
  fireEvent.change(await screen.findByLabelText('Nome *'),{target:{value:'new'}});
  fireEvent.click(screen.getByRole('button',{name:'Guardar alterações'}));
  await waitFor(()=>expect(requestJourneyApi.saveAnswers).toHaveBeenCalledWith(id,'"4"','intro',{name:'new'}));
  expect(await screen.findByText('Alterações guardadas no servidor.')).toBeInTheDocument();
 });
 it('retains local edit after two-tab 409 and requires explicit reconciliation before another PATCH',async()=>{
  vi.mocked(requestJourneyApi.saveAnswers).mockRejectedValueOnce(new ApiError(409,'Conflict')).mockResolvedValueOnce({draft:{...draft,answers:{name:'local'},version:6},etag:'"6"'} as never);
  vi.mocked(requestJourneyApi.detail).mockResolvedValueOnce({draft,etag:'"4"'} as never).mockResolvedValueOnce({draft:{...draft,answers:{name:'remote'},version:5},etag:'"5"'} as never);
  at('formulario');
  fireEvent.change(await screen.findByLabelText('Nome *'),{target:{value:'local'}});
  fireEvent.click(screen.getByRole('button',{name:'Guardar alterações'}));
  expect(await screen.findByText(/servidor está na versão 5/)).toBeInTheDocument();
  expect(screen.getByLabelText('Nome *')).toHaveValue('local');
  expect(requestJourneyApi.saveAnswers).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole('button',{name:'Conservar edições locais e usar ETag actual'}));
  fireEvent.click(screen.getByRole('button',{name:'Guardar alterações'}));
  await waitFor(()=>expect(requestJourneyApi.saveAnswers).toHaveBeenLastCalledWith(id,'"5"','intro',{name:'local'}));
 });
 it('keeps an uncertain 401 write without automatic replay',async()=>{
  vi.mocked(requestJourneyApi.saveAnswers).mockRejectedValue(new ApiError(401,'Unauthorized'));
  vi.mocked(requestJourneyApi.detail).mockResolvedValueOnce({draft,etag:'"4"'} as never).mockRejectedValueOnce(new ApiError(401,'Unauthorized'));
  at('formulario');
  fireEvent.change(await screen.findByLabelText('Nome *'),{target:{value:'local'}});
  fireEvent.click(screen.getByRole('button',{name:'Guardar alterações'}));
  expect(await screen.findByText(/Resultado da gravação por confirmar/)).toBeInTheDocument();
  expect(requestJourneyApi.saveAnswers).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('button',{name:'Guardar alterações'})).toBeDisabled();
 });
 it('refuses invalid stepKey without sending a mutation',async()=>{
  at('formulario',`/municipe/pedidos/rascunhos/${id}/formulario?step=unknown`);
  expect(await screen.findByText(/Etapa desconhecida/)).toBeInTheDocument();
  expect(requestJourneyApi.saveAnswers).not.toHaveBeenCalled();
 });
 it('saves a sibling field without editing or erasing a blocked address',async()=>{
  vi.mocked(requestJourneyApi.pinnedDefinition).mockResolvedValue({...definition,schema:{steps:[{key:'intro',title:'Introdução',fields:[
    {key:'name',type:'SHORT_TEXT',label:'Nome'}, {key:'address',type:'ADDRESS',label:'Endereço',required:true,addressFields:[{key:'part',label:'Elemento'}]}
  ]}]}} as never);
  vi.mocked(requestJourneyApi.saveAnswers).mockResolvedValue({draft:{...draft,answers:{name:'new',address:{original:'preserved'}}},etag:'"5"'} as never);
  at('formulario');
  fireEvent.change(await screen.findByLabelText('Nome'),{target:{value:'new'}});
  expect(screen.getByLabelText('Elemento')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:'Guardar alterações'}));
  await waitFor(()=>expect(requestJourneyApi.saveAnswers).toHaveBeenCalledWith(id,'"4"','intro',{name:'new'}));
 });
});
