from rest_framework.routers import DefaultRouter
from .views import CalendarEventViewSet

app_name = 'calendar_application'
router = DefaultRouter()
router.register('calendar_events', CalendarEventViewSet, basename='calendar-event')
urlpatterns = router.urls