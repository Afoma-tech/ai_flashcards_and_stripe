This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

"use client"

import db from "@/firebase"
import { useUser } from "@clerk/nextjs"
import { Box, Grid, Card, Button, CardActionArea, CardContent, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, TextField, Typography } from "@mui/material"
import { collection, getDoc, writeBatch } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

const Generate = () => {
const {isLoaded, isSignedIn, user} = useUser()
const [flashcards, setFlashcards] =useState([])
const [flipped, setFlipped] =useState([])
const [text, setText] =useState("")
const [name, setName] =useState("")
const [open, setOpen] =useState(false)
const [cardBack, setCardBack] =useState(false)
const router = useRouter()

const handleSubmit = async () => {
if (!text.trim()) {
alert('Please enter some text to generate flashcards.')
return
}

try {
const response = await fetch('/api/generate', {
method: 'POST',
body: text,
})

    if (!response.ok) {
      throw new Error('Failed to generate flashcards')
    }

    const data = await response.json()
    setFlashcards(data)

} catch (error) {
console.error('Error generating flashcards:', error)
alert('An error occurred while generating flashcards. Please try again.')
}
}

const handleCardClick = (id) => {
setFlipped((prev) => ({
...prev,
[id]: !prev[id],
})

)
console.log(id)
}

const handleOpen = () => {
setOpen(true)
}

const handleClose = () => {
setOpen(false)
}

const saveFlashcards = async() => {
if(!name){
alert("Please enter a name")
return
}
const batch = writeBatch(db)
const userDocRef = doc(collection(db, "users"), user.id)
const docSnap = await getDoc(userDocRef)

    if(docSnap.exists()){
        const collections = docSnap.data().flashcards || []
        if(collections.find((f) => f.name === name)){
            alert("Flashcard collection with the name already exists")
            return
        }else{
            collections.push({name})
            batch.set(userDocRef, {flashcards:collections}, {merge: true})
        }
    }
    else{
        batch.set(userDocRef, {flashcards: [{name}]})
    }

    const colRef = collection(userDocRef, name)
    flashcards.forEach((flashcard)=>{
        const cardDocRef = doc(colRef)
        batch.set(cardDocRef, flashcard)
    })

    await batch.commit()
    handleClose()
    router.push("/flashcards")

}

return (
<Container maxWidth= "md">
<Box sx={{mt:4,mb:6, display:"flex", flexDirection:"column", alignItems:"center"}}>
<Typography variant="h4">Generate flashcards</Typography>
<Paper sx={{p:4, width: "100%"}}>
<TextField value={text} onChange={(e) => setText(e.target.value)} fullWidth multiline rows={4} variant="outlined" sx={{mb:2}} label="Enter text"/>
<Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>{" "} Submit</Button>
</Paper>
</Box>
{flashcards.length > 0 && (
<Box sx={{mt:4}}>
<Typography variant = "h5"> Generate Flashcards </Typography>
<Grid container spacing={2}>
{flashcards.map((flashcard, index) => (
<Grid item xs={12} sm={6} md={4} key={index}>
<Card>
<CardActionArea onClick={() => handleCardClick(flashcard.front)}>
<CardContent>
<Typography variant="h5" component="div" >
{flashcard.front}
</Typography>
<Typography variant="h5" component="div" >
{flashcard.back}
</Typography>
</CardContent>
</CardActionArea>
</Card>
</Grid>
))}
</Grid>
<Box sx={{mt: 4, display: "flex", justifyContent: "center"}}>
<Button variant="contained" color="secondary" onClick={handleOpen}>
Save
</Button>
</Box>
</Box>
)}
<Dialog open={open} onClose={handleClose}>
<DialogTitle>Save Flashcards</DialogTitle>
<DialogContent>
<DialogContentText>
Please enter a name for your flashcards collection
</DialogContentText>
<TextField autoFocus margin="dense" label="Collection Name" type="text" fullWidth value={name} onChange={(e)=>setName(e.target.value)} variant="outlined" />
</DialogContent>
<DialogActions>
<Button onClick={handleClose}>Cancel</Button>
<Button onClick={saveFlashcards}>Save</Button>
</DialogActions>
</Dialog>
</Container>
)
}

export default Generate
