from django.contrib.auth.tokens import PasswordResetTokenGenerator

class CarviaPasswordResetTokenGenerator(PasswordResetTokenGenerator):
    """
    Custom token generator for password reset functionality in the Carvia application.
    Inherits from Django's built-in PasswordResetTokenGenerator.
    """
    def _make_hash_value(self, user, timestamp):
        """
        Generates a hash value based on the user's primary key, password, and the timestamp.
        This ensures that the token is unique and secure.
        """
        return f"{user.pk}{timestamp}{user.password}"
    
password_reset_token_generator = CarviaPasswordResetTokenGenerator()