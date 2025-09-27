from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # --- Database ---
    DATABASE_URL: str

    # --- Security ---
    SECRET_KEY: str

    # --- Application URLs ---
    FRONTEND_URL: str
    BACKEND_URL: str

    # --- Mail Settings ---
    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_FROM: str
    MAIL_PORT: int
    MAIL_SERVER: str
    MAIL_STARTTLS: bool
    MAIL_SSL_TLS: bool
    ADMIN_EMAIL: str

    # --- Google OAuth ---
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str


    class Config:
        env_file = ".env"

settings = Settings()