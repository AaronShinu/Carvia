from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.
class User(AbstractUser):
    """
    - Custom user model, an extension to Django's default user model.
    - Log in with email instead of username. 
    - Includes student/graduate-specific fields and profiles
    """

    email = models.EmailField(unique=True)

    university = models.CharField(max_length=100, blank=True)
    university_course = models.CharField(max_length=100, blank=True)
    graduation_year = models.PositiveIntegerField(blank=True, null=True)

    email_reminders_toggle_enabled = models.BooleanField(default=True)

    USERNAME_FIELD = 'email' 
    REQUIRED_FIELDS = ['username'] 

    def __str__(self): 
        return self.email 