import json
import logging

from celery import shared_task
from django.conf import settings

from anthropic import Anthropic

from .models import FeedbackCV, FeedbackStatus
from .utils import TextExtractorError, extract_text_from_document

logger = logging.getLogger(__name__)

FEEDBACK_PROMPT = """You are an expert career coach reviewing a CV/resume for a university student or recent graduate applying to jobs.

Analyse the following CV text and respond with ONLY a valid JSON object (no other text, no markdown code fences) matching exactly this structure:

{{
    "overall_score": <integer 0-100>,
    "summary": "<2-3 sentence overall assessment>",
    "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
    "improvement_areas": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
    "keyword_suggestions": ["<keyword 1>", "<keyword 2>", "<keyword 3>", "<keyword 4>", "<keyword 5>"]
}}

Guidance:
- overall_score should reflect how strong the CV is for graduate-level job applications (clarity, impact, formatting cues inferred from structure, use of action verbs and quantified achievements)
- strengths and improvement_areas should be specific to THIS CV, not generic advice
- keyword_suggestions should be relevant technical/industry keywords this CV could add to pass applicant tracking systems, based on the candidate's experience and skills

CV Text:
---
{cv_text}
---
"""

@shared_task(bind=True, max_retries=1)
def generate_cv_feedback(self, feedback_id):
    """
    - Celery task used to generate feedback for a CV document using the Anthropic API.
    """
    try:
        feedback = FeedbackCV.objects.select_related('document').get(id=feedback_id)
    except FeedbackCV.DoesNotExist:
        logger.error(f"FeedbackCV with id {feedback_id} does not exist.")
        return

    feedback.feedback_status = FeedbackStatus.PROCESSING
    feedback.save(update_fields=['feedback_status'])

    try:
        cv_text = extract_text_from_document(feedback.document)

        if len(cv_text) > 12000:
            cv_text = cv_text[:12000]  

        client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)

        response = client.messages.create(
            model = "claude-sonnet-4-5",
            max_tokens = 1024,
            messages = [
                {
                    'role': 'user',
                    'content': FEEDBACK_PROMPT.format(cv_text=cv_text)
                }
            ],
        )

        raw_text = response.content[0].text.strip()
        if raw_text.startswith('```'):
            raw_text = raw_text.strip('`')
            if raw_text.startswith('json'):
                raw_text = raw_text[4:].strip()
        
        parsed = json.loads(raw_text)

        feedback.feedback_score = parsed.get('overall_score')
        feedback.feedback_summary = parsed.get('summary', '')
        feedback.cv_strengths = parsed.get('strengths', [])
        feedback.cv_improvement = parsed.get('improvement_areas', [])
        feedback.keyword_suggestions = parsed.get('keyword_suggestions', [])
        feedback.feedback_status = FeedbackStatus.COMPLETED
        feedback.save()
    
    except TextExtractorError as e:
        feedback.feedback_status = FeedbackStatus.FAILED
        feedback.error_message = str(e)
        feedback.save(update_fields=['feedback_status', 'error_message'])

    except json.JSONDecodeError as e:
        feedback.feedback_status = FeedbackStatus.FAILED
        feedback.error_message = f"JSON parsing error: {str(e)}"
        feedback.save(update_fields=['feedback_status', 'error_message'])

    except Exception as e:
        logger.exception(f"Error generating CV feedback for FeedbackCV id {feedback_id}: {str(e)}")
        feedback.feedback_status = FeedbackStatus.FAILED
        feedback.error_message = f"Unexpected error: {str(e)}"
        feedback.save(update_fields=['feedback_status', 'error_message'])