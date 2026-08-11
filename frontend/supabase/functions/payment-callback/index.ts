import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-payment-provider',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const body = await req.json()
    const provider = req.headers.get('x-payment-provider') || 'unknown'

    let paymentReference: string | null = null
    let paymentStatus: string
    let providerRef: string | null = null

    // Handle M-Pesa callback
    if (provider === 'mpesa' || body.input_TransactionReference) {
      paymentReference = body.input_ThirdPartyReference || body.input_TransactionReference
      paymentStatus = body.output_ResponseCode === 'INS-0' ? 'pago' : 'falhado'
      providerRef = body.output_TransactionID || null
    }
    // Handle e-Mola callback
    else if (provider === 'emola') {
      paymentReference = body.reference
      paymentStatus = body.status === 'success' ? 'pago' : 'falhado'
      providerRef = body.transaction_id || null
    }
    // Handle Visa/Stripe callback
    else if (provider === 'visa' || body.type?.startsWith('checkout.')) {
      paymentReference = body.data?.object?.metadata?.reference || body.reference
      paymentStatus = body.data?.object?.payment_status === 'paid' ? 'pago' : 'falhado'
      providerRef = body.data?.object?.payment_intent || null
    }
    // Generic callback
    else {
      paymentReference = body.reference || body.payment_reference
      paymentStatus = ['success', 'paid', 'completed'].includes(body.status) ? 'pago' : 'falhado'
      providerRef = body.transaction_id || null
    }

    if (!paymentReference) {
      return new Response(
        JSON.stringify({ error: 'Missing payment reference' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Find service request
    const { data: serviceRequest, error: findError } = await supabase
      .from('service_requests')
      .select('id')
      .eq('payment_reference', paymentReference)
      .single()

    if (findError || !serviceRequest) {
      console.error('Service request not found for reference:', paymentReference)
      return new Response(
        JSON.stringify({ error: 'Service request not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update payment record
    await supabase
      .from('payments')
      .update({
        status: paymentStatus,
        provider_reference: providerRef,
        metadata: body,
      })
      .eq('service_request_id', serviceRequest.id)

    // Update service request status
    const newStatus = paymentStatus === 'pago' ? 'em_processamento' : 'cancelado'
    await supabase
      .from('service_requests')
      .update({
        payment_status: paymentStatus,
        status: newStatus,
      })
      .eq('id', serviceRequest.id)

    console.log(`Payment callback processed: ref=${paymentReference}, status=${paymentStatus}`)

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Payment callback error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
