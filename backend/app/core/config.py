# FILE: backend/app/core/config.py
# PURPOSE: Global configuration and environment settings for the Pravah backend application.
# PHASE: 1 | DEPENDS ON: pydantic_settings | LAST TOUCHED: Phase 1

import os
from typing import List
from pydantic import ConfigDict
from pydantic_settings import BaseSettings


# Defines core application configuration parameters and CORS policies.
# Reads from environment variables with sensible local defaults.
class Settings(BaseSettings):
    model_config = ConfigDict(case_sensitive=True)

    PROJECT_NAME: str = "Pravah (प्रवाह) - Career & Skill Intelligence Platform"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*",
    ]
    DATA_DIR: str = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data"
    )


# Instantiates singleton configuration instance.
# Exported across all modules for unified configuration access.
settings = Settings()
