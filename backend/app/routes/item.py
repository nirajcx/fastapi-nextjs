from fastapi import APIRouter
from app.schemas.item import Item

router = APIRouter()

@router.post("/api/items")
def create_item(item: Item):
    return {"message": "Item created successfully", "item": item}
