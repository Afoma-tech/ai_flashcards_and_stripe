import { NextResponse } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)  

const formatAmountForStripe = (amount, currency) =>{
    return Math.round(amount*100)
}

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams
  const session_id = searchParams.get("session_id")

  try{
    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id)
    return NextResponse.json(checkoutSession)
  } catch(err){
    console.error("Error retreiving checkout sessions.",err)
    return NextResponse.json({error: {message: err.message}}, {status: 500})
  }



}



export async function POST(req) {
  //console.log(req.headers.get("origin"))
// Create Checkout Sessions from body params.
const params  = {
  mode: 'subscription',
  payment_method_types: ['card'],
  line_items: [
    {
      price_data:{
        currency: "usd",
        product_data:{
            name: "Pro subscription"
        },
        unit_amount: formatAmountForStripe(5),
        recurring:{
            interval: "month",
            interval_count: 1
        }
      },
      quantity: 1,
    },
  ],
  success_url: `${req.headers.get("origin")}/result?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${req.headers.get("origin")}/result?session_id={CHECKOUT_SESSION_ID}`,
};
const checkoutSession  =
  await stripe.checkout.sessions.create(params);

return NextResponse.json(checkoutSession,{
    status: 200
})
// ...


}


//console.log(cancel_url)