import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

interface PaymentRequest {
  service_id: string
  service_name: string
  citizen_name: string
  citizen_phone: string
  citizen_email?: string
  citizen_nif?: string
  payment_method: 'mpesa' | 'emola' | 'visa'
  phone_number?: string
  total_amount: number
}

function generateReference(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `CMB-${timestamp}-${random}`.toUpperCase()
}

async function initiateMpesaPayment(amount: number, phoneNumber: string, reference: string) {
  const apiKey = Deno.env.get('MPESA_API_KEY')
  const publicKey = Deno.env.get('MPESA_PUBLIC_KEY')
  const serviceProviderCode = Deno.env.get('MPESA_SERVICE_PROVIDER_CODE')

  if (!apiKey || !publicKey || !serviceProviderCode) {
    console.warn('M-Pesa credentials not configured — using simulation mode')
    return {
      success: true,
      reference,
      simulated: true,
      message: 'Pagamento simulado. Configure as credenciais M-Pesa para produção.',
    }
  }

  // Generate Bearer token (RSA encryption of API key with public key)
  // In production, implement proper RSA token generation
  const bearerToken = apiKey

  const response = await fetch('https://api.sandbox.vm.co.mz/ipg/v1x/c2bPayment/singleStage/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bearerToken}`,
      'Origin': 'developer.mpesa.vm.co.mz',
    },
    body: JSON.stringify({
      input_TransactionReference: reference,
      input_CustomerMSISDN: phoneNumber,
      input_Amount: amount.toString(),
      input_ThirdPartyReference: reference,
      input_ServiceProviderCode: serviceProviderCode,
    }),
  })

  const data = await response.json()
  return {
    success: data.output_ResponseCode === 'INS-0',
    reference,
    provider_reference: data.output_TransactionID,
    response_code: data.output_ResponseCode,
    response_desc: data.output_ResponseDesc,
  }
}

async function initiateEmolaPayment(amount: number, phoneNumber: string, reference: string) {
  const apiKey = Deno.env.get('EMOLA_API_KEY')
  const apiSecret = Deno.env.get('EMOLA_API_SECRET')

  if (!apiKey || !apiSecret) {
    console.warn('e-Mola credentials not configured — using simulation mode')
    return {
      success: true,
      reference,
      simulated: true,
      message: 'Pagamento simulado. Configure as credenciais e-Mola para produção.',
    }
  }

  // TODO: Implement real e-Mola API call based on provider documentation
  return {
    success: true,
    reference,
    message: 'Pagamento iniciado. Verifique o seu telemóvel para confirmar.',
  }
}

async function initiateVisaPayment(amount: number, reference: string) {
  const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')

  if (!stripeKey) {
    console.warn('Stripe/Visa credentials not configured — using simulation mode')
    return {
      success: true,
      reference,
      simulated: true,
      message: 'Pagamento simulado. Configure as credenciais Stripe para produção.',
    }
  }

  // TODO: Create Stripe Checkout session for card payments
  return {
    success: true,
    reference,
    checkout_url: null,
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const body: PaymentRequest = await req.json()

    // Validate required fields
    if (!body.service_id || !body.citizen_name || !body.citizen_phone || !body.payment_method || !body.total_amount) {
      return new Response(
        JSON.stringify({ error: 'Campos obrigatórios em falta' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (body.total_amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Valor inválido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const paymentReference = generateReference()

    // Create service request
    const { data: serviceRequest, error: srError } = await supabase
      .from('service_requests')
      .insert({
        service_id: body.service_id,
        service_name: body.service_name,
        citizen_name: body.citizen_name,
        citizen_phone: body.citizen_phone,
        citizen_email: body.citizen_email || null,
        citizen_nif: body.citizen_nif || null,
        payment_method: body.payment_method,
        payment_reference: paymentReference,
        total_amount: body.total_amount,
        status: 'pendente',
        payment_status: 'processando',
      })
      .select()
      .single()

    if (srError) {
      console.error('Service request creation error:', srError)
      throw new Error(`Erro ao criar pedido: ${srError.message}`)
    }

    // Initiate payment
    const phoneNumber = body.phone_number || body.citizen_phone
    let paymentResult: Record<string, unknown>

    try {
      switch (body.payment_method) {
        case 'mpesa':
          paymentResult = await initiateMpesaPayment(body.total_amount, phoneNumber, paymentReference)
          break
        case 'emola':
          paymentResult = await initiateEmolaPayment(body.total_amount, phoneNumber, paymentReference)
          break
        case 'visa':
          paymentResult = await initiateVisaPayment(body.total_amount, paymentReference)
          break
        default:
          throw new Error('Método de pagamento inválido')
      }
    } catch (paymentError) {
      await supabase
        .from('service_requests')
        .update({ payment_status: 'falhado', status: 'cancelado' })
        .eq('id', serviceRequest.id)
      throw paymentError
    }

    // Create payment record
    const { error: paymentDbError } = await supabase
      .from('payments')
      .insert({
        service_request_id: serviceRequest.id,
        amount: body.total_amount,
        payment_method: body.payment_method,
        phone_number: body.payment_method !== 'visa' ? phoneNumber : null,
        status: (paymentResult as Record<string, unknown>).simulated ? 'pago' : 'processando',
        provider_reference: (paymentResult as Record<string, unknown>).provider_reference as string || null,
        metadata: paymentResult as Record<string, unknown>,
      })

    if (paymentDbError) {
      console.error('Payment record creation error:', paymentDbError)
    }

    // If simulated, also mark request as paid
    if ((paymentResult as Record<string, unknown>).simulated) {
      await supabase
        .from('service_requests')
        .update({ payment_status: 'pago', status: 'em_processamento' })
        .eq('id', serviceRequest.id)
    }

    return new Response(
      JSON.stringify({
        success: true,
        payment_reference: paymentReference,
        service_request_id: serviceRequest.id,
        simulated: !!(paymentResult as Record<string, unknown>).simulated,
        message: (paymentResult as Record<string, unknown>).simulated
          ? 'Pagamento processado com sucesso (modo simulação).'
          : body.payment_method === 'visa'
            ? 'Redirecionando para página de pagamento...'
            : 'Pagamento iniciado. Verifique o seu telemóvel para confirmar.',
        checkout_url: (paymentResult as Record<string, unknown>).checkout_url || null,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Payment processing error:', error)
    return new Response(
      JSON.stringify({ error: (error as Error).message || 'Erro no processamento do pagamento' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
