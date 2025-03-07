from fastapi.testclient import TestClient
from fairgig.main import app

client = TestClient(app)

def test_get_jobs():
    response = client.get("/jobs/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
