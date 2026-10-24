from pydantic import BaseModel, Field


class RestockRequest(BaseModel):
    amount: int = Field(gt=0, le=10_000)
