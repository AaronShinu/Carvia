from django.db import models
import uuid 
from django.conf import settings
from django.db import models

# Create your models here.
class ApplicationStatus(models.TextChoices):
    BOOKMARKED = 'bookmarked', 'Bookmarked'
    NOT_APPLIED = 'not_applied', 'Not Applied'
    APPLIED = 'applied', 'Applied'
    ONLINE_ASSESSMENT = 'online_assessment', 'Online Assessment'
    HIREVUE = 'hirevue', 'HireVue'
    INTERVIEW = 'interview', 'Interview'
    OFFER = 'offer', 'Offer'
    REJECTED = 'rejected', 'Rejected'
    WITHDRAWN = 'withdrawn', 'Withdrawn'
    ACCEPTED = 'accepted', 'Accepted'

class JobType(models.TextChoices):
    FULL_TIME = 'full_time', 'Full Time'
    PART_TIME = 'part_time', 'Part Time'
    INTERNSHIP = 'internship', 'Internship'
    GRADUATE_SCHEME = 'graduate_scheme', 'Graduate Scheme'

class Tag(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tags')
    name = models.CharField(max_length=100)
    colour = models.CharField(max_length=7, default='#6366F1') 

    class Meta:
        unique_together = ('user', 'name')
    
    def __str__(self):
        return self.name

class Application(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='applications')
    company_name = models.CharField(max_length=255)
    job_title = models.CharField(max_length=255)
    job_url = models.URLField(max_length=500, blank=True)
    job_location = models.CharField(max_length=255, blank=True)
    work_type = models.CharField(max_length=20, choices=JobType.choices, default=JobType.GRADUATE_SCHEME)
    job_status = models.CharField(max_length=20, choices=ApplicationStatus.choices, default=ApplicationStatus.NOT_APPLIED)
    min_salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    max_salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    application_deadline = models.DateField(null=True, blank=True)
    applied_date = models.DateField(null=True, blank=True)
    job_notes = models.TextField(blank=True)
    tags = models.ManyToManyField(Tag, related_name='applications', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"{self.company_name} @ {self.job_title}"

class InterviewStages(models.TextChoices):
    PHONE_SCREEN = 'phone_screen', 'Phone Screen'
    ONLINE_ASSESSMENT = 'online_assessment', 'Online Assessment'
    VIDEO_INTERVIEW = 'video_interview', 'Video Interview'
    ASSESSMENT_CENTRE = 'assessment_centre', 'Assessment Centre'
    TECHNICAL_INTERVIEW = 'technical_interview', 'Technical Interview'
    HR_INTERVIEW = 'hr_interview', 'HR Interview'
    FINAL_INTERVIEW = 'final_interview', 'Final Interview'
    OFFER_CALL = 'offer_call', 'Offer Call'
    OTHER = 'other', 'Other'

class InterviewStage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    application = models.ForeignKey(Application, on_delete=models.CASCADE, related_name='interview_stages')
    stage_phase = models.CharField(max_length=30, choices=InterviewStages.choices)
    scheduled_date = models.DateTimeField(null=True, blank=True)
    completed = models.BooleanField(default=False)
    passed = models.BooleanField(null=True, blank=True)

    link_or_location = models.CharField(max_length=500, blank=True)
    interviewer = models.CharField(max_length=255, blank=True)
    job_notes = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-scheduled_date']

    def __str__(self):
        return f"{self.application.company_name} - {self.get_stage_phase_display()}"