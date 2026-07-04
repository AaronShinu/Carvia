from django.urls import path
from .views import DashboardSummaryPage
app_name = 'analytics'

urlpatterns = [
    path('dashboard/', DashboardSummaryPage.as_view(), name='dashboard'),
]