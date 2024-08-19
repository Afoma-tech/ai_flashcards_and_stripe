"use client"

import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Box, Button, Container, Grid, Toolbar, Typography } from "@mui/material";
import Head from "next/head";

export default function Home() {
  const handleSubmit = async() =>{
    const checkoutSession = await fetch("/api/checkout_session",{
      method: "POST",
      headers: {
        origin: "http://localhost:3000"
      },
    })
    console.log(checkoutSession)
    const checkoutSessionJSON = await checkoutSession.json()  //problem

    if(checkoutSession.statusCode === 500){
      console.error(checkoutSession.message)
      return
    }

    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJSON.id
    })
    if(error){
      console.warn(error.message)
    }

  }



  return (
   <>
      <Head>
        <title>Flashcard SAAS</title>
        <meta name="description" content="Create flashcard from your text"></meta>
      </Head>

      <AppBar position="static" style={{flexGrow: 1}}>
        <Toolbar>
          <Typography variant="h6" sx={{flexGrow:1}}>Flashcard SAAS</Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">Login</Button>
            <Button color="inherit" href="/sign-up">Sign up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton/>
          </SignedIn>
        </Toolbar>
      </AppBar>
       <Container maxWidth="100vw">
      <Box sx={{textAlign:"center", my:4}}>
        <Typography variant="h2" sx={{flexGrow:1}}>Welcome to Flashcard SaaS</Typography>
        <Typography variant="h5">{"  "}The easiest way to make flashcards</Typography>
        <Button variant="contained" color="primary" sx={{mt:2}} href="/sign-in">Get started</Button>
      </Box>
      <Box sx={{my:6}}>
        <Typography variant="h4" components="h2">Features</Typography>
        <Grid contained="true" spacing={4}>
          <Grid item xs={4} md={4}>
            <Typography variant="h6">Easy Text Input</Typography>
            <Typography>
              {"  "}
              Simply input your text and let our software do the rest. Creating flashcards has never been easier.
            </Typography>
          </Grid>
        </Grid>

        
        <Grid contained="true" spacing={4}>
          <Grid item xs={4} md={4}>
            <Typography variant="h6">Smart Flashcards</Typography>
            <Typography>
              {"  "}
              Our AI intelligently breaks down your text into concise flashcards, perfect for studying.
            </Typography>
          </Grid>
        </Grid>

       
        <Grid contained="true" spacing={4}>
          <Grid item xs={4} md={4}>
            <Typography variant="h6">Accessible Anywhere</Typography>
            <Typography>
              {"  "}
              Access your flashcards from any device, at any time. Study on the go with ease
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{my:6, textAlign: "center"}}>
        <Typography variant="h4" >Pricing</Typography>
         
            <Grid container spacing={4} >
          <Grid item xs={12} md={6} >
            <Box sx={{p:3, border: "1px solid", borderColor: "grey", borderRadius: 2}}>  
            <Typography variant="h5" >Free</Typography>
            <Typography variant="h6">$0/month</Typography>
            <Typography>
              {"  "}
              Access basic flashcard features and limited storage
            </Typography>
            <Button variant="contained" href="/sign-in"> Choose Free</Button>
            </Box>
          </Grid>
       
       
        
       
          <Grid item xs={12} md={6}>
            <Box sx={{p:3, border: "1px solid", borderColor: "grey", borderRadius: 2}} >  
            <Typography variant="h5">Pro</Typography>
            <Typography variant="h6" >$5/month</Typography>
            <Typography>
              {"  "}
              Unlimited flashcard features and limited storage, with priority support
            </Typography>
            <Button variant="contained" onClick={handleSubmit}> Choose Pro</Button>
            </Box>
        </Grid>

        </Grid>
        
      </Box>
    </Container>    
    </>
  );
}
