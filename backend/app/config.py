from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # --- Database ---
    DATABASE_URL: str

    # --- Security ---
    SECRET_KEY: str

    # --- Application URLs ---
    FRONTEND_URL: str
    BACKEND_URL: str

    # --- Mail Settings ---
    # These are required for the SendGrid API
    MAIL_PASSWORD: str
    MAIL_FROM: str
    ADMIN_EMAIL: str
    
    # These are now optional as they were for the old SMTP method
    MAIL_USERNAME: Optional[str] = None
    MAIL_PORT: Optional[int] = None
    MAIL_SERVER: Optional[str] = None
    MAIL_STARTTLS: Optional[bool] = None
    MAIL_SSL_TLS: Optional[bool] = None


    # --- Google OAuth ---
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str


    class Config:
        env_file = ".env"

settings = Settings()
