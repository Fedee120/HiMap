from fastapi import FastAPI
from pydantic import BaseModel
import json

app = FastAPI()

# Load data from JSON file once at the start
with open("sentence_data.json", 'r', encoding='utf-8') as json_file:
    sentence_data = json.load(json_file)

print("Data loaded")

class SentenceRequest(BaseModel):
    ids: list[int]

class SentenceResponse(BaseModel):
    sentences: list[str]


def retrieve_sentences_from_ids(ids: list[int]) -> list[str]:
    # Filter sentences with the given IDs using the preloaded data
    retrieved_sentences = [record['sentence'] for record in sentence_data if record['id'] in ids]
    return retrieved_sentences

@app.post("/retrieve/", response_model=SentenceResponse)
async def retrieve_sentences(request: SentenceRequest):
    sentences = retrieve_sentences_from_ids(request.ids)
    return {"sentences": sentences}
