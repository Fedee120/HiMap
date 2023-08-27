from fastapi import FastAPI
from sentence_transformers import SentenceTransformer
from pydantic import BaseModel

app = FastAPI()

model = SentenceTransformer('multi-qa-MiniLM-L6-cos-v1')
print("Model loaded")

class Item(BaseModel):
    text: str

@app.post("/embeddings/")
async def get_embeddings(item: Item):
    embedding = model.encode(item.text)
    return {"embedding": embedding.tolist()}
