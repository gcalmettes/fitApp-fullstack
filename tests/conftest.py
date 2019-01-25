import pytest

from app_server import create_app
from config import TestingConfig


@pytest.fixture
def app():
    app = create_app(config=TestingConfig, clear_db=False)
    return app