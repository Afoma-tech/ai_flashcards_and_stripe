 import { NextResponse } from "next/server";
 import OpenAI from "openai";

 const systemPrompt = `
   You are a flashcard creator. Your task is to generate concise and effective flashcards based on the given topic or content. Follow these steps:
   1. Create clear and concise questions for the front of the front of the flahcard.
   2. Provide accurate and informative answers for the back of the flashcard.
   3. Ensure that each flashcard focuses on a single concept or a piece of information.
   4. Use simple language to make the flashcard accessible to a wide range of learners.
   5. Include a variety of question types, such as definitions, examples, comparisons and applications.
   6. Aim to create a balanced set of flashcards that covers the topic comprehensively.
   7. Only generate 10 flashcards

    Remember the goal is to faciliatate effective learning and retention of information through these flashcards.

   Return in the following JSON format 
   {
    "flashcards": [{
        "front":str,
        "back":str,
   }]
   }

 `

 export async function POST(req){
    const openai = new OpenAI()
    const data = await req.text()

    const completion = await openai.chat.completions.create({
        messages:[
            {role: "system", content: systemPrompt},
            {role:"user", content: data}
        ],
        model: "gpt-4o",
        response_format: {type:"json_object"},
    })
    const flashcards = JSON.parse(completion.choices[0].message.content)
    console.log(flashcards.flashcards)
    return NextResponse.json(flashcards.flashcards)
 }