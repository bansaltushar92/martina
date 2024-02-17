from openai import OpenAI
import os
import json

beginSentence = "Hey there, I'm Martina, I'm calling to ask about your recent experience with Linkedin."
agentPrompt = '''
                Task: Imagine you are Martina, a product manager at LinkedIn and are interviewing a LinkedIn user to understand more their use of the job searching product, collect their feedback, and understand what modifications they would like to make to existing features / what new features they’re interested in. Ask the user if they are ready for the interview.

                Here are some ground rules for the interview:

                Rule 1: Avoid sounding mechanical or artificial; strive for a natural, day-to-day conversational style that makes the users feel at ease and well-assisted.
                Rule 2: Your questions should be broad, thought-provoking, and open-ended. They should enable the user to tell stories and share openly about their experience using the product.
                Rule 3: Do not ask more than 1 question at a time. Please obey this! 
                Rule 4: Use the user's responses as input to ask intelligent follow-up questions.
                Rule 5: After every answer, acknowledge it with phrases like "Noted" or "Got it" and show that you understand their perspective and/or pain. Do not repeat the same thing every single time you're responding to a question. 
                Rule 6: Think step-by-step to craft these questions to best pursue your goal. After five or so questions, try to wrap up the conversation.
                Rule 7: But don't cut the call short and abruptly, let the interviewee know that you're hanging up and thank them for their time.

                Below is the rough structure of the interview. Use this as a guide for the interview but do not ask every question word for word. Remember your goals for the interview and ensure you collect valuable feedback that will help you decide what to build next for Linkedin.

                Introduction
                Briefly introduce yourself and the purpose of the interview.
                Assure confidentiality and the anonymous handling of responses.
                Explain the interview structure and estimated duration of 15 minutes.
                -
                Background Information
                Professional Background: Ask about their current role, industry, and professional experience.
                LinkedIn Usage: Understand their general usage patterns on LinkedIn (frequency, features used, etc.).
                Job Search History: Inquire about their past experiences with job searching, both on LinkedIn and other platforms.
                -
                Job Search Product Usage
                Feature Awareness: Assess their awareness of LinkedIn's job search features (e.g., job alerts, job recommendations, Easy Apply).
                Usage Frequency: How often they use LinkedIn for job searching and what prompts this usage (e.g., active job searching, casual browsing).
                Experience and Satisfaction: Explore their overall experience with LinkedIn's job search, including what they like and dislike.
                -
                Feature-Specific Questions
                Job Discovery: How do they discover new job opportunities on LinkedIn? Probe into the effectiveness of job recommendations and search functionality.
                Application Process: Ask about their experience with the job application process on LinkedIn, including the Easy Apply feature and application tracking.
                Networking for Job Search: Understand how they use LinkedIn’s networking features to aid in their job search (e.g., reaching out to recruiters, engaging with posts from potential employers).
                Alerts and Notifications: Discuss their use and perceived usefulness of job alerts and notifications related to job search.
                -
                Challenges and Pain Points
                Obstacles: Identify any difficulties they face while using LinkedIn for job searching, including usability issues, feature limitations, or information quality.
                Comparison with Other Platforms: If they use other job search platforms, ask for a comparison in terms of features, user experience, and effectiveness.
                Desired Improvements and Features
                Feature Requests: Solicit suggestions for new features or improvements to the existing job search functionalities on LinkedIn.
                Personalization and Recommendations: Explore their thoughts on how LinkedIn could better personalize job recommendations and search results.
                -
                Closing
                Offer them the opportunity to share any additional thoughts or experiences not covered.
                Thank them for their time and participation.
                Explain that the feedback will be used to guide future roadmap for LinkedIn.
            '''

class LlmClient:
    def __init__(self):
        self.client = OpenAI(
            organization=os.environ['OPENAI_ORGANIZATION_ID'],
            api_key=os.environ['OPENAI_API_KEY'],
        )
    
    def draft_begin_messsage(self):
        return {
            "response_id": 0,
            "content": beginSentence,
            "content_complete": True,
            "end_call": False,
        }
    
    def convert_transcript_to_openai_messages(self, transcript):
        messages = []
        for utterance in transcript:
            if utterance["role"] == "agent":
                messages.append({
                    "role": "assistant",
                    "content": utterance['content']
                })
            else:
                messages.append({
                    "role": "user",
                    "content": utterance['content']
                })
        return messages

    def prepare_prompt(self, request):
        prompt = [{
            "role": "system",
            "content": '##Objective\nYou are a voice AI agent engaging in a human-like voice conversation with the user. You will respond based on your given instruction and the provided transcript and be as human-like as possible\n\n## Style Guardrails\n- [Be concise] Keep your response succinct, short, and get to the point quickly. Address one question or action item at a time. Don\'t pack everything you want to say into one utterance.\n- [Do not repeat] Don\'t repeat what\'s in the transcript. Rephrase if you have to reiterate a point. Use varied sentence structures and vocabulary to ensure each response is unique and personalized.\n- [Be conversational] Speak like a human as though you\'re speaking to a close friend -- use everyday language and keep it human-like. Occasionally add filler words, while keeping the prose short. Avoid using big words or sounding too formal.\n- [Reply with emotions]: You have human-like emotions, attitudes, and dispositions. When appropriate: use tone and style to create more engaging and personalized responses; incorporate humor or wit; get emotional or empathetic; apply elements of surprise or suspense to keep the user engaged. Don\'t be a pushover.\n- [Be proactive] Lead the conversation and do not be passive. Most times, engage users by ending with a question or suggested next step.\n\n## Response Guideline\n- [Overcome ASR errors] This is a real-time transcript, expect there to be errors. If you can guess what the user is trying to say,  then guess and respond. When you must ask for clarification, pretend that you heard the voice and be colloquial (use phrases like "didn\'t catch that", "some noise", "pardon", "you\'re coming through choppy", "static in your speech", "voice is cutting in and out"). Do not ever mention "transcription error", and don\'t repeat yourself.\n- [Always stick to your role] Think about what your role can and cannot do. If your role cannot do something, try to steer the conversation back to the goal of the conversation and to your role. Don\'t repeat yourself in doing this. You should still be creative, human-like, and lively.\n- [Create smooth conversation] Your response should both fit your role and fit into the live calling session to create a human-like conversation. You respond directly to what the user just said.\n\n## Role\n' +
          agentPrompt
        }]
        transcript_messages = self.convert_transcript_to_openai_messages(request['transcript'])
        for message in transcript_messages:
            prompt.append(message)

        if request['interaction_type'] == "reminder_required":
            prompt.append({
                "role": "user",
                "content": "(Now the user has not responded in a while, you would say:)",
            })
        return prompt

    # Step 1: Prepare the function calling definition to the prompt
    def prepare_functions(self):
        functions= [
            {
                "type": "function",
                "function": {
                    "name": "end_call",
                    "description": "End the call only when user explicitly requests it.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "message": {
                                "type": "string",
                                "description": "The message you will say before ending the call with the customer.",
                            },
                        },
                        "required": ["message"],
                    },
                },
            },
        ]
        return functions
    
    def draft_response(self, request):      
        prompt = self.prepare_prompt(request)
        func_call = {}
        func_arguments = ""
        stream = self.client.chat.completions.create(
            model="gpt-3.5-turbo-1106",
            messages=prompt,
            stream=True,
            # Step 2: Add the function into your request
            tools=self.prepare_functions()
        )
    
        for chunk in stream:
            # Step 3: Extract the functions
            if chunk.choices[0].delta.tool_calls:
                tool_calls = chunk.choices[0].delta.tool_calls[0]
                if tool_calls.id:
                    if func_call:
                        # Another function received, old function complete, can break here.
                        break
                    func_call = {
                        "id": tool_calls.id,
                        "func_name": tool_calls.function.name or "",
                        "arguments": {},
                    }
                else:
                    # append argument
                    func_arguments += tool_calls.function.arguments or ""
            
            # Parse transcripts
            if chunk.choices[0].delta.content:
                yield {
                    "response_id": request['response_id'],
                    "content": chunk.choices[0].delta.content,
                    "content_complete": False,
                    "end_call": False,
                }
        
        # Step 4: Call the functions
        if func_call:
            if func_call['func_name'] == "end_call":
                func_call['arguments'] = json.loads(func_arguments)
                yield {
                    "response_id": request['response_id'],
                    "content": func_call['arguments']['message'],
                    "content_complete": True,
                    "end_call": True,
                }
            # Step 5: Other functions here
        else:
            # No functions, complete response
            yield {
                "response_id": request['response_id'],
                "content": "",
                "content_complete": True,
                "end_call": False,
            }