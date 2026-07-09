from rest_framework.routers import DefaultRouter
from .views import ApplicationViewSet, InterviewStageViewSet, TagViewSet

app_name = "applications"

router = DefaultRouter()
router.register('interview-stages', InterviewStageViewSet, basename='interview-stage')
router.register('tags', TagViewSet, basename='tag')
router.register('', ApplicationViewSet, basename='application')

urlpatterns = router.urls