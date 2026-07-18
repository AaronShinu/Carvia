from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import LoginView, PasswordResetConfirmView, RegisterUserView, MeView, LogoutView
from .views import PasswordResetRequestView, PasswordResetConfirmView

app_name = 'accounts'

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('login/refresh/', TokenRefreshView.as_view(), name='login-refresh'),
    path('me/', MeView.as_view(), name='me'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password-reset'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
]