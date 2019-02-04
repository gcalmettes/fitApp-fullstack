from app_server import create_app
from config import DevelopmentConfig

app = create_app(config=DevelopmentConfig)
      
