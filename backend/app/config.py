from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Server Config
    host: str = "0.0.0.0"
    port: int = 8000
    cors_origins: str = "http://localhost:5173,http://localhost:3000"
    
    # Database Config
    db_path: str = "./data/health.db"
    backup_path: str = "./backups"
    backup_interval_minutes: int = 60
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Convert comma-separated CORS origins to a list"""
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
